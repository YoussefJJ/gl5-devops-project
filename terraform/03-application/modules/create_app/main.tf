resource "helm_release" "my_application" {
  name = var.release_name
  chart = var.chart
  repository = var.repository
}