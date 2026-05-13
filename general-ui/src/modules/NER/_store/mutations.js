import * as types from './mutations_type';


export const state = {
  testingStatus: {},
  currentParserId: '',
};

export const mutations = {
  [types.SET_TESTING_STATUS]: (_, params) => {
    state.testingStatus[params.parserId] = params.status;
    state.testingStatus = Object.assign({}, state.testingStatus);
  },
  [types.SET_CURRENT_PARSER]: (_, parserId) => {
    state.currentParserId = parserId;
  },
};
