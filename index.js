/**
 * node-couch-bootstrap.js
 * 
 * @fileoverview Bootstraps (loads code into) a Node.js instance using JavaScript code from a CouchDB/CouchApp document.
 * @author <a href="mailto:gary.court@gmail.com">Gary Court</a>
 * @version 0.0
 * @see http://github.com/garycourt/node-couch-bootstrap
 * @license (c) 2011 Gary Court
 * @example node index.js http://localhost:5984/db/_design/bootstrap#/node/index
 */

var console,
	uri = require("./lib/uri-js"),
	http = require("http"),
	bootstrapDocUri = process.argv[2],
	bootstrapDoc;

/**
 * Console object
 */

console = {
	log : function (msg) {
		process.stdout.write(msg + "\n");
	},
	
	error : function (msg) {
		process.stderr.write(msg + "\n");
	}
};

/**
 * Fetchs a document from the provided URL.
 * 
 * @param {string} url The URL of the document to fetch
 * @param {function<*,string?>} callback The callback to pass the error/document to
 */

function getDoc(url, callback) {
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
}

/**
 * Returns the value of the property of the object specified by the provided path.
 * 
 * @param {object} obj The object to query
 * @param {string} path The path to the property of the object
 * @return {*} The value of the property 
 */

function getPropertyByPath(obj, path) {
	var parts = path.split('/');
	//TODO
}

/**
 * Executes the module code in the bootstrap doc at the provided path.
 * 
 * @param {string} path The path to the module code in the bootstrap doc
 * @return {object} The module
 */

function execModule(path) {
	var code, bootstrapDocUriComponents, filename, script, sandbox;
		
	code = getPropertyByPath(bootstrapDoc, path);
	bootstrapDocUriComponents = uri.parse(bootstrapDocUri);
	bootstrapDocUriComponents.fragment = path;
	filename = uri.serialize(bootstrapDocUriComponents);
	script = vm.createScript(code, filename);
	sandbox = {
		exports : {},
		require : function () {}  //TODO
	};
	sandbox.module = sandbox;
	
	script.runInNewContext(sandbox);
	return sandbox;
}

/*
 * Bootstrap
 */

getDoc(bootstrapDocUri, function (err, doc) {
	var mainCodePath;
	
	if (!err) {
		try {
			bootstrapDoc = JSON.parse(doc);
			mainCodePath = uri.parse(bootstrapDocUri).fragment;
			try {
				exports.mainModule = execModule(mainCodePath);
			} catch (e) {
				console.error("Failed to execute main module: " + e);
			}
		} catch (e) {
			console.error("Failed to parse bootstrap doc: " + e);
		}
	} else {
		console.error("Failed to get bootstrap doc: " + err);
	}
});