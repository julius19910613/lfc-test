<template>
<div id="edge-edit-tab">
  <div class="title">
    {{ $t('task_engine_v2.sub_scenario_tab.instruction') }}
    <span class="instruction" v-t="'task_engine_v2.sub_scenario_tab.instruction_hint'"></span>
    <div class="newbutton">
      <text-button :class="disabled1? 'disablestyle' : 'showstyle'"  @click.stop="showall">{{ $t('task_engine_v2.sub_scenario_tab.show_all')}}</text-button>
    <text-button :class="disabled2? 'disablestyle' : 'showstyle'" @click.stop="closeall">{{ $t('task_engine_v2.sub_scenario_tab.close_all')}}</text-button>
    </div>
  </div>
  <button class="button-add-edge" @click="addEdge">
    {{ $t("task_engine_v2.sub_scenario_tab.button_add_sub_scenario") }}
  </button>
  <draggable v-model="normalEdges" :options="{ghostClass:'ghost'}" @start="drag=true" @end="drag=false; emitUpdate();">
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
        :currentTab='`subScenarioTab`'
        @changeFlag='receiveFlag'
        @update="updateNormalEdge(index, $event)"
        @deleteEdge="deleteEdge(index)"
        @addNewDialogueNode="addNewDialogueNode">
      </condition-action-block>
    </template>
  </draggable>

</div>
</template>

<script>
import event from '@/utils/js/event';
import { mapGetters } from 'vuex';
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
  },
  data() {
    const edgeTab = this.edgeTab;
    const exceedThenGoto = edgeTab.exceedThenGoto || null;
    const elseInto = edgeTab.elseInto;
    const dialogueLimit = edgeTab.dialogueLimit || null;

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

    // render toNodeOptions, exceedThenGotoOptions, elseIntoOptions
    const {
      toNodeOptions,
      exceedThenGotoOptions,
      elseIntoOptions,
    } = this.composeOptions(this.initialToNodeOptions, this.nodeType);
    return {
      normalEdges,
      dialogueLimit,
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
      inputholder: '输入标签按回车添加',
    };
  },
  computed: {
    ...mapGetters([
      'modelDAta',
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
          this.$refs.conditionActionBlock[newV - 1].$el.scrollIntoView();
        });
      }
    },
  },
  methods: {
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
      } else if (nodeType === 'dialogue' || nodeType === 'dialogue_2.0') {
        toNodeOptions = [
          this.addNewDialogueNodeEdge,
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
      };
      if (this.dialogueLimit !== null) {
        edgeTab.dialogueLimit = parseInt(this.dialogueLimit, 10) || null;
      }
      if (this.exceedThenGoto !== null) {
        edgeTab.exceedThenGoto = this.exceedThenGoto;
        edgeTab.exceedThenGotoLabels = this.exceedThenGotoLabels;
        edgeTab.exceedThenGotoLabelsEnable = this.exceedThenGotoLabelsEnable;
      }
      this.$emit('update', edgeTab);
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
  .instruction {
    color: $color-font-mark;
  }
  .title {
    margin: 20px 0 10px;
    position: relative;
    .newbutton {
      float: right;
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
  .condition-action-block:not(:last-of-type) {
    margin-bottom: 10px;
  }
  .section {
    background-color: $color-disabled;
    padding: 20px;
    .block {
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
  .button-add-edge {
    border-color: $color-primary;
    position: sticky;
    z-index: 1;
    top: 0;
    width: 100%;
    height: 32px;
    background: $color-primary;
    color: white;
    margin-bottom: 20px;
    cursor: pointer;
    border-radius: 3px;
  }
}
</style>
