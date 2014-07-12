var generator = hexo.extend.generator;

if (generator.register.length === 1){
  generator.register(require('./sitemap'));
} else {
  generator.register('sitemap', require('./sitemap'));
}