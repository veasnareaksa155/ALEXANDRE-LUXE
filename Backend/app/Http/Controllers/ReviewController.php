<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ReviewController extends Controller
{
    /**
     * Get reviews for a given product.
     */
    public function index($productId): JsonResponse
    {
        $product = Product::find($productId);
        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Product not found'
            ], 404);
        }

        $reviews = Review::where('product_id', $productId)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $reviews,
            'rating' => $product->rating,
            'reviews_count' => $product->reviews_count,
        ]);
    }

    /**
     * Store a new review for a product.
     */
    public function store(Request $request, $productId): JsonResponse
    {
        $product = Product::find($productId);
        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Product not found'
            ], 404);
        }

        $validated = $request->validate([
            'user_name' => 'required|string|max:100',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ]);

        $validated['product_id'] = $productId;

        $review = Review::create($validated);

        // Refresh product model to recalculate updated stats
        $product->refresh();

        return response()->json([
            'success' => true,
            'message' => 'Thank you for your rating & review!',
            'data' => $review,
            'rating' => $product->rating,
            'reviews_count' => $product->reviews_count,
        ], 201);
    }
}

