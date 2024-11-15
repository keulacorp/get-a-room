provider "google" {
  project = var.project_id
  region  = var.region
}

resource "google_storage_bucket" "frontend_bucket" {
  name     = "${var.bucket_name}-${terraform.workspace}"
  location = var.region
  # force_destroy = true

  website {
    main_page_suffix = "index.html"
    not_found_page   = "404.html"
  }
}

resource "google_cloud_run_service" "backend" {
  name     = "${var.cloud_run_service_name}-${terraform.workspace}"
  location = var.region

  template {
    spec {
      containers {
        # Placeholder-arvo, joka päivitetään myöhemmin CI/CD-pipeline -vaiheessa
        image = "gcr.io/google-samples/hello-app:1.0"
        env {
          name  = "ALLOWED_ORIGIN"
          value = "https://getaroom.vincit.fi"
        }
      }
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }
}
