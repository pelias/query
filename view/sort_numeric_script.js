
/**
  this view is wrapped in a function so it can be re-used for
  all numerical sorting scripts.
**/

module.exports = function( script_name ){
  return function( vs ){

    // validate required params
    if( !script_name ){
      return null;
    }

    // groovy script
    var view = {
      '_script': {
        'file': script_name,
        'type': 'number',
        'order': 'desc'
      }
    };

    return view;
  };
};
