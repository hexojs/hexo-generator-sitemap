var should = require('chai').should();
var Hexo = require('hexo');
var ejs = require('ejs');
var pathFn = require('path');
var fs = require('fs');

var sitemapSrc = pathFn.join(__dirname, '../sitemap.ejs');
var sitemapTmpl = ejs.compile(fs.readFileSync(sitemapSrc, 'utf8'));

describe('Sitemap generator', function(){
  var hexo = new Hexo(__dirname, {silent: true});
  var Post = hexo.model('Post');
  var generator = require('../lib/generator').bind(hexo);
  var posts;

  before(function(){
    return Post.insert([
      {source: 'foo', slug: 'foo', updated: 1e8},
      {source: 'bar', slug: 'bar', updated: 1e8 + 1},
      {source: 'baz', slug: 'baz', updated: 1e8 - 1}
    ]).then(function(data){
      posts = Post.sort('-updated');
    });
  });

  it('default', function(){
    hexo.config.sitemap = {
      path: 'sitemap.xml'
    };

    var result = generator(hexo.locals.toObject());

    result.path.should.eql('sitemap.xml');
    result.data.should.eql(sitemapTmpl({
      config: hexo.config,
      posts: posts
    }));
  });
});