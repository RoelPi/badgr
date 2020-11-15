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
$mp->identify($badgr['userID']);
if ($badgr['action'] == 'track') {
	$mp->people->set($badgr['userID'], array(), $ip = getRealIpAddr(), $ignore_time = true);
	$mp->track($badgr['event'], $badgr['allProperties']);
} elseif ($badgr['action'] == 'setProfile') {
	$mp->people->set($badgr['userID'], $badgr['userProperties'], $ip = getRealIpAddr(), $ignore_time = true);
} elseif ($badgr['action'] == 'increment') {
	$mp->people->increment($badgr['userID'], $badgr['metric'], $badgr['incValue']);
} elseif ($badgr['action'] == 'addToList') {
	$mp->people->append($badgr['userID'], $badgr['list'], $badgr['item']);
}

?>