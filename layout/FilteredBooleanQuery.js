
function Layout(){
  this._score = [];
  this._filter = [];
  this._sort = [];
}

Layout.prototype.score = function( view, operator ){
  this._score.push([ view, operator === 'must' ? 'must': 'should' ]);
  return this;
};

Layout.prototype.filter = function( view ){
  this._filter.push( view );
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
      var rendered = view( vs );
      if( rendered ){
        if( !q.query.bool.hasOwnProperty( operator ) ){
          q.query.bool[ operator ] = [];
        }
        q.query.bool[ operator ].push( rendered );
      }
    });
  }

  // handle filter views under 'filter' section (only 'must' is allowed here)
  if( this._filter.length ){
    this._filter.forEach( function( view ){
      var rendered = view( vs );
      if( rendered ){
        if( !q.query.bool.hasOwnProperty( 'filter' ) ){
          q.query.bool.filter = [];
        }
        q.query.bool.filter.push( rendered );
      }
    });
  }

  // handle sorting views under 'sort'
  if( this._sort.length ){
    this._sort.forEach( function( view ){
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
      bool: {}
    },
    size: vs.var('size'),
    track_scores: vs.var('track_scores'),
    sort: ['_score']
  };
};

module.exports = Layout;
