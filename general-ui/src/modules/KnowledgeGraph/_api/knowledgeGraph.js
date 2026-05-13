const DOWNLOAD_PATH = '/api/v2/dictionary/download';
const NEW_ENTITY_PATH = '/xeonKgDal';

function getUploadFaliedInfo(robotId, fileName) {
  const param = new FormData();
  param.append('filename', fileName);
  return this.$reqPost(`${NEW_ENTITY_PATH}/${robotId}/file`, param, {
    responseType: 'arraybuffer',
  });
}

function getRootNodes(robotId, param) {
  return this.$reqGetParam(
    `${NEW_ENTITY_PATH}/entityManager/${robotId}/getAllRootEntityList/none`,
    param,
  );
}

function addRootNode(robotId, param) {
  return this.$reqPost(`${NEW_ENTITY_PATH}/entityManager/${robotId}/addEntity/root`, param);
}

function addSubNode(robotId, param) {
  return this.$reqPost(`${NEW_ENTITY_PATH}/entityManager/${robotId}/addEntity/child`, param);
}

function updateNodeName(robotId, param) {
  return this.$reqPut(
    `${NEW_ENTITY_PATH}/entityManager/${robotId}/updateEntity/${param.id}`,
    param,
  );
}

function getChildNodes(robotId, rootNodeId, param) {
  return this.$reqGetParam(
    `${NEW_ENTITY_PATH}/entityManager/${robotId}/getEntityTree/${rootNodeId}`,
    param,
  );
}

function getTestDetailInfo(taskId) {
  return this.$reqGet(`${NEW_ENTITY_PATH}/testverifyinfo/${taskId}`);
}

function getAllTestInfo(robotId) {
  return this.$reqGet(`${NEW_ENTITY_PATH}/${robotId}/testverifyinfo`);
}

function triggerKGTesting(robotId, taskId) {
  return this.$reqPost(`${NEW_ENTITY_PATH}/${robotId}/test/${taskId}`, {});
}

function getLastTestResultStatus(robotId, taskId) {
  console.log(taskId);
  return this.$reqGet(`${NEW_ENTITY_PATH}/test/${robotId}/${taskId}`);
}

function submitTestFile(file, robotId) {
  const param = new FormData();
  param.append('file', file);
  return this.$reqPost(`${NEW_ENTITY_PATH}/${robotId}/import/test_data`, param);
}

function initBuildKG(file, robotId) {
  const param = new FormData();
  param.append('file', file);
  return this.$reqPost(`${NEW_ENTITY_PATH}/${robotId}/import/all`, param);
}

// function batchUploadEntities(file, robotId = 'csbot') {
//   const param = new FormData();
//   param.append('file', file);
//   return this.$reqPost(`${NEW_ENTITY_PATH}/${robotId}/import/entity?`, param);
// }
//
// function batchUploadSpecialProperties(file, robotId = 'csbot') {
//   const param = new FormData();
//   param.append('file', file);
//   return this.$reqPost(`${NEW_ENTITY_PATH}/${robotId}/import/functional_property?`, param);
// }
//
// function batchUploadProperties(file, robotId = 'csbot') {
//   const param = new FormData();
//   param.append('file', file);
//   return this.$reqPost(`${NEW_ENTITY_PATH}/${robotId}/import/property?`, param);
// }

function getAllCommonProperties(robotId) {
  return this.$reqGet(`${NEW_ENTITY_PATH}/${robotId}/property/allCommon`);
}

// get properties by robotId
function getRobotCommonProperties(robotId, pageId = 1, keyword = '') {
  return this.$reqGet(
    `${NEW_ENTITY_PATH}/${robotId}/property/allCommon?page=${pageId}&keyword=${keyword}`,
  );
}

function getRobotExtraProperties(robotId, param) {
  return this.$reqGetParam(`${NEW_ENTITY_PATH}/${robotId}/extra/property`, param);
}

function getPropertyById(robotId, propertyId) {
  return this.$reqGet(`${NEW_ENTITY_PATH}/${robotId}/property/${propertyId}`);
}

function updateProperty(robotId, propertyId, data) {
  return this.$reqPut(`${NEW_ENTITY_PATH}/${robotId}/property/${propertyId}`, data);
}

function createProperty(robotId, data) {
  return this.$reqPost(`${NEW_ENTITY_PATH}/${robotId}/property`, data);
}

function getPropertiesOfEntity(robotId, propertyId) {
  return this.$reqGet(`${NEW_ENTITY_PATH}/${robotId}/property/${propertyId}`);
}

function getAllEntitiesByRobotId(robotId, param) {
  return this.$reqGetParam(`${NEW_ENTITY_PATH}/${robotId}/entity/all`, param, {
    ContentType: 'application/x-www-form-urlencoded;charset=UTF-8',
  });
}

function addEntityUnderRobot(robotId, param) {
  return this.$reqPost(`${NEW_ENTITY_PATH}/${robotId}/entity`, param);
}

function deleteEntityUnderRobot(robotId, entityId) {
  return this.$reqDelete(`${NEW_ENTITY_PATH}/entityManager/${robotId}/deleteEntity/${entityId}`);
}

function updateEntityUnderRobot(robotId, entityId, param) {
  return this.$reqPut(`${NEW_ENTITY_PATH}/${robotId}/entity/${entityId}`, param);
}

function deletePropertyUnderRobot(robotId, propertyId) {
  return this.$reqDelete(`${NEW_ENTITY_PATH}/${robotId}/property/${propertyId}`);
}

function getEntityByEntityId(robotId, entityId) {
  return this.$reqGet(`${NEW_ENTITY_PATH}/${robotId}/entity/${entityId}`);
}

function addSingleSpeechUnderEntity(robotId, param) {
  return this.$reqPost(`${NEW_ENTITY_PATH}/${robotId}/speech`, param);
}

function getV3Data(robotId) {
  return this.$reqGet(`${NEW_ENTITY_PATH}/${robotId}/visualizer`);
}

function triggerTraining(robotId) {
  return this.$reqGet(`${NEW_ENTITY_PATH}/${robotId}/ftTrainTrigger?env=sandbox`);
}

function checkTrainingStatus(robotId, taskId) {
  return this.$reqGet(`${NEW_ENTITY_PATH}/${robotId}/ftTrainResult/${taskId}`);
}

function getPropertyTypes(robotId) {
  return this.$reqGet(`${NEW_ENTITY_PATH}/${robotId}/type`);
}

function addSynonyms(robotId, sourceId, type, param) {
  return this.$reqPost(
    `${NEW_ENTITY_PATH}/synonym/${robotId}/addSynonym/${sourceId}?type=${type}`,
    param,
  );
}

function updateSynonyms(robotId, type, param) {
  return this.$reqPut(
    `${NEW_ENTITY_PATH}/synonym/${robotId}/updateSynonym/${param.id}?type=${type}`,
    param,
  );
}

function deleteSynoyms(robotId, itemId, type) {
  return this.$reqDelete(
    `${NEW_ENTITY_PATH}/synonym/${robotId}/deleteSynonym/${itemId}?type=${type}`,
  );
}

function syncDataAfterTest(robotId) {
  return this.$reqGet(`/api/v1/kbqa/syncData?appid=${robotId}`);
}

function batchUploadTemplate() {
  // 获取当前浏览器语言
  let lang = localStorage.getItem('locale');

  if (!lang) {
    lang = navigator.language || navigator.userLanguage;
    lang = lang.substr(0, 6);
  }
  if (!lang) {
    lang = 'zh-cn';
  }
  const param = {
    lang: lang.toLowerCase(),
  };

  return this.$reqGetParam(`${NEW_ENTITY_PATH}/template/data`, param, { responseType: 'arraybuffer' });
}

function TestFileTemplate() {
  // 获取当前浏览器语言
  let lang = localStorage.getItem('locale');

  if (!lang) {
    lang = navigator.language || navigator.userLanguage;
    lang = lang.substr(0, 6);
  }
  if (!lang) {
    lang = 'zh-cn';
  }
  const param = {
    lang: lang.toLowerCase(),
  };
  return this.$reqGetParam(`${NEW_ENTITY_PATH}/template/test`, param, { responseType: 'arraybuffer' });
}

function getSynonym(robotId, param) {
  return this.$reqGetParam(`${NEW_ENTITY_PATH}/synonym/${robotId}/showSynonym`, param, {
    ContentType: 'application/x-www-form-urlencoded;charset=UTF-8',
  });
}

function getEntityPropertyValues(robotId, entityId) {
  return this.$reqGet(
    `${NEW_ENTITY_PATH}/relation/${robotId}/getRelationsByRootEntity/${entityId}`,
  );
}

function getSandBoxStatus(robotId) {
  return this.$reqGet(`${NEW_ENTITY_PATH}/${robotId}/checkSandboxModify`);
}

function syncSandBoxSettings(robotId) {
  return this.$reqPost(`${NEW_ENTITY_PATH}/${robotId}/synchronizeSandbox`, {});
}

function withdrawSandBoxSettings(robotId) {
  return this.$reqPost(`${NEW_ENTITY_PATH}/${robotId}/withdrawSandbox`, {});
}

function addPropertyValue(robotId, param) {
  return this.$reqPost(`${NEW_ENTITY_PATH}/relation/${robotId}/addRelation`, param);
}

function updatePropertyValue(robotId, param) {
  return this.$reqPut(`${NEW_ENTITY_PATH}/relation/${robotId}/updateRelation`, param);
}
function deletePropertyValue(robotId, param) {
  return this.$reqDeleteParam(`${NEW_ENTITY_PATH}/relation/${robotId}/deleteRelations`, param);
}

function getSlotTypes() {
  return this.$reqGet(`${NEW_ENTITY_PATH}/slotType/all`);
}

// 获取所有Keyword值with同义词列表
function getAllSynonymKeywordInfo(robotId) {
  return this.$reqGet(`${NEW_ENTITY_PATH}/propertyKeyword/${robotId}?target=getAll`);
}

// 添加keyword同义词信息
function addKeywordSynonym(robotId, param) {
  return this.$reqPost(`${NEW_ENTITY_PATH}/propertyKeyword/${robotId}/addKeywordSynonym`, param);
}

// 更新keyword同义词信息
function updateKeywordSynonym(robotId, param) {
  return this.$reqPut(`${NEW_ENTITY_PATH}/propertyKeyword/${robotId}/updateKeywordSynonym`, param);
}

// 删除Keyword值以及同义词
function deleteKeywordSynonym(robotId, param) {
  return this.$reqDeleteParam(
    `${NEW_ENTITY_PATH}/propertyKeyword/${robotId}/deleteKeywordSynonym`,
    param,
  );
}

function addKeyWordSynonyms(robotId, param) {
  return this.$reqPost(`${NEW_ENTITY_PATH}/propertyKeyword/${robotId}/addKeywordSynonym`, param);
}

// function deleteKeyWordSynonyms(robotId, param) {
//   return this.$reqDelete(`${NEW_ENTITY_PATH}
//   /propertyKeyword/${robotId}/deleteKeywordSynonym`, param);
// }

function getEntityProfile(robotId, entityId) {
  return this.$reqGet(`${NEW_ENTITY_PATH}/entityProfile/${robotId}/showEntityProfile/${entityId}`);
}

function updateEntityProfile(robotId, entityId, param) {
  return this.$reqPut(
    `${NEW_ENTITY_PATH}/entityProfile/${robotId}/updateEntityProfile/${entityId}`,
    param,
  );
}

function createEntityProfile(robotId, entityId, param) {
  return this.$reqPost(
    `${NEW_ENTITY_PATH}/entityProfile/${robotId}/addEntityProfile/${entityId}`,
    param,
  );
}

function getPropertyRelatedProperties(robotId, propertyId) {
  return this.$reqGet(`${NEW_ENTITY_PATH}/property/${robotId}/relatedProperty/${propertyId}`);
}

function getPropertyRelatedValues(robotId, propertyId) {
  return this.$reqGet(`${NEW_ENTITY_PATH}/property/${robotId}/relatedValue/${propertyId}`);
}

function updatePropertyIntroduction(robotId, param) {
  return this.$reqPost(`${NEW_ENTITY_PATH}/${robotId}/property/desc`, param);
}

// 获取补充自定义属性列表
function getExtraPropertyList(robotId, { page, keyword, limit }) {
  return this.$reqGet(`${NEW_ENTITY_PATH}/extraPropertyManager/${robotId}/getAll?page=${page}&keyword=${keyword}&limit=${limit}`);
}

// 编辑补充自定义属性列表
function updateExtraProperty(robotId, param) {
  // return this.$reqPut(`${NEW_ENTITY_PATH}/${robotId}/extra/property`, param); // 更新为同新增接口
  return this.$reqPost(`${NEW_ENTITY_PATH}/extraPropertyManager/${robotId}/update`, param);
}
// 新增补充自定义属性列表
function addExtraProperty(robotId, param) {
  return this.$reqPost(`${NEW_ENTITY_PATH}/extraPropertyManager/${robotId}/update`, param);
}
// 删除补充自定义属性列表
function deleteExtraProperty(robotId, propertyId) {
  return this.$reqPost(`${NEW_ENTITY_PATH}/extraPropertyManager/${robotId}/delete`, { propertyId });
}

function checkReapeatEntityName(robotId, entityName, entityId, entityType = '1') {
  return this.$reqGet(
    `${NEW_ENTITY_PATH}/entityManager/${robotId}/checkRepeat/entity?entityName=${entityName}
    &entityId=${entityId}&entityType=${entityType}`,
  );
}

function ExportKGFile(robotId) {
  return this.$reqGet(`${NEW_ENTITY_PATH}/${robotId}/exportData`, {
    responseType: 'arraybuffer',
  });
}

function GetDataOverviewPropertyValues(robotId, entityId, param) {
  return this.$reqGetParam(
    `${NEW_ENTITY_PATH}/relation/${robotId}/getDataOverViewRelationByRootEntity/${entityId}`,
    param,
  );
}

function GetEntityListData(robotId, entityId, param) {
  return this.$reqGetParam(
    `${NEW_ENTITY_PATH}/entityProfile/${robotId}/showEntityProfileDetail/${entityId}`,
    param,
  );
}

// 新增/编辑属性时候检测属性名称是否重复
function onCheckNameRepeat(robotId, param) {
  return this.$reqGetParam(`${NEW_ENTITY_PATH}/property/${robotId}/checkRepeatName`, param);
}

// 根据属性ID找相关实体
function getRelatedEntitiesByPropertyId(robotId, propertyId, key, limit = 10) {
  return this.$reqGetParam(
    `${NEW_ENTITY_PATH}/introductionManager/${robotId}/property/getRelatedEntities/${propertyId}?keyword=${key}&limit=${limit}`,
  );
}

// 根据实体ID找相关属性
function getRelatedPropertiesByEntityId(robotId, entityId, key, limit = 10) {
  return this.$reqGetParam(
    `${NEW_ENTITY_PATH}/introductionManager/${robotId}/entity/getRelatedProperties/${entityId}?keyword=${key}&limit=${limit}`,
  );
}

// 根据实体ID找相关实体
function getRelatedEntitiesByEntityId(robotId, entityId, key, limit = 10) {
  return this.$reqGetParam(
    `${NEW_ENTITY_PATH}/introductionManager/${robotId}/entity/getRelatedEntities/${entityId}?keyword=${key}&limit=${limit}`,
  );
}

function initialProperties(robotId) {
  return this.$reqGet(`${NEW_ENTITY_PATH}/property/${robotId}/initialProperty`);
}

function getAvailableExtraProperties(robotId, param) {
  return this.$reqGetParam(`${NEW_ENTITY_PATH}/extraPropertyManager/${robotId}/getNewExtraProperty`, param);
}

function deleteTestInfo(robotId, param) {
  return this.$reqPost(`${NEW_ENTITY_PATH}/${robotId}/dataset/delete`, param);
}

function deleteKGDataByAppId(robotId) {
  return this.$reqPost(`${NEW_ENTITY_PATH}/deleteAll/${robotId}`);
}

/**
 * 获取KG数据的 同步/训练 状态
 * @yapi http://yapi.emotibot.com:3000/project/66/interface/api/8299
 * @response trainingStatus/syncStatus/revertStatus -1 error 0 init 1 processing 2 done
 *            lastSuccessSync: 0 未成功同步过 1 曾经某次成功过
 */
function getKGDataStatus(robotId) {
  return this.$reqGet(`${NEW_ENTITY_PATH}/syncHandler/${robotId}/getSyncRecord`).then(res => res.data);
}
function getEntityInfoByEntitiyIds(robotId, param) {
  return this.$reqGetParam(`${NEW_ENTITY_PATH}/entityManager/${robotId}/getEntitiesByIds`, param);
}

function getPropertyByPropertyIds(robotId, param) {
  return this.$reqGetParam(`${NEW_ENTITY_PATH}/property/${robotId}/getPropertyByIds`, param);
}
/**
 * 检查是否需要同步KG数据
 */
function checkKGDataChangeReview(robotId) {
  return this.$reqGet(`${NEW_ENTITY_PATH}/syncHandler/${robotId}/checkAvailableData`).then(res => res.data);
}


export default {
  getPropertyByPropertyIds,
  getEntityInfoByEntitiyIds,
  deleteKGDataByAppId,
  deleteTestInfo,
  getAvailableExtraProperties,
  initialProperties,

  GetEntityListData,

  GetDataOverviewPropertyValues,

  ExportKGFile,

  checkReapeatEntityName,

  getExtraPropertyList,
  updateExtraProperty,
  addExtraProperty,
  deleteExtraProperty,

  updatePropertyIntroduction,

  getPropertyRelatedProperties,
  getPropertyRelatedValues,

  getEntityProfile,
  updateEntityProfile,
  createEntityProfile,

  addKeyWordSynonyms,
  // deleteKeyWordSynonyms,

  addPropertyValue,
  updatePropertyValue,
  deletePropertyValue,

  getSandBoxStatus,
  syncSandBoxSettings,
  withdrawSandBoxSettings,

  getPropertyTypes,
  getSlotTypes,

  getSynonym,
  // KG Training related
  checkTrainingStatus,
  triggerTraining,
  syncDataAfterTest,
  getUploadFaliedInfo,

  // KG Entity Graph Layout
  getV3Data,

  // Entity Management
  addSingleSpeechUnderEntity,
  getEntityByEntityId,
  updateEntityUnderRobot,
  deleteEntityUnderRobot,
  addEntityUnderRobot,
  getAllEntitiesByRobotId,
  getRootNodes,
  getChildNodes,

  addRootNode,
  addSubNode,
  updateNodeName,

  // Property Management
  deletePropertyUnderRobot,
  getPropertiesOfEntity,
  createProperty,
  updateProperty,
  getPropertyById,
  getAllCommonProperties,
  getRobotCommonProperties,
  getRobotExtraProperties,

  addSynonyms,
  updateSynonyms,
  deleteSynoyms,
  initBuildKG,
  batchUploadTemplate,

  // test related
  submitTestFile,
  getLastTestResultStatus,
  triggerKGTesting,
  getAllTestInfo,
  getTestDetailInfo,
  TestFileTemplate,

  getEntityPropertyValues,

  DOWNLOAD_PATH,
  getAllSynonymKeywordInfo,
  addKeywordSynonym,
  updateKeywordSynonym,
  deleteKeywordSynonym,

  onCheckNameRepeat,
  getRelatedEntitiesByPropertyId,
  getRelatedPropertiesByEntityId,
  getRelatedEntitiesByEntityId,

  getKGDataStatus,
  checkKGDataChangeReview,
};
