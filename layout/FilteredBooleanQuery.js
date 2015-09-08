
function Layout(){
  this._score = [];
  this._filter = [];
  this._sort = [];
}

Layout.prototype.score = function( view, operator ){
  this._score.push([ view, operator === 'must' ? 'must': 'should' ]);
  return this;
};

Layout.prototype.filter = function( view, operator ){
  this._filter.push([ view, operator === 'must' ? 'must': 'should' ]);
  return this;
};

Layout.prototype.sort = function( view ){
  this._sort.push( view );
  return this;
};

Layout.prototype.render = function( vs ){
  var q = Layout.base( vs );
  
  // handle scoring views under 'query' section (both 'must' & 'should')
  if( this._score.length ){
    this._score.forEach( function( condition ){
      var view = condition[0], operator = condition[1];
      if( !q.query.filtered.query.bool.hasOwnProperty( operator ) ){
        q.query.filtered.query.bool[ operator ] = [];
      }
      var rendered = view( vs );
      if( rendered ){
        q.query.filtered.query.bool[ operator ].push( rendered );
      }
    });
  }

  // handle filter views under 'filter' section (only 'must' is allowed here)
  if( this._filter.length ){
    this._filter.forEach( function( condition ){
      var view = condition[0], operator = condition[1];
      if( !q.query.filtered.filter.bool.hasOwnProperty( operator ) ){
        q.query.filtered.filter.bool[ operator ] = [];
      }
      var rendered = view( vs );
      if( rendered ){
        q.query.filtered.filter.bool[ operator ].push( rendered );
      }
    });
  }

  // handle sorting views under 'sort'
  if( this._sort.length ){
    this._sort.forEach( function( view ){
      if( !Array.isArray( q.sort ) ){
        q.sort = [];
      }
      var rendered = view( vs );
      if( rendered ){
        q.sort.push( rendered );
      }
    });
  }

  return q;
};

Layout.base = function( vs ){
  return {
    query: {
      filtered: {
        query: {
          bool: {}
        },
        filter: {
          bool: {}
        }
      }
    },
    size: vs.var('size'),
    track_scores: vs.var('track_scores'),
    sort: ['_score']
  };
};

module.exports = Layout;