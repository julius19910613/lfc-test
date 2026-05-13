const TaskEngineV2 = () => import(
  /* webpackChunkName: "TaskEngineV2" */
  './TaskEngineV2.vue');
const TaskEngineV3 = () => import(
  /* webpackChunkName: "TaskEngineV3" */
  './TaskEngineV3');
const ListPageImport = () => import('./TaskEngineV2/src/components/ScenarioListPage');
const EditPageImport = () => import('./TaskEngineV2/src/components/ScenarioEditPage');

export default {
  displayNameKey: 'task_engine',
  icon: 'menu_te',
  pages: [
    {
      name: 'task-engine-scenario-v2',
      path: 'task-engine-scenario-v2',
      displayNameKey: 'task_engine_scenario_v2',
      icon: 'white_task_engine',
      component: TaskEngineV2,
      childrenPath: [
        { path: '', component: ListPageImport },
        { path: 'scenario/:id', component: EditPageImport },
      ],
    },
    {
      name: 'task-engine-scenario-v3',
      path: 'task-engine-scenario-v3',
      displayNameKey: 'task_engine_scenario_v3',
      icon: 'white_task_engine',
      component: TaskEngineV3,
      childrenPath: [
        { path: '', component: () => import('./TaskEngineV3/src/components/ScenarioListPage') },
        { path: 'scenario/:id', component: () => import('./TaskEngineV3/src/components/ScenarioEditPage') },
        { path: 'entity', component: () => import('./TaskEngineV3/src/components/EntityManagementPage') },
      ],
    },
  ],
};
