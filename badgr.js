class Badgr {
	constructor(endpoint) {
		this.dt = new Date();
		this.dt_offset = dt.getTimezoneOffset().toString();
		this.endpoint = endpoint;
		this.visit_length = 0.5 // hours
	}

	init() {
		this.setInitialReferrer();
		this.setBrowserProperties();

		this.defaultProperties = {
			"hit_id": this.generateRandom(24),
			"user_id": this.setWUID(),
			"visit_id": this.setWSID(),
			"browser_name": this.browserName,
			"browser_version": this.browserVersion,
			"device": this.getDeviceCategory(),
			"current_url": window.location.pathname,
			"initial_referrer": localStorage.getItem('initial_referrer'),
			"initial_referring_domain": localStorage.getItem('initial_referring_domain'),
			"referring_search_engine": localStorage.getItem('search_engine'),
			"os": this.getOS(),
			"referrer": document.referrer,
			"screen_height": screen.height,
			"screen_width": screen.width,
			"query_string": window.location.search,
			"page_title": document.title,
			"protocol": window.location.protocol,
			"hostname": window.location.host,
			"utm_campaign": this.getUrlParameter(window.location.pathname, 'utm_campaign'),
			"utm_source": this.getUrlParameter(window.location.pathname, 'utm_source'),
			"utm_medium": this.getUrlParameter(window.location.pathname, 'utm_medium'),
			"utm_content": this.getUrlParameter(window.location.pathname, 'utm_content'),
			"utm_term": this.getUrlParameter(window.location.pathname, 'utm_term'),
			"color_depth": screen.colorDepth.toString(),
			"browser_language": navigator.language,
			"timezone_offset": dt_offset,
			"user_agent": navigator.userAgent,
			"queries": this.getAllURLParameters(),
			"cookies": this.getAllCookeis()
		}
	}
	/**
	 * Tracks an event
	 * @param  {string}		eventName 			The identifier of the event
	 * @param  {dict} 		eventProperties 	Properties {property:{string}value} related to the event
	 * @return {int} 							HTTP status of the call.
	 */
	trackEvent(eventName = undefined, eventProperties = {}) {
		var properties = Object.assign({}, eventProperties, this.defaultProperties);
		properties.hit_id = this.generateRandom(24);
		var payload = {
			"track":"event",
			"event": eventName, 
			"properties": properties
		}
		success = this.sendToEndpoint(payload);
		return success;
	}

	/**
	 * Tracks a search
	 * @param  {string}		searchTerm 			The search term that the user entered to search
	 * @param  {dict}		searchProperties	Properties {property:{string}value} related to the search, e.g. if you have multiple search engines
	 * @param  {list} 		searchResults 		List of key-value dictionaries with all the search results
	 * @return {int} 							HTTP status of the call.
	 */
	trackSearch(searchTerm = undefined, searchProperties = {}, searchResults = []) {
		var properties = Object.assign({}, searchProperties, this.defaultProperties);
		properties.hit_id = this.generateRandom(24);
		var payload = {
			"track":"search",
			"search_term": SearchTerm,
			"search_results": searchResults,
			"hit_properties": properties
		}
		success = this.sendToEndpoint(payload);
		return success;
	}
	/**
	 * Tracks custom metrics (values that increase or decrease)
	 * @param  {dict}		metrics 			Metrics {metric:{float}value} that need to decrease or increase
	 * @param  {dict}		metricProperties	Properties {metric:{string}value} related to the increase or decrease
	 * @return {int} 							HTTP status of the call.
	 */
	trackMetrics(metrics = {}, metricProperties = {}) {
		var properties = Object.assign({}, metricProperties, this.defaultProperties);
		properties.hit_id = this.generateRandom(24);
		var payload = {
			"track":"metrics",
			"metrics": metrics,
			"hit_properties": properties
		}
		success = this.sendToEndpoint(payload);
		return success;
	}

	/**
	 * Enrich a user profile with custom properties
	 * @param  {dict}		metricProperties	Properties {metric:{string}value} related to the user
	 * @return {int} 							HTTP status of the call.
	 */
	enrichUserProfile(userProperties = {}) {
		var payload = {
			"track":"enrich_user",
			"user_properties": userProperties
		}
		success = this.sendToEndpoint(payload);
		return success;
	}
	
	/**
	 * Append items to a user profile list (e.g. list of cars a user owns)
	 * @param  {string}		listName 			The name of the list you want to append items to
	 * @param  {list}		listItems			List of key-value dictionaries you want to add to the list
	 * @return {int} 							HTTP status of the call.
	 */
	appendUserPropertyList(listName, listItems = []) {
		var payload = {
			"track": "append_user_property_list",
			"list_name": listName,
			"user_propertiy_list": listItems
		}
		success = this.sendToEndpoint(payload);
		return success;
	}

	/**
	 * Tracks a product action
	 * @param  {string}		action 				What is happening to the product?
	 * @param  {dict}		productProperties	Properties {property:{string}value} of the product
	 * @return {int} 							HTTP status of the call.
	 */
	#trackProductAction(action = undefined, productProperties = {}) {
		var properties = Object.assign({}, metricProperties, this.defaultProperties);
		properties.hit_id = this.generateRandom(24);
		var payload = {
			"track": action,
			"product_properties": productProperties,
			"hit_properties": properties
		}
		success = this.sendToEndpoint(payload);
		return success;
	}

	/**
	 * Tracks a product view
	 * @param  {dict}		productProperties	Properties {property:{string}value} of the product
	 * @return {int} 							HTTP status of the call.
	 */
	trackProductView(productProperties = {}) {
		this.trackProductAction("view", productProperties);
		success = this.sendToEndpoint(payload);
		return success;
	}

	/**
	 * Tracks a product click
	 * @param  {dict}		productProperties	Properties {property:{string}value} of the product
	 * @return {int} 							HTTP status of the call.
	 */
	trackProductClick(productProperties = {}) {
		this.trackProductAction("click", productProperties);
		success = this.sendToEndpoint(payload);
		return success;
	}

	/**
	 * Tracks a product added to cart
	 * @param  {dict}		productProperties	Properties {property:{string}value} of the product
	 * @return {int} 							HTTP status of the call.
	 */
	trackProductCartAdd(productProperties = {}) {
		this.trackProductAction("cart_add", productProperties);
		success = this.sendToEndpoint(payload);
		return success;
	}

	/**
	 * Tracks a product removed from cart
	 * @param  {dict}		productProperties	Properties {property:{string}value} of the product
	 * @return {int} 							HTTP status of the call.
	 */
	trackProductCartRemove(productProperties = {}) {
		this.trackProductAction("cart_remove", productProperties)
		success = this.sendToEndpoint(payload);
		return success;
	}

	/**
	 * Tracks a product list view
	 * @param  {string}		productListName 		Which product list is shown? e.g. 'category page'
	 * @param  {dict}		productListProperties	Properties {property:{string}value} of the product list. e.g. {'category':'chrysler'}
	 * @return {int} 								HTTP status of the call.
	 */
	trackProductListView(productListName = undefined, productListProperties = {}, products = []) {
		var properties = Object.assign({}, productListProperties, this.defaultProperties);
		properties.hit_id = this.generateRandom(24);
		var payload = {
			"track": "product_list_view",
			"products": products,
			"hit_properties": properties
		}
		this.sendToEndpoint(payload);
		success = this.sendToEndpoint(payload);
		return success;
	}

	/**
	 * Tracks a checkout step
	 * @param  {string}		stepName 			The name of the step of the checkout. e.g. 'address'
	 * @param  {dict}		stepProperties		Properties {property:{string}value} of the checkout step. e.g. if you have multiple checkout flows such as pick up
	 * @return {int} 							HTTP status of the call.
	 */
	trackCheckoutStep(stepName, stepProperties = {}, products = []) {
		var properties = Object.assign({}, stepProperties, this.defaultProperties);
		properties.hit_id = this.generateRandom(24);
		var payload = {
			"track": "step",
			"stepName": products,
			"hit_properties": properties
		}
		this.sendToEndpoint(payload);
		success = this.sendToEndpoint(payload);
		return success;
	}

	/**
	 * Tracks a transaction
	 * @param  {string}		transactionId 			The identifier of the transaction.
	 * @param  {dict}		transactionProperties	Properties {property:{string}value} of the transaction such as {'payment method':'paypal'}
	 * @return {int} 								HTTP status of the call.
	 */
	trackTransaction(transactionId, transactionProperties = {}, products = []) {
		var properties = Object.assign({}, transactionProperties, this.defaultProperties);
		properties.hit_id = this.generateRandom(24);
		var payload = {
			"track": "transaction",
			"stepName": products,
			"hit_properties": properties
		}
		this.sendToEndpoint(payload);
		success = this.sendToEndpoint(payload);
		return success;
	}

	sendToEndpoint(pl) {
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

	setInitialReferrer() {
		if (!document.referrer.includes(window.location.hostname)) {
			// Set initial referrer
			localStorage.setItem('initial_referrer', document.referrer)
			// Set referring domain
			localStorage.setItem('initial_referring_domain', this.extractHostname(document.referrer))

			// Set search engine
			if (document.referrer.includes('google')) {
				localStorage.setItem('search_engine','Google')
			} else if (document.referrer.includes('bing')) {
				localStorage.setItem('search_engine', 'Bing')
			} else if (document.referrer.includes('yandex')) {
				localStorage.setItem('search_engine', 'Yandex')
			} else if (document.referrer.includes('swisscows')) {
				localStorage.setItem('search_engine', 'Swisscows')
			} else if (document.referrer.includes('duckduckgo')) {
				localStorage.setItem('search_engine', 'DuckDuckGo')
			} else if (document.referrer.includes('startpage')) {
				localStorage.setItem('search_engine', 'Startpage')
			} else if (document.referrer.includes('searchencrypt')) {
				localStorage.setItem('search_engine', 'Search Encrypt')
			} else if (document.referrer.includes('gibiru')) {
				localStorage.setItem('search_engine', 'Gibiru')
			} else if (document.referrer.includes('onesearch')) {
				localStorage.setItem('search_engine', 'OneSearch')
			} else if (document.referrer.includes('yahoo')) {
				localStorage.setItem('search_engine', 'Yahoo')
			} else if (document.referrer.includes('givewater')) {
				localStorage.setItem('search_engine', 'giveWater')
			} else if (document.referrer.includes('ekoru')) {
				localStorage.setItem('search_engine', 'Ekoru')
			} else if (document.referrer.includes('ecosia')) {
				localStorage.setItem('search_engine', 'Ecosia')
			} else if (document.referrer.includes('boardreader')) {
				localStorage.setItem('search_engine', 'Boardreader')
			} else {
				localStorage.setItem('search_engine', 'none')
			}
			
		} 
		this.initialReferrer = localStorage.getItem('search_engine');
		this.initialReferringDomain = localStorage.getItem('initial_referring_domain');
		this.searchEngine = localStorage.getItem('search_engine');

	}

	extractHostname(url) {
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

	generateRandom(length) {
		var result = '';
		var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		var charactersLength = characters.length;
		for (var i = 0; i < length; i++) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength));
		}
		return result;
	}

	setWUID() {
		var WUID = getCookie("WUID");
		var d = new Date();
		WUID = (WUID == "") ? WUID = generateRandom(16) : WUID;

		// Set user id for 365 days
		d.setTime(d.getTime() + (365 * 24 * 60 * 60 * 1000));
		var expires = "expires="+d.toUTCString();
		document.cookie = "WUID=" + WUID + ";" + expires + ";path=/";
		
		return WUID;
	}

	setWSID() {
		var WSID = getCookie("WSID");
		var d = new Date();
		WSID = (WSID == "") ? WSID = generateRandom(16) : WSID;

		// Set session id for half an hour
		d.setTime(d.getTime() + (this.visit_length * 60 * 60 * 1000));
		var expires = "expires="+d.toUTCString();
		document.cookie = "WSID=" + WSID + ";" + expires + ";path=/";
		
		return WSID;
	}

	setBrowserProperties() {
		var navUserAgent = navigator.userAgent;
		var browserName = navigator.appName;
		var browserVersion = '' + parseFloat(navigator.appVersion);
		var majorVersion = parseInt(navigator.appVersion, 10);
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
				browserName = navigator.appName;
			}
		}

		if ((tempVersion = browserVersion.indexOf(";")) != -1) {
			browserVersion = browserVersion.substring(0, tempVersion);
		}

		if ((tempVersion = browserVersion.indexOf(" ")) != -1) {
			browserVersion = browserVersion.substring(0, tempVersion);
		}

		this.browserName = browserName;
		this.browserVersion = browserVersion;
	}

	getOS() {
		var OSName = "Unknown OS";
		if (navigator.appVersion.indexOf("Win") != -1) OSName = "Windows";
		if (navigator.appVersion.indexOf("Mac") != -1) OSName = "MacOS";
		if (navigator.appVersion.indexOf("X11") != -1) OSName = "UNIX";
		if (navigator.appVersion.indexOf("Linux") != -1) OSName = "Linux";
		return OSName;
	}

	getDeviceCategory() {
		ua = navigator.userAgent;
		if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
			return "tablet";
		}
		if (/Mobile|iP(hone|od|ad)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
			return "mobile";
		}
		return "desktop";
	};

	getAllCookies() {
		var cookies = {};
		if (document.cookie && document.cookie != '') {
			var split = document.cookie.split(';');
			for (var i = 0; i < split.length; i++) {
				var name_value = split[i].split("=");
				name_value[0] = name_value[0].replace(/^ /, '');
				cookies[decodeURIComponent(name_value[0])] = decodeURIComponent(name_value[1]);
			}
		}
		
		cookiesJSON = [];
		for (var name in cookies) {
			cookiesJSON.push({"cookieName": name, "cookieValue": cookies[name]})
		}
		return cookiesJSON;
	}
	
	getUrlParameter(url, name) {
		var regexSearch = "[\\?&#]" + name + "=([^&#]*)";
		var regex = new RegExp(regexSearch);
		var results = regex.exec(url);
		return results ? decodeWrapper(results[1]) : '';
	}

	getAllURLParameters(params) {
		searchParams = new URLSearchParams(params);
		var paramsJSON = [];
		for(var pair of searchParams.entries()) {
			if (!(pair[0] in ['utm_source', 'utm_medium','utm_campaign','utm_content','utm_term'])) {
				paramsJSON.push({"paramName": pair[0].toString(), "paramValue": pair[1].toString()})
			}
		}
		return paramsJSON;
	}

	getCookie(cname) {
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
}

