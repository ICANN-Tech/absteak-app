<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\Newsletter\RelationTrait;
use App\Traits\Newsletter\AttributeTrait;
use App\Traits\Newsletter\ScopeTrait;
use App\Traits\Newsletter\SelfReferenceTrait;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\AllowedSort;

class NewsletterLog extends Model
{
    use RelationTrait;
    use AttributeTrait, ScopeTrait, SelfReferenceTrait;

    protected $fillable = [
        'newsletter_id',
        'newsletter_subscriber_id',
        'action',
        'status',
        'details',
        'ip_address',
        'user_agent',
        'metadata',
    ];

    protected $casts = [
        'details' => 'array',
        'metadata' => 'array',
    ];

    protected $appends = [
        'formatted_created_at',
    ];

    /**
     * Get allowed fields for API filtering
     */
    public static function getAllowedFields(): array
    {
        return [
            'id',
            'newsletter_id',
            'newsletter_subscriber_id',
            'action',
            'details',
            'ip_address',
            'user_agent',
            'metadata',
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
            'action',
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
            AllowedFilter::exact('newsletter_id'),
            AllowedFilter::exact('newsletter_subscriber_id'),
            AllowedFilter::exact('action'),
            AllowedFilter::scope('by_action'),
            AllowedFilter::scope('for_newsletter'),
            AllowedFilter::scope('for_subscriber'),
        ];
    }
}
