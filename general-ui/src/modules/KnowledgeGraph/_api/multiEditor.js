import qs from 'qs';
// 答案编辑
const QUERY_TREE_LIST = '/adm/ml/catalog/query';
const QUERY_MATERIAL_LIST = '/adm/ml/material/query';
const UPLOAD_FILE = '/adm/ml/material/add';
const UPLOADIMG_URL = '/dal/upload';
// 上传单张图片
function axiosUploadImg(appId, userId, blob, filename, fnsuccess, fnerror) {
  const formData = new FormData();
  formData.append('appid', appId);
  formData.append('userid', userId);
  formData.append('filename', blob, filename);
  return this.$reqPost(UPLOADIMG_URL, formData).then((res) => {
    if (res.error_code >= 0) {
      if (fnsuccess) {
        fnsuccess(res.data);
      }
    } else if (fnerror) {
      fnerror();
    }
  }).catch(() => {
    if (fnerror) {
      fnerror();
    }
  });
}

// 获取树形
function fetchTree() {
  return this.$reqPost(QUERY_TREE_LIST).then(res => res.data);
}

// 获取素材
function queryMaterialList(params) {
  const temp = qs.stringify(params);
  return this.$reqPost(`${QUERY_MATERIAL_LIST}?${temp}`).then(res => res.data);
}

function uploadMaterial(file, usermane, id) {
  const data = new FormData();
  data.append('file', file);
  data.append('catalog_id', id);
  data.append('upload_user', usermane);
  return this.$reqPost(UPLOAD_FILE, data).then(res => res.data);
}

export default {
  axiosUploadImg,
  fetchTree,
  queryMaterialList,
  uploadMaterial,
};
