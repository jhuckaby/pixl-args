// Simple command-line argument parser
// Copyright (c) 2015 Joseph Huckaby
// Released under the MIT License

var util = require("util");
var Class = require("pixl-class");

module.exports = Class.create({
	
	args: null,
	
	__construct: function() {
		// class constructor
		var argv = null;
		var args = null;
		
		if (arguments.length == 2) {
			argv = arguments[0];
			args = arguments[1];
		}
		else if (arguments.length == 1) {
			if (util.isArray(arguments[0])) argv = arguments[0];
			else args = arguments[0];
		}
		
		if (!argv) {
			// default to node cmdline args
			// skip over first two, as they will be node binary & main script js
			argv = process.argv.slice(2);
		}
		if (!args) args = {};
		this.parse(argv, args);
	},
	
	parse: function(argv, args) {
		// parse cmdline args (--key value)
		var lastKey = '';
		
		for (var idx = 0, len = argv.length; idx < len; idx++) {
			var arg = argv[idx];
			if (arg.match(/^\-+(.+)$/)) {
				// -key or --key
				if (lastKey) args[lastKey] = true;
				arg = RegExp.$1.trim();
				lastKey = arg;
			}
			else if (lastKey) {
				// simple value, use last key
				if (typeof(arg) == 'string') {
					if (arg.match(/^\-?\d+$/)) arg = parseInt(arg);
					else if (arg.match(/^\-?\d+\.\d+$/)) arg = parseFloat(arg);
				}
				if (typeof(args[lastKey]) != 'undefined') {
					if (util.isArray(args[lastKey])) args[lastKey].push( arg );
					else args[lastKey] = [ args[lastKey], arg ];
				}
				else args[lastKey] = arg;
				lastKey = '';
			}
		} // foreach arg
		
		if (lastKey) args[lastKey] = true;
		this.args = args;
	},
	
	get: function(key) {
		return key ? this.args[key] : this.args;
	},
	
	set: function(key, value) {
		this.args[key] = value;
	}
	
});