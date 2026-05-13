const List = () => import(
  /* webpackChunkName: "Example" */
  './SSM.vue');
const Records = () => import(
  /* webpackChunkName: "QARecords" */
  './QARecords.vue');

export default {
  displayNameKey: 'ssm',
  icon: 'menu_ssm',
  pages: [
    {
      path: 'ssm',
      privCode: 'ssm3',
      displayNameKey: 'ssm',
      name: 'ssm',
      component: List,
    },
    {
      path: 'history',
      privCode: 'qa_records',
      displayNameKey: 'history',
      name: 'history',
      component: Records,
    },
  ],
};
