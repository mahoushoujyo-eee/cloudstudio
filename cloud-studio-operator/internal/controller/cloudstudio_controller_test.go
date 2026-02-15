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

	appsv1 "k8s.io/api/apps/v1"
	coreV1 "k8s.io/api/core/v1"

	. "github.com/onsi/ginkgo/v2"
	. "github.com/onsi/gomega"
	"k8s.io/apimachinery/pkg/api/errors"
	"k8s.io/apimachinery/pkg/types"
	"sigs.k8s.io/controller-runtime/pkg/reconcile"

	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"

	cloudstudiov1alpha1 "github.com/example/cloud-studio-operator/api/v1alpha1"
)

var _ = Describe("CloudStudio Controller", func() {
	Context("When reconciling a resource", func() {
		const resourceName = "test-resource"

		ctx := context.Background()

		typeNamespacedName := types.NamespacedName{
			Name:      resourceName,
			Namespace: "default", // TODO(user):Modify as needed
		}
		cloudstudio := &cloudstudiov1alpha1.CloudStudio{}

		BeforeEach(func() {
			By("creating the custom resource for the Kind CloudStudio")
			err := k8sClient.Get(ctx, typeNamespacedName, cloudstudio)
			if err != nil && errors.IsNotFound(err) {
				resource := &cloudstudiov1alpha1.CloudStudio{
					ObjectMeta: metav1.ObjectMeta{
						Name:      resourceName,
						Namespace: "default",
					},
					Spec: cloudstudiov1alpha1.CloudStudioSpec{
						CodeServerImage:  "codercom/code-server:latest",
						HeartbeatImage:   "busybox:latest",
						UserID:           "test-user-123",
						StorageClassName: "local-storage",
						StorageSize:      "10Gi",
						Status:           "running",
					},
				}

				Expect(k8sClient.Create(ctx, resource)).To(Succeed())
			}
		})

		AfterEach(func() {
			// TODO(user): Cleanup logic after each test, like removing the resource instance.
			resource := &cloudstudiov1alpha1.CloudStudio{}
			err := k8sClient.Get(ctx, typeNamespacedName, resource)
			Expect(err).NotTo(HaveOccurred())

			By("Cleanup the specific resource instance CloudStudio")
			Expect(k8sClient.Delete(ctx, resource)).To(Succeed())
		})
		It("should successfully reconcile the resource", func() {
			By("Reconciling the created resource")
			controllerReconciler := &CloudStudioReconciler{
				Client: k8sClient,
				Scheme: k8sClient.Scheme(),
			}

			_, err := controllerReconciler.Reconcile(ctx, reconcile.Request{
				NamespacedName: typeNamespacedName,
			})
			Expect(err).NotTo(HaveOccurred())

			// Verify that Deployment was created
			deployment := &appsv1.Deployment{}
			err = k8sClient.Get(ctx, typeNamespacedName, deployment)
			Expect(err).NotTo(HaveOccurred())
			Expect(deployment.Spec.Replicas).NotTo(BeNil())
			Expect(*deployment.Spec.Replicas).To(Equal(int32(1)))

			// Verify that PVC was created
			pvc := &coreV1.PersistentVolumeClaim{}
			err = k8sClient.Get(ctx, typeNamespacedName, pvc)
			Expect(err).NotTo(HaveOccurred())
			Expect(pvc.Spec.Resources.Requests["storage"]).NotTo(BeNil())

			// Test pause functionality
			cloudstudio.Spec.Status = "paused"
			Expect(k8sClient.Update(ctx, cloudstudio)).To(Succeed())

			_, err = controllerReconciler.Reconcile(ctx, reconcile.Request{
				NamespacedName: typeNamespacedName,
			})
			Expect(err).NotTo(HaveOccurred())

			// Verify that Deployment was paused
			err = k8sClient.Get(ctx, typeNamespacedName, deployment)
			Expect(err).NotTo(HaveOccurred())
			Expect(*deployment.Spec.Replicas).To(Equal(int32(0)))

			// Test resume functionality
			cloudstudio.Spec.Status = "running"
			Expect(k8sClient.Update(ctx, cloudstudio)).To(Succeed())

			_, err = controllerReconciler.Reconcile(ctx, reconcile.Request{
				NamespacedName: typeNamespacedName,
			})
			Expect(err).NotTo(HaveOccurred())

			// Verify that Deployment was resumed
			err = k8sClient.Get(ctx, typeNamespacedName, deployment)
			Expect(err).NotTo(HaveOccurred())
			Expect(*deployment.Spec.Replicas).To(Equal(int32(1)))
		})
	})
})
