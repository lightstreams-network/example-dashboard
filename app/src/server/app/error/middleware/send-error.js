'use strict';

/**
 * Module export
 */
module.exports = function(error, req, res, next) {
  next = next || null;
  let json;
  let status = error.status || 500;
  if (typeof error.toJSON === 'function' && (json = error.toJSON())) {
    return res.status(status).json(json);
  }
  res.status(status).end();
};
