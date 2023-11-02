/* global hexo */
'use strict';

const { log } = hexo;

hexo.config.sitemap = Object.assign({
  enable: true,
  path: ['sitemap.xml', 'sitemap.txt'],
  rel: false,
  tags: true,
  categories: true
}, hexo.config.sitemap);

const config = hexo.config.sitemap;

if (!config.enable) {
  return;
}

if (!config.path) {
  log.warn('hexo-generator-sitemap: `path` can\'t not be empty. ');
  return;
}

hexo.extend.generator.register('sitemap', require('./lib/generator'));

if (config.rel === true) {
  hexo.extend.filter.register('after_render:html', require('./lib/rel'));
}
