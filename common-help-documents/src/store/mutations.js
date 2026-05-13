const mutations = {
  // 设置机器人id
  SET_ROBOT_ID(state, id) {
    state.appId = id;
  },
  SET_TASKS_LIST(state, list) {
    state.tasksList = list;
  },
  // 设置意图列表
  SET_INTENTS_LIST(state, list) {
    state.intentsList = list;
  },
  // 设置解析器列表
  SET_PARSER_LIST(state, list) {
    state.parsersList = list;
  },
  SET_TASK_JSON(state, json) {
    state.taskJson = json;
  },
};

export default mutations;
