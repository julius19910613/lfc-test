const ChatTools = () => import(
  /* webpackChunkName: "ChatTools" */
  './ChatTools.vue');

export default {
  displayNameKey: 'chat_tools',
  icon: '',
  hidden: true,
  pages: [
    {
      path: 'chat-tools',
      privCode: 'ai_tools',
      displayNameKey: 'chat',
      name: 'chat-tools',
      component: ChatTools,
    },
  ],
};
