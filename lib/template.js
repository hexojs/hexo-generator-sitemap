'use strict';

const { join,extname} = require('path');
const { readFileSync } = require('fs');
let sitemapTmpl;
const { encodeURL } = require('hexo-util');

module.exports = function(config,path){
  //if (sitemapTmpl) return sitemapTmpl;

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

  if ('.xml' == extname(path)) {
    const sitemapSrc = config.sitemap.template || join(__dirname, '../sitemap.xml');
    sitemapTmpl = nunjucks.compile(readFileSync(sitemapSrc, 'utf8'), env);
    return sitemapTmpl;

  } else if ('.txt' == extname(path)) {
    const sitemapSrc = join(__dirname, '../sitemap.txt');
    sitemapTmpl = nunjucks.compile(readFileSync(sitemapSrc, 'utf8'), env);
    return sitemapTmpl;
  };
};
