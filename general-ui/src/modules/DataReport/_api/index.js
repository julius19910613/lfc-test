const WHITE_LIST = '/white_word/word/get_all_words';
const USER_LIST = '/white_word/user/get_users_info';
const BANNED_WORD_LIST = '/adm/wordbank/v2/info';
const ADD_WHITE_URL = '/white_word/word/add_word';
const EDIT_WHITE_URL = '/white_word/word/update_word';
const REMOVE_WHITE_URL = '/white_word/word/delete_word';

// 白名单 - 列表
function ApiGetWhiteList() {
  return this.$reqGet(WHITE_LIST).then(rsp => rsp.data);
}
// 用户 - 列表
function ApiGetUserList() {
  return this.$reqGet(USER_LIST).then(rsp => rsp.data);
}
// 违禁词 - 列表
function ApiGetBannedWordList(appId, keyType, keywords, catalogId,
  catalogNmae, isEffect, pageIndex, pageNumber) {
  const params = {
    appId,
    keyType,
    keywords,
    catalogId,
    catalogNmae,
    isEffect,
    pageIndex,
    pageNumber,
  };
  return this.$reqPost(BANNED_WORD_LIST, params, {
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(rsp => rsp.data);
}
// 白名单 - 新建
function ApiAddWhite(params) {
  return this.$reqPost(ADD_WHITE_URL, params, {
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(rsp => rsp.data);
}
// 白名单 - 编辑
function ApiEditWhite(params) {
  return this.$reqPut(EDIT_WHITE_URL, params, {
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(rsp => rsp.data);
}
// 白名单 - 删除
function ApiRemoveWhite() {
  return this.$reqDelete(REMOVE_WHITE_URL).then(rsp => rsp.data);
}

export default {
  ApiGetWhiteList,
  ApiGetUserList,
  ApiGetBannedWordList,
  ApiAddWhite,
  ApiEditWhite,
  ApiRemoveWhite,
};
