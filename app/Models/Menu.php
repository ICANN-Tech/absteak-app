<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use App\Traits\Menu\{RelationTrait, AttributeTrait, ScopeTrait};
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\AllowedSort;
use Spatie\Translatable\HasTranslations;

class Menu extends Model
{
    use HasUuids, HasTranslations;
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
        'price',
        'is_available',
        'is_featured',
        'sort_order',
        'category_id',
        'ingredients',
        'allergens',
        'preparation_time',
        'calories',
    ];

    /**
     * The attributes that are translatable.
     *
     * @var array<string>
     */
    protected $translatable = [
        'name',
        'description',
        'ingredients',
        'allergens',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'price' => 'decimal:2',
        'is_available' => 'boolean',
        'is_featured' => 'boolean',
        'ingredients' => 'array',
        'allergens' => 'array',
        'calories' => 'integer',
        'embedding' => 'array',
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array<string>
     */
    protected $appends = [
        'formatted_price',
        'status',
        'ingredients_list',
        'allergens_list',
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
            'price',
            'is_available',
            'is_featured',
            'sort_order',
            'category_id',
            'ingredients',
            'allergens',
            'preparation_time',
            'calories',
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
            'price',
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
            AllowedFilter::exact('is_available'),
            AllowedFilter::exact('is_featured'),
            AllowedFilter::exact('category_id'),
            AllowedFilter::partial('name'),
            AllowedFilter::partial('description'),
            AllowedFilter::scope('available'),
            AllowedFilter::scope('unavailable'),
            AllowedFilter::scope('featured'),
            AllowedFilter::scope('search'),
            AllowedFilter::scope('by_category'),
            AllowedFilter::scope('price_range'),
            AllowedFilter::scope('without_allergens'),
            AllowedFilter::scope('with_ingredients'),
        ];
    }
}