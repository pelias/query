
module.exports = function( vs ){

  // validate required params
  if( !vs.isset('input:name') ||
      !vs.isset('ngram:analyzer') ||
      !vs.isset('multingram:fields') ||
      !vs.isset('ngram:boost') ){
    return null;
  }

  // multi match query
  var view = { "multi_match": {
    analyzer: vs.var('ngram:analyzer'),
    boost: vs.var('ngram:boost'),
    query: vs.var('input:name'),
    fields: vs.var('multingram:fields')
  }};

  return view;
};
