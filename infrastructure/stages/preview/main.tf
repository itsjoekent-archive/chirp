terraform {
  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 3.28.0"
    }

    google = {
      source  = "hashicorp/google"
      version = "~> 4.44.1"
    }

    mongodbatlas = {
      source  = "mongodb/mongodbatlas"
      version = "~> 1.0.1"
    }

    random = {
      source  = "hashicorp/random"
      version = "~> 3.1.0"
    }
  }

  backend "remote" {
    hostname     = "app.terraform.io"
    organization = "..."

    workspaces {
      name = "preview"
    }
  }

  required_version = ">= 1.3.5"
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}

provider "google-default" {
  region = "us-east4"
  zone   = "us-east4-a"
}

provider "mongodbatlas" {
  public_key  = var.mongo_atlas_public_key
  private_key = var.mongo_atlas_private_key
}

module "global_config" {
  source = "../../config/global"
}

module "environment_config" {
  source           = "../../config/environment"
  environment_name = var.environment_name
}

# TODO: sanitize the branch name, no symbols except dashes, all lowercase

locals {
  branch_name_sanitized = replace(lower(var.branch_name), "/[^a-z0-9-]/", "-")
  branch_name_short     = substr(local.branch_name_sanitized, 0, 16)
}

module "gcp_project" {
  source                = "../../modules/gcp_project"
  gcp_organization_id   = var.gcp_organization_id
  branch_name           = var.branch_name
  branch_name_sanitized = local.branch_name_sanitized
  environment_name      = var.environment_name
}

provider "google" {
  region     = "us-east4"
  zone       = "us-east4-a"
  project_id = gcp_project.project_id
}

locals {
  config = {
    branch_name                 = var.branch_name
    branch_name_sanitized       = local.branch_name_sanitized
    branch_name_short           = local.branch_name_short
    environment_name            = var.environment_name
    gcp_project_id              = gcp_project.id
    mongo_atlas_organization_id = var.mongo_atlas_organization_id

    environment = module.environment_config.config
    global      = module.global_config.config
  }
}

module "gcp_network" {
  source = "../../modules/gcp_network"
  config = local.config

  providers = {
    google = google
  }
}

module "mongo_project" {
  source = "../../modules/mongo_project"
  config = local.config

  providers = {
    mongodbatlas = mongodbatlas
  }
}

resource "mongodbatlas_advanced_cluster" "api" {
  name                   = "Chirp API - ${var.branch_name}"
  project_id             = mongo_project.id
  cluster_type           = "REPLICASET"
  mongo_db_major_version = local.config.global.mongo_version
  disk_size_gb           = var.config.environment.mongo_disk_size

  replication_specs {
    region_configs {
      electable_specs {
        instance_size = "M0"
        node_count    = 1
      }

      region_name   = var.config.environment.primary_mongo_region
      provider_name = "GCP"
      priority      = 1
    }
  }
}

module "mongo_configure_cluster" {
  source = "../../modules/mongo_configure_cluster"
  config = local.config

  mongo_project_id   = mongo_project.id
  mongo_cluster_name = mongodbatlas_advanced_cluster.api.cluster_id
  gcp_cloud_run_ips  = gcp_network.ip_addresses

  providers = {
    mongodbatlas = mongodbatlas
  }
}

module "hello_world_gcp_service" {
  source = "../../modules/gcp_cloud_run_service"
  config = local.config

  name                            = "hello-world"
  gcp_network_vpc_connector_names = gcp_network.vpc_connector_names

  providers = {
    google = google
  }
}