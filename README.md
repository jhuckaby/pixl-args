# Overview

This module provides a simple interface to the command-line arguments used to instantiate Node.js scripts.  It parses double-dash key/value arguments in the form `--key value --key value`.  The library then provides a `get()` method to get individual values, or everything as one object.  Multiple keys with the same name are pushed onto an array.  No dependencies.

# Usage

Use [npm](https://www.npmjs.com/) to install the module:

```sh
npm install pixl-args
```

Then use `require()` to load it in your code:

```js
const Args = require('pixl-args');
```

To use the module, instantiate an object:

```js
let args = new Args();
```

This will, by default, parse all the Node.js command-line args used to instantiate your script.  They are then accessible by calling `get()` on your `args` object, passing in the key you are interested in.  So, imagine if your script was invoked on the CLI thusly:

```sh
node your-script.js --verbose 1 --debug 0
```

You could then access the command-line arguments like this:

```js
let verbose = args.get('verbose');
let debug = args.get('debug');
```

If you just want a hash of all the arguments, call `get()` without passing a key:

```js
let opts = args.get();
if (opts.verbose) console.log("Verbose flag is set.");
if (opts.debug) console.log("Debug flag is set.");
```

## Default Args

You can pass in a hash of default arguments to the class constructor.  The command-line will override these, or add new ones.  Example:

```js
let args = new Args( {
	verbose: 0,
	debug: 0
} );
```

## Valueless Args

Arguments without an explicit value are set to Boolean `true`.  Example:

```sh
node your-script.js --verbose --debug
```

Then calling `get()`, this becomes:

```json
{
	"verbose": true,
	"debug": true
}
```

## String Handling

Strings are handled by the shell, so anything crazy like spaces and such should be wrapped in quotes and/or escaped properly.  The library doesn't do any special processing, and simply deals with what it gets.

```sh
node your-script.js --name "Joseph Huckaby" --city San\ Mateo
```

Then calling `get()`, this becomes:

```json
{
	"name": "Joseph Huckaby",
	"city": "San Mateo"
}
```

## Number Handling

Argument values which *appear to be numbers* are parsed as such.  This includes negative and positive base-10 integers and floats.  Everything else is considered to be a string.

```sh
node your-script.js --amount 50 --freq 0.5 --volume loud
```

Then calling `get()`, this becomes:

```json
{
	"amount": 50,
	"freq": 0.5,
	"volume": "loud"
}
```

## Duplicate Args

Duplicate arguments with the same name are converted into arrays, with the order preserved.  Example:

```sh
node your-script.js --action delete --key value1 --key value2
```

Then calling `get()`, this becomes:

```json
{
	"action": "delete",
	"key": [
		"value1",
		"value2"
	]
}
```

## Other Args

Any command-line arguments that don't follow the `--key value` pattern, meaning those located before or after your keyed arguments, are appended to an `other` array.  Example:

```sh
node your-script.js file1.txt file2.txt --action delete --key value1 --key value2
```

Then calling `get()`, this becomes:

```json
{
	"action": "delete",
	"key": [
		"value1",
		"value2"
	],
	"other": [
		"file1.txt",
		"file2.txt"
	]
}
```

You can place your "other" args at the beginning or at the end of the keyed arguments.  However, for the latter just beware of using a [Valueless Arg](#valueless-args) as the final keyed argument.

## Double-Dash Separator

If a double-dash separator (`--`) is encountered, then named argument processing stops, and anything after the `--` is added onto the `other` array.  Example:

```sh
node your-script.js --key1 value1 --key2 value2 -- --key3 value3 --key4 value4
```

Then calling `get()`, this becomes:

```json
{
	"key1": "value1",
	"key2": "value2",
	"other": [
		"--key3",
		"value3",
		"--key4",
		"value4"
	]
}
```

## Custom Input Args

The class constructor accepts an optional list of arguments to parse, which defaults to [process.argv](https://nodejs.org/docs/latest/api/process.html#processargv), but can be any array you give it.  Example:

```js
let args = new Args( ["--verbose", "1", "--debug", "0"] );
```

To combine this with the default arguments feature, pass the list of arguments array first, and the default arguments hash second.

# License

**The MIT License**

Copyright (c) 2015 - 2024 Joseph Huckaby and PixCore.com.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
