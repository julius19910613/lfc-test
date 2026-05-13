const RobotProfile = () => import(
  /* webpackChunkName: "RobotProfileV4" */
  './RobotProfileV4.vue');
const FunctionSetting = () => import(
  /* webpackChunkName: "FunctionSetting" */
  './FunctionSetting.vue');
const ChatSkill = () => import(
  /* webpackChunkName: "RobotWords" */
  './RobotWords.vue');
const Command = () => import(
  /* webpackChunkName: "RobotCommand" */
  './RobotCommand.vue');
const IntegrationInfo = () => import(
  /* webpackChunkName: "IntegrationInfo" */
  './IntegrationInfo.vue');
const RobotConfig = () => import(
  /* webpackChunkName: "RobotConfig" */
  './RobotConfig.vue');

export default {
  displayNameKey: 'robot_setting',
  icon: 'menu_robot',
  pages: [
    {
      path: 'robot-profile',
      privCode: 'robot_profile', // 权限
      displayNameKey: 'robot_profile', // 中文显示
      icon: 'white_robot',
      component: RobotProfile,
    },
    {
      path: 'robot-chat-skill',
      privCode: 'robot_chat_skill',
      displayNameKey: 'robot_chat_skill',
      icon: 'white_chat',
      name: 'robot-chat-skill',
      component: ChatSkill,
    },
    {
      path: 'robot-function',
      privCode: 'robot_function',
      displayNameKey: 'robot_function',
      icon: 'white_setting2',
      component: FunctionSetting,
    },
    {
      path: 'robot-command',
      privCode: 'robot_command',
      displayNameKey: 'robot_command',
      icon: 'white_chat',
      name: 'robot-command',
      component: Command,
    },
    {
      path: 'integration',
      privCode: 'integration',
      displayNameKey: 'integration',
      icon: 'white_chat',
      name: 'integration',
      component: IntegrationInfo,
    },
    {
      path: 'robot_config',
      privCode: 'robot_config',
      displayNameKey: 'robot_config',
      icon: 'white_chat',
      name: 'robot_config',
      component: RobotConfig,
    },
  ],
};
