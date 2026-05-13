const EnterpriseList = () => import(
  /* webpackChunkName: "EnterpriseList" */
  './EnterpriseList.vue');
const SystemAdminList = () => import(
  /* webpackChunkName: "SystemAdminList" */
  './SystemAdminList.vue');
const SystemSetting = () => import(
  /* webpackChunkName: "SystemSetting" */
  './SystemSetting.vue');

export default {
  pages: [
    {
      path: 'enterprise-manage',
      name: 'enterprise-manage',
      component: EnterpriseList,
    },
    {
      name: 'system-admin-list',
      path: 'system-admin-list',
      component: SystemAdminList,
    },
    {
      path: 'system-setting',
      name: 'system-setting',
      component: SystemSetting,
    },
  ],
};
