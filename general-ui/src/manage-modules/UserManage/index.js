const EnterpriseUserList = () => import(
  /* webpackChunkName: "EnterpriseUserList" */
  './EnterpriseUserList.vue');
const EnterpriseRoleList = () => import(
  /* webpackChunkName: "EnterpriseRoleList" */
  './EnterpriseRoleList.vue');
const UserPreference = () => import(
  /* webpackChunkName: "UserPreference" */
  './UserPreference.vue');

export default {
  pages: [
    {
      name: 'enterprise-user-list',
      path: 'enterprise-user-list',
      component: EnterpriseUserList,
    },
    {
      name: 'enterprise-role-list',
      path: 'enterprise-role-list',
      component: EnterpriseRoleList,
    },
    {
      name: 'user-preference',
      path: 'user-preference',
      component: UserPreference,
    },
  ],
};
