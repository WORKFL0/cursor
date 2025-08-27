-- Initialize database for Workflo New Project
-- This script runs when the PostgreSQL container starts for the first time

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create databases for different environments
CREATE DATABASE workflo_test;
CREATE DATABASE workflo_staging;

-- Create development user with limited privileges
CREATE USER workflo_dev WITH ENCRYPTED PASSWORD 'dev_password';
GRANT CONNECT ON DATABASE workflo_dev TO workflo_dev;
GRANT CONNECT ON DATABASE workflo_test TO workflo_dev;

-- Create read-only user for analytics
CREATE USER workflo_readonly WITH ENCRYPTED PASSWORD 'readonly_password';
GRANT CONNECT ON DATABASE workflo_dev TO workflo_readonly;

-- Set up proper permissions after database creation
\c workflo_dev;
GRANT USAGE ON SCHEMA public TO workflo_dev;
GRANT CREATE ON SCHEMA public TO workflo_dev;
GRANT USAGE ON SCHEMA public TO workflo_readonly;

-- Create basic tables structure (example)
CREATE TABLE IF NOT EXISTS health_checks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_name VARCHAR(100) NOT NULL,
    status VARCHAR(20) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    details JSONB
);

-- Insert initial health check data
INSERT INTO health_checks (service_name, status, details) 
VALUES ('database', 'healthy', '{"message": "Database initialized successfully"}');

-- Grant permissions on tables
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO workflo_dev;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO workflo_readonly;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO workflo_dev;