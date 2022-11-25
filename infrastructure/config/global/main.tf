locals {
  config = {
    mongo_team = "chirp developers"
    mongo_username = "chirp"
    mongo_version  = "5"
  }
}

output "config" {
  value = local.config
}