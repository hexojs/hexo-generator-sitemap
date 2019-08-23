'use strict';

const micromatch = require('micromatch');
const template = require('./template');
const { format, parse } = require('url');

module.exports = function(locals) {
  const config = this.config;
  let skipRenderList = [
    '**/*.js',
    '**/*.css'
  ];

  if (Array.isArray(config.skip_render)) {
    skipRenderList = skipRenderList.concat(config.skip_render);
  } else if (config.skip_render != null) {
    skipRenderList.push(config.skip_render);
  }

  const posts = [].concat(locals.posts.toArray(), locals.pages.toArray())
    .filter(function(post) {
      return post.sitemap !== false && !isMatch(post.source, skipRenderList);
    })
    .sort(function(a, b) {
      return b.updated - a.updated;
    })
    .map(post => ({
      ...post,
      permalink: format({
        protocol: parse(post.permalink).protocol,
        hostname: parse(post.permalink).hostname,
        pathname: encodeURI(parse(post.permalink).pathname)
      })
    }));

  const xml = template(config).render({
    config: config,
    posts: posts
  });

  return {
    path: config.sitemap.path,
    data: xml
  };
};

function isMatch(path, patterns) {
  return micromatch.isMatch(path, patterns);
}
