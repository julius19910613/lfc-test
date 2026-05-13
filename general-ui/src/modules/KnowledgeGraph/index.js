const TestReport = () => import(
  /* webpackChunkName: "TestReport" */
  './TestReport.vue');
const DataManage = () => import(
  /* webpackChunkName: "DataManage" */
  './DataManage.vue');
const AuditManage = () => import(
  /* webpackChunkName: "AuditManage" */
  './AuditManage.vue');

export default {
  displayNameKey: 'knowledge_graph',
  icon: 'menu_te',
  pages: [
    {
      name: 'DataManage',
      path: 'data-manage',
      displayNameKey: 'data_manage',
      icon: 'white_task_engine',
      component: DataManage,
    },
    {
      name: 'TestReport',
      path: 'test-report',
      displayNameKey: 'test_report',
      icon: 'white_task_engine',
      component: TestReport,
    },
    {
      name: 'material-manage',
      path: 'audit-manage',
      displayNameKey: 'material_manage',
      icon: 'white_task_engine',
      component: AuditManage,
    },
  ],
};
