<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use App\Traits\Newsletter\RelationTrait;
use App\Traits\Newsletter\AttributeTrait;
use App\Traits\Newsletter\ScopeTrait;
use App\Traits\Newsletter\SelfReferenceTrait;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\AllowedSort;

class Newsletter extends Model
{
    use HasUuids, RelationTrait, AttributeTrait, ScopeTrait, SelfReferenceTrait;

    protected $fillable = [
        'title',
        'content',
        'excerpt',
        'slug',
        'is_published',
        'published_at',
        'is_distributed',
        'distributed_at',
        'user_id',
        'meta_title',
        'meta_description',
        'featured_image',
        'tags',
    ];

    protected $casts = [
        'is_published' => 'boolean',
        'published_at' => 'datetime',
        'is_distributed' => 'boolean',
        'distributed_at' => 'datetime',
        'tags' => 'array',
    ];

    protected $appends = [
        'excerpt',
        'slug',
        'status',
        'formatted_published_at',
    ];

    /**
     * Get allowed fields for API filtering
     */
    public static function getAllowedFields(): array
    {
        return [
            'id',
            'title',
            'content',
            'excerpt',
            'slug',
            'is_published',
            'published_at',
            'user_id',
            'meta_title',
            'meta_description',
            'featured_image',
            'tags',
            'created_at',
            'updated_at',
        ];
    }

    /**
     * Get allowed sorts for API
     */
    public static function getAllowedSorts(): array
    {
        return [
            'title',
            'published_at',
            'created_at',
            'updated_at',
        ];
    }

    /**
     * Get allowed filters for API
     */
    public static function getAllowedFilters(): array
    {
        return [
            AllowedFilter::exact('is_published'),
            AllowedFilter::exact('user_id'),
            AllowedFilter::partial('title'),
            AllowedFilter::partial('content'),
            AllowedFilter::scope('search'),
            AllowedFilter::scope('date_range'),
            AllowedFilter::scope('by_author'),
            AllowedFilter::scope('recent'),
        ];
    }
}
