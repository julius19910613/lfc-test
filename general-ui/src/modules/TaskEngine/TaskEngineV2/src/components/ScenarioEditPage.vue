<template>
<div id="scenario-edit-page" @wheel="onPageWheel()">
  <div class="browse-window" ref="window">
    <div class="header">
      <div class="scenario_name input-wrapper">
        <input
          ref="scenarioName"
          class="scenario-name"
          :value="moduleData.metadata.scenario_name"
          @blur="saveScenario()"
          @input="setting.scenarioName = $event.target.value"/>
        <icon class="icon visibility" :size="24" icon-type="edit_pen_1" @click="$refs.scenarioName.focus()"></icon>
      </div>
      <div class="left_wrap">
        <div  class="swicth_btn">
           {{$t('task_engine_v2.scenario_edit_page.switch')}}
        </div>
        <div class="swicth_btn toggle_btn">
          <toggle  v-model="enable" @change="switchScenario($event)" size="medium" :showLabel="true" :label="toggleLabel"></toggle>
        </div>
        <div @click="$router.replace('/task-engine-scenario-v2')" class="header-btn"> 
          <emoti-icon name="icon-arrow-left" :size="16"  class="magin_r"></emoti-icon>
          <span>{{$t('task_engine_v2.scenario_edit_page.back_to_scenario_list')}}</span>
        </div>
        <div @click="exportScenario" class="header-btn">
          <emoti-icon name="icon-export" :size="16" class="magin_r"></emoti-icon>
          {{$t('task_engine_v2.scenario_edit_page.export')}}
        </div>
        <div v-dropdown="advancedConfigOptions" class="header-btn">
          <emoti-icon name="icon-category" :size="16" class="magin_r"></emoti-icon>
          {{$t('task_engine_v2.scenario_edit_page.set_more')}}
        </div>
        <div  @click="showNodeOptions = !showNodeOptions"
        :class="showNodeOptions ? 'expand_rect_bule': ''"
        class="header-btn"
        >
          <emoti-icon :normalColor="showNodeOptions? 'white': ''" name="icon-model" :size="16" class="magin_r"s></emoti-icon>
          {{$t('task_engine_v2.scenario_edit_page.scenario_on_off')}}
        </div>
      </div>
    </div>
    <div class='canvas-container' ref='container'>
      <div class="canvas-page"
        id="canvas-page"
        ref="page"
        :style="canvasStyle"
        @drop="nodeOptionDrop($event)"
        @dragover="nodeOptionDragOver($event)"
        @mousemove="canvasMouseMove"
        @mouseup="canvasMouseUp"
        @click="canvasClick">
          <div :style="{width: '100%', height: '100%', transform: `scale(${zoom})`, transformOrigin: '0 0'}">
          <template v-for="(nodeBlock, index) in nodeBlocks">
            <node-block class="block"
              :scenarioId="scenarioId"
              :ref="`nodeBlock_${index}`"
              :key="nodeBlock.data.nodeId"
              :x="nodeBlock.x"
              :y="nodeBlock.y"
              :nodeBlockWidth="nodeBlockWidth"
              :nodeBlockHeight="nodeBlockHeight"
              :nodeTypeName="getNodeTypeName(nodeBlock.data.nodeType)"
              :initialNode="nodeBlock.data"
              :initialGlobalEdges="globalEdges"
              :toNodeOptions="toNodeOptions"
              :globalVarOptionsMap="globalVarOptionsMap"
              :linking="linking"
              :version="moduleData.version"
              :jsCodeAlias="jsCodeAlias"
              @updatePosition="updateNodePosition(index, $event)"
              @savePosition="saveScenario()"
              @deleteNode="deleteNode(index)"
              @addTempNodes="addTempNodes(index, $event)"
              @saveNode="saveNode(index, $event)"
              @copyNode="copyNode(index)"
              @linkingStart="linkingStart(index, $event)"
              @linkingStop="linkingStop(index, $event)"
              @mouseEnterDstSlot="mouseEnterDstSlot(index, $event)"
              @mouseLeaveDstSlot="mouseLeaveDstSlot()">
            </node-block>
          </template>
          <edges class="edges"
            ref="edges"
            :edges="filteredEdges"
          ></edges>
          <edges-on-top class="edgesOnTop"
            ref="edgesOnTop"
            :linkingEdge="linkingEdge"
          ></edges-on-top>
        </div>
      </div>
    </div>
    <div class="addNewEdgeDropdown"
      ref="addNewEdgeDropdown"
      v-dropdown="addNewEdgeDropdown"
      :style="addNewEdgeDropdownStyle"
      @dropdownHidden="dropdownHidden()">
    </div>
  </div>
  <div v-if="moduleData.metadata" class="side-panel" :class="{collapse: !showNodeOptions}">
    <!-- <div class="first-row">
      <icon class="icon" iconType="back_light" :size="12" @click="$router.replace('/task-engine-scenario-v2')"></icon>
      <div class="input-wrapper">
        <input
          ref="scenarioName"
          class="scenario-name"
          :value="moduleData.metadata.scenario_name"
          @blur="saveScenario()"
          @input="setting.scenarioName = $event.target.value"/>
        <icon class="icon visibility" :size="24" icon-type="edit_pen_1" @click="$refs.scenarioName.focus()"></icon>
      </div>
      <div class="divide"></div>
      <icon class="icon" :iconType="showNodeOptions ? 'collapse' : 'expand_rect'" :size="12" @click="showNodeOptions = !showNodeOptions"></icon>
    </div>
    <div class="second-row" v-if="showNodeOptions">
      <div class="group">
        <span v-t="'task_engine_v2.scenario_edit_page.switch'"></span>
        <toggle v-model="enable" @change="switchScenario($event)" size="medium" :showLabel="true" :label="toggleLabel"></toggle>
      </div>
      <div class="group">
        <span v-t="'general.export'"></span>
        <button class="export" @click="exportScenario">
          <img iconType="export_1" src="@/assets/icons/export_1_icon.svg" alt=" "></icon>
        </button>
      </div>
      <div class="group">
        <span v-t="'task_engine_v2.scenario_edit_page.more'"></span>
        <icon class="icon" :size="28" icon-type="more_v" v-dropdown="advancedConfigOptions"></icon>
      </div>
    </div> -->
    <div class="third-row" v-if="showNodeOptions">
<!--      <span class="instruction" v-t="'task_engine_v2.scenario_edit_page.add_node_instruction'"></span>-->
       <div>
        <div class="toolbar-title">
          <span class="instruction" v-t="'task_engine_v2.scenario_edit_page.add_node_instruction'"></span>
        </div>
        <ul class="node-options" >
          <template v-for="nodeOption in nodeOptions" v-if="enable_node[nodeOption.type]">
            <li
              class="node-option"
              draggable="true"
              @dragstart="nodeOptionDragStart(nodeOption.type, nodeOption.name, $event);">
              <img class="node-icon" :src="nodeOption.image" alt="...">
              <div class="node-label">
                <div class="node-name">{{nodeOption.name}}</div>
                <div class="node-description">{{nodeOption.description}}</div>
              </div>
            </li>
          </template>
        </ul>
        <div class="funcTemplate" v-if="funcScenFlag">
          <div class="toolbar-title">
            功能场景模版
          </div>
          <ul class="node-options">
              <li
                v-for="nodeOption in nodefuncs"
                class="node-option"
                draggable="true"
                @dragstart="nodeOptionDragStart(nodeOption.type, nodeOption.scenarioName, $event, nodeOption.scenarioID);">
                 <img class="node-icon" :src="funcImg" alt="...">
                <div class="node-label">
                  <div class="node-name">{{nodeOption.scenarioName}}</div>
                  <!-- <div class="node-description">{{nodeOption.description}}</div> -->
                </div>
              </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
  <div class="zoom-tool">
    <button v-show="debugInfoEnv" class="wrapper" @click="clearShowNode" style="padding-right:5px;padding-left:5px;cursor: pointer;">
      清空标记
    </button>
    <div v-show="debugInfoEnv" class="divide"></div>
    <button class="wrapper" @click="zoom += 0.1;">
      <!-- <img src="@/assets/icons/zoom_in.svg"/> -->
      <emoti-icon name="icon-zoom-up" :size="22"></emoti-icon>
    </button>
    <div class="divide"></div>
    <button class="wrapper" @click="zoomOut">
      <!-- <img src="@/assets/icons/zoom_out.svg"/> -->
      <emoti-icon name="icon-zoom-down" :size="22"></emoti-icon>
    </button>
    <div class="divide"></div>
    <button class="wrapper" @click="zoom = 1;">
      <!-- <img src="@/assets/icons/recover_origin.svg"/> -->
      <emoti-icon name="icon-fullscreen" :size="22"></emoti-icon>
    </button>
  </div>
</div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import bus from '@/components/bus';
import taskEngineApi from '@/modules/TaskEngine/_api/taskEngine';
import nerFactoryDalApi from '@/modules/TaskEngine/_api/nerFactoryDal';
import general from '@/modules/TaskEngine/_utils/general';
import NodeBlock from './NodeBlock';
import Edges from './Edges';
import EdgesOnTop from './EdgesOnTop';
import GlobalEdgeEditPop from './GlobalEdgeEditPop';
import VarTemplateEditPop from './VarTemplateEditPop';
import ScenarioInfoPop from './ScenarioInfoPop';
import VoiceSettingPop from './voiceSettingPop';
import JSCodeEditPop from './JSCodeEditPop';
import scenarioConvertor from '../_utils/scenarioConvertor';
import scenarioVersionConvertor from '../_utils/scenarioVersionConvertor';
import scenarioInitializer from '../_utils/scenarioInitializer';
import optionConfig from '../_utils/optionConfig';
import { NodeBlock as NodeBlockConfig } from '../_utils/componentConfig';

const NodeToEdgeMap = optionConfig.NodeToEdgeMap;

export default {
  name: 'scenario-edit-page',
  api: [taskEngineApi, nerFactoryDalApi],
  components: {
    'node-block': NodeBlock,
    edges: Edges,
    'edges-on-top': EdgesOnTop,
  },
  data() {
    return {
      moduleData: {},
      moduleDataLayout: {},
      setting: {},
      globalEdges: [],
      varTemplates: [],
      nodeBlocks: [],
      edges: [],
      panelTabOptions: [],
      nodeOptions: [],
      nodefuncs: [],
      canvasWidth: 2000,
      canvasHeight: 2000,
      nodeBlockWidth: NodeBlockConfig.nodeBlockWidth,
      nodeBlockHeight: NodeBlockConfig.nodeBlockHeight,
      showTopPanelButtonLabel: {
        setting: false,
        varTemplate: false,
        globalEdge: false,
        export: false,
        publish: false,
      },
      nodeTypes: [],
      showNodeOptions: true,
      linking: false,
      addNewEdgeDropdown: {
        options: [],
        width: '220px',
      },
      addNewEdgeDropdownStyle: {},
      linkingEdge: {
        show: false,
        x1: 0,
        y1: 0,
        x2: 0,
        y2: 0,
        srcNodeIndex: undefined,
        dstNodeIndex: undefined,
      },
      stopCanvasClickPropagationOnce: false,
      enable: false,
      appId: undefined,
      scenarioId: undefined,
      zoom: 1,
      toggleLabel: {
        on: this.$t('task_engine_v2.scenario_edit_page.on'),
        off: this.$t('task_engine_v2.scenario_edit_page.off'),
      },
      jsCode: {},
      jsCodeAlias: [],
      hadJsCode: false,
      enable_node: {},
      saveScenarioCallback: undefined,
      customParsers: {},
      globalTts: {},
      customParsersApp: [],
      activeName: 'first',
      funcImg: '',
    };
  },
  computed: {
    ...mapGetters([
      'robotID',
      'voiceSet',
      'globalTTSinfo',
      'debugInfoEnv',
      'templateLists', // 功能场景列表
      'funcScenFlag', // 功能场景 开关
    ]),
    advancedConfigOptions() {
      const options = {
        options: [
          {
            text: this.$t('task_engine_v2.scenario_edit_page.global_var_template'),
            onclick: this.editVarTemplate,
          }, {
            text: this.$t('task_engine_v2.scenario_edit_page.global_edge'),
            onclick: this.editGlobalEdge,
          }, {
            text: this.$t('task_engine_v2.scenario_edit_page.scenario_info'),
            onclick: this.scenarioInfoClick,
          },
        ],
        alignLeft: true,
      };
      if (this.voiceSet) {
        options.options.push({
          text: this.$t('task_engine_v2.scenario_edit_page.voice_setting'),
          onclick: this.voiceSettingClick,
        });
      }
      if (this.hadJsCode) {
        options.options.push({
          text: this.$t('task_engine_v2.scenario_edit_page.global_js_code'),
          onclick: this.editJSCode,
        });
      }
      return options;
    },
    idToNodeBlock() {
      const map = {};
      this.nodeBlocks.forEach((nodeBlock) => {
        map[nodeBlock.data.nodeId] = nodeBlock;
      });
      return map;
    },
    toNodeOptions() {
      const options = [];
      Object.keys(this.idToNodeBlock).forEach((key) => {
        const nodeBlock = this.idToNodeBlock[key];
        const nodeName = nodeBlock.data.nodeName;
        const nodeType = nodeBlock.data.nodeType || '';
        if (nodeType !== 'entry') {
          options.push({
            text: `${nodeName} (ID: ${key})`,
            value: key,
          });
        }
      });
      return options;
    },
    allEdges() {
      // allEdges include normal, else_into and exceedThenGoTo edges, not include hidden edges.
      const edgeList = [];
      Object.keys(this.idToNodeBlock).forEach((key) => {
        const nodeBlock = this.idToNodeBlock[key];
        // normal edge and normal edge 2.0
        const edgeTabKey = nodeBlock.data.edgeTab ? 'edgeTab' : 'edgeTab2';
        if (nodeBlock.data[edgeTabKey] && nodeBlock.data[edgeTabKey].normalEdges) {
          nodeBlock.data[edgeTabKey].normalEdges.forEach((edge) => {
            if (edge.edge_type && edge.edge_type === 'qq') {
              // qq edge (语句相似度) is no longer supported.
            } else {
              if (!edge.to_node_id) return;
              if (!this.idToNodeBlock[edge.to_node_id]) return;
              edgeList.push({
                from_id: nodeBlock.data.nodeId,
                to_id: edge.to_node_id,
                edge_type: edge.edge_type,
              });
            }
          });
        }
        if (nodeBlock.data[edgeTabKey] &&
            nodeBlock.data[edgeTabKey].exceedThenGoto &&
            this.idToNodeBlock[nodeBlock.data[edgeTabKey].exceedThenGoto]) {
          edgeList.push({
            from_id: nodeBlock.data.nodeId,
            to_id: nodeBlock.data[edgeTabKey].exceedThenGoto,
            edge_type: 'exceedThenGoTo',
          });
        }
        if (nodeBlock.data[edgeTabKey] &&
            nodeBlock.data[edgeTabKey].elseInto &&
            this.idToNodeBlock[nodeBlock.data[edgeTabKey].elseInto]) {
          edgeList.push({
            from_id: nodeBlock.data.nodeId,
            to_id: nodeBlock.data[edgeTabKey].elseInto,
            edge_type: 'else_into',
          });
        }
        // push pc_node edges
        if (nodeBlock.data.paramsCollectingEdgeTab) {
          nodeBlock.data.paramsCollectingEdgeTab.normalEdges.forEach((edge) => {
            if (edge.edge_type && edge.edge_type === 'qq') {
              // qq edge (语句相似度) is no longer supported.
            } else {
              if (!edge.to_node_id) return;
              if (!this.idToNodeBlock[edge.to_node_id]) return;
              edgeList.push({
                from_id: nodeBlock.data.nodeId,
                to_id: edge.to_node_id,
                edge_type: edge.edge_type,
              });
            }
          });
        }

        // push restful node edges
        if (nodeBlock.data.restfulEdgeTab) {
          if (this.idToNodeBlock[nodeBlock.data.restfulEdgeTab.restfulSucceedThenGoto]) {
            edgeList.push({
              from_id: nodeBlock.data.nodeId,
              to_id: nodeBlock.data.restfulEdgeTab.restfulSucceedThenGoto,
              edge_type: 'normal',
            });
          }
          if (this.idToNodeBlock[nodeBlock.data.restfulEdgeTab.restfulFailedThenGoto]) {
            edgeList.push({
              from_id: nodeBlock.data.nodeId,
              to_id: nodeBlock.data.restfulEdgeTab.restfulFailedThenGoto,
              edge_type: 'normal',
            });
          }
        }

        // push action node edges
        if (nodeBlock.data.actionTab) {
          nodeBlock.data.actionTab.actionGroupList.forEach((actionGroup) => {
            actionGroup.actionList.forEach((action) => {
              if (action.type === 'goto') {
                if (this.idToNodeBlock[action.targetSkillId]) {
                  edgeList.push({
                    from_id: nodeBlock.data.nodeId,
                    to_id: action.targetSkillId,
                    edge_type: 'normal',
                  });
                }
              } else if (action.type === 'webhook') {
                if (this.idToNodeBlock[action.webhookSuccessThenGoto]) {
                  edgeList.push({
                    from_id: nodeBlock.data.nodeId,
                    to_id: action.webhookSuccessThenGoto,
                    edge_type: 'normal',
                  });
                }
                if (this.idToNodeBlock[action.webhookFailThenGoto]) {
                  edgeList.push({
                    from_id: nodeBlock.data.nodeId,
                    to_id: action.webhookFailThenGoto,
                    edge_type: 'normal',
                  });
                }
              }
            });
          });
        }

        // globalEdges
        this.globalEdges.forEach((edge) => {
          if (!edge.to_node_id) return;
          if (!this.idToNodeBlock[edge.to_node_id]) return;
          edgeList.push({
            from_id: nodeBlock.data.nodeId,
            to_id: edge.to_node_id,
            edge_type: edge.edge_type,
          });
        });
      });

      return edgeList;
    },
    filteredEdges() {
      const edgeMap = {};
      const filteredEdges = [];
      this.allEdges.filter(edge =>
        edge.edge_type !== 'hidden' &&
        edge.from_id !== '0' &&
        edge.to_id !== '0' &&
        edge.to_id !== null &&
        edge.to_id !== undefined &&
        edge.from_id !== edge.to_id,
      ).forEach((edge) => {
        const key = `${edge.from_id}_${edge.to_id}`;
        if (key in edgeMap) return;
        edgeMap[key] = 1;
        const nodeBlockMap = this.idToNodeBlock;
        let fromy = this.halfBlockHeight;
        let toy = this.halfBlockHeight;
        let fromx = this.halfBlockWidth;
        let tox = this.halfBlockWidth;
        if (nodeBlockMap[edge.from_id].data.nodeType === 'sub_scenario') {
          fromy = ((this.halfBlockHeight * 2) + 20);
        }
        if (nodeBlockMap[edge.to_id].data.nodeType === 'sub_scenario') {
          toy = ((this.halfBlockHeight * 2) + 20);
        }
        if (nodeBlockMap[edge.from_id].data.nodeType === 'entry') {
          fromy = (this.halfBlockHeight / 2);
          fromx = 78;
        }
        if (nodeBlockMap[edge.to_id].data.nodeType === 'entry') {
          toy = (this.halfBlockHeight / 2);
          tox = 78;
        }
        filteredEdges.push({
          x1: nodeBlockMap[edge.from_id].x + fromx,
          y1: nodeBlockMap[edge.from_id].y + fromy,
          x2: nodeBlockMap[edge.to_id].x + tox,
          y2: nodeBlockMap[edge.to_id].y + toy,
        });
      });
      return filteredEdges;
    },
    canvasStyle() {
      return {
        width: `${this.canvasWidth}px`,
        height: `${this.canvasHeight}px`,
      };
    },
    halfBlockWidth() {
      return this.nodeBlockWidth / 2;
    },
    halfBlockHeight() {
      return this.nodeBlockHeight / 2;
    },
  },
  methods: {
    ...mapMutations([
      'setModelData',
      'setShowNodeScenrioId',
      'setGlobalTTsInfo',
    ]),
    clearShowNode() {
      bus.$emit('clearShowNode');
    },
    setSwitchToggle(appId, scenarioId) {
      this.$api.listScenarios(appId).then((data) => {
        if (typeof (data) === 'object' && 'msg' in data) {
          const scenario = data.msg.find(s => s.scenarioID === scenarioId);
          this.enable = scenario.enable;
        }
      }, (err) => {
        // general.popErrorWindow(this, 'listScenarios error', err.message);
        this.$message({
          message: `listScenarios error: ${err.message}`,
          type: 'error',
          showClose: true,
        });
      });
    },
    switchScenario(enable) {
      this.enable = enable;
      if (this.enable) {
        this.publishScenario();
      }
      this.$api.switchScenario(this.appId, this.scenarioId, this.enable).then(() => {
        if (enable) {
          this.checkScenarioCustomParser(this.scenarioId);
        }
      }, (err) => {
        // general.popErrorWindow(this, 'switchScenario error', err.message);
        this.$message({
          message: `switchScenario error: ${err.message}`,
          type: 'error',
          showClose: true,
        });
      });
      // this.saveTaskEngineIntents();
      this.saveScenario();
    },
    checkScenarioCustomParser() {
      const other = [];
      Object.keys(this.customParsers).forEach((key) => {
        if (this.customParsersApp.indexOf(key) < 0) {
          other.push(key);
        }
      });
      if (other.length > 0) {
        this.$popCheck({
          data: {
            msg: this.$t(
              'task_engine_v2.scenario_list_page.upload_scenario_info',
              { parser_info: other.map(item => (this.customParsers[item].name)) },
            ),
          },
          buttons: ['ok'],
        });
      }
    },
    loadScenario(scenarioId) {
      return this.$api.loadScenario(scenarioId).then((data) => {
        const moduleData = JSON.parse(data.result.editingContent);
        if (this.voiceSet && (!moduleData.global_tts_info || !('vsp_setting' in moduleData.global_tts_info))) {
          moduleData.global_tts_info = {
            bargein: false,
            interrupt_speech: '',
            silence: {
              silence_waitingduration: this.$t('task_engine_v2.scenario_edit_page.global_ttsinfo.silence_waitingduration'),
              silence_switch: true,
              silence_waitingspeech: this.$t('task_engine_v2.scenario_edit_page.global_ttsinfo.silence_waitingspeech'),
              silence_limit: this.$t('task_engine_v2.scenario_edit_page.global_ttsinfo.silence_limit'),
              silence_stopspeech: this.$t('task_engine_v2.scenario_edit_page.global_ttsinfo.silence_stopspeech'),
            },
            vad_time: this.$t('task_engine_v2.scenario_edit_page.global_ttsinfo.vad_time'),
            tts_url: this.$t('task_engine_v2.scenario_edit_page.global_ttsinfo.tts_url'),
            vsp_setting: this.$t('task_engine_v2.scenario_edit_page.global_ttsinfo.vsp_setting'),
          };
        }
        const jsonData = {
          moduleData,
          moduleDataLayouts: JSON.parse(data.result.editingLayout),
        };
        const newJsonData = scenarioVersionConvertor.convertJsonToVersion('2.6', jsonData);
        this.moduleData = newJsonData.moduleData;
        this.setModelData(this.moduleData.ui_data.nodes);
        this.moduleDataLayouts = newJsonData.moduleDataLayouts;
        this.customParsers = this.moduleData.custom_parsers || {};
        this.updateWindowModuleData();
        this.renderData();
      }, (err) => {
        // this.$popError('loadScenario error', err.message);
        this.$message({
          message: `loadScenario error: ${err.message}`,
          type: 'error',
          showClose: true,
        });
      });
    },
    updateWindowModuleData() {
      window.moduleData = JSON.parse(JSON.stringify(this.moduleData));
      window.moduleDataLayouts = JSON.parse(JSON.stringify(this.moduleDataLayouts));
    },
    renderData() {
      this.scenarioName = this.moduleData.metadata.scenario_name;
      this.globalEdges = this.moduleData.global_edges;
      this.varTemplates = this.moduleData.msg_confirm;
      this.globalTts = this.moduleData.global_tts_info;
      this.setGlobalTTsInfo(this.globalTts);// 初始渲染vuex中保存globalTTsInfo。
      this.setting = {
        scenarioName: this.moduleData.metadata.scenario_name,
        scenarioDialogueCntLimit: this.moduleData.setting.sys_scenario_dialogue_cnt_limit,
        nodeDialogueCntLimit: this.moduleData.setting.sys_node_dialogue_cnt_limit,
        extendLast: this.moduleData.setting.sys_extend_last,
        returnBack: this.moduleData.setting.sys_return_back,
        returnBackContext: this.moduleData.setting.sys_return_back_context,
        timeoutLimit: this.moduleData.setting.sys_scenario_timeout_limit,
      };
      this.nodeBlocks = this.moduleData.ui_data.nodes.map((node, index) => {
        // prop node
        const nodeBlockRef = `nodeBlock_${index}`;
        if (this.$refs[nodeBlockRef] && this.$refs[nodeBlockRef].length > 0) {
          this.$refs[nodeBlockRef][0].$emit('propNode', node);
        }
        // update nodeBlocks
        const nodeId = node.nodeId;
        // init ttsInfo
        const initNode = JSON.parse(JSON.stringify(node));
        // 兼容旧Task上无ttsInfo，若语音开关开，加上ttsInfo。
        if (this.voiceSet && (!initNode.ttsInfo || initNode.ttsInfo === '' || !initNode.ttsInfo.vsp) && initNode.nodeType === 'dialogue_2.0') {
          const initTtsInfo = {
            bargein: {
              bargein_default: true,
              bargein_value: this.globalTTSinfo.bargein,
              bargein_speech: this.globalTTSinfo.interrupt_speech,
            },
            silence: {
              silence_default: true,
              silence_switch: true,
              silence_duration: this.globalTTSinfo.silence.silence_waitingduration,
              slient_speech: this.globalTTSinfo.silence.silence_waitingspeech,
              num_limit: this.globalTTSinfo.silence.silence_limit,
              stop_speech: this.globalTTSinfo.silence.silence_stopspeech,
            },
            vad: {
              vad_default: true,
              vad_value: this.globalTTSinfo.vad_time,
            },
            vsp: {
              vsp_default: true,
              vsp_value: this.globalTTSinfo.vsp_setting,
            },
          };
          initNode.ttsInfo = initTtsInfo;
        }
        return {
          x: this.moduleDataLayouts[nodeId].position.left,
          y: this.moduleDataLayouts[nodeId].position.top,
          data: initNode,
        };
      });
      this.renderJsCode();
      this.renderGlobalVarOptionsMap();
    },
    renderJsCode() {
      const jsCode = this.moduleData.js_code || {};
      this.jsCodeAlias = jsCode.alias || [];
      if (jsCode.text_type && jsCode.text_type === 'plain') {
        this.jsCode = {
          alias: jsCode.alias,
          text_type: jsCode.text_type,
          main: JSON.parse(jsCode.main),
        };
      } else {
        this.jsCode = {};
      }
    },
    renderGlobalVarOptionsMap() {
      this.globalVarOptionsMap = {};
      this.moduleData.nodes.forEach(((node) => {
        if (node.edges) {
          let globalVars = scenarioConvertor.getGlobalVars(node.edges);
          if (node.node_type === 'restful') {
            globalVars.push(node.content.requests[0].rtn_var_name);
          } else if (node.node_type === 'parameter_collecting') {
            globalVars.push(...scenarioConvertor.getGlobalVarsFromParsers(node.content.parsers));
          } else if (node.node_type === 'nlu_pc') {
            globalVars.push(...node.content.entities.map(entity => entity.entityName));
          }
          globalVars = [...new Set(globalVars)];
          const vars = globalVars.map(v => ({
            text: node.description,
            value: v,
          }));
          this.globalVarOptionsMap[node.node_id] = vars;
        }
      }));
    },
    saveScenario() {
      this.saveTaskEngineCustomParsers();
      this.saveTaskEngineScenario();
      this.saveTaskEngineIntents();
    },
    saveTaskEngineCustomParsers() {
      const uiNodes = this.nodeBlocks.map(nodeBlock => nodeBlock.data);
      const parsers = scenarioConvertor.parseCustomParsers(uiNodes);
      const added = [];
      Object.keys(parsers).forEach((key) => {
        if (!(key in this.customParsers)) {
          added.push(key);
        }
      });
      const deleted = [];
      Object.keys(this.customParsers).forEach((key) => {
        if (!(key in parsers)) {
          deleted.push(key);
        }
      });
      this.customParsers = parsers;
      this.$api.updateNerParsersCount(
        this.appId, added.filter(item => this.customParsersApp.indexOf(item) >= 0));
      this.$api.deleteNerParsersCount(
        this.appId, deleted.filter(item => this.customParsersApp.indexOf(item) >= 0));
    },
    saveTaskEngineIntents() {
      let triggerIntents = [];
      if (this.enable) {
        const uiNodes = this.nodeBlocks.map(nodeBlock => nodeBlock.data);
        triggerIntents = scenarioConvertor.parseTriggerIntents(uiNodes);
      } else {
        triggerIntents = [];
      }
      return this.$api.saveTaskEngineIntents(
        this.appId,
        this.scenarioId,
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
    saveTaskEngineScenario() {
      const uiNodes = this.nodeBlocks.map(nodeBlock => nodeBlock.data);
      let silenceSwitch = null;
      if (this.voiceSet) {
        silenceSwitch = this.globalTTSinfo.silence.silence_switch;
      }
      const nodes = scenarioConvertor.convertUiNodesToNodes(
        uiNodes,
        this.setting,
        this.globalEdges,
        this.voiceSet,
        silenceSwitch,
      );
      // this.globalEdges = scenarioConvertor.appendActionToGlobalEdges(this.globalEdges);
      const nodeConnections = scenarioConvertor.traverseEdges(nodes, this.globalEdges);
      scenarioConvertor.generateWarnings(uiNodes, nodeConnections);
      // scenarioConvertor.addBackContentTextArray(this, nodes, this.globalEdges);
      // update data
      const jsCode = {
        alias: this.jsCode.alias,
        text_type: this.jsCode.text_type,
        main: JSON.stringify(this.jsCode.main),
      };
      const data = {
        version: '2.6',
        metadata: {
          scenario_name: this.setting.scenarioName,
          // update_time: this.moduleData.metadata.update_time,
          update_time: general.getLocalDateTimeIsoString(),
          update_user: this.moduleData.metadata.update_user,
          scenario_id: this.moduleData.metadata.scenario_id,
        },
        setting: {
          sys_scenario_dialogue_cnt_limit: this.setting.scenarioDialogueCntLimit,
          sys_node_dialogue_cnt_limit: this.setting.nodeDialogueCntLimit,
          sys_extend_last: this.setting.extendLast,
          sys_return_back: this.setting.returnBack,
          sys_return_back_context: this.setting.returnBackContext,
          sys_scenario_timeout_limit: this.setting.timeoutLimit,
        },
        global_edges: this.globalEdges,
        global_tts_info: this.globalTts,
        msg_confirm: this.varTemplates,
        nodes,
        ui_data: {
          nodes: uiNodes,
        },
        js_code: jsCode,
        custom_parsers: this.customParsers,
      };
      // update layout
      const layout = {};
      this.nodeBlocks.forEach((nodeBlock) => {
        const nodeId = nodeBlock.data.nodeId;
        layout[nodeId] = {
          position: {
            left: nodeBlock.x,
            top: nodeBlock.y,
          },
        };
      });
      // console.log(JSON.stringify(data, general.JSONStringifyReplacer));
      return this.$api.saveScenario(
        this.appId,
        this.scenarioId,
        JSON.stringify(data),
        JSON.stringify(layout),
      ).then(() => {
        this.moduleData = data;
        this.moduleDataLayouts = layout;
        this.renderData();
        this.updateWindowModuleData();
        this.publishScenario();
        if (this.saveScenarioCallback) {
          this.saveScenarioCallback();
          this.saveScenarioCallback = undefined;
        }
        // this.$notify({ text: this.$t('error_msg.save_success') });
      }, (err) => {
        // this.$notifyFail(`saveScenario failed, error:${err.message}`);
        this.$message({
          message: `saveScenario failed, error:${err.message}`,
          type: 'error',
          showClose: true,
        });
      });
    },
    addNewNodeWithNodeId(nodeType, nodeName, nodeId, x, y) {
      const nodeDialogueCntLimit = this.setting.nodeDialogueCntLimit;
      const node = scenarioInitializer
        .initialNode(nodeType, nodeName, nodeDialogueCntLimit, nodeId);
      this.nodeBlocks.push({
        x,
        y,
        data: node,
      });
    },
    addTempNodes(index, newNodeOptions) {
      if (newNodeOptions) {
        let x = this.nodeBlocks[index].x;
        const y = this.nodeBlocks[index].y + 150;
        newNodeOptions.forEach((option) => {
          x += 250;
          this.addNewNodeWithNodeId(
            option.nodeType,
            option.nodeName,
            option.nodeId,
            x,
            y,
          );
        });
      }
    },
    saveNode(index, node) {
      this.nodeBlocks[index].data = node;
      const uidata = this.moduleData.ui_data.nodes;
      uidata[index] = node;
      this.setModelData(uidata);
      this.$nextTick(() => {
        this.saveScenario();
      });
    },
    copyNode(index) {
      const srcNodeId = this.nodeBlocks[index].data.nodeId;
      const newNodeId = scenarioInitializer.guid_sort();
      const srcNodeName = this.nodeBlocks[index].data.nodeName;
      const newNodeName = `${srcNodeName}_copy`;
      const srcNodeBlockString = JSON.stringify(this.nodeBlocks[index]);
      let newNodeStr = srcNodeBlockString.replace(new RegExp(srcNodeId, 'g'), newNodeId);
      newNodeStr = newNodeStr.replace(new RegExp(`"nodeName":"${srcNodeName}"`, 'g'), `"nodeName":"${newNodeName}"`);
      const newNodeBlock = JSON.parse(newNodeStr);
      newNodeBlock.x += 100;
      newNodeBlock.y += 100;
      this.nodeBlocks.push(newNodeBlock);
      this.saveScenario();
    },
    updateNodePosition(index, position) {
      this.nodeBlocks[index].x = position.left;
      this.nodeBlocks[index].y = position.top;
    },
    deleteNode(index) {
      const nodeName = this.nodeBlocks[index].data.nodeName;
      const that = this;
      that.$popCheck({
        data: {
          msg: that.$t(
            'task_engine_v2.scenario_edit_page.ask_delete_node_confirm',
            { node: nodeName },
          ),
        },
        callback: {
          ok() {
            that.nodeBlocks.splice(index, 1);
            that.saveScenario();
          },
        },
      });
    },
    nodeOptionDragStart(nodeType, name, e, id) {
      const widthRatio = e.offsetX / e.target.offsetWidth;
      const heightRatio = e.offsetY / e.target.offsetHeight;
      e.dataTransfer.setData('text', JSON.stringify({ nodeType, name, widthRatio, heightRatio, id }));
    },
    nodeOptionDragOver(e) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
    },
    nodeOptionDrop(e) {
      const eObj = JSON.parse(e.dataTransfer.getData('text'));
      const nodeType = eObj.nodeType;
      const nodeName = eObj.name;
      const widthRatio = Number.isNaN(+eObj.widthRatio) ? 1 : +eObj.widthRatio;
      const heightRatio = Number.isNaN(+eObj.heightRatio) ? 1 : +eObj.heightRatio;
      const x = e.offsetX - (this.nodeBlockWidth * widthRatio);
      const y = e.offsetY - (this.nodeBlockHeight * heightRatio);
      this.addNewNode(nodeType, nodeName, x, y, eObj);
    },
    onPageWheel() {
      // expand canvas width and height
      const scrollLeft = this.$refs.container.scrollLeft;
      const windowWidth = this.$refs.window.clientWidth;
      const pageWidth = this.$refs.page.clientWidth;

      const scrollTop = this.$refs.container.scrollTop;
      const windowHeight = this.$refs.window.clientHeight;
      const pageHeight = this.$refs.page.clientHeight;

      const scrollPercentX = (scrollLeft / (pageWidth - windowWidth)) * 100;
      const scrollPercentY = (scrollTop / (pageHeight - windowHeight)) * 100;

      if (scrollPercentX >= 95) {
        this.canvasWidth *= 1.1;
      }
      if (scrollPercentY >= 95) {
        this.canvasHeight *= 1.1;
      }
    },
    editVarTemplate() {
      const that = this;
      that.$pop({
        title: '',
        component: VarTemplateEditPop,
        validate: true,
        cancelValidate: true,
        extData: {
          varTemplates: this.varTemplates,
          globalVarOptionsMap: this.globalVarOptionsMap,
        },
        callback: {
          ok: (varTemplates) => {
            this.varTemplates = varTemplates;
            this.saveScenario();
          },
        },
      });
    },
    editGlobalEdge() {
      const that = this;
      that.$pop({
        title: '',
        component: GlobalEdgeEditPop,
        validate: true,
        cancelValidate: true,
        extData: {
          jsCodeAlias: this.jsCodeAlias,
          globalEdges: this.globalEdges,
          toNodeOptions: this.toNodeOptions,
          globalVarOptionsMap: this.globalVarOptionsMap,
          scenarioId: this.scenarioId,
        },
        callback: {
          ok: (resultObj) => {
            console.log(resultObj.edges);
            this.globalEdges = resultObj.edges;
            this.addTempNodes(this.nodeBlocks.length - 1, resultObj.newNodeOptions);
            this.saveScenario();
          },
        },
      });
    },
    editJSCode() {
      const that = this;
      that.$pop({
        // title: '',
        component: JSCodeEditPop,
        validate: true,
        cancelValidate: true,
        extData: {
          title: this.$t('task_engine_v2.js_code_edit_pop.title'),
          jsCode: this.jsCode,
        },
        callback: {
          ok: (jsCode) => {
            this.jsCodeAlias = jsCode.alias;
            this.jsCode = jsCode;
            this.saveScenario();
          },
        },
      });
    },
    exportScenario() {
      this.$api.exportScenario(this.scenarioId);
    },
    publishScenario() {
      // register TDE tasks
      scenarioConvertor.registerNluTdeScenario(this.scenarioId, this.moduleData.ui_data.nodes);

      // publish scenario
      const that = this;
      this.$api.publishScenario(this.appId, this.scenarioId).then(() => {
        // that.$notify({ text: that.$t('task_engine_v2.scenario_list_page.publish_succeed') });
      }, (err) => {
        // that.$notifyFail(`${that.$t('task_engine_v2.scenario_list_page.
        // publish_failed')}:${err.message}`);
        this.$message({
          message: `${that.$t('task_engine_v2.scenario_list_page.publish_failed')}:${err.message}`,
          type: 'error',
          showClose: true,
        });
      });
    },
    getPanelTabOptions() {
      const tabs = [
        this.$t('task_engine_v2.scenario_edit_page.tabs.node'),
      ];
      return tabs.map(tab => ({
        text: tab,
        val: tab,
      }));
    },
    getNodeOptions() {
      return this.nodeTypes.filter(nodeType => nodeType.type !== 'entry' && nodeType.type !== 'dialogue');
    },
    getNodeTypeName(type) {
      const nodeType = this.nodeTypes.find(t => t.type === type);
      return nodeType.name;
    },
    linkingStart(index, slot) {
      this.linking = true;
      this.linkingEdge.show = true;
      this.linkingEdge.x1 = slot.x;
      this.linkingEdge.y1 = slot.y;
      this.linkingEdge.x2 = slot.x;
      this.linkingEdge.y2 = slot.y;
      this.linkingEdge.srcNodeIndex = index;
    },
    linkingStop(index, e) {
      if (this.nodeBlocks[index] && this.nodeBlocks[index].data) {
        const toNodeId = this.nodeBlocks[index].data.nodeId;
        this.showAddNewEdgeDropdown(e.clientX, e.clientY, toNodeId);
      } else {
        this.showAddNewEdgeDropdown(e.clientX, e.clientY, undefined);
      }
    },
    mouseEnterDstSlot(index, slot) {
      if (!this.linking) return;
      this.linkingEdge.x2 = slot.x;
      this.linkingEdge.y2 = slot.y;
      this.linkingEdge.dstNodeIndex = index;
    },
    mouseLeaveDstSlot() {
      if (!this.linking) return;
      this.linkingEdge.dstNodeIndex = undefined;
    },
    canvasMouseMove(e) {
      if (!this.linking) return;
      if (this.linkingEdge.dstNodeIndex) return;
      const pageRect = this.$refs.page.getBoundingClientRect();
      this.linkingEdge.x2 = (e.clientX - pageRect.x) / this.zoom;
      this.linkingEdge.y2 = (e.clientY - pageRect.y) / this.zoom;
    },
    canvasMouseUp(e) {
      this.showAddNewEdgeDropdown(e.clientX, e.clientY, undefined);
    },
    canvasClick(e) {
      if (this.stopCanvasClickPropagationOnce) {
        if (e.stopPropagation) e.stopPropagation();
        this.stopCanvasClickPropagationOnce = false;
      }
    },
    showAddNewEdgeDropdown(clientX, clientY, toNodeId) {
      if (!this.linking) return;
      this.linking = false;
      this.stopCanvasClickPropagationOnce = true;
      const pageRect = this.$refs.page.getBoundingClientRect();
      let left = clientX - pageRect.x - 50;
      let top = clientY - pageRect.y - 50;
      if (left < 0) left = 0;
      if (top < 0) top = 0;
      this.addNewEdgeDropdownStyle = {
        left: `${left}px`,
        top: `${top}px`,
      };
      this.renderAddNewEdgeDropdown(toNodeId);
      this.$nextTick(() => {
        this.$refs.addNewEdgeDropdown.click();
      });
    },
    dropdownHidden() {
      this.linkingEdge.show = false;
      this.linkingEdge.dstNodeIndex = undefined;
    },
    renderAddNewEdgeDropdown(toNodeId) {
      const sourceIndex = this.linkingEdge.srcNodeIndex;
      if (!this.nodeBlocks[sourceIndex] || !this.nodeBlocks[sourceIndex].data) {
        this.addNewEdgeDropdown.options = [];
        return;
      }
      // source node
      const sourceNode = this.nodeBlocks[sourceIndex].data;
      const nodeBlockRef = this.$refs[`nodeBlock_${sourceIndex}`][0];
      const sourceNodeType = sourceNode.nodeType;
      const edgeTabKey = NodeToEdgeMap[sourceNodeType];
      let dstNodeId = toNodeId;
      const exceedThenGotoOption = {
        text: this.$t('task_engine_v2.scenario_edit_page.new_edge_exceed_then_goto'),
        onclick: () => {
          if (dstNodeId === undefined) {
            const newNode = this.addNewLinkingNode(this.linkingEdge);
            dstNodeId = newNode.nodeId;
          }
          sourceNode.edgeTab.exceedThenGoto = dstNodeId;
          this.saveScenario();
          this.dropdownHidden();
        },
      };
      const elseIntoOption = {
        text: this.$t('task_engine_v2.scenario_edit_page.new_edge_else_into'),
        onclick: () => {
          if (dstNodeId === undefined) {
            const newNode = this.addNewLinkingNode(this.linkingEdge);
            dstNodeId = newNode.nodeId;
          }
          sourceNode.edgeTab.elseInto = dstNodeId;
          this.saveScenario();
          this.dropdownHidden();
        },
      };
      const newNormalEdgeOption = {
        text: this.$t('task_engine_v2.scenario_edit_page.new_edge_normal'),
        onclick: () => {
          if (dstNodeId === undefined) {
            const newNode = this.addNewLinkingNode(this.linkingEdge, sourceNodeType);
            dstNodeId = newNode.nodeId;
          }
          let newEdge = scenarioInitializer.initialEdge();
          if (sourceNodeType === 'dialogue_2.0') {
            newEdge = scenarioInitializer.initialNormalEdge2();
          }
          newEdge.id = this.$uuid.v1();
          newEdge.to_node_id = dstNodeId;
          sourceNode[edgeTabKey].normalEdges.push(newEdge);
          this.saveScenario();
          this.dropdownHidden();
          this.saveScenarioCallback = () => {
            this.showNodeEditPageByTabType(nodeBlockRef, edgeTabKey);
          };
        },
      };
      let options = [];
      if (sourceNodeType === 'action') {
        options = [
          {
            text: this.$t('task_engine_v2.scenario_edit_page.new_edge_normal'),
            onclick: () => {
              if (dstNodeId === undefined) {
                const newNode = this.addNewLinkingNode(this.linkingEdge);
                dstNodeId = newNode.nodeId;
              }
              sourceNode.actionTab.actionGroupList.push({
                actionGroupId: this.$uuid.v1(),
                actionList: [{
                  type: 'goto',
                  targetSkillId: dstNodeId,
                }],
                conditionList: [],
              });
              this.saveScenario();
              this.dropdownHidden();
              this.saveScenarioCallback = () => {
                this.showNodeEditPageByTabType(nodeBlockRef, edgeTabKey);
              };
            },
          },
        ];
      } else if (sourceNodeType === 'restful') {
        options = [
          {
            text: this.$t('task_engine_v2.scenario_edit_page.new_edge_restful_success'),
            onclick: () => {
              if (dstNodeId === undefined) {
                const newNode = this.addNewLinkingNode(this.linkingEdge);
                dstNodeId = newNode.nodeId;
              }
              sourceNode.restfulEdgeTab.restfulSucceedThenGoto = dstNodeId;
              this.saveScenario();
              this.dropdownHidden();
            },
          },
          {
            text: this.$t('task_engine_v2.scenario_edit_page.new_edge_restful_fail'),
            onclick: () => {
              if (dstNodeId === undefined) {
                const newNode = this.addNewLinkingNode(this.linkingEdge);
                dstNodeId = newNode.nodeId;
              }
              sourceNode.restfulEdgeTab.restfulFailedThenGoto = dstNodeId;
              this.saveScenario();
              this.dropdownHidden();
            },
          },
        ];
      } else if (sourceNodeType === 'parameter_collecting') {
        options = [
          {
            text: this.$t('task_engine_v2.scenario_edit_page.new_edge_pc_success'),
            onclick: () => {
              if (dstNodeId === undefined) {
                const newNode = this.addNewLinkingNode(this.linkingEdge);
                dstNodeId = newNode.nodeId;
              }
              const edges = sourceNode.paramsCollectingEdgeTab.normalEdges;
              const succeedEdge = edges.find(edge => edge.edge_type === 'pc_succeed');
              if (succeedEdge) {
                succeedEdge.to_node_id = dstNodeId;
                this.saveScenario();
              }
              this.dropdownHidden();
            },
          },
          {
            text: this.$t('task_engine_v2.scenario_edit_page.new_edge_pc_fail'),
            onclick: () => {
              if (dstNodeId === undefined) {
                const newNode = this.addNewLinkingNode(this.linkingEdge);
                dstNodeId = newNode.nodeId;
              }
              const edges = sourceNode.paramsCollectingEdgeTab.normalEdges;
              const failedEdge = edges.find(edge => edge.edge_type === 'pc_failed');
              if (failedEdge) {
                failedEdge.to_node_id = dstNodeId;
                this.saveScenario();
              }
              this.dropdownHidden();
            },
          },
          {
            text: this.$t('task_engine_v2.scenario_edit_page.new_edge_normal'),
            onclick: () => {
              if (dstNodeId === undefined) {
                const newNode = this.addNewLinkingNode(this.linkingEdge);
                dstNodeId = newNode.nodeId;
              }
              const newEdge = scenarioInitializer.initialEdge();
              newEdge.id = this.$uuid.v1();
              newEdge.to_node_id = dstNodeId;
              sourceNode.paramsCollectingEdgeTab.normalEdges.push(newEdge);
              this.saveScenario();
              this.dropdownHidden();
              this.saveScenarioCallback = () => {
                this.showNodeEditPageByTabType(nodeBlockRef, edgeTabKey);
              };
            },
          },
        ];
      } else if (sourceNodeType === 'entry' || sourceNodeType === 'nlu_pc') {
        options = [elseIntoOption, newNormalEdgeOption];
      } else {
        options = [
          exceedThenGotoOption,
          elseIntoOption,
          newNormalEdgeOption,
        ];
      }
      this.addNewEdgeDropdown.options = options;
      this.$refs.addNewEdgeDropdown.dispatchEvent(new Event('dropdown-reload'));
    },
    addNewLinkingNode(linkingEdge, sourceType) {
      const nodeType = sourceType === 'dialogue_2.0' ? 'dialogue_2.0' : 'dialogue';
      const nodeName = this.getNodeTypeName(nodeType);
      const x = linkingEdge.x2 - this.halfBlockWidth;
      const y = linkingEdge.y2 - this.halfBlockHeight;
      return this.addNewNode(nodeType, nodeName, x, y);
    },
    addNewNode(nodeType, nodeName, x, y, content) {
      const nodeDialogueCntLimit = this.setting.nodeDialogueCntLimit;
      const newNodeName = general.suffixIndexToNodeName(nodeName, undefined);
      const node = scenarioInitializer.initialNode(
        nodeType, newNodeName, nodeDialogueCntLimit, null, content);
      this.nodeBlocks.push({
        x,
        y,
        data: node,
      });
      this.saveScenario();
      return node;
    },
    zoomOut() {
      if (this.zoom >= 0.2) {
        this.zoom -= 0.1;
      }
    },
    scenarioInfoClick() {
      this.$pop({
        title: this.$t('task_engine_v2.scenario_edit_page.scenario_info'),
        component: ScenarioInfoPop,
        data: {
          setting: this.setting,
          metadata: this.moduleData.metadata,
        },
        validate: true,
        callback: {
          ok: (setting) => {
            this.setting = setting;
            this.saveScenario();
          },
        },
      });
    },
    // 全局语音设置
    voiceSettingClick() {
      this.$pop({
        title: this.$t('task_engine_v2.scenario_edit_page.voice_setting'),
        component: VoiceSettingPop,
        data: {
          globalTTSinfo: this.globalTts,
          scenarioId: this.scenarioId,
        },
        validate: true,
        callback: {
          ok: (res) => {
            this.globalTts = res;
            this.setGlobalTTsInfo(res);
            // 全局设置变动，就把node全部2.0节点中的 ttsInfo 是 default的部分 都改变。
            this.changeNodesVoiceDefault();
            this.saveScenario();
          },
        },
      });
    },
    // 当全局的语音设置有变动的时候，修改node节点中的ttsInfo上的，保持一致。
    changeNodesVoiceDefault() {
      const uiNodes = this.nodeBlocks.map(nodeBlock => nodeBlock.data);
      const node2 = uiNodes.filter(node => node.nodeType === 'dialogue_2.0');
      node2.forEach((node) => {
        const bargein = node.ttsInfo.bargein;
        const silence = node.ttsInfo.silence;
        const vad = node.ttsInfo.vad;
        const vsp = node.ttsInfo.vsp;
        if (bargein.bargein_default) {
          bargein.bargein_value = this.globalTTSinfo.bargein;
          bargein.bargein_speech = this.globalTTSinfo.interrupt_speech;
        }
        if (silence.silence_default) {
          silence.silence_duration = this.globalTTSinfo.silence.silence_waitingduration;
          silence.silence_switch = this.globalTTSinfo.silence.silence_switch;
          silence.slient_speech = this.globalTTSinfo.silence.silence_waitingspeech;
          silence.num_limit = this.globalTTSinfo.silence.silence_limit;
          silence.stop_speech = this.globalTTSinfo.silence.silence_stopspeech;
        }
        if (vad.vad_default) {
          vad.vad_value = this.globalTTSinfo.vad_time;
        }
        if (vsp.vsp_default) {
          vsp.vsp_value = this.globalTTSinfo.vsp_setting;
        }
      });
    },
    getTaskConfigInfo() {
      const that = this;
      this.$api.taskConfig()
        .then((data) => {
          that.hadJsCode = data.task_engine_v2.enable_js_code;
          Object.assign(this.enable_node, data.task_engine_v2.enable_node);
        });
    },
    showNodeEditPageByTabType(nodeBlockRef, tabType) {
      nodeBlockRef.editNode(tabType);
    },
  },
  beforeMount() {
    this.appId = this.robotID;
    this.scenarioId = this.$route.params.id;
    this.panelTabOptions = this.getPanelTabOptions();
    this.nodeTypes = optionConfig.getNodeTypes(this);
    this.enable_node = this.nodeTypes.reduce((acc, nodeInfo) => {
      acc[nodeInfo.type] = true;
      return acc;
    }, {});
    this.nodeOptions = this.getNodeOptions();
    this.funcImg = this.nodeOptions[0].image; // 假的 功能场景的图标；
    this.getTaskConfigInfo();
    this.loadScenario(this.scenarioId);
    this.setSwitchToggle(this.appId, this.scenarioId);
    const that = this;
    this.$api.getNerParserList(this.appId).then((data) => {
      that.customParsersApp = data.data.map(parser => parser.parserId);
    });
  },
  mounted() {
    const localFuncId = this.$route.path.split('scenario/')[1];
    // 将功能场景字段 修改与nodeoption 一致；
    this.nodefuncs = this.templateLists;
    this.nodefuncs.filter(scenario => scenario.scenarioID !== localFuncId)
      .forEach((item) => {
        item.type = 'sub_scenario';
        item.name = item.scenarioName;
      });
  },
  beforeDestroy() {},
};
</script>

<style lang="scss" scoped>
#scenario-edit-page {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  .icon {
    cursor: pointer;
  }
  .expand_rect_bule{
    background: #1875F0;
    color: #fff;
  }
  .header{
    position:absolute;
    top:0;
    width:100%;
    background: white;
    z-index: 10;
    height:44px;
    display:flex; 
    flex-direction: row;
    justify-content:space-between;
    line-height:44px;
    padding: 0 20px;
    border-bottom:1px solid rgba(219,219,219,1); 
    border-top:1px solid rgba(219,219,219,1);
    box-sizing:border-box;
    .scenario_name{
      font-size:16px;
      font-weight:500;
      color:#333;
    }
    .input-wrapper {
      display: flex;
      align-items: center;
      flex: 1;
      .scenario-name {
        border: none;
        @include font-16px();
        color: $color-font-active;
        text-overflow: ellipsis;
      }
      &:hover {
        .visibility {
          visibility: visible;
        }
      }
    }
    .icon {
      margin: 0 10px;
    }
    .visibility {
      visibility: hidden;
    }
    .left_wrap{
      display:flex;
      flex-direction: row;
      justify-content:center;
      padding-top:8px;
      .swicth_btn{
        margin-right:10px;
        height:28px;
        line-height:28px;
      }
      .toggle_btn{
        margin-right:20px;
        padding-top:3px;
      }
      .magin_r{
        margin-right: 5px;
      }
    }
  }
  .header-btn{
    height:28px;
    line-height:28px;
    padding:0 10px;
    border-radius:3px;
    border:1px solid rgba(219,219,219,1);
    margin-right:10px;
    box-sizing:border-box;
    display:flex;
    align-item:center;
    cursor: pointer;
  }
  .divide {
    width: 1px;
    height: 100%;
    background-color: #eeeeee;
  }
  .browse-window {
    width: 100%;
    height: 100%;
    @include auto-overflow();
    @include customScrollbar();
    .canvas-container{
      width: 2000px;
      height: 100%;
      overflow: auto;
      .canvas-page {
        // background: url('data:image/svg+xml, \
        // <svg xmlns="http://www.w3.org/2000/svg" \
        //   width="40" height="40" fill-opacity=".05"> \
        //   <rect x="20" width="20" height="20"/> \
        //   <rect y="20" width="20" height="20"/> \
        // </svg>');
        background: #F6F6F6;
        }
    }
    .addNewEdgeDropdown {
      position: absolute;
    }
  }
  .zoom-tool {
    position: absolute;
    bottom: 20px;
    right: 290px;
    height: 40px;
    border-radius: 2px;
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.12);
    display: flex;
    align-items: center;
    padding: 10px 0;
    background-color: white;
    .wrapper {
      border: none;
      background-color: white;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 0 16px;
      outline: none;
      // img {
      //   width: 22px;
      //   height: 22px;
      //   margin: 0 16px;
      // }
    }
  }
  .side-panel {
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 44px;
    right: 0;
    width: 260px;
    height: 100%;
    background: white;
    box-shadow: 0 0 5px 0 rgba(102, 102, 102, 0.08);
    @include auto-overflow();
    @include customScrollbar();
    &.collapse {
      height: initial;
    }
    .first-row {
      display: flex;
      align-items: center;
      background-color: #f7f7f7;
      padding: 13px 0;
      height: 50px;
      box-shadow: inset 0 -1px 0 0 #e9e9e9;
      
    }
    .second-row {
      @include font-14px();
      color: $color-font-active;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 20px;
      box-shadow: inset 0 -1px 0 0 #e9e9e9;
      .group {
        display: flex;
        align-items: center;
        span {
          margin-right: 10px;
        }
        .export {
          width: 64px;
          height: 28px;
          border: none;
          outline: none;
          cursor: pointer;
        }
      }
    }
    .third-row {
      @include font-14px();
      color: $color-font-normal;
      display: flex;
      flex-flow: column;
      align-items: center;
      flex: 1;
      .toolbar-title{
        font-size: 16px;
        color: $color-font-active;
        padding-top: 10px;
        .instruction{
          font-size: 12px;
          color: #666;
        }
      }
      .tab-change {
        width: 100%;
        .funcTemplate{
          border-top: 1px solid #dbdbdb;
          margin-top: 10px;
          padding-top: 10px;
        }
      }
    }
    .node-options {
      flex: 1;
      .node-option {
        width: 210px;
        display: flex;
        flex: 1;
        flex-direction: row;
        align-items: center;
        height: 94px;
        margin: 10px 0 20px;
        padding: 20px;
        border-radius: 2px;
        border: #e9e9e9 solid 1px;
        box-sizing: border-box;
        cursor: move;
        transition: all .2s ease-in-out;
        &:hover {
          box-shadow: 0 4px 9px 0 rgba(115, 115, 115, 0.2), 0 5px 8px 0 rgba(228, 228, 228, 0.5);
          background-color: #ffffff;
        }
        .node-icon {
          width: 40px;
          height: 60px;
        }
        .node-label {
          display: flex;
          flex-direction: column;
          margin-left: 20px;
          .node-name {
            @include font-14px();
            font-family:PingFang-SC-Medium,PingFang-SC;
            color: $color-font-active;
          }
          .node-description {
            //@include font-14px();
            font-size: 12px;
            color: $color-font-normal;
            margin-top: 8px;
          }
        }
      }
    }
  }
}
</style>
