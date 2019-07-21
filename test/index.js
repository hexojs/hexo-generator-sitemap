'use strict';

require('chai').should();
const Hexo = require('hexo');
const cheerio = require('cheerio');

describe('Sitemap generator', () => {
  const hexo = new Hexo(__dirname, {silent: true});
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
        {source: 'bar', slug: 'bar', updated: 1e8 + 1},
        {source: 'baz', slug: 'baz', updated: 1e8 - 1}
      ]).then(post => {
        posts = post.sort((a, b) => b.updated - a.updated);
        return Page.insert([
          {source: 'bio/index.md', path: 'bio/', updated: 1e8 - 3},
          {source: 'about/index.md', path: 'about/', updated: 1e8 - 4}
        ]);
      }).then(page => {
        pages = page.sort((a, b) => b.updated - a.updated);
        locals = hexo.locals.toObject();
      });
    });
  });

  // Check the whole sitemap.xml
  it('default', () => {
    const result = generator(locals);

    result.path.should.eql('sitemap.xml');
    result.data.should.eql(sitemapTmpl.render({
      config: hexo.config,
      posts: posts.concat(pages)
    }));
  });

  // Check each element in sitemap.xml
  it('Each element', () => {
    const result = generator(locals);

    const $ = cheerio.load(result.data);
    const allPosts = posts.concat(pages);

    $('url').each((index, element) => {
      $(element).children('loc').text().should.eql(allPosts[index].permalink);
      $(element).children('lastmod').text().should.eql(allPosts[index].updated.toISOString());
    });
  });

  // urls should not ends with 'index.html'
  it('Canonical url', () => {
    const result = generator(locals);

    const $ = cheerio.load(result.data);

    $('url').each((index, element) => {
      $(element).children('loc').text().endsWith('index.html').should.be.false;
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
