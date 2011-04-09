/**
 * node-couch-bootstrap.js
 * 
 * @fileoverview Bootstraps a Node.js instance using JavaScript code from a CouchDB/CouchApp/HTTP JSON document.
 * @author <a href="mailto:gary.court@gmail.com">Gary Court</a>
 * @version 1.0
 * @see http://github.com/garycourt/node-couch-bootstrap
 * @license (c) 2011 Gary Court. License: http://github.com/garycourt/node-couch-bootstrap
 * @example node index.js http://localhost:5984/db/_design/bootstrap#/node/index
 */

var util = require("./src/util"),
	console = util.console,
	uri = require("./lib/uri-js").URI,
	Package = require("./src/package").Package,
	bootstrapDoc,
	bootstrapDocUri,
	bootstrapDocUriComponents,
	mainCodePath,
	bootstrapPackage;

/*
 * Bootstrap
 */

bootstrapDocUriComponents = uri.parse(process.argv[2]);
mainCodePath = bootstrapDocUriComponents.fragment;
bootstrapDocUriComponents.fragment = undefined;
bootstrapDocUri = uri.serialize(bootstrapDocUriComponents);

if (bootstrapDocUri && mainCodePath) {
	util.getDoc(bootstrapDocUri, function (err, doc) {
		if (!err) {
			try {
				bootstrapDoc = JSON.parse(doc);
				bootstrapPackage = new Package(bootstrapDoc, bootstrapDocUri);
				exports.mainPackage = bootstrapPackage;
				
				try {
					exports.mainModule = bootstrapPackage.execModule(mainCodePath);
				} catch (f) {
					console.error("Failed to execute main module:");
					console.error(f);
				}
			} catch (e) {
				console.error("Failed to parse bootstrap doc:");
				console.error(e);
			}
		} else {
			console.error("Failed to get bootstrap doc:");
			console.error(err);
		}
	});
} else if (!bootstrapDocUri) {
	console.error("No bootstrap doc URL provided.");
} else if (!mainCodePath) {
	console.error("No main code path provided.");
}