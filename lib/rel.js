'use strict';

const { url_for } = require('hexo-util');
const { extname } = require('path');

function relSitemapInject(data) {
  const { path, rel, relPath } = this.config.sitemap;
  const rPath = relPath ? relPath : path.filter(p => { return extname(p) === '.xml'; })[0];

  if (!rel || !rPath || data.match(/rel=['|"]?sitemap['|"]?/i)) return;

  const relSitemap = `<link rel="sitemap" type="application/xml" title="Sitemap" href="${url_for.call(this, rPath)}">`;

  return data.replace(/<head>(?!<\/head>).+?<\/head>/s, str => str.replace('</head>', `${relSitemap}</head>`));
}

module.exports = relSitemapInject;
