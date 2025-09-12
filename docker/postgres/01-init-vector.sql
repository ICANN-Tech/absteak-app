-- Enable pgvector extension for vector operations
-- This script will be executed during PostgreSQL initialization

-- Connect to the main application database
\c app_db;

-- Create the vector extension if it doesn't exist
CREATE EXTENSION IF NOT EXISTS vector;

-- Grant usage on the vector extension to the application user
GRANT USAGE ON SCHEMA public TO absteak_user;

-- Create a sample table to demonstrate vector functionality (optional)
-- This can be removed if not needed
CREATE TABLE IF NOT EXISTS embeddings_sample (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    embedding vector(1536), -- OpenAI ada-002 embedding dimension
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Grant permissions on the sample table
GRANT ALL PRIVILEGES ON TABLE embeddings_sample TO absteak_user;
GRANT USAGE, SELECT ON SEQUENCE embeddings_sample_id_seq TO absteak_user;

-- Create an index for vector similarity search
CREATE INDEX IF NOT EXISTS embeddings_sample_embedding_idx 
ON embeddings_sample 
USING ivfflat (embedding vector_cosine_ops) 
WITH (lists = 100);

-- Display confirmation
SELECT 'pgvector extension enabled successfully' as status;