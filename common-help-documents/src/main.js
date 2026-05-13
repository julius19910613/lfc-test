// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// import 'element-ui/lib/theme-chalk/index.css';
import '@/assets/scss/index.scss';
import G from '@/js/common/global';
import locale from 'element-ui/lib/locale';
import ElementUI from 'element-ui';
import CommonModules from 'common-modules-zj';
import 'common-modules-zj/src/assets/styles/iconfont/iconfont.css';
import VueI18n from 'vue-i18n';
// import axiosPlugin from '@/js/api';
import store from '@/store';
import Vue from 'vue';
import App from './App';
// import BaseLoading from './components/basic/BaseLoading';
import router from './router/index';
import zh from './i18n/zh';
import zhtw from './i18n/zhtw';
/* eslint-disable no-new */

Vue.config.productionTip = false;
Vue.use(ElementUI);
// Vue.component('BaseLoading', BaseLoading);
Vue.use(VueI18n);
Vue.use(G);
Vue.use(CommonModules.PageHeader);
Vue.use(CommonModules.ProductMenu);
Vue.use(CommonModules.PageMenu);
Vue.use(CommonModules.QaTest);
Vue.use(CommonModules.EmotiIcon);

const i18n = new VueI18n({
  locale: localStorage.getItem('locale') || 'zh-cn',
  messages: {
    'zh-cn': zh,
    'zh-tw': zhtw,
  },
});
locale.i18n((key, value) => i18n.t(key, value));

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>',
  store,
  router,
  i18n,
});
