terraform {
  required_providers {
    kubernetes = {
        source = "hashicorp/kubernetes"
        version = "~>2.16.1"
    }
  }

  backend "azurerm" {
    resource_group_name = "ws-1_group"
    storage_account_name = "gl5devops"
    container_name = "backend"
    key = "dev.terraform-db-init.tfstate"
  }
}

locals {
  kube_config = one(data.terraform_remote_state.aks.outputs.kube_config)
  host = local.kube_config.host
  username = local.kube_config.username
  password = local.kube_config.password
  client_certificate = base64decode(local.kube_config.client_certificate)
  client_key = base64decode(local.kube_config.client_key)
  cluster_ca_certificate = base64decode(local.kube_config.cluster_ca_certificate)
}

provider "kubernetes" {
  host = local.host
  username = local.username
  password = local.password
  client_certificate = local.client_certificate
  client_key = local.client_key
  cluster_ca_certificate = local.cluster_ca_certificate
}

provider "azurerm" {
   features {}
}