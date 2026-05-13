import qs from 'qs';

const GET_CUSTOM_PARSER_LIST = '/nerFactoryDal/customParserList';
const CUSTOM_PARSER = '/nerFactoryDal/customParser';

const GET_GENERAL_PARSER_LIST = '/nerFactoryDal/baseParserDataManager';
const UPLOAD_NER_CORPUS_FILE = '/nerFactoryDal/corpusUpload';

const GET_CORPUS_TEMPLATE = '/nerFactoryDal/template/corpusImportTemplate';
const EXPORT_CORPUS = '/nerFactoryDal/parserCorpusExport';

const UPLOAD_WORDBANK = '/nerFactoryDal/dictionaryImport?file';
const GET_WORDBANK_LIST = '/nerFactoryDal/dictionaryManager';
const DOWNLOAD_NER_WB_TEMPLATE = '/nerFactoryDal/template/dictionaryImportTemplate';

const GET_NER_TEST_DATA = '/nerFactoryDal/testDataList';
const GET_NER_TEST_TEMPLATE = '/nerFactoryDal/quizImportTemplate';
const UPLOAD_TEST_CASE = '/nerFactoryDal/quizDataImport';
const START_TEST = '/nerFactoryDal/testQuizData';
const GET_TEST_PROGRESS = '/nerFactoryDal/checkTestSchedule';
const EXPORT_TEST_RESULT = '/nerFactoryDal/testResultExport';
const EXPORT_TEST_CASE = '/nerFactoryDal/testQuizDataExport';

const REGISTER_NER_USER = '/nerFactoryDal/userManager/register';

const WORDBANK_MANAGE = '/nerFactoryDal/dictionaryManager';
const WORDS_MANAGE = '/nerFactoryDal/wordManager';

const PARSER_LIBRARY = '/nerFactoryDal/parserLibraryList';
const SINGLE_TEST_PARSER = '/nerFactoryDal/testSingleQuiz';

// 自定义解析器
function getCustomParserList(appId, listType = 'all') {
  const params = {
    userId: appId,
    listType,
  };
  return this.$reqPost(GET_CUSTOM_PARSER_LIST, qs.stringify(params)).then(rsp => rsp.data.data);
}

function createCustomParser(appId, parserObj, flagTrain = false) {
  parserObj.userId = appId;
  parserObj.description = '';
  const url = flagTrain ? `${CUSTOM_PARSER}/addAndTrain` : CUSTOM_PARSER;
  return this.$reqPost(url, parserObj).then(rsp => rsp.data);
}

function updateCustomParser(appId, parserObj, flagTrain = false) {
  delete parserObj.onlySave;
  parserObj.userId = appId;
  parserObj.description = '';
  const url = flagTrain ? `${CUSTOM_PARSER}/saveAndTrain` : CUSTOM_PARSER;
  return this.$reqPut(url, parserObj).then(rsp => rsp.data);
}

function trainCustomParser(appId, parserObj) {
  const params = {
    userId: appId,
    parserId: parserObj.parserId,
    corpus: parserObj.corpus,
  };
  return this.$reqPost(`${CUSTOM_PARSER}/train`, params).then(rsp => rsp.data);
}

function deleteCustomParser(appId, parserId, parserName) {
  const params = {
    userId: appId,
    parserId,
    parserName,
  };
  return this.$reqDelete(CUSTOM_PARSER, {}, params).then(rsp => rsp.data);
}

function deleteWordBank(appId, dictionaryId) {
  const params = {
    userId: appId,
    dictionaryId,
  };
  return this.$reqDelete(WORDBANK_MANAGE, {}, params).then(rsp => rsp.data);
}

function getCustomParser(appId, parserId) {
  return this.$reqGet(`${CUSTOM_PARSER}?userId=${appId}&parserId=${parserId}`).then(rsp => rsp.data);
}

// 通用解析器
function getGeneralParserList(appId) {
  return this.$reqGet(`${GET_GENERAL_PARSER_LIST}?userId=${appId}`).then(rsp => rsp.data.data);
}

// NER语料导入
function uploadNERCorpusFile(file) {
  const data = new FormData();
  data.append('file', file);
  return this.$reqPost(UPLOAD_NER_CORPUS_FILE, data).then(rsp => rsp.data);
}

// NER词库
function getWordBankList(appId) {
  return this.$reqGet(`${GET_WORDBANK_LIST}?userId=${appId}`).then(rsp => rsp.data.data);
}

// NER词库词条
function getWBWordsList(appId, dictionaryId) {
  const params = {
    userId: appId,
    dictionaryId,
  };
  return this.$reqGet(`${WORDS_MANAGE}?userId=${appId}&dictionaryId=${dictionaryId}`, params).then(rsp => rsp.data.data);
}


function uploadWordBank(file, appId) {
  const data = new FormData();
  data.append('file', file);
  data.append('userId', appId);
  return this.$reqPost(UPLOAD_WORDBANK, data).then(rsp => rsp.data);
}

// NER测试及报告
function getParserTestData(appId, parserId,
  pageSize = 15, pageIndex = 1, totalNumber = '', keyword = '') {
  const params = {
    userId: appId,
    parserId,
    pageSize,
    pageIndex,
    totalNumber,
    keyword,
  };
  return this.$reqPost(GET_NER_TEST_DATA, params).then(rsp => rsp.data);
}

function uploadNERTestCase(appId, parserId, file, uploadMode) {
  let mode = 'increment';
  if (uploadMode === 1) {
    mode = 'totalContent';
  }
  const data = new FormData();
  data.append('userId', appId);
  data.append('parserId', parserId);
  data.append('file', file);
  data.append('importType', mode);
  return this.$reqPost(UPLOAD_TEST_CASE, data).then(rsp => rsp.data);
}

function startTestParser(appId, parserId) {
  const params = {
    userId: appId,
    parserId,
  };
  return this.$reqPost(START_TEST, params).then(rsp => rsp.data);
}

function getTestProgress(appId, parserId) {
  const params = {
    userId: appId,
    parserId,
  };
  return this.$reqPost(GET_TEST_PROGRESS, params).then(rsp => rsp.data);
}

// 在NER中注册appId
function registerNERUser(appId, appName) {
  const params = {
    userId: appId,
    userName: appName,
  };
  return this.$reqPost(REGISTER_NER_USER, params);
}

function exportTestResult(appId, parserId) {
  window.open(`${EXPORT_TEST_RESULT}/${appId}/${parserId}?random=${Math.random()}`);
}

function exportTestCase(appId, parserId) {
  window.open(`${EXPORT_TEST_CASE}/${appId}/${parserId}?random=${Math.random()}`);
}

function downloadCorpusTemplUrl() {
  window.open(`${GET_CORPUS_TEMPLATE}?random=${Math.random()}`);
}

function downloadNERWordBankTemplate() {
  window.open(`${DOWNLOAD_NER_WB_TEMPLATE}?random=${Math.random()}`);
}

function getTestCaseTemplate(appId, parserId) {
  window.open(`${GET_NER_TEST_TEMPLATE}/${appId}/${parserId}?random=${Math.random()}`);
}

function exportParserCorpus(appId, parserId, parserName, versionType = 'current') {
  window.open(`${EXPORT_CORPUS}/${appId}/${parserId}/${parserName}/${versionType}?randoem=${Math.random()}`);
}

function getParserLibraryList() {
  return this.$reqGet(PARSER_LIBRARY).then(rsp => rsp.data);
}

function singleTestParser(userId, parserId, query) {
  const params = {
    userId,
    parserId,
    query,
  };
  return this.$reqPost(SINGLE_TEST_PARSER, params).then(rsp => rsp.data);
}

export default {
  getCustomParserList,
  createCustomParser,
  deleteCustomParser,
  updateCustomParser,
  trainCustomParser,
  getCustomParser,
  downloadCorpusTemplUrl,
  getGeneralParserList,
  uploadNERCorpusFile,
  getWordBankList,
  uploadWordBank,
  downloadNERWordBankTemplate,
  getParserTestData,
  getTestCaseTemplate,
  uploadNERTestCase,
  startTestParser,
  getTestProgress,
  exportTestCase,
  exportTestResult,
  registerNERUser,
  exportParserCorpus,
  deleteWordBank,
  getWBWordsList,
  getParserLibraryList,
  singleTestParser,
};
