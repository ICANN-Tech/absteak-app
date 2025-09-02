<?php

namespace App\Traits\Menu;

use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\Menu;
use App\Models\Category;

/**
 * Menu Relation Trait
 * 
 * Provides relationship methods for Menu and Category models.
 * Handles the relationships between categories and menu items.
 */
trait RelationTrait
{
    /**
     * Category has many menu items
     *
     * @return HasMany
     */
    public function menus(): HasMany
    {
        return $this->hasMany(Menu::class)->orderBy('sort_order');
    }

    /**
     * Category has many active menu items
     *
     * @return HasMany
     */
    public function activeMenus(): HasMany
    {
        return $this->hasMany(Menu::class)
                    ->where('is_available', true)
                    ->orderBy('sort_order');
    }

    /**
     * Category has many featured menu items
     *
     * @return HasMany
     */
    public function featuredMenus(): HasMany
    {
        return $this->hasMany(Menu::class)
                    ->where('is_featured', true)
                    ->where('is_available', true)
                    ->orderBy('sort_order');
    }

    /**
     * Menu belongs to a category
     *
     * @return BelongsTo
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }
}