/*
Copyright 2025.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

package controller

import (
	"context"
	"fmt"
	"net/url"
	"time"

	appsv1 "k8s.io/api/apps/v1"
	coreV1 "k8s.io/api/core/v1"
	storagev1 "k8s.io/api/storage/v1"
	"k8s.io/apimachinery/pkg/api/errors"
	"k8s.io/apimachinery/pkg/api/resource"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/runtime"
	"k8s.io/apimachinery/pkg/types"
	"k8s.io/apimachinery/pkg/util/intstr"
	"k8s.io/client-go/util/retry"
	ctrl "sigs.k8s.io/controller-runtime"
	"sigs.k8s.io/controller-runtime/pkg/client"
	logf "sigs.k8s.io/controller-runtime/pkg/log"

	cloudstudiov1alpha1 "github.com/example/cloud-studio-operator/api/v1alpha1"
	gatewayv1 "sigs.k8s.io/gateway-api/apis/v1"
)

// finalizerName is the name of the finalizer used for CloudStudio
const finalizerName = "cloudstudio.finalizers.cloud-studio.example.com"

// CloudStudioReconciler reconciles a CloudStudio object
type CloudStudioReconciler struct {
	client.Client
	Scheme *runtime.Scheme
}

// +kubebuilder:rbac:groups=cloud-studio.example.com,resources=cloudstudios,verbs=get;list;watch;create;update;patch;delete
// +kubebuilder:rbac:groups=cloud-studio.example.com,resources=cloudstudios/status,verbs=get;update;patch
// +kubebuilder:rbac:groups=cloud-studio.example.com,resources=cloudstudios/finalizers,verbs=update

// Reconcile is part of the main kubernetes reconciliation loop which aims to
// move the current state of the cluster closer to the desired state.
// TODO(user): Modify the Reconcile function to compare the state specified by
// the CloudStudio object against the actual cluster state, and then
// perform operations to make the cluster state reflect the state specified by
// the user.
//
// For more details, check Reconcile and its Result here:
// - https://pkg.go.dev/sigs.k8s.io/controller-runtime@v0.21.0/pkg/reconcile
func (r *CloudStudioReconciler) Reconcile(ctx context.Context, req ctrl.Request) (ctrl.Result, error) {
	log := logf.FromContext(ctx)

	// Fetch the CloudStudio instance
	cloudStudio := &cloudstudiov1alpha1.CloudStudio{}
	err := r.Get(ctx, req.NamespacedName, cloudStudio)
	if err != nil {
		if errors.IsNotFound(err) {
			// Request object not found, could have been deleted after reconcile request.
			// Owned objects are automatically garbage collected. For additional cleanup logic use finalizers.
			// Return and don't requeue
			log.Info("CloudStudio resource not found. Ignoring since object must be deleted")
			return ctrl.Result{}, nil
		}
		// Error reading the object - requeue the request.
		log.Error(err, "Failed to get CloudStudio")
		return ctrl.Result{}, err
	}

	// Check if the CloudStudio instance is marked for deletion
	if cloudStudio.DeletionTimestamp != nil {
		if contains(cloudStudio.ObjectMeta.Finalizers, finalizerName) {
			// Run finalization logic
			if err := r.finalizeCloudStudio(ctx, cloudStudio); err != nil {
				return ctrl.Result{}, err
			}

			// Remove finalizer from the list and update it
			cloudStudio.ObjectMeta.Finalizers = remove(cloudStudio.ObjectMeta.Finalizers, finalizerName)
			if err := r.Update(ctx, cloudStudio); err != nil {
				return ctrl.Result{}, err
			}
		}
		// Stop reconciliation as the item is being deleted
		return ctrl.Result{}, nil
	}

	// Add finalizer for this CR
	if !contains(cloudStudio.ObjectMeta.Finalizers, finalizerName) {
		cloudStudio.ObjectMeta.Finalizers = append(cloudStudio.ObjectMeta.Finalizers, finalizerName)
		if err := r.Update(ctx, cloudStudio); err != nil {
			return ctrl.Result{}, err
		}
		// Requeue after finalizer is added
		return ctrl.Result{Requeue: true}, nil
	}

	// Check if the StorageClass exists
	storageClass := &storagev1.StorageClass{}
	err = r.Get(ctx, types.NamespacedName{Name: cloudStudio.Spec.StorageClassName, Namespace: ""}, storageClass)
	if err != nil && errors.IsNotFound(err) {
		err = fmt.Errorf("StorageClass '%s' not found", cloudStudio.Spec.StorageClassName)
		log.Error(nil, "StorageClass not found", "StorageClass", cloudStudio.Spec.StorageClassName)
		return ctrl.Result{}, err
	} else if err != nil {
		log.Error(err, "Failed to get StorageClass")
		return ctrl.Result{}, err
	}

	// Check if the UserID is provided
	if cloudStudio.Spec.UserID == "" {
		log.Error(nil, "UserID is required in CloudStudioSpec")
		return ctrl.Result{}, nil
	}

	// Check if the namespace exists for the user, if not create it
	namespace := &coreV1.Namespace{}
	namespaceName := "cloud-studio-" + cloudStudio.Spec.UserID
	err = r.Get(ctx, types.NamespacedName{Name: namespaceName}, namespace)
	if err != nil && errors.IsNotFound(err) {
		// Define a new namespace
		namespace = &coreV1.Namespace{
			ObjectMeta: metav1.ObjectMeta{
				Name: namespaceName,
				Labels: map[string]string{
					"cloud-studio-user": cloudStudio.Spec.UserID,
				},
			},
		}
		log.Info("Creating a new namespace for user", "Namespace.Name", namespaceName, "UserID", cloudStudio.Spec.UserID)
		err = r.Create(ctx, namespace)
		if err != nil {
			log.Error(err, "Failed to create new namespace", "Namespace.Name", namespaceName)
			return ctrl.Result{}, err
		}
		// Namespace created successfully - return and requeue
		return ctrl.Result{RequeueAfter: 5 * time.Second}, nil
	} else if err != nil {
		log.Error(err, "Failed to get namespace")
		return ctrl.Result{}, err
	}

	// Check if the PVC already exists, if not create it
	pvc := &coreV1.PersistentVolumeClaim{}
	err = r.Get(ctx, types.NamespacedName{Name: cloudStudio.Name, Namespace: namespaceName}, pvc)
	if err != nil && errors.IsNotFound(err) {
		// Define a new PVC
		pvc = r.pvcForCloudStudio(cloudStudio, namespaceName)
		log.Info("Creating a new PVC", "PVC.Namespace", pvc.Namespace, "PVC.Name", pvc.Name)
		err = r.Create(ctx, pvc)
		if err != nil {
			log.Error(err, "Failed to create new PVC", "PVC.Namespace", pvc.Namespace, "PVC.Name", pvc.Name)
			return ctrl.Result{}, err
		}
		// PVC created successfully - return and requeue
		// We'll requeue after a short delay to ensure the PVC is bound
		return ctrl.Result{RequeueAfter: 10 * time.Second}, nil
	} else if err != nil {
		log.Error(err, "Failed to get PVC")
		return ctrl.Result{}, err
	}

	// Check if the Deployment already exists, if not create it
	deployment := &appsv1.Deployment{}
	err = r.Get(ctx, types.NamespacedName{Name: cloudStudio.Name, Namespace: namespaceName}, deployment)
	if err != nil && errors.IsNotFound(err) {
		// Define a new Deployment
		deployment = r.deploymentForCloudStudio(cloudStudio, namespaceName)
		log.Info("Creating a new Deployment", "Deployment.Namespace", deployment.Namespace, "Deployment.Name", deployment.Name)
		err = r.Create(ctx, deployment)
		if err != nil {
			log.Error(err, "Failed to create new Deployment", "Deployment.Namespace", deployment.Namespace, "Deployment.Name", deployment.Name)
			return ctrl.Result{}, err
		}
		// Deployment created successfully - return and requeue
		return ctrl.Result{Requeue: true}, nil
	} else if err != nil {
		log.Error(err, "Failed to get Deployment")
		return ctrl.Result{}, err
	}

	// Check if the Service already exists, if not create it
	service := &coreV1.Service{}
	err = r.Get(ctx, types.NamespacedName{Name: cloudStudio.Name, Namespace: namespaceName}, service)
	if err != nil && errors.IsNotFound(err) {
		// Define a new Service
		service = r.serviceForCloudStudio(cloudStudio, namespaceName)
		log.Info("Creating a new Service", "Service.Namespace", service.Namespace, "Service.Name", service.Name)
		err = r.Create(ctx, service)
		if err != nil {
			log.Error(err, "Failed to create new Service", "Service.Namespace", service.Namespace, "Service.Name", service.Name)
			return ctrl.Result{}, err
		}
		// Service created successfully - return and requeue
		return ctrl.Result{Requeue: true}, nil
	} else if err != nil {
		log.Error(err, "Failed to get Service")
		return ctrl.Result{}, err
	}

	// Check if the HTTPRoute already exists, if not create it
	httpRoute := &gatewayv1.HTTPRoute{}
	err = r.Get(ctx, types.NamespacedName{Name: cloudStudio.Name, Namespace: namespaceName}, httpRoute)
	if err != nil && errors.IsNotFound(err) {
		// Define a new HTTPRoute
		httpRoute = r.httpRouteForCloudStudio(cloudStudio, namespaceName)
		log.Info("Creating a new HTTPRoute", "HTTPRoute.Namespace", httpRoute.Namespace, "HTTPRoute.Name", httpRoute.Name)
		err = r.Create(ctx, httpRoute)
		if err != nil {
			log.Error(err, "Failed to create new HTTPRoute", "HTTPRoute.Namespace", httpRoute.Namespace, "HTTPRoute.Name", httpRoute.Name)
			// If HTTPRoute creation fails, requeue after a delay
			return ctrl.Result{RequeueAfter: 10 * time.Second}, nil
		}
		// HTTPRoute created successfully - return and requeue
		return ctrl.Result{Requeue: true}, nil
	} else if err != nil {
		log.Error(err, "Failed to get HTTPRoute")
		return ctrl.Result{}, err
	}

	// Update Deployment replicas based on status
	if cloudStudio.Spec.Status == "paused" {
		if deployment.Spec.Replicas == nil || *deployment.Spec.Replicas != 0 {
			retryErr := retry.RetryOnConflict(retry.DefaultRetry, func() error {
				// Get the latest version of the Deployment
				currentDeployment := &appsv1.Deployment{}
				if err := r.Get(ctx, types.NamespacedName{Name: cloudStudio.Name, Namespace: namespaceName}, currentDeployment); err != nil {
					return err
				}

				// Update replicas to 0
				zero := int32(0)
				currentDeployment.Spec.Replicas = &zero

				// Update the Deployment
				return r.Update(ctx, currentDeployment)
			})
			if retryErr != nil {
				log.Error(retryErr, "Failed to pause Deployment after retries", "Deployment.Namespace", namespaceName, "Deployment.Name", cloudStudio.Name)
				return ctrl.Result{RequeueAfter: 5 * time.Second}, retryErr
			}
			log.Info("Deployment paused", "Deployment.Namespace", namespaceName, "Deployment.Name", cloudStudio.Name)
		}
	} else if cloudStudio.Spec.Status == "running" {
		if deployment.Spec.Replicas == nil || *deployment.Spec.Replicas == 0 {
			retryErr := retry.RetryOnConflict(retry.DefaultRetry, func() error {
				// Get the latest version of the Deployment
				currentDeployment := &appsv1.Deployment{}
				if err := r.Get(ctx, types.NamespacedName{Name: cloudStudio.Name, Namespace: namespaceName}, currentDeployment); err != nil {
					return err
				}

				// Update replicas to 1
				one := int32(1)
				currentDeployment.Spec.Replicas = &one

				// Update the Deployment
				return r.Update(ctx, currentDeployment)
			})
			if retryErr != nil {
				log.Error(retryErr, "Failed to resume Deployment after retries", "Deployment.Namespace", namespaceName, "Deployment.Name", cloudStudio.Name)
				return ctrl.Result{RequeueAfter: 5 * time.Second}, retryErr
			}
			log.Info("Deployment resumed", "Deployment.Namespace", namespaceName, "Deployment.Name", cloudStudio.Name)
		}
	}

	// Update CloudStudio status
	// TODO: Add status update logic

	return ctrl.Result{}, nil
}

// pvcForCloudStudio returns a PVC object
func (r *CloudStudioReconciler) pvcForCloudStudio(cs *cloudstudiov1alpha1.CloudStudio, namespace string) *coreV1.PersistentVolumeClaim {
	pvc := &coreV1.PersistentVolumeClaim{
		ObjectMeta: metav1.ObjectMeta{
			Name:      cs.Name,
			Namespace: namespace,
		},
		Spec: coreV1.PersistentVolumeClaimSpec{
			AccessModes: []coreV1.PersistentVolumeAccessMode{
				coreV1.ReadWriteOnce,
			},
			Resources: coreV1.VolumeResourceRequirements{
				Requests: coreV1.ResourceList{
					"storage": resource.MustParse(cs.Spec.StorageSize),
				},
			},
			StorageClassName: &cs.Spec.StorageClassName,
		},
	}

	// Set CloudStudio instance as the owner and controller
	ctrl.SetControllerReference(cs, pvc, r.Scheme)
	return pvc
}

// Helper functions for finalizer handling
func contains(slice []string, item string) bool {
	for _, s := range slice {
		if s == item {
			return true
		}
	}
	return false
}

func remove(slice []string, item string) []string {
	result := []string{}
	for _, s := range slice {
		if s != item {
			result = append(result, s)
		}
	}
	return result
}

// finalizeCloudStudio will clean up resources owned by CloudStudio before deletion
func (r *CloudStudioReconciler) finalizeCloudStudio(ctx context.Context, cs *cloudstudiov1alpha1.CloudStudio) error {
	log := logf.FromContext(ctx)
	log.Info("Finalizing CloudStudio", "Name", cs.Name)

	// Get the namespace name
	namespaceName := "cloud-studio-" + cs.Spec.UserID

	// Delete HTTPRoute if it exists
	httpRoute := &gatewayv1.HTTPRoute{}
	err := r.Get(ctx, types.NamespacedName{Name: cs.Name, Namespace: namespaceName}, httpRoute)
	if err == nil {
		log.Info("Deleting HTTPRoute", "Name", httpRoute.Name, "Namespace", httpRoute.Namespace)
		if err := r.Delete(ctx, httpRoute); err != nil {
			log.Error(err, "Failed to delete HTTPRoute", "Name", httpRoute.Name, "Namespace", httpRoute.Namespace)
			return err
		}
	} else if !errors.IsNotFound(err) {
		log.Error(err, "Failed to get HTTPRoute for deletion", "Name", cs.Name, "Namespace", namespaceName)
		return err
	}

	// Delete Service if it exists
	service := &coreV1.Service{}
	err = r.Get(ctx, types.NamespacedName{Name: cs.Name, Namespace: namespaceName}, service)
	if err == nil {
		log.Info("Deleting Service", "Name", service.Name, "Namespace", service.Namespace)
		if err := r.Delete(ctx, service); err != nil {
			log.Error(err, "Failed to delete Service", "Name", service.Name, "Namespace", service.Namespace)
			return err
		}
	} else if !errors.IsNotFound(err) {
		log.Error(err, "Failed to get Service for deletion", "Name", cs.Name, "Namespace", namespaceName)
		return err
	}

	// Delete Deployment if it exists
	deployment := &appsv1.Deployment{}
	err = r.Get(ctx, types.NamespacedName{Name: cs.Name, Namespace: namespaceName}, deployment)
	if err == nil {
		log.Info("Deleting Deployment", "Name", deployment.Name, "Namespace", deployment.Namespace)
		if err := r.Delete(ctx, deployment); err != nil {
			log.Error(err, "Failed to delete Deployment", "Name", deployment.Name, "Namespace", deployment.Namespace)
			return err
		}
	} else if !errors.IsNotFound(err) {
		log.Error(err, "Failed to get Deployment for deletion", "Name", cs.Name, "Namespace", namespaceName)
		return err
	}

	// Delete PVC if it exists
	pvc := &coreV1.PersistentVolumeClaim{}
	err = r.Get(ctx, types.NamespacedName{Name: cs.Name, Namespace: namespaceName}, pvc)
	if err == nil {
		log.Info("Deleting PVC", "Name", pvc.Name, "Namespace", pvc.Namespace)
		if err := r.Delete(ctx, pvc); err != nil {
			log.Error(err, "Failed to delete PVC", "Name", pvc.Name, "Namespace", pvc.Namespace)
			return err
		}
	} else if !errors.IsNotFound(err) {
		log.Error(err, "Failed to get PVC for deletion", "Name", cs.Name, "Namespace", namespaceName)
		return err
	}

	log.Info("CloudStudio finalized successfully", "Name", cs.Name)
	return nil
}

// deploymentForCloudStudio returns a Deployment object
func (r *CloudStudioReconciler) deploymentForCloudStudio(cs *cloudstudiov1alpha1.CloudStudio, namespace string) *appsv1.Deployment {
	replicas := int32(1)

	deployment := &appsv1.Deployment{
		ObjectMeta: metav1.ObjectMeta{
			Name:      cs.Name,
			Namespace: namespace,
			Labels: map[string]string{
				"cloud-studio-user":    cs.Spec.UserID,
				"cloud-studio-instance": cs.Spec.InstanceID,
			},
		},
		Spec: appsv1.DeploymentSpec{
			Replicas: &replicas,
			Selector: &metav1.LabelSelector{
				MatchLabels: map[string]string{
					"app": "cloud-studio",
				},
			},
			Template: coreV1.PodTemplateSpec{
				ObjectMeta: metav1.ObjectMeta{
					Labels: map[string]string{
						"app": "cloud-studio",
					},
				},
				Spec: coreV1.PodSpec{
					Containers: []coreV1.Container{
						// Create code-server container with optional resource limits
						(func() coreV1.Container {
							codeServerContainer := coreV1.Container{
								Name:  "code-server",
								Image: cs.Spec.CodeServerImage,
								Ports: []coreV1.ContainerPort{
									{
										ContainerPort: 8080,
										Name:          "http",
									},
								},
								VolumeMounts: []coreV1.VolumeMount{
									{
										Name:      "workspace",
										MountPath: "/home/coder/project",
									},
								},
							}

							// Set password environment variable if provided
							if cs.Spec.Password != "" {
								codeServerContainer.Env = []coreV1.EnvVar{
									{
										Name:  "PASSWORD",
										Value: cs.Spec.Password,
									},
								}
							}

							// Set resource limits and requests if provided
							if cs.Spec.CPULimit != "" || cs.Spec.MemoryLimit != "" || cs.Spec.CPURequest != "" || cs.Spec.MemoryRequest != "" {
								codeServerContainer.Resources = coreV1.ResourceRequirements{}
								if cs.Spec.CPULimit != "" || cs.Spec.MemoryLimit != "" {
									codeServerContainer.Resources.Limits = coreV1.ResourceList{}
									if cs.Spec.CPULimit != "" {
										codeServerContainer.Resources.Limits[coreV1.ResourceCPU] = resource.MustParse(cs.Spec.CPULimit)
									}
									if cs.Spec.MemoryLimit != "" {
										codeServerContainer.Resources.Limits[coreV1.ResourceMemory] = resource.MustParse(cs.Spec.MemoryLimit)
									}
								}
								if cs.Spec.CPURequest != "" || cs.Spec.MemoryRequest != "" {
									codeServerContainer.Resources.Requests = coreV1.ResourceList{}
									if cs.Spec.CPURequest != "" {
										codeServerContainer.Resources.Requests[coreV1.ResourceCPU] = resource.MustParse(cs.Spec.CPURequest)
									}
									if cs.Spec.MemoryRequest != "" {
										codeServerContainer.Resources.Requests[coreV1.ResourceMemory] = resource.MustParse(cs.Spec.MemoryRequest)
									}
								}
							}
							return codeServerContainer
						})(),
						// Create heartbeat container with health check command
						{
							Name:  "heartbeat",
							Image: cs.Spec.HeartbeatImage,
							Command: []string{
									"sh",
									"-c",
									"while true; do\n" +
										"  current_time=$(date -u +\"%Y-%m-%dT%H:%M:%SZ\")\n" +
										"  curl --location \"${HEARTBEAT_URL}\" \\\n" +
										"    --header 'Content-Type: application/json' \\\n" +
										"    --data '{\n" +
										"      \"user_id\": \"${USER_ID}\",\n" +
										"      \"instance_id\": \"${INSTANCE_ID}\",\n" +
										"      \"record_id\": 0,\n" +
										"      \"creator_id\": \"${USER_ID}\",\n" +
										"      \"start_time\": \"${START_TIME}\",\n" +
										"      \"current_time\": \"${current_time}\"\n" +
										"    }'\n" +
										"  sleep 60\n" +
										"done",
								},
							Env: []coreV1.EnvVar{
								{
									Name:  "HEARTBEAT_URL",
									Value: cs.Spec.HeartCollector,
								},
								{
									Name:  "INSTANCE_ID",
									Value: cs.Spec.InstanceID,
								},
								{
									Name:  "USER_ID",
									Value: cs.Spec.UserID,
								},
								{
									Name:  "START_TIME",
									Value: time.Now().Format(time.RFC3339),
								},
							},
						},
					},
					Volumes: []coreV1.Volume{
						{
							Name: "workspace",
							VolumeSource: coreV1.VolumeSource{
								PersistentVolumeClaim: &coreV1.PersistentVolumeClaimVolumeSource{
									ClaimName: cs.Name,
								},
							},
						},
					},
				},
			},
		},
	}

	// Set CloudStudio instance as the owner and controller
	ctrl.SetControllerReference(cs, deployment, r.Scheme)
	return deployment
}

// serviceForCloudStudio returns a Service object for exposing the CloudStudio instance
func (r *CloudStudioReconciler) serviceForCloudStudio(cs *cloudstudiov1alpha1.CloudStudio, namespace string) *coreV1.Service {
	service := &coreV1.Service{
		ObjectMeta: metav1.ObjectMeta{
			Name:      cs.Name,
			Namespace: namespace,
			Labels: map[string]string{
				"app":                 "cloud-studio",
				"cloud-studio-user":   cs.Spec.UserID,
				"cloud-studio-instance": cs.Spec.InstanceID,
			},
		},
		Spec: coreV1.ServiceSpec{
			Type: coreV1.ServiceTypeClusterIP,
			Ports: []coreV1.ServicePort{
				{
					Name:       "http",
					Port:       8080,
					TargetPort: intstr.FromInt(8080),
					Protocol:   coreV1.ProtocolTCP,
				},
			},
			Selector: map[string]string{
				"app": "cloud-studio",
			},
		},
	}

	// Set CloudStudio instance as the owner and controller
	ctrl.SetControllerReference(cs, service, r.Scheme)
	return service
}

// httpRouteForCloudStudio returns an HTTPRoute object for routing external traffic to the Service
func (r *CloudStudioReconciler) httpRouteForCloudStudio(cs *cloudstudiov1alpha1.CloudStudio, namespace string) *gatewayv1.HTTPRoute {
	// Parse the URL to extract hostname
	parsedURL, err := url.Parse(cs.Spec.URL)
	if err != nil {
		// If URL parsing fails, use the URL as-is
		parsedURL = &url.URL{Host: cs.Spec.URL}
	}

	// Extract hostname
	hostname := parsedURL.Hostname()
	if hostname == "" {
		hostname = cs.Spec.URL
	}

	// Prepare Gateway reference from GatewayRef struct
	gatewayName := gatewayv1.ObjectName(cs.Spec.Gateway.Name)
	var gatewayNamespace *gatewayv1.Namespace

	// If Gateway namespace is specified, use it; otherwise, use the same namespace as CloudStudio
	if cs.Spec.Gateway.Namespace != "" {
		ns := gatewayv1.Namespace(cs.Spec.Gateway.Namespace)
		gatewayNamespace = &ns
	}

	// Define constants for pointer references
	gatewayKind := gatewayv1.Kind("Gateway")
	serviceKind := gatewayv1.Kind("Service")
	portNumber := gatewayv1.PortNumber(8080)
	serviceNamespace := gatewayv1.Namespace(namespace)

	// Create HTTPRoute
	httpRoute := &gatewayv1.HTTPRoute{
		ObjectMeta: metav1.ObjectMeta{
			Name:      cs.Name,
			Namespace: namespace,
			Labels: map[string]string{
				"app":                 "cloud-studio",
				"cloud-studio-user":   cs.Spec.UserID,
				"cloud-studio-instance": cs.Spec.InstanceID,
			},
		},
		Spec: gatewayv1.HTTPRouteSpec{
			CommonRouteSpec: gatewayv1.CommonRouteSpec{
				ParentRefs: []gatewayv1.ParentReference{
					{
						Group:     (*gatewayv1.Group)(&gatewayv1.GroupVersion.Group),
						Kind:      (*gatewayv1.Kind)(&gatewayKind),
						Name:      gatewayName,
						Namespace: gatewayNamespace,
					},
				},
			},
			Hostnames: []gatewayv1.Hostname{
				gatewayv1.Hostname(hostname),
			},
			Rules: []gatewayv1.HTTPRouteRule{
				{
					BackendRefs: []gatewayv1.HTTPBackendRef{
						{
							BackendRef: gatewayv1.BackendRef{
								BackendObjectReference: gatewayv1.BackendObjectReference{
									Kind:      (*gatewayv1.Kind)(&serviceKind),
									Name:      gatewayv1.ObjectName(cs.Name),
									Namespace: &serviceNamespace,
									Port:      (*gatewayv1.PortNumber)(&portNumber),
								},
							},
						},
					},
				},
			},
		},
	}

	// Set CloudStudio instance as the owner and controller
	ctrl.SetControllerReference(cs, httpRoute, r.Scheme)
	return httpRoute
}
// 	// Simple parser for "namespace/name" format
// 	for i := 0; i < len(ref); i++ {
// 		if ref[i] == '/' {
// 			return []string{ref[:i], ref[i+1:]}
// 		}
// 	}
// 	return []string{ref}
// }

// SetupWithManager sets up the controller with the Manager.
func (r *CloudStudioReconciler) SetupWithManager(mgr ctrl.Manager) error {
	return ctrl.NewControllerManagedBy(mgr).
		For(&cloudstudiov1alpha1.CloudStudio{}).
		Named("cloudstudio").
		Complete(r)
}
