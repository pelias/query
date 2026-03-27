module.exports = function( vs ) {
  if ( !vs.isset('sort:field') ||
      vs.var('sort:field').get() !== 'popularity' ) {
    return null;
  }
  // base view
  var view = {
    popularity: {
      order: 'desc',
    }
  };

  return view;
};
