class Badgr {
	constructor(environment = "production", hole) {
		this.environment = environment;
		this.dt = new Date();
		this.dt_offset = this.dt.getTimezoneOffset().toString();
		this.endpoint = hole;
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
			"referrer": this.getReferrer(),
			"referring_domain": this.extractHostname(document.referrer),
			"screen_height": screen.height,
			"screen_width": screen.width,
			"query_string": window.location.search,
			"page_title": this.getTitle(),
			"protocol": window.location.protocol,
			"hostname": window.location.host,
			"utm_campaign": this.getUrlParameter(window.location.pathname, 'utm_campaign'),
			"utm_source": this.getUrlParameter(window.location.pathname, 'utm_source'),
			"utm_medium": this.getUrlParameter(window.location.pathname, 'utm_medium'),
			"utm_content": this.getUrlParameter(window.location.pathname, 'utm_content'),
			"utm_term": this.getUrlParameter(window.location.pathname, 'utm_term'),
			"color_depth": screen.colorDepth.toString(),
			"browser_language": navigator.language,
			"browser_languages": this.getBrowserLanguages(),
			"timezone_offset": this.dt_offset,
			"user_agent": navigator.userAgent,
			"navigator_platform": navigator.platform,
			"n_touchpoints": this.getTouchpoints(),
			"device_memory": this.getDeviceMemory(),
			"hardware_concurrency": this.getHardwareConcurrency(),
			"is_java": this.getJavaEnabled(),
			"is_cookie": this.getCookieEnabled(),
			"queries": this.getAllURLParameters(),
			"cookies": this.getAllCookies()
		}
	}
	/**
	 * Tracks an event
	 * @param  {string}		eventName 			The identifier of the event
	 * @param  {dict} 		eventProperties 	Properties {property:{string}value} related to the event
	 * @param  {list}		destinations		The destinations of the event
	 * @return {int} 							HTTP status of the call.
	 */
	trackEvent(eventName = undefined, eventProperties = {}, destinations = []) {
		var properties = Object.assign({}, eventProperties, this.defaultProperties);
		properties.hit_id = this.generateRandom(24);
		properties.local_hit_time = this.getDateTime();
		var payload = {
			"track":"event",
			"event": eventName, 
			"hit_properties": properties,
			"destinations": destinations
		}
		var success = this.sendToEndpoint(payload);
		return success;
	}

	/**
	 * Tracks a search
	 * @param  {string}		searchTerm 			The search term that the user entered to search
	 * @param  {dict}		searchProperties	Properties {property:{string}value} related to the search, e.g. if you have multiple search engines
	 * @param  {list} 		searchResults 		List of key-value dictionaries with all the search results
	 * @return {int} 							HTTP status of the call.
	 */
	trackSearch(searchTerm = undefined, searchProperties = {}, searchResults = [], destinations = []) {
		var properties = Object.assign({}, searchProperties, this.defaultProperties);
		properties.hit_id = this.generateRandom(24);
		properties.local_hit_time = this.getDateTime();
		var payload = {
			"track":"search",
			"search_term": SearchTerm,
			"search_results": searchResults,
			"hit_properties": properties,
			"destinations": destinations
		}
		var success = this.sendToEndpoint(payload);
		return success;
	}
	/**
	 * Tracks custom metrics (values that increase or decrease)
	 * @param  {dict}		metrics 			Metrics {metric:{float}value} that need to decrease or increase
	 * @param  {dict}		metricProperties	Properties {metric:{string}value} related to the increase or decrease
	 * @return {int} 							HTTP status of the call.
	 */
	trackMetrics(metrics = {}, metricProperties = {}, destinations = []) {
		var properties = Object.assign({}, metricProperties, this.defaultProperties);
		properties.hit_id = this.generateRandom(24);
		properties.local_hit_time = this.getDateTime();
		var payload = {
			"track":"metrics",
			"metrics": metrics,
			"hit_properties": properties,
			"destinations": destinations
		}
		var success = this.sendToEndpoint(payload);
		return success;
	}

	/**
	 * Enrich a user profile with custom properties
	 * @param  {dict}		metricProperties	Properties {metric:{string}value} related to the user
	 * @return {int} 							HTTP status of the call.
	 */
	enrichUserProfile(userProperties = {}, destinations = []) {
		var payload = {
			"track":"enrich_user",
			"user_properties": userProperties,
			"destinations": destinations
		}
		var success = this.sendToEndpoint(payload);
		return success;
	}
	
	/**
	 * Append items to a user profile list (e.g. list of cars a user owns)
	 * @param  {string}		listName 			The name of the list you want to append items to
	 * @param  {list}		listItems			List of key-value dictionaries you want to add to a list (key = list)
	 * @return {int} 							HTTP status of the call.
	 */
	appendUserPropertyList(listName, listItems = [], destinations = []) {
		var payload = {
			"track": "append_user_property_list",
			"user_property_list": listItems,
			"destinations": destinations
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
	trackProductAction(action = undefined, productProperties = {}, destinations = []) {
		var properties = Object.assign({}, metricProperties, this.defaultProperties);
		properties.hit_id = this.generateRandom(24);
		properties.local_hit_time = this.getDateTime();
		var payload = {
			"track": action,
			"product_properties": productProperties,
			"hit_properties": properties,
			"destinations": destinations
		}
		var success = this.sendToEndpoint(payload);
		return success;
	}

	/**
	 * Tracks a product view
	 * @param  {dict}		productProperties	Properties {property:{string}value} of the product
	 * @return {int} 							HTTP status of the call.
	 */
	trackProductView(productProperties = {}, destinations = []) {
		this.trackProductAction("product_view", productProperties, destinations);
		success = this.sendToEndpoint(payload);
		return success;
	}

	/**
	 * Tracks a product click
	 * @param  {dict}		productProperties	Properties {property:{string}value} of the product
	 * @return {int} 							HTTP status of the call.
	 */
	trackProductClick(productProperties = {}, destinations = []) {
		this.trackProductAction("product_click", productProperties, destinations);
		var success = this.sendToEndpoint(payload);
		return success;
	}

	/**
	 * Tracks a product added to cart
	 * @param  {dict}		productProperties	Properties {property:{string}value} of the product
	 * @return {int} 							HTTP status of the call.
	 */
	trackProductCartAdd(productProperties = {}, destinations = []) {
		this.trackProductAction("cart_add", productProperties, destinations);
		var success = this.sendToEndpoint(payload);
		return success;
	}

	/**
	 * Tracks a product removed from cart
	 * @param  {dict}		productProperties	Properties {property:{string}value} of the product
	 * @return {int} 							HTTP status of the call.
	 */
	trackProductCartRemove(productProperties = {}, destinations = []) {
		this.trackProductAction("cart_remove", productProperties, destinations)
		var success = this.sendToEndpoint(payload);
		return success;
	}

	/**
	 * Tracks a product list view
	 * @param  {string}		productListName 		Which product list is shown? e.g. 'category page'
	 * @param  {dict}		productListProperties	Properties {property:{string}value} of the product list. e.g. {'category':'chrysler'}
	 * @return {int} 								HTTP status of the call.
	 */
	trackProductListView(productListName = undefined, productListProperties = {}, products = [], destinations = []) {
		var properties = Object.assign({}, productListProperties, this.defaultProperties);
		properties.hit_id = this.generateRandom(24);
		properties.local_hit_time = this.getDateTime();
		var payload = {
			"track": "product_list_view",
			"product_list_name": productListName,
			"products": products,
			"hit_properties": properties,
			"destinations": destinations
		}
		var success = this.sendToEndpoint(payload);
		return success;
	}

	/**
	 * Tracks a checkout step
	 * @param  {string}		stepName 			The name of the step of the checkout. e.g. 'address'
	 * @param  {dict}		stepProperties		Properties {property:{string}value} of the checkout step. e.g. if you have multiple checkout flows such as pick up
	 * @return {int} 							HTTP status of the call.
	 */
	trackCheckoutStep(stepName, stepProperties = {}, products = [], destinations = []) {
		var properties = Object.assign({}, stepProperties, this.defaultProperties);
		properties.hit_id = this.generateRandom(24);
		properties.local_hit_time = this.getDateTime();
		var payload = {
			"track": "step",
			"step_name": stepName,
			"products": products,
			"hit_properties": properties,
			"destinations": destinations
		}
		var success = this.sendToEndpoint(payload);
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
	trackTransaction(transactionId, transactionValue = 0, transactionProperties = {}, products = [], destinations = []) {
		var properties = Object.assign({}, transactionProperties, this.defaultProperties);
		properties.hit_id = this.generateRandom(24);
		properties.local_hit_time = this.getDateTime();
		var payload = {
			"track": "transaction",
			"transaction_id": transactionId,
			"transaction_value": transactionValue,
			"transaction_vat": transactionVAT,
			"products": products,
			"hit_properties": properties,
			"destinations": destinations
		}
		var success = this.sendToEndpoint(payload);
		return success;
	}

	sendToEndpoint(pl) {
		pl.environment = this.environment;
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

	isDefined(property) {
		return typeof property !== 'undefined';
	}
	isString(property) {
		return typeof property === 'string' || property instanceof String;
	}

	setInitialReferrer() {
		var referrer = this.getReferrer();
		if (!referrer.includes(window.location.hostname)) {
			// Set initial referrer
			localStorage.setItem('initial_referrer', referrer)
			// Set referring domain
			localStorage.setItem('initial_referring_domain', this.extractHostname(referrer))

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
		this.initialReferrer = localStorage.getItem('search_engine');
		this.initialReferringDomain = localStorage.getItem('initial_referring_domain');
		this.searchEngine = localStorage.getItem('search_engine');

	}

	getTouchpoints() {
		return this.isDefined(navigator.maxTouchPoints) ? navigator.maxTouchPoints.toString() : '0';
	}

	getHardwareConcurrency() {
		return this.isDefined(navigator.hardwareConcurrency) ? navigator.hardwareConcurrency.toString() : '0';
	}

	getDeviceMemory() {
		return this.isDefined(navigator.deviceMemory) ? navigator.deviceMemory.toString() : '0';
	}
	getBrowserLanguages() {
		return this.isDefined(navigator.languages) ? navigator.languages.toString() : navigator.language;
	}



	getCookieEnabled() {
		return navigator.cookieEnabled ? "Cookies Enabled" : "Cookies Not Enabled";
	}

	getJavaEnabled() {
		if ((new RegExp('Edge[ /](\\d+[\\.\\d]+)')).test(navigator.userAgent)) {
			return 'Java Enabled By Default'
		}
		if 	(typeof navigator.javaEnabled !== 'unknown' && this.isDefined(navigator.javaEnabled) && navigator.javaEnabled()) {
			return 'Java Enabled';
		} else {
			return 'Java Not Enabled'
		}
	}

	getTitle() {
		var title = document.title;
		title = title && title.text ? title.text : title;

		if (!this.isString(title)) {
			var tmp = document.getElementsByTagName('title');
			if (tmp && this.isDefined(tmp[0])) {
				title = tmp[0].text;
			}
		}
		return title;
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
		var WUID = this.getCookie("WUID");
		var d = new Date();
		WUID = (WUID == "") ? WUID = this.generateRandom(16) : WUID;

		// Set user id for 365 days
		d.setTime(d.getTime() + (365 * 24 * 60 * 60 * 1000));
		var expires = "expires="+d.toUTCString();
		document.cookie = "WUID=" + WUID + ";" + expires + ";path=/";
		
		return WUID;
	}

	setWSID() {
		var WSID = this.getCookie("WSID");
		var d = new Date();
		WSID = (WSID == "") ? WSID = this.generateRandom(16) : WSID;

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
		var ua = navigator.userAgent;
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
		
		var cookiesJSON = [];
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
		var searchParams = new URLSearchParams(params);
		var paramsJSON = [];
		for(var pair of searchParams.entries()) {
			if (!(pair[0] in ['utm_source', 'utm_medium','utm_campaign','utm_content','utm_term'])) {
				paramsJSON.push({"paramName": pair[0].toString(), "paramValue": pair[1].toString()})
			}
		}
		return paramsJSON;
	}

	getDate(dateObj = undefined) {
		if (dateObj == undefined) {
			dateObj = new Date();
		}
		var dd = String(dateObj.getDate()).padStart(2, '0');
		var mm = String(dateObj.getMonth() + 1).padStart(2, '0'); //January is 0!
		var yyyy = dateObj.getFullYear();

		dateStr = yyyy + '-' + mm + '-' + dd;
		return dateStr
	}

	getDateTime(dateObj = undefined) {
		if (dateObj == undefined) {
			dateObj = new Date();
		}
		return dateObj.toISOString();
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
