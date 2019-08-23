import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index'
import '@/assets/css/reset.css';
import '@/assets/css/overall.css';

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

import VXETable from 'vxe-table'
import 'vxe-table/lib/index.css'
Vue.use(VXETable)

import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
Vue.use(VueQuillEditor)

import axios from 'axios'//引入axios
Vue.prototype.$axios = axios;//把axios挂载到vue上

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
