# hexo-generator-sitemap

[![Build Status](https://github.com/hexojs/hexo-generator-sitemap/workflows/Tester/badge.svg)](https://github.com/hexojs/hexo-generator-sitemap/actions?query=workflow%3ATester)
[![NPM version](https://badge.fury.io/js/hexo-generator-sitemap.svg)](https://www.npmjs.com/package/hexo-generator-sitemap)
[![Coverage Status](https://img.shields.io/coveralls/hexojs/hexo-generator-sitemap.svg)](https://coveralls.io/r/hexojs/hexo-generator-sitemap?branch=master)

Generate sitemap.

## Install

``` bash
$ npm install hexo-generator-sitemap --save
```

- Hexo 4: 2.x
- Hexo 3: 1.x
- Hexo 2: 0.x

## Options

You can configure this plugin in `_config.yml`.

``` yaml
sitemap:
  enable: true
  path:
    - sitemap.xml
    - sitemap.txt
  rel: false
  tags: true
  categories: true
```

- **enable** - Controls whether this plugin runs. (Default: `true`)
- **path** - Sitemap path. (Default: ['sitemap.xml', 'sitemap.txt'])
- **template** - Custom template path. This file will be used to generate sitemap file. Set empty to use internal template. (See [#Template](#Template) for more)
- **tags** - Add site's tags (Default: `true`)
- **categories** - Add site's categories (Default: `true`)
- **rel** - Add [`rel-sitemap`](http://microformats.org/wiki/rel-sitemap) to the site's header. (Default: `false`)

### Template

#### Internal Template

This plugin has two internal templates.

- [./sitemap.xml](./sitemap.xml)
- [./sitemap.txt](./sitemap.txt)

Set `template` empty to use internal template.
It according the extension of `path` to choose `template`.

```yaml
sitemap:
  path:
    - sitemap.xml
    - sitemap.txt
```

or

```yaml
sitemap:
  path:
    - sitemap.xml
    - sitemap.txt
  template:
    - ''
    - ''
```

#### Custom Template

you can generate several files by custom template.

`path` and `template` are paired in order.
if `template` is empty, plugin will try to use [internal template](#Internal-Template)

```yaml
sitemap:
  path:
    - sitemap.xml
    - custom1.txt
    - custom2.json
    - custom file name.txt  # use intelnal template
  template:
    - ''  # use intelnal template
    - './your custom1.template'
    - './your custom2.template'
```

## Exclude Posts/Pages

Add `sitemap: false` to the post/page's front matter.

``` yml
---
title: lorem ipsum
date: 2020-01-02
sitemap: false
---
```
