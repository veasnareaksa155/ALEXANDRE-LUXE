<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'customer_name' => 'required|string|max:255',
            'customer_email' => 'required|email|max:255',
            'phone' => 'required|string|max:50',
            'shipping_address' => 'required|string',
            'payment_method' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.size' => 'nullable|string',
            'items.*.color' => 'nullable|string',
        ]);

        $orderNumber = 'LX-' . strtoupper(Str::random(8));
        $totalAmount = 0;

        $order = Order::create([
            'order_number' => $orderNumber,
            'customer_name' => $validated['customer_name'],
            'customer_email' => $validated['customer_email'],
            'phone' => $validated['phone'],
            'shipping_address' => $validated['shipping_address'],
            'payment_method' => $validated['payment_method'] ?? 'card',
            'total_amount' => 0,
            'status' => 'completed',
        ]);

        foreach ($validated['items'] as $itemData) {
            $product = \App\Models\Product::find($itemData['product_id']);
            if (!$product)
                continue;

            $itemPrice = $product->price;
            $subtotal = $itemPrice * $itemData['quantity'];
            $totalAmount += $subtotal;

            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $product->id,
                'product_name' => $product->name,
                'price' => $itemPrice,
                'quantity' => $itemData['quantity'],
                'size' => $itemData['size'] ?? null,
                'color' => $itemData['color'] ?? null,
            ]);
        }

        $order->update(['total_amount' => $totalAmount]);

        return response()->json([
            'success' => true,
            'message' => 'Order created successfully!',
            'data' => $order->load('items')
        ], 201);
    }

    public function index(): JsonResponse
    {
        $orders = Order::with('items')->orderBy('created_at', 'desc')->get();

        return response()->json([
            'success' => true,
            'count' => $orders->count(),
            'data' => $orders
        ]);
    }

    public function updateStatus(Request $request, $id): JsonResponse
    {
        $order = Order::find($id);
        if (!$order) {
            return response()->json(['success' => false, 'message' => 'Order not found'], 404);
        }

        $validated = $request->validate([
            'status' => 'required|string|in:pending,processing,shipped,delivered,completed,cancelled',
        ]);

        $order->update(['status' => $validated['status']]);

        return response()->json([
            'success' => true,
            'message' => 'Order status updated successfully!',
            'data' => $order->load('items')
        ]);
    }

    public function destroy($id): JsonResponse
    {
        $order = Order::find($id);
        if (!$order) {
            return response()->json(['success' => false, 'message' => 'Order not found'], 404);
        }

        $order->delete();

        return response()->json([
            'success' => true,
            'message' => 'Order deleted successfully!'
        ]);
    }
}