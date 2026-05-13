const FETCH_SKILL_LIST = '/adm/skill/list';
const SET_STATUS = '/adm/skill/update';
const MAP_LIST = '/adm/skill/category';
const ICON_BASE64 = '/adm/skill/icon';

function fetchList(appId, categoryId, query) {
  return this.$reqGet(`${FETCH_SKILL_LIST}/${appId}?categoryId=${categoryId}&query=${query}`).then(res => res.data);
}

function setStatus(appId, skillId, enabled) {
  return this.$reqPost(`${SET_STATUS}/${appId}/${skillId}/${enabled}`).then(res => res.data);
}

function fetchMapList() {
  return this.$reqGet(`${MAP_LIST}`).then(res => res.data);
}

function fetchIocn(id) {
  return this.$reqGet(`${ICON_BASE64}/${id}`).then(res => res.data);
}

export default {
  fetchList,
  setStatus,
  fetchMapList,
  fetchIocn,
};

