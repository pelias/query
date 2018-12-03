module.exports = function( vs ){
  if( !vs.isset('boundary:wof')) {
    return null;
  }

  // base view
  var view = {};

  // multi_match with field name wildcard
  view.multi_match = {
    fields: ['parent.*_id'],
    query: vs.var('boundary:wof')
  };

  return view;
};
