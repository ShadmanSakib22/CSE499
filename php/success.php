<?php
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Content-Type: application/json');

$env = parse_ini_file('../.env');

$val_id = urlencode($_POST['val_id']);
$store_id = urlencode($env['STORE_ID']);
$store_passwd = urlencode($env['STORE_PASSWORD']);
$requested_url = ("https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php?val_id=" . $val_id . "&store_id=" . $store_id . "&store_passwd=" . $store_passwd . "&v=1&format=json");

$handle = curl_init();
curl_setopt($handle, CURLOPT_URL, $requested_url);
curl_setopt($handle, CURLOPT_RETURNTRANSFER, true);
curl_setopt($handle, CURLOPT_SSL_VERIFYHOST, false);
curl_setopt($handle, CURLOPT_SSL_VERIFYPEER, false);

$result = curl_exec($handle);

if ($result) {
    $code = curl_getinfo($handle, CURLINFO_HTTP_CODE);
    if ($code == 200 && !(curl_errno($handle))) {
        $result = json_decode($result);
        $status = $result->status;
        $tran_date = $result->tran_date;
        $tran_id = $result->tran_id;
        $val_id = $result->val_id;
        $amount = $result->amount;
        $store_amount = $result->store_amount;
        $bank_tran_id = $result->bank_tran_id;
        $card_type = $result->card_type;
        $currency = $result->currency;
        $price = $_GET['price'];

        $response = [
            'status' => $status,
            'tran_date' => $tran_date,
            'tran_id' => $tran_id,
            'price' => $price,
            'currency' => $currency,
        ];

        echo json_encode($response);
    } else {
        echo json_encode(['error' => 'Failed to connect with SSLCOMMERZ']);
    }
} else {
    echo json_encode(['error' => 'Failed to connect with SSLCOMMERZ']);
}

curl_close($handle);