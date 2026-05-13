const LICENSE_URL = '/api/v2/system/license';
const GENERATE_CODE = '/localAuth/v3/getApplyFile';
const UPLOAD_LICENSE = '/localAuth/v3/uploadLicense';
const FETCH_DETAIL = '/api/v2/system/license/paramused';

function getLicenseInfo() {
  return this.$reqGet(LICENSE_URL).then(rsp => rsp.data);
}

function getLicenseDetail() {
  return this.$reqGet(FETCH_DETAIL).then(rsp => rsp.data);
  // return this.$reqGet(`${LICENSE_URL}/true`).then(rsp => rsp.data);
}

function generateCode(param) {
  return this.$reqPost(GENERATE_CODE, param).then(rsp => rsp.data);
}

function uploadLicense(file) {
  const data = new FormData();
  data.append('file', file);
  return this.$reqPost(UPLOAD_LICENSE, data).then(rsp => rsp.data);
}

export default {
  getLicenseInfo,
  getLicenseDetail,
  generateCode,
  uploadLicense,
};
