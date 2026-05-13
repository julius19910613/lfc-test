/*
* Task Engine API List
*/
// import qs from 'qs';
import http from './axios';

const GET_TASK_LIST = './tde/tasksinfo';
const GET_TASK_DETAIL = './tde/tasks';

const GET_INTENTS = '/api/v2/intents/intents?';
const GET_MENUS = '/auth/v4/menus';
const GET_PARSER_LIST = './tde/task-finders';
const GET_TAG_TYPES = '/api/v2/faq/tag-types';

const QATEST_CHAT = '/api/v1/qatest/chat-test';
const AUTH_MENUS = '/auth/v4/menus';

function apiGetIcon(url) {
  return http.$reqGet(url).then(rsp => rsp.data);
}

function apiSendChatRequest(params) {
  return http.$reqPost(QATEST_CHAT, params);
}

// 获取产品列表
function apiGetProductsList(userId) {
  return http.$reqGet(`/auth/v5/user/${userId}/products`);
}
// 获取权限
function apiGetAuthMenus(enterpriseId) {
  return http.$reqGet(`${AUTH_MENUS}/${enterpriseId}`);
}

// 获取出话维度
function apiGetTagTypes() {
  return http.$reqGet(GET_TAG_TYPES);
}

// Menus
function getAuthMenus(enterpriseId) {
  return http.$reqGet(`${GET_MENUS}/${enterpriseId}`);
}

// 0. 获取任务列表
function apiGetTaskList(appId) {
  return http.$reqGet(`${GET_TASK_LIST}/${appId}`)
    .then(rsp => rsp.data);
}

// 更改场景名字或发布场景
function apiUpdateTaskInfo(appId, taskId, taskName, published) {
  const params = {
    taskId,
    taskName,
    published,
  };
  return http.$reqPut(`${GET_TASK_LIST}/${appId}`, params);
}

// 1. 获取任务详情
function apiGetTaskDetail(appId, taskId) {
  return http.$reqGet(`${GET_TASK_DETAIL}/${appId}/${taskId}`).then(rsp => rsp.data);
}

// 2. 创建任务 || 更新任务详情
function apiUpdateTaskDetail(appId, detailJson) {
  const params = detailJson;
  return http.$reqPost(`${GET_TASK_DETAIL}/${appId}`, params);
}

// 3. 删除任务
function apiDeleteTask(appId, taskId) {
  return http.$reqDelete(`${GET_TASK_DETAIL}/${appId}/${taskId}`);
}

// 4. 获取意图列表
function apiGetIntentsList() {
  return http.$reqGet(GET_INTENTS);
}

// 5. 获取自定义解析器列表
function apiGetParserList() {
  return http.$reqGet(GET_PARSER_LIST).then(rsp => rsp.data);
}

export default {
  apiGetIcon,
  apiGetTagTypes,
  apiSendChatRequest,
  getAuthMenus,
  apiGetTaskList,
  apiGetTaskDetail,
  apiUpdateTaskDetail,
  apiUpdateTaskInfo,
  apiDeleteTask,
  apiGetIntentsList,
  apiGetParserList,
  apiGetAuthMenus,
  apiGetProductsList,
};
