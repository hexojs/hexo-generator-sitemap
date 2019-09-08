'use strict';

const should = require('chai').should(); // eslint-disable-line
const Hexo = require('hexo');
const cheerio = require('cheerio');

describe('Sitemap generator', () => {
  const hexo = new Hexo(__dirname, {silent: true});
  hexo.config.sitemap = {
    path: 'sitemap.xml'
  };
  const Post = hexo.model('Post');
  const generator = require('../lib/generator').bind(hexo);
  const sitemapTmpl = require('../lib/template')(hexo.config);
  let posts = {};
  let locals = {};

  before(() => {
    return hexo.init().then(() => {
      return Post.insert([
        {source: 'foo', slug: 'foo', updated: 1e8},
        {source: 'bar', slug: 'bar', updated: 1e8 + 1},
        {source: 'baz', slug: 'baz', updated: 1e8 - 1}
      ]).then(data => {
        posts = data.sort((a, b) => b.updated - a.updated);
        locals = hexo.locals.toObject();
      });
    });
  });

  it('default', () => {
    const result = generator(locals);

    result.path.should.eql('sitemap.xml');
    result.data.should.eql(sitemapTmpl.render({
      config: hexo.config,
      posts: posts
    }));

    const $ = cheerio.load(result.data);

    $('url').each((index, element) => {
      $(element).children('loc').text().should.eql(posts[index].permalink);
      $(element).children('lastmod').text().should.eql(posts[index].updated.toISOString());
    });
  });

  describe('skip_render', () => {
    it('array', () => {
      hexo.config.skip_render = ['foo'];

      const result = generator(locals);
      result.data.should.not.contain('foo');
    });

    it('string', () => {
      hexo.config.skip_render = 'bar';

      const result = generator(locals);
      result.data.should.not.contain('bar');
    });

    it('off', () => {
      hexo.config.skip_render = null;

      const result = generator(locals);
      result.should.be.ok;
    });
  });
});
