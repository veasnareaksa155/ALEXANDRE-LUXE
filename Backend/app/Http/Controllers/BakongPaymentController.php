<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use App\Models\Order;

class BakongPaymentController extends Controller
{
    /**
     * Generate Dynamic Bakong KHQR String & Payload
     */
    public function generateKhqr(Request $request)
    {
        $validated = $request->validate([
            'order_id' => 'required',
            'amount' => 'required|numeric|min:0.01',
            'currency' => 'nullable|string|in:USD,KHR',
        ]);

        $orderId = $validated['order_id'];
        $amount = (float) $validated['amount'];
        $currency = strtoupper($validated['currency'] ?? 'USD');

        // Bakong Merchant Configuration from .env
        $merchantId = env('BAKONG_MERCHANT_ID', 'alexandre_luxe@acleda');
        $merchantName = env('BAKONG_MERCHANT_NAME', 'ALEXANDRE LUXE');
        $storeLabel = env('BAKONG_STORE_LABEL', 'Paris Atelier');
        $terminal = env('BAKONG_TERMINAL', 'WEB-STORE');

        // Generate Unique Bill Number and MD5
        $billNumber = 'BILL-' . $orderId . '-' . time();

        // Standard KHQR Payload structure (Compatible with NBC Bakong Open API / KHQR library)
        $khqrPayload = [
            'merchant_id' => $merchantId,
            'merchant_name' => $merchantName,
            'store_label' => $storeLabel,
            'terminal_label' => $terminal,
            'bill_number' => $billNumber,
            'amount' => number_format($amount, 2, '.', ''),
            'currency' => $currency === 'USD' ? '840' : '116', // ISO 4217 code
        ];

        // Call Bakong Open API if BAKONG_TOKEN is set
        $bakongApiUrl = env('BAKONG_API_URL', 'https://api-bakong.nbc.gov.kh/v1');
        $bakongToken = env('BAKONG_TOKEN', null);

        $qrData = null;
        $md5Hash = md5($billNumber . $amount . $currency . $merchantId);

        if ($bakongToken) {
            try {
                $response = Http::withToken($bakongToken)
                    ->post("{$bakongApiUrl}/generate_khqr", $khqrPayload);

                if ($response->successful()) {
                    $resData = $response->json();
                    $qrData = $resData['data']['qr'] ?? null;
                    $md5Hash = $resData['data']['md5'] ?? $md5Hash;
                }
            } catch (\Exception $e) {
                Log::warning('Bakong API Call failed, generating standard KHQR string: ' . $e->getMessage());
            }
        }

        // Fallback standard KHQR String format if API token is sandbox/testing
        if (!$qrData) {
            $qrData = "00020101021230380016" . $merchantId . "0112ALEXANDRELUXE5204599953038405404" . number_format($amount, 2, '.', '') . "5802KH5914" . $merchantName . "6006PHNOMPENH62150511" . $billNumber . "6304" . strtoupper(substr(md5($billNumber), 0, 4));
        }

        return response()->json([
            'status' => 'success',
            'data' => [
                'order_id' => $orderId,
                'amount' => $amount,
                'currency' => $currency,
                'bill_number' => $billNumber,
                'md5' => $md5Hash,
                'qr_string' => $qrData,
                'merchant_name' => $merchantName,
                'merchant_id' => $merchantId,
                'created_at' => now()->toIso8601String(),
            ]
        ]);
    }

    /**
     * Check Transaction Status by MD5 Hash from Bakong Open API
     */
    public function checkTransactionStatus(Request $request)
    {
        $validated = $request->validate([
            'md5' => 'required|string',
            'order_id' => 'nullable',
        ]);

        $md5 = $validated['md5'];
        $bakongApiUrl = env('BAKONG_API_URL', 'https://api-bakong.nbc.gov.kh/v1');
        $bakongToken = env('BAKONG_TOKEN', null);

        if ($bakongToken) {
            try {
                $response = Http::withToken($bakongToken)
                    ->post("{$bakongApiUrl}/check_transaction_by_md5", [
                        'md5' => $md5
                    ]);

                if ($response->successful()) {
                    $resData = $response->json();
                    $responseCode = $resData['responseCode'] ?? 1;

                    if ($responseCode === 0) {
                        // Payment confirmed on Bakong Network!
                        if (!empty($validated['order_id'])) {
                            $order = Order::find($validated['order_id']);
                            if ($order) {
                                $order->status = 'Processing';
                                $order->payment_method = 'bakong';
                                $order->save();
                            }
                        }

                        return response()->json([
                            'status' => 'success',
                            'paid' => true,
                            'message' => 'Payment confirmed on Bakong KHQR network!',
                            'transaction' => $resData['data'] ?? []
                        ]);
                    }
                }
            } catch (\Exception $e) {
                Log::error('Bakong check transaction error: ' . $e->getMessage());
            }
        }

        // Return current status (simulated success for testing mode if token missing)
        return response()->json([
            'status' => 'success',
            'paid' => false,
            'message' => 'Waiting for Bakong payment scan...',
            'md5' => $md5
        ]);
    }

    /**
     * Bakong Webhook Callback
     */
    public function handleCallback(Request $request)
    {
        Log::info('Bakong Webhook Callback received: ', $request->all());

        $md5 = $request->input('md5');
        $orderNumber = $request->input('bill_number');

        if ($orderNumber) {
            $order = Order::where('order_number', $orderNumber)->first();
            if ($order) {
                $order->status = 'Processing';
                $order->save();
            }
        }

        return response()->json(['status' => 'acknowledged']);
    }
}

