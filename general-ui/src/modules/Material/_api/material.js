import qs from 'qs';

const QUERY_TREE_LIST = '/adm/ml/catalog/query';
const ADD_NODE = '/adm/ml/catalog/add';
const UPDATE_NODE = '/adm/ml/catalog/update';
const DELETE_NODE = '/adm/ml/catalog/delete';
const QUERY_MATERIAL_LIST = '/adm/ml/material/query';
const DELETE_MATERIAL = '/adm/ml/material/delete';
const UPLOAD_FILE = '/adm/ml/material/add';
const REMOVE_MATERIAL = '/adm/ml/material/move';


function fetchTree() {
  return this.$reqPost(QUERY_TREE_LIST).then(res => res.data);
}

function addNode(params) {
  return this.$reqPost(ADD_NODE, qs.stringify(params)).then(res => res.data);
}

function updateNode(params) {
  return this.$reqPost(UPDATE_NODE, qs.stringify(params)).then(res => res.data);
}

function deleteNode(params) {
  return this.$reqPost(DELETE_NODE, qs.stringify(params)).then(res => res.data);
}

function quertMaterialList(params) {
  return this.$reqPost(QUERY_MATERIAL_LIST, qs.stringify(params)).then(res => res.data);
}

function previewImage(link) {
  return this.$reqGetBlob(`/adm/${link}`).then(res => res);
}

function deleteMaterial(params) {
  return this.$reqPost(DELETE_MATERIAL, qs.stringify(params)).then(res => res.data);
}

function downMaterial(params) {
  return this.$reqGet(params).then(res => res.data);
}

function uploadFile(file, usermane, id) {
  const data = new FormData();
  data.append('file', file);
  data.append('catalog_id', id);
  data.append('upload_user', usermane);
  return this.$reqPost(UPLOAD_FILE, data).then(res => res.data);
}

function removeMaterial(params) {
  return this.$reqPost(REMOVE_MATERIAL, qs.stringify(params)).then(res => res.data);
}

function fetchMaterialIcon(link) {
  return this.$reqGetBlob(`/adm/ml${link}`).then(res => res);
}

export default {
  fetchTree,
  addNode,
  updateNode,
  deleteNode,
  quertMaterialList,
  previewImage,
  deleteMaterial,
  downMaterial,
  uploadFile,
  removeMaterial,
  fetchMaterialIcon,
};
