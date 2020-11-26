<?php

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
if (array_key_exists('properties', $badgr) {
	$badgr['properties']['ip'] = getRealIpAddr();
}

?>