const OPTIONDATALIST = '/option/data-sequence';
const BULKDELETE = '/option/bulk/data-sequence';
const SEARCHSEQUENCE = '/option/field-sequence';
const SEARCHBULKDELETE = '/option/bulk/field-sequence';
const Q_URL = '/q';
const UNIONPAY = '/unionpay';


function getdataSortingList(page, pageSize) {
  return this.$reqGet(`${OPTIONDATALIST}/${page}/${pageSize}`).then(res => res.data);
}

function addDataSortItem(item) {
  return this.$reqPost(OPTIONDATALIST, item);
}

function editDataSortItem(item, id) {
  return this.$reqPut(`${OPTIONDATALIST}/${id}`, item);
}

function deleteOneData(id) {
  return this.$reqDelete(`${OPTIONDATALIST}/${id}`);
}

function DataBulkDelete(ids) {
  const params = {
    ids,
  };
  return this.$reqDelete(BULKDELETE, {}, params);
}

function getSearchSortingList(page, pageSize) {
  return this.$reqGet(`${SEARCHSEQUENCE}/${page}/${pageSize}`).then(res => res.data);
}

function addSearchSortItem(item) {
  return this.$reqPost(SEARCHSEQUENCE, item);
}

function editSearchSortItem(item, id) {
  return this.$reqPut(`${SEARCHSEQUENCE}/${id}`, item);
}

function deleteSearchOneData(id) {
  return this.$reqDelete(`${SEARCHSEQUENCE}/${id}`);
}

function SearchDataBulkDelete(ids) {
  const params = {
    ids,
  };
  return this.$reqDelete(SEARCHBULKDELETE, {}, params);
}

function getAllDataList(params) {
  return this.$reqPost(Q_URL, params);
}

function filterSearch(pageNum, pageSize, keyword) {
  return this.$reqGet(`${OPTIONDATALIST}/keyword?pageNum=${pageNum}&pageSize=${pageSize}&keyword=${keyword}`)
    .then(res => res.data);
}
function deleteSearcManageData(id) {
  return this.$reqDelete(`${UNIONPAY}?itemId=${id}`);
}

function editSearchManage(item) {
  return this.$reqPut(`${UNIONPAY}`, item);
}

export default {
  getdataSortingList,
  addDataSortItem,
  editDataSortItem,
  deleteOneData,
  DataBulkDelete,
  getSearchSortingList,
  addSearchSortItem,
  editSearchSortItem,
  deleteSearchOneData,
  SearchDataBulkDelete,
  getAllDataList,
  filterSearch,
  deleteSearcManageData,
  editSearchManage,
};
