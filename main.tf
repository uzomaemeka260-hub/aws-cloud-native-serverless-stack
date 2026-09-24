resource "aws_dynamodb_table" "users" {
  name         = "app_production_users"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "username"
  attribute {
    name = "username"
    type = "S"
  }
}
resource "aws_sqs_queue" "pipeline_queue" {
  name = "user-processing-queue"
}
resource "aws_s3_bucket" "frontend_bucket" {
  bucket = "portfolio-frontend-assets-bucket"
}
output "dynamodb_table_name" { value = aws_dynamodb_table.users.name }
output "sqs_queue_url" { value = aws_sqs_queue.pipeline_queue.url }
