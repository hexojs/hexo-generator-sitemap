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
    post_changefreq: daily
    post_priority: 0.8
    tag_changefreq: weekly
    tag_priority: 0.2
    category_changefreq: weekly
    category_priority: 0.2
```

- **path** - Sitemap path. (Default: sitemap.xml)
- **post_changefreq** - Post&Page change frequency. (always, hourly, daily, weekly, monthly, yearly, never)
- **post_priority** - Post&Page priority. (0.0 ~ 1.0)
- **tag_changefreq** - Tags change frequency.
- **tag_priority** - Tags priority. (0.0 ~ 1.0)
- **category_changefreq** - Categories change frequency.
- **category_priority** - Categories priority. (0.0 ~ 1.0)
