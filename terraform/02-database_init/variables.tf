variable "config_map_name" {
    description = "Name label of the Config Map"
}

variable "db_name" {
  description = "Name of the database"
}

variable "db_user" {
  description = "Name of the database"
}

variable "db_password" {
  description = "Name of the database"
}

variable "db_replicas" {
  description = "Number of replicas of the database"
}

variable "db_image" {
  description = "Database Image to pull from registry"
}

variable "db_port" {
  description = "Port of database container"
}

variable "resource_group_name" {
  description = "Azure Resource Group Name"
}

variable "pv_name" {
  description = "Name metadata for Persistent Volume"
}

variable "pvc_name" {
  description = "Name metadata for Persistent Volume Claim"
}