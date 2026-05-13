const Dashboard = () => import(
  /* webpackChunkName: "StatisticDashboard" */
  './StatisticDashboard.vue');

export default {
  displayNameKey: 'status',
  icon: 'menu_dashboard',
  dftOpen: true,
  pages: [
    {
      path: 'statistic-dash',
      displayNameKey: 'statistic_dash',
      icon: 'white_dashboard',
      component: Dashboard,
    },
  ],
};
