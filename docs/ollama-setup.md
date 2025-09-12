# Ollama Setup dengan mxbai-embed-large-v1

## Overview

Ollama telah dikonfigurasi dalam docker-compose.yml untuk menyediakan layanan embedding menggunakan model `mxbai-embed-large-v1` dari Mixedbread AI.

## Konfigurasi

### Services yang Ditambahkan:

1. **ollama**: Service utama Ollama
   - Port: `11434`
   - Memory limit: 4GB
   - Volume: `ollama_data` untuk persistent storage

2. **ollama-init**: Service inisialisasi untuk mengunduh model
   - Menjalankan script `/docker/ollama/init-ollama.sh`
   - Mengunduh model `mxbai-embed-large` secara otomatis

### Environment Variables:

Dalam service `app`, tersedia environment variables:
- `OLLAMA_HOST=ollama`
- `OLLAMA_PORT=11434`
- `OLLAMA_BASE_URL=http://ollama:11434`

## Cara Menggunakan

### 1. Menjalankan Services

```bash
docker-compose up -d ollama
```

### 2. Verifikasi Model Tersedia

```bash
# Cek model yang tersedia
curl http://localhost:11434/api/tags

# Atau masuk ke container
docker exec -it absteak_ollama ollama list
```

### 3. Menggunakan Model untuk Embedding

```bash
# Test embedding
curl -X POST http://localhost:11434/api/embeddings \
  -H "Content-Type: application/json" \
  -d '{
    "model": "mxbai-embed-large",
    "prompt": "Your text to embed"
  }'
```

### 4. Integrasi dalam Aplikasi PHP/Laravel

```php
// Contoh penggunaan dalam aplikasi
$client = new GuzzleHttp\Client();

$response = $client->post(env('OLLAMA_BASE_URL') . '/api/embeddings', [
    'json' => [
        'model' => 'mxbai-embed-large',
        'prompt' => 'Text yang ingin di-embed'
    ]
]);

$embeddings = json_decode($response->getBody(), true);
```

## Model Information

**mxbai-embed-large-v1** adalah model embedding dari Mixedbread AI yang mendukung:
- Matryoshka Representation Learning
- Binary quantization
- Multilingual support
- Dimensi embedding yang dapat disesuaikan

### Fitur Utama:
- **Retrieval**: Gunakan prompt `"Represent this sentence for searching relevant passages: "` untuk query
- **Similarity**: Cocok untuk semantic search dan similarity matching
- **Performance**: Optimized untuk production use

## Troubleshooting

### Model Tidak Terunduh
```bash
# Manual pull model
docker exec -it absteak_ollama ollama pull mxbai-embed-large
```

### Service Tidak Bisa Diakses
```bash
# Cek status service
docker-compose ps ollama

# Cek logs
docker-compose logs ollama
```

### Memory Issues
Jika mengalami masalah memory, sesuaikan `mem_limit` dalam docker-compose.yml sesuai dengan kapasitas sistem Anda.

## API Endpoints

- **Health Check**: `GET /api/tags`
- **Generate Embeddings**: `POST /api/embeddings`
- **List Models**: `GET /api/tags`
- **Model Info**: `GET /api/show`

Untuk dokumentasi API lengkap, kunjungi: https://github.com/ollama/ollama/blob/main/docs/api.md