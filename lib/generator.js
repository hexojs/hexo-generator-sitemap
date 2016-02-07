'use strict';

var nunjucks = require('nunjucks');
var env = new nunjucks.Environment();
var pathFn = require('path');
var fs = require('fs');

nunjucks.configure({
  autoescape: false,
  watch: false
});

env.addFilter('uriencode', function(str) {
  return encodeURI(str);
});

var sitemapSrc = pathFn.join(__dirname, '../sitemap.xml');
var sitemapTmpl = nunjucks.compile(fs.readFileSync(sitemapSrc, 'utf8'), env);

module.exports = function(locals) {
  var config = this.config;

  var posts = [].concat(locals.posts.toArray(), locals.pages.toArray())
    .filter(function(post) {
      return post.sitemap !== false && !~config.skip_render.indexOf(post.source);
    })
    .sort(function(a, b) {
      return b.updated - a.updated;
    });

  var xml = sitemapTmpl.render({
    config: config,
    posts: posts
  });

  return {
    path: config.sitemap.path,
    data: xml
  };
};
