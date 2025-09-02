<?php

namespace App\Traits\Menu;

use Illuminate\Support\Str;
use Carbon\Carbon;

/**
 * Menu Attribute Trait
 * 
 * Provides attribute accessors and mutators for Menu and Category models.
 * Handles data formatting, slug generation, and computed attributes.
 */
trait AttributeTrait
{
    /**
     * Get the category/menu name in title case
     *
     * @param string $value
     * @return string
     */
    public function getNameAttribute($value): string
    {
        return Str::title($value);
    }

    /**
     * Set the category/menu name
     *
     * @param string $value
     * @return void
     */
    public function setNameAttribute($value): void
    {
        $this->attributes['name'] = Str::title($value);
    }

    /**
     * Get the slug attribute
     *
     * @return string
     */
    public function getSlugAttribute(): string
    {
        return $this->attributes['slug'] ?? Str::slug($this->name);
    }

    /**
     * Set the slug attribute
     *
     * @param string $value
     * @return void
     */
    public function setSlugAttribute($value): void
    {
        $this->attributes['slug'] = Str::slug($value ?: $this->name);
    }

    /**
     * Get formatted price (for Menu model)
     *
     * @return string|null
     */
    public function getFormattedPriceAttribute(): ?string
    {
        if (!isset($this->attributes['price'])) {
            return null;
        }
        
        return '$' . number_format($this->price, 2);
    }

    /**
     * Get menu count for category
     *
     * @return int
     */
    public function getMenuCountAttribute(): int
    {
        return $this->menus()->count();
    }

    /**
     * Get active menu count for category
     *
     * @return int
     */
    public function getActiveMenuCountAttribute(): int
    {
        return $this->activeMenus()->count();
    }

    /**
     * Get formatted created date
     *
     * @return string
     */
    public function getFormattedCreatedAtAttribute(): string
    {
        return $this->created_at->format('M d, Y H:i');
    }

    /**
     * Get status attribute (for Menu model)
     *
     * @return string|null
     */
    public function getStatusAttribute(): ?string
    {
        if (!isset($this->attributes['is_available'])) {
            return null;
        }
        
        return $this->is_available ? 'available' : 'unavailable';
    }

    /**
     * Get ingredients as formatted string (for Menu model)
     *
     * @return string|null
     */
    public function getIngredientsListAttribute(): ?string
    {
        if (!isset($this->attributes['ingredients']) || !is_array($this->ingredients)) {
            return null;
        }
        
        return implode(', ', $this->ingredients);
    }

    /**
     * Get allergens as formatted string (for Menu model)
     *
     * @return string|null
     */
    public function getAllergensListAttribute(): ?string
    {
        if (!isset($this->attributes['allergens']) || !is_array($this->allergens)) {
            return null;
        }
        
        return implode(', ', $this->allergens);
    }
}