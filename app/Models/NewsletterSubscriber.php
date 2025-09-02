<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\Newsletter\RelationTrait;
use App\Traits\Newsletter\AttributeTrait;
use App\Traits\Newsletter\ScopeTrait;
use App\Traits\Newsletter\SelfReferenceTrait;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\AllowedSort;

class NewsletterSubscriber extends Model
{
    use HasUuids;
    use RelationTrait, AttributeTrait, ScopeTrait, SelfReferenceTrait;

    protected $fillable = [
        'email',
        'first_name',
        'last_name',
        'is_active',
        'email_verified_at',
        'verification_token',
        'unsubscribe_token',
        'preferences',
        'source',
        'ip_address',
        'user_agent',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'email_verified_at' => 'datetime',
        'preferences' => 'array',
    ];

    protected $hidden = [
        'verification_token',
        'unsubscribe_token',
    ];

    protected $appends = [
        'subscriber_status',
    ];

    /**
     * Get allowed fields for API filtering
     */
    public static function getAllowedFields(): array
    {
        return [
            'id',
            'email',
            'first_name',
            'last_name',
            'is_active',
            'email_verified_at',
            'preferences',
            'source',
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
            'email',
            'first_name',
            'last_name',
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
            AllowedFilter::exact('is_active'),
            AllowedFilter::partial('email'),
            AllowedFilter::partial('first_name'),
            AllowedFilter::partial('last_name'),
            AllowedFilter::exact('source'),
            AllowedFilter::scope('is_active'),
            AllowedFilter::scope('is_inactive'),
            AllowedFilter::scope('is_verified'),
            AllowedFilter::scope('is_unverified'),
        ];
    }
}
