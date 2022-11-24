variable "config" {}

terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 4.44.1"
    }
  }
}

resource "google_compute_network" "api_network" {
  name                    = "vpc-network"
  auto_create_subnetworks = false
}

resource "google_compute_subnetwork" "api_subnet" {
  for_each = toset(var.config.environment.gcp_service_regions)

  name          = "vpc-subnetwork-${each.key}"
  ip_cidr_range = "10.2.0.0/28"
  region        = each.key
  network       = google_compute_network.api_network.id
}

resource "google_vpc_access_connector" "api_connector" {
  count = length(var.config.environment.gcp_service_regions)

  name         = "vpc-connector-${var.config.environment.gcp_service_regions[count.index]}"
  machine_type = var.config.environment.gcp_access_connector_machine_type
  region       = var.config.environment.gcp_service_regions[count.index]

  # TODO
  # min_throughput, min_instances, max_instances, max_throughput

  subnet {
    name = google_compute_subnetwork.api_subnet[count.index].name
  }
}

resource "google_compute_router" "api_router" {
  for_each = toset(var.config.environment.gcp_service_regions)

  name    = "router-${each.key}"
  region  = each.key
  network = google_compute_network.api_network.id

  bgp {
    asn = 64514
  }
}

resource "google_compute_address" "api_nat_address" {
  for_each = toset(var.config.environment.gcp_service_regions)

  name   = "nat-manual-ip-${var.config.environment.primary_gcp_region}"
  region = var.config.environment.primary_gcp_region
}

resource "google_compute_router_nat" "api_nat" {
  count = length(var.config.environment.gcp_service_regions)

  name                               = "nat-${var.config.environment.gcp_service_regions[count.index]}"
  router                             = google_compute_router.api_router
  region                             = var.config.environment.gcp_service_regions[count.index]
  nat_ip_allocate_option             = "MANUAL_ONLY"
  nat_ips                            = [google_compute_address.api_nat_address[count.index].self_link]
  source_subnetwork_ip_ranges_to_nat = "ALL_SUBNETWORKS_ALL_IP_RANGES"

  log_config {
    enable = true
    filter = "ERRORS_ONLY"
  }
}

output "ip_addresses" {
  value = google_compute_address.api_nat_address.*.address
}

output "vpc_connector_names" {
  value = google_vpc_access_connector.api_connector.*.name
}

