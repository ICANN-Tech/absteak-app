# PostgreSQL 16 dengan pgvector Extension

## Overview

PostgreSQL telah diupgrade ke versi 16 dengan dukungan pgvector extension untuk operasi vector dan AI/ML workloads.

## Fitur Utama PostgreSQL 16

### Vector Support
- **pgvector extension**: Mendukung operasi vector untuk embedding dan similarity search
- **Vector data types**: `vector(n)` untuk menyimpan embedding dengan dimensi n
- **Vector operations**: Cosine similarity, L2 distance, inner product
- **Vector indexes**: IVFFlat dan HNSW untuk pencarian vector yang efisien

### Performance Improvements
- Improved query planning dan execution
- Better memory management
- Enhanced parallel processing
- Optimized I/O operations

## Konfigurasi

### Services yang Diupgrade:

1. **db (Main Database)**:
   - Image: `postgres:16-alpine`
   - Preloaded libraries: `pg_stat_statements,vector`
   - Vector extension enabled

2. **listmonk_db**:
   - Image: `postgres:16-alpine`
   - Standard PostgreSQL 16 features

### Environment Variables:

Tidak ada perubahan pada environment variables, semua konfigurasi tetap sama:
- `POSTGRES_DB=app_db`
- `POSTGRES_USER=absteak_user`
- `POSTGRES_PASSWORD=absteak_secure_password_2024`

## Penggunaan pgvector

### 1. Membuat Tabel dengan Vector Column

```sql
CREATE TABLE documents (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    embedding vector(1536), -- OpenAI ada-002 dimension
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2. Insert Data dengan Embedding

```sql
INSERT INTO documents (title, content, embedding) 
VALUES (
    'Sample Document',
    'This is a sample document content',
    '[0.1, 0.2, 0.3, ...]'::vector -- Array of floats
);
```

### 3. Vector Similarity Search

```sql
-- Cosine similarity search
SELECT 
    title,
    content,
    1 - (embedding <=> '[0.1, 0.2, 0.3, ...]'::vector) AS similarity
FROM documents
ORDER BY embedding <=> '[0.1, 0.2, 0.3, ...]'::vector
LIMIT 10;

-- L2 distance
SELECT 
    title,
    embedding <-> '[0.1, 0.2, 0.3, ...]'::vector AS l2_distance
FROM documents
ORDER BY embedding <-> '[0.1, 0.2, 0.3, ...]'::vector
LIMIT 10;

-- Inner product
SELECT 
    title,
    (embedding <#> '[0.1, 0.2, 0.3, ...]'::vector) * -1 AS inner_product
FROM documents
ORDER BY embedding <#> '[0.1, 0.2, 0.3, ...]'::vector
LIMIT 10;
```

### 4. Membuat Vector Index

```sql
-- IVFFlat index (recommended for most cases)
CREATE INDEX ON documents 
USING ivfflat (embedding vector_cosine_ops) 
WITH (lists = 100);

-- HNSW index (better for high-dimensional data)
CREATE INDEX ON documents 
USING hnsw (embedding vector_cosine_ops) 
WITH (m = 16, ef_construction = 64);
```

## Integrasi dengan Ollama

Dengan setup Ollama dan PostgreSQL 16, Anda dapat:

1. **Generate embeddings** menggunakan Ollama
2. **Store embeddings** di PostgreSQL dengan pgvector
3. **Perform similarity search** untuk RAG applications

### Contoh Workflow:

```php
// 1. Generate embedding menggunakan Ollama
$client = new GuzzleHttp\Client();
$response = $client->post(env('OLLAMA_BASE_URL') . '/api/embeddings', [
    'json' => [
        'model' => 'mxbai-embed-large',
        'prompt' => 'Your text content'
    ]
]);
$embedding = json_decode($response->getBody(), true)['embedding'];

// 2. Store di PostgreSQL
$embeddingVector = '[' . implode(',', $embedding) . ']';
DB::table('documents')->insert([
    'title' => 'Document Title',
    'content' => 'Document content',
    'embedding' => DB::raw("'{$embeddingVector}'::vector")
]);

// 3. Similarity search
$queryEmbedding = '[' . implode(',', $queryEmbedding) . ']';
$results = DB::select("
    SELECT title, content, 
           1 - (embedding <=> ?::vector) as similarity
    FROM documents 
    ORDER BY embedding <=> ?::vector 
    LIMIT 10
", [$queryEmbedding, $queryEmbedding]);
```

## Vector Operations

### Distance Functions:
- `<->`: L2 distance (Euclidean)
- `<#>`: Inner product (negative)
- `<=>`: Cosine distance

### Index Types:
- **IVFFlat**: Good for most use cases, faster build time
- **HNSW**: Better recall, slower build time, more memory

### Best Practices:

1. **Choose appropriate dimension**: Match your embedding model
2. **Use appropriate index**: IVFFlat for general use, HNSW for high precision
3. **Normalize vectors**: For cosine similarity
4. **Monitor performance**: Use EXPLAIN ANALYZE for query optimization

## Migration dari PostgreSQL 15

### Backup Data (Recommended):
```bash
# Backup existing data
docker exec postgres pg_dump -U absteak_user app_db > backup.sql
```

### Restart Services:
```bash
# Stop services
docker-compose down

# Remove old volumes (CAUTION: This will delete data)
docker volume rm absteak-app_db_data

# Start with new PostgreSQL 16
docker-compose up -d db
```

### Restore Data (if needed):
```bash
# Restore from backup
docker exec -i postgres psql -U absteak_user app_db < backup.sql
```

## Troubleshooting

### Extension Not Found
```sql
-- Check if extension is available
SELECT * FROM pg_available_extensions WHERE name = 'vector';

-- Install extension manually
CREATE EXTENSION vector;
```

### Performance Issues
```sql
-- Check index usage
EXPLAIN ANALYZE SELECT * FROM documents 
ORDER BY embedding <=> '[...]'::vector LIMIT 10;

-- Adjust index parameters
SET ivfflat.probes = 10; -- For IVFFlat
SET hnsw.ef_search = 100; -- For HNSW
```

### Memory Issues
- Increase `shared_buffers` untuk vector operations
- Monitor `work_mem` untuk sorting operations
- Adjust `effective_cache_size` sesuai available memory

## Resources

- [pgvector Documentation](https://github.com/pgvector/pgvector)
- [PostgreSQL 16 Release Notes](https://www.postgresql.org/docs/16/release-16.html)
- [Vector Similarity Search Best Practices](https://github.com/pgvector/pgvector#best-practices)