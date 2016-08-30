module.exports = function( vs ){
  // validate required params
  if( !vs.isset('popularity:field') ||
      !vs.isset('popularity:modifier') ){
    return null;
  }

  return {
    field_value_factor: {
      modifier: vs.var('popularity:modifier'),
      field: vs.var('popularity:field'),
      missing: 1
    },
    weight: vs.var('popularity:weight')
  };

};
