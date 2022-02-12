'use strict';

const { join, extname } = require('path');
const { readFileSync } = require('fs');
let sitemapTmpl;
const { encodeURL } = require('hexo-util');

module.exports = function(config) {
  // if (sitemapTmpl) return sitemapTmpl;
  const path = config.sitemap.path;
  const nunjucks = require('nunjucks');
  const env = new nunjucks.Environment(null, {
    autoescape: false,
    watch: false
  });

  env.addFilter('uriencode', str => {
    return encodeURL(str);
  });

  // Extract date from datetime
  env.addFilter('formatDate', input => {
    return input.toISOString().substring(0, 10);
  });
  let sitemapSrc;
  switch (extname(path)) {
    case '.xml':
      sitemapSrc = config.sitemap.template || join(__dirname, '../sitemap.xml');
      break;
    case '.txt':
      sitemapSrc = config.sitemap.template_txt || join(__dirname, '../sitemap.txt');
      break;
  }
  sitemapTmpl = nunjucks.compile(readFileSync(sitemapSrc, 'utf8'), env);
  return sitemapTmpl;
};
