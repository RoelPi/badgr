<?php

$sett = 'https://us-central1-roelpeters-blog.cloudfunctions.net/Sett-prod';

function getRealIpAddr() {
	if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
		// Check IP from internet.
		$ip = $_SERVER['HTTP_CLIENT_IP'];
	} elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR']) ) {
		// Check IP is passed from proxy.
		$ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
	} else {
		// Get IP address from remote address.
		$ip = $_SERVER['REMOTE_ADDR'];
	}
	return $ip;
}

$badgr = json_decode(file_get_contents('php://input'), true);
if (array_key_exists('hit_properties', $badgr)) {
	$badgr['hit_properties']['ip'] = getRealIpAddr();
}

$conn = curl_init($sett);
curl_setopt($conn, CURLOPT_POST, 1);
curl_setopt($conn, CURLOPT_POSTFIELDS, json_encode($badgr));
curl_setopt($conn, CURLOPT_HTTPHEADER, array('Content-Type:application/json'));
curl_setopt($conn, CURLOPT_RETURNTRANSFER, true);

$resp = curl_exec($conn);
curl_close($conn);

echo $resp;