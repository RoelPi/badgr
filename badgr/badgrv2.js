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

    const utf8Encode = function(arg) {
        return unescape(w.encodeURIComponent(arg));
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

    const generateRandom = function(length) {
		var result = '';
		var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		var charactersLength = characters.length;
		for (var i = 0; i < length; i++) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength));
		}
		return result;
    }

    const shuffleStr = function(str) {
        return str.split('').sort(function(){
            return 0.5 - Math.random()
        }).join('');
    }
    
    const generateUserID = function(fp) {
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

    const getUrlParameter = function(url, name) {
		var regexSearch = "[\\?&#]" + name + "=([^&#]*)";
		var regex = new RegExp(regexSearch);
		var results = regex.exec(url);
		return results ? w.encodeURIComponent(results[1]) : '';
    }

    const sha1 = function(str) {
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

    const sendToEndpoint = function(food) {
		fetch(this.endpoint, {
			method: 'post',
			headers: {
				'Accept': 'application/json, text/plain, */*',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(pl)
		}).then(
			function(response) {
				return response.status;
			}
		)
    }
    
    const toHole = (url, data) => {
        try {
            const req = new XMLHttpRequest();
            req.open('POST', url, true);
            req.setRequestHeader('Content-Type', 'application/json');
            
            req.onreadystatechange = () => {
                if (req.readyState === 4) {
                    throw new Error('Badgr died.')
                }
            };
            req.send(JSON.stringify(data));
        } catch {
            console.log('Badgr died.')
        }
      };

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
    majorVersion = majorVersion.toString();

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
    
    /* Identification
    /**************************************/
    const badgrFp = sha1([browserName,device,OSName,nTouchpoints,deviceMemory,hardwareConcurrency,javaEnabled,cookiesEnabled,colorDepth,language,languages,dtOffset,userAgent].join());
    const badgrId = setIDCookie('badgrid', badgrFp, 365);
    
    /* Putting it together
    /**************************************/
    const getFood = function() {
        return  {
            "user_id": badgrId,
            "fp_id": badgrFp,
            "visit_id": setIDCookie('huntid', badgrFp, 0.5),
            "hit_id": generateRandom(16),
            "local_hit_time": getDateTime(),
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
    }

    	/**
	 * Tracks an event
	 * @param  {string}		eventName 			The identifier of the event
	 * @param  {dict} 		eventProperties 	Properties {property:{string}value} related to the event
	 * @param  {list}		destinations		The destinations of the event
	 * @return {int} 							HTTP status of the call.
	 */
	const trackEvent = function(eventName = undefined, eventProperties = {}, destinations = []) {
		var properties = Object.assign({}, eventProperties, getFood());
		var payload = {
			"track":"event",
			"event": eventName, 
			"hit_properties": properties,
			"destinations": destinations
        }
        console.log(payload);
		var success = toHole(payload);
		return success;
	}
    badgr.trackEvent = trackEvent;
    return badgr
})();
