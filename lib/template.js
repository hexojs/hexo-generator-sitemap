'use strict';

const { join, extname } = require('path');
const { readFileSync } = require('fs');
let sitemapTmpl;
const { encodeURL } = require('hexo-util');

module.exports = function(config) {
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

  function temp(p) {
    let sitemapSrc;
    switch (extname(p)) {
      case '.xml':
        sitemapSrc = config.sitemap.template || join(__dirname, '../sitemap.xml');
        break;
      case '.txt':
        sitemapSrc = config.sitemap.template_txt || join(__dirname, '../sitemap.txt');
        break;
    }
    sitemapTmpl = nunjucks.compile(readFileSync(sitemapSrc, 'utf8'), env);
    return { path: p, data: sitemapTmpl };
  }

  const res = [];
  switch (typeof path) {
    case 'string':
      res.push(temp(path));
      break;
    case 'object':
      for (const p of path) {
        res.push(temp(p));
      }
      break;
  }
  return res;
};
