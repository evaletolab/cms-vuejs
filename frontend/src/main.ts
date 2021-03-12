

import Vue from 'vue';
// import VueCompositionApi from '@vue/composition-api'
// Vue.use(VueCompositionApi)

import Editor from 'vue-editor-js/src';
Vue.use(Editor);

import './registerServiceWorker'
import App from './App.vue'
import './ts/class-component-hooks.ts';
import router from './router'


console.log('--- INIT main');
Vue.config.productionTip = false


import '@/main.scss'

import { $config, $user } from '@/services';
const load = [$config.get(),$user.get()];

Promise.all(load).
then(() => {
  new Vue({
    router,
    render: h => h(App)
  }).$mount('#app')
})
.catch(e => {
  console.log("error", e);
})

