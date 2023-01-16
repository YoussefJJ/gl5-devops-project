terraform {
  required_providers {
    helm = {
        source = "hashicorp/helm"
        version = "~>2.8.0"
    }
  }
  backend "azurerm" {
    resource_group_name = "ws-1_group"
    storage_account_name = "gl5devops"
    container_name = "backend"
    key = "dev.terraform-app.tfstate"
  }
}