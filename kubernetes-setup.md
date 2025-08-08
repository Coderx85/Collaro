# Kubernetes Setup Guide for collaro

This guide walks you through setting up Kubernetes for the collaro project, including creating a dedicated namespace and configuring an NGINX Ingress to route external traffic into the cluster.

## Prerequisites
- Kubernetes cluster (Minikube, Kind, or managed Kubernetes)
- kubectl installed and configured to point at your cluster
- Helm (optional, for installing ingress controller)

## 1. Configure kubectl Context
Ensure your `kubectl` context is pointing to the desired cluster:
```powershell
kubectl config current-context
kubectl config use-context <your-cluster-context>
```

## 2. Create a Namespace
Create a namespace called `collaro` to isolate resources:
```yaml
# namespace.yaml
apiVersion: v1
kind: Namespace
metadata:
	name: collaro
``` 
Apply it:
```powershell
kubectl apply -f namespace.yaml
kubectl get namespaces
```

## 3. Install NGINX Ingress Controller
You can install the NGINX ingress controller via Helm:
```powershell
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update
helm install ingress-nginx ingress-nginx/ingress-nginx \
	--namespace ingress-nginx --create-namespace
```
Wait for the controller pods to become ready:
```powershell
kubectl get pods -n ingress-nginx
```

## 4. Deploy collaro Application
Create Deployment and Service definitions in the `collaro` namespace.

**deployment.yaml**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
	name: collaro-app
	namespace: collaro
spec:
	replicas: 2
	selector:
		matchLabels:
			app: collaro
	template:
		metadata:
			labels:
				app: collaro
		spec:
			containers:
				- name: collaro-container
					image: your-registry/collaro:latest
					ports:
						- containerPort: 3000
``` 

**service.yaml**
```yaml
apiVersion: v1
kind: Service
metadata:
	name: collaro-service
	namespace: collaro
spec:
	type: ClusterIP
	selector:
		app: collaro
	ports:
		- port: 80
			targetPort: 3000
			protocol: TCP
			name: http
```
Apply both:
```powershell
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml
```

## 5. Create Ingress Resource
Define an Ingress to expose `collaro.local` on HTTP port 80.

**ingress.yaml**
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
	name: collaro-ingress
	namespace: collaro
	annotations:
		kubernetes.io/ingress.class: "nginx"
spec:
	rules:
		- host: collaro.local
			http:
				paths:
					- path: /
						pathType: Prefix
						backend:
							service:
								name: collaro-service
								port:
									number: 80
``` 
Apply it:
```powershell
kubectl apply -f ingress.yaml
```

## 6. Local DNS Override
Add an entry to your local hosts file to point `collaro.local` to your cluster IP (e.g., Minikube or localhost):
```
127.0.0.1   collaro.local
```

## 7. Verify Setup
- Check all resources:
	```powershell
	kubectl get all -n collaro
	kubectl get ingress -n collaro
	```
- Open your browser to `http://collaro.local` and confirm the app is reachable.

## Cleanup
To remove everything:
```powershell
kubectl delete ingress collaro-ingress -n collaro
kubectl delete svc collaro-service -n collaro
kubectl delete deploy collaro-app -n collaro
helm uninstall ingress-nginx -n ingress-nginx
kubectl delete namespace collaro
``` 

---
_This guide provides a minimal Kubernetes setup for collaro. Adjust resource requests, autoscaling, TLS certificates, and other production best practices as needed._

## 8. Deploy Locally Using Docker Desktop

1. Enable Kubernetes in Docker Desktop:
	- Open Docker Desktop → Settings → Kubernetes → Enable Kubernetes → Apply & Restart.

2. Build the Docker image locally:
	```powershell
	cd <path-to-collaro-root>
	docker build -t collaro:local .
	```

3. Update your deployment manifest to use the local image (optional):
	```yaml
	# k8s/deployment.yaml
	spec:
	  containers:
		 - name: collaro-container
			image: collaro:local
			imagePullPolicy: IfNotPresent
	```

4. Apply the Kubernetes manifests from the `k8s/` directory:
	```powershell
	kubectl apply -f k8s/namespace.yaml
	kubectl apply -f k8s/deployment.yaml
	kubectl apply -f k8s/service.yaml
	kubectl apply -f k8s/ingress.yaml
	```

5. Verify deployment and ingress:
	```powershell
	kubectl get pods,svc,ingress -n collaro
	```

6. Access the app locally at `http://collaro.local` (ensure your hosts file entry is present).
