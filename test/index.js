'use strict';

var should = require('chai').should(); // eslint-disable-line
var Hexo = require('hexo');
var nunjucks = require('nunjucks');
var pathFn = require('path');
var fs = require('fs');
var cheerio = require('cheerio');

var env = new nunjucks.Environment(null, {
  autoescape: false,
  watch: false
});

env.addFilter('uriencode', function(str) {
  return encodeURI(str);
});

var sitemapSrc = pathFn.join(__dirname, '../sitemap.xml');
var sitemapTmpl = nunjucks.compile(fs.readFileSync(sitemapSrc, 'utf8'), env);

describe('Sitemap generator', function() {
  var hexo = new Hexo(__dirname, {silent: true});
  var Post = hexo.model('Post');
  var generator = require('../lib/generator').bind(hexo);
  var posts;
  var locals;

  before(function() {
    return hexo.init().then(function() {
      return Post.insert([
        {source: 'foo', slug: 'foo', updated: 1e8},
        {source: 'bar', slug: 'bar', updated: 1e8 + 1},
        {source: 'baz', slug: 'baz', updated: 1e8 - 1}
      ]).then(function(data) {
        posts = Post.sort('-updated');
        locals = hexo.locals.toObject();
      });
    });
  });

  it('default', function() {
    hexo.config.sitemap = {
      path: 'sitemap.xml'
    };

    var result = generator(locals);

    result.path.should.eql('sitemap.xml');
    result.data.should.eql(sitemapTmpl.render({
      config: hexo.config,
      posts: posts.toArray()
    }));

    var $ = cheerio.load(result.data);

    $('urlset').find('url').each(function(i) {
      $(this).children('loc').text().should.eql(posts.eq(i).permalink);
      $(this).children('lastmod').text().should.eql(posts.eq(i).updated.toISOString());
    });
  });

  describe('skip_render', function() {
    it('array', function() {
      hexo.config.skip_render = ['foo'];

      var result = generator(locals);
      result.data.should.not.contain('foo');
    });

    it('string', function() {
      hexo.config.skip_render = 'bar';

      var result = generator(locals);
      result.data.should.not.contain('bar');
    });

    it('off', function() {
      hexo.config.skip_render = null;

      var result = generator(locals);
      result.should.be.ok;
    });
  });
});
