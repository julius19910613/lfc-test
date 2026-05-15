<template>
<div id="edge-edit-tab">
  <div class="instruction">
    {{ $t('task_engine_v2.edge_edit_tab2.instruction_header') }}
  </div>
  <div class="title sticky">
    {{ $t('task_engine_v2.edge_edit_tab2.instruction') }}
    <!-- <span class="instruction" v-t="'task_engine_v2.edge_edit_tab2.instruction_hint'"></span> -->
    <div class="newbutton" v-show="normalEdges.length !== 0">
      <text-button :class="disabled1? 'disablestyle' : 'showstyle'"  @click.stop="showall">{{ $t('task_engine_v2.edge_edit_tab2.show_all')}}</text-button>
    <text-button :class="disabled2? 'disablestyle' : 'showstyle'" @click.stop="closeall">{{ $t('task_engine_v2.edge_edit_tab2.close_all')}}</text-button>
    </div>
  </div>
  <!-- 横线 -->
  <div class="add-new-line-wrap" @mouseover="addNewlineFlag=true"  @mouseout="addNewlineFlag = false">
    <el-popover
      placement="top"
      width="80"
      trigger="hover"
    >
      <div class="newLinepopContent" >
        <p class="title"> {{ $t('task_engine_v2.edge_edit_tab2.you_can_do')}} </p>
        <p class="option" @click="addnewACblock('new')">{{ $t('task_engine_v2.edge_edit_tab2.create_newEdge')}}</p>
        <p class="option" @click="addnewACblock('copy')" v-show="copyACblock!==0">{{ $t('task_engine_v2.edge_edit_tab2.paste_edge')}}</p>
      </div>
      <!-- <p slot="reference" class="add-new-line" v-show="addNewlineFlag"></p> -->
      <p slot="reference" v-show="addNewlineFlag">
        <img src="../../../_icon/images/addline.png" style="width:100%;"/>
      </p>
    </el-popover>
  </div>
  <draggable v-model="normalEdges" :disabled="draggabled" @start="drag=true" @end="drag=false; emitUpdate();">
    <template v-for="(edge, index) in normalEdges">
      <condition-action-block
        class="condition-action-block"
        :ref="`conditionActionBlock`"
        :key="edge.id"
        :nodeId="nodeId"
        :initialEdge="edge"
        :toNodeOptions="toNodeOptions"
        :mapTableOptions="mapTableOptions"
        :globalVarOptions="globalVarOptions"
        :jsCodeAlias="jsCodeAlias"
        :showConditionsAndAction='showConditionsAndActions'
        :num='num'
        :index='index'
        :scenarioId="scenarioId"
        @changeFlag='receiveFlag'
        @update="updateNormalEdge(index, $event)"
        @deleteEdge="deleteEdge(index)"
        @addNewDialogueNode="addNewDialogueNode"
        @addNewEdge='addNewEdge'
        @changeDrag='changedragabled'>
      </condition-action-block>
    </template>
  </draggable>
  <!-- + 新增连线-->
  <button class="button-add-edge" @click="addEdge" ref="add_button">
    {{ $t("task_engine_v2.edge_edit_tab2.button_add_edge") }}
  </button>
  <!-- 通用连线-->
  <div class="instruction common-edge">
    <div class="common-edge-title">{{ $t("task_engine_v2.edge_edit_tab2.common_edge") }}</div>
    <div class="common-edge-value">{{ $t("task_engine_v2.edge_edit_tab2.insert_common_edge") }}</div>
    <div class="common-toggle-wrap">
      <toggle class="common-toggle" v-model="useCommonEdge" :size="'medium'" :showLabel="true" :label="toggleLabel"></toggle>
    </div>
  </div>
  <div class="title" v-t="'task_engine_v2.edge_edit_tab2.exception_handle'"></div>
  <div class="section">
    <!--无法符合 则回复/跳转 -->
    <div class="incompatible">
      {{ $t("task_engine_v2.edge_edit_tab2.instruction_default_goto") }}
      <span class="dropdown-span">
        <dropdown-select
          :value="[incompatiblevalue]"
          @input="incompatiblevalue = $event[0]"
          :options="incompatibleoptions"
          :fixedListWidth="false"
          :showCheckedIcon="false"
          width="120px"
          :inputBarStyle="selectStyle"
        />
      </span>
      <span v-show="incompatiblevalue ===1">{{ $t("task_engine_v2.edge_edit_tab2.following_content") }}</span>
      <span v-show="incompatiblevalue ===2">
        <dropdown-select
          class="incompatibleGoto"
          ref="selectElseThenGoto"
          :value="[elseInto]"
          @input="elseInto = $event[0]"
          :options="elseIntoOptions"
          :fixedListWidth="false"
          :showCheckedIcon="false"
          :showSearchBar="true"
          width="200px"
          :inputBarStyle="selectStyle"/>
      </span>
    </div>
    <div class="block" v-show="incompatiblevalue ===1">
      <textarea class="replay-info" name="" id=""  :placeholder='elseThenAnswerholder' v-model="elseThenAnswer"></textarea>
    </div>
    <!-- 回話超過几次 -->
    <div class="block" v-show="incompatiblevalue ===1">
      <div class="condition-row">
        {{ $t("task_engine_v2.edge_edit_tab2.instruction_exeed_limit")}}
        <div style="width:60px; margin: 0 10px;" >
         <el-input-number
            size="mini"
            v-model="dialogueLimit"
            controls-position="right"
            @change="handleChange"
            :min="1"
            :max="10"
            >
          </el-input-number>
        </div>
        <!-- <input class="input-limit" ref="input-content" v-tooltip="tooltip" @focus="onInputFocus"
          oninput="this.value = this.value.replace(/^0$/g, ''); this.value = this.value.replace(/[^0-9]/g, ''); this.value = this.value.replace(/(^[0-9]{1,2}).*/g, '$1');"
          v-model="dialogueLimit"/> -->

        {{ $t("task_engine_v2.edge_edit_tab2.label_time") }}
        {{ $t("task_engine_v2.edge_edit_tab2.label_then_goto") }}
        <dropdown-select
          class="select"
          ref="selectExceedThenGoto"
          :value="[exceedThenGoto]"
          @input="exceedThenGoto = $event[0]"
          :options="exceedThenGotoOptions"
          :fixedListWidth="false"
          :showCheckedIcon="false"
          :showSearchBar="true"
          width="200px"
          :inputBarStyle="selectStyle"/>
      </div>
    </div>
    <!--统计标签-->
    <div class="condition-row jump-statistics ">
      <span class="jump-item">  {{ $t("task_engine_v2.edge_edit_tab2.label_tag")}} </span>
      <span>
        <toggle style="padding:0;" class="jump-item" v-model="elseIntoNodeLabelsEnable" :size="'small'" :showLabel="true" :label="toggleLabel"></toggle>
      </span>
      <tag-input ref='elseref'
       class="jump-tag"
        v-show="elseIntoNodeLabelsEnable"
        :origTags="origElseIntoNodeLabels"
        :tagsList="origToNodeLabelsList"
        :maxlength="10"
        @selectedTagsChanged="updateElseIntoNodeTags"
        :iconflag='false'
        :placeholder="inputholder"
      ></tag-input>
    </div>
    <!--统计标签group-->
    <div class="block">
      <div class="condition-row jump-statistics" v-show="elseIntoNodeLabelsEnable">
        <span style="opacity: 0;" class="jump-item">  {{ $t("task_engine_v2.edge_edit_tab2.label_tag")}} </span>
        <span style="opacity: 0;">
          <toggle class="jump-item" v-model="elseIntoNodeLabelsEnable" :size="'small'" :showLabel="true" :label="toggleLabel"></toggle>
        </span>
        <div class="jump-tag label-group">
          <div style="padding:5px 10px;">{{ $t("task_engine_v2.edge_edit_tab.label_command")}}</div>
          <ul class="taglistul">
            <li  class='taglistli' v-for="(item, index) in origToNodeLabelsList" :key='index' >
              <img src="../../../_icon/images/add.png" alt="" class="addicon" @click="addelselitext(index)">
              <span class="litext" @click="addelselitext(index)">{{item}}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- old 节点超出3次， 则前往-->
    <!-- <div class="block" v-if="exceedThenGoto !== null">
      <div class="label">
        {{ $t("task_engine_v2.edge_edit_tab2.label_exceed_limit") }}
      </div>
      <div class="condition-row">
        {{ $t("task_engine_v2.edge_edit_tab2.instruction_exeed_limit")}}
        <input class="input-limit" ref="input-content" v-tooltip="tooltip" @focus="onInputFocus"
          oninput="this.value = this.value.replace(/^0$/g, ''); this.value = this.value.replace(/[^0-9]/g, ''); this.value = this.value.replace(/(^[0-9]{1,2}).*/g, '$1');"
          v-model="dialogueLimit"/>
        {{ $t("task_engine_v2.edge_edit_tab2.label_time") }}
        {{ $t("task_engine_v2.edge_edit_tab2.label_then_goto") }}
        <dropdown-select
          class="select"
          ref="selectExceedThenGoto"
          :value="[exceedThenGoto]"
          @input="exceedThenGoto = $event[0]"
          :options="exceedThenGotoOptions"
          :fixedListWidth="false"
          :showCheckedIcon="false"
          :showSearchBar="true"
          width="200px"
          :inputBarStyle="selectStyle"/>
      </div>
      <div class="condition-row">
        {{ $t("task_engine_v2.edge_edit_tab.label_tag")}}
        <toggle class="label-margin-left" v-model="exceedThenGotoLabelsEnable" :size="'small'" :showLabel="true" :label="toggleLabel"></toggle>

      </div>

      <div class="condition-row" v-show="exceedThenGotoLabelsEnable">
        {{ $t("task_engine_v2.edge_edit_tab.label")}}
        <div class="dropdown-container label-margin-left" v-show="exceedThenGotoLabelsEnable">
          <tag-input ref='exceedref'
            :origTags="origExceedThenGotoLabels"
            :tagsList="origToNodeLabelsList"
            :maxlength="10"
            width="436px"
            @selectedTagsChanged="updateExceedThenGotoTags"
            :iconflag='false'
            :placeholder="inputholder"
          ></tag-input>
        </div>
      </div>
      <div class="condition-row" v-show="exceedThenGotoLabelsEnable">
         <span class="label"></span>
          <div style="background:#fff;width:436px;border:1px solid #dedede;margin-left:38px">
            <div style="padding:5px 10px;">{{ $t("task_engine_v2.edge_edit_tab.label_command")}}</div>
            <ul class="taglistul">
              <li  class='taglistli' v-for="(item, index) in origToNodeLabelsList" :key='index' >
                <img src="../../../_icon/images/add.png" alt="" class="addicon" @click="addexceedlitext(index)">
                <span class="litext" @click="addexceedlitext(index)">{{item}}</span>
              </li>
            </ul>
          </div>
      </div>

    </div> -->

    <!-- old 规则无法符合时， 则前往-->
    <!-- <div class="block">
      <div class="label">
        {{ $t("task_engine_v2.edge_edit_tab2.label_default_goto") }}
      </div>
      <div class="condition-row">
        {{ $t("task_engine_v2.edge_edit_tab2.instruction_default_goto") }}
        {{ $t("task_engine_v2.edge_edit_tab2.label_then_goto") }}
        <dropdown-select
          class="select"
          ref="selectElseThenGoto"
          :value="[elseInto]"
          @input="elseInto = $event[0]"
          :options="elseIntoOptions"
          :fixedListWidth="false"
          :showCheckedIcon="false"
          :showSearchBar="true"
          width="200px"
          :inputBarStyle="selectStyle"/>
      </div>
      <div class="condition-row">
        {{ $t("task_engine_v2.edge_edit_tab.label_tag")}}
        <toggle class="label-margin-left" v-model="elseIntoNodeLabelsEnable" :size="'small'" :showLabel="true" :label="toggleLabel"></toggle>
      </div>
      <div class="condition-row" v-show="elseIntoNodeLabelsEnable">
        {{ $t("task_engine_v2.edge_edit_tab.label")}}
        <div class="dropdown-container label-margin-left" >
          <tag-input ref='elseref'
            :origTags="origElseIntoNodeLabels"
            :tagsList="origToNodeLabelsList"
            :maxlength="10"
            width="436px"
            @selectedTagsChanged="updateElseIntoNodeTags"
            :iconflag='false'
            :placeholder="inputholder"
          ></tag-input>
        </div>
      </div>
      <div class="condition-row" v-show="elseIntoNodeLabelsEnable">
        <span class="label"></span>
          <div style="background:#fff;width:436px;border:1px solid #dedede;margin-left:38px">
            <div style="padding:5px 10px;">{{ $t("task_engine_v2.edge_edit_tab.label_command")}}</div>
            <ul class="taglistul">
              <li  class='taglistli' v-for="(item, index) in origToNodeLabelsList" :key='index' >
                <img src="../../../_icon/images/add.png" alt="" class="addicon" @click="addelselitext(index)">
                <span class="litext" @click="addelselitext(index)">{{item}}</span>
              </li>
            </ul>
          </div>
      </div>


    </div> -->

  </div>
</div>
</template>

<script>
import event from '@/utils/js/event';
import { mapGetters, mapMutations } from 'vuex';
import draggable from 'vuedraggable';
import DropdownSelect from '@/components/DropdownSelect';
import general from '@/modules/TaskEngine/_utils/general';
import TagInput from '@/components/basic/TagInput';
import ConditionActionBlock from './ConditionActionBlock';
import scenarioInitializer from '../_utils/scenarioInitializer';
import getTagList from '../_utils/getTagList';

export default {
  components: {
    draggable,
    DropdownSelect,
    ConditionActionBlock,
    TagInput,
  },
  props: {
    ttsInfo: {
      type: Object,
    },
    scenarioId: {
      type: String,
      required: true,
    },
    edgeTab: {
      type: Object,
      required: true,
    },
    initialToNodeOptions: {
      type: Array,
      required: true,
    },
    globalVarOptions: {
      type: Array,
      required: true,
    },
    mapTableOptions: {
      type: Array,
      required: true,
    },
    nodeId: {
      type: String,
      required: true,
    },
    nodeType: {
      type: String,
      required: true,
    },
    jsCodeAlias: {
      type: Array,
      default: () => [],
    },
    failureResponse: {
      type: String,
      required: true,
    },
  },
  data() {
    const edgeTab = this.edgeTab;
    const exceedThenGoto = edgeTab.exceedThenGoto || null;
    const elseInto = edgeTab.elseInto;
    const dialogueLimit = edgeTab.dialogueLimit || null;
    let useCommonEdge;
    if (edgeTab.useCommonEdge === 'undefined') { // 兼容此版本之前的旧task无该字段
      useCommonEdge = true;
    } else {
      useCommonEdge = edgeTab.useCommonEdge;
    }
    const origExceedThenGotoLabels = edgeTab.exceedThenGotoLabels || [];
    const exceedThenGotoLabels = edgeTab.exceedThenGotoLabels || [];
    const exceedThenGotoLabelsEnable = edgeTab.exceedThenGotoLabelsEnable || false;
    const origElseIntoNodeLabels = edgeTab.elseIntoNodeLabels || [];
    const elseIntoNodeLabels = edgeTab.elseIntoNodeLabels || [];
    const elseIntoNodeLabelsEnable = edgeTab.elseIntoNodeLabelsEnable || false;

    // add tmp id for edges
    const normalEdges = edgeTab.normalEdges.map((edge) => {
      const obj = { ...edge };
      obj.id = this.$uuid.v1();
      obj.valid = true;
      return obj;
    });

    this.doNothingEdge = { text: this.$t('task_engine_v2.to_node_option.do_nothing_zh'), value: null };
    this.exitEdge = { text: this.$t('task_engine_v2.to_node_option.exit_zh'), value: '0' };
    this.parseFailedEdge = {
      text: this.$t('task_engine_v2.to_node_option.parse_fail'),
      value: 'parseFailedEdge',
    };
    this.addNewDialogueNodeEdge = {
      text: this.$t('task_engine_v2.to_node_option.add_new_dialogue_node_2'),
      value: 'add_new_dialogue_node',
      isButton: true,
    };
    this.gotoSelfEdge = {
      text: this.$t('task_engine_v2.to_node_option.to_self'),
      value: '-1',
    };
    const elseThenAnswer = this.failureResponse;
    const incompatiblevalue = edgeTab.elsethenSelect || 1;
    // render toNodeOptions, exceedThenGotoOptions, elseIntoOptions
    const {
      toNodeOptions,
      exceedThenGotoOptions,
      elseIntoOptions,
    } = this.composeOptions(this.initialToNodeOptions, this.nodeType);
    return {
      normalEdges,
      dialogueLimit,
      elseThenAnswer,
      newNodeOptions: undefined,
      toNodeOptions,
      exceedThenGoto,
      exceedThenGotoOptions,
      origExceedThenGotoLabels,
      exceedThenGotoLabels,
      exceedThenGotoLabelsEnable,
      elseInto,
      elseIntoOptions,
      origElseIntoNodeLabels,
      elseIntoNodeLabels,
      elseIntoNodeLabelsEnable,
      selectStyle: {
        height: '32px',
        'border-radius': '2px',
      },
      tooltip: {
        msg: this.$t('task_engine_v2.err_empty'),
        eventOnly: true,
        errorType: true,
        alignLeft: true,
        absolute: true,
      },
      showConditionsAndActions: true,
      num: 0,
      disabled1: true,
      disabled2: false,
      toggleLabel: {
        on: this.$t('task_engine_v2.edge_edit_tab.on'),
        off: this.$t('task_engine_v2.edge_edit_tab.off'),
      },
      origToNodeLabelsList: [],
      origExceedThenGototagsList: [],
      inputholder: this.$t('task_engine_v2.edge_edit_tab2.inputholder'),
      elseThenAnswerholder: this.$t('task_engine_v2.edge_edit_tab2.elseThenAnswerholder'),
      incompatibleoptions: [
        { value: 1, text: this.$t('task_engine_v2.edge_edit_tab2.answer'), isButton: true },
        { value: 2, text: this.$t('task_engine_v2.edge_edit_tab2.goto_block'), isButton: true },
      ],
      incompatiblevalue,
      useCommonEdge,
      draggabled: false,
      addNewlineFlag: false,
    };
  },
  computed: {
    ...mapGetters([
      'modelDAta',
      'globalTTSinfo',
      'copyACblock',
    ]),
  },
  watch: {
    modelDAta: {
      handler() {
        this.getTagList();
      },
    },
    'normalEdges.length': function (newV, oldV) { // eslint-disable-line
      if (newV > oldV) {
        this.$nextTick(() => {
          // this.$refs.conditionActionBlock[newV - 1].$el.scrollIntoView();
          this.$refs.add_button.scrollIntoView({ block: 'end', behavior: 'auto' });
        });
      }
    },
    incompatiblevalue(val) {
      if (val === 2) {
        this.exceedThenGoto = null;
        this.elseInto = '0';
        this.$refs.selectExceedThenGoto.$emit('reset', [this.exceedThenGoto]);
        this.$refs.selectElseThenGoto.$emit('reset', [this.elseInto]);
      } else {
        this.exceedThenGoto = '0';
        this.elseInto = 'parseFailedEdge';
        this.$refs.selectExceedThenGoto.$emit('reset', [this.exceedThenGoto]);
        this.$refs.selectElseThenGoto.$emit('reset', [this.elseInto]);
      }
      this.emitUpdate();
    },
    dialogueLimit: {
      handler() {
        this.emitUpdate();
      },
    },
    elseThenAnswer: {
      handler() {
        this.emitUpdate();
      },
    },
    exceedThenGoto: {
      handler() {
        if (this.exceedThenGoto === 'add_new_dialogue_node') {
          const newNodeID = scenarioInitializer.guid_sort();
          this.addNewDialogueNode(newNodeID);
          this.exceedThenGoto = newNodeID;
        }
        this.emitUpdate();
      },
    },
    elseInto: {
      handler(val) {
        console.log(val);
        if (this.elseInto === 'add_new_dialogue_node') {
          const newNodeID = scenarioInitializer.guid_sort();
          this.addNewDialogueNode(newNodeID);
          this.elseInto = newNodeID;
        }
        this.emitUpdate();
      },
    },
    exceedThenGotoLabels: {
      handler() {
        this.emitUpdate();
      },
    },
    exceedThenGotoLabelsEnable: {
      handler() {
        this.emitUpdate();
      },
    },
    elseIntoNodeLabels: {
      handler() {
        this.emitUpdate();
      },
    },
    elseIntoNodeLabelsEnable: {
      handler() {
        this.emitUpdate();
      },
    },
    useCommonEdge: {
      handler() {
        this.emitUpdate();
      },
    },
  },
  methods: {
    ...mapMutations([
      'setcpoyConditionActionBlock',
    ]),
    addnewACblock(val) {
      const newEdge = {
        index: -1,
        type: val,
      };
      this.addNewEdge(newEdge);
    },
    changedragabled(val) {
      this.draggabled = val;
    },
    addNewEdge(val) {
      const startindex = val.index + 1;
      if (val.type === 'new') { // 新增一个新的连线
        const edge = scenarioInitializer.initialNormalEdge2();
        edge.id = this.$uuid.v1();
        edge.valid = true;
        edge.open = 1;
        this.normalEdges.splice(startindex, 0, edge);
      } else {
        this.copyACblock.id = this.$uuid.v1();
        this.normalEdges.splice(startindex, 0, this.copyACblock);
        this.setcpoyConditionActionBlock(0);
      }
      this.judge();
      this.emitUpdate();
      this.$forceUpdate();
    },
    addexceedlitext(idx) {
      this.$refs.exceedref.addTagBySelector(idx);
    },
    addelselitext(idx) {
      this.$refs.elseref.addTagBySelector(idx);
    },
    showall() {
      this.showConditionsAndActions = true;
      this.num += 1;
      this.disabled1 = true;
      this.disabled2 = false;
      this.normalEdges.forEach((item) => {
        item.open = 1;
      });
    },
    closeall() {
      this.showConditionsAndActions = false;
      this.num += 1;
      this.disabled1 = false;
      this.disabled2 = true;
      this.normalEdges.forEach((item) => {
        item.open = 0;
      });
    },
    receiveFlag(count) {
      this.normalEdges.forEach((item, index) => {
        if (index === count.index) {
          item.open = count.open;
        }
      });
      this.judge();
    },
    judge() {
      let jishu = 0;
      this.normalEdges.forEach((item) => {
        jishu += item.open;
      });
      if (jishu === this.normalEdges.length) {
        this.zhankai = true;
        this.disabled1 = true;
        this.disabled2 = false;
      } else if (!jishu) {
        this.zhankai = false;
        this.disabled2 = true;
        this.disabled1 = false;
      } else {
        this.disabled1 = false;
        this.disabled2 = false;
      }
    },
    addNewDialogueNode(newNodeID) {
      if (this.newNodeOptions === undefined) {
        this.newNodeOptions = [];
      }
      const nodeNames = [
        ...window.moduleData.ui_data.nodes.map(node => node.nodeName),
        ...this.newNodeOptions.map(option => option.nodeName),
      ];
      const newNodeName = general.suffixIndexToNodeName(
                            this.$t('task_engine_v2.node_type.dialogue2'),
                            nodeNames,
                          );
      this.newNodeOptions.push({
        nodeName: newNodeName,
        nodeId: newNodeID,
        nodeType: 'dialogue_2.0',
      });
      this.$emit('updateNewNodeOptions', this.newNodeOptions);
      this.updateOptions();
    },
    updateOptions() {
      const { toNodeOptions, exceedThenGotoOptions, elseIntoOptions } = this.composeOptions(
        [
          ...this.initialToNodeOptions,
          ...this.newNodeOptions.map(option => ({
            text: `${option.nodeName} (ID: ${option.nodeId})`,
            value: option.nodeId,
          })),
        ],
        this.nodeType,
      );
      this.toNodeOptions = toNodeOptions;
      this.exceedThenGotoOptions = exceedThenGotoOptions;
      this.elseIntoOptions = elseIntoOptions;
    },
    composeOptions(options, nodeType) {
      let toNodeOptions;
      let exceedThenGotoOptions;
      let elseIntoOptions;
      if (nodeType === 'entry') {
        toNodeOptions = [
          this.addNewDialogueNodeEdge,
          this.doNothingEdge,
        ].concat(options);
        exceedThenGotoOptions = [];
        elseIntoOptions = [
          this.addNewDialogueNodeEdge,
        ].concat(options);
      } else if (nodeType === 'dialogue' || nodeType === 'dialogue_2.0' || nodeType === 'sub_scenario') {
        toNodeOptions = [
          this.addNewDialogueNodeEdge,
          this.gotoSelfEdge,
          this.doNothingEdge,
          this.exitEdge,
        ].concat(options);
        exceedThenGotoOptions = [
          this.addNewDialogueNodeEdge,
          this.exitEdge,
        ].concat(options);
        elseIntoOptions = [
          this.addNewDialogueNodeEdge,
          this.parseFailedEdge,
          this.exitEdge,
        ].concat(options);
      } else { // nodeType = nlu_pc or action
        toNodeOptions = [
          this.addNewDialogueNodeEdge,
          this.doNothingEdge,
          this.exitEdge,
        ].concat(options);
        exceedThenGotoOptions = [];
        elseIntoOptions = [
          this.addNewDialogueNodeEdge,
          this.exitEdge,
        ].concat(options);
      }
      return { toNodeOptions, exceedThenGotoOptions, elseIntoOptions };
    },
    updateNormalEdge(index, $event) {
      this.normalEdges[index] = $event;
      this.emitUpdate();
    },
    addEdge() {
      const edge = scenarioInitializer.initialNormalEdge2();
      edge.id = this.$uuid.v1();
      edge.valid = true;
      edge.open = 1;
      this.normalEdges.push(edge);
      this.judge();
      this.emitUpdate();
    },
    deleteEdge(index) {
      this.normalEdges.splice(index, 1);
      this.judge();
      this.emitUpdate();
    },
    emitUpdate() {
      const edgeTab = {
        elseInto: this.elseInto || null,
        elseIntoNodeLabels: this.elseIntoNodeLabels,
        elseIntoNodeLabelsEnable: this.elseIntoNodeLabelsEnable,
        normalEdges: this.normalEdges.map((edge) => {
          const { id, valid, ...rest } = edge;
          return rest;
        }),
        useCommonEdge: this.useCommonEdge,
        // failureResponse: this.elseThenAnswer,
        elsethenSelect: this.incompatiblevalue,
      };
      if (this.dialogueLimit !== null) {
        edgeTab.dialogueLimit = parseInt(this.dialogueLimit, 10) || null;
      }
      // if (this.exceedThenGoto !== null) {
      //   edgeTab.exceedThenGoto = this.exceedThenGoto;
      //   edgeTab.exceedThenGotoLabels = this.exceedThenGotoLabels;
      //   edgeTab.exceedThenGotoLabelsEnable = this.exceedThenGotoLabelsEnable;
      // }
      edgeTab.exceedThenGoto = this.exceedThenGoto || null;
      edgeTab.exceedThenGotoLabels = this.exceedThenGotoLabels;
      edgeTab.exceedThenGotoLabelsEnable = this.exceedThenGotoLabelsEnable;
      this.$emit('update', edgeTab);
      this.$emit('updateFailureResponse', this.elseThenAnswer);
      this.$emit('update:valid', this.isValid());
    },
    onInputFocus(evt) {
      evt.target.dispatchEvent(event.createEvent('tooltip-hide'));
    },
    isValid() {
      const valid = general.isInputContentsValid(this.$refs['input-content']);
      if (!valid) {
        return false;
      }
      for (let i = 0; i < this.normalEdges.length; i += 1) {
        const edge = this.normalEdges[i];
        if (!edge.valid) {
          return false;
        }
      }
      return true;
    },
    showToolTip() {
      general.showInputContentTooltip(this.$refs['input-content']);
      const conditionActionBlocks = this.$refs.conditionActionBlock;
      if (conditionActionBlocks) {
        let blocks = conditionActionBlocks;
        if (!Array.isArray(blocks)) {
          blocks = [blocks];
        }
        blocks.forEach((block) => {
          block.$emit('showToolTip');
        });
      }
    },
    updateExceedThenGotoTags(tags) {
      this.exceedThenGotoLabels = tags;
    },
    updateElseIntoNodeTags(tags) {
      this.elseIntoNodeLabels = tags;
    },
    getTagList() {
      this.origToNodeLabelsList = getTagList.getTagList(this.modelDAta);
    },
    handleChange(val) {
      console.log(val);
    },
  },
  mounted() {
    this.$on('showToolTip', this.showToolTip);
    this.getTagList();
  },
};
</script>

<style lang="scss" scoped>
#edge-edit-tab {
  padding: 0 20px;
  @include font-14px();
  color: $color-font-active;
  .add-new-line-wrap{
    box-sizing: border-box;
    width: 100%;
    height: 15px;
    .newLinepopContent{
      font-size: 10px;
      font-weight: 400;
      line-height: 20px;
      color: rgba(84,84,84,1);
      cursor: pointer;
      .title{
        font-size: 12px;
        line-height: 16px;
        color: #868686;
        margin-bottom: 10px;
      }
      .option{
        font-size: 14px;
        line-height: 34px;
        &:hover{
          color: rgba(24,117,240,1);
        }
      }
    }
  }
  .instruction {
    color: $color-font-mark;
  }
  .title {
    padding: 20px 0 10px;
    position: relative;
    box-sizing: border-box;
    background: #fff;
    margin-bottom: 10px;
    .newbutton {
      position: absolute;
      right: 0;
      bottom: 5px;
      .showstyle {
        background: #4b4b64;
        color: rgba(255,255,255,1);
        width: 80px;
      }
      .disablestyle {
        background: rgba(204,204,204,1);
        color: rgba(255,255,255,1);
        width: 80px;
      }
    }
  }
  .add-new-line-wrap{
    box-sizing: border-box;
    width: 100%;
    height: 15px;
  }
  .condition-action-block{
    border: 1px solid rgba(222,222,222,1);
    border-radius: 1px;
  }
  .condition-action-block:not(:last-of-type) {
    margin-bottom: 15px;
  }
  .section {
    padding: 20px;
    background:rgba(247,247,247,1);
    border-radius:2px;
    border:1px solid rgba(219,219,219,1);
    .block {
      .replay-info{
        width: 100%;
        height: 80px;
      }
      &:not(:last-child) {
        margin-bottom: 20px;
      }
      .label {
        margin-bottom: 10px;
      }
      .condition-row {
        display: flex;
        align-items: center;
        color: $color-font-normal;
        margin-bottom: 4px;
        .label-margin-left {
          margin-left: 10px;
        }
        .tags-container{
        height: 36px;
      }
      .taglistul{
        margin: 5px 10px;
        overflow: auto;
        .taglistli{
          float: left;
          margin-right: 10px;
          margin-bottom: 5px;
          padding: 5px;
          height: 24px;
          background: rgb(238, 238, 238);
          font-size: 12px;
          .addicon{
            width: 14px;
            height: 14px;
            opacity: 0.7;
          }
          .litext{
            display: inline-block;
            font-size: 12px;
            position: relative;
            top: -2px;
            line-height: 14px;
          }
        }
      }
        .input-limit {
          height: 32px;
          margin: 0px 10px;
          width: 50px;
        }
        .select {
          background: white;
          margin-left: 10px;
          border-radius: 2px;
        }
      }
    }
  }
  .sticky{
    position: sticky;
    top: 0px;
    z-index: 2;
  }
  .button-add-edge {
    // position: sticky;
    // top: 0px;
    z-index: 1;
    width: 120px;
    height: 28px;
    background: rgba(24,117,240,1);
    color: white;
    margin-bottom: 10px;
    margin-top: 15px;
    cursor: pointer;
    border-radius: 2px;
  }
}
.el-input-number{
  width: 60px!important;
  .is-controls-right{
    .el-input__inner{
      width: 100%!important;
      padding-left: 15px!important;
      padding-right: 0 !important;
    }
  }
}
.incompatible{
  display: flex;
  flex-direction: row;
  margin: 0 0 10px 0;
  height: 32px;
  line-height: 32px;
  .dropdown-span{
    margin: 0 10px;
  }
}
.incompatibleGoto{
  width: 160px;
  height: 32px;
}
.is-controls-right{
  padding-right: 0 !important;
  }
.jump-statistics{
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;
  .jump-item{
    margin-right: 10px;
  }
  .jump-tag{
    flex: 1;
    position: relative;
  }
  .label-group{
    background:#fff;
    border:1px solid #dedede;
  }
}
.instruction{
  height: 48px;
  line-height: 48px;
  background:rgba(247,247,247,1);
  border-radius:2px;
  border:1px solid rgba(219,219,219,1);
  padding-left: 20px;
  color: #666;
}
.common-edge{
  display: flex;
  flex-direction: row;
  align-items: center;
  .common-edge-title{
    width: 100px;
    margin-right: 10px;
    color: #666;
    text-align: right;
    font-size: 16px;
  }
  .common-toggle-wrap{
    flex: 1;
    padding-right: 42px;
    .common-toggle{
      float: right;
    }
  }
}
#edge-edit-tab {
  .el-input-number{
    width: 60px;
    ::v-deep .el-input .el-input__inner{
      width: 60px;
      padding-left: 15px;
      padding-right: 35px;
    }
  }
}
.newLinepopContent{
  font-size: 10px;
  font-weight: 400;
  line-height: 20px;
  color: rgba(84,84,84,1);
  cursor: pointer;
  .title{
    font-size: 12px;
    line-height: 16px;
    color: #868686;
    margin-bottom: 10px;
  }
  .option{
    font-size: 14px;
    line-height: 34px;
    &:hover{
      color: rgba(24,117,240,1);
    }
  }
}
</style>
