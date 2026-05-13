import * as types from './mutations_type';

export const state = {
  // wordbank: {},
  displayEntities: [],
  currentTreeData: [],
  deleteId: '',
  updateId: '',
  lockData: {},
  // syncLockData: {},
  lastActionType: '', // sync 从同步开始  train 从训练开始
};

export const mutations = {
  [types.SET_SYNC_LOCK_DATA]: (_, mapData) => {
    state.lockData = mapData;
  },

  [types.SET_DISPLAY_ENTITIES]: (_, entities) => {
    state.displayEntities = entities;
  },

  [types.SET_CURRENT_TREE_DATA]: (_, treeData) => {
    state.currentTreeData = treeData;
  },

  [types.SET_DELETE_ENTITY_ID]: (_, deleteId) => {
    state.deleteId = deleteId;
  },

  [types.SET_UPDATE_ENTITY_ID]: (_, updateId) => {
    state.updateId = updateId;
  },
  [types.SET_LAST_ACTION_TYPE]: (_, payload) => {
    console.error(types.SET_LAST_ACTION_TYPE, payload);
    state.lastActionType = payload;
  },
};
