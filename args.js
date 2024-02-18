// Simple command-line argument parser
// Copyright (c) 2015 - 2024 Joseph Huckaby
// Released under the MIT License

module.exports = class Args {
	
	constructor() {
		// class constructor
		let argv = null;
		let defaults = null;
		
		if (arguments.length == 2) {
			argv = arguments[0];
			defaults = arguments[1];
		}
		else if (arguments.length == 1) {
			if (Array.isArray(arguments[0])) argv = arguments[0];
			else defaults = arguments[0];
		}
		
		if (!argv) {
			// default to node cmdline args
			// skip over first two, as they will be node binary & main script js
			argv = process.argv.slice(2);
		}
		this.parse(argv);
		
		// apply defaults
		if (defaults) {
			for (let key in defaults) {
				if (typeof(this.args[key]) == 'undefined') {
					this.args[key] = defaults[key];
				}
			}
		}
	}
	
	parse(argv, args) {
		// parse cmdline args (--key value)
		if (!args) args = {};
		let lastKey = '';
		let endMark = false;
		
		for (let idx = 0, len = argv.length; idx < len; idx++) {
			let arg = argv[idx];
			
			if (!endMark && arg.match(/^\-\-$/)) {
				// stop processing
				endMark = true;
				lastKey = '';
			}
			else if (!endMark && arg.match(/^\-+(.+)$/)) {
				// multi-dash, parse as --key
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
					if (Array.isArray(args[lastKey])) args[lastKey].push( arg );
					else args[lastKey] = [ args[lastKey], arg ];
				}
				else args[lastKey] = arg;
				lastKey = '';
			}
			else {
				// add non-keyed args to 'other'
				if (!args.other) args.other = [];
				if (Array.isArray(args.other)) args.other.push( arg );
				else args.other = [ args.other, arg ];
			}
		} // foreach arg
		
		if (lastKey) args[lastKey] = true;
		this.args = args;
	}
	
	get(key) {
		return key ? this.args[key] : this.args;
	}
	
	set(key, value) {
		this.args[key] = value;
	}
	
}
