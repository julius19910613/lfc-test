<template>
<div id="node-edit-page" :style="pageStyle">
   <div class="edit-header">
     <input type="text" class="edit-name" v-show="editHeaderFlag" v-model="edgeName" @keyup.enter="editHeaderFlag=false" @blur="editHeaderFlag=false">
     <span class="edit-name" v-show="!editHeaderFlag">{{edgeName}}</span>
     <div class="edit-icon" @click="editHeaderFlag=true" >
       <i class="emoti-icon icon-edit"></i>
     </div>
     <div style="margin-left: 10px;font-size:12px;color: #666;">
       （ <span>{{nodeType === 'sub_scenario'?'功能节点':'对话节点'}}</span> - {{extData.nodeId}}）
     </div>
   </div>
   <div class="nav-bar">
    <template v-if="nodeType !== 'sub_scenario'" v-for="(tab, idx) in tabs">
      <div class="tab-button"
        :key="tab.type"
        :class="{ 'active': tab.type === currentTab }"
        @click="changeTab(tab.type)">
        <span>{{idx+1}}</span>
        <div class="tab-name">{{ tab.name }}</div>
      </div>
      <div class="dashed-line" v-show="idx+1 !== tabsLength"> ------- </div>
    </template>
  </div>
  <div class="content">
     <sub-scenario-editPop
        v-if="nodeType === 'sub_scenario'"
        :subedges="subedges"
        :initialToNodeOptions="toNodeOptions"
        :node="node"
        :edgeTab2 ="edgeTab2"
        @update="edgeTab2 = $event"
        @updateNewNodeOptions="updateNewNodeOptions"
      ></sub-scenario-editPop>
    <keep-alive>
      <trigger-edit-tab ref="triggerTab"
        v-if="currentTab === 'triggerTab'"
        :triggerTab="triggerTab"
        :globalVarOptions="globalVarOptions"
        :mapTableOptions="mapTableOptions"
        :jsCodeAlias="jsCodeAlias"
        :nodeId="nodeId"
        @update:valid="updateTabValidStatus('triggerTab', $event)"
        @update="triggerTab = $event"
      ></trigger-edit-tab>
      <setting-edit-tab ref="settingTab"
        v-if="currentTab === 'settingTab'"
        :settingTab="settingTab"
        :globalVarOptions="globalVarOptions"
        :nodeType="nodeType"
        @update:valid="updateTabValidStatus('settingTab', $event)"
        @update="settingTab = $event"
      ></setting-edit-tab>
      <setting-edit-tab2 ref="dialogue2SettingTab"
        v-if="currentTab === 'dialogue2SettingTab'"
        :settingTab="dialogue2SettingTab"
        :scenarioId = extData.scenarioId
        :globalVarOptions="globalVarOptions"
        :nodeType="nodeType"
        @update:valid="updateTabValidStatus('dialogue2SettingTab', $event)"
        @update="dialogue2SettingTab = Object.assign($event, {'failureResponse': dialogue2SettingTab.failureResponse})"
      ></setting-edit-tab2>
      <setting-basic-edit-tab ref="settingBasicTab"
        v-if="currentTab === 'settingBasicTab'"
        :settingBasicTab="settingBasicTab"
        @update:valid="updateTabValidStatus('settingBasicTab', $event)"
        @update="settingBasicTab = $event"
      ></setting-basic-edit-tab>
      <entity-collecting-edit-tab ref="entityCollectingTab"
        v-if="currentTab === 'entityCollectingTab'"
        :initialEntityCollectorList="entityCollectingTab.entityCollectorList || []"
        :initialIdToNerMap="{}"
        :initialRelatedEntities="entityCollectingTab.relatedEntities || {}"
        :initialREParsers="entityCollectingTab.re_parsers || []"
        :initialTDESetting="entityCollectingTab.tde_setting || {}"
        :initialRegisterJSON="entityCollectingTab.register_json || {}"
        @update:valid="updateTabValidStatus('entityCollectingTab', $event)"
        @update="entityCollectingTab.entityCollectorList = $event"
        @updateREParsers="entityCollectingTab.re_parsers = $event"
        @updateTDESetting="entityCollectingTab.tde_setting = $event"
        @updateRegisterJSON="entityCollectingTab.register_json = $event"
      ></entity-collecting-edit-tab>
      <action-edit-tab ref="actionTab"
        v-if="currentTab === 'actionTab'"
        :actionTab="actionTab"
        :initialEntityCollectorList="globalVarOptions"
        :initialToNodeOptions="toNodeOptions"
        :version="extData.version"
        @update:valid="updateTabValidStatus('actionTab', $event)"
        @update="actionTab = $event"
        @updateNewNodeOptions="updateNewNodeOptions"
      ></action-edit-tab>
      <params-collecting-edit-tab ref="paramsCollectingTab"
        v-if="currentTab === 'paramsCollectingTab'"
        :paramsCollectingTab="paramsCollectingTab"
        :mapTableOptions="mapTableOptions"
        :nodeId="nodeId"
        @update:valid="updateTabValidStatus('paramsCollectingTab', $event)"
        @update="paramsCollectingTab = $event"
      ></params-collecting-edit-tab>
      <params-collecting-edge-edit-tab ref="paramsCollectingEdgeTab"
        v-if="currentTab === 'paramsCollectingEdgeTab'"
        :paramsCollectingEdgeTab="paramsCollectingEdgeTab"
        :initialToNodeOptions="toNodeOptions"
        :globalVarOptions="globalVarOptions"
        :mapTableOptions="mapTableOptions"
        :jsCodeAlias="jsCodeAlias"
        :nodeId="nodeId"
        :nodeType="nodeType"
        @update:valid="updateTabValidStatus('paramsCollectingEdgeTab', $event)"
        @update="paramsCollectingEdgeTab = $event"
        @updateNewNodeOptions="updateNewNodeOptions"
      ></params-collecting-edge-edit-tab>
      <edge-edit-tab ref="edgeTab"
        v-if="currentTab === 'edgeTab'"
        :edgeTab="edgeTab"
        :initialToNodeOptions="toNodeOptions"
        :globalVarOptions="globalVarOptions"
        :mapTableOptions="mapTableOptions"
        :jsCodeAlias="jsCodeAlias"
        :nodeId="nodeId"
        :nodeType="nodeType"
        @update:valid="updateTabValidStatus('edgeTab', $event)"
        @update="edgeTab = $event"
        @updateNewNodeOptions="updateNewNodeOptions"
      ></edge-edit-tab>
      <edge-edit-tab2 ref="edgeTab2"
        v-if="currentTab === 'edgeTab2'"
        :edgeTab="edgeTab2"
        :initialToNodeOptions="toNodeOptions"
        :globalVarOptions="globalVarOptions"
        :mapTableOptions="mapTableOptions"
        :jsCodeAlias="jsCodeAlias"
        :nodeId="nodeId"
        :nodeType="nodeType"
        :scenarioId = extData.scenarioId
        :ttsInfo="ttsInfo"
        :failureResponse="dialogue2SettingTab.failureResponse"
        @update:valid="updateTabValidStatus('edgeTab2', $event)"
        @update="edgeTab2 = $event"
        @updateNewNodeOptions="updateNewNodeOptions"
        @updateFailureResponse="dialogue2SettingTab.failureResponse = $event"
      ></edge-edit-tab2>
      <!-- <sub-scenario-tab ref="subScenarioTab"
        v-if="currentTab === 'subScenarioTab'"
        :edgeTab="subScenarioTab"
        :initialToNodeOptions="toNodeOptions"
        :globalVarOptions="globalVarOptions"
        :mapTableOptions="mapTableOptions"
        :jsCodeAlias="jsCodeAlias"
        :nodeId="nodeId"
        :nodeType="nodeType"
        @update:valid="updateTabValidStatus('subScenarioTab', $event)"
        @update="subScenarioTab = $event"
        @updateNewNodeOptions="updateNewNodeOptions"
      ></sub-scenario-tab> -->
      <restful-setting-edit-tab ref="restfulSettingTab"
        v-if="currentTab === 'restfulSettingTab'"
        :initialRestfulSettingTab="restfulSettingTab"
        :initialToNodeOptions="toNodeOptions"
        @update:valid="updateTabValidStatus('restfulSettingTab', $event)"
        @update="restfulSettingTab = $event"
      ></restful-setting-edit-tab>
      <restful-edge-edit-tab ref="restfulEdgeTab"
        v-if="currentTab === 'restfulEdgeTab'"
        :nodeId="node.nodeId"
        :initialRestfulEdgeTab="restfulEdgeTab"
        :initialToNodeOptions="toNodeOptions"
        @update:valid="updateTabValidStatus('restfulEdgeTab', $event)"
        @update="restfulEdgeTab = $event"
        @updateNewNodeOptions="updateNewNodeOptions"
      ></restful-edge-edit-tab>
      <voice-setting-tab ref="voiceSettingTab2"
        v-if="currentTab === 'voiceSettingTab2'"
        :nodeId="nodeId"
        :ttsInfo="ttsInfo"
        :scenarioId = extData.scenarioId
        @update="ttsInfo = $event"
        @update:valid="updateTabValidStatus('voiceSettingTab2', $event)"
      ></voice-setting-tab>
      <understand-setting-tab ref="understandSetting2"
       v-if="currentTab === 'understandSetting2'"
       :understandTab="understandTab"
        @update="understandTab = $event"
        @update:valid="updateTabValidStatus('understandSetting2', $event)"
      >
      </understand-setting-tab>
    </keep-alive>
  </div>
</div>
</template>

<script>
import { mapGetters } from 'vuex';
import general from '@/modules/TaskEngine/_utils/general';
import mappingtable from '@/modules/TaskEngine/_api/taskEngine_mappingtable';
import EntityCollectingEditTab from '@/modules/TaskEngine/TaskEngineV3/src/components/EntityCollectingPage';
import TriggerEditTab from './TriggerEditTab';
import SettingEditTab from './SettingEditTab';
import EdgeEditTab from './EdgeEditTab';
import EdgeEditTab2 from './EdgeEditTab2';
import SubScenarioTab from './SubScenarioTab';
import ParamsCollectingEditTab from './ParamsCollectingEditTab';
import ParamsCollectingEdgeEditTab from './ParamsCollectingEdgeEditTab';
import SettingBasicEditTab from './SettingBasicEditTab';
import RestfulSettingEditTab from './RestfulSettingEditTab';
import RestfulEdgeEditTab from './RestfulEdgeEditTab';
// import ActionEditTab from '@/modules/TaskEngine/TaskEngineV3/src/components/ActionPage';
import ActionEditTab from './ActionEditTab';
import SettingEditTab2 from './SettingEditTab2';
import VoiceSettingTab from './voiceSettingTab';
import optionConfig from '../_utils/optionConfig';
import scenarioConvertor from '../_utils/scenarioConvertor';
import scenarioInitializer from '../_utils/scenarioInitializer';
import subScenarioEditPop from './SubScenarioEditPop';
import understandSettingTab from './understandSettingTab';

export default {
  name: 'node-edit-page',
  api: mappingtable,
  components: {
    'trigger-edit-tab': TriggerEditTab,
    'setting-edit-tab': SettingEditTab,
    'setting-basic-edit-tab': SettingBasicEditTab,
    'edge-edit-tab': EdgeEditTab,
    'entity-collecting-edit-tab': EntityCollectingEditTab,
    'action-edit-tab': ActionEditTab,
    'restful-setting-edit-tab': RestfulSettingEditTab,
    'restful-edge-edit-tab': RestfulEdgeEditTab,
    'params-collecting-edit-tab': ParamsCollectingEditTab,
    'params-collecting-edge-edit-tab': ParamsCollectingEdgeEditTab,
    'sub-scenario-editPop': subScenarioEditPop,
    understandSettingTab,
    SettingEditTab2,
    EdgeEditTab2,
    SubScenarioTab,
    VoiceSettingTab,
  },
  props: {
    extData: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapGetters([
      'voiceSet',
      'robotID',
    ]),
  },
  data() {
    // reserve original node json string
    const { warnings, ...nodeWithoutWarnings } = this.extData.node;
    const edgeName = this.extData.nodeName;
    const originalNodeString = JSON.stringify(nodeWithoutWarnings, general.JSONStringifyReplacer);
    // parse node
    const node = JSON.parse(JSON.stringify(this.extData.node));
    const toNodeOptions = JSON.parse(JSON.stringify(this.extData.toNodeOptions));
    const globalVarOptionsMap = JSON.parse(JSON.stringify(this.extData.globalVarOptionsMap));
    const nodeType = node.nodeType;
    // render tab data
    let tabs = [];
    const nodeType2TabsMap = optionConfig.nodeType2Tabs();
    if (nodeType in nodeType2TabsMap) {
      tabs = nodeType2TabsMap[nodeType];
    }
    let triggerTab;
    let settingTab;
    let edgeTab;
    let entityCollectingTab;
    let settingBasicTab;
    let paramsCollectingTab;
    let paramsCollectingEdgeTab;
    let restfulSettingTab;
    let restfulEdgeTab;
    let actionTab;
    let dialogue2SettingTab;
    let edgeTab2;
    let ttsInfo;
    let subScenarioTab;
    let understandTab;
    tabs.forEach((tab) => {
      if (tab === 'triggerTab') {
        triggerTab = node.triggerTab;
      } else if (tab === 'settingTab') {
        settingTab = node.settingTab;
      } else if (tab === 'edgeTab') {
        if (node.edgeTab === undefined) {
          // only happen to old action node
          // initial edgeTab to action node
          node.edgeTab = scenarioInitializer.initialEdgeTab(nodeType);
        }
        edgeTab = node.edgeTab;
      } else if (tab === 'entityCollectingTab') {
        entityCollectingTab = node.entityCollectingTab;
      } else if (tab === 'settingBasicTab') {
        settingBasicTab = node.settingBasicTab;
      } else if (tab === 'paramsCollectingTab') {
        paramsCollectingTab = node.paramsCollectingTab;
      } else if (tab === 'paramsCollectingEdgeTab') {
        paramsCollectingEdgeTab = node.paramsCollectingEdgeTab;
      } else if (tab === 'restfulSettingTab') {
        restfulSettingTab = node.restfulSettingTab;
      } else if (tab === 'restfulEdgeTab') {
        restfulEdgeTab = node.restfulEdgeTab;
      } else if (tab === 'actionTab') {
        actionTab = node.actionTab;
      } else if (tab === 'dialogue2SettingTab') {
        dialogue2SettingTab = node.dialogue2SettingTab;
      } else if (tab === 'edgeTab2') {
        edgeTab2 = node.edgeTab2;
      } else if (tab === 'voiceSettingTab2') {
        ttsInfo = node.ttsInfo;
      } else if (tab === 'subScenarioTab') {
        subScenarioTab = node.subScenarioTab;
      } else if (tab === 'understandSetting2') {
        understandTab = node.understandTab;
      }
    });
    let currentTab;
    if (nodeType === 'sub_scenario') {
      currentTab = -1;
    } else {
      currentTab = this.extData.currentTab || tabs[0];
    }
    const allTabs = this.getAllTabs();
    tabs = tabs.map((t) => {
      const tab = allTabs[t];
      tab.valid = true;
      return tab;
    });
    const tabsLength = tabs.length;
    const jsCodeAlias = this.extData.jsCodeAlias || [];
    const subedges = this.extData.subedges;
    return {
      currentTab,
      tabs,
      tabsLength,
      originalNodeString,
      node,
      nodeType,
      nodeId: node.nodeId,
      toNodeOptions,
      globalVarOptions: [],
      globalVarOptionsMap,
      mapTableOptions: [],
      triggerTab,
      settingTab,
      settingBasicTab,
      entityCollectingTab,
      paramsCollectingTab,
      paramsCollectingEdgeTab,
      edgeTab,
      edgeTab2,
      subScenarioTab,
      restfulSettingTab,
      restfulEdgeTab,
      actionTab,
      dialogue2SettingTab,
      newNodeOptions: undefined,
      pageStyle: {
        width: '880px',
      },
      jsCodeAlias,
      ttsInfo,
      edgeName,
      editHeaderFlag: false,
      subedges,
      understandTab,
    };
  },
  watch: {
    nodeType() {
      if (this.nodeType && this.nodeType === 'nlu_pc') {
        this.pageStyle = {
          width: '1060px',
        };
      }
    },
    triggerTab: {
      handler() {
        this.collectGlobalVarOptions();
      },
    },
    settingTab: {
      handler() {
        this.collectGlobalVarOptions();
      },
    },
    settingBasicTab: {
      handler() {
        this.collectGlobalVarOptions();
      },
    },
    entityCollectingTab: {
      handler() {
        this.collectGlobalVarOptions();
      },
    },
    paramsCollectingTab: {
      handler() {
        this.collectGlobalVarOptions();
      },
    },
    paramsCollectingEdgeTab: {
      handler() {
        this.collectGlobalVarOptions();
      },
    },
    edgeTab: {
      handler() {
        this.collectGlobalVarOptions();
      },
    },
    edgeTab2: {
      handler() {
        this.collectGlobalVarOptions();
      },
    },
    subSenarioTab: {
      handler() {
        this.collectGlobalVarOptions();
      },
    },
    restfulSettingTab: {
      handler() {
        this.collectGlobalVarOptions();
      },
    },
    restfulEdgeTab: {
      handler() {
        this.collectGlobalVarOptions();
      },
    },
    actionTab: {
      handler() {
        this.collectGlobalVarOptions();
      },
    },
    dialogue2SettingTab: {
      handler() {
        this.collectGlobalVarOptions();
      },
    },
    ttsInfo: {
      handler() {
        this.collectGlobalVarOptions();
      },
    },
  },
  methods: {
    updateNewNodeOptions(newNodeOptions) {
      this.newNodeOptions = newNodeOptions;
    },
    collectGlobalVarOptions() {
      const nodeResult = this.composeNodeResult();
      const dummySetting = { // only want to get global vars so use dummy setting
        scenarioName: '',
        scenarioDialogueCntLimit: 0,
        nodeDialogueCntLimit: 0,
      };
      const edges = scenarioConvertor.convertUiNodeToEdges(
        nodeResult,
        dummySetting,
        this.extData.globalEdges,
      );
      let nodeVars = [...scenarioConvertor.getGlobalVars(edges)];
      if (this.nodeType === 'restful') {
        nodeVars.push(nodeResult.restfulSettingTab.rtnVarName);
      } else if (this.nodeType === 'parameter_collecting') {
        nodeVars.push(...scenarioConvertor.getGlobalVarsFromParsers(
          scenarioConvertor.composePCContent(nodeResult.paramsCollectingTab.params).parsers,
        ));
      } else if (this.nodeType === 'nlu_pc') {
        nodeVars.push(...scenarioConvertor.composeNLUPCContent(
            nodeResult.entityCollectingTab.entityCollectorList,
            nodeResult.entityCollectingTab.re_parsers,
            nodeResult.entityCollectingTab.register_json,
          ).entities.map(entity => entity.entityName),
        );
      } else if (this.nodeType === 'action') {
        const vars = scenarioConvertor.getGlobalVarsFromActionGroup(
          nodeResult.actionTab.actionGroupList,
        );
        nodeVars.push(...vars);
      }
      nodeVars = [...new Set(nodeVars)];
      const nodeVarsOptions = nodeVars.map(v => ({
        text: nodeResult.nodeName,
        value: v,
      }));
      this.globalVarOptionsMap[nodeResult.nodeId] = nodeVarsOptions;
      this.globalVarOptions = [];
      Object.values(this.globalVarOptionsMap).forEach((globalVarOption) => {
        this.globalVarOptions.push(...globalVarOption);
      });
    },
    changeTab(tab) {
      this.currentTab = tab;
    },
    getAllTabs() {
      return {
        triggerTab: {
          type: 'triggerTab',
          name: this.$t('task_engine_v2.node_edit_page.tabs.trigger'),
          icon: 'setting',
        },
        settingTab: {
          type: 'settingTab',
          name: this.$t('task_engine_v2.node_edit_page.tabs.setting'),
          icon: 'setting',
        },
        settingBasicTab: {
          type: 'settingBasicTab',
          name: this.$t('task_engine_v2.node_edit_page.tabs.setting'),
          icon: 'setting',
        },
        edgeTab: {
          type: 'edgeTab',
          name: this.$t('task_engine_v2.node_edit_page.tabs.edge'),
          icon: 'setting',
        },
        edgeTab2: {
          type: 'edgeTab2',
          name: this.$t('task_engine_v2.node_edit_page.tabs.edge'),
          icon: 'setting',
        },
        subScenarioTab: {
          type: 'subScenarioTab',
          name: this.$t('task_engine_v2.node_edit_page.tabs.sub_scenario'),
          icon: 'setting',
        },
        entityCollectingTab: {
          type: 'entityCollectingTab',
          name: this.$t('task_engine_v3.scenario_edit_page.tab.entity_collecting'),
          icon: 'setting',
        },
        restfulSettingTab: {
          type: 'restfulSettingTab',
          name: this.$t('task_engine_v2.node_edit_page.tabs.setting'),
          icon: 'setting',
        },
        restfulEdgeTab: {
          type: 'restfulEdgeTab',
          name: this.$t('task_engine_v2.node_edit_page.tabs.edge'),
          icon: 'setting',
        },
        paramsCollectingTab: {
          type: 'paramsCollectingTab',
          name: this.$t('task_engine_v2.node_edit_page.tabs.params_collecting'),
          icon: 'setting',
        },
        paramsCollectingEdgeTab: {
          type: 'paramsCollectingEdgeTab',
          name: this.$t('task_engine_v2.node_edit_page.tabs.edge'),
          icon: 'setting',
        },
        actionTab: {
          type: 'actionTab',
          name: this.$t('task_engine_v2.node_edit_page.tabs.action'),
          icon: 'setting',
        },
        dialogue2SettingTab: {
          type: 'dialogue2SettingTab',
          name: this.$t('task_engine_v2.node_edit_page.tabs.setting'),
          icon: 'setting',
        },
        voiceSettingTab2: {
          type: 'voiceSettingTab2',
          name: this.$t('task_engine_v2.node_edit_page.tabs.voice'),
          icon: 'setting',
        },
        understandSetting2: {
          type: 'understandSetting2',
          name: this.$t('task_engine_v2.node_edit_page.tabs.understanding'),
          icon: 'setting',
        },
      };
    },
    loadMappingTableOptions() {
      const that = this;
      const mapTables = [];
      this.$api.getTemplateMappingList().then((templateData) => {
        mapTables.push(...templateData.data);
        this.$api.getMappingList(that.appId).then((data) => {
          mapTables.push(...data.data);
          this.mapTableOptions = mapTables.map(table => ({
            text: table,
            value: table,
          }));
        });
      });
    },
    validResult(nodeResult) { // eslint-disable-line
      return true;
    },
    composeNodeResult() {
      const nodeResult = {
        nodeId: this.node.nodeId,
        nodeName: this.edgeName,
        nodeType: this.node.nodeType,
        triggerTab: this.triggerTab,
        settingTab: this.settingTab,
        edgeTab: this.edgeTab,
        edgeTab2: this.edgeTab2,
        subScenarioTab: this.subScenarioTab,
        entityCollectingTab: this.entityCollectingTab,
        settingBasicTab: this.settingBasicTab,
        restfulSettingTab: this.restfulSettingTab,
        restfulEdgeTab: this.restfulEdgeTab,
        paramsCollectingTab: this.paramsCollectingTab,
        paramsCollectingEdgeTab: this.paramsCollectingEdgeTab,
        dialogue2SettingTab: this.dialogue2SettingTab,
        actionTab: this.actionTab,
        ttsInfo: this.ttsInfo,
        understandTab: this.understandTab,
      };
      return nodeResult;
    },
    updateTabValidStatus(tabType, valid) {
      this.tabs.find(tab => tab.type === tabType).valid = valid;
    },
    validate() {
      for (let i = 0; i < this.tabs.length; i += 1) {
        const tab = this.tabs[i];
        if (!tab.valid) {
          this.currentTab = tab.type;
          this.$nextTick(() => {
            this.$refs[this.currentTab].$emit('showToolTip');
          });
          return;
        }
      }
      const nodeResult = this.composeNodeResult();
      if (this.validResult(nodeResult)) {
        this.$emit(
            'validateSuccess',
            { nodeResult, newNodeOptions: this.newNodeOptions },
          );
      }
    },
    cancelValidate() {
      const nodeResult = this.composeNodeResult();
      const newNodeString = JSON.stringify(nodeResult, general.JSONStringifyReplacer);
      // console.log(JSON.parse(newNodeString), JSON.parse(this.originalNodeString));
      if (newNodeString === this.originalNodeString) {
        this.$emit('cancelValidateSuccess');
      } else {
        this.$emit('showReminder', {
          buttonRef: 'cancelBtn',
          content: this.$t('task_engine_v2.node_edit_page.popup.content'),
          ok_msg: this.$t('task_engine_v2.node_edit_page.popup.confirm'),
          cancel_msg: this.$t('task_engine_v2.node_edit_page.popup.cancel'),
          cancel: () => { },
          ok: () => { this.$emit('cancelValidateSuccess'); },
        });
      }
    },
  },
  beforeMount() {
    this.loadMappingTableOptions();
    this.collectGlobalVarOptions();
    const oldttsInfo = JSON.parse(this.originalNodeString).ttsInfo;
    // 语音开关为关闭 且该Task上原本带有ttsInfo;
    if (!this.voiceSet && oldttsInfo) {
      this.ttsInfo = oldttsInfo;
    }
  },
  mounted() {
    this.appId = this.robotID;
    this.$on('validate', this.validate);
    this.$on('cancelValidate', this.cancelValidate);
  },
};
</script>

<style lang="scss" scoped>
#node-edit-page {
  height: 70vh;
  display: flex;
  flex-direction: column;
  .edit-header{
    flex: 0 0 57px;
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: 16px;
    padding-left: 20px;
    border-bottom: 1px solid #cecece;
    .edit-name{
      margin-right: 10px;
    }
  }
  .nav-bar{
    display: flex;
    flex-direction: row;
    // flex: 0 0 60px;
    padding-left: 20px;
    .dashed-line {
      margin: 27px 0;
      width: 61px;
      height: 25px;
      line-height: 25px;
      color: #cdcdcd;
      text-align: center;
    }
    .tab-button{
      display: flex;
      flex-direction: row;
      height: 25px;
      padding: 7px 15px;
      line-height: 25px;
      font-size: 12px;
      color: $color-font-normal;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      border-radius: 12.5px;
      background: rgba(234,236,239,1);
      margin: 27px 0;
      // &:hover{
      //   transition: border 0.3s ease;
      //   border-right: 2px solid #DDDDDD;
      // }
      &.active{
        color: white;
        background: rgba(24,117,240,1);
      }
      .tab-name{
        margin-left: 8px;
      }
    }
  }
  .content{
    flex: 1 1 auto;
    @include auto-overflow();
    @include customScrollbar();
  }
}
</style>
<style lang="scss">
#node-edit-page {
  button {
    outline: none;
  }
}
</style>
