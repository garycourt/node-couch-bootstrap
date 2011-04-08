var uri = require("../lib/uri-js").URI,
	util = require("./util"),
	vm = require('vm');

/**
 * This class encapsulates the environment of a JSON document.
 * 
 * @class
 * @param {object} doc The document that defines the package
 * @param {string} uri The URI of the document
 */

function Package(doc, uri) {
	this.doc = doc;
	this.uri = uri;
	this.modules = {};
}

/**
 * Executes the module code in the bootstrap doc at the provided path.
 * 
 * @param {string} path The path to the module code in the bootstrap doc
 * @return {object} The module
 */

Package.prototype.execModule = function (path) {
	var pkg = this, code, uriComponents, filename, script, sandbox;
	
	if (!this.modules[path]) {
		code = util.getPropertyByPath(pkg.doc, path);
		
		if (typeof code === "string") {
			uriComponents = uri.parse(pkg.uri);
			uriComponents.fragment = path;
			filename = uri.serialize(uriComponents);
			script = vm.createScript(code, filename);
			sandbox = {
				global : global,
				setTimeout : setTimeout,
				clearTimeout : clearTimeout,
				setInterval : setInterval,
				clearInterval : clearInterval,
				process : process,
				module : undefined,
				exports : {},
				require : function (relPath) {
					var absPath, requiredModule, requiredExports;
					
					if (relPath[0] === ".") {
						absPath = uri.resolve(path, relPath);
						requiredModule = pkg.execModule(absPath);
						requiredExports = requiredModule && requiredModule.exports;
					} else {
						requiredExports = require(relPath);
					}
					
					return requiredExports;
				}
			};
			sandbox.module = sandbox;
			
			script.runInNewContext(sandbox);
		}
	} else {
		sandbox = pkg.modules[path];
	}
	
	return sandbox;
};

exports.Package = Package;