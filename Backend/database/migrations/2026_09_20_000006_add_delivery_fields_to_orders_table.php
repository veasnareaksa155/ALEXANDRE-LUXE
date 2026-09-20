<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->string('delivery_status')->default('pending')->after('status');
            $table->string('courier_name')->default('Sokha Delivery Express')->nullable()->after('delivery_status');
            $table->string('courier_phone')->default('+855 12 888 999')->nullable()->after('courier_name');
            $table->decimal('driver_lat', 10, 7)->default(11.5564)->nullable()->after('courier_phone');
            $table->decimal('driver_lng', 10, 7)->default(104.9282)->nullable()->after('driver_lat');
            $table->integer('estimated_minutes')->default(25)->nullable()->after('driver_lng');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn([
                'delivery_status',
                'courier_name',
                'courier_phone',
                'driver_lat',
                'driver_lng',
                'estimated_minutes',
            ]);
        });
    }
};

