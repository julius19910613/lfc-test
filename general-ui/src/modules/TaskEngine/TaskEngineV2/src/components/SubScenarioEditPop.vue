<template>
  <div id="subScenario">
    <div class="gray_block" v-for="(item, idx) in renderEdges" :key="idx">
      <div class="right-wrap wrap">
        <div class="title">{{ $t("task_engine_v2.sub_scenario_tab.when_answer") }}</div>
        <div>{{item.node_name}}{{item.edge_name}}</div>
      </div>
      <div class="left-wrap wrap">
        <div class="title">{{ $t("task_engine_v2.sub_scenario_tab.then_go") }}</div>
        <div>
          <!-- <el-select size="mini" v-model="item.gotonode" placeholder="请选择" @change="((item) => selectgoto(item, idx))">
            <el-option
              v-for="item in toNodeOptions"
              :key="item.value"
              :label="item.text"
              :value="item.value">
            </el-option>
          </el-select> -->
          <dropdown-select
          class="incompatibleGoto"
          ref="selectElseThenGoto"
          :value="[item.gotonode]"
          @input="selectgoto($event[0], idx)"
          :options="toNodeOptions"
          :fixedListWidth="false"
          :showCheckedIcon="false"
          :showSearchBar="true"
          width="160px"
          :inputBarStyle="selectStyle"/>
        </div>
      </div>
    </div>
    <div class="incompatible gray_block">
       <div class="right-wrap wrap">
      {{ $t("task_engine_v2.edge_edit_tab2.instruction_default_goto") }}
      </div>
      <div class="left-wrap wrap">
        <div class="title">{{ $t("task_engine_v2.sub_scenario_tab.then_go") }}</div>
        <!-- <el-select size="mini" v-model="elseInto" placeholder="请选择">
            <el-option
              v-for="item in elseIntoOptions"
              :key="item.value"
              :label="item.text"
              :value="item.value">
            </el-option>
          </el-select> -->
        <dropdown-select
          class="incompatibleGoto"
          ref="selectElseThenGoto"
          :value="[elseInto]"
          @input="elseInto = $event[0]"
          :options="elseIntoOptions"
          :fixedListWidth="false"
          :showCheckedIcon="false"
          :showSearchBar="true"
          width="160px"
          :inputBarStyle="selectStyle"/>
      </div>
    </div>
  </div>
</template>
<script>
import general from '@/modules/TaskEngine/_utils/general';
import scenarioInitializer from '../_utils/scenarioInitializer';

export default {
  props: {
    subedges: {
      type: Array,
      required: true,
    },
    initialToNodeOptions: {
      type: Array,
      required: true,
    },
    node: {
      type: Object,
      required: true,
    },
    edgeTab2: {
      type: Object,
      required: true,
    },
  },
  data() {
    const normalEdges = this.edgeTab2.normalEdges;
    let renderEdges = [];
    const orignalEdges = [];
    if (normalEdges.length === 0) {
      // 初始化
      renderEdges = this.subedges;
    } else {
      // 比较subedges 与 normalEdges中 的 edge_name 是否有变化，若无，渲染normalEdges中； 若有，渲染subedges;
      normalEdges.forEach((item) => {
        const edge = item.condition_rules[0].function.content;
        orignalEdges.push({
          node_id: edge.node_id,
          node_name: edge.node_name,
          edge_name: edge.edge_name,
          gotonode: item.to_node_id,
        });
      });
      const a = [];
      orignalEdges.forEach((item) => {
        const { gotonode, ...otheritem } = item;
        a.push(otheritem);
      });
      const b = [];
      this.subedges.forEach((item) => {
        const { gotonode, ...otheritem } = item;
        b.push(otheritem);
      });
      if (JSON.stringify(a) === JSON.stringify(b)) {
        renderEdges = orignalEdges;
      } else {
        orignalEdges.forEach((item) => {
          this.subedges.forEach((el) => {
            if (item.id === el.id && item.edge_name === el.edge_name) {
              el.gotonode = item.gotonode;
            }
          });
        });
        renderEdges = this.subedges;
      }
    }
    const elseInto = this.edgeTab2.elseInto;
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
    this.doNothingEdge = { text: this.$t('task_engine_v2.to_node_option.do_nothing_zh'), value: null };
    this.exitEdge = { text: this.$t('task_engine_v2.to_node_option.exit_zh'), value: '0' };
    const {
      toNodeOptions,
      exceedThenGotoOptions,
      elseIntoOptions,
    } = this.composeOptions(this.initialToNodeOptions, this.nodeType);
    return {
      toNodeOptions,
      exceedThenGotoOptions,
      elseIntoOptions,
      elseInto,
      renderEdges,
      selectStyle: {
        height: '32px',
        'border-radius': '2px',
      },
    };
  },
  watch: {
    elseInto(val) {
      if (val === 'add_new_dialogue_node') {
        const newNodeID = scenarioInitializer.guid_sort();
        this.addNewDialogueNode(newNodeID);
        this.elseInto = newNodeID;
      }
      this.emitUpdate();
    },
  },
  methods: {
    selectgoto(toNode, index) {
      if (toNode === 'add_new_dialogue_node') {
        const newNodeID = scenarioInitializer.guid_sort();
        this.addNewDialogueNode(newNodeID);
        this.renderEdges[index].gotonode = newNodeID;
      } else {
        this.renderEdges[index].gotonode = toNode;
      }
      this.emitUpdate();
      this.$forceUpdate();
    },
    emitUpdate() {
      const normalEdges = [];
      this.renderEdges.forEach((item) => {
        normalEdges.push({
          edge_type: 'normal_2.0',
          edge_name: 'return_flag_edge',
          to_node_id: item.gotonode,
          to_node_labels: [],
          to_node_labels_enable: false,
          logic: 'AND',
          actions: [],
          condition_rules: [
            {
              function: {
                content: {
                  compare: '==',
                  node_id: item.node_id,
                  node_name: item.node_name,
                  edge_name: item.edge_name,
                },
                function_name: 'return_flag_match',
              },
              source: 'global_info',
            },
          ],
        });
      });
      this.edgeTab2.elseInto = this.elseInto;
      this.edgeTab2.normalEdges = normalEdges;
      this.$emit('update', this.edgeTab2);
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
          // this.parseFailedEdge,
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
  },
  created() {
    this.subedges.forEach((item) => {
      item.gotonode = null;
    });
  },
  mounted() {
  },
};
</script>
<style lang="scss" scoped>
  #subScenario{
    min-height: 270px;
    padding: 0 20px;
    margin-top: 20px;
    .gray_block{
      height: 40px;
      background: rgba(247,247,247,1);
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      padding: 0 50px 0 20px;
      line-height: 40px;
      margin-bottom: 10px;
      box-sizing: border-box;
      .wrap{
        display: flex;
        flex-direction: row;
      }
      .title{
        margin-right: 10px;
        color: #666;
      }
    }
    .incompatible{
      display: flex;
      flex-direction: row;
      margin: 0 0 10px 0;
      height: 40px;
      line-height: 40px;
    }
    .incompatibleGoto{
      width: 160px;
      height: 40px;
    }
  }
</style>
