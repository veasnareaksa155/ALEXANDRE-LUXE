<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Shirt',
                'slug' => 'shirt',
                'description' => 'Luxury tailored dress shirts and button-downs crafted from premium fabrics.'
            ],
            [
                'name' => 'T-Shirt',
                'slug' => 't-shirt',
                'description' => 'Essential heavyweight cotton tees and modern minimalist luxury graphic tees.'
            ],
            [
                'name' => 'Shoes',
                'slug' => 'shoes',
                'description' => 'Premium handcrafted leather sneakers, loafers, and minimal everyday footwear.'
            ],
        ];

        foreach ($categories as $cat) {
            Category::updateOrCreate(['slug' => $cat['slug']], $cat);
        }
    }
}

