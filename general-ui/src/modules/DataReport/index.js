const DataReport = () => import(
  /* webpackChunkName: "DataReport" */
  './Index.vue');

export default {
  displayNameKey: 'datareport',
  icon: 'menu_datareport',
  pages: [
    {
      path: 'data-report',
      displayNameKey: 'data_report',
      icon: 'white_folder',
      component: DataReport,
    },
  ],
};
