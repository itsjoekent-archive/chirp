variable "config" {}

terraform {
  required_providers {
    mongodbatlas = {
      source  = "mongodb/mongodbatlas"
      version = "~> 1.6.0"
    }
  }
}

data "mongodbatlas_teams" "dev_team" {
  org_id = var.config.mongo_atlas_organization_id
  name   = var.config.global.mongo_team
}

resource "mongodbatlas_project" "api" {
  name   = "chirp-api-${var.config.variables.environment_name}-${var.config.branch_name_sanitized}"
  org_id = var.config.mongo_atlas_organization_id

  teams {
    team_id = mongodbatlas_teams.dev_team.team_id
    role_names = ["GROUP_OWNER"]
  }
}

output "id" {
  value = mongodbatlas_project.api.id
}

output "name" {
  value = mongodbatlas_project.api.name
}

