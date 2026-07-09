# Production Deployment Guide (Kubernetes & Helm)

This guide describes how to deploy Codexa (CodePilot AI) to a production-grade Kubernetes cluster using Helm 3.

---

## 🏗️ Production Architecture Blueprint

In a production environment, the system is deployed across multiple namespace resources:
* **API Pods**: Managed by a Deployment, autoscaled using a **Horizontal Pod Autoscaler (HPA)** based on CPU utilization.
* **Worker Pods**: Dedicated worker pool with persistent scratch space, managed by an HPA to dynamically scale workers based on indexing load.
* **Flower Pod**: Dedicated Celery monitoring pod.
* **Bitnami Sub-charts**: PostgreSQL, Redis, and MinIO run as StatefulSets with Persistent Volume Claims (PVC) to guarantee data persistence.
* **Pre-upgrade Job**: An Alembic migration job runs automatically before any API or worker pods are updated.

---

## 🚀 Deployment Steps

### 1. Add Helm Repository Dependencies
Add the Bitnami repository to fetch PostgreSQL, Redis, and MinIO sub-charts:
```bash
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update
```

### 2. Fetch Chart Dependencies
Compile sub-chart dependencies:
```bash
helm dependency update helm/codepilot-ai
```

### 3. Deploy to the Kubernetes Cluster
Run `helm upgrade --install` to deploy the application into a dedicated namespace:
```bash
helm upgrade --install codepilot ./helm/codepilot-ai \
  --namespace codepilot \
  --create-namespace \
  --set secrets.llmApiKey="your_production_openrouter_api_key" \
  --set secrets.jwtSecret="generate_a_long_random_jwt_signing_key" \
  --set ingress.hosts[0].host="codepilot.yourdomain.com" \
  --wait
```

### 4. Verify Deployments
Ensure all resources, HPAs, and PVCs are online:
```bash
kubectl get all -n codepilot
kubectl get hpa -n codepilot
```

---

## 🔒 Production Security Checklist

Ensure the following parameters in `helm/codepilot-ai/values.yaml` are configured correctly for production:

1. **Disable Sandbox Developer Login**
   ```yaml
   config:
     allowSandboxLogin: "false"
   ```
2. **Enforce Strict Authentication Checks**
   ```yaml
   config:
     enforceStrictAuth: "true"
   ```
   *(This ensures the server crashes on startup if PostgreSQL or Redis are unreachable, rather than silently degrading).*
3. **Change Default StatefulSet Passwords**
   ```yaml
   postgresql:
     auth:
       password: "generate_a_strong_password_here"
   minio:
     auth:
       rootPassword: "generate_a_strong_password_here"
   ```

---

## 🌐 Enabling TLS with cert-manager

To expose the application securely over HTTPS, configure `cert-manager` to manage Let's Encrypt certificates automatically:

```bash
# 1. Install cert-manager
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.14.0/cert-manager.yaml

# 2. Deploy the chart with Ingress TLS configuration enabled
helm upgrade --install codepilot ./helm/codepilot-ai \
  --namespace codepilot \
  --set ingress.hosts[0].host="codepilot.yourdomain.com" \
  --set ingress.tls[0].secretName="codepilot-tls-cert" \
  --set ingress.tls[0].hosts[0]="codepilot.yourdomain.com" \
  --set ingress.annotations."cert-manager\.io/cluster-issuer"="letsencrypt-prod"
```

---

## 🔍 Accessing Flower Celery UI
Since Flower is exposed as an internal ClusterIP service, run a port-forward command to access the queue monitor dashboard locally:
```bash
kubectl port-forward svc/codepilot-codepilot-ai-flower 5555:5555 -n codepilot
```
Open `http://localhost:5555` in your browser (default credentials: `admin` / `codepilot_flower_pass`).

---

## 🛠️ Operations & Troubleshooting

### 1. View Application Logs
```bash
# View API server logs
kubectl logs -l app.kubernetes.io/component=backend -n codepilot -f --tail=100

# View Celery worker logs
kubectl logs -l app.kubernetes.io/component=worker -n codepilot -f --tail=100
```

### 2. Rollback a Failed Release
If a deployment fails, roll back to a previous stable Helm revision:
```bash
# Check release history
helm history codepilot -n codepilot

# Rollback to revision 2
helm rollback codepilot 2 -n codepilot
```
