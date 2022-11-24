variable "environment_name" {
  type = string
}

locals {
  config = {
    preview = {
      primary_gcp_region = "us-east4"
      primary_gcp_zone   = "us-east4-a"

      gcp_service_regions = ["us-east4"]

      mongo_disk_size      = 10
      primary_mongo_region = "US_EAST_4"

      gcp_access_connector_machine_type = "e2-micro"
    }

    production = {
      primary_gcp_region = "us-east4"
      primary_gcp_zone   = "us-east4-a"

      gcp_service_regions = ["us-east4"]

      mongo_disk_size      = 10
      primary_mongo_region = "US_EAST_4"

      gcp_access_connector_machine_type = "e2-micro"
    }
  }
}

output "config" {
  value = local.config[var.environment_name]
}