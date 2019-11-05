'use strict';

const { join } = require('path');
const { readFileSync } = require('fs');
let sitemapTmpl;
const { encodeURL } = require('hexo-util');

module.exports = function(config) {
  if (sitemapTmpl) return sitemapTmpl;

  const nunjucks = require('nunjucks');
  const env = new nunjucks.Environment(null, {
    autoescape: false,
    watch: false
  });

  env.addFilter('uriencode', str => {
    return encodeURL(str);
  });

  const sitemapSrc = config.sitemap.template || join(__dirname, '../sitemap.xml');
  sitemapTmpl = nunjucks.compile(readFileSync(sitemapSrc, 'utf8'), env);

  return sitemapTmpl;
};
