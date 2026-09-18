<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->string('slug')->unique();
            $table->decimal('price', 10, 2);
            $table->decimal('original_price', 10, 2)->nullable();
            $table->text('description')->nullable();
            $table->json('sizes')->nullable(); // e.g. ["S", "M", "L", "XL"] or ["EU 40", "EU 41", "EU 42", "EU 43"]
            $table->json('colors')->nullable(); // e.g. ["Black", "White", "Beige"]
            $table->string('image_url');
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_new')->default(false);
            $table->integer('stock')->default(50);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};

