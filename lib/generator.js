'use strict';

const micromatch = require('micromatch');
const templateFn = require('./template');
const parseConfigFn = require('./parse_config');

module.exports = function(locals) {

  const { config, log} = this;
  const { sitemap, skip_render } = config;
  const { tags: tagsCfg, categories: catsCfg } = sitemap;
  const { path: pathArray, template: templateArray } = parseConfigFn(sitemap);
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

  function render(tmpl) {
    const data = templateFn(tmpl).render({
      config,
      posts,
      sNow: new Date(),
      tags: tagsCfg ? locals.tags.toArray() : [],
      categories: catsCfg ? locals.categories.toArray() : []
    });

    return data;
  }

  const ans = [];
  pathArray.forEach(p => {
    const i = pathArray.indexOf(p);
    const tmpl = templateArray[i];
    if (tmpl) {
      ans.push({ path: p, data: render(tmpl) });
    } else {
      log.warn(`hexo-generator-sitemap: \`${p}\` template \`${tmpl}\` not found.`);
    }
  });

  return ans;
};

function isMatch(path, patterns) {
  return micromatch.isMatch(path, patterns);
}
