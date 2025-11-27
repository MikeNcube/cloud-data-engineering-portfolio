provider "aws" {
  region = "us-east-1"
}

resource "aws_s3_bucket" "example_bucket" {
  bucket = "cloud-data-engineering-portfolio-example"
  acl    = "private"
}
