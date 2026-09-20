<?php
require __DIR__ . '/../vendor/autoload.php';

use KHQR\BakongKHQR;
use KHQR\Models\IndividualInfo;
use KHQR\Helpers\KHQRData;

$individualInfo = new IndividualInfo(
    bakongAccountID: 'veasna_reaksa@bkrt',
    merchantName: 'REAKSA VEASNA',
    merchantCity: 'Phnom Penh',
    currency: KHQRData::CURRENCY_USD,
    amount: 280,
    mobileNumber: '855885232761',
    billNumber: 'LX000001'
);

$qrImageBinary = BakongKHQR::createQrImage($individualInfo);
echo "Image length: " . strlen($qrImageBinary) . " bytes\n";

