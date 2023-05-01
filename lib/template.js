'use strict';

const { readFileSync } = require('fs');
const { encodeURL } = require('hexo-util');
let sitemapTmpl;

module.exports = function(sitemapSrc) {

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

  sitemapTmpl = nunjucks.compile(readFileSync(sitemapSrc, 'utf8'), env);

  return sitemapTmpl;
};
