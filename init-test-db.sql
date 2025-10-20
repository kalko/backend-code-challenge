-- This script runs automatically when the PostgreSQL container is first initialized
-- It creates the test database used by Jest tests

-- Create test database if it doesn't exist
SELECT 'CREATE DATABASE pokemon_db_test'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'pokemon_db_test')\gexec
