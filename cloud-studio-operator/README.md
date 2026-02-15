# cloud-studio-operator
A Kubernetes operator for managing Cloud Studio environments with code-server and heartbeat containers.

## Description
This operator manages the lifecycle of Cloud Studio environments in a Kubernetes cluster. It creates and manages:
- StorageClass for persistent storage
- PersistentVolumeClaim for workspace data
- Deployment with code-server and heartbeat containers

Key features:
- Pause/Resume functionality by scaling Deployment replicas
- Persistent workspace storage using PVC
- Heartbeat container for monitoring
- Full lifecycle management (create, delete, pause, resume)

## Getting Started

### Prerequisites
- go version v1.24.0+
- docker version 17.03+.
- kubectl version v1.11.3+.
- Access to a Kubernetes v1.11.3+ cluster.

### Quick Start

#### 1. Install the CRDs
```sh
make install
```

#### 2. Run the operator locally
```sh
make run
```

#### 3. Create a CloudStudio instance
```sh
kubectl apply -k config/samples/
```

### To Deploy on the cluster
**Build and push your image to the location specified by `IMG`:**

```sh
make docker-build docker-push IMG=<some-registry>/cloud-studio-operator:tag
```

**NOTE:** This image ought to be published in the personal registry you specified.
And it is required to have access to pull the image from the working environment.
Make sure you have the proper permission to the registry if the above commands don’t work.

**Install the CRDs into the cluster:**

```sh
make install
```

**Deploy the Manager to the cluster with the image specified by `IMG`:**

```sh
make deploy IMG=<some-registry>/cloud-studio-operator:tag
```

> **NOTE**: If you encounter RBAC errors, you may need to grant yourself cluster-admin
privileges or be logged in as admin.

**Create instances of your solution**
You can apply the samples (examples) from the config/sample:

```sh
kubectl apply -k config/samples/
```

>**NOTE**: Ensure that the samples has default values to test it out.

## Usage Examples

### Create a CloudStudio instance
```yaml
apiVersion: cloud-studio.example.com/v1alpha1
kind: CloudStudio
metadata:
  name: cloudstudio-sample
spec:
  codeServerImage: codercom/code-server:latest
  heartbeatImage: busybox:latest
  replicas: 1
  storageClassName: local-storage
  storageSize: 10Gi
  status: running
  cpuLimit: "1"
  memoryLimit: "1Gi"
  cpuRequest: "0.5"
  memoryRequest: "512Mi"
```

### Pause a CloudStudio instance
```sh
kubectl patch cloudstudio cloudstudio-sample --type='merge' -p '{"spec": {"status": "paused"}}'
```

### Resume a CloudStudio instance
```sh
kubectl patch cloudstudio cloudstudio-sample --type='merge' -p '{"spec": {"status": "running"}}'
```

### Delete a CloudStudio instance
```sh
kubectl delete cloudstudio cloudstudio-sample
```

## API Reference

### CloudStudioSpec
| Field | Type | Description |
|-------|------|-------------|
| `codeServerImage` | string | Docker image for code-server |
| `heartbeatImage` | string | Docker image for heartbeat container |
| `replicas` | int32 | Number of replicas for the Deployment |
| `storageClassName` | string | Name of the StorageClass to use |
| `storageSize` | string | Size of the persistent storage |
| `status` | string | Status of the instance ("running" or "paused") |
| `cpuLimit` | string | CPU limit for the code-server container |
| `memoryLimit` | string | Memory limit for the code-server container |
| `cpuRequest` | string | CPU request for the code-server container |
| `memoryRequest` | string | Memory request for the code-server container |

### To Uninstall
**Delete the instances (CRs) from the cluster:**

```sh
kubectl delete -k config/samples/
```

**Delete the APIs(CRDs) from the cluster:**

```sh
make uninstall
```

**UnDeploy the controller from the cluster:**

```sh
make undeploy
```

## Project Distribution

Following the options to release and provide this solution to the users.

### By providing a bundle with all YAML files

1. Build the installer for the image built and published in the registry:

```sh
make build-installer IMG=<some-registry>/cloud-studio-operator:tag
```

**NOTE:** The makefile target mentioned above generates an 'install.yaml'
file in the dist directory. This file contains all the resources built
with Kustomize, which are necessary to install this project without its
dependencies.

2. Using the installer

Users can just run 'kubectl apply -f <URL for YAML BUNDLE>' to install
the project, i.e.:

```sh
kubectl apply -f https://raw.githubusercontent.com/<org>/cloud-studio-operator/<tag or branch>/dist/install.yaml
```

### By providing a Helm Chart

1. Build the chart using the optional helm plugin

```sh
operator-sdk edit --plugins=helm/v1-alpha
```

2. See that a chart was generated under 'dist/chart', and users
can obtain this solution from there.

**NOTE:** If you change the project, you need to update the Helm Chart
using the same command above to sync the latest changes. Furthermore,
if you create webhooks, you need to use the above command with
the '--force' flag and manually ensure that any custom configuration
previously added to 'dist/chart/values.yaml' or 'dist/chart/manager/manager.yaml'
is manually re-applied afterwards.

## Contributing
// TODO(user): Add detailed information on how you would like others to contribute to this project

**NOTE:** Run `make help` for more information on all potential `make` targets

More information can be found via the [Kubebuilder Documentation](https://book.kubebuilder.io/introduction.html)

## License

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

