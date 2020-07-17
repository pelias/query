const _ = require('lodash');
const Query = require('./Query');
const match_phrase = require('../lib/leaf/match_phrase');
const turf = require('@turf/turf');

function createAddressShould(vs) {
  const should = {
    bool: {
      _name: 'fallback.address',
      must: [
        match_phrase('address_parts.number', vs.var('input:housenumber')),
        match_phrase('address_parts.street', vs.var('input:street'), {
          slop: vs.var('address:street:slop'),
          analyzer: vs.var('address:street:analyzer')
        })
      ],
      filter: {
        term: {
          layer: 'address'
        }
      }
    }
  };

  if (vs.isset('boost:address')) {
    should.bool.boost = vs.var('boost:address');
  }

   // if there are layer->id mappings, add the layers with non-empty ids
   if (vs.isset('input:layers')) {
    // using $ due to reference object and not scalar object
    const layers_map = vs.var('input:layers').$;

    const layer_filters = Object.keys(layers_map).reduce((acc, layer) => {
      if (!_.isEmpty(layers_map[layer]) && !_.isEmpty(layers_map[layer].ids)) {
        acc.push(createLayerIdsShould(layer, layers_map[layer].ids));
      }
      return acc;
    }, []);

    if (!_.isEmpty(layer_filters)) {
      should.bool.should = [...should.bool.should || [], layer_filters]
    }
  }

  return should;
}

function createUnitAndAddressShould(vs) {
  const should = {
    bool: {
      _name: 'fallback.address',
      must: [
        match_phrase('address_parts.unit', vs.var('input:unit')),
        match_phrase('address_parts.number', vs.var('input:housenumber')),
        match_phrase('address_parts.street', vs.var('input:street'), {
          slop: vs.var('address:street:slop'),
          analyzer: vs.var('address:street:analyzer')
        })
      ],
      filter: {
        term: {
          layer: 'address'
        }
      }
    }
  };

  if (vs.isset('boost:address')) {
    should.bool.boost = vs.var('boost:address');
  }

   // if there are layer->id mappings, add the layers with non-empty ids
   if (vs.isset('input:layers')) {
    // using $ due to reference object and not scalar object
    const layers_map = vs.var('input:layers').$;

    const layer_filters = Object.keys(layers_map).reduce((acc, layer) => {
      if (!_.isEmpty(layers_map[layer]) && !_.isEmpty(layers_map[layer].ids)) {
        acc.push(createLayerIdsShould(layer, layers_map[layer].ids));
      }
      return acc;
    }, []);

    if (!_.isEmpty(layer_filters)) {
      should.bool.should = [...should.bool.should || [], layer_filters]
    }
  }

  return should;
}

function createPostcodeAndAddressShould(vs) {
  const should = {
    bool: {
      _name: 'fallback.address',
      must: [
        match_phrase('address_parts.zip', vs.var('input:postcode')),
        match_phrase('address_parts.number', vs.var('input:housenumber')),
        match_phrase('address_parts.street', vs.var('input:street'), {
          slop: vs.var('address:street:slop'),
          analyzer: vs.var('address:street:analyzer')
        })
      ],
      filter: {
        term: {
          layer: 'address'
        }
      }
    }
  };

  if (vs.isset('boost:address')) {
    should.bool.boost = vs.var('boost:address');
  }

   // if there are layer->id mappings, add the layers with non-empty ids
   if (vs.isset('input:layers')) {
    // using $ due to reference object and not scalar object
    const layers_map = vs.var('input:layers').$;

    const layer_filters = Object.keys(layers_map).reduce((acc, layer) => {
      if (!_.isEmpty(layers_map[layer]) && !_.isEmpty(layers_map[layer].ids)) {
        acc.push(createLayerIdsShould(layer, layers_map[layer].ids));
      }
      return acc;
    }, []);

    if (!_.isEmpty(layer_filters)) {
      should.bool.should = [...should.bool.should || [], layer_filters]
    }
  }

  return should;
}

function createStreetShould(vs) {
  const should = {
    bool: {
      _name: 'fallback.street',
      must: [
        match_phrase('address_parts.street', vs.var('input:street'), {
          slop: vs.var('address:street:slop'),
          analyzer: vs.var('address:street:analyzer')
        })
      ],
      filter: {
        term: {
          layer: 'street'
        }
      }
    }
  };

  if (vs.isset('boost:street')) {
    should.bool.boost = vs.var('boost:street');
  }

   // if there are layer->id mappings, add the layers with non-empty ids
   if (vs.isset('input:layers')) {
    // using $ due to reference object and not scalar object
    const layers_map = vs.var('input:layers').$;

    const layer_filters = Object.keys(layers_map).reduce((acc, layer) => {
      if (!_.isEmpty(layers_map[layer]) && !_.isEmpty(layers_map[layer].ids)) {
        acc.push(createLayerIdsShould(layer, layers_map[layer].ids));
      }
      return acc;
    }, []);

    if (!_.isEmpty(layer_filters)) {
      should.bool.should = [...should.bool.should || [], layer_filters]
    }
  }

  return should;

}

function createLayerIdsShould(layer, ids) {
  // create an object initialize with terms.'parent.locality_id' (or whatever)
  // must use array syntax for 2nd parameter as _.set interprets '.' as new object
  return _.set({}, ['terms', `parent.${layer}_id`], ids);
}

function createLayerBoundingBoxesShould(bboxes) {
  // TODO: make sure to use centroid point var here
  return bboxes.map((bbox) => {
    if (bbox.min_lat === bbox.max_lat || bbox.min_lon === bbox.max_lon) {
      return;
    }
    console.log(bbox);

    var poly = turf.lineString([[bbox.min_lat,bbox.min_lon],[bbox.max_lat,bbox.max_lon]]);
    var scaledPoly = turf.transformScale(poly, 1.5);
    // Returns BBox bbox extent in [minX, minY, maxX, maxY] order
    const [minX, minY, maxX, maxY]  = turf.bbox(scaledPoly);

    // ex:
    //  {
    //   min_lat: 44.530798,
    //   max_lat: 44.6445012385,
    //   min_lon: -87.825856,
    //   max_lon: -87.7623760999
    // }

    return {
        "geo_bounding_box" : {
          "center_point" : {
              // "top": maxY,
              // "right": maxX,
              // "bottom": minY,
              // "left": minX,
              "top": bbox.max_lat,
              "right": bbox.max_lon,
              "bottom": bbox.min_lat,
              "left": bbox.min_lon,
          }
      },
    }
  }).filter(Boolean);
}

class AddressesUsingIdsQuery extends Query {
  constructor() {
    super();
  }

  render(vs) {
    // establish a base query with 'street' should condition and size/track_scores
    const base = {
      query: {
        function_score: {
          query: {
            bool: {
              minimum_should_match: 1,
              should: [
                createStreetShould(vs)
              ]
            }
          }
        }
      },
      size: vs.var('size'),
      track_scores: vs.var('track_scores')
    };

    // if there are layer->id mappings, add the layers with non-empty ids
    if (vs.isset('input:layers')) {
      // using $ due to reference object and not scalar object
      const layers_map = vs.var('input:layers').$;

      // add the layers-to-ids 'should' conditions
      // if layers_map is:
      // {
      //   locality: {ids: [1, 2], bounding_boxes: [{...}, {....}]},
      //   localadmin: {ids: [], },
      //   region: {ids: [3, 4]}
      // }
      // then this adds the results of:
      // - createShould('locality', [1, 2])
      // - createShould('region', [3, 4])
      // to an array
      const layer_filters = Object.keys(layers_map).reduce((acc, layer) => {
        if (!_.isEmpty(layers_map[layer]) && !_.isEmpty(layers_map[layer].ids)) {
          const layer_ids_should = createLayerIdsShould(layer, layers_map[layer].ids);

          const layer_bounding_box_clauses = createLayerBoundingBoxesShould(layers_map[layer].bounding_boxes);
          console.log(layer_bounding_box_clauses);

          acc.push({bool: {
            minimum_should_match: 1,
            should: [...layer_bounding_box_clauses, layer_ids_should]
          }});
        }
        return acc;
      }, []);

      // add filter.bool.minimum_should_match and filter.bool.should,
      //  creating intermediate objects as it goes
      _.set(base.query.function_score.query.bool, 'filter.bool', {
        minimum_should_match: 1,
        should: layer_filters
      });
    }

    // add unit/housenumber/street if available
    if (vs.isset('input:housenumber') && vs.isset('input:postcode')) {
      base.query.function_score.query.bool.should.push(createPostcodeAndAddressShould(vs));
    }
    // add unit/housenumber/street if available
    if (vs.isset('input:housenumber') && vs.isset('input:unit')) {
      base.query.function_score.query.bool.should.push(createUnitAndAddressShould(vs));
    }
    else if (vs.isset('input:housenumber')) {
      base.query.function_score.query.bool.should.push(createAddressShould(vs));
    }

    // add any scores (_.compact removes falsey values from arrays)
    if (!_.isEmpty(this._score)) {
      base.query.function_score.functions = _.compact(this._score.map(view => view(vs)));
    }

    // add any filters
    if (!_.isEmpty(this._filter)) {
      // add filter.bool.must, creating intermediate objects if they don't exist
      //  using _.set does away with the need to check for object existence
      // _.compact removes falsey values from arrays
      _.set(
        base.query.function_score.query.bool,
        'filter.bool.must',
        _.compact(this._filter.map(view => view(vs))));

    }

    return base;
  }

}

module.exports = AddressesUsingIdsQuery;
