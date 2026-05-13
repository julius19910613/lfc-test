const PUBLIC_API_GET_URL = '/adapter/v1/outerApi/paging';
const PUBLIC_API_COPY_URL = '/adapter/v1/outerApi/copy';
const PUBLIC_API_URL = '/adapter/v1/outerApi';

function getPublicAPI(page, limit) {
  return this.$reqGet(`${PUBLIC_API_GET_URL}?page=${page}&page_size=${limit}`).then(res => res.data);
}

function copyAPI(id) {
  const param = {
    id,
  };
  return this.$reqPost(PUBLIC_API_COPY_URL, param).then(res => res.data);
}

function deleteAPI(id) {
  return this.$reqPost(`${PUBLIC_API_URL}/${id}/delete`).then(res => res.data);
}

function getPublicAPIDetail(id) {
  return this.$reqGet(`${PUBLIC_API_URL}/${id}`).then(res => res.data);
}

function addAPI(params) {
  return this.$reqPost(PUBLIC_API_URL, params).then(res => res.data);
}

function updateAPI(id, params) {
  return this.$reqPost(`${PUBLIC_API_URL}/${id}/update`, params).then(res => res.data);
}

export default {
  getPublicAPI,
  copyAPI,
  deleteAPI,
  getPublicAPIDetail,
  addAPI,
  updateAPI,
};
