variable "config" {}

terraform {
  required_providers {
    mongodbatlas = {
      source  = "mongodb/mongodbatlas"
      version = "~> 1.6.0"
    }
  }
}

resource "mongodbatlas_project" "api" {
  name   = "chirp-api-${var.config.variables.environment_name}-${var.config.branch_name}"
  org_id = var.config.mongo_atlas_organization_id
}

output "project_id" {
  value = mongodbatlas_project.api.id
}

output "name" {
  value = mongodbatlas_project.api.name
}

