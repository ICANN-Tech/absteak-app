<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use App\Traits\Menu\{RelationTrait, AttributeTrait, ScopeTrait};
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\AllowedSort;

class Category extends Model
{
    use HasUuids;
    use RelationTrait, AttributeTrait, ScopeTrait;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<string>
     */
    protected $fillable = [
        'name',
        'description',
        'slug',
        'image',
        'is_active',
        'sort_order',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'is_active' => 'boolean',
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array<string>
     */
    protected $appends = [
        'menu_count',
        'formatted_created_at',
    ];

    /**
     * Get allowed fields for API filtering
     *
     * @return array<string>
     */
    public static function getAllowedFields(): array
    {
        return [
            'id',
            'name',
            'description',
            'slug',
            'image',
            'is_active',
            'sort_order',
            'created_at',
            'updated_at',
        ];
    }

    /**
     * Get allowed sorts for API
     *
     * @return array<string>
     */
    public static function getAllowedSorts(): array
    {
        return [
            'name',
            'sort_order',
            'created_at',
            'updated_at',
        ];
    }

    /**
     * Get allowed filters for API
     *
     * @return array<AllowedFilter>
     */
    public static function getAllowedFilters(): array
    {
        return [
            AllowedFilter::exact('is_active'),
            AllowedFilter::partial('name'),
            AllowedFilter::partial('description'),
            AllowedFilter::scope('active'),
            AllowedFilter::scope('inactive'),
            AllowedFilter::scope('search'),
        ];
    }
}