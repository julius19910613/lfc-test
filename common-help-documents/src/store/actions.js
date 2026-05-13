// 设置机器人id
export const setRobotId = ({ commit }, id) => {
  commit('SET_ROBOT_ID', id);
};

export const setCurrentTasksList = ({ commit }, list) => {
  commit('SET_TASKS_LIST', list);
};

// 设置当前意图数量
export const setIntentsList = ({ commit }, list) => {
  commit('SET_INTENTS_LIST', list);
};

export const setParsersList = ({ commit }, list) => {
  commit('SET_PARSER_LIST', list);
};

export const initializeTaskData = ({ commit }, json) => {
  commit('INITIALIZE_TASK_JSON', json);
  commit('TASK_JSON_2_UI_DATA', json);
};

export const finalizeTaskData = ({ commit }) => {
  commit('UI_DATA_2_TASK_JSON');
};

export const setTaskJson = ({ commit }, json) => {
  commit('SET_TASK_JSON', json);
};
