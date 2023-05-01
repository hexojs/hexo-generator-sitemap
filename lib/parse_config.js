'use strict';

const { join, extname } = require('path');

function defaultTmpl(path) {
  let tmpl;
  switch (extname(path)) {
    case '.xml':
      tmpl = join(__dirname, '../sitemap.xml');
      break;
    case '.txt':
      tmpl = join(__dirname, '../sitemap.txt');
      break;
  }

  return tmpl;
}

function path_enumerate(pathArray) {
  const tmplArray = [];
  pathArray.forEach(p => { tmplArray.push(defaultTmpl(p)); });

  return tmplArray;
}

module.exports = function(sitemapCfg) {
  if (typeof sitemapCfg.path === 'string') {
    sitemapCfg.path = sitemapCfg.path.split();
  }

  if (!sitemapCfg.template) {
    sitemapCfg.template = path_enumerate(sitemapCfg.path);

  } else if (typeof sitemapCfg.template === 'string') {
    sitemapCfg.template = sitemapCfg.template.split();
  }

  sitemapCfg.template.forEach(tmpl => {
    if (!tmpl) {
      const i = sitemapCfg.template.indexOf(tmpl);
      sitemapCfg.template[i] = defaultTmpl(sitemapCfg.path[i]);
    }
  });

  if (sitemapCfg.path.length > sitemapCfg.template.length) {
    const path2 = sitemapCfg.path.slice(sitemapCfg.template.length);
    sitemapCfg.template = sitemapCfg.template.concat(path_enumerate(path2));
  }

  return sitemapCfg;
};
