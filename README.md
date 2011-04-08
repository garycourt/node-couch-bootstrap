# Node.js Couch Bootstrap

Bootstraps (loads code into) a Node.js instance using JavaScript code from a CouchDB/CouchApp/HTTP JSON document.

## Installation

	git clone https://github.com/garycourt/node-couch-bootstrap.git

## Usage

A bootstrap document is simply a JSON document with your Node.js code as the strings of object properties. 
Here's an example:

	{
		"node" : {
			"msg" : "exports.msg = 'Hello World!';",
			"world" : "var msg = require('./msg').msg; process.stdout.write('Message: ' + msg + '\\n');"
		}
	}

Place your bootstrap JSON document on an HTTP server. 
Then, run node-couch-bootstrap with the URL of the JSON document, plus the path fragment to the main code. 
For example, if the JSON doc is hosted on a CouchDB server (as a design doc), you would load it using:

	node node-couch-bootstrap http://localhost:5984/db/_design/bootstrap#/node/world

## License

Copyright 2011 Gary Court. All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are
permitted provided that the following conditions are met:

   1. Redistributions of source code must retain the above copyright notice, this list of
      conditions and the following disclaimer.

   2. Redistributions in binary form must reproduce the above copyright notice, this list
      of conditions and the following disclaimer in the documentation and/or other materials
      provided with the distribution.

THIS SOFTWARE IS PROVIDED BY GARY COURT ``AS IS'' AND ANY EXPRESS OR IMPLIED
WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL GARY COURT OR
CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF
ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

The views and conclusions contained in the software and documentation are those of the
authors and should not be interpreted as representing official policies, either expressed
or implied, of Gary Court.