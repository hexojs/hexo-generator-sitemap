'use strict';

var should = require('chai').should(); // eslint-disable-line
var Hexo = require('hexo');
var cheerio = require('cheerio');

describe('Sitemap generator', function() {
  var hexo = new Hexo(__dirname, {silent: true});
  hexo.config.sitemap = {
    path: 'sitemap.xml'
  };
  const Post = hexo.model('Post');
  const Page = hexo.model('Page');
  const generator = require('../lib/generator').bind(hexo);
  const sitemapTmpl = require('../lib/template')(hexo.config);
  let posts = {};
  let pages = {};
  let locals = {};

  before(() => {
    return hexo.init().then(() => {
      return Post.insert([
        {source: 'foo', slug: 'foo', updated: 1e8},
        {source: 'bar', slug: 'bar', updated: 1e8 - 1},
        {source: 'baz', slug: 'baz', updated: 1e8 - 2}
      ]).then(() => {
        return Page.insert([
          {source: 'bio/index.md', path: 'bio/', updated: 1e8 - 3},
          {source: 'about/index.md', path: 'about/', updated: 1e8 - 4}
        ]);
      }).then(() => {
        posts = Post.sort('-updated');
        pages = Page.sort('-update');
        locals = hexo.locals.toObject();
      });
    });
  });

  it('default', () => {
    const result = generator(locals);

    result.path.should.eql('sitemap.xml');
    result.data.should.eql(sitemapTmpl.render({
      config: hexo.config,
      posts: posts.toArray().concat(pages.toArray())
    }));

    const $ = cheerio.load(result.data);
    const allPosts = Object.assign({}, posts.data.concat(pages.data));

    $('url').each((index, element) => {
      $(element).children('loc').text().should.eql(allPosts[index].permalink);
      $(element).children('lastmod').text().should.eql(allPosts[index].updated.toISOString());
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
