window.badgr = (function() {
    'use strict';
    
    var d = document,
        n = navigator,
        s = screen,
        w = window,
        p = w.performance || w.mozPerformance || w.msPerformance || w.webkitPerformance,
        badgr = {}

    const environment = '';
    const dt = new Date();
    const dtOffset = dt.getTimezoneOffset().toString();
    const endpoint = '';
    const visitLength = 0.5; // hours

    /***************************************/
    /* Private Methods *********************/
    /***************************************/
    const isDefined = function(property) {
		return typeof property !== 'undefined';
    }
    
	const isString = function(property) {
		return typeof property === 'string' || property instanceof String;
    }
    const decode = function(url) {
        try {
            return w.decodeURIComponent(url);
        } catch (e) {
            return unescape(url);
        }
    }

    const extractHostname = function(url) {
		var hostname;
		if (url.indexOf("//") > -1) {
			hostname = url.split('/')[2];
		}
		else {
			hostname = url.split('/')[0];
		}
		hostname = hostname.split(':')[0];
		hostname = hostname.split('?')[0];
		return hostname;
	}

    const getReferrer = function() {
		var referrer = '';

		try {
			referrer = w.top.document.referrer;
		} catch (e) {
			if (w.parent) {
				try {
					referrer = w.parent.document.referrer;
				} catch (e2) {
					referrer = "";
				}
			}
		}

		if (referrer === "") {
			referrer = d.referrer;
		}

		return referrer;
    }

    const getDate = function(dateObj = undefined) {
		if (dateObj == undefined) {
			dateObj = new Date();
		}
		var dd = String(dateObj.getDate()).padStart(2, '0');
		var mm = String(dateObj.getMonth() + 1).padStart(2, '0'); //January is 0!
		var yyyy = dateObj.getFullYear();

		dateStr = yyyy + '-' + mm + '-' + dd;
		return dateStr
	}

	const getDateTime = function(dateObj = undefined) {
		if (dateObj == undefined) {
			dateObj = new Date();
		}
		return dateObj.toISOString();
	}

	const getCookie = function(cname) {
		var name = cname + "=";
		var decodedCookie = decodeURIComponent(document.cookie);
		var ca = decodedCookie.split(';');
		for (var i = 0; i < ca.length; i++) {
			var c = ca[i];
			while (c.charAt(0) == ' ') {
				c = c.substring(1);
			}
			if (c.indexOf(name) == 0) {
				return c.substring(name.length, c.length);
			}
		}
		return "";
	}

    const getUrlParameter = function(url, name) {
		var regexSearch = "[\\?&#]" + name + "=([^&#]*)";
		var regex = new RegExp(regexSearch);
		var results = regex.exec(url);
		return results ? decodeWrapper(results[1]) : '';
	}

    /* Get Referrers
    /**************************************/
    const referrer = getReferrer();
    const referringDomain = extractHostname(referrer);
    if (!referrer.includes(w.location.hostname) || w.location.hostname == "") {
        // Set initial referrer
        localStorage.setItem('initial_referrer', referrer)
        // Set referring domain
        localStorage.setItem('initial_referring_domain', extractHostname(referrer))

        // Set search engine
        if (referrer.includes('google')) {
            localStorage.setItem('search_engine','Google')
        } else if (referrer.includes('bing')) {
            localStorage.setItem('search_engine', 'Bing')
        } else if (referrer.includes('yandex')) {
            localStorage.setItem('search_engine', 'Yandex')
        } else if (referrer.includes('swisscows')) {
            localStorage.setItem('search_engine', 'Swisscows')
        } else if (referrer.includes('duckduckgo')) {
            localStorage.setItem('search_engine', 'DuckDuckGo')
        } else if (referrer.includes('startpage')) {
            localStorage.setItem('search_engine', 'Startpage')
        } else if (referrer.includes('searchencrypt')) {
            localStorage.setItem('search_engine', 'Search Encrypt')
        } else if (referrer.includes('gibiru')) {
            localStorage.setItem('search_engine', 'Gibiru')
        } else if (referrer.includes('onesearch')) {
            localStorage.setItem('search_engine', 'OneSearch')
        } else if (referrer.includes('yahoo')) {
            localStorage.setItem('search_engine', 'Yahoo')
        } else if (referrer.includes('givewater')) {
            localStorage.setItem('search_engine', 'giveWater')
        } else if (referrer.includes('ekoru')) {
            localStorage.setItem('search_engine', 'Ekoru')
        } else if (referrer.includes('ecosia')) {
            localStorage.setItem('search_engine', 'Ecosia')
        } else if (referrer.includes('boardreader')) {
            localStorage.setItem('search_engine', 'Boardreader')
        } else if (referrer.includes('qwant')) {
            localStorage.setItem('search_engine', 'Qwant')
        } else {
            localStorage.setItem('search_engine', 'none')
        }
        
    } 
    const initialReferrer = localStorage.getItem('initial_referrer');
    const initialReferringDomain = localStorage.getItem('initial_referring_domain');
    const searchEngine = localStorage.getItem('search_engine');

    var OSName = "Unknown OS";
    if (n.appVersion.indexOf("Win") != -1) OSName = "Windows";
    if (n.appVersion.indexOf("Mac") != -1) OSName = "MacOS";
    if (n.appVersion.indexOf("X11") != -1) OSName = "Unix";
    if (n.appVersion.indexOf("Linux") != -1) OSName = "Linux";

    /* Get URL  
    /**************************************/
    const queryString = isDefined(w.location.search) ? w.location.search.toString() : '';
    const protocol = isDefined(w.location.protocol) ? w.location.protocol.toString() : '';
    const hostname = isDefined(w.location.host) ? w.location.host.toString() : '';
    const href = isDefined(w.location.href) ? w.location.href.toString() : '';

    const paramCampaign = getUrlParameter(href, 'utm_campaign');
    const paramSource = getUrlParameter(href, 'utm_source');
    const paramMedium = getUrlParameter(href, 'utm_medium');
    const paramContent = getUrlParameter(href, 'utm_content');
    const paramTerm = getUrlParameter(href, 'utm_term');

    const urlParams = (function() {
		var searchParams = new URLSearchParams(queryString);
		var paramsJSON = [];
		for(var pair of searchParams.entries()) {
			if (!(pair[0] in ['utm_source', 'utm_medium','utm_campaign','utm_content','utm_term'])) {
				paramsJSON.push({"paramName": pair[0].toString(), "paramValue": pair[1].toString()})
			}
		}
		return paramsJSON;
	})()

    /* Get Title 
    /**************************************/
    const title = (function() {
		var title = d.title;
		title = title && title.text ? title.text : title;

		if (!isString(title)) {
			var tmp = d.getElementsByTagName('title');
			if (tmp && this.isDefined(tmp[0])) {
				title = tmp[0].text;
			}
		}
		return title;
    })()

    /* Get Machine Properties
    /**************************************/
    const nTouchpoints = isDefined(n.maxTouchPoints) ? n.maxTouchPoints.toString() : '0';
	const hardwareConcurrency = isDefined(n.hardwareConcurrency) ? n.hardwareConcurrency.toString() : '0';
    const deviceMemory = isDefined(n.deviceMemory) ? n.deviceMemory.toString() : '0';
    const userAgent = n.userAgent;
    const navPlatform = n.platform;
    const screenWidth = s.width;
    const screenHeight = s.height;
    const colorDepth = s.colorDepth;

    var device = "desktop";
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(userAgent)) {
        device = "tablet";
    }
    if (/Mobile|iP(hone|od|ad)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(userAgent)) {
        device = "mobile";
    }

    /* Get Browser Properties
    /**************************************/
    const language = n.language;
	const languages = isDefined(n.languages) ? n.languages.toString() : n.language;
	const cookiesEnabled = n.cookieEnabled ? "Cookies Enabled" : "Cookies Not Enabled";
	const javaEnabled = (function() {
		if ((new RegExp('Edge[ /](\\d+[\\.\\d]+)')).test(n.userAgent)) {
			return 'Java Enabled By Default'
		}
		if 	(typeof n.javaEnabled !== 'unknown' && isDefined(n.javaEnabled) && n.javaEnabled()) {
			return 'Java Enabled';
		} else {
			return 'Java Not Enabled'
        }
    })();

    var navUserAgent = n.userAgent;
    var browserName = n.appName;
    var browserVersion = '' + parseFloat(n.appVersion);
    var majorVersion = parseInt(n.appVersion, 10);
    var tempNameOffset, tempVersionOffset, tempVersion;

    if ((tempVersionOffset = navUserAgent.indexOf("Opera")) != -1) {
        browserName = "Opera";
        browserVersion = navUserAgent.substring(tempVersionOffset + 6);
        if ((tempVersionOffset = navUserAgent.indexOf("Version")) != -1)
            browserVersion = navUserAgent.substring(tempVersionOffset + 8);
    } else if ((tempVersionOffset = navUserAgent.indexOf("MSIE")) != -1) {
        browserName = "Microsoft Internet Explorer";
        browserVersion = navUserAgent.substring(tempVersionOffset + 5);
    } else if ((tempVersionOffset = navUserAgent.indexOf("Chrome")) != -1) {
        browserName = "Chrome";
        browserVersion = navUserAgent.substring(tempVersionOffset + 7);
    } else if ((tempVersionOffset = navUserAgent.indexOf("Safari")) != -1) {
        browserName = "Safari";
        browserVersion = navUserAgent.substring(tempVersionOffset + 7);
        if ((tempVersionOffset = navUserAgent.indexOf("Version")) != -1)
            browserVersion = navUserAgent.substring(tempVersionOffset + 8);
    } else if ((tempVersionOffset = navUserAgent.indexOf("Firefox")) != -1) {
        browserName = "Firefox";
        browserVersion = navUserAgent.substring(tempVersionOffset + 8);
    } else if ((tempNameOffset = navUserAgent.lastIndexOf(' ') + 1) < (tempVersionOffset = navUserAgent.lastIndexOf('/'))) {
        browserName = navUserAgent.substring(tempNameOffset, tempVersionOffset);
        browserVersion = navUserAgent.substring(tempVersionOffset + 1);
        if (browserName.toLowerCase() == browserName.toUpperCase()) {
            browserName = n.appName;
        }
    }

    if ((tempVersion = browserVersion.indexOf(";")) != -1) {
        browserVersion = browserVersion.substring(0, tempVersion);
    }

    if ((tempVersion = browserVersion.indexOf(" ")) != -1) {
        browserVersion = browserVersion.substring(0, tempVersion);
    }

    var cookies = (function() {
		var cookies = {};
		if (document.cookie && document.cookie != '') {
			var split = document.cookie.split(';');
			for (var i = 0; i < split.length; i++) {
				var name_value = split[i].split("=");
				name_value[0] = name_value[0].replace(/^ /, '');
				cookies[decodeURIComponent(name_value[0])] = decodeURIComponent(name_value[1]);
			}
		}
		
		var cookiesJSON = [];
		for (var name in cookies) {
			cookiesJSON.push({"cookieName": name, "cookieValue": cookies[name]})
		}
		return cookiesJSON;
	})()
    
    /* Get UserIDs
    /**************************************/
    var food = {
        "hit_id": null,
        "user_id": null,
        "visit_id": null,
        "browser_name": browserName,
        "browser_major_version": majorVersion,
        "browser_version": browserVersion,
        "device": device,
        "current_url": href,
        "initial_referrer": initialReferrer,
        "initial_referring_domain": initialReferringDomain,
        "referring_search_engine": searchEngine,
        "os": OSName,
        "referrer": referrer,
        "referring_domain": referringDomain,
        "screen_height": screenHeight,
        "screen_width": screenWidth,
        "query_string": queryString,
        "page_title": title,
        "protocol": protocol,
        "hostname": hostname,
        "utm_campaign": paramCampaign,
        "utm_source": paramSource,
        "utm_medium": paramMedium,
        "utm_content": paramContent,
        "utm_term": paramTerm,
        "color_depth": colorDepth,
        "browser_language": language,
        "browser_languages": languages,
        "timezone_offset": dtOffset,
        "user_agent": userAgent,
        "navigator_platform": navPlatform,
        "n_touchpoints": nTouchpoints,
        "device_memory": deviceMemory,
        "hardware_concurrency": hardwareConcurrency,
        "is_java": javaEnabled,
        "is_cookie": cookiesEnabled,
        "queries": urlParams,
        "cookies": cookies
    }
    return badgr
})();
