const WhiteList = () => import(
  /* webpackChunkName: "WhiteList" */
  './WhiteList.vue');

export default {
  displayNameKey: 'whitelist',
  icon: 'menu_whitelist',
  pages: [
    {
      path: 'white-list',
      displayNameKey: 'white_list',
      icon: 'white_folder',
      component: WhiteList,
    },
  ],
};
