import axios from 'axios';
import config from '@/modules/TaskEngine/_utils/config';

// const BASE_URL = '../../../../api/ApiKey/';
const BASE_URL = '/php/api/ApiKey/';
const TASK_ENGINE_APP_PATH = `${BASE_URL}task_engine_app.php`;
const TASK_ENGINE_SCENARIO_PATH = `${BASE_URL}task_engine_scenario.php`;
const NLU_TDE_REGISTER_PATH = `${BASE_URL}tde_register.php`;
const UPLOAD_SPREADSHEET_PATH = `${BASE_URL}spreadsheet.php`;
const UPLOAD_SCENARIO_JSON_PATH = `${BASE_URL}scenario_json_upload.php`;
const TASK_CONFIG = '/api/v1/task/config';
const TASK_ENGINE_SCENARIO_INTENT = '/api/v1/task/scenario/intents';

export default {
  taskConfig() {
    return this.$reqGet(TASK_CONFIG).then(resp => resp.data);
  },
  listScenarios(appId, type = 0) {
    return this.$reqGet(`${TASK_ENGINE_APP_PATH}?appid=${appId}&type=${type}`).then(resp => resp.data);
  },
  createScenario(appId, scenarioName, type = 0) {
    const data = {
      method: 'POST',
      scenarioName,
      template: '',
      appid: appId,
      type,
    };
    return this.$reqPostForm(TASK_ENGINE_SCENARIO_PATH, data).then(resp => resp.data);
  },
  createScenarioWithTemplate(appId, scenarioName, templateId, type = 0) {
    const data = {
      method: 'POST',
      scenarioName,
      template: templateId,
      appid: appId,
      type,
    };
    return this.$reqPostForm(TASK_ENGINE_SCENARIO_PATH, data).then(resp => resp.data);
  },
  deleteScenario(scenarioId) {
    const data = {
      method: 'PUT',
      scenarioid: scenarioId,
      delete: 1,
    };
    return this.$reqPostForm(TASK_ENGINE_SCENARIO_PATH, data).then(resp => resp.data);
  },
  loadScenario(scenarioId) {
    const data = {
      method: 'GET',
      scenarioid: scenarioId,
    };
    return this.$reqPostForm(TASK_ENGINE_SCENARIO_PATH, data).then(resp => resp.data);
  },
  loadTemplateScenario(type = 0) {
    const data = {
      method: 'GET',
      scenarioid: 'all',
      public: 1,
      type,
    };
    return this.$reqPostForm(TASK_ENGINE_SCENARIO_PATH, data).then(resp => resp.data);
  },
  exportAllScenarios(appId) {
    const that = this;
    that.$api.listScenarios(appId).then(((data) => {
      const scenarioList = data.msg.filter(scenario => scenario.version !== '2.0');
      const scenarioRequestList = [];
      scenarioList.forEach((scenario) => {
        scenarioRequestList.push(that.$api.loadScenario(scenario.scenarioID));
      });
      axios.all(scenarioRequestList).then((allScenarioJSONs) => {
        const result = [];
        allScenarioJSONs.forEach((scenarioJSON) => {
          result.push(that.$api.collectScenario(scenarioJSON));
        });
        const jsonString = JSON.stringify(result, null, 4);
        const blobdata = new Blob([jsonString], { type: 'text/json' });
        if (navigator.appVersion.toString().indexOf('.NET') > 0) { // for IE browser
          window.navigator.msSaveBlob(blobdata, 'all_scenarios.json');
        } else {
          const link = document.createElement('a');
          link.setAttribute('href', window.URL.createObjectURL(blobdata));
          link.setAttribute('download', 'all_scenarios.json');
          document.body.appendChild(link);
          link.click();
        }
      });
    }));
  },
  collectScenario(scenarioObj) {
    return {
      taskScenario: JSON.parse(scenarioObj.result.editingContent),
      taskLayouts: JSON.parse(scenarioObj.result.editingLayout),
      scenarioType: scenarioObj.result.scenarioType,
    };
  },
  exportScenario(scenarioId) {
    this.$api.loadScenario(scenarioId).then((scenarioObj) => {
      const scenario = this.$api.collectScenario(scenarioObj);
      const scenarioName = scenario.taskScenario.metadata.scenario_name;
      const jsonString = JSON.stringify(scenario, null, 4);
      const blobdata = new Blob([jsonString], { type: 'text/json' });
      if (navigator.appVersion.toString().indexOf('.NET') > 0) { // for IE browser
        window.navigator.msSaveBlob(blobdata, `${scenarioName}.json`);
      } else {
        const link = document.createElement('a');
        link.setAttribute('href', window.URL.createObjectURL(blobdata));
        link.setAttribute('download', `${scenarioName}.json`);
        document.body.appendChild(link);
        link.click();
      }
    });
  },
  saveTaskEngineIntents(appId, scenarioId, triggerIntents) {
    const triggerIntentsString = JSON.stringify(triggerIntents);
    const data = {
      app_id: appId,
      scenario_id: scenarioId,
      trigger_intents: triggerIntentsString,
    };
    return this.$reqPutForm(TASK_ENGINE_SCENARIO_INTENT, data).then(resp => resp.data);
  },
  saveScenario(appId, scenarioId, content, layout = '{}') {
    const data = {
      method: 'PUT',
      appid: appId,
      scenarioid: scenarioId,
      content,
      layout,
    };
    return this.$reqPostForm(TASK_ENGINE_SCENARIO_PATH, data).then(resp => resp.data);
  },
  publishScenario(appId, scenarioId) {
    const data = {
      method: 'PUT',
      appid: appId,
      scenarioid: scenarioId,
      publish: 1,
    };
    return this.$reqPostForm(TASK_ENGINE_SCENARIO_PATH, data).then(resp => resp.data);
  },
  switchScenario(appId, scenarioId, enable) {
    const data = {
      method: 'POST',
      appid: appId,
      scenarioid: scenarioId,
      enable,
    };
    return this.$reqPostForm(TASK_ENGINE_APP_PATH, data).then(resp => resp.data);
  },
  registerNluTdeScenario(data) {
    return this.$reqPost(NLU_TDE_REGISTER_PATH, data).then(resp => resp.data);
  },
  uploadSpreadsheet(appId, scenarioId, scenario, file) {
    if (!file) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          reject('Empty file');
        }, 0);
      });
    } else if (file.size <= 0 || file.size > config.MaximumFileSize) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          reject('File size need more than 0, less than 2MB');
        }, 0);
      });
    }

    const data = new FormData();
    data.append('appId', appId);
    data.append('scenarioId', scenarioId);
    data.append('scenario', scenario);
    data.append('spreadsheet', file);

    return this.$reqPost(UPLOAD_SPREADSHEET_PATH, data).then(resp => resp.data);
  },
  uploadScenarioJSON(appId, file) {
    if (!file) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          reject('Empty file');
        }, 0);
      });
    } else if (file.size <= 0 || file.size > config.MaximumFileSize) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          reject('File size need more than 0, less than 2MB');
        }, 0);
      });
    }

    const data = new FormData();
    data.append('useNewId', true);
    data.append('appid', appId);
    data.append('scenario_json', file);

    return this.$reqPost(UPLOAD_SCENARIO_JSON_PATH, data).then(resp => resp.data);
  },
};
