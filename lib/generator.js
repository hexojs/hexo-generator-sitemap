'use strict';

const micromatch = require('micromatch');
const template = require('./template');

module.exports = function(locals) {
  const { config } = this;
  const { sitemap, skip_render } = config;
  const { path, tags: tagsCfg, categories: catsCfg } = sitemap;
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

  function rend(config) {
    const d = template(config).render({
      config,
      posts,
      sNow: new Date(),
      tags: tagsCfg ? locals.tags.toArray() : [],
      categories: catsCfg ? locals.categories.toArray() : []
    });
    return d;
  }
  let res = [];
  switch (typeof path) {
    case 'string':
      res = { path: path, data: rend(config) };
      break;
    case 'object':
      for (const x of path) {
        config.sitemap.path = x;
        res.push({ path: x, data: rend(config) });
      }
      break;
  }
  return res;
};

function isMatch(path, patterns) {
  return micromatch.isMatch(path, patterns);
}
