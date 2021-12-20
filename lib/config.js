'use strict';

const { join } = require('path');

/**
 * Default Config
 */
module.exports = {
  'sitemap': {
    'path': 'sitemap.xml',
    'template': join(__dirname, '../sitemap.xml'),
    'rel': false,
    'tags': true,
    'categories': true
  }
};
