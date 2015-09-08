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

Variables are used as placeholders in order to pre-build queries before we know the final values which will be provided by the user.

**note:** Variables can only be javascript primative types: `string` *or* `numeric` *or* `boolean`

#### VariableStore API

```javascript
var query = require('pelias-query');

// create a new variable store
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
var dict = vs.export();
console.log( dict );
```

#### Default Variables

You can initalize the variables in a collection when you instantiate it. This library provides a dictionary of common [default values](https://github.com/pelias/query/blob/master/defaults.json).

The defaults should be used in a majority of cases but you may change these defaults in order to modify how the queries execute for your specific installation.

```javascript
var query = require('pelias-query');

// create a new variable with the defaults
var vs = new query.Vars( query.defaults );

// print all set variables
console.log( vs.export() );
```

### Views

Complex queries can be composed of smaller 'views', these are query blocks which are marked up with placeholder variables and later 'compiled' with the actual user variables in place.

Views are essentially just a function which takes one argument (the variable store `vs`) and returns either `null` (if the required variables are not available) *or* a javascript object which encapsulates the view.

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

It's best practice to validate the variable(s) you are going to use at the top of your view so that:

1. it doesn't execute with unmet dependencies *and*
2. it is clear for other developers which variables are required to execute it

#### View API

An example of the above view rendered would look like this:

```javascript
var query = require('pelias-query'),
    view = query.view.ngrams;

var vs = new query.Vars({
  'input:name': 'hackney city farm',
  'ngram:analyzer': 'standard',
  'ngram:field': 'name.default',
  'ngram:boost': 1
});

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

### Layouts

Just as with most MVC frameworks the 'meta' view is called a 'layout', this is the envelope which wraps all other views.

There is only one view available in this library (at this time), named the `FilteredBooleanQuery`. This is essentially the most versatile type of elasticsearch query, all other examples you find online are simplified versions of this `layout`.

```javascript
var query = require('pelias-query');

var q = new query.layout.FilteredBooleanQuery();
```

##### FilteredBooleanQuery API

The `FilteredBooleanQuery` has two different methods for assigning views.

##### Score

The `.score` method is used to assign views which **will effect the scoring** of the results.

In most cases you can assume that records which match more conditions will appear higher in the results than those which match fewer.

```javascript
var q = new query.layout.FilteredBooleanQuery();

// a 'should' condition, if a record matches, it's score will be increased
q.score( view );

// this is simply a more explicit equivalent of the above ('should' is the default)
q.score( view, 'should' );

// in this case we mark the view as a 'must' match condition.
// Matching results will effect the score **but** in this case
// **non-matching records will be removed from the results completely**
q.score( view, 'must' );
```

##### Filter

The `.filter` method is used to assign views which **do not effect the scoring** of results.

```javascript
var q = new query.layout.FilteredBooleanQuery();

// **non-matching records will be removed from the results completely**
q.filter( view );
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