data "azurerm_resource_group" "rg" {
  name = var.resource_group_name
}

resource "azurerm_kubernetes_cluster" "cluster" {
  name = "gl5-project-test"
  resource_group_name = data.azurerm_resource_group.rg.name
  location = data.azurerm_resource_group.rg.location
  http_application_routing_enabled = true
  dns_prefix = "devops"
  network_profile {
    network_plugin = "kubenet"
    network_policy = "calico"
  }
  default_node_pool {
    name = "default"
    node_count = 2
    vm_size = "Standard_DS2_v2"
  }

  identity {
    type = "SystemAssigned"
  }
}