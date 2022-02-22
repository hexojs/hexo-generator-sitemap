'use strict';

const micromatch = require('micromatch');
const template = require('./template');

module.exports = function(locals) {
  const { config } = this;
  const { sitemap, skip_render } = config;
  const { tags: tagsCfg, categories: catsCfg } = sitemap;
  const skipRenderList = [
    '**/*.js',
    '**/*.css'
  ];

  if (Array.isArray(skip_render)) {
    skipRenderList.push(...skip_render);
  } else if (typeof skip_render === 'string') {
    if (skip_render.length > 0) {
      skipRenderList.push(skip_render);
    }
  }

  const posts = [].concat(locals.posts.toArray(), locals.pages.toArray())
    .filter(post => {
      return post.sitemap !== false && !isMatch(post.source, skipRenderList);
    })
    .sort((a, b) => {
      return b.updated - a.updated;
    });

  if (posts.length <= 0) {
    sitemap.rel = false;
    return;
  }

  const res = template(config);
  for (const i in res) {
    res[i].data = res[i].data.render({
      config,
      posts,
      sNow: new Date(),
      tags: tagsCfg ? locals.tags.toArray() : [],
      categories: catsCfg ? locals.categories.toArray() : []
    });
  }
  return res;
};

function isMatch(path, patterns) {
  return micromatch.isMatch(path, patterns);
}
