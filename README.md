Elasticsearch geospatial and liguistic matching queries used by Pelias.

## Installation

```bash
$ npm install pelias-query
```

[![NPM](https://nodei.co/npm/pelias-query.png?downloads=true&stars=true)](https://nodei.co/npm/pelias-query)

## NPM Module

The `pelias-query` npm module can be found here:

[https://npmjs.org/package/pelias-query](https://npmjs.org/package/pelias-query)

### Variables

We can use variables as placeholders to build a query before we know the final value.

Variables can only be javascript primative types: `string|numeric|boolean`

```javascript
var query = require('pelias-query');

// create a new variable collection
var vs = new query.Vars();

// set a variable
vs.var('input:name', 'hackney city farm');

// or
vs.var('input:name').set('hackney city farm');

// get a variable
var a = vs.var('input:name');

// get the primative value of a variable
var a = vs.var('input:name');
a.get(); // hackney city farm
a.toString(); // hackney city farm
a.valueOf(); // hackney city farm
a.toJSON(); // hackney city farm

// check if a variable has been set
vs.isset('input:name'); // true
vs.isset('foo'); // false

// bulk set many variables
vs.set({
  'boundary:rect:top': 1,
  'boundary:rect:right': 2,
  'boundary:rect:bottom': 2,
  'boundary:rect:left': 1
});

// export variables for debugging
vs.export();
```

#### Default Variables

You can initalize a variable collection when you instantiate it, this library provides a dictionary of [common default](https://github.com/pelias/query/blob/master/defaults.json) values.

```javascript
var query = require('pelias-query');

// create a new variable with the defaults
var vs = new query.Vars( query.defaults );

// print all set variables
console.log( vs.export() );
```

### Views

Complex queries can be composed of smaller 'views', these are query blocks which are marked up with placeholder variables and later 'compiled' with the actual user variables in place.

Views are essentially just a function which takes one arguments (the variable collection `vs`) and returns either `null` (if the required variables are not available) *or* a javascript object which encapsulates the view.

```javascript
// example of a 'view'
function ( vs ){

  // validate required params
  if( !vs.isset('input:name') ||
      !vs.isset('ngram:analyzer') ||
      !vs.isset('ngram:field') ||
      !vs.isset('ngram:boost') ){
    return null;
  }

  // base view
  var view = { "match": {} };
  
  // match query
  view.match[ vs.var('ngram:field') ] = {
    analyzer: vs.var('ngram:analyzer'),
    boost: vs.var('ngram:boost'),
    query: vs.var('input:name')
  };

  return view;
}
```

It's best practise to validate the variable(s) you are going to use at the top of your view so that 1) it doesn't execute with unmet dependencies and 2) it is clear for other developers how to execute it.

#### Example

An example of the above view rendered would look like this:

```javascript
var query = require('pelias-query');

var vs = new query.Vars({
  'input:name': 'hackney city farm',
  'ngram:analyzer': 'standard',
  'ngram:field': 'name.default',
  'ngram:boost': 1
});

var view = query.view.ngrams;
var rendered = view( vs );
```

```javascript
{
  "match": {
    "name.default": {
      "analyzer": "standard",
      "boost": 1,
      "query": "hackney city farm"
    }
  }
}
```

## Contributing

Please fork and pull request against upstream master on a feature branch.

Pretty please; provide unit tests and script fixtures in the `test` directory.

### Running Unit Tests

```bash
$ npm test
```

### Continuous Integration

Travis tests every release against node versions `0.10` and `0.12`

[![Build Status](https://travis-ci.org/pelias/query.png?branch=master)](https://travis-ci.org/pelias/query)