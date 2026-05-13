import * as types from './mutations_type';

export const state = {
  modelDAta: {},
  // 全局设置的默认值
  globalTTSinfo: {},
  copyACblock: 0,
  templateLists: [],
};

export const mutations = {
  [types.SET_MODEL_DATA]: (_, data) => {
    state.modelDAta = data;
  },
  [types.SET_GLOBAL_TTSINFO]: (_, data) => {
    state.globalTTSinfo = data;
  },
  [types.SET_TEMPLATE_LIST]: (_, data) => {
    state.templateLists = data;
  },
  [types.SET_COPY_CONDITIONACTIONBLOCK]: (_, data) => {
    state.copyACblock = data;
  },

};
