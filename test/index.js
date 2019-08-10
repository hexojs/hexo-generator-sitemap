'use strict';

const should = require('chai').should(); // eslint-disable-line
const Hexo = require('hexo');
const cheerio = require('cheerio');
const urlFn = require('url');

describe('Sitemap generator', () => {
  const hexo = new Hexo(__dirname, {silent: true});
  hexo.config.url = 'http://yoursite.com/';
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
        posts = Post.sort('-updated');
        locals = hexo.locals.toObject();
      });
    });
  });

  it('default', () => {
    const result = generator(locals);

    result.path.should.eql('sitemap.xml');
    result.data.should.eql(sitemapTmpl.render({
      config: hexo.config,
      url: hexo.config.url,
      posts: posts.toArray()
    }));

    const $ = cheerio.load(result.data);
    const url = hexo.config.url;

    $('url').each((index, element) => {
      $(element).children('loc').text().should.eql(url + posts.eq(index).path);
      $(element).children('lastmod').text().should.eql(posts.eq(index).updated.toISOString());
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

  it('IDN handling', () => {
    hexo.config.url = 'http://gôg.com/';
    const hostname = urlFn.parse(hexo.config.url).hostname;

    const result = generator(locals);
    const $ = cheerio.load(result.data);

    $('url').each((index, element) => {
      urlFn.parse($(element).children('loc').text()).hostname.should.eql(hostname);
    });
  });
});
