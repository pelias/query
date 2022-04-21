const _ = require('lodash');

module.exports = function( vs ){

  // validate required params
  if( !vs.isset('input:name') ||
      !vs.isset('phrase:analyzer') ||
      !vs.isset('phrase:field') ||
      !vs.isset('phrase:boost') ||
      !vs.isset('phrase:slop') ){
    return null;
  }

  // base view
  var view = { 'multi_match': {} };

  var pf = vs.var('phrase:field').get();
  var fields = [pf, `${pf}_*`];

  var lang = vs.var('lang').get();
  if (_.isString(lang) && !_.isEmpty(lang)) {
    var lf = pf.replace('default', lang);
    fields.push(lf, `${lf}_*`);
  }

  // match query
  view.multi_match = {
    analyzer: vs.var('phrase:analyzer'),
    type: 'phrase',
    boost: vs.var('phrase:boost'),
    slop: vs.var('phrase:slop'),
    query: vs.var('input:name'),
    fields: fields
  };

  if (vs.isset('phrase:fuzziness')) {
    view.multi_match.fuzziness = vs.var('phrase:fuzziness');
  }

  if (vs.isset('phrase:cutoff_frequency')) {
    view.multi_match.cutoff_frequency = vs.var('phrase:cutoff_frequency');
  }

  return view;
};
