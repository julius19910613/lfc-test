// import qs from 'qs';

const WORDBANK_LIST = '/adm/wordbank/v2/info';
const WORDBANK_V2 = '/adm/wordbank/v2';
const SIMILAR_WORD = '/adm/wordbank/v2/similar';
const WORDBANK_HISTORY = '/adm/wordbank/v2/uploadHistory/gainUploadHistory';
const WORDBANK_IMPORT = '/adm/wordbank/v2/uploadHistory/uploadFile';
const WORDBANK_STATUS = '/adm/wordbank/v2/subject';
const WB_TEMPLATE_CN = '/adm/wordbank/v2/importTemplate/chineseSimplifiedVersion';
const WB_TEMPLATE_TW = '/adm/wordbank/v2/importTemplate/chineseTraditionalVersion';
const WB_HISTORY_FILE = '/adm/wordbank/v2/uploadHistory/downloadOriginImportFile';
const WB_DOWNLOAD_CURRENT = '/adm/wordbank/v2/export';
const WB_DOWNLOAD_ERROR_REPORT = '/adm/wordbank/v2/uploadHistory/downloadErrorReportFile?errorReportFile=';

function downloadWBTemplate(lan) {
  window.open(lan === 'zh-cn' ? WB_TEMPLATE_CN : WB_TEMPLATE_TW);
}

function downloadWBHistoryFile(id) {
  window.open(`${WB_HISTORY_FILE}?id=${id}`);
}

function downloadWBCurrent(appId, lang) {
  window.open(`${WB_DOWNLOAD_CURRENT}?locale=${lang}&appid=${appId}`);
}

function downloadWBError(documentStore) {
  window.open(`${WB_DOWNLOAD_ERROR_REPORT}${documentStore}`);
}

// 主词 - 列表
function getWordBankList(appId, keyType, keywords, catalogId,
  catalogNmae, isEffect, pageIndex, pageNumber) {
  const param = {
    appId,
    keyType,
    keywords,
    catalogId,
    catalogNmae,
    isEffect,
    pageIndex,
    pageNumber,
  };
  return this.$reqPost(WORDBANK_LIST, param, {
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(rsp => rsp.data);
}

// 主词 - 增
function apiAddWordbank(appId, cid, effect, spell, name, similarInfos, answer) {
  const params = {
    appId,
    cid,
    effect,
    spell,
    name,
    similarInfos,
    answer,
  };
  // const params = Object.assign({}, wordbank);
  // params.appId = appId;
  return this.$reqPost(WORDBANK_V2, params).then(rsp => rsp.data);
}

// 主词 - 改
function apiUpdateWordbank(appId, id, cid, name, effect, spell, answer) {
  const params = {
    appId,
    id,
    cid,
    name,
    effect,
    spell,
    answer,
  };
  return this.$reqPut(WORDBANK_V2, params).then(rsp => rsp.data);
}

// 主词 - 删除
function apiBatchDeleteWordbank(appId, idArr, nameArr) {
  const params = {
    appId,
    ids: idArr,
    names: nameArr,
  };
  return this.$reqDelete(WORDBANK_V2, {}, params).then(rsp => rsp.data);
}

// 主词 - 批量启用/ 停用
function apiBatchUpdateWordbank(appId, ids, beffect, names) {
  const params = {
    appId,
    ids,
    beffect,
    names,
  };
  return this.$reqPut(WORDBANK_STATUS, params).then(rsp => rsp.data);
}

// 主词 - 移动目录
function apiMoveWordbank(appId, categoryId, idArr, nameArr) {
  const params = {
    appId,
    cid: categoryId,
    ids: idArr,
    names: nameArr,
  };
  return this.$reqPut(`${WORDBANK_V2}/move`, params).then(rsp => rsp.data);
}

// 同义词 - 增
function apiAddSimilarWord(appId, pid, name, spell) {
  const params = {
    appId,
    pid,
    name,
    spell,
  };
  return this.$reqPost(SIMILAR_WORD, params).then(rsp => rsp.data);
}

// 同义词 - 改
function apiUpdateSimilarWord(appId, pid, id, name, spell) {
  const params = {
    appId,
    pid,
    id,
    name,
    spell,
  };
  return this.$reqPut(SIMILAR_WORD, params).then(rsp => rsp.data);
}

// 同义词 - 批量修改拼音纠错
function apiBatchUpdateSynWords(appId, ids, spell) {
  const params = {
    appId,
    ids,
    spell,
  };
  return this.$reqPut(`${SIMILAR_WORD}/spell`, params).then(rsp => rsp.data);
}

// 同义词 - 批量删除
function apiBatchDeleteSynWords(appId, ids, names) {
  const params = {
    appId,
    ids,
    names,
  };
  return this.$reqDelete(SIMILAR_WORD, {}, params).then(rsp => rsp.data);
}

// 目录 - 增
function apiAddCategory(appId, pid, name) {
  const params = {
    appId,
    pid,
    name,
  };
  return this.$reqPost(`${WORDBANK_V2}/catalog`, params).then(rsp => rsp.data);
}

// 目录 - 改
function apiUpdateCategory(appId, id, name) {
  const params = {
    appId,
    id,
    name,
  };
  return this.$reqPut(`${WORDBANK_V2}/catalog`, params).then(rsp => rsp.data);
}

// 目录 - 删除
function apiDeleteCategory(appId, id) {
  const params = {
    appId,
    id,
  };
  return this.$reqDelete(`${WORDBANK_V2}/catalog`, {}, params).then(rsp => rsp.data);
}

function apiGetWBHistory(appId) {
  return this.$reqGet(`${WORDBANK_HISTORY}?appId=${appId}`).then(rsp => rsp.data);
}

function apiImportWordbank(appid, file, uploadType) {
  const data = new FormData();
  data.append('file', file);
  data.append('appid', appid);
  data.append('uploadType', uploadType);
  return this.$reqPost(WORDBANK_IMPORT, data).then(rsp => rsp.data);
}

export default {
  downloadWBTemplate,
  downloadWBHistoryFile,
  downloadWBCurrent,
  downloadWBError,
  getWordBankList, // list字段和其他不一样
  apiAddWordbank, // 增加了不work
  apiUpdateWordbank,
  apiBatchDeleteWordbank,
  apiMoveWordbank,
  apiBatchUpdateWordbank,
  apiAddSimilarWord,
  apiUpdateSimilarWord,
  apiBatchDeleteSynWords,
  apiBatchUpdateSynWords,
  apiAddCategory,
  apiUpdateCategory,
  apiDeleteCategory,
  apiGetWBHistory,
  apiImportWordbank,
};
