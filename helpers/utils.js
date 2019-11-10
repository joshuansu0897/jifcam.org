const _ = require('lodash');

exports.getMissingFields = (data, fields) => {
  const keys = _.keys(data);
  return _.difference(fields, keys);
}