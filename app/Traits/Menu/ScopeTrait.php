<?php

namespace App\Traits\Menu;

use Illuminate\Database\Eloquent\Builder;
use Carbon\Carbon;

/**
 * Menu Scope Trait
 * 
 * Provides query scopes for Menu and Category models.
 * Handles filtering, searching, and common query patterns.
 */
trait ScopeTrait
{
    /**
     * Scope to get only active categories
     *
     * @param Builder $query
     * @return Builder
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope to get only inactive categories
     *
     * @param Builder $query
     * @return Builder
     */
    public function scopeInactive(Builder $query): Builder
    {
        return $query->where('is_active', false);
    }

    /**
     * Scope to get only available menu items
     *
     * @param Builder $query
     * @return Builder
     */
    public function scopeAvailable(Builder $query): Builder
    {
        return $query->where('is_available', true);
    }

    /**
     * Scope to get only unavailable menu items
     *
     * @param Builder $query
     * @return Builder
     */
    public function scopeUnavailable(Builder $query): Builder
    {
        return $query->where('is_available', false);
    }

    /**
     * Scope to get only featured menu items
     *
     * @param Builder $query
     * @return Builder
     */
    public function scopeFeatured(Builder $query): Builder
    {
        return $query->where('is_featured', true)
                    ->where('is_available', true);
    }

    /**
     * Scope to search categories/menus by name or description
     *
     * @param Builder $query
     * @param string $search
     * @return Builder
     */
    public function scopeSearch(Builder $query, string $search): Builder
    {
        return $query->where(function ($q) use ($search) {
            $q->where('name', 'like', "%{$search}%")
              ->orWhere('description', 'like', "%{$search}%");
        });
    }

    /**
     * Scope to filter by category
     *
     * @param Builder $query
     * @param string $categoryId
     * @return Builder
     */
    public function scopeByCategory(Builder $query, string $categoryId): Builder
    {
        return $query->where('category_id', $categoryId);
    }

    /**
     * Scope to filter by price range
     *
     * @param Builder $query
     * @param float $minPrice
     * @param float $maxPrice
     * @return Builder
     */
    public function scopePriceRange(Builder $query, float $minPrice, float $maxPrice): Builder
    {
        return $query->whereBetween('price', [$minPrice, $maxPrice]);
    }

    /**
     * Scope to order by sort order
     *
     * @param Builder $query
     * @param string $direction
     * @return Builder
     */
    public function scopeOrdered(Builder $query, string $direction = 'asc'): Builder
    {
        return $query->orderBy('sort_order', $direction)
                    ->orderBy('name', 'asc');
    }

    /**
     * Scope to filter by date range
     *
     * @param Builder $query
     * @param string $startDate
     * @param string $endDate
     * @return Builder
     */
    public function scopeDateRange(Builder $query, $startDate, $endDate): Builder
    {
        return $query->whereBetween('created_at', [
            Carbon::parse($startDate)->startOfDay(),
            Carbon::parse($endDate)->endOfDay()
        ]);
    }

    /**
     * Scope to get recent items
     *
     * @param Builder $query
     * @param int $days
     * @return Builder
     */
    public function scopeRecent(Builder $query, int $days = 30): Builder
    {
        return $query->where('created_at', '>=', now()->subDays($days));
    }

    /**
     * Scope to filter by allergens
     *
     * @param Builder $query
     * @param array $allergens
     * @return Builder
     */
    public function scopeWithoutAllergens(Builder $query, array $allergens): Builder
    {
        foreach ($allergens as $allergen) {
            $query->whereJsonDoesntContain('allergens', $allergen);
        }
        
        return $query;
    }

    /**
     * Scope to filter by ingredients
     *
     * @param Builder $query
     * @param array $ingredients
     * @return Builder
     */
    public function scopeWithIngredients(Builder $query, array $ingredients): Builder
    {
        foreach ($ingredients as $ingredient) {
            $query->whereJsonContains('ingredients', $ingredient);
        }
        
        return $query;
    }
}