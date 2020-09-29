const _ = require('lodash');
const Query = require('./Query');
const match_phrase = require('../lib/leaf/match_phrase');
const turf = require('@turf/turf');


function createParentIdShould(layer, ids) {
  // create an object initialize with terms.'parent.locality_id' (or whatever)
  // must use array syntax for 2nd parameter as _.set interprets '.' as new object
  return _.set({}, ['terms', `parent.${layer}_id`], ids);
}

function getLayersIdMap(vs) {
  if (vs.isset('input:layers') || vs.isset('input:layers:ids')) {
    return vs.var('input:layers').$ || vs.var('input:layers:ids').$;
  } 
  return {};
}

function createLayerIdsShould(vs) {
  // if there are layer->id mappings , build an array of objects suitable
  // for filter or query context that check if the id is in the parents
  // of the search.
  //
  // This is designed to boost exact parent id containment matches over
  // looser bounding box in our filter query.

  const layers_map = getLayersIdMap(vs);

  return Object.keys(layers_map).reduce((acc, layer) => {
    if (!_.isEmpty(layers_map[layer])) {
      acc.push(createParentIdShould(layer, layers_map[layer]));
    }
    return acc;
  }, []);
}

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

  // Give a little should boost to features that have a parent id that
  // perfectly matches part of the searched for admin hierarchy,
  // so they beat out hits that were retrieved based on bounding box containment
  const layer_filters = createLayerIdsShould(vs);
  if (!_.isEmpty(layer_filters)) {
    should.bool.should = [...should.bool.should || [], layer_filters];
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

  // Give a little should boost to features that have a parent id that
  // perfectly matches part of the searched for admin hierarchy,
  // so they beat out hits that were retrieved based on bounding box containment
  const layer_filters = createLayerIdsShould(vs);
  if (!_.isEmpty(layer_filters)) {
    should.bool.should = [...should.bool.should || [], layer_filters];
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

  // Give a little should boost to features that have a parent id that
  // perfectly matches part of the searched for admin hierarchy,
  // so they beat out hits that were retrieved based on bounding box containment
  const layer_filters = createLayerIdsShould(vs);
  if (!_.isEmpty(layer_filters)) {
    should.bool.should = [...should.bool.should || [], layer_filters];
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

  // Give a little should boost to features that have a parent id that
  // perfectly matches part of the searched for admin hierarchy,
  // so they beat out hits that were retrieved based on bounding box containment
  const layer_filters = createLayerIdsShould(vs);
  if (!_.isEmpty(layer_filters)) {
    should.bool.should = [...should.bool.should || [], layer_filters];
  }

  return should;
}

function createLayerBoundingBoxesShould(vs, bboxes, scale = 1.0) {
  return bboxes.map((bbox) => {
    if (bbox.min_lat === bbox.max_lat || bbox.min_lon === bbox.max_lon) {
      return;
    }

    var poly = turf.bboxPolygon([bbox.min_lon, bbox.min_lat, bbox.max_lon, bbox.max_lat]);
    var scaledPoly = turf.transformScale(poly, scale);
    const [minX, minY, maxX, maxY]  = turf.bbox(scaledPoly);

    return _.set({}, `geo_bounding_box.${vs.var('centroid:field').$}`, {
      'top': maxY,
      'right': maxX,
      'bottom': minY,
      'left': minX,
    });
  }).filter(clause => clause !== undefined);
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
    // old style: input:layers = [1, 2, 3]
    // new style: input:layers:ids = [1,2,3], input:layers:bounding_boxes: [{...}, {...}]
    const layers_id_map = getLayersIdMap(vs);
    const layers_bbox_map = vs.var('input:layers:bounding_boxes').$;

    // add the layers-to-ids 'should' conditions
    // if layers_map is:
    // {
    //   locality: {ids: [1, 2], bounding_boxes: [{...}, {...}]},
    //   localadmin: {ids: [], },
    //   region: {ids: [3, 4]}
    // }
    // this creates an array, with one query clause per layer, with what is 
    // essentially OR query for each layer between the ids or the
    // bounding boxes (optionally increased by the bbox_scale factor)
    const layer_filters = Object.keys(layers_id_map).reduce((acc, layer) => {
      // If there are no ids on this layer, don't add a filter
      if (_.isEmpty(layers_id_map[layer])) {
        return acc;
      }

      const layer_ids_should = createParentIdShould(layer, layers_id_map[layer]);

      const scale = vs.var(`admin:${layer}:bbox_scale`).$ || 1;
      // Only use admin bounding box clauses if the parents is smaller than a region
      // This is mainly to prevent anti-meridian crossing issues
      const should_use_admin_bounding_box = ['neighbourhood', 'borough', 'locality', 'county', 'macrocounty', 'region'].includes(layer);
      const layer_bounding_box_clauses = 
        should_use_admin_bounding_box ? createLayerBoundingBoxesShould(vs, layers_bbox_map[layer] || [], scale) 
        : [];

      // if there are bounding box clauses in addition to the ids clause,
      // combine them. Otherwise don't.
      if (!_.isEmpty(layer_bounding_box_clauses)) {
        acc.push({bool: {
          minimum_should_match: 1,
          should: [...layer_bounding_box_clauses, layer_ids_should]
        }});
      } else {
        acc.push(layer_ids_should);
      }
      return acc;
    }, []);

    // add filter.bool.minimum_should_match and filter.bool.should,
    //  creating intermediate objects as it goes
    if (!_.isEmpty(layer_filters)) {
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
