const RobotList = () => import(
  /* webpackChunkName: "RobotList" */
  './RobotList.vue');
const RobotGroup = () => import(
  /* webpackChunkName: "RobotGroup" */
  './RobotGroup.vue');
const EnterpriseSetting = () => import(
  /* webpackChunkName: "EnterpriseSetting" */
  './EnterpriseSetting.vue');

export default {
  pages: [
    {
      path: 'robot-manage',
      name: 'robot-manage',
      component: RobotList,
    },
    {
      path: 'robot-group',
      name: 'robot-group',
      component: RobotGroup,
    },
    {
      path: 'enterprise-setting',
      name: 'enterprise-setting',
      component: EnterpriseSetting,
    },
  ],
};
