<?php
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

try {
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}


$env = parse_ini_file('../.env');

// Receive the POST data
$post_data = json_decode(file_get_contents('php://input'), true);

// Your SSLCommerz store ID and password
$store_id = $env['STORE_ID'];
$store_passwd = $env['STORE_PASSWORD'];

$post_data['store_id'] = $store_id;
$store_passwd = $store_passwd;

$post_data['signature_key'] = $store_passwd;

# CURL request
$handle = curl_init();
curl_setopt($handle, CURLOPT_URL, "https://sandbox.sslcommerz.com/gwprocess/v3/api.php");
curl_setopt($handle, CURLOPT_TIMEOUT, 30);
curl_setopt($handle, CURLOPT_CONNECTTIMEOUT, 30);
curl_setopt($handle, CURLOPT_POST, 1);
curl_setopt($handle, CURLOPT_POSTFIELDS, $post_data);
curl_setopt($handle, CURLOPT_RETURNTRANSFER, true);
curl_setopt($handle, CURLOPT_SSL_VERIFYPEER, FALSE);
curl_setopt($handle, CURLOPT_SSL_VERIFYHOST, FALSE);

$content = curl_exec($handle);

$code = curl_getinfo($handle, CURLINFO_HTTP_CODE);

if ($code == 200 && !(curl_errno($handle))) {
    curl_close($handle);
    $sslcommerzResponse = $content;
} else {
    curl_close($handle);
    echo "FAILED TO CONNECT WITH SSLCOMMERZ API";
    exit;
}

# PARSE THE JSON RESPONSE
$sslcz = json_decode($sslcommerzResponse, true);

if (isset($sslcz['GatewayPageURL']) && $sslcz['GatewayPageURL'] != "") {
    echo json_encode(['GatewayPageURL' => $sslcz['GatewayPageURL']]);
} else {
    echo "JSON Data parsing error!";
}

    if (isset($sslcz['GatewayPageURL']) && $sslcz['GatewayPageURL'] != "") {
        echo json_encode(['GatewayPageURL' => $sslcz['GatewayPageURL']]);
    } else {
        throw new Exception("Failed to generate Gateway URL");
    }
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}