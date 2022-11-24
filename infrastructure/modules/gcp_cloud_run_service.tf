variable "config" {}

variable "name" {
  type = string
}

variable "gcp_network_vpc_connector_names" {
  type = list(string)
}

# TODO: More service configuration options

terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 4.44.1"
    }
  }
}

data "google_container_registry_image" "service_image" {
  name   = var.name
  region = "us"
}

resource "google_cloud_run_service" "api_service" {
  count = length(var.config.environment.gcp_service_regions)

  name     = "${var.name} - ${var.config.environment.gcp_service_regions[count.index]}"
  location = var.config.environment.gcp_service_regions[count.index]

  template {
    spec {
      containers {
        image = google_container_registry_image.service_image.image_url
      }
    }
  }

  metadata {
    annotations = {
      "run.googleapis.com/vpc-access-connector" = var.gcp_network_vpc_connector_names[count.index]
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }
}