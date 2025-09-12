<?php

namespace App\Observers;

use App\Models\DineOutSource;
use App\Services\Ollama;
use Illuminate\Support\Facades\Log;
use Exception;

class DineOutSourceObserver
{
    private Ollama $ollamaService;

    public function __construct(Ollama $ollamaService)
    {
        $this->ollamaService = $ollamaService;
    }

    /**
     * Handle the DineOutSource "creating" event.
     * Generate embeddings before saving the record.
     */
    public function creating(DineOutSource $dineOutSource): void
    {
        
        // $this->generateEmbedding($dineOutSource);
    }

    /**
     * Handle the DineOutSource "updating" event.
     * Regenerate embeddings if relevant fields have changed.
     */
    public function updating(DineOutSource $dineOutSource): void
    {
        // Check if fields that affect embedding have changed
        // $embeddingFields = ['name', 'url', 'metadata'];
        // $hasChanges = false;

        // foreach ($embeddingFields as $field) {
        //     if ($dineOutSource->isDirty($field)) {
        //         $hasChanges = true;
        //         break;
        //     }
        // }

        // if ($hasChanges) {
        //     $this->generateEmbedding($dineOutSource);
        // }
        $dineOutSource->embedding = null;
    }

    /**
     * Generate embedding for the DineOutSource record
     */
    private function generateEmbedding(DineOutSource $dineOutSource): void
    {
        try {
            // Check if Ollama service is available
            if (!$this->ollamaService->isAvailable()) {
                Log::warning('Ollama service not available, skipping embedding generation', [
                    'dine_out_source_id' => $dineOutSource->id ?? 'new',
                    'name' => $dineOutSource->name
                ]);
                return;
            }

            // Create text content for embedding
            $textContent = $this->buildTextContent($dineOutSource);

            if (empty($textContent)) {
                Log::warning('No content available for embedding generation', [
                    'dine_out_source_id' => $dineOutSource->id ?? 'new',
                    'name' => $dineOutSource->name
                ]);
                return;
            }

            // Generate embedding
            $embedding = $this->ollamaService->generateEmbedding($textContent);

            if ($embedding) {
                // Convert embedding array to PostgreSQL vector format
                $vectorString = '[' . implode(',', $embedding) . ']';
                $dineOutSource->embedding = $vectorString;
                
                Log::info('Embedding generated successfully for DineOutSource', [
                    'dine_out_source_id' => $dineOutSource->id ?? 'new',
                    'name' => $dineOutSource->name,
                    'embedding_dimensions' => count($embedding)
                ]);
            }

        } catch (Exception $e) {
            Log::error('Failed to generate embedding for DineOutSource', [
                'dine_out_source_id' => $dineOutSource->id ?? 'new',
                'name' => $dineOutSource->name,
                'error' => $e->getMessage()
            ]);
            
            // Don't throw the exception to prevent blocking the model save
            // The record will be saved without embedding
        }
    }

    /**
     * Build text content from DineOutSource attributes for embedding
     */
    private function buildTextContent(DineOutSource $dineOutSource): string
    {
        $content = [];

        // Add name
        if (!empty($dineOutSource->name)) {
            $content[] = 'Name: ' . $dineOutSource->name;
        }

        // Add code
        if (!empty($dineOutSource->code)) {
            $content[] = 'Code: ' . $dineOutSource->code;
        }

        // Add URL
        if (!empty($dineOutSource->url)) {
            $content[] = 'URL: ' . $dineOutSource->url;
        }

        // Add metadata if it's an array or object
        if (!empty($dineOutSource->metadata)) {
            if (is_array($dineOutSource->metadata)) {
                foreach ($dineOutSource->metadata as $key => $value) {
                    if (is_string($value) || is_numeric($value)) {
                        $content[] = ucfirst($key) . ': ' . $value;
                    }
                }
            } elseif (is_string($dineOutSource->metadata)) {
                $content[] = 'Metadata: ' . $dineOutSource->metadata;
            }
        }

        return implode('. ', $content);
    }
}