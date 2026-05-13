const WordBank = () => import(
  /* webpackChunkName: "WordBank" */
  './WordBank.vue');

export default {
  displayNameKey: 'wordbank',
  icon: 'menu_wordbank',
  pages: [
    {
      path: 'wordbank-list',
      displayNameKey: 'wordbank_list',
      icon: 'white_folder',
      component: WordBank,
    },
  ],
};
