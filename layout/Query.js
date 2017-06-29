'use strict';

const _ = require('lodash');

class ServiceConfiguration {
  constructor() {
    this._score = [];
    this._filter = [];
  }

  filter(view) {
    this._filter.push(view);
  }

  score(view) {
    this._score.push(view);
  }

  render(vs) {

  }

}

module.exports = ServiceConfiguration;
