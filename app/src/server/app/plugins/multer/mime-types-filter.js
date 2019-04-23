'use strict';

/**
 * Mime types filter
 */
module.exports = function(MIME_TYPES) {
  return function mimeTypesFilter(req, file, cb) {
    if (MIME_TYPES.includes(file.mimetype)) {
      cb(null, true);
    }
    cb(null, false);
  };
};
