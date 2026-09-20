<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\Review;
use Illuminate\Database\Seeder;

class ReviewSeeder extends Seeder
{
    public function run(): void
    {
        $products = Product::all();
        if ($products->isEmpty()) {
            return;
        }

        $sampleReviews = [
            [
                'user_name' => 'Sophia Laurent',
                'rating' => 5,
                'comment' => 'Exquisite craftsmanship! The fabric feel and tailor fit exceed my high expectations. A true wardrobe investment.',
            ],
            [
                'user_name' => 'Julian Vance',
                'rating' => 5,
                'comment' => 'Outstanding quality and attention to detail. Fast delivery to Phnom Penh. Highly recommended for luxury lovers.',
            ],
            [
                'user_name' => 'Elena Rostova',
                'rating' => 4,
                'comment' => 'Very elegant design and premium packaging. Fits true to size and feels very comfortable.',
            ],
            [
                'user_name' => 'Dara Samnang',
                'rating' => 5,
                'comment' => 'Worth every dollar! Authentic luxury aesthetic and superb material. Will buy again.',
            ],
            [
                'user_name' => 'Marcus Sterling',
                'rating' => 5,
                'comment' => 'Flawless stitching and iconic silhouette. Exactly as shown in the multi-angle preview photos.',
            ],
        ];

        foreach ($products as $product) {
            // Seed 2-3 reviews per product if none exist
            if ($product->reviews()->count() === 0) {
                $reviewsToSeed = array_slice($sampleReviews, 0, rand(2, 4));
                foreach ($reviewsToSeed as $rev) {
                    Review::create([
                        'product_id' => $product->id,
                        'user_name' => $rev['user_name'],
                        'rating' => $rev['rating'],
                        'comment' => $rev['comment'],
                    ]);
                }
            }
        }
    }
}

