<?php

function getRealIpAddr() {
	if ( !empty($_SERVER['HTTP_CLIENT_IP']) ) {
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
$badgr['allProperties']['ip'] = getRealIpAddr();

// Pass IP address for geolocation.
require_once("mp/lib/Mixpanel.php");

// Replace this with your mixpanel token
$mp = Mixpanel::getInstance("<YOUR TOKEN>");

$mp->people->set($badgr['userID'], array(), $ip = getRealIpAddr(), $ignore_time = true);

$mp->identify($badgr['userID']);
$mp->track($badgr['event'], $badgr['allProperties']);

?>