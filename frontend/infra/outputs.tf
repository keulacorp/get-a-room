output "bucket_url" {
  value = google_storage_bucket.frontend_bucket.url
}

output "cloud_run_url" {
  value = google_cloud_run_service.backend.status[0].url
}
