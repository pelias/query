module.exports = function( vs ){
  if( !vs.isset('boundary:gid')) {
    return null;
  }

  // base view
  var view = {};

  // multi_match with field name wildcard
  view.multi_match = {
    fields: ['parent.*_id'],
    query: vs.var('boundary:gid')
  };

  return view;
};
