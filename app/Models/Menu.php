<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use App\Traits\Menu\RelationTrait;
use App\Traits\Menu\AttributeTrait;
use App\Traits\Menu\ScopeTrait;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\AllowedSort;

/**
 * Menu Model
 * 
 * Represents menu items in the restaurant system.
 * Each menu item belongs to a category and supports
 * image uploads, pricing, ingredients, allergens, and availability status.
 * 
 * @property string $id UUID primary key
 * @property string $name Menu item name
 * @property string|null $description Menu item description
 * @property string $slug URL-friendly slug
 * @property string|null $image Menu item image path
 * @property float $price Menu item price
 * @property bool $is_available Whether item is available
 * @property bool $is_featured Whether item is featured
 * @property int $sort_order Display order
 * @property string $category_id Foreign key to categories table
 * @property array|null $ingredients List of ingredients
 * @property array|null $allergens List of allergens
 * @property string|null $preparation_time Preparation time
 * @property int|null $calories Calorie count
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 */
class Menu extends Model
{
    use HasUuids, RelationTrait, AttributeTrait, ScopeTrait;

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