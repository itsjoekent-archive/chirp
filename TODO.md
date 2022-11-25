# TODO:

# Create post tweet service (just DB write for now)

# Create Cloudflare resources
#  - Domain records
#  - Worker script / path
#  - KV
#  - No R2... yet, https://github.com/cloudflare/terraform-provider-cloudflare/issues/1664
#    - Maybe do Google Cloud storage for now?
#  - Init worker API code

# Create CI/CD infra
#  - Create preview environment with terraform on PR command
#  - Deploy service images + CF resources on commit
#  - Destroy preview environment on PR close/merge
#  - Deploy to prod on merge

