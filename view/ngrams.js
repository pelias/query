
module.exports = function( vs ){

  // validate required params
  if( !vs.isset('input:name') ||
      !vs.isset('ngram:analyzer') ||
      !vs.isset('ngram:field') ||
      !vs.isset('ngram:boost') ){
    return null;
  }

  // base view
  var view = { 'match': {} };

  // match query
  view.match[ vs.var('ngram:field') ] = {
    analyzer: vs.var('ngram:analyzer'),
    boost: vs.var('ngram:boost'),
    query: vs.var('input:name')
  };

  if (vs.isset('ngram:fuzziness')) {
    view.match[ vs.var('ngram:field') ].fuzziness = vs.var('ngram:fuzziness');
  }

  if (vs.isset('ngram:cutoff_frequency')) {
    view.match[ vs.var('ngram:field') ].cutoff_frequency = vs.var('ngram:cutoff_frequency');
  }

  return view;
};
