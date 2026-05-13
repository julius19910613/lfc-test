// import qs from 'qs';

const ACT_LIST = '/dialogActClassify/customClassifier/search';
const ACT_DETAIL = '/dialogActClassify/customClassifier/detail';
const SYSTEM_ACT_LIST = '/dialogActClassify/customClassifier/systemActsList';
const ACT_CREATE = '/dialogActClassify/customClassifier/create';
const ACT_DELETE = '/dialogActClassify/customClassifier/delete';
const ACT_UPDATE = '/dialogActClassify/customClassifier/update';
const ACT_IMPORT = '/dialogActClassify/customClassifier/import';
const ACT_EXPORT = '/dialogActClassify/customClassifier/export';
const ACT_TEMPL_EXPORT = ' /dialogActClassify/customClassifier/import/template';
const SINGLE_TEST_ACT = 'dialogActClassify/customClassifier/testPredict';
const TEST_SYSTEM_ACT = 'dialogActClassify/customClassifier/testSystemActs';

// 对话行为分类器列表
function getDialogActList(appId, searchText) {
  const params = {
    userId: appId,
    searchText,
  };
  return this.$reqPost(ACT_LIST, params).then(rsp => rsp.data);
}

function getDialogActDetail(appId, classifierId) {
  const params = {
    userId: appId,
    classifierId,
  };
  return this.$reqPost(ACT_DETAIL, params).then(rsp => rsp.data);
}

// 获取系统自带对话行为分类器列表
function getSystemActList() {
  return this.$reqPost(SYSTEM_ACT_LIST).then(rsp => rsp.data);
}

function createDialogAct(actObj) {
  return this.$reqPost(ACT_CREATE, actObj).then(rsp => rsp.data);
}

function deleteDialogAct(actObj) {
  return this.$reqPost(ACT_DELETE, actObj).then(rsp => rsp.data);
}

function updateDialogAct(actObj) {
  return this.$reqPost(ACT_UPDATE, actObj).then(rsp => rsp.data);
}

function importDialogAct(file, appId) {
  const data = new FormData();
  data.append('file', file);
  data.append('userId', appId);
  return this.$reqPost(ACT_IMPORT, data).then(rsp => rsp.data);
}

function exportDialogAct(appId, actId) {
  window.open(`${ACT_EXPORT}/${appId}/${actId}?random=${Math.random()}`);
}

function downloadDialogActTempl(lang) {
  window.open(`${ACT_TEMPL_EXPORT}/${lang}?random=${Math.random()}`);
}

function singleTestClassifier(userId, classifierId, query) {
  const params = {
    userId,
    classifierId,
    query,
  };
  return this.$reqPost(SINGLE_TEST_ACT, params).then(rsp => rsp.data);
}

function testSystemAct(userId, sysActs, query) {
  const params = {
    userId,
    sysActs,
    query,
  };
  return this.$reqPost(TEST_SYSTEM_ACT, params).then(rsp => rsp.data);
}

export default {
  getDialogActList,
  getDialogActDetail,
  createDialogAct,
  deleteDialogAct,
  updateDialogAct,
  importDialogAct,
  exportDialogAct,
  downloadDialogActTempl,
  singleTestClassifier,
  getSystemActList,
  testSystemAct,
};
