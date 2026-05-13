const NER_PARSER_LIST_PATH = '/nerFactoryDal/customParserList';
const NER_PARSER_COUNT_PATH = '/nerFactoryDal/customParserUsedCount';
const VOICE_PATH = '/aicc/api/cc/v1/pre_records';
const DIALOG_ACT_PARSER_LIST_PATH = '/dialogActClassify/customClassifier/classifierList';
const INTENT_LIST_PATH = '/intent/v3/getIntentGroup';

export default {
  // 语音设置
  getVoiceOption(enterpriseId, scenarioId) {
    const data = {
      enterprise_id: enterpriseId,
      scenario_id: scenarioId,
    };
    return this.$reqPost(VOICE_PATH, data).then(rsp => rsp.data);
  },
  getDialogActParserList(appId) {
    const data = {
      companyId: appId,
    };
    return this.$reqPost(DIALOG_ACT_PARSER_LIST_PATH, data).then(resp => resp.data);
  },
  // 意图3.0
  getIntentList(appId) {
    return this.$reqGet(`${INTENT_LIST_PATH}?appId=${appId}&groupType=0&intentName=`);
  },
  getNerParserList(appId) {
    const data = {
      userId: appId,
      listType: 'released',
      // userId: 'custom',
      // listType: 'all',
    };
    return this.$reqPost(NER_PARSER_LIST_PATH, data).then(resp => resp.data);
  },
  updateNerParserCount(appId, parserId) {
    const data = {
      userId: appId,
      // userId: 'custom',
      parserId,
      times: '1',
    };
    return this.$reqPost(NER_PARSER_COUNT_PATH, data).then(resp => resp.data);
  },
  deleteNerParserCount(appId, parserId) {
    const data = {
      userId: appId,
      // userId: 'custom',
      parserId,
      times: '-1',
    };
    return this.$reqPost(NER_PARSER_COUNT_PATH, data).then(resp => resp.data);
  },
  updateNerParsersCount(appId, parserId) {
    parserId.forEach((id) => {
      this.$api.updateNerParserCount(appId, id);
    });
  },
  deleteNerParsersCount(appId, parserId) {
    parserId.forEach((id) => {
      this.$api.deleteNerParserCount(appId, id);
    });
  },
};
