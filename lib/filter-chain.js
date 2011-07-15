/**
 * A filter chain that mimics Servlets Filters from Java.
 * 
 * The FilterChain object exported is configurable with an array of Strings that define modules that should export a 
 * method filter(request, response, chain).
 * 
 * 
 * 
 * Usage
 * 
 * var FilterChain = require("filter-chain");
 * 
 * var chainDef = [
 * 		'./my-filters/sso',
 * 		'./my-filters/xsf-protect',
 * 		'./my-filters/not-modified-filter'
 * ];
 * 
 * var filterChain = new FilterChain(chainDef);
 * 
 * http.createServer(function(request, response) {
 * 
 * 		filterChain.execute(request, response);
 * 
 * }).listen(8080);
 * 
 */

/**
 * A re-usable FilterChain object, each call to execute has its own context.
 */
FilterChain = function(chainModules) {
	this.chain = new Array();
	for (var i = 0; i < chainModules.length; i++) {
		this.chain[i] = chainModules[i].filter;
	}
};

/**
 * Creates an inner object to keep the count and a reference to itself and the chain definition.
 * This is probably a good example for students on how closures work :)
 */
FilterChain.prototype.execute = function(request, response) {
	var chain = this.chain;
	var Closure = function() { 	// create a closure for the execution of the chain
		this.pos = 0;			// closure has the count
		var execution = this;
		
		this.doFilter = function() {		// function need not be a closure but makes access to pos and request / response convenient
			var next = chain[execution.pos++]; 	// get next function
			if (typeof next != 'undefined') {
				next(request, response, execution); 	// execute it
			}
		};
		
	};
	var instance = new Closure();
	instance.doFilter(request, response);
};

exports.FilterChain = FilterChain



/**
 *  Log filter as an example filter
 */ 
logFilter = function(request, response, chain) {
	// pre code
	console.log(request.url);
	
	// chain
	chain.doFilter(request, response);
	
	// post code
};

// Export a function as the name "filter", thus only one filter per module.
exports.filter = logFilter;

