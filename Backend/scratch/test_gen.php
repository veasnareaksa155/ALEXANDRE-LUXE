<?php
require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$c = new App\Http\Controllers\BakongPaymentController();
$req = new Illuminate\Http\Request(['order_id' => 101, 'amount' => 20.0, 'currency' => 'USD']);
$res = $c->generateKhqr($req);
echo json_encode($res->getData(), JSON_PRETTY_PRINT);

