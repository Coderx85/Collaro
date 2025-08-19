# Kubernetes Setup Guide for Collaro

This guide shows how to deploy Collaro (Next.js app) and PostgreSQL to a Kubernetes cluster. Commands are PowerShell-friendly (Windows).

## Prerequisites
- A Kubernetes cluster (local: Docker Desktop, Minikube, or kind; cloud: AKS/GKE/EKS)
- kubectl installed and pointing to your cluster
- Optional: NGINX Ingress Controller and cert-manager if you want Ingress + TLS
- Docker image available: `docker.io/coderx85/collaro:latest` (or update to your registry)

## What we deploy
- Namespace: `collaro`
- PostgreSQL: single Deployment + PVC + Service `postgres`
- App: Deployment `collaro-web` + Service `collaro-web`
- Ingress: `collaro-ingress` routing host `collaro.local` to the web Service
- Secret: `collaro-env` with your environment variables

Manifests live in `k8s/` and are wired with `kustomization.yaml`.

## 1) Create/Select the namespace
```powershell
kubectl apply -f k8s/namespace.yaml
kubectl config set-context --current --namespace=collaro
```

## 2) Provide environment variables
Create a `.env` at the repo root with all needed keys. Example variables (adjust to your project):
- NEXT_PUBLIC_STREAM_API_KEY
- NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
- CLERK_SECRET_KEY
- RESEND_API_KEY
- NEXT_PUBLIC_RESEND_API_KEY
- NEXT_PUBLIC_BASE_URL
- STREAM_API_KEY
- STREAM_API_SECRET
- DATABASE_URL (will be overridden in cluster to use the Postgres Service)

Create the secret from `.env` (preferred for Windows PowerShell):
```powershell
kubectl create secret generic collaro-env --namespace=collaro --from-env-file=.env --dry-run=client -o yaml | kubectl apply -f -
```

Alternatively, edit `k8s/secret-env.yaml` and put keys in `stringData` and apply with kustomize (less recommended for sensitive data in Git).

## 3) Deploy PostgreSQL
```powershell
kubectl apply -f k8s/postgres.yaml
kubectl -n collaro get pods,svc,pvc
```

Connection string used by the app (set by Deployment env):
```
postgresql://user:password@postgres.collaro.svc.cluster.local:5432/mydatabase
```

If you need different credentials, update `k8s/postgres.yaml` and the `DATABASE_URL` env in `k8s/web.yaml`.

## 4) Deploy the web app
```powershell
kubectl apply -f k8s/web.yaml
kubectl -n collaro get deploy,svc
```

The Deployment pulls `docker.io/coderx85/collaro:latest`. If you push a different tag or registry, change `image:` in `k8s/web.yaml`.

## 5) (Optional) Ingress and DNS
Ensure an Ingress controller (e.g., NGINX) is installed. Then:
```powershell
kubectl apply -f k8s/ingress.yaml
kubectl -n collaro get ingress
```

Local dev convenience: map `collaro.local` to the Ingress controller’s external IP. On Windows, edit `C:\Windows\System32\drivers\etc\hosts` and add:
```
<INGRESS_IP>  collaro.local
```

If using TLS with cert-manager, configure `ClusterIssuer` named `letsencrypt` or adjust annotations in `k8s/ingress.yaml`.

## 6) One-shot apply with Kustomize
You can apply everything (namespace, secret placeholder, Postgres, web, ingress) via kustomize:
```powershell
# Namespace must exist first (kustomize doesn’t create the namespace for cluster-scoped operations)
kubectl apply -f k8s/namespace.yaml

# Create env secret from .env
kubectl create secret generic collaro-env --namespace=collaro --from-env-file=.env --dry-run=client -o yaml | kubectl apply -f -

# Apply the stack
kubectl apply -k k8s
```

## 7) Verify rollout
```powershell
kubectl -n collaro get pods
kubectl -n collaro rollout status deploy/collaro-web
kubectl -n collaro logs deploy/collaro-web --tail=100
```

If using Ingress:
```powershell
kubectl -n collaro get ingress collaro-ingress
# Then open http://collaro.local
```

## 8) Database migrations (Drizzle)
If your image doesn’t run migrations on start, you can exec into the pod and run them (ensure Node + deps are in the image or ship a migration job):
```powershell
$pod = kubectl -n collaro get pod -l app=collaro-web -o jsonpath='{.items[0].metadata.name}'
kubectl -n collaro exec -it $pod -- node ./node_modules/drizzle-kit/bin/cli.js migrate
```

Alternatively, build a small Kubernetes `Job` that runs migrations using your image.

## 9) Troubleshooting
- PowerShell line continuations use backticks ``, not backslashes. Prefer single-line commands.
- Secret not found: make sure `collaro-env` exists in the `collaro` namespace before deploying `web.yaml`.
- Image pull errors: verify the image exists and your cluster can pull it (add imagePullSecrets if private).
- Ingress 404: ensure the Ingress controller is installed and your DNS/hosts entry points to it.
- Database connection: check Service DNS `postgres.collaro.svc.cluster.local` resolves and pod is Running.

## 10) Cleanup
```powershell
kubectl delete -k k8s
kubectl delete namespace collaro
```

—

If you want Helm charts instead of raw manifests, we can scaffold a chart next.
