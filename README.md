# ServletsFilter style request chaining.

This is very simple single file module, but provides a nice structure for webapps allowing you to introduce configurable aspects to each request.

The chain is configured in code, you can externalize it if you need.

## Usage:

First load a set of filters

	var attributesFilter = 		require("../server/attributes-filter"),
		logRequestFilter = 	require("../server/log-request-filter")
		serverHeaderFilter = 	require("../server/server-header-filter"),
		notModifiedFilter = 	require("../server/not-modified-filter"),
		routerFilter = 		require("../server/router");

Create an ordered array of the filters and pass it to the _FilterChain_ constructor 

	var chainModules = [
		attributesFilter, 
		logRequestFilter, 
		serverHeaderFilter,
		notModifiedFilter,
		routerFilter
	];

	var chain = new FilterChain(chainModules);


Then, in a server start the chain with it's _execute()_ method, passing the _request_ and _response_.


	http.createServer(function(request, response) {
		// N.B a typical router should be in the chain
		//router.route(request, response);

		chain.execute(request, response);

	}).listen(8000);


That's it, nothing special, but a usefull design pattern.


Filters look identical to Java Servlets filters.

	var parse = require('url').parse;

	filter = function(request, response, chain) {

		var url = parse(request.url);
		console.log(request.method + " " + url.pathname);

		chain.doFilter(request, response);

	};

	exports.filter = filter;

You must export a function called _filter_, but the module can do any thing else as well.


