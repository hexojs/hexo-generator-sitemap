'use strict';

var should = require('chai').should(); // eslint-disable-line
var path = require('path');
var Hexo = require('hexo');
var cheerio = require('cheerio');

describe('Sitemap generator', function() {
  var hexo = new Hexo(__dirname, {silent: true});
  hexo.config.sitemap = {
    path: 'sitemap.xml'
  };
  var Post = hexo.model('Post');
  var generator = require('../lib/generator').bind(hexo);
  var sitemapTmpl = require('../lib/template')(hexo.config);
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
