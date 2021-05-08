window.badgr = (function() {
    'use strict';
    
    var d = document,
        n = navigator,
        s = screen,
        w = window,
        p = w.performance || w.mozPerformance || w.msPerformance || w.webkitPerformance,
        badgr = {}

    var THE_SCRIPT = d.querySelector("#badgr"),
        ENV = THE_SCRIPT.getAttribute("env"),
        DEBUG_MODE = !(ENV == "production"),
        HOLE = THE_SCRIPT.getAttribute('destination')
    var dt = new Date();
    var dtOffset = dt.getTimezoneOffset().toString();
    var visitLength = 0.5; // hours

    /***************************************/
    /* Private Methods *********************/
    /***************************************/
    var isDefined = function(property) {
		return typeof property !== 'undefined';
    }
    
	var isString = function(property) {
		return typeof property === 'string' || property instanceof String;
    }
    var decode = function(url) {
        try {
            return w.decodeURIComponent(url);
        } catch (e) {
            return unescape(url);
        }
    }

    var utf8Encode = function(arg) {
        return unescape(w.encodeURIComponent(arg));
    }

    var extractHostname = function(url) {
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

    var getReferrer = function() {
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

    var getDate = function(dateObj = undefined) {
		if (dateObj == undefined) {
			dateObj = new Date();
		}
		var dd = String(dateObj.getDate()).padStart(2, '0');
		var mm = String(dateObj.getMonth() + 1).padStart(2, '0'); //January is 0!
		var yyyy = dateObj.getFullYear();

		dateStr = yyyy + '-' + mm + '-' + dd;
		return dateStr
	}

	var getDateTime = function(dateObj = undefined) {
		if (dateObj == undefined) {
			dateObj = new Date();
		}
		return dateObj.toISOString();
	}

	var getCookie = function(cname) {
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

    var generateRandom = function(length) {
		var result = '';
		var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		var charactersLength = characters.length;
		for (var i = 0; i < length; i++) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength));
		}
		return result;
    }

    var shuffleStr = function(str) {
        return str.split('').sort(function(){
            return 0.5 - Math.random()
        }).join('');
    }
    
    // User ID is part fingerprint, part random
    // This is also user for visit id
    var generateUserID = function(fp) {
        return shuffleStr(fp).substr(1,6) + generateRandom(6);
    }

    var setIDCookie = function(cn, fp, duration) {
        var cn = w.encodeURIComponent(utf8Encode(cn));
        var d = new Date();
        var badgrid = getCookie(cn);
        badgrid = (badgrid == "") ? badgrid = generateUserID(fp) : badgrid;
        badgrid = w.encodeURIComponent(utf8Encode(badgrid));

        d.setTime(d.getTime() + (duration * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cn + "=" + badgrid + ";" + expires + ";path=/"
        return badgrid;
    }

    var getUrlParameter = function(url, name) {
		var regexSearch = "[\\?&#]" + name + "=([^&#]*)";
		var regex = new RegExp(regexSearch);
		var results = regex.exec(url);
		return results ? w.encodeURIComponent(results[1]) : '';
    }

    var sha1 = function(str) {
        // +   original by: Webtoolkit.info (http://www.webtoolkit.info/)
        // + namespaced by: Michael White (http://getsprink.com)
        // +      input by: Brett Zamir (http://brett-zamir.me)
        // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // +   jslinted by: Anthon Pang (https://matomo.org)

        var
            rotate_left = function (n, s) {
                return (n << s) | (n >>> (32 - s));
            },

            cvt_hex = function (val) {
                var strout = '',
                    i,
                    v;

                for (i = 7; i >= 0; i--) {
                    v = (val >>> (i * 4)) & 0x0f;
                    strout += v.toString(16);
                }

                return strout;
            },

            blockstart,
            i,
            j,
            W = [],
            H0 = 0x67452301,
            H1 = 0xEFCDAB89,
            H2 = 0x98BADCFE,
            H3 = 0x10325476,
            H4 = 0xC3D2E1F0,
            A,
            B,
            C,
            D,
            E,
            temp,
            str_len,
            word_array = [];

        str = utf8Encode(str);
        str_len = str.length;

        for (i = 0; i < str_len - 3; i += 4) {
            j = str.charCodeAt(i) << 24 | str.charCodeAt(i + 1) << 16 |
                str.charCodeAt(i + 2) << 8 | str.charCodeAt(i + 3);
            word_array.push(j);
        }

        switch (str_len & 3) {
            case 0:
                i = 0x080000000;
                break;
            case 1:
                i = str.charCodeAt(str_len - 1) << 24 | 0x0800000;
                break;
            case 2:
                i = str.charCodeAt(str_len - 2) << 24 | str.charCodeAt(str_len - 1) << 16 | 0x08000;
                break;
            case 3:
                i = str.charCodeAt(str_len - 3) << 24 | str.charCodeAt(str_len - 2) << 16 | str.charCodeAt(str_len - 1) << 8 | 0x80;
                break;
        }

        word_array.push(i);

        while ((word_array.length & 15) !== 14) {
            word_array.push(0);
        }

        word_array.push(str_len >>> 29);
        word_array.push((str_len << 3) & 0x0ffffffff);

        for (blockstart = 0; blockstart < word_array.length; blockstart += 16) {
            for (i = 0; i < 16; i++) {
                W[i] = word_array[blockstart + i];
            }

            for (i = 16; i <= 79; i++) {
                W[i] = rotate_left(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16], 1);
            }

            A = H0;
            B = H1;
            C = H2;
            D = H3;
            E = H4;

            for (i = 0; i <= 19; i++) {
                temp = (rotate_left(A, 5) + ((B & C) | (~B & D)) + E + W[i] + 0x5A827999) & 0x0ffffffff;
                E = D;
                D = C;
                C = rotate_left(B, 30);
                B = A;
                A = temp;
            }

            for (i = 20; i <= 39; i++) {
                temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0x6ED9EBA1) & 0x0ffffffff;
                E = D;
                D = C;
                C = rotate_left(B, 30);
                B = A;
                A = temp;
            }

            for (i = 40; i <= 59; i++) {
                temp = (rotate_left(A, 5) + ((B & C) | (B & D) | (C & D)) + E + W[i] + 0x8F1BBCDC) & 0x0ffffffff;
                E = D;
                D = C;
                C = rotate_left(B, 30);
                B = A;
                A = temp;
            }

            for (i = 60; i <= 79; i++) {
                temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0xCA62C1D6) & 0x0ffffffff;
                E = D;
                D = C;
                C = rotate_left(B, 30);
                B = A;
                A = temp;
            }

            H0 = (H0 + A) & 0x0ffffffff;
            H1 = (H1 + B) & 0x0ffffffff;
            H2 = (H2 + C) & 0x0ffffffff;
            H3 = (H3 + D) & 0x0ffffffff;
            H4 = (H4 + E) & 0x0ffffffff;
        }

        temp = cvt_hex(H0) + cvt_hex(H1) + cvt_hex(H2) + cvt_hex(H3) + cvt_hex(H4);

        return temp.toLowerCase();
    }

    var debugMode = function(pl) {
        console.log(pl);
    }
    
    var toHole = function(pl) {
        pl.environment = ENV;
        if (DEBUG_MODE) { 
            var success = debugMode(pl);
            return {'mode': 'debug'}
        }
        try {
            var req = new XMLHttpRequest();
            req.open('POST', HOLE, true);
            req.setRequestHeader('Content-Type', 'application/json');
            
            req.onreadystatechange = function() {
                if (req.readyState === 4) {
                    return 'success';
                }
            };
            req.send(JSON.stringify(pl));
        } catch {
            console.log('Badgr died.')
            return 'fail';
        }      
    }

    /* Get Referrers
    /**************************************/
    // Preferrably, a check if localStorage is enabled would be in place here.
    var referrer = getReferrer();
    var referringDomain = extractHostname(referrer);
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
    var initialReferrer = localStorage.getItem('initial_referrer');
    var initialReferringDomain = localStorage.getItem('initial_referring_domain');
    var searchEngine = localStorage.getItem('search_engine');

    var OSName = "Unknown OS";
    if (n.appVersion.indexOf("Win") != -1) OSName = "Windows";
    if (n.appVersion.indexOf("Mac") != -1) OSName = "MacOS";
    if (n.appVersion.indexOf("X11") != -1) OSName = "Unix";
    if (n.appVersion.indexOf("Linux") != -1) OSName = "Linux";

    /* Get URL  
    /**************************************/
    var queryString = isDefined(w.location.search) ? w.location.search.toString() : '';
    var protocol = isDefined(w.location.protocol) ? w.location.protocol.toString() : '';
    var hostname = isDefined(w.location.host) ? w.location.host.toString() : '';
    var href = isDefined(w.location.href) ? w.location.href.toString() : '';

    var paramCampaign = getUrlParameter(href, 'utm_campaign');
    var paramSource = getUrlParameter(href, 'utm_source');
    var paramMedium = getUrlParameter(href, 'utm_medium');
    var paramContent = getUrlParameter(href, 'utm_content');
    var paramTerm = getUrlParameter(href, 'utm_term');

    var urlParams = function() {
		var searchParams = new URLSearchParams(queryString);
		var paramsJSON = [];
		for(var pair of searchParams.entries()) {
			if (!(pair[0] in ['utm_source', 'utm_medium','utm_campaign','utm_content','utm_term'])) {
				paramsJSON.push({"paramName": pair[0].toString(), "paramValue": pair[1].toString()})
			}
		}
		return paramsJSON;
	}

    /* Get Title 
    /**************************************/
    var title = (function() {
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
    var colorGamut = (function() {
        if (w.matchMedia && w.matchMedia("(color-gamut: srgb)").matches) {
            return "srgb";
        } if (w.matchMedia && w.matchMedia("(color-gamut: p3)").matches) {
            return "p3";
        } if (w.matchMedia && w.matchMedia("(color-gamut: rec2020)").matches) {
            return "rec2020";
        } else {
            return "undefined";
        }

    })();
    var contrastPreference = (function() {
        if (w.matchMedia && w.matchMedia("(prefers-contrast: no-preference)").matches) {
            return "no-preference";
        } if (w.matchMedia && w.matchMedia("(prefers-contrast: more)").matches) {
            return "more";
        } if (w.matchMedia && w.matchMedia("(prefers-contrast: less)").matches) {
            return "less";
        } else {
            return "undefined";
        }

    })();
    var forcedColorsEnabled = w.matchMedia & w.matchMedia("(forced-colors: active").matches;
    var monochromeEnabled = w.matchMedia & w.matchMedia("(monochrome)").matches;
    var reducedMotionEnabled = w.matchMedia && w.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var invertedColorsEnabled = w.matchMedia && w.matchMedia("(inverted-colors: inverted)").matches;
    var sessionStorageEnabled = isDefined(w.sessionStorage);

    // to do  
    // - vendor flavors
    // - DOM Blockers (https://github.com/fingerprintjs/fingerprintjs/blob/master/src/sources/dom_blockers.ts)

    var nTouchpoints = isDefined(n.maxTouchPoints) ? n.maxTouchPoints.toString() : '0';
	var hardwareConcurrency = isDefined(n.hardwareConcurrency) ? n.hardwareConcurrency.toString() : '0';
    var deviceMemory = isDefined(n.deviceMemory) ? n.deviceMemory.toString() : '0';

    var userAgent = n.userAgent;
    var vendor = n.vendor;
    var navPlatform = n.platform;
    var screenWidth = s.width;
    var screenHeight = s.height;
    var colorDepth = s.colorDepth;

    var device = "desktop";
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(userAgent)) {
        device = "tablet";
    }
    if (/Mobile|iP(hone|od|ad)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(userAgent)) {
        device = "mobile";
    }

    /* Get Browser Properties
    /**************************************/
    var darkThemeEnabled = w.matchMedia && w.matchMedia("(prefers-color-scheme: dark)").matches;
    var language = n.language;
	var languages = isDefined(n.languages) ? n.languages.toString() : n.language;
	var cookiesEnabled = n.cookieEnabled ? "Cookies Enabled" : "Cookies Not Enabled";
	var javaEnabled = (function() {
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

    if (navigator.brave) {
        browserName = "Brave";
        browserVersion = navUserAgent.substring(tempVersionOffset + 7);
    } else if ((tempVersionOffset = navUserAgent.indexOf("Opera")) != -1) {
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
    majorVersion = majorVersion.toString();

    var getCookies = function() {
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
    }

    /* Identification
    /**************************************/
    // + By: https://github.com/fingerprintjs/fingerprintjs/blob/master/src/sources/math.ts
    var M = Math
    var fallbackFn = () => 0

    var acos = M.acos || fallbackFn
    var acosh = M.acosh || fallbackFn
    var asin = M.asin || fallbackFn
    var asinh = M.asinh || fallbackFn
    var atanh = M.atanh || fallbackFn
    var atan = M.atan || fallbackFn
    var sin = M.sin || fallbackFn
    var sinh = M.sinh || fallbackFn
    var cos = M.cos || fallbackFn
    var cosh = M.cosh || fallbackFn
    var tan = M.tan || fallbackFn
    var tanh = M.tanh || fallbackFn
    var exp = M.exp || fallbackFn
    var expm1 = M.expm1 || fallbackFn
    var log1p = M.log1p || fallbackFn

    // Operation polyfills
    var powPI = function(value) { M.pow(M.PI, value) }
    var acoshPf = function(value) { M.log(value + M.sqrt(value * value - 1)) }
    var asinhPf = function(value) {  M.log(value + M.sqrt(value * value + 1)) }
    var atanhPf = function(value) {  M.log((1 + value) / (1 - value)) / 2 }
    var sinhPf = function(value) {  M.exp(value) - 1 / M.exp(value) / 2 }
    var coshPf = function(value) {  (M.exp(value) + 1 / M.exp(value)) / 2 }
    var expm1Pf = function(value) {  M.exp(value) - 1 }
    var tanhPf = function(value) {  (M.exp(2 * value) - 1) / (M.exp(2 * value) + 1) }
    var log1pPf = function(value) {  M.log(1 + value) }

    var getMathFingerprint = function() {
        return {
            acos: acos(0.123124234234234242),
            acosh: acosh(1e308),
            acoshPf: acoshPf(1e154),
            asin: asin(0.123124234234234242),
            asinh: asinh(1),
            asinhPf: asinhPf(1),
            atanh: atanh(0.5),
            atanhPf: atanhPf(0.5),
            atan: atan(0.5),
            sin: sin(-1e300),
            sinh: sinh(1),
            sinhPf: sinhPf(1),
            cos: cos(10.000000000123),
            cosh: cosh(1),
            coshPf: coshPf(1),
            tan: tan(-1e300),
            tanh: tanh(1),
            tanhPf: tanhPf(1),
            exp: exp(1),
            expm1: expm1(1),
            expm1Pf: expm1Pf(1),
            log1p: log1p(10),
            log1pPf: log1pPf(10),
            powPI: powPI(-100),
        }
    }
    
    var badgrFp = sha1([browserName,
        device,OSName,
        nTouchpoints,
        deviceMemory,
        hardwareConcurrency,
        javaEnabled,
        cookiesEnabled,
        colorDepth,
        language,
        languages,
        dtOffset,
        userAgent,
        colorGamut,
        forcedColorsEnabled,
        contrastPreference,
        reducedMotionEnabled,
        invertedColorsEnabled,
        sessionStorageEnabled,
        monochromeEnabled,
        getMathFingerprint()
    ].join());

    var badgrId = setIDCookie('badgrid', badgrFp, 365);
    
    /* Putting it together
    /**************************************/
    var getFood = function() {
        return {
            "user_id": badgrId,
            "fp_id": badgrFp,
            "visit_id": setIDCookie('huntid', badgrFp, visitLength),
            "hit_id": generateRandom(16),
            "local_hit_time": getDateTime(),
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
            "browser_name": browserName,
            "browser_major_version": majorVersion,
            "browser_version": browserVersion,
            "device": device,
            "browser_language": language,
            "browser_languages": languages,
            "timezone_offset": dtOffset,
            "user_agent": userAgent,
            "navigator_platform": navPlatform,
            "vendor": vendor,
            "n_touchpoints": nTouchpoints,
            "device_memory": deviceMemory,
            "hardware_concurrency": hardwareConcurrency,
            "color_depth": colorDepth,
            "color_gamut": colorGamut,
            "contrast_preference": contrastPreference,
            "is_monochrome": monochromeEnabled,
            "is_forced_colors": forcedColorsEnabled,
            "is_inverted": invertedColorsEnabled,
            "is_reduced_motion": reducedMotionEnabled,
            "is_session_storage": sessionStorageEnabled,
            "is_java": javaEnabled,
            "is_cookie": cookiesEnabled,
            "is_dark": darkThemeEnabled,
            "queries": urlParams(),
            "cookies": getCookies()
        }
    }

    /***************************************/
    /* Public Methods **********************/
    /***************************************/

    /**
	 * Tracks an event
	 * @param  {string}		eventName 			The identifier of the event
	 * @param  {dict} 		eventProperties 	Properties {property:{string}value} related to the event
	 * @param  {list}		destinations		The destinations of the event
	 * @return {int} 							HTTP status of the call.
	 */
	var trackEvent = function(eventName, eventProperties, destinations) {
		var properties = Object.assign({}, eventProperties, getFood());
		var payload = {
			"track":"event",
			"event": eventName, 
			"hit_properties": properties,
			"destinations": destinations
        }
		var success = toHole(payload);
		return success;
    }
    
    /**
	 * Tracks a search
	 * @param  {string}		searchTerm 			The search term that the user entered to search
	 * @param  {dict}		searchProperties	Properties {property:{string}value} related to the search, e.g. if you have multiple search engines
	 * @param  {list} 		searchResults 		List of key-value dictionaries with all the search results
	 * @return {int} 							HTTP status of the call.
	 */
	var trackSearch = function(searchTerm, searchProperties, searchResults, destinations) {
		var properties = Object.assign({}, searchProperties, getFood());
		var payload = {
			"track":"search",
			"search_term": searchTerm,
			"search_results": searchResults,
			"hit_properties": properties,
			"destinations": destinations
		}
		var success = toHole(payload);
		return success;
    }

    /**
	 * Tracks custom metrics (values that increase or decrease)
	 * @param  {dict}		metrics 			Metrics {metric:{float}value} that need to decrease or increase
	 * @param  {dict}		metricProperties	Properties {metric:{string}value} related to the increase or decrease
	 * @return {int} 							HTTP status of the call.
	 */
	var trackMetrics = function(metrics, metricProperties, destinations) {
        var properties = Object.assign({}, metricProperties, getFood());
		var payload = {
			"track":"metrics",
			"metrics": metrics,
			"hit_properties": properties,
			"destinations": destinations
		}
		var success = toHole(payload);
		return success;
	}

    /**
	 * Enrich a user profile with custom properties
	 * @param  {dict}		metricProperties	Properties {metric:{string}value} related to the user
	 * @return {int} 							HTTP status of the call.
	 */
	var enrichUserProfile = function(userProperties, destinations) {
		var payload = {
			"track":"enrich_user",
			"user_properties": userProperties,
			"destinations": destinations
		}
		var success = toHole(payload);
		return success;
    }
    
    /**
	 * Append items to a user profile list (e.g. list of cars a user owns)
	 * @param  {string}		listName 			The name of the list you want to append items to
	 * @param  {list}		listItems			List of key-value dictionaries you want to add to a list (key = list)
	 * @return {int} 							HTTP status of the call.
	 */
	var appendUserPropertyList = function(listName, listItems, destinations) {
		var payload = {
			"track": "append_user_property_list",
			"user_property_list": listItems,
			"destinations": destinations
		}
		var success = toHole(payload);
		return success;
    }
    
    /**
	 * Tracks a product action
	 * @param  {string}		action 				What is happening to the product?
	 * @param  {dict}		productProperties	Properties {property:{string}value} of the product
	 * @return {int} 							HTTP status of the call.
	 */
	var trackProductAction = function(action, productProperties, destinations) {
        var properties = Object.assign({}, properties, getFood());
		var payload = {
			"track": action,
			"product_properties": productProperties,
			"hit_properties": properties,
			"destinations": destinations
		}
		var success = toHole(payload);
		return success;
    }

    /**
	 * Tracks a product view
	 * @param  {dict}		productProperties	Properties {property:{string}value} of the product
	 * @return {int} 							HTTP status of the call.
	 */
	var trackProductView = function(productProperties, destinations) {
		var success = trackProductAction("product_view", productProperties, destinations);
		return success;
    }
    
    /**
	 * Tracks a product click
	 * @param  {dict}		productProperties	Properties {property:{string}value} of the product
	 * @return {int} 							HTTP status of the call.
	 */
	var trackProductClick = function(productProperties, destinations) {
		var success = trackProductAction("product_click", productProperties, destinations);
		return success;
    }
    
    	/**
	 * Tracks a product added to cart
	 * @param  {dict}		productProperties	Properties {property:{string}value} of the product
	 * @return {int} 							HTTP status of the call.
	 */
	var trackProductCartAdd = function(productProperties, destinations) {
		var success = trackProductAction("cart_add", productProperties, destinations);
		return success;
	}

	/**
	 * Tracks a product removed from cart
	 * @param  {dict}		productProperties	Properties {property:{string}value} of the product
	 * @return {int} 							HTTP status of the call.
	 */
	var trackProductCartRemove = function(productProperties, destinations) {
		var success = trackProductAction("cart_remove", productProperties, destinations)
		return success;
	}

	/**
	 * Tracks a product list view
	 * @param  {string}		productListName 		Which product list is shown? e.g. 'category page'
	 * @param  {dict}		productListProperties	Properties {property:{string}value} of the product list. e.g. {'category':'chrysler'}
	 * @return {int} 								HTTP status of the call.
	 */
	var trackProductListView = function(productListName, productListProperties, products, destinations) {
        var properties = Object.assign({}, productListProperties, getFood());
		var payload = {
			"track": "product_list_view",
			"product_list_name": productListName,
			"products": products,
			"hit_properties": properties,
			"destinations": destinations
		}
		var success = toHole(payload);
		return success;
	}

	/**
	 * Tracks a checkout step
	 * @param  {string}		stepName 			The name of the step of the checkout. e.g. 'address'
	 * @param  {dict}		stepProperties		Properties {property:{string}value} of the checkout step. e.g. if you have multiple checkout flows such as pick up
	 * @return {int} 							HTTP status of the call.
	 */
	var trackCheckoutStep = function(stepName, stepProperties, products, destinations) {
        var properties = Object.assign({}, stepProperties, getFood());
		var payload = {
			"track": "step",
			"step_name": stepName,
			"products": products,
			"hit_properties": properties,
			"destinations": destinations
		}
		var success = toHole(payload);
		return success;
	}

	/**
	 * Tracks a transaction
	 * @param  {string}		transactionId 			The identifier of the transaction.
	 * @param  {int}		transactionValue		The value of the transaction
	 * @param  {int}		transactionVATValue
	 * @param  {dict}		transactionProperties	Properties {property:{string}value} of the transaction such as {'payment method':'paypal'}
	 * @return {int} 								HTTP status of the call.
	 */
	var trackTransaction = function(transactionId, transactionValue, transactionVAT, transactionProperties, products, destinations) {
        var properties = Object.assign({}, transactionProperties, getFood());
		var payload = {
			"track": "transaction",
			"transaction_id": transactionId,
			"transaction_value": transactionValue,
			"transaction_vat": transactionVAT,
			"products": products,
			"hit_properties": properties,
			"destinations": destinations
		}
		var success = toHole(payload);
		return success;
	}

    badgr = {
        'trackEvent': trackEvent,
        'trackSearch': trackSearch,
        'trackMetrics': trackMetrics,
        'enrichUserProfile': enrichUserProfile,
        'appendUserPropertyList': appendUserPropertyList,
        'trackProductView': trackProductView,
        'trackProductClick': trackProductClick,
        'trackProductCartAdd': trackProductCartAdd,
        'trackProductCartRemove': trackProductCartRemove,
        'trackProductListView': trackProductListView,
        'trackCheckoutStep': trackCheckoutStep,
        'trackTransaction': trackTransaction
    }
    return badgr
})();
