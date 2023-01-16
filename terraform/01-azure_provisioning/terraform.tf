terraform {
  required_providers {
    azurerm = {
        source = "hashicorp/azurerm"
        version = "~>3.31.0"
    }
  }

  backend "azurerm" {
    resource_group_name = "ws-1_group"
    storage_account_name = "gl5devops"
    container_name = "backend"
    key = "dev.terraform.tfstate"
  }
}

provider "azurerm" {
  skip_provider_registration = true
  features {}
}