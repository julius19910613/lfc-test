const QAList = () => import(
  /* webpackChunkName: "QAList" */
  './QAList.vue');
const QATest = () => import(
  /* webpackChunkName: "QATest" */
  './QATest.vue');
const QAChatSkill = () => import(
  /* webpackChunkName: "QAChatSkill" */
  './QAChatSkill.vue');
const QALabel = () => import(
  /* webpackChunkName: "QALabel" */
  './QALabel.vue');
const QARule = () => import(
  /* webpackChunkName: "QARule" */
  './QARule.vue');

export default {
  displayNameKey: 'ssm',
  icon: 'white_ssm',
  pages: [
    {
      path: 'qalist',
      privCode: 'qalist',
      displayNameKey: 'qalist',
      icon: 'white_SQ',
      component: QAList,
    },
    {
      path: 'qatest',
      privCode: 'qatest',
      displayNameKey: 'qatest',
      icon: 'white_chat',
      name: 'qa-test',
      component: QATest,
    },
    {
      path: 'qa-chat-skill',
      privCode: 'qa_chat_skill',
      displayNameKey: 'qa_chat_skill',
      icon: 'white_chat',
      name: 'qa-chat-skill',
      component: QAChatSkill,
    },
    {
      path: 'qa-label',
      privCode: 'qa_label',
      displayNameKey: 'qa_label',
      icon: 'white_chat',
      name: 'qa-label',
      component: QALabel,
    },
    {
      path: 'qa-rule',
      privCode: 'qa_rule',
      displayNameKey: 'qa_rule',
      icon: 'white_chat',
      name: 'qa-rule',
      component: QARule,
    },
  ],
};
