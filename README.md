>This repository is part of the [Pelias](https://github.com/pelias/pelias)
>project. Pelias is an open-source, open-data geocoder built by
>[Mapzen](https://www.mapzen.com/) that also powers [Mapzen Search](https://mapzen.com/projects/search). Our
>official user documentation is [here](https://mapzen.com/documentation/search/).

# Pelias Query
Elasticsearch geospatial and linguistic matching queries used by Pelias.

[![Build Status](https://travis-ci.org/pelias/query.png?branch=master)](https://travis-ci.org/pelias/query)

## Installation

```bash
$ npm install pelias-query
```

[![NPM](https://nodei.co/npm/pelias-query.png?downloads=true&stars=true)](https://nodei.co/npm/pelias-query)

## NPM Module

The `pelias-query` npm module can be found here:

[https://npmjs.org/package/pelias-query](https://npmjs.org/package/pelias-query)

#### About

This repository contains all the *geospatial* and *linguistic* matching Elasticsearch queries used in the [Pelias geocoder](https://github.com/pelias/pelias).

An attempt has been made to provide the queries in a more general-purpose fashion. Only a few variables need to be changed in order to use the same queries with any Elasticsearch [schema](https://github.com/pelias/schema).

Feel free to fork the project, Pull Requests are welcome!

#### Motivation

As the complexity and variability of database queries grows in a large project, their maintenance starts to become more and more difficult.

Changes to the controller layer can have significant impact on the query layer and vice versa, making refactoring a chore.

Additionally; the controller code used to compose these queries becomes a horrible mix of user input validation and query composition logic.

In many cases query logic is simply copy->pasted between queries to ensure validity when it could simply be reused.

This repo aims to solve some of these issues by providing:

- a logical boundary between query composition and input validation.
- a way to notate query variables which is distinct from the RESTful API.
- a method of composing complex queries from smaller components.
- a way of testing/debugging and re-using queries across repos/forks.
- a language which describes the problem domain rather than an individual implementation.

The composition workflow should be instantly familiar to anyone who has used an MVC-type framework before.

### Variables

Variables are used as placeholders in order to pre-build queries before we know the final values which will be provided by the user.

**note:** Variables can only be Javascript primitive types: `string` *or* `numeric` *or* `boolean`, plus `array`. No objects allowed.

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

// get the primitive value of a variable
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

This library provides a dictionary of common [default values](https://github.com/pelias/query/blob/master/defaults.json) which can be used when instantiating a new variable store.

The defaults should be sufficient in the vast majority of cases but you may elect to change these defaults in order to modify how the queries execute for your specific installation.

**note:** You can override any of the defaults at runtime.

```javascript
var query = require('pelias-query');

// create a new variable with the defaults
var vs = new query.Vars( query.defaults );

// print all set variables
console.log( vs.export() );
```

#### User Variables

Variables coming from user input should be set on the variable store **whenever they are available**, below is a list of common user variables which can be set/unset to enable/disable query functionality.

**note:** This list is non exhaustive, see the validation section of each view in order to confirm which specific variables it uses (explained below).

```
input:name: 'hackney city farm'

focus:point:lat: 1.1
focus:point:lon: 2.2

input:housenumber: 101
input:street: "hackney road"
input:postcode: "E81DN"

input:country_a: "GBR"
input:country: "hackney"
input:region: "hackney"
input:region_a: "hackney"
input:county: "hackney"
input:localadmin: "hackney"
input:locality: "hackney"
input:neighbourhood: "hackney"

input:categories: "food,education"

boundary:circle:lat: 1
boundary:circle:lon: 2
boundary:circle:radius: "50km"

boundary:rect:top: 1
boundary:rect:right: 2
boundary:rect:bottom: 2
boundary:rect:left: 1

boundary:country: "USA"
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

There is only one view available in this library (at this time), named the `FilteredBooleanQuery`. This is essentially the most versatile type of Elasticsearch query, all other examples you find online are simplified versions of this `layout`.

```javascript
var query = require('pelias-query');

var q = new query.layout.FilteredBooleanQuery();
```

##### FilteredBooleanQuery API

The `FilteredBooleanQuery` has two different methods for **assigning conditional views** *and* one method for handling the **sorting of results**.

##### .score()

The `.score` method is used to assign views which **will effect the scoring** of the results.

In most cases you can assume that **records which match more of these conditions will appear higher in the results than those which match fewer**.

```javascript
var q = new query.layout.FilteredBooleanQuery();

// a 'should' condition, if a record matches, it's score will be increased
q.score(view);

// this is simply a more explicit equivalent of the above ('should' is the default)
q.score(view, 'should');

// in this case we mark the view as a 'must' match condition.
// Matching results will effect the score **but** in this case
// **non-matching records will be removed from the results completely**
q.score(view, 'must');
```

##### .filter()

The `.filter` method is used to assign views which **do not effect the scoring** of results.

**note:** The more results you remove before sorting; using either this method *or* the `.score` method above (with 'must'), the better your query performance will be.

```javascript
var q = new query.layout.FilteredBooleanQuery();

// **non-matching records will be removed from the results completely**
q.filter(view);
```

##### .sort()

The `.sort` method is used to assign views which effect the sorting of results.

In effect this method is not as useful as it sounds, for the most part you should be using `.score` methods above to effect the sorting of results.

This function is only really useful in cases where a 'tiebreaker' is needed. For example: searching 'mcdonalds' may result in several records which scored the same value, in this case we can attempt to 'break the tie'.

**warning:** These functions are computed for every document which matches the above conditions. Adding many `.sort` conditions may have a negative affect on query performance.

```javascript
var q = new query.layout.FilteredBooleanQuery();

// this view is used to mediate 'tied' scoring situations
q.sort( view );
```

### Composing Complex Queries

Great! So with the building blocks above we can start to build composable, testable and re-usable queries.

#### Reverse Geocode

One of the simplest queries to build is a reverse geocoder, in this case we have indexed some documents with a `lat/lon` centroid and we would like to find the 1 nearest record to an arbitrary point.

```javascript
var query = require('pelias-query'),
    vs = new query.Vars( query.defaults );

// this is our focus point (somewhere in London)
var focus = { lat: 51.5, lon: -0.06 };

/**
  build a query with 2 conditions:
  - (optional) geographic bounds
  - sort results by distance
**/
var q = new query.layout.FilteredBooleanQuery()
  .filter( query.view.boundary_circle )
  .sort( query.view.sort_distance );

// we only want 1 result
vs.var('size', 1);

// set bounding variables
vs.set({
  'boundary:circle:lat': focus.lat,
  'boundary:circle:lon': focus.lon,
  'boundary:circle:radius': '5km'
});

// set focus point
vs.set({
  'focus:point:lat': focus.lat,
  'focus:point:lon': focus.lon
});

// render the query
var rendered = q.render( vs );
```

results in a query such as:

```javascript
{
  "query": {
    "filtered": {
      "query": {
        "bool": {}
      },
      "filter": {
        "bool": {
          "should": [
            {
              "geo_distance": {
                "distance": "5km",
                "distance_type": "plane",
                "optimize_bbox": "indexed",
                "_cache": true,
                "center_point": {
                  "lat": 51.5,
                  "lon": -0.06
                }
              }
            }
          ]
        }
      }
    }
  },
  "size": 1,
  "track_scores": true,
  "sort": [
    "_score",
    {
      "_geo_distance": {
        "order": "asc",
        "distance_type": "plane",
        "center_point": {
          "lat": 51.5,
          "lon": -0.06
        }
      }
    }
  ]
}
```


#### Linguistic Search with Local Bias

This example is the most commonly requested full-text search query. In this case we match *all* results but we also apply the following scoring:

1. better linguistic matches rank higher in the results
2. records near the 'focus' point also gain a localized 'boost'

In effect this means that we still show far away places but we also give more priority to local places.

```javascript
var query = require('pelias-query'),
    vs = new query.Vars( query.defaults );

// this is our focus point (somewhere in London)
var focus = { lat: 51.5, lon: -0.06 };

/**
  build a query with 2 conditions:
  - the linguistic matching strategy for scoring (phrase)
  - the geographic decay function (focus)
**/
var q = new query.layout.FilteredBooleanQuery()
  .score( query.view.phrase )
  .score( query.view.focus );

/**
  configure implementation-specific settings (or simply use the defaults):
  - phrase settings
  - focus settings
**/
vs.set({
  'phrase:field': 'phrase.default',
  'phrase:analyzer': 'standard',
  'focus:function': 'gauss',
  'focus:offset': '10km',
  'focus:scale': '100km',
  'focus:decay': 0.4
});

/**
  set the user-specific variables:
  - the input text provided by the user
  - the input point to use for localization
**/
vs.var('input:name', 'union square');
vs.var('focus:point:lat', focus.lat);
vs.var('focus:point:lon', focus.lon);

// render the query
var rendered = q.render( vs );
```

results in a query such as:

```javascript
{
  "query": {
    "filtered": {
      "query": {
        "bool": {
          "should": [
            {
              "match": {
                "phrase.default": {
                  "analyzer": "standard",
                  "type": "phrase",
                  "boost": 1,
                  "slop": 2,
                  "query": "union square"
                }
              }
            },
            {
              "function_score": {
                "query": {
                  "match": {
                    "phrase.default": {
                      "analyzer": "standard",
                      "type": "phrase",
                      "boost": 1,
                      "slop": 2,
                      "query": "union square"
                    }
                  }
                },
                "functions": [
                  {
                    "gauss": {
                      "center_point": {
                        "origin": {
                          "lat": 51.5,
                          "lon": -0.06
                        },
                        "offset": "10km",
                        "scale": "100km",
                        "decay": 0.4
                      }
                    }
                  }
                ],
                "score_mode": "avg",
                "boost_mode": "replace"
              }
            }
          ]
        }
      },
      "filter": {
        "bool": {}
      }
    }
  },
  "size": 10,
  "track_scores": true,
  "sort": [
    "_score"
  ]
}
```

#### More Examples

The above are examples of how you can compose queries which are testable, debuggable and re-usable, they can also be mixed & matched with other queries to build even more complex queries.

Rather than trying to document an exhaustive list of geospatial and linguistic queries here; we have added a bunch of examples in the [examples directory](https://github.com/pelias/query/tree/master/examples).

If you have any further questions please open an issue.

## Contributing

Please fork and pull request against upstream master on a feature branch.

Pretty please; provide unit tests and script fixtures in the `test` directory.

### Running Unit Tests

```bash
$ npm test
```
