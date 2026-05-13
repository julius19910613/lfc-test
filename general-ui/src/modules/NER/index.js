const NER = () => import(
  /* webpackChunkName: "NER" */
  './NER.vue');
// const NERTestReport = () => import(
//   /* webpackChunkName: "NERTestReport" */
//   './NERTestReport.vue');
const ParserLibrary = () => import(
  /* webpackChunkName: "ParserLibrary" */
  './ParserLibrary.vue');

const DialogueActClassifier = () => import(
  /* webpackChunkName: "ParserLibrary" */
  './DialogueActClassifier.vue');

export default {
  displayNameKey: 'ner',
  icon: 'menu_ner',
  pages: [
    {
      path: 'ner-extractor',
      displayNameKey: 'ner_extractor',
      icon: 'white_folder',
      component: NER,
    },
    // {
    //   path: 'ner-test-report',
    //   displayNameKey: 'ner_test_report',
    //   icon: 'white_folder',
    //   component: NERTestReport,
    // },
    {
      path: 'parser_library',
      component: ParserLibrary,
    },
    {
      path: 'dialogue-act-classifier',
      component: DialogueActClassifier,
    },
  ],
};
