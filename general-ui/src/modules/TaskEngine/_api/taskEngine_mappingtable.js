// import config from '@/modules/TaskEngine/_utils/config';

// const UPLOAD_PATH = '/php/api/ApiKey/mapping_table_upload.php';
const LIST_PATH = '/php/api/ApiKey/mapping_table_list.php';
// const DEL_PATH = '/php/api/ApiKey/mapping_table_delete.php';
// const DOWNLOAD_PATH = '/php/api/ApiKey/mapping_table_download.php';

export default {
  // uploadMapping(appid, file) {
  //   if (!file) {
  //     return new Promise((resolve, reject) => {
  //       setTimeout(() => {
  //         reject('Empty file');
  //       }, 0);
  //     });
  //   } else if (file.size <= 0 || file.size > config.MaximumFileSize) {
  //     return new Promise((resolve, reject) => {
  //       setTimeout(() => {
  //         reject('File size need more than 0, less than 2MB');
  //       }, 0);
  //     });
  //   }
  //
  //   const data = new FormData();
  //   data.append('appid', appid);
  //   data.append('mapping_table', file);
  //
  //   return this.$reqPost(UPLOAD_PATH, data);
  // },
  // getMappingList() {
  //   return this.$reqGet(LIST_PATH);
  // },
  // getTemplateMappingList() {
  //   return this.$reqGet(`${LIST_PATH}?user=templateadmin`);
  // },
  getMappingList(appid) {
    const url = `${LIST_PATH}?moduleName=taskengine&appid=${appid}`;
    return this.$reqGet(url).then((result) => {
      const topCatalogId = result.data.topCatalogId;
      const data = {};
      if (result.data && result.data.data) {
        data.data = result.data.data.filter(item => item.pid.toString() === topCatalogId)
          .map(item => item.displayName);
      } else {
        data.data = [];
      }
      return data;
    }, (err) => {
      // this.$notifyFail(`getMappingList failed, error:${err.message}`);
      this.$message({
        message: `getMappingList failed, error:${err.message}`,
        type: 'error',
        showClose: true,
      });
      return { data: [] };
    });
  },
  getTemplateMappingList() {
    const url = `${LIST_PATH}?moduleName=taskengine&appid=templateadmin`;
    // const url = `${LIST_PATH}?moduleName=taskengine&appid=cb7e0302b8f64eb38e84e4240789cc9a`;
    return this.$reqGet(url).then((result) => {
      const topCatalogId = result.data.topCatalogId;
      const data = {};
      if (result.data && result.data.data) {
        data.data = result.data.data.filter(item => item.pid.toString() === topCatalogId)
          .map(item => item.displayName);
      } else {
        data.data = [];
      }
      return data;
    }, (err) => {
      // this.$notifyFail(`getMappingList failed, error:${err.message}`);
      this.$message({
        message: `getMappingList failed, error:${err.message}`,
        type: 'error',
        showClose: true,
      });
      return { data: [] };
    });
  },
  // deleteMappingList(tableName) {
  //   const params = new URLSearchParams();
  //   params.append('table_name', tableName);
  //
  //   return this.$reqPost(DEL_PATH, params, {
  //     headers: {
  //       'Content-Type': 'application/x-www-form-urlencoded',
  //     },
  //   }).then(resp => resp.data);
  // },
  // downloadMappingList(tableName, user) {
  //   if (user === 'templateadmin') {
  //     return this.$reqGet(`${DOWNLOAD_PATH}?mapping_table_name=${tableName}&user=templateadmin`);
  //   }
  //   return this.$reqGet(`${DOWNLOAD_PATH}?mapping_table_name=${tableName}`);
  // },
};
