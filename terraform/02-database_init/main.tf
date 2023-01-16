data "terraform_remote_state" "aks" {
  backend = "azurerm"
  config = {
    resource_group_name = "ws-1_group"
    container_name = "backend"
    storage_account_name = "gl5devops"
    key = "dev.terraform.tfstate"
  }
}

resource "kubernetes_config_map" "database_config_map" {
    metadata {
      name = var.config_map_name
      labels = {
        app = "postgres"
      }
    }
    data = {
      POSTGRES_DB = "twitter_db"
      POSTGRES_USER = "postgres"
      POSTGRES_PASSWORD = "root"
    }
    
}

resource "kubernetes_persistent_volume" "pv" {
    metadata {
      name = var.pv_name
      labels = {
        type = "local"
        app = "postgres"
      }
    }

    spec {
      storage_class_name = "manual"
      capacity = {
        storage = "1Gi"
      }
      access_modes = [ "ReadWriteMany" ]
      persistent_volume_source {
        host_path {
          path = "/mnt/data"
        }
      }
    }
}

resource "kubernetes_persistent_volume_claim_v1" "pvc" {
  metadata {
    name = var.pvc_name
    labels = {
      app = "postgres"
    }
  }
  spec {
    storage_class_name = "manual"
    access_modes = [ "ReadWriteMany" ]
    resources {
      requests = {
        storage = "1Gi"
      }
    }
  }
}

resource "kubernetes_deployment" "db_deploy" {
  metadata {
    name = "postgres"
  }
  spec {
    replicas = var.db_replicas
    selector {
      match_labels = {
        "app" = "postgres"
      }
    }
    template {
      metadata {
        labels = {
          app = "postgres"
        }
      }
      spec {
        container {
          name = "postgres"
          image = var.db_image
          image_pull_policy = "IfNotPresent"
          port {
            container_port = var.db_port
          }
          env_from {
            config_map_ref {
              name = var.config_map_name
            }
          }
          volume_mount {
            name = "postgredb"
            mount_path = "/var/lib/postgesql/data"
          }
        }
        volume {
          name = "postgredb"
          persistent_volume_claim {
            claim_name = var.pvc_name
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "db_service" {
  metadata {
    name = "postgres"
    labels = {
      app = "postgres"
    }
  }
  spec {
    type = "NodePort"
    port {
      port = var.db_port
    }
    selector = {
      app = "postgres"
    }
  }
}