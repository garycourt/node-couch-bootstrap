var uri = require("../lib/uri-js").URI,
	http = require("http");

/**
 * Console object
 */

exports.console = {
	log : function (msg) {
		process.stdout.write(msg + "\n");
	},
	
	error : function (msg) {
		if (msg.stack) {
			process.stderr.write(msg.stack + "\n");
		} else {
			process.stderr.write(msg + "\n");
		}
	}
};

/**
 * Fetchs a document from the provided URL.
 * 
 * @param {string} url The URL of the document to fetch
 * @param {function<*,string?>} callback The callback to pass the error/document to
 */

exports.getDoc = function (url, callback) {
	var urlComponents = uri.parse(url);
	
	return http.get({
		host : urlComponents.host,
		port : urlComponents.port,
		path : urlComponents.path + (urlComponents.query ? "?" + urlComponents.query : "")
	}, function onSuccess(res) {
		var doc = "";
		
		if (res.statusCode >= 200 && res.statusCode < 300) {
			res.on('data', function onData(chunk) {
				doc += chunk;
			});
			
			res.on('end', function onEnd() {
				callback(null, doc);
			});
		} else {
			callback(res.statusCode);
		}
	}).on('error', function onError(e) {
		callback(e);
	});
};

/**
 * Returns the value of the property of the object specified by the provided path.
 * 
 * @param {object} obj The object to query
 * @param {string} path The path to the property of the object
 * @return {*} The value of the property 
 */

exports.getPropertyByPath = function (obj, path) {
	var keys, key, x, xl;
	
	if (path.indexOf('/') === 0) {
		path = path.slice(1);
	}
	
	if (path.indexOf('/') > -1) {
		keys = path.split('/');
		key = uri.unescapeComponent(keys[0]);
		for (x = 1, xl = keys.length; x < xl; ++x) {
			obj = obj[key];
			if (obj === undefined || obj === null) {
				return obj;
			}
			key = uri.unescapeComponent(keys[x]);
		}
		return obj[key];
	}
	//else
	return obj[path];
};