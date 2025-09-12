<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Exception;

class Ollama
{
    private string $baseUrl;
    private string $embedModel;
    private int $timeout;

    public function __construct()
    {
        $this->baseUrl = config('services.ollama.base_url', 'http://ollama:11434');
        $this->embedModel = config('services.ollama.embed_model', 'hf.co/mixedbread-ai/mxbai-embed-large-v1:F16');
        $this->timeout = config('services.ollama.timeout', 30);
    }

    /**
     * Generate embeddings for the given text using Ollama
     *
     * @param string $text
     * @return array|null
     * @throws Exception
     */
    public function generateEmbedding(string $text): ?array
    {
        try {
            Log::info('Generating embedding for text', ['text_length' => strlen($text)]);

            $response = Http::timeout($this->timeout)
                ->post($this->baseUrl . '/api/embeddings', [
                    'model' => $this->embedModel,
                    'prompt' => $text,
                ]);

            if (!$response->successful()) {
                Log::error('Ollama embedding request failed', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);
                throw new Exception('Failed to generate embedding: ' . $response->body());
            }

            $data = $response->json();

            if (!isset($data['embedding'])) {
                Log::error('Invalid embedding response format', ['response' => $data]);
                throw new Exception('Invalid embedding response format');
            }

            Log::info('Embedding generated successfully', [
                'embedding_dimensions' => count($data['embedding'])
            ]);

            return $data['embedding'];

        } catch (Exception $e) {
            Log::error('Error generating embedding', [
                'error' => $e->getMessage(),
                'text_length' => strlen($text)
            ]);
            throw $e;
        }
    }

    /**
     * Check if Ollama service is available
     *
     * @return bool
     */
    public function isAvailable(): bool
    {
        try {
            $response = Http::timeout(5)->get($this->baseUrl . '/api/tags');
            return $response->successful();
        } catch (Exception $e) {
            Log::warning('Ollama service not available', ['error' => $e->getMessage()]);
            return false;
        }
    }

    /**
     * Get available models from Ollama
     *
     * @return array
     */
    public function getModels(): array
    {
        try {
            $response = Http::timeout($this->timeout)->get($this->baseUrl . '/api/tags');
            
            if (!$response->successful()) {
                return [];
            }

            $data = $response->json();
            return $data['models'] ?? [];
        } catch (Exception $e) {
            Log::error('Error fetching models', ['error' => $e->getMessage()]);
            return [];
        }
    }

    /**
     * Check if the embedding model is available
     *
     * @return bool
     */
    public function isEmbedModelAvailable(): bool
    {
        $models = $this->getModels();
        
        foreach ($models as $model) {
            if ($model['name'] === $this->embedModel) {
                return true;
            }
        }
        
        return false;
    }

    /**
     * Generate embeddings for multiple texts in batch
     *
     * @param array $texts
     * @return array
     */
    public function generateBatchEmbeddings(array $texts): array
    {
        $embeddings = [];
        
        foreach ($texts as $index => $text) {
            try {
                $embeddings[$index] = $this->generateEmbedding($text);
            } catch (Exception $e) {
                Log::error('Failed to generate embedding for batch item', [
                    'index' => $index,
                    'error' => $e->getMessage()
                ]);
                $embeddings[$index] = null;
            }
        }
        
        return $embeddings;
    }
}