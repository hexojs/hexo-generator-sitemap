var ejs = require('ejs'),
  merge = require('utils-merge'),
  path = require('path'),
  file = hexo.util.file2;

var sitemapSrc = path.join(__dirname, 'sitemap.ejs'),
  sitemapTmpl = ejs.compile(file.readFileSync(sitemapSrc));

module.exports = function(locals, render, callback){
  var config = hexo.config;

  var sitemapConfig = merge({
    path: 'sitemap.xml'
  }, config.sitemap);

  if (!path.extname(sitemapConfig.path)){
    sitemapConfig.path += '.xml';
  }

  var posts = [].concat(locals.posts.toArray(), locals.pages.toArray())
    .filter(function(item){
      return item.sitemap !== false;
    })
    .sort(function(a, b){
      return b.updated - a.updated;
    });

  var xml = sitemapTmpl({
    config: config,
    posts: posts
  });

  hexo.route.set(sitemapConfig.path, xml);
  callback();
};