<template>
  <div class='edit-scenario-wrapper'>
    <div class="left-wrapper">
      <span class="tree-title">
        {{isChildScenario ? `【${taskJson.title}】- 子节点收集` : '节点设定'}}
      </span>
      <draggable-tree class="tree" ref="nodeTree" :data="taskDataUI"
      @drag="handleUpdateByTree" @add="handleAddTaskNode"
      @select="handleSelectNode"></draggable-tree>
      <div class="gap"></div>
      <div class="general-nodes-wrapper" v-if="taskJson.generalNodes">
        <h1>全局通用设定</h1>
        <!-- {{taskJson.generalNodes}} -->
        <div class="general-node"
        @click="handleClickGeneralNode(generalNode)"
        v-for="(generalNode, index) in taskJson.generalNodes" :key="index">
        {{generalNode.title}}</div>
      </div>
    </div>
    <div class="right-wrapper">
      <!-- {{taskJson}} -->
      <div v-if="!selectedNode.id"></div>
      <edit-entry v-else-if="showEditMainEntry" :data="selectedNode"
      @update="handleUpdate"></edit-entry>
      <edit-sub-entry v-else-if="showEditSubEntry" :data="selectedNode"
      @update="handleUpdate"></edit-sub-entry>
      <edit-question v-else-if="showEditQuestion" v-model="selectedNode"
      @delete="handleDeleteQuestion"
      @update="handleUpdate"></edit-question>
      <edit-group v-else-if="showEditGroup" :data="selectedNode"
      @update="handleUpdate"></edit-group>
      <edit-confirm v-else-if="showEditConfirm" :data="selectedNode"
      @update="handleUpdate"></edit-confirm>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import DraggableTree from './DraggableTree/DraggableTree';
import EditEntry from './EditEntry';
import EditSubEntry from './EditSubEntry';
import EditGroup from './EditGroup';
import EditConfirm from './EditConfirm';
import EditQuestion from './EditQuestion';
import api from '../js/http/requests';
import templates from '../store/templates';

export default {
  $api: api,
  props: {
    taskJson: {
      type: Object,
      default() {
        return {};
      },
    },
    isChildScenario: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      taskDataUI: [],
      // 修改任务名字
      isEditingName: false,
      // .
      selectedNode: {},
    };
  },
  components: {
    DraggableTree,
    EditEntry,
    EditSubEntry,
    EditGroup,
    EditQuestion,
    EditConfirm,
  },
  computed: {
    ...mapGetters([
      'appId',
    ]),
    taskId() {
      return this.$route.params.taskId;
    },
    showEditMainEntry() {
      return this.selectedNode && this.selectedNode.id === 'entry' && !this.isChildScenario;
    },
    showEditSubEntry() {
      return this.selectedNode && this.selectedNode.id === 'entry' && this.isChildScenario;
    },
    showEditGroup() {
      return this.selectedNode && this.selectedNode.nodes;
    },
    showEditConfirm() {
      return this.selectedNode && this.selectedNode.type === 'confirm';
    },
    showEditQuestion() {
      return this.selectedNode && this.selectedNode.id !== 'entry'
      && !this.selectedNode.nodes && this.selectedNode.type !== 'confirm';
    },
  },
  created() {
    this.initializeTaskData();
  },
  watch: {
    taskJson() {
      this.initializeTaskData();
    },
    currentTaskName() {
      this.editTaskName = this.currentTaskName;
    },
  },
  methods: {
    initializeTaskData() {
      this.taskDataUI = this.TASK_JSON_2_UI_DATA(this.taskJson);
      this.selectEntryNode();
    },
    // 初始化供页面使用的json数据
    TASK_JSON_2_UI_DATA(json) {
      // debugger;
      let res = [];
      // 场景入口
      if (json.entry) {
        // json.entry.canDrag = false;
        if (!json.entry.id) {
          json.entry.id = 'entry';
          json.entry.title = '场景入口';
          json.entry = Object.assign({}, json.entry);
        }
        res.push(json.entry);
      }
      // 解析组内结点 & 标准结点
      const standardNodes = Array.concat(json.standardNodes || []);
      const groups = json.nodeGroups;
      if (groups && groups.length) {
        groups.forEach((group) => {
          const newGroup = Object.assign({}, group);
          newGroup.nodes = [];
          // groupData.nodes = [];
          // const newGroupNodes = group.nodes;
          for (let i = 0; i < group.nodes.length; i += 1) {
            const nodeId = group.nodes[i];
            const filterNode = standardNodes.filter(node => node.id === nodeId);
            if (filterNode && filterNode[0]) {
              // groupNodes[i] = filterNode[0];
              newGroup.nodes.push(filterNode[0]);
              if (i === 0) {
                standardNodes.splice(standardNodes.indexOf(filterNode[0]), 1, newGroup);
              } else {
                standardNodes.splice(standardNodes.indexOf(filterNode[0]), 1);
              }
            }
          }
        });
      }
      res = Array.concat(res, standardNodes);
      return res;
    },
    // 页面data转换成json数据
    UI_DATA_2_TASK_JSON() {
      const uiData = this.taskDataUI;
      // 组内结点 & 标准结点
      const standardNodes = [];
      const nodeGroups = [];
      // debugger;
      for (let indx = 0; indx < uiData.length; indx += 1) {
        const data = uiData[indx];
        if (data.id === 'entry') {
          console.log('hello');
        } else if (!data.nodes) {
          standardNodes.push(data);
        } else if (data.nodes && data.nodes.length === 1) {
          uiData[indx] = data.nodes[0];
          standardNodes.push(data.nodes[0]);
        } else {
          const groupData = Object.assign({}, data);
          groupData.nodes = [];
          nodeGroups.push(groupData);
          for (let i = 0; i < data.nodes.length; i += 1) {
            standardNodes.push(data.nodes[i]);
            groupData.nodes.push(data.nodes[i].id);
          }
        }
      }
      // 将UI修改update到taskJson数据，保存到数据库
      this.taskJson.standardNodes = standardNodes;
      this.taskJson.nodeGroups = nodeGroups;
    },
    startEditTaskName() {
      this.isEditingName = true;
      this.$nextTick(() => {
        this.$refs.refTaskName.focus();
      });
    },
    cancelEditTaskName() {
      this.isEditingName = false;
    },
    confirmEditTaskName() {
      if (this.editTaskName && this.editTaskName !== this.currentTaskName) {
        // api call
        // console.log('api call edit task name');
        // this.taskDataUI.taskName = this.editTaskName;
      }
      this.isEditingName = false;
    },
    handleSelectNode(data) {
      this.selectedNode = data;
    },
    // 添加问题节点
    handleAddTaskNode(title) {
      const newNode = templates.getTaskNodeTemplate(title);
      newNode.title = title;
      this.taskDataUI.push(newNode);
      // this.addStandardNode(title);
      this.$nextTick(() => {
        this.$refs.nodeTree.selectNodeByIndex(this.taskDataUI.length - 1);
      });
      this.handleUpdateByTree();
    },
    // 将树形图变化update到json数据
    handleUpdateByTree() {
      this.UI_DATA_2_TASK_JSON();
      this.handleUpdate();
    },
    handleUpdate() {
      this.$emit('update');
    },
    // 删除问题节点
    handleDeleteQuestion(data) {
      // 从节点中删除
      const index = this.taskDataUI.indexOf(data);
      if (index !== -1) {
        this.taskDataUI.splice(index, 1);
        this.selectEntryNode();
        this.handleUpdateByTree();
        return;
      }
      // 从节点组中删除
      this.taskDataUI.forEach((item) => {
        if (item.nodes && item.nodes.length && item.nodes.indexOf(data) !== -1) {
          item.nodes.splice(item.nodes.indexOf(data), 1);
        }
        this.selectEntryNode();
      });
      this.handleUpdateByTree();
    },
    selectEntryNode() {
      this.$nextTick(() => {
        this.$refs.nodeTree.selectNodeByIndex(0);
      });
    },
    handleClickGeneralNode(genNode) {
      this.$emit('toSubScenario', genNode);
    },
    handleNavBack() {
      this.$router.go(-1);
    },
  },
};
</script>

<style lang="scss" scoped>
.edit-scenario-wrapper {
  flex: 1;
  display: flex;
  margin-top: 1px;
  overflow: hidden;
  .left-wrapper{
    // position: relative;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    width: 232px;
    height: 100%;
    padding: 20px 0px;
    overflow-y: auto;
    background-color: #FCFCFC;
    border-right: 1px solid #E9E9E9;
    .tree-title{
      margin: 0px 20px;
      line-height: 20px;
      color: #666666;
      font-size: 14px;
    }
    .tree{
      margin: 0px 20px;
    }
    .gap{
      flex: 1;
    }
    .general-nodes-wrapper{
      // position: absolute;
      // bottom: 20px;
      padding: 10px 20px;
      margin-top: 20px;
      box-shadow: 0px -1px 0px 0px rgba(233,233,233,1);
      h1{
        color: #666666;
        font-size: 14px;
      }
      .general-node{
        box-sizing: border-box;
        margin-top: 10px;
        background-color: #E7ECF0;
        width: 190px;
        height: 34px;
        display: flex;
        align-items: center;
        padding: 0px 15px;
        color: #6B8093;
        font-size: 14px;
        border-radius: 2px;
        border: 1px solid #E7ECF0;
        cursor: pointer;
        &:hover{
          border-color: #B1CCFF;
        }
      }
    }
  }
  .right-wrapper{
    flex: 1;
    height: 100%;
    overflow-y: auto;
  }
}
</style>
