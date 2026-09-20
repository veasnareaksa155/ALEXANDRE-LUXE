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
        'delivery_status',
        'courier_name',
        'courier_phone',
        'driver_lat',
        'driver_lng',
        'estimated_minutes',
    ];

    protected $casts = [
        'total_amount' => 'float',
        'driver_lat' => 'float',
        'driver_lng' => 'float',
        'estimated_minutes' => 'integer',
    ];

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }
}
