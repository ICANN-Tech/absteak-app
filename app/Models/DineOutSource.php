<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use App\Services\Ollama;

class DineOutSource extends Model
{
    use HasUuids;

    protected $fillable = [
        'name',
        'code',
        'url',
        'metadata',
        'embedding',
    ];

    protected $casts = [
        'metadata' => 'json',
    ];

    /**
     * Perform similarity search based on text query
     */
    public static function similaritySearch(string $query, int $limit = 5)
    {
        $ollamaService = app(Ollama::class);
        $queryEmbedding = $ollamaService->generateEmbedding($query);
        
        // Convert array to PostgreSQL vector format
        $vectorString = '[' . implode(',', $queryEmbedding) . ']';
        
        return self::selectRaw('*, embedding <-> ? as distance', [$vectorString])
            ->orderBy('distance')
            ->limit($limit)
            ->get();
    }
}
