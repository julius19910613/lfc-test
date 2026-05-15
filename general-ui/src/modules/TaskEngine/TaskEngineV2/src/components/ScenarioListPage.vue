<template lang="html">
<div id="scenario-list-page-v2">
  <input type="file" ref="uploadScenarioJSONInput" style="visibility: hidden; display: none;" @change="changeScenarioJSONFile()" accept=".json">
  <!-- 场景为空时 显示 start-->
  <div class="content card h-fill w-fill no-scenario" v-if="scenarioList.length === 0">
    <div class="center-msg">
      <div class="title">{{ $t('task_engine_v2.scenario_list_page.start_scenario') }}</div>
      <div class="model-help" v-if="false">
        <div class="help-video">
          <icon :size=14 icon-type="te_help_video"></icon>
          {{ $t('task_engine_v2.scenario_list_page.help_video') }}
        </div>
        <div class="upload-data">
          <icon :size=14 icon-type="scenario_upload"></icon>
          {{ $t('task_engine_v2.scenario_list_page.upload_transfor_data') }}
        </div>
      </div>
      <div class="start-scenario">
        <text-button button-type='primary' width='140px' height='46px' @click="createNewScenario">
          {{$t("task_engine_v2.scenario_list_page.button_create_new_scenario")}}
        </text-button>
        <text-button button-type='default' :iconSize=15 width='140px' height='46px' @click="importScenarioJSON">
          {{$t("task_engine_v2.scenario_list_page.button_import_scenario")}}
        </text-button>
      </div>
    </div>
  </div>
  <!-- 场景为空时 显示 end-->
  <div class="content card h-fill w-fill" v-else>
    <div class="row title tab-change " v-if="currentType !== 'template'">
      <div  class="tabwrap">
        <div :class="{activetab : currentType !== item.value}" style="margin-right: 24px;" v-for="item in pageheader" :key="item.id" @click="changeScenceType(item.value)"> {{item.name}}</div>
      </div>
      <div style="display: flex;flex-direction: row;">
        <search-input v-model="filteredKeyWord" style="margin-right: 10px"></search-input>
         <div class="header-btn" style=" border-right: none;" @click="importScenarioJSON">
          <div><i class="emoti-icon icon-import"/></div>
          <div style="margin-left:5px">{{$t("task_engine_v2.scenario_list_page.button_import_scenario")}}</div>
        </div>
        <div class="header-btn" style="border-radius: 0 3px 3px 0;" @click="exportAllScenarios">
          <div><i class="emoti-icon icon-export"/></div>
          <div style="margin-left:5px">{{$t("task_engine_v2.scenario_list_page.button_export_all_scenarios")}}</div>
        </div>
      </div>
    </div>
    <div v-if="currentType === 'template'"  class="row title tab-change ">
      <div>{{$t("task_engine_v2.scenario_list_page.scenario_template")}}</div>
      <div>
        <div class="backto-list" @click="currentType='list'"> {{$t("task_engine_v2.scenario_list_page.goback_scenario_list")}}</div>
      </div>
    </div>
    <div class="page">
      <div class="row" v-if="false">
        <div id="toolbar">
          <div id="left-buttons">
            <text-button button-type='primary' width='100px' height='32px' @click="createNewScenario">
              {{$t("task_engine_v2.scenario_list_page.button_create_new_scenario")}}
            </text-button>
            <text-button button-type='default' :iconSize=15 width='100px' height='32px' @click="importScenarioJSON">
              {{$t("task_engine_v2.scenario_list_page.button_import_scenario")}}
            </text-button>
            <text-button button-type='default' width='120px' height='32px' @click="exportAllScenarios">
              {{$t("task_engine_v2.scenario_list_page.button_export_all_scenarios")}}
            </text-button>
          </div>
          <div class="model-help top" v-if="false">
            <div class="help-video">
              <icon :size=14 icon-type="te_help_video"></icon>
              {{ $t('task_engine_v2.scenario_list_page.help_video') }}
            </div>
            <div class="upload-data">
              <icon :size=14 icon-type="scenario_upload"></icon>
              {{ $t('task_engine_v2.scenario_list_page.upload_transfor_data') }}
            </div>
          </div>
        </div>
      </div>
      <!-- 任务流引擎-->
      <div style="padding: 0 20px;">
        <div class="explanation">
          <div class="explanation-left">
            <div style="padding-top: 5px;">
              <emoti-icon name="icon-task-flow" :size="36"></emoti-icon>
            </div>
            <div style="margin-left: 20px;">
              <p style="height: 28px"><span class="explana-title">{{scenarioType[currentType].title}} </span> <span> {{scenarioType[currentType].subtitle}}</span></p>
              <p class="explana-cont">{{scenarioType[currentType].content}}</p>
            </div>
          </div>
          <div v-if="currentType === 'list'" @click="currentType = 'template'" class="view-template">
            {{ $t('task_engine_v2.scenario_list_page.view_scenario_list') }}
          </div>
        </div>
      </div>
      <!--场景列表-->
      <div class="scenario-list" v-show="currentType === 'list'">
        <emoti-card 
        :title="$t('task_engine_v2.scenario_list_page.button_create_new_scenario')" 
        type="new" 
        @click="createNewScenario(0)" 
        class="card"/>
        <template v-for="(scenario, index) in filteredScenarioList" >
          <emoti-card
            :key="scenario.scenarioID"
            class="card"
            v-model="scenario.enable"
            :title="scenario.scenarioName"
            :cardData="scenario"
            :actions="btnGroup"
            :clickCard="true"
            @statusChange="cardToogle"
          />
        </template>
      </div>
      <!--功能列表-->
      <div class="scenario-list" v-show="currentType === 'func'">
        <emoti-card 
        :title="$t('task_engine_v2.scenario_list_page.create_new_func_scenario')" 
            type="new" @click="createNewScenario(1)" 
            class="card"/>
        <template v-for="(scenario, index) in FunctionScenarioList" >
          <emoti-card
            :key="scenario.scenarioID"
            :showStatus="false"
            class="card"
            :title="scenario.scenarioName"
            :cardData="scenario"
            :actions="btnGroup"
          />
        </template>
      </div>
      <!--模版列表-->
      <div class="scenario-list" v-show="currentType === 'template'">
        <div v-for="(scenario, index) in templateList" >
          <emoti-card
            :key="scenario.scenarioID"
            class="card"
            :title="scenario.scenarioName"
            :cardData="scenario"
             :showStatus="false"
          >
          <div slot="after" class="create-from-template">
              <el-button  @click="handleTemplateCreate(scenario)" size="mini"><span class="icon-import-template"></span> {{$t('management.create_from_template')}}</el-button>
            </div>
          </emoti-card>
        </div>
        <div
          v-for="(scenario, index) in templateList"
          :key="scenario.scenarioID"
          class="scenario-grid"
          @mouseover="scenario.show = true"
          @mouseleave="scenario.show = false"
          v-if="false"
        >
        </div>
      </div>
    </div>

  </div>
</div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import taskEngineApi from '@/modules/TaskEngine/_api/taskEngine';
import nerFactoryDalApi from '@/modules/TaskEngine/_api/nerFactoryDal';
import general from '@/modules/TaskEngine/_utils/general';
import config from '@/modules/TaskEngine/_utils/config';
// import event from '@/utils/js/event';
import CreateScenarioPop from './CreateScenarioPop';
import scenarioInitializer from '../_utils/scenarioInitializer';
import scenarioConvertor from '../_utils/scenarioConvertor';
import scenarioVersionConvertor from '../_utils/scenarioVersionConvertor';

export default {
  name: 'scenario-list-page-v2',
  components: {},
  api: [taskEngineApi, nerFactoryDalApi],
  data() {
    return {
      appId: '',
      scenarioList: [],
      filteredKeyWord: '',
      tipsEditScenario: {
        msg: this.$t('task_engine_v2.scenario_list_page.tips_edit_scenario_name'),
        eventOnly: false,
        clickShow: false,
        // errorType: true,
        alignLeft: true,
      },
      scenarioNameTooltip: {
        msg: this.$t('task_engine_v2.scenario_settings_edit_pop.err_empty_scenario_name'),
        eventOnly: true,
        errorType: true,
        alignLeft: true,
      },
      toggleLabel: {
        on: this.$t('task_engine_v2.scenario_edit_page.on'),
        off: this.$t('task_engine_v2.scenario_edit_page.off'),
      },
      customParsersApp: [],
      btnGroup: [
        {
          icon: 'icon-delete',
          type: 'danger',
          label: '删除',
          onClick: (data) => {
            this.deleteScenario(data);
          },
        },
        {
          icon: 'icon-export',
          label: '导出',
          onClick: (data) => {
            this.exportScenario(data.scenarioID);
          },
        },
        {
          icon: 'icon-edit-pen',
          label: '编辑',
          onClick: (data) => {
            this.editScenario(data.scenarioID);
          },
        },
      ],
      scenarioType: {
        func: {
          title: this.$t('task_engine_v2.scenario_list_page.task_flow'),
          subtitle: this.$t('task_engine_v2.scenario_list_page.func_scenario'),
          content: this.$t('task_engine_v2.scenario_list_page.func_scen_instruction'),
        },
        template: {
          title: this.$t('task_engine_v2.scenario_list_page.scenario_templates'),
          content: this.$t('task_engine_v2.scenario_list_page.template_instruction'),
        },
        list: {
          title: this.$t('task_engine_v2.scenario_list_page.task_flow'),
          subtitle: this.$t('task_engine_v2.scenario_list_page.scenario_list'),
          content: this.$t('task_engine_v2.scenario_list_page.scenario_instruction'),
        },
      },
      pageheader: [
        {
          name: this.$t('task_engine_v2.scenario_list_page.scenario_list'),
          value: 'list',
          id: 1,
        },
      ],
      currentType: 'list',
      templateList: [],
      FunctionScenarioList: [],
    };
  },
  computed: {
    ...mapGetters([
      'robotID',
      'showscenrioId',
      'funcScenFlag',
    ]),
    filteredScenarioList() {
      return this.scenarioList
        .filter(scenario => scenario.scenarioName.indexOf(this.filteredKeyWord) !== -1)
        .sort((a, b) => a.scenarioName.localeCompare(b.scenarioName));
    },
  },
  watch: {
    showscenrioId: {
      handler(val) {
        console.log(val);
      },
      immediate: true,
    },
  },
  directives: {
    focus: {
      inserted(el) {
        el.focus();
      },
    },
  },
  methods: {
    ...mapMutations([
      'setTemplatesList',
    ]),
    changeScenceType(type) {
      console.log(12, type);
      this.currentType = type;
    },
    exportScenario(scenarioID) {
      this.$api.exportScenario(scenarioID);
    },
    publishScenario(scenario, jsonData) {
      const that = this;
      this.$api.publishScenario(that.appId, scenario.scenarioID).then(() => {
        // that.$notify({ text: that.$t('task_engine_v2.scenario_list_page.publish_succeed') });
        this.$message({
          message: that.$t('task_engine_v2.scenario_list_page.publish_succeed'),
          type: 'success',
          showClose: false,
        });
      }, (err) => {
        // that.$notifyFail(`${that.$t('task_engine_v2.scenario_list_page.publish_failed')}:
        // s${err.message}`);
        this.$message({
          message: `${that.$t('task_engine_v2.scenario_list_page.publish_failed')}:${err.message}`,
          type: 'error',
          showClose: true,
        });
      });
      const newJsonData = scenarioVersionConvertor.convertJsonToVersion('2.6', jsonData);
      scenarioConvertor.registerNluTdeScenario(
        scenario.scenarioID,
        newJsonData.moduleData.ui_data.nodes,
      );
    },
    exportAllScenarios() {
      this.$api.exportAllScenarios(this.appId);
    },
    listAllScenarios() {
      this.$api.listScenarios(this.appId).then((data) => {
        if (typeof (data) === 'object' && 'msg' in data) {
          this.scenarioList = data.msg.filter(scenario => scenario.version !== '2.0')
                                      .map((scenario) => {
                                        scenario.show = false;
                                        scenario.editScenarioName = false;
                                        scenario.oldScenarioName = scenario.scenarioName;
                                        return scenario;
                                      });
        } else {
          // this.$notifyFail(`listAllScenarios error:
          // unexpected return value from listScenarios API: ${data}`);
          this.$message({
            message: `listAllScenarios error: unexpected return value from listScenarios API: ${data}`,
            type: 'error',
            showClose: true,
          });
        }
      }, (err) => {
        // this.$notifyFail(`listAllScenarios error:${err.message}`);
        this.$message({
          message: `listAllScenarios error:${err.message}`,
          type: 'error',
          showClose: true,
        });
      });
    },
    listAllFunctionsScenarios() {
      this.$api.listScenarios(this.appId, 1).then((data) => {
        if (typeof (data) === 'object' && 'msg' in data) {
          this.FunctionScenarioList = data.msg.filter(scenario => scenario.version !== '2.0')
                                      .map((scenario) => {
                                        scenario.show = false;
                                        scenario.editScenarioName = false;
                                        scenario.oldScenarioName = scenario.scenarioName;
                                        return scenario;
                                      });
          this.setTemplatesList(this.FunctionScenarioList); // vuex 存功能场景列表；
        } else {
          // this.$notifyFail(`listAllScenarios error:
          // unexpected return value from listScenarios API: ${data}`);
          this.$message({
            message: `listAllScenarios error: unexpected return value from listScenarios API: ${data}`,
            type: 'error',
            showClose: true,
          });
        }
      }, (err) => {
        // this.$notifyFail(`listAllScenarios error:${err.message}`);
        this.$message({
          message: `listAllScenarios error:${err.message}`,
          type: 'error',
          showClose: true,
        });
      });
    },
    listAllTemplates() {
      this.$api.loadTemplateScenario().then((data) => {
        this.templateList.push(...data.result);
        // that.templateList = templateList.map(template => ({
        //   text: template.scenarioName,
        //   value: template.scenarioID,
        // }));
      });
    },
    handleTemplateCreate(scenario) {
      console.log(scenario);
      const that = this;
      that.$api
        .createScenarioWithTemplate(that.appId, scenario.scenarioName, scenario.scenarioID, 0)
        .then((data) => {
          if ('template' in data && 'metadata' in data.template) {
            const metadata = data.template.metadata;
            const scenarioId = metadata.scenario_id;
            const path = general.composeV2Path(`scenario/${scenarioId}`);
            that.$router.replace(path);
          } else {
            this.$message({
              message: `${that.$t('task_engine_v2.scenario_list_page.create_new_scenario_failed')}`,
              type: 'error',
              showClose: true,
            });
          }
        }, (err) => {
          this.$message({
            message: `${that.$t('task_engine_v2.scenario_list_page.create_new_scenario_failed')}:${err.message}`,
            type: 'error',
            showClose: true,
          });
        });
    },
    createNewScenario(type) {
      const that = this;
      that.$pop({
        title: that.$t('task_engine_v3.create_scenario_pop.create_scenario'),
        component: CreateScenarioPop,
        validate: true,
        ok_msg: that.$t('task_engine_v3.create_scenario_pop.comfire_create'),
        data: {
          scenarioName: '',
        },
        callback: {
          ok: (obj) => {
            that.$api
            .createScenarioWithTemplate(that.appId, obj.scenarioName, obj.templateID, type)
            .then((data) => {
              if ('template' in data && 'metadata' in data.template) {
                const metadata = data.template.metadata;
                const scenarioId = metadata.scenario_id;
                if (obj.templateID === '') {
                  const entryNodeName = that.$t('task_engine_v2.node_type.entry');
                  const scenario = scenarioInitializer.initialScenario(metadata, entryNodeName);
                  that.saveScenario(scenarioId, scenario).then(() => {
                    const path = general.composeV2Path(`scenario/${scenarioId}`);
                    that.$router.replace(path);
                  });
                } else {
                  const path = general.composeV2Path(`scenario/${scenarioId}`);
                  that.$router.replace(path);
                }
              } else {
                // that.$notifyFail(`${that.$t
                // ('task_engine_v2.scenario_list_page.create_new_scenario_failed')}`);
                this.$message({
                  message: `${that.$t('task_engine_v2.scenario_list_page.create_new_scenario_failed')}`,
                  type: 'error',
                  showClose: true,
                });
              }
            }, (err) => {
               // that.$notifyFail(`${that.$t('task_engine_v2.
               // scenario_list_page.create_new_scenario_failed')}:
               // ${err.message}`);
              this.$message({
                message: `${that.$t('task_engine_v2.scenario_list_page.create_new_scenario_failed')}:${err.message}`,
                type: 'error',
                showClose: true,
              });
            });
          },
        },
      });
    },
    saveScenario(scenarioId, scenario) {
      return this.$api.saveScenario(
        this.appId,
        scenarioId,
        JSON.stringify(scenario.editingContent),
        JSON.stringify(scenario.editingLayout),
      ).then(() => {
        // this.$notify({ text: this.$t('error_msg.save_success') });
        this.$message({
          message: this.$t('error_msg.save_success'),
          type: 'success',
          showClose: true,
        });
      }, (err) => {
        // this.$notifyFail(`${this.$t('error_msg.save_fail')}:${err.message}`);
        this.$message({
          message: `${this.$t('error_msg.save_fail')}:${err.message}`,
          type: 'error',
          showClose: true,
        });
      });
    },
    editScenario(scenarioId) {
      const path = general.composeV2Path(`scenario/${scenarioId}`);
      this.$router.replace(path);
    },
    deleteScenario(scenario) {
      const that = this;
      that.$popCheck({
        data: {
          msg: that.$t(
            'task_engine_v3.scenario_list_page.ask_delete_confirm',
            { scenario: scenario.scenarioName },
          ),
        },
        callback: {
          ok() {
            that.removeScenarioCustomParser(scenario).then(() => {
              that.$api.deleteScenario(scenario.scenarioID).then((data) => {
                if ('msg' in data && data.msg === 'Update success') {
                  that.listAllScenarios();
                } else {
                  // that.$notifyFail('deleteScenario error: failed to delete scenario.');
                  this.$message({
                    message: 'deleteScenario error: failed to delete scenario.',
                    type: 'error',
                    showClose: true,
                  });
                }
              });
            });
          },
        },
      });
    },
    cardToogle(enable, scenario) {
      scenario.enable = enable;
      let triggerIntents = [];
      if (scenario.enable) {
        this.loadScenario(scenario).then((jsonData) => {
          this.publishScenario(scenario, jsonData);
          triggerIntents = scenarioConvertor.parseTriggerIntents(jsonData.moduleData.ui_data.nodes);
          this.saveTaskEngineIntents(scenario, triggerIntents);
        });
      } else {
        this.saveTaskEngineIntents(scenario, triggerIntents);
      }
      this.$api.switchScenario(this.appId, scenario.scenarioID, scenario.enable)
        .then(() => {
          if (enable) {
            this.updateUploadScenarioCustomParser(scenario.scenarioID, false);
          }
        }, (err) => {
          // this.$notifyFail(`switchScenario error:${err.message}`);
          this.$message({
            message: `switchScenario error:${err.message}`,
            type: 'error',
            showClose: true,
          });
        });
    },
    switchScenario(scenario, enable) {
      scenario.enable = enable;
      let triggerIntents = [];
      if (scenario.enable) {
        this.loadScenario(scenario).then((jsonData) => {
          this.publishScenario(scenario, jsonData);
          triggerIntents = scenarioConvertor.parseTriggerIntents(jsonData.moduleData.ui_data.nodes);
          this.saveTaskEngineIntents(scenario, triggerIntents);
        });
      } else {
        this.saveTaskEngineIntents(scenario, triggerIntents);
      }
      this.$api.switchScenario(this.appId, scenario.scenarioID, scenario.enable)
      .then(() => {
        if (enable) {
          this.updateUploadScenarioCustomParser(scenario.scenarioID, false);
        }
      }, (err) => {
        // this.$notifyFail(`switchScenario error:${err.message}`);
        this.$message({
          message: `switchScenario error:${err.message}`,
          type: 'error',
          showClose: true,
        });
      });
    },
    loadScenario(scenario) {
      return this.$api.loadScenario(scenario.scenarioID).then((data) => {
        const jsonData = {
          moduleData: JSON.parse(data.result.editingContent),
          moduleDataLayouts: JSON.parse(data.result.editingLayout),
        };
        return jsonData;
      }, (err) => {
        // general.popErrorWindow(this, 'loadScenario error', err.message);
        this.$message({
          message: `loadScenario error: ${err.message}`,
          type: 'error',
          showClose: true,
        });
      });
    },
    saveTaskEngineIntents(scenario, triggerIntents) {
      this.$api.saveTaskEngineIntents(
        this.appId,
        scenario.scenarioID,
        triggerIntents,
      ).then(() => {}, (err) => {
        // this.$notifyFail(`saveTaskEngineIntents failed, error:${err.message}`);
        this.$message({
          message: `saveTaskEngineIntents failed, error:${err.message}`,
          type: 'error',
          showClose: true,
        });
      });
    },
    importScenarioJSON() {
      this.$refs.uploadScenarioJSONInput.click();
    },
    changeScenarioJSONFile() {
      const files = this.$refs.uploadScenarioJSONInput.files;
      const file = files[0] || undefined;
      const that = this;
      if (file.size <= 0 || file.size > config.MaximumFileSize) {
        // maximum size: 100 MB
        // that.$notifyFail(that.$t('error_msg.upload_file_size_error'));
        this.$message({
          message: that.$t('error_msg.upload_file_size_error'),
          type: 'error',
          showClose: true,
        });
      } else {
        that.uploadScenarioJSON(this.appId, file).then((resp) => {
          this.listAllScenarios();
          if (resp.return === 0 && resp.scenarioids !== undefined) {
            resp.scenarioids.forEach((scenarioID) => {
              that.updateUploadScenarioCustomParser(scenarioID, true);
            });
          }
        });
      }
    },
    uploadScenarioJSON(appId, file) {
      const that = this;
      return this.$api.uploadScenarioJSON(
        appId,
        file,
      ).then((resp) => {
        if (resp.return === 0) {
          // that.$notify({ text: that.$t('error_msg.success') });
          this.$message({
            message: that.$t('error_msg.success'),
            type: 'success',
            showClose: false,
          });
          that.$refs.uploadScenarioJSONInput.value = '';
        } else {
          // that.$notifyFail(`${that.$t('error_msg.save_fail')}:${resp.error}`);
          this.$message({
            message: `${that.$t('error_msg.save_fail')}:${resp.error}`,
            type: 'error',
            showClose: true,
          });
        }
        return resp;
      }, (err) => {
        that.$refs.uploadScenarioJSONInput.value = '';
        // that.$notifyFail(`${that.$t('error_msg.save_fail')}:${err.message}`);
        this.$message({
          message: `${that.$t('error_msg.save_fail')}:${err.message}`,
          type: 'error',
          showClose: true,
        });
      });
    },
    startEditScenarioName(scenario) {
      const checkShow = this.filteredScenarioList.findIndex(item => item.editScenarioName === true);
      if (checkShow === -1) {
        scenario.editScenarioName = true;
      } else {
        this.$refs[`scenarioName_${checkShow}`].classList.add('error');
      }
    },
    cancelEditScenarioName(scenario) {
      // this.$refs.scenarioName[0].dispatchEvent(event.createEvent('tooltip-hide'));
      scenario.editScenarioName = false;
      scenario.oldScenarioName = scenario.scenarioName;
    },
    setScenarioName(scenario) {
      scenario.oldScenarioName = scenario.oldScenarioName.replace(/[\r\n]/g, '');
      // if (scenario.oldScenarioName.trim() === '') {
      //   this.$refs.scenarioName[0].dispatchEvent(event.createEvent('tooltip-show'));
      // } else if (scenario.oldScenarioName.trim() !== '') {
      //   this.$refs.scenarioName[0].dispatchEvent(event.createEvent('tooltip-hide'));
      scenario.editScenarioName = false;
      if (scenario.oldScenarioName !== scenario.scenarioName) {
        scenario.scenarioName = scenario.oldScenarioName;
        const that = this;
        this.$api.loadScenario(scenario.scenarioID).then((data) => {
          const moduleData = JSON.parse(data.result.editingContent);
          const layout = JSON.parse(data.result.editingLayout);
          moduleData.metadata.scenario_name = scenario.scenarioName;
          moduleData.metadata.update_time = general.getLocalDateTimeIsoString();
          this.$api.saveScenario(
            that.appId,
            scenario.scenarioID,
            JSON.stringify(moduleData),
            JSON.stringify(layout),
          ).then(() => {
            that.publishScenario(scenario, {
              moduleData,
              moduleDataLayouts: layout,
            });
            that.listAllScenarios();
          }, (err) => {
            // that.$notifyFail(`${that.$t('task_engine_v2.scenario_list_page.
            // create_new_scenario_failed')}:${err.message}`);
            this.$message({
              message: `${that.$t('task_engine_v2.scenario_list_page.create_new_scenario_failed')}:${err.message}`,
              type: 'error',
              showClose: true,
            });
          });
        }, (err) => {
          // this.$popError('loadScenario error', err.message);
          this.$message({
            message: `loadScenario error: ${err.message}`,
            type: 'error',
            showClose: true,
          });
        });
      }
      scenario.oldScenarioName = scenario.scenarioName;
      // }
    },
    removeScenarioCustomParser(scenario) {
      const that = this;
      return this.$api.loadScenario(scenario.scenarioID).then((data) => {
        const moduleData = JSON.parse(data.result.editingContent);
        if ('custom_parsers' in moduleData) {
          this.$api.deleteNerParsersCount(that.appId,
            Object.keys(moduleData.custom_parsers).filter(
              item => that.customParsersApp.indexOf(item) >= 0));
        }
      }, (err) => {
        // this.$popError('loadScenario error', err.message);
        this.$message({
          message: `loadScenario error: ${err.message}`,
          type: 'error',
          showClose: true,
        });
      });
    },
    updateUploadScenarioCustomParser(scenarioID, update) {
      const that = this;
      this.$api.loadScenario(scenarioID).then((data) => {
        const moduleData = JSON.parse(data.result.editingContent);
        if ('custom_parsers' in moduleData) {
          this.$api.getNerParserList(this.appId).then((parsers) => {
            const parserIds = parsers.data.map(parser => (parser.parserId));
            const added = [];
            const other = [];
            Object.keys(moduleData.custom_parsers).forEach((key) => {
              if (parserIds.indexOf(key) > -1) {
                added.push(key);
              } else {
                other.push(moduleData.custom_parsers[key]);
              }
            });
            if (update) {
              this.$api.updateNerParsersCount(
                that.appId, added.filter(item => that.customParsersApp.indexOf(item) >= 0));
            }
            if (other.length > 0) {
              that.$popCheck({
                data: {
                  msg: that.$t(
                    'task_engine_v2.scenario_list_page.upload_scenario_info',
                    { parser_info: other.map(item => (item.name)) },
                  ),
                },
                buttons: ['ok'],
              });
            }
          }, (err) => {
            // this.$popError('getNerParserList error', err.message);
            this.$message({
              message: `getNerParserList error: ${err.message}`,
              type: 'error',
              showClose: true,
            });
          });
        }
      }, (err) => {
        // this.$popError('loadScenario error', err.message);
        this.$message({
          message: `loadScenario error: ${err.message}`,
          type: 'error',
          showClose: true,
        });
      });
    },
  },
  beforeMount() {
    this.appId = this.robotID;
  },
  mounted() {
    if (this.funcScenFlag) {
      this.pageheader.push({
        name: this.$t('task_engine_v2.scenario_list_page.func_scenario'),
        value: 'func',
        id: 2,
      });
    }
    this.listAllScenarios();
    this.listAllTemplates();
    this.listAllFunctionsScenarios();
    const that = this;
    this.$api.getNerParserList(this.appId).then((data) => {
      that.customParsersApp = data.data.map(parser => parser.parserId);
    });
  },
};
</script>

<style lang="scss" scoped>
@import 'styles/variable.scss';
$row-height: $default-line-height;
#scenario-list-page-v2{
  height: 100%;
  padding: 0 10px;
  ::v-deep .el-button{
    padding: 0;
    font-size: 12px;
    border-radius: 3px;
  }
  .content {
    display: flex;
    flex-direction: column;
    &.no-scenario {
      justify-content: center;
      background: {
        image: url('../../../../../assets/images/scenario_bg.svg');
        position: center right;
        repeat: no-repeat;
        size: 665px 501px;
      }
    }
    .page{
      flex: 1;
      @include auto-overflow();
      @include customScrollbar();
      .explanation{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        height: 63px;
        background: rgba(249,249,249,1);
        border-radius: 1px;
        padding: 8px 20px ;
        font-size: 14px;
        color: #8c8c8c;
        .explanation-left{
          display: flex;
          flex-direction: row;
        }
        .explana-title{
          font-size: 16px;
          color:#434343;
          line-height: 28px;
          font-weight: 400;
        }
        .explana-cont{
          line-height: 18px;
        }
        .view-template{
          float: right;
          padding-top: 8px;
          margin-right: 10px;
          color: #4882ED;
          cursor: pointer;
        }
      }
    }
    .row {
      flex: 0 0 auto;
      padding: 0px 20px 0px 20px;
      border-bottom: 1px solid #e9e9e9;
      &.title {
        @include font-16px();
        font-size: 18px;
        color: $color-font-active;
        flex: 0 0 60px;
        // border-bottom: 1px solid $color-borderline;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .header-btn{
        color:#666;
        display: flex;
        height:28px;
        line-height: 28px;
        text-align: center;
        border: 1px solid #DBDBDB;
        font-size: 12px;
        padding:0 9px;
        border-radius: 3px 0 0 3px;
        cursor: pointer;
      }
      .text-button {
        margin-right: 10px;
      }
      input[type=file] {
        visibility: hidden;
      }
      .file-selector {
        & ~ input {
          display: none;
        }
      }

      #toolbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        // margin-right: 20px;
        #left-buttons{
          display: flex;
          align-items: center;
        }
      }
    }
    .tab-change{
      border-bottom: 1px dashed #eee;
      margin-bottom: 10px;
      .tabwrap{
        display: flex;
        flex-direction: row;
        cursor: pointer;
        .activetab{
          color: #8C8C8C;
        }
      }
      .backto-list{
        width: 96px;
        height: 28px;
        text-align: center;
        line-height: 28px;
        font-size: 12px;
        border: 1px solid #EEEEEE;
        color: #666666;
        border-radius: 3px;
        font-weight: 400;
        cursor: pointer;
      }
    }
    .scenario-list{
      flex: 1;
      padding: 20px;
      padding-bottom: 0px;
      display: flex;
      flex-direction: row;
      justify-content: stretch;
      flex-wrap: wrap;
      align-content: flex-start;
      .emoti-card {
        margin: 0 20px 20px 0;
        width: calc(25% - 20px);
        max-width: 600px;
        min-width: 360px;
        height: 92px;
        .create-from-template {
          text-align: right;
          font-size: 12px;
          margin-top: 10px;
        }
        .icon-import-template {
          display: inline-block;
          width: 15px;
          height: 15px;
          background: url('../../../../../assets/icons/icon-import-template.svg') no-repeat center;
          background-size: contain;
          vertical-align: -3px;
        }
      }
      .scenario-grid {
        display: flex;
        flex-direction: column;
        flex: 0 0 350px;
        max-width: 320px;
        height: 106px;
        border: 1px solid $color-borderline;
        box-shadow:0px 2px 5px 0px rgba(0,0,0,0.08);
        border-radius:2px;
        margin-right: 30px;
        margin-bottom: 20px;
        padding: 10px 20px 15px;
        transition: all .2s ease-in-out;

        &:hover {
          box-shadow: 0 4px 9px 0 rgba(115, 115, 115, 0.2), 0 5px 8px 0 rgba(228, 228, 228, 0.5);
          .card-title {
            .card-title-edit {
              visibility: visible;
            }
          }
        }
        &.addnewScene{
          text-align: center;
        }
        .toggle {
          margin-top: 5px;
        }

        .scenario-title {
          flex: 1 1 auto;
          display: flex;
          justify-content: space-between;
          .name-box {
            display: flex;
            flex-flow: row nowrap;
            width: calc(100% - 28px);
          }
          .icon-box {
            display: flex;
            margin-right: 5px;
          }
          .name-label {
            flex: 1 1 auto;
            max-width: calc(100% - 24px);
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            font-size: 16px;
            padding: 5px 2px;
            box-sizing: border-box;
            @include click-button();
          }
          textarea.name-label {
            padding: 0px 2px;
            white-space: inherit;
            line-height: 25px;
            max-height: 50px;
            width: calc(100% - 24px);
            overflow-y: auto;
            font-size: 16px;
            color: #333333;
            border-radius: 3px;
            border-color: #dbdbdb;
            // background-color: #f4f7fd;
          }
        }
        .scenario-content {
          position: relative;
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          align-items: center;
          justify-content: flex-end;
          .text-button{
            margin-right: 10px;
          }
          .txt-btn {
            text-align: center;
            cursor: pointer;
            margin-right: 10px;
            width: 30px;
            height: 30px;
            background: rgba(238,239,248,1);
            border-radius: 7px;
            padding: 6px 0px;
          }
          .edit-btn{
            margin-left: 10px;
            text-align: center;
            width: 30px;
            height: 30px;
            background: rgba(61,75,99,1);
            border-radius: 7px;
            padding: 6px 0px;
          }
          .incon-size{
            width: 18px;
            height: 18px;
          }
          .showid{
            position: absolute;
            left: 250px;
            top: 0px;
            border-radius: 50%;
            height: 20px;
            width:20px;
            margin-top: 10px;
            background: rgba(190, 186, 186, 0.5);
            color: rgb(28, 42, 240);
            font-weight: 600;
            line-height: 20px;
            text-align: center;
          }
        }
      }
    }
  }
}
$marginLeft: 80px;
$textWidth: 378px;
$titleFontSize: 38px;
$helpFontSize: 16px;
$btnMarginTop: 43px;
.center-msg {
  margin-left: $marginLeft;
  width: $textWidth;

  .title {
    color: $color-font-active;
    width: $textWidth;
    font-size: $titleFontSize;
  }
  .start-scenario {
    margin-top: $btnMarginTop;
    & > * {
      margin-right: 20px;
    }
  }
}
.model-help {
  display: flex;
  width: 100%;
  color: $color-primary;
  font-size: $helpFontSize;
  margin-top: 20px;
  line-height: 24px;

  .upload-data {
    padding-left: 32px;
  }

  &.top {
    width: auto;
    margin: 0;
    font-size: 14px;
  }
}
</style>
