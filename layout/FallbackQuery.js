// This query is useful for specifying all the combinations of inputs starting
// from most granular to least granular.  For example, given the input:
// `30 w 26th street, new york, ny, usa`
// the following pseudo-query would be generated:
//
// - (housenumber=30 && street=w 26th street && city=new york && state=ny && country=usa) ||
// - (city=new york && state=ny && country=usa) ||
// - (state=ny && country=usa) ||
// - (country=usa)
//
// That is, it specifies as much as possible from the analyzed form, then falling
// back in decreasing granularity.
//
// In the event of an input like `Socorro, Pennsylvania, Canada` where there is
// no city named Socorro in Pennsylvania and there is no region named Pennsylvania
// in Canada, the single result would be for country=Canada
//
// In the case that a full street+city+state+country is correct and found, all
// OR'd queries will return results so only the most specific result should be
// retained
//
// If the analyzed input contains both a query and housenumber+street, then
// the constructured query searches for the query term in the context of the coarse
// inputs, then falls back to the housenumber+street.  It's important to not
// search for the query term and housenumber+street at the same time because
// only venues matching the query term at that exact housenumber+street would
// be returned.

function Layout(){
  this._score = [];
}

Layout.prototype.score = function( view, operator ){
  this._score.push([ view, operator === 'must' ? 'must': 'should' ]);
  return this;
};

function addPrimary(value, layer, fields, likely_to_have_abbreviation) {
  // base primary query should match on layer and one of the admin fields via
  // multi_match
  var o = {
    bool: {
      _name: 'fallback.' + layer,
      must: [
        {
          multi_match: {
            query: value,
            type: 'phrase',
            fields: fields
          }
        }
      ],
      filter: {
        term: {
          layer: layer
        }
      }
    }
  };

  // When the value is likely to have abbreviations, as in the case of regions
  //  and countries, don't add the must match on phrase.default.  For example,
  //  when the input 'Socorro, PA' falls back to just 'PA' (because there's no
  //  place in PA called Socorro), forcing a phrase match on 'PA' would fail
  //  since the indexed value is 'Pennsylvania', not 'PA'.  Having this conditional
  //  here allows primary matches in regions and countries, where there is less
  //  danger of analysis ambiguity, to only have to match on region/region_a or
  //  country/country_a.  Commented out to show intent.
  //
  // if (!likely_to_have_abbreviation) {
  //   o.bool.must.push(
  //     {
  //       match_phrase: {
  //         'phrase.default': value
  //       }
  //     }
  //   );
  // }

  return o;

}

// Secondary matches are for less granular administrative areas that have been
// specified.  For example, in "Socorro, NM", "Socorro" is primary, whereas
// "NM" is secondary.
function addSecondary(value, fields) {
  return {
      multi_match: {
        query: value,
        type: 'phrase',
        fields: fields
      }
  };

}

function addQuery(vs) {
  var o = addPrimary(vs.var('input:query').toString(),
            'venue', ['phrase.default'], false);

  // add neighbourhood if specified
  if (vs.isset('input:neighbourhood')) {
    o.bool.must.push(addSecondary(vs.var('input:neighbourhood').toString(), ['parent.neighbourhood', 'parent.neighbourhood_a']));
  }

  // add borough if specified
  if (vs.isset('input:borough')) {
    o.bool.must.push(addSecondary(vs.var('input:borough').toString(), ['parent.borough', 'parent.borough_a']));
  }

  // add locality if specified
  if (vs.isset('input:locality')) {
    o.bool.must.push(addSecondary(vs.var('input:locality').toString(),
      ['parent.locality', 'parent.locality_a', 'parent.localadmin', 'parent.localadmin_a']));
  }

  // add county if specified
  if (vs.isset('input:county')) {
    o.bool.must.push(addSecondary(vs.var('input:county').toString(),
      ['parent.county', 'parent.county_a', 'parent.macrocounty', 'parent.macrocounty_a']));
  }

  // add region if specified
  if (vs.isset('input:region')) {
    o.bool.must.push(addSecondary(vs.var('input:region').toString(), ['parent.region', 'parent.region_a']));
  }

  if (vs.isset('input:country')) {
    o.bool.must.push(addSecondary(vs.var('input:country').toString(), ['parent.country', 'parent.country_a']));
  }

  return o;

}

function addHouseNumberAndStreet(vs) {
  var o = {
    bool: {
      _name: 'fallback.address',
      must: [
        {
          match_phrase: {
            'address_parts.number': vs.var('input:housenumber').toString()
          }
        },
        {
          match_phrase: {
            'address_parts.street': vs.var('input:street').toString()
          }
        }
      ],
      filter: {
        term: {
          layer: 'address'
        }
      }
    }
  };

  // add neighbourhood if specified
  if (vs.isset('input:neighbourhood')) {
    o.bool.must.push(addSecondary(vs.var('input:neighbourhood').toString(), ['parent.neighbourhood', 'parent.neighbourhood_a']));
  }

  // add borough if specified
  if (vs.isset('input:borough')) {
    o.bool.must.push(addSecondary(vs.var('input:borough').toString(), ['parent.borough', 'parent.borough_a']));
  }

  // add locality if specified
  if (vs.isset('input:locality')) {
    o.bool.must.push(addSecondary(vs.var('input:locality').toString(),
      ['parent.locality', 'parent.locality_a', 'parent.localadmin', 'parent.localadmin_a']));
  }

  // add county if specified
  if (vs.isset('input:county')) {
    o.bool.must.push(addSecondary(vs.var('input:county').toString(),
      ['parent.county', 'parent.county_a', 'parent.macrocounty', 'parent.macrocounty_a']));
  }

  // add region if specified
  if (vs.isset('input:region')) {
    o.bool.must.push(addSecondary(vs.var('input:region').toString(), ['parent.region', 'parent.region_a']));
  }

  if (vs.isset('input:country')) {
    o.bool.must.push(addSecondary(vs.var('input:country').toString(), ['parent.country', 'parent.country_a']));
  }

  return o;

}

function addNeighbourhood(vs) {
  var o = addPrimary(vs.var('input:neighbourhood').toString(),
            'neighbourhood', ['parent.neighbourhood', 'parent.neighbourhood_a'], false);

  // add borough if specified
  if (vs.isset('input:borough')) {
    o.bool.must.push(addSecondary(vs.var('input:borough').toString(), ['parent.borough', 'parent.borough_a']));
  }

  // add locality if specified
  if (vs.isset('input:locality')) {
    o.bool.must.push(addSecondary(vs.var('input:locality').toString(),
      ['parent.locality', 'parent.locality_a', 'parent.localadmin', 'parent.localadmin_a']));
  }

  // add county if specified
  if (vs.isset('input:county')) {
    o.bool.must.push(addSecondary(vs.var('input:county').toString(),
      ['parent.county', 'parent.county_a', 'parent.macrocounty', 'parent.macrocounty_a']));
  }

  // add region if specified
  if (vs.isset('input:region')) {
    o.bool.must.push(addSecondary(vs.var('input:region').toString(), ['parent.region', 'parent.region_a']));
  }

  // add country if specified
  if (vs.isset('input:country')) {
    o.bool.must.push(addSecondary(vs.var('input:country').toString(), ['parent.country', 'parent.country_a']));
  }

  return o;

}

function addBorough(vs) {
  var o = addPrimary(vs.var('input:borough').toString(),
            'borough', ['parent.borough', 'parent.borough_a'], false);

  // add locality if specified
  if (vs.isset('input:locality')) {
    o.bool.must.push(addSecondary(vs.var('input:locality').toString(),
      ['parent.locality', 'parent.locality_a', 'parent.localadmin', 'parent.localadmin_a']));
  }

  // add county if specified
  if (vs.isset('input:county')) {
    o.bool.must.push(addSecondary(vs.var('input:county').toString(),
      ['parent.county', 'parent.county_a', 'parent.macrocounty', 'parent.macrocounty_a']));
  }

  // add region if specified
  if (vs.isset('input:region')) {
    o.bool.must.push(addSecondary(vs.var('input:region').toString(), ['parent.region', 'parent.region_a']));
  }

  // add country if specified
  if (vs.isset('input:country')) {
    o.bool.must.push(addSecondary(vs.var('input:country').toString(), ['parent.country', 'parent.country_a']));
  }

  return o;

}

function addLocality(vs) {
  var o = addPrimary(vs.var('input:locality').toString(),
            'locality', ['parent.locality', 'parent.locality_a'], false);

  // add county if specified
  if (vs.isset('input:county')) {
    o.bool.must.push(addSecondary(vs.var('input:county').toString(),
      ['parent.county', 'parent.county_a', 'parent.macrocounty', 'parent.macrocounty_a']));
  }

  // add region if specified
  if (vs.isset('input:region')) {
    o.bool.must.push(addSecondary(vs.var('input:region').toString(), ['parent.region', 'parent.region_a']));
  }

  // add country if specified
  if (vs.isset('input:country')) {
    o.bool.must.push(addSecondary(vs.var('input:country').toString(), ['parent.country', 'parent.country_a']));
  }

  return o;

}

function addCounty(vs) {
  var o = addPrimary(vs.var('input:county').toString(),
            'county', ['parent.county', 'parent.county_a', 'parent.macrocounty', 'parent.macrocounty_a'], false);

  // add region if specified
  if (vs.isset('input:region')) {
    o.bool.must.push(addSecondary(vs.var('input:region').toString(), ['parent.region', 'parent.region_a']));
  }

  // add country if specified
  if (vs.isset('input:country')) {
    o.bool.must.push(addSecondary(vs.var('input:country').toString(), ['parent.country', 'parent.country_a']));
  }

  return o;

}

function addRegion(vs) {
  var o = addPrimary(vs.var('input:region').toString(),
            'region', ['parent.region', 'parent.region_a'], true);

  // add country if specified
  if (vs.isset('input:country')) {
    o.bool.must.push(addSecondary(vs.var('input:country').toString(), ['parent.country', 'parent.country_a']));
  }

  return o;

}

function addCountry(vs) {
  var o = addPrimary(vs.var('input:country').toString(),
            'country', ['parent.country', 'parent.country_a'], true);

  return o;

}

Layout.prototype.render = function( vs ){
  var q = Layout.base( vs );

  if (vs.isset('input:query')) {
    q.query.bool.should.push(addQuery(vs));
  }
  if (vs.isset('input:housenumber') && vs.isset('input:street')) {
    q.query.bool.should.push(addHouseNumberAndStreet(vs));
  }
  if (vs.isset('input:neighbourhood')) {
    q.query.bool.should.push(addNeighbourhood(vs));
  }
  if (vs.isset('input:borough')) {
    q.query.bool.should.push(addBorough(vs));
  }
  if (vs.isset('input:locality')) {
    q.query.bool.should.push(addLocality(vs));
  }
  if (vs.isset('input:county')) {
    q.query.bool.should.push(addCounty(vs));
  }
  if (vs.isset('input:region')) {
    q.query.bool.should.push(addRegion(vs));
  }
  if (vs.isset('input:country')) {
    q.query.bool.should.push(addCountry(vs));
  }

  return q;
};

Layout.base = function( vs ){
  return {
    query: {
      bool: {
        should: []
      }
    },
    size: vs.var('size'),
    track_scores: vs.var('track_scores'),
  };
};

module.exports = Layout;
