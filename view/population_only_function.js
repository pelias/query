module.exports = function( vs ){
  // validate required params
  if( !vs.isset('population:field') ||
      !vs.isset('population:modifier') ){
    return null;
  }

  return {
    field_value_factor: {
      modifier: vs.var('population:modifier'),
      field: vs.var('population:field'),
      missing: 1
    },
    weight: vs.var('population:weight')
  };

};
