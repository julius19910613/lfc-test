const STATS_VISIT_URI = '/faq/ssm/dac/common/stat';
const INDENT = '/api/v2/intents/intents';
const TDE = '/php/api/ApiKey/task_engine_app.php';
const TE = '/tode/tde/tasksinfo';
const SKILL = '/api/v2/robot/functions';
const SKILL_1 = '/adm/skill/list';
const KG = '/xeonKgDal/entityProfile';
const KG_TOTAL = '/xeonKgDal';
const VISIT = '/api/v1/stats/visit';
const requestID = 'statistics';
const FECTH_DIMENSION_LIST = '/adm/system/dimensionlist';
const STATS_QUESTION2_URI = '/api/v1/stats/question';
const SSM = '/faq/ssm/dac/common/stat';
const TEVISIT = '/api/v1/stats/teVisit';
const AVG_RATING = '/api/v1/stats/sessions/rating';

function getFaqNum(appid, userid, time) {
  return this.$reqGet(`${STATS_VISIT_URI}?_=${time}`, {
    headers: {
      app_id: appid,
      user_id: userid,
    },
  }).then(rsp => rsp.data.data);
}

function getIntentNum() {
  return this.$reqGet(`${INDENT}`).then(rsp => rsp.data.result);
}

function getTdeNum(appid) {
  return this.$reqGet(`${TDE}?appid=${appid}`).then(rsp => rsp.data.msg);
}

function getTeNum(appid) {
  return this.$reqGet(`${TE}/${appid}`).then(rsp => rsp.data.data);
}

function getSkillNum() {
  return this.$reqGet(`${SKILL}`).then(rsp => rsp.data.result);
}

function getSkillfNum(appid) {
  return this.$reqGet(`${SKILL_1}/${appid}?categoryId=0&query=`).then(rsp => rsp.data.result);
}

function getVisitStats(params) {
  if (!params.days || !params.type || ['time', 'barchart'].indexOf(params.type) === -1) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error('Parameter error'));
      }, 0);
    });
  }

  return this.$reqGet(`${VISIT}`, {
    params,
  }, {
    // cancelToken: source.token,
    requestId: requestID,
    timeout: 3000,
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((data) => {
    const res = data.data;
    return res;
  });
}

function fetchDimensionList(appid) {
  return this.$reqGet(`${FECTH_DIMENSION_LIST}/${appid}`).then((rsp) => {
    const ret = rsp.data.result.map(category => ({
      value: category.id,
      label: category.name,
      values: category.list.map(value => ({
        tagId: value.id,
        id: value.id,
        text: value.name,
      })),
    }));
    // sort by type id
    ret.sort((a, b) => (a.id - b.id));
    return ret.filter(r => r.values.length > 0);
  });
}

function getTopQuestions2(params) {
  if (!params.days || !params.type || ['top', 'unused', 'unsolved'].indexOf(params.type) === -1) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error('Parameter error'));
      }, 0);
    });
  }

  return this.$reqGet(`${STATS_QUESTION2_URI}`, {
    params,
  }, {
    // cancelToken: source.token,
    requestId: requestID,
    timeout: 3000,
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((data) => {
    const res = data.data;
    res.data = res.data.filter(d => d.question !== '');
    return res;
  });
}

function getKgNum(appid) {
  return this.$reqGet(`${KG}/${appid}/showEntityProfileDetail/0?page=1&entityTreeKeyword=&entityListKeyword=`).then(rsp => rsp.data);
}

function getKgTotalNum(appid) {
  return this.$reqGet(`${KG_TOTAL}/${appid}/property/allCommon`).then(rsp => rsp.data.data);
}

function getSsmNum(appid, userid, time) {
  return this.$reqGet(`${SSM}?_=${time}`, {
    headers: {
      app_id: appid,
      user_id: userid,
    },
  }).then(rsp => rsp.data.data);
}

function getTeVisit(params) {
  return this.$reqGet(`${TEVISIT}`, {
    params,
  }).then((data) => {
    const res = data.data;
    return res;
  });
}

function getRating(params) {
  return this.$reqPost(`${AVG_RATING}`, {
    params,
  }).then((data) => {
    const res = data.data;
    return res;
  });
}

export default {
  getFaqNum,
  getIntentNum,
  getTdeNum,
  getTeNum,
  getSkillNum,
  getSkillfNum,
  getVisitStats,
  fetchDimensionList,
  getTopQuestions2,
  getKgNum,
  getKgTotalNum,
  getSsmNum,
  getTeVisit,
  getRating,
};
