<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_number',
        'customer_name',
        'customer_email',
        'phone',
        'shipping_address',
        'payment_method',
        'total_amount',
        'status',
    ];

    protected $casts = [
        'total_amount' => 'float',
    ];

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }
}

