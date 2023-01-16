resource "helm_release" "ingress_nginx" {
  name = "ingress-nginx"
  chart = "ingress-nginx"
  repository = "https://kubernetes.github.io/ingress-nginx"

  create_namespace = true
  namespace = var.namespace
  
  set {
    name = "service\\.beta\\.kubernetes\\.io/azure-load-balancer-health-probe-request-path"
    value = "/healthz"
    type = "string"
  }
}