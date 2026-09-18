<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_id',
        'name',
        'slug',
        'price',
        'original_price',
        'description',
        'sizes',
        'colors',
        'image_url',
        'is_featured',
        'is_new',
        'stock',
    ];

    protected $casts = [
        'sizes' => 'array',
        'colors' => 'array',
        'price' => 'float',
        'original_price' => 'float',
        'is_featured' => 'boolean',
        'is_new' => 'boolean',
        'stock' => 'integer',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }
}

