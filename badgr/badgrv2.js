window.badgr = (function() {
    'use strict';
    
    var d = document,
        n = navigator,
        s = screen,
        w = window,
        p = w.performance || w.mozPerformance || w.msPerformance || w.webkitPerformance,
        badgr = {}


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
    if (n.appVersion.indexOf("X11") != -1) OSName = "UNIX";
    if (n.appVersion.indexOf("Linux") != -1) OSName = "Linux";

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
    const touchpoints = isDefined(n.maxTouchPoints) ? n.maxTouchPoints.toString() : '0';
	const hardwareConcurrency = isDefined(n.hardwareConcurrency) ? n.hardwareConcurrency.toString() : '0';
    const deviceMemory = isDefined(n.deviceMemory) ? n.deviceMemory.toString() : '0';

    var device = "desktop";
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(n.userAgent)) {
        device = "tablet";
    }
    if (/Mobile|iP(hone|od|ad)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(n.userAgent)) {
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
    
    return badgr
})();
