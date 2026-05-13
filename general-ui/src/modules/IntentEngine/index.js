const IntentManage = () => import(
  /* webpackChunkName: "IntentManage" */
  './IntentManage.vue');
const IntentTrainPage = () => import(
  /* webpackChunkName: "IntentTrainPage" */
  './_components/IntentTrainPage');
const IntentTestPage = () => import(
  /* webpackChunkName: "IntentTestPage" */
  './_components/IntentTestPage');
const IntentTestRecordListPage = () => import(
/* webpackChunkName: "IntentTestRecordListPage" */
'./_components/IntentTestRecordListPage');
const IntentTestRecordPage = () => import(
  /* webpackChunkName: "IntentTestRecordPage" */
  './_components/IntentTestRecordPage');

export default {
  displayNameKey: 'intent_engine',
  icon: 'menu_intent',
  pages: [
    {
      path: 'intent-manage',
      privCode: 'intent_manage',
      displayNameKey: 'intent_manage',
      name: 'intent-manage',
      // components: {},
      childrenPath: [
        { path: '', component: IntentTrainPage },
        { path: 'test', component: IntentTestPage },
        { path: 'test/records', component: IntentTestRecordListPage },
        { path: 'test/record/:id', component: IntentTestRecordPage },
      ],
      component: IntentManage,
    },
  ],
};
