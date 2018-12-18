/* global hexo */
'use strict';

var pathFn = require('path');

var config = hexo.config.sitemap = Object.assign({
  path: 'sitemap.xml'
}, hexo.config.sitemap);

if (!pathFn.extname(config.path)) {
  config.path += '.xml';
}

hexo.extend.generator.register('sitemap', require('./lib/generator'));
