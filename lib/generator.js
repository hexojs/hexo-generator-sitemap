'use strict';

const micromatch = require('micromatch');
const template = require('./template');

module.exports = function(locals) {
  const {config} = this;
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
    .filter(post => {
      return post.sitemap !== false && !isMatch(post.source, skipRenderList);
    })
    .sort((a, b) => {
      return b.updated - a.updated;
    });

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
