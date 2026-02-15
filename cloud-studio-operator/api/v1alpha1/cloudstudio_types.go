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

package v1alpha1

import (
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

// GatewayRef is a reference to a Gateway
type GatewayRef struct {
	// Name is the name of the Gateway
	Name string `json:"name,omitempty"`
	// Namespace is the namespace of the Gateway. If empty, uses the same namespace as the CloudStudio
	Namespace string `json:"namespace,omitempty"`
}

// EDIT THIS FILE!  THIS IS SCAFFOLDING FOR YOU TO OWN!
// NOTE: json tags are required.  Any new fields you add must have json tags for the fields to be serialized.

// CloudStudioSpec defines the desired state of CloudStudio.
type CloudStudioSpec struct {
	// INSERT ADDITIONAL SPEC FIELDS - desired state of cluster
	// Important: Run "make" to regenerate code after modifying this file

	// CodeServerImage is the image of code-server
	CodeServerImage string `json:"codeServerImage,omitempty"`
	// HeartbeatImage is the image of heartbeat container
	HeartbeatImage string `json:"heartbeatImage,omitempty"`
	// HeartCollector is the URL of the heartbeat collector service
	HeartCollector string `json:"heartCollector,omitempty"`
	// UserID is the unique identifier of the user
	UserID string `json:"userId,omitempty"`
	// InstanceID is the unique identifier of the instance
	InstanceID string `json:"instanceId,omitempty"`
	// URL is the URL of the instance
	URL string `json:"url,omitempty"`
	// Gateway is the gateway configuration
	Gateway *GatewayRef `json:"gateway,omitempty"`
	// StorageClassName is the name of storage class
	StorageClassName string `json:"storageClassName,omitempty"`
	// StorageSize is the size of PVC
	StorageSize string `json:"storageSize,omitempty"`
	// Status is the status of CloudStudio
	Status string `json:"status,omitempty"`
	// CPULimit is the CPU limit for the container
	CPULimit string `json:"cpuLimit,omitempty"`
	// MemoryLimit is the memory limit for the container
	MemoryLimit string `json:"memoryLimit,omitempty"`
	// CPURequest is the CPU request for the container
	CPURequest string `json:"cpuRequest,omitempty"`
	// MemoryRequest is the memory request for the container
	MemoryRequest string `json:"memoryRequest,omitempty"`
	// Password is the password of the instance
	Password string `json:"password,omitempty"`
}

// CloudStudioStatus defines the observed state of CloudStudio.
type CloudStudioStatus struct {
	// INSERT ADDITIONAL STATUS FIELD - define observed state of cluster
	// Important: Run "make" to regenerate code after modifying this file
	Conditions []metav1.Condition `json:"conditions,omitempty" patchStrategy:"merge" patchMergeKey:"type" protobuf:"bytes,1,rep,name=conditions"`
}

// +kubebuilder:object:root=true
// +kubebuilder:subresource:status

// CloudStudio is the Schema for the cloudstudios API.
type CloudStudio struct {
	metav1.TypeMeta   `json:",inline"`
	metav1.ObjectMeta `json:"metadata,omitempty"`

	Spec   CloudStudioSpec   `json:"spec,omitempty"`
	Status CloudStudioStatus `json:"status,omitempty"`
}

// +kubebuilder:object:root=true

// CloudStudioList contains a list of CloudStudio.
type CloudStudioList struct {
	metav1.TypeMeta `json:",inline"`
	metav1.ListMeta `json:"metadata,omitempty"`
	Items           []CloudStudio `json:"items"`
}

func init() {
	SchemeBuilder.Register(&CloudStudio{}, &CloudStudioList{})
}
