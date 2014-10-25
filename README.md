# Sitemap generator

Generate sitemap.

## Install

``` bash
$ npm install hexo-generator-sitemap --save
```

## Options

You can configure this plugin in `_config.yml`.

``` yaml
sitemap:
    path: sitemap.xml
```

- **path** - Sitemap path. (Default: sitemap.xml)

``` markdown
title: new-post-title
date: 2014-10-18 16:17:55  
index: false
---
```

- **index** - Whether include this post in sitemap file. (Default: true)
