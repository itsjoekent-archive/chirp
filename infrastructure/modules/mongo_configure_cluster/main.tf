variable "config" {}

variable "mongo_project_id" {
  type = string
}

variable "mongo_cluster_name" {
  type = string
}

variable "gcp_cloud_run_ips" {
  type = list(string)
}

# TODO: Configure backups if `branch == 'main'`

terraform {
  required_providers {
    mongodbatlas = {
      source  = "mongodb/mongodbatlas"
      version = "~> 1.6.0"
    }
  }
}

resource "random_password" "mongo_database_user_password" {
  length  = 16
  special = false
}

resource "mongodbatlas_database_user" "api_user" {
  username           = var.config.global.mongo_username
  password           = random_password.mongo_database_user_password.result
  project_id         = var.mongo_project_id
  auth_database_name = "admin"

  roles {
    role_name     = "readWriteAnyDatabase"
    database_name = "admin"
  }

  scopes {
    name = var.mongo_cluster_name
    type = "CLUSTER"
  }
}

resource "mongodbatlas_project_ip_access_list" "mongo_gcp_cloud_run_access" {
  for_each = toset(var.gcp_cloud_run_ips)

  project_id = var.mongo_project_id
  ip_address = each.key
  comment    = "ip address for gcp cloud run"
}

output "username" {
  value = mongodbatlas_database_user.api_user.username
}

output "password" {
  value = mongodbatlas_database_user.api_user.password
}
