import qs from 'qs';

const baseURLV4 = '/auth/v4/enterprise';
const baseURLV5 = '/auth/v6/enterprise';
const baseURL = '/auth/v3/enterprise';
const BF2_ROBOT_URL = '/api/v1/bf/app';
const BF2_SSM_URL = '/api/v1/bf/ssm-data';
const ROBOT_URL = '/api/v2/robot/data';
const LANGUAGE_UEL = '/auth/v5/app_props/chat_lang';
const CCS_CONFIG_GENERATE_URL = '/ccsDal/bfopConfGenerate';
const ROBOT_EXPORT = '/capsule/export';
const IMPORT_ROBOT_FILE = '/capsule/import';
const CHECK_ROBOT_IMPORT_STATUS = '/capsule/checkimportstatus';

function getRobots(enterpriseID) {
  return this.$reqGet(`${baseURLV4}/${enterpriseID}/apps`).then(rsp => rsp.data.result);
}

function getRobot(enterpriseID, appID) {
  return this.$reqGet(`${baseURL}/${enterpriseID}/app/${appID}`).then(rsp => rsp.data);
}
function getLanguages() {
  return this.$reqGet(LANGUAGE_UEL).then(rsp => rsp);
}
function addRobot(enterpriseID, app, user) {
  let appid = '';
  return this.$reqPost(`${baseURLV5}/${enterpriseID}/app`, qs.stringify(app), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  })
  .then((rsp) => {
    appid = rsp.data.result.id;
    const option = {
      appid: rsp.data.result.id,
      userid: user,
      name: app.name,
    };
    return this.$reqPostForm(BF2_ROBOT_URL, option);
  })
  .then(() => {
    const option = {
      appid,
    };
    return this.$reqPostForm(BF2_SSM_URL, option);
  })
  .then(() => {
    const option = {
      appid,
    };
    return this.$reqPostForm(ROBOT_URL, option);
  })
  .then(() => this.$reqPost(CCS_CONFIG_GENERATE_URL, {
    ccsId: appid, appId: appid,
  }))
          .then((rs) => {
            const configId = rs.data.data;
            return this.$reqPost(`/ccsDal/ccsConf/${appid}/activate`, { id: configId });
          });
}
function updateRobot(enterpriseID, appID, app) {
  let rspData;
  return this.$reqPutForm(`${baseURL}/${enterpriseID}/app/${appID}`, app)
  .then((rsp) => {
    rspData = rsp.data;
    return this.$reqPatchForm(`${BF2_ROBOT_URL}/${appID}`, app);
  })
  .then(() => rspData);
}
function deleteRobot(enterpriseID, appID, reason) {
  return this.$reqDelete(`${baseURL}/${enterpriseID}/app/${appID}?reason=${reason}`).then(rsp => this.$reqDelete(`${BF2_ROBOT_URL}/${appID}`)
    .catch((err) => {
      console.log(err);
    }).then(() => rsp.data));
}

function exportRobot(params) {
  return this.$reqPostBlob(ROBOT_EXPORT, params).then(res => res);
}

function importRobotFile(file) {
  const data = new FormData();
  data.append('file', file);
  return this.$reqPost(IMPORT_ROBOT_FILE, data).then(res => res.data);
}

function checkImportStatus(params) {
  return this.$reqPost(CHECK_ROBOT_IMPORT_STATUS, params).then(res => res.data);
}

export default {
  getRobots,
  getRobot,
  addRobot,
  updateRobot,
  deleteRobot,
  getLanguages,
  exportRobot,
  importRobotFile,
  checkImportStatus,
};
