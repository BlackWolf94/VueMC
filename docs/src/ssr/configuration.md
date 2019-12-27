# SSR

**Install ssrMCPlugin plugin** 

```javascript
import Vue from 'vue';
import App from './App.vue';
import { createRouter } from './router';
import { ssrMCPlugin } from '@zidadindimon/vue-mc';

Vue.use(ssrMCPlugin);

export function createApp(conf, state) {

  const router = createRouter();
  const store = createStore();


  if (state) {
    store.replaceState(state);
  }

  const app = new Vue({
    router,
    store,
    render: (h) => h(App)
  });

  return { app, router, store };
}
```

**Configure  entry-server point** 

```javascript
import { createApp } from './createApp';

const routerOnReady = (router) => new Promise((resolve, reject) => {
  router.onReady(resolve, reject);
});


export default (context) => new Promise(async (resolve, reject) => {
  const {appConf, url} = context;
  const { app, router, store } = createApp(appConf);
  
  //init mc ssr
  app.$mcServerSSR();

  const { fullPath } = router.resolve(url).route;
  if (fullPath !== url) {
    return reject({ url: fullPath });
  }

  // set router's location
  router.push(url);

  try {
    await routerOnReady(router);
    const matchedComponents = router.getMatchedComponents();
    if (!matchedComponents.length) {
      return reject({ code: 404 });
    }

    //get mc ssr context
    context.mcState = app.$mcServerSSRContext.bind(app);

    context.state = store.state;
    resolve(app);

  } catch (e) {
    console.error(e);
    reject(e);
  }

});

```

**Configure  entry-client point** 

```javascript
import 'es6-promise/auto';
import { createApp } from './createApp';

const state = (window as any).__INITIAL_STATE__ || {};
const appConf = (window as any).__INITIAL_APP_CONF__ || {};

const { app, router } = createApp(appConf, state);

//init mc ssr on client  
app.$mcClientSSR('__INITIAL_MC_STATE__');

(window as any).runtime_process_env = {
  DEBUG: true
};

const onReady = () => app.$mount('#app');

router.onReady(onReady);
```

**Configure  srr template point** 
```html
<!DOCTYPE html>
<html>
<head>
  <title>{{ title }}</title>
  <meta charset="utf-8">
  <meta name="mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="default">
  <meta name="viewport" content="width=device-width, initial-scale=1, minimal-ui">
  <link rel="shortcut icon" sizes="48x48" href="/public/favicon.ico">
  <meta name="theme-color" content="#f60">
  {{{ meta }}}
</head>
<body>
  <script> window.__INITIAL_MC_STATE__ = {{{ mcState() }}} </script>
  <!--vue-ssr-outlet-->
</body>
</html>

```
