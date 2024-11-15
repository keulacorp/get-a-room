variable "project_id" {
  type        = string
}

variable "region" {
  type        = string
  default     = "europe-west1"
}

variable "bucket_name" {
  description = "frontend bucket name"
  type        = string
}

variable "cloud_run_service_name" {
  description = "backend service name"
  type        = string
}
