'use strict';

const minimatch = require('minimatch');
const template = require('./template');

module.exports = function(locals) {
  const config = this.config;
  let skipRenderList = [
    '**/*.js',
    '**/*.css'
  ];

  let url = config.url;
  if (url[url.length - 1] !== '/') url += '/';

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
    });

  const xml = template(config).render({
    config: config,
    url: url,
    posts: posts
  });

  return {
    path: config.sitemap.path,
    data: xml
  };
};

function isMatch(path, patterns) {
  if (!patterns) return false;
  if (!Array.isArray(patterns)) patterns = [patterns];
  if (!patterns.length) return false;

  for (let i = 0, len = patterns.length; i < len; i++) {
    if (minimatch(path, patterns[i])) return true;
  }

  return false;
}
