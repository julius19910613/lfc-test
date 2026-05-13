const APILIST = '/adapter/v1/outerApi/paging';
const INNERLIST = '/adapter/v1/innerApi/paging';
const DELETEINNER = '/adapter/v1/innerApi';
const ADDINNERAPI = '/adapter/v1/innerApi';
const UPDATEINNERAPI = '/adapter/v1/innerApi';
const FETCHOUTERAPI = '/adapter/v1/outerApi';

function fetchApiList(page, pageSize) {
  return this.$reqGet(`${APILIST}?page=${page}&page_size=${pageSize}`).then(res => res.data);
}

function fetchInnerList(page, pageSize) {
  return this.$reqGet(`${INNERLIST}?page=${page}&page_size=${pageSize}`).then(res => res.data);
}

function deleteInner(id) {
  return this.$reqPost(`${DELETEINNER}/${id}/delete`).then(res => res.data);
}

function addInnerApi(params) {
  return this.$reqPost(ADDINNERAPI, params).then(res => res.data);
}

function updateInnerApi(params, id) {
  return this.$reqPost(`${UPDATEINNERAPI}/${id}/update`, params).then(res => res.data);
}

function fetchMapList(id) {
  return this.$reqGet(`${UPDATEINNERAPI}/${id}`).then(res => res.data);
}

function fetchOuterApi() {
  return this.$reqGet(FETCHOUTERAPI).then(res => res.data);
}

export default {
  fetchApiList,
  fetchInnerList,
  deleteInner,
  addInnerApi,
  updateInnerApi,
  fetchMapList,
  fetchOuterApi,
};
