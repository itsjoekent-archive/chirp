variable "branch_name" {
  type = string
}

variable "cloudflare_api_token" {
  sensitive = true
  type      = string
}

variable "environment_name" {
  type = string
}

variable "gcp_organization_id" {
  sensitive = true
  type      = string
}

variable "mongo_atlas_organization_id" {
  sensitive = true
  type      = string
}

variable "mongo_atlas_public_key" {
  sensitive = true
  type      = string
}

variable "mongo_atlas_private_key" {
  sensitive = true
  type      = string
}

# Google Provider Authentication
# > Remove the newline characters from your JSON key file and then paste the credentials into the environment variable value field. 
# > You can use the tr command to strip newline characters. cat key.json | tr -s '\n' ' '
variable "GOOGLE_CREDENTIALS" {
  sensitive = true
  type      = string
}