'use strict';

const Hexo = require('hexo');
const should = require('chai').should(); // eslint-disable-line
const cheerio = require('cheerio');
const { encodeURL } = require('hexo-util');

const ctx = {
  config: {
    sitemap: {
      path: 'sitemap.xml'
    }
  }
};

const generator = require('../lib/generator').bind(ctx);

describe('generator', () => {
  const hexo = new Hexo(__dirname, {silent: true});
  const Post = hexo.model('Post');
  let posts = {};
  let locals = {};

  before(() => {
    return hexo.init();
  });

  it('should generate', () => {
    Post.insert([
      {source: 'foo', slug: 'foo', updated: 1e8},
      {source: 'bar', slug: 'bar', updated: 1e8 + 1},
      {source: 'baz', slug: 'baz', updated: 1e8 - 1}
    ]).then(data => {
      posts = data.sort((a, b) => b.updated - a.updated);
      locals = hexo.locals.toObject();

      const sitemapTmpl = require('../lib/template')(ctx.config);
      const result = generator(locals);

      result.path.should.eql('sitemap.xml');
      result.data.should.eql(sitemapTmpl.render({
        config: ctx.config,
        posts: posts
      }));
    });
  });

  it('should sort in descending order', () => {
    const result = generator(locals);

    const $ = cheerio.load(result.data);

    $('url').each((index, element) => {
      $(element).children('loc').text().should.eql(posts[index].permalink);
      $(element).children('lastmod').text().should.eql(posts[index].updated.toISOString());
    });
  });
});

describe('skip_render', () => {
  const hexo = new Hexo(__dirname, {silent: true});
  const Post = hexo.model('Post');
  let locals = {};

  before(() => {
    return hexo.init().then(() => {
      return Post.insert([
        {source: 'foo', slug: 'foo', updated: 1e8},
        {source: 'bar', slug: 'bar', updated: 1e8 + 1},
        {source: 'baz', slug: 'baz', updated: 1e8 - 1}
      ]).then(data => {
        locals = hexo.locals.toObject();
      });
    });
  });

  describe('should skip file', () => {
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

describe('IDN', () => {
  const hexo = new Hexo(__dirname, {silent: true});
  const Post = hexo.model('Post');

  before(() => {
    hexo.config.url = 'http://fôo.com/bár';
    return hexo.init();
  });

  it('should encode URL properly', () => {
    const parsedUrl = encodeURL(hexo.config.url);
    Post.insert([
      {source: 'foo', slug: 'foo', updated: 1e8},
      {source: 'bar', slug: 'bar', updated: 1e8 + 1},
      {source: 'baz', slug: 'baz', updated: 1e8 - 1}
    ]).then(data => {
      const result = generator(hexo.locals.toObject());

      const $ = cheerio.load(result.data);

      $('url').each((index, element) => {
        $(element).children('loc').text().startsWith(parsedUrl).should.be.true;
      });
    });
  });
});
