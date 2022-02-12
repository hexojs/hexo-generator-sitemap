/* global hexo */
'use strict';

const { extname } = require('path');

const genger = require('./lib/generator');
hexo.config.sitemap = Object.assign({
  path: 'sitemap.xml',
  rel: false,
  tags: true,
  categories: true,
  txt: true
}, hexo.config.sitemap);

const config = hexo.config.sitemap;

if (!extname(config.path)) {
  config.path += '.xml';
}

hexo.extend.generator.register("sitemap.xml", locals => {return genger.call(hexo, locals, config.path);});
if(config.txt==true){
  hexo.extend.generator.register("sitemap.txt", locals => {return genger.call(hexo, locals, "sitemap.txt");});
}

if (config.rel === true) {
  hexo.extend.filter.register('after_render:html', require('./lib/rel'));
}
