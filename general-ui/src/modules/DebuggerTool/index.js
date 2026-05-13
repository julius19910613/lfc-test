const DebuggerTool = () => import(
  /* webpackChunkName: "DebuggerTool" */
  './DebuggerTool.vue');

export default {
  displayNameKey: 'chat_tools',
  icon: '',
  hidden: true,
  pages: [
    {
      path: 'debugger-tool',
      displayNameKey: 'debugger',
      name: 'debugger-tool',
      component: DebuggerTool,
    },
  ],
};
