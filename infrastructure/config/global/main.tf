locals {
  config = {
    mongo_username = "chirp"
    mongo_version  = "5"
  }
}

output "config" {
  value = local.config
}