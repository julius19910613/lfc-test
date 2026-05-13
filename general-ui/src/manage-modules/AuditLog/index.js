const AuditSystem = () => import(
  /* webpackChunkName: "AuditSystem" */
  './AuditSystem.vue');
const AuditEnterprise = () => import(
  /* webpackChunkName: "AuditEnterprise" */
  './AuditEnterprise.vue');
const AuditRobot = () => import(
  /* webpackChunkName: "AuditRobot" */
  './AuditRobot.vue');

export default {
  pages: [
    {
      path: 'audit-enterprise',
      name: 'audit-enterprise',
      component: AuditSystem,
    },
    {
      path: 'audit-system',
      name: 'audit-system',
      component: AuditEnterprise,
    },
    {
      path: 'audit-robot',
      name: 'audit-robot',
      component: AuditRobot,
    },
  ],
};
