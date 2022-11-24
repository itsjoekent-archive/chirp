variable "gcp_organization_id" {
  type = string
}

variable "branch_name" {
  type = string
}

variable "environment_name" {
  type = string
}

terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 4.44.1"
    }
  }
}

resource "google_folder" "api_folder" {
  display_name = var.environment_name
  parent       = "organizations/${var.gcp_organization_id}"
}

resource "google_project" "api_project" {
  name       = "Chirp API - ${var.environment_name} - ${var.branch_name}"
  project_id = "chirp-${var.environment_name}-${var.branch_name}"
  folder_id  = google_folder.api_folder
}

output "project_id" {
  value = google_project.api_project.id
}