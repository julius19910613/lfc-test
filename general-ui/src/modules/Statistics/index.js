const DailyLog = () => import(
  /* webpackChunkName: "StatisticDaily" */
  './StatisticDaily.vue');
const Analysis = () => import(
  /* webpackChunkName: "StatisticAnalysisNew" */
  './StatisticAnalysisNew.vue');
const Session = () => import(
  /* webpackChunkName: "StatisticSession" */
  './StatisticSession.vue');
const StatisticHealthCheck = () => import(
  /* webpackChunkName: "StatisticHealthCheck" */
  './StatisticHealthCheck.vue');

export default {
  displayNameKey: 'statistics',
  icon: 'menu_statistics',
  pages: [
    {
      path: 'statistic-analysis',
      displayNameKey: 'statistic_analysis',
      icon: 'white_daily',
      name: 'statistic-analysis',
      component: Analysis,
    },
    {
      path: 'statistic-daily',
      privCode: 'statistic_daily',
      displayNameKey: 'statistic_daily',
      icon: 'white_daily',
      name: 'statistic-daily',
      component: DailyLog,
    },
    {
      path: 'statistic-session',
      displayNameKey: 'statistic_session',
      name: 'statistic-session',
      component: Session,
    },
    {
      path: 'health-check',
      displayNameKey: 'statistic_heatlh_check',
      icon: 'white_daily',
      name: 'health-check',
      component: StatisticHealthCheck,
    },
  ],
};
