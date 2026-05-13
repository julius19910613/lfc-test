import Vue from 'vue';
import Vuex from 'vuex';

import qalist from '@/modules/FAQ/_store';
import ner from '@/modules/NER/_store';
import statistics from '@/modules/Statistics/_store';
import taskengine from '@/modules/TaskEngine/_store';
import { intentTrain, intentTest } from '@/modules/IntentEngine/_store';
import knowledgegraph from '@/modules/KnowledgeGraph/_store';


import * as getters from './getter';
import actions from './action';
import { state, mutations } from './mutations';


Vue.use(Vuex);

const modules = {};
modules[`${qalist.name}-module`] = qalist;
modules[`${ner.name}-module`] = ner;
modules[`${statistics.name}-module`] = statistics;
modules[`${intentTrain.name}-module`] = intentTrain;
modules[`${intentTest.name}-module`] = intentTest;
modules[`${taskengine.name}-module`] = taskengine;
modules[`${knowledgegraph.name}-module`] = knowledgegraph;

// A Vuex instance is created by combining the state, mutations, actions,
// and getters.
export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations,
  modules,
});
