
module.exports = function( vs ){

  // validate required params
  if( !vs.isset('input:name') ||
      !vs.isset('ngram:analyzer') ||
      (!vs.isset('ngram:field') && !vs.isset('ngram:multifield')) ||
      !vs.isset('ngram:boost') ){
    return null;
  }

  if(vs.isset('ngram:multifield')) {
    // multi match query
    var view = { "multi_match": {
      analyzer: vs.var('ngram:analyzer'),
      boost: vs.var('ngram:boost'),
      query: vs.var('input:name'),
      fields: vs.var('ngram:multifield')
    }};
  }
  else {
    var view = { "match": {} };

    // match query
    view.match[ vs.var('ngram:field') ] = {
      analyzer: vs.var('ngram:analyzer'),
      boost: vs.var('ngram:boost'),
      query: vs.var('input:name')
    };
  }
  return view;
};
