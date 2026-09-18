<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $shirtCategory = Category::where('slug', 'shirt')->first();
        $tshirtCategory = Category::where('slug', 't-shirt')->first();
        $shoesCategory = Category::where('slug', 'shoes')->first();

        $clothingSizes = ["S", "M", "L", "XL"];
        $shoeSizes = ["EU 40", "EU 41", "EU 42", "EU 43", "EU 44"];

        $products = [
            // --- SHIRTS ---
            [
                'category_id' => $shirtCategory->id,
                'name' => 'Monochrome Silk Oxford Shirt',
                'slug' => 'monochrome-silk-oxford-shirt',
                'price' => 149.00,
                'original_price' => 189.00,
                'description' => 'Crafted from 100% pure Mulberry silk, featuring custom mother-of-pearl buttons and a sharp tailored modern fit.',
                'sizes' => $clothingSizes,
                'colors' => ['Black', 'White', 'Charcoal'],
                'image_url' => 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80',
                'is_featured' => true,
                'is_new' => true,
                'stock' => 45,
            ],
            [
                'category_id' => $shirtCategory->id,
                'name' => 'Classic Luxe White Dress Shirt',
                'slug' => 'classic-luxe-white-dress-shirt',
                'price' => 129.00,
                'original_price' => null,
                'description' => 'Timeless white dress shirt with Italian collar, anti-wrinkle weave, and hand-finished seam detailing.',
                'sizes' => $clothingSizes,
                'colors' => ['White'],
                'image_url' => 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=80',
                'is_featured' => true,
                'is_new' => false,
                'stock' => 60,
            ],
            [
                'category_id' => $shirtCategory->id,
                'name' => 'Minimalist Charcoal Linen Shirt',
                'slug' => 'minimalist-charcoal-linen-shirt',
                'price' => 119.00,
                'original_price' => 149.00,
                'description' => 'Lightweight French linen shirt designed for breathable elegance with a relaxed unstructured silhouette.',
                'sizes' => $clothingSizes,
                'colors' => ['Charcoal', 'Off-White'],
                'image_url' => 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
                'is_featured' => false,
                'is_new' => true,
                'stock' => 30,
            ],
            [
                'category_id' => $shirtCategory->id,
                'name' => 'Oversized Black Satin Button Down',
                'slug' => 'oversized-black-satin-button-down',
                'price' => 139.00,
                'original_price' => null,
                'description' => 'Avant-garde oversized drape shirt in glossy black satin. Designed for sleek night out styling.',
                'sizes' => $clothingSizes,
                'colors' => ['Black'],
                'image_url' => 'https://images.unsplash.com/photo-1589310243389-96a5483213a8?auto=format&fit=crop&w=800&q=80',
                'is_featured' => false,
                'is_new' => true,
                'stock' => 25,
            ],

            // --- T-SHIRTS ---
            [
                'category_id' => $tshirtCategory->id,
                'name' => 'Essential Heavyweight Black Tee',
                'slug' => 'essential-heavyweight-black-tee',
                'price' => 59.00,
                'original_price' => 75.00,
                'description' => '280 GSM ultra-heavyweight combed organic cotton tee with a boxy fit and subtle neck collar support.',
                'sizes' => $clothingSizes,
                'colors' => ['Black', 'White'],
                'image_url' => 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
                'is_featured' => true,
                'is_new' => true,
                'stock' => 100,
            ],
            [
                'category_id' => $tshirtCategory->id,
                'name' => 'Luxe Supima Cotton White Tee',
                'slug' => 'luxe-supima-cotton-white-tee',
                'price' => 49.00,
                'original_price' => null,
                'description' => 'Ultra-soft long-staple Supima cotton T-shirt featuring a subtle satin feel and custom Alexandre Luxe silicone wash.',
                'sizes' => $clothingSizes,
                'colors' => ['White'],
                'image_url' => 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80',
                'is_featured' => true,
                'is_new' => false,
                'stock' => 80,
            ],
            [
                'category_id' => $tshirtCategory->id,
                'name' => 'Minimalist Monochrome Graphic Tee',
                'slug' => 'minimalist-monochrome-graphic-tee',
                'price' => 69.00,
                'original_price' => 89.00,
                'description' => 'Clean typography graphic print on premium heavyweight cotton, embodying street luxury culture.',
                'sizes' => $clothingSizes,
                'colors' => ['Black', 'Grey'],
                'image_url' => 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80',
                'is_featured' => false,
                'is_new' => true,
                'stock' => 50,
            ],
            [
                'category_id' => $tshirtCategory->id,
                'name' => 'Vintage Dark Washed Drop Shoulder Tee',
                'slug' => 'vintage-dark-washed-drop-shoulder-tee',
                'price' => 65.00,
                'original_price' => null,
                'description' => 'Acid-washed dark grey heavy tee with dropped shoulder seam for a relaxed urban vibe.',
                'sizes' => $clothingSizes,
                'colors' => ['Dark Grey'],
                'image_url' => 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=800&q=80',
                'is_featured' => false,
                'is_new' => false,
                'stock' => 40,
            ],

            // --- SHOES ---
            [
                'category_id' => $shoesCategory->id,
                'name' => 'Minimalist White Calfskin Leather Sneakers',
                'slug' => 'minimalist-white-calfskin-leather-sneakers',
                'price' => 220.00,
                'original_price' => 260.00,
                'description' => 'Italian full-grain calfskin upper with custom Margom rubber sole and gold embossed serial numbers.',
                'sizes' => $shoeSizes,
                'colors' => ['White', 'Monochrome'],
                'image_url' => 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80',
                'is_featured' => true,
                'is_new' => true,
                'stock' => 35,
            ],
            [
                'category_id' => $shoesCategory->id,
                'name' => 'Black Edition Runner Sneakers',
                'slug' => 'black-edition-runner-sneakers',
                'price' => 195.00,
                'original_price' => null,
                'description' => 'Chunky modern futuristic silhouette in triple black premium mesh, nubuck leather, and cushionedEVA sole.',
                'sizes' => $shoeSizes,
                'colors' => ['Triple Black'],
                'image_url' => 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80',
                'is_featured' => true,
                'is_new' => true,
                'stock' => 28,
            ],
            [
                'category_id' => $shoesCategory->id,
                'name' => 'Luxury Leather Oxford Derby Shoes',
                'slug' => 'luxury-leather-oxford-derby-shoes',
                'price' => 280.00,
                'original_price' => 320.00,
                'description' => 'Goodyear welted hand-polished black leather dress shoes with stacked heel and leather lining.',
                'sizes' => $shoeSizes,
                'colors' => ['Black'],
                'image_url' => 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=800&q=80',
                'is_featured' => false,
                'is_new' => false,
                'stock' => 20,
            ],
            [
                'category_id' => $shoesCategory->id,
                'name' => 'Retro High-Top Leather Sneakers',
                'slug' => 'retro-high-top-leather-sneakers',
                'price' => 210.00,
                'original_price' => null,
                'description' => 'Heritage high-top silhouette in contrast black and white leather with padded ankle collars.',
                'sizes' => $shoeSizes,
                'colors' => ['Black/White'],
                'image_url' => 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80',
                'is_featured' => false,
                'is_new' => true,
                'stock' => 30,
            ],
        ];

        foreach ($products as $p) {
            Product::updateOrCreate(['slug' => $p['slug']], $p);
        }
    }
}

