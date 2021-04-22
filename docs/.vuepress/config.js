module.exports = {
  title: 'Vue MC',
  description: 'Model and Collection system for vueJs',
  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide/' },
      { text: 'Model', link: '/usage/model.html' },
      { text: 'Collection', link: '/usage/collection.html' },
      { text: 'Integration with NuxtJs', link: '/usage/nuxt.html' },
      {
        text: 'Example',
        link: 'https://bitbucket.org/master-form/vuebase/src/4c8c13e047e6094795f07f3096b8f90e535f0dcf/?at=release%2Fmodel-collection',
        target: '_blank',
      },
    ],
    sidebar: {
      '/usage/': 'auto',
      '/guide/': 'auto',
      // fallback
      '/': ['' /* / */, 'contact' /* /contact.html */, 'about' /* /about.html */],
    },
  },
  head: [
    [
      'link',
      {
        rel: 'stylesheet',
        href: `https://cdn.jsdelivr.net/npm/vuetify@2.x/dist/vuetify.min.css`,
      },
    ],
  ],
};
