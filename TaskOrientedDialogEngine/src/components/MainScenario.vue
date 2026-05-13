<template>
  <div class="main-scenario-wrapper">
    <div class="header-wrapper">
      <div class="title-box">
        <div v-if="!isEditingName">
          <span class="title">{{taskJson.taskName}}</span>
          <img class="edit-btn" src="../assets/images/edit_btn.png" @click="startEditTaskName"/>
        </div>
        <el-input v-else v-model="editTaskName" class="task-name-input" autofocus size="mini"
        ref="refTaskName"
        @blur="cancelEditTaskName" @keyup.enter.native="confirmEditTaskName"></el-input>
      </div>
      <label class="label">开关</label>
      <el-switch v-model="taskJson.published" @change="handleUpdate"></el-switch>
      <label class="label">导出</label>
      <img class="export-btn" @click="handleExportTaskJson" src="../assets/images/export_btn.png"/>
      <label class="label">更多</label>
      <el-dropdown @command="handleChooseMore">
        <img class="more-btn" src="../assets/images/more_btn.png"/>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="taskInfo">场景信息</el-dropdown-item>
          <el-dropdown-item command="editVariable">变量声明</el-dropdown-item>
          <el-dropdown-item command="editActions">动作设置</el-dropdown-item>
          <el-dropdown-item command="editScenarioParsers">场景解析器</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <label class="label label-exit">退出</label>
      <img class="exit-btn" @click="handleNavBack" src="../assets/images/exit_btn.png"/>
    </div>
    <div class='content-wrapper'>
      <edit-scenario ref="refEditScenario" @update="handleUpdate"
      :taskJson="taskJson" @toSubScenario="handleToSubScenario"></edit-scenario>
    </div>
    <el-dialog :visible.sync="openTaskInfoDlg" title="场景信息"
    class="task-info-dlg" :show-close="false">
      <div class="line">
        <label>场景版本</label>
        <span>{{ this.taskJson.version }}</span>
      </div>
      <div class="line">
        <label>场景ID</label>
        <span>{{ this.taskJson.taskId }}</span>
      </div>
      <div class="line">
        <label>场景名称</label>
        <span>{{ this.taskJson.taskName }}</span>
      </div>
      <div class="line">
        <label>最后修改时间</label>
        <span>{{this.lastModified}}</span>
      </div>
      <div slot="footer">
        <button class="btn-dark-blue btn-small" @click="openTaskInfoDlg=false">关闭</button>
      </div>
    </el-dialog>
    <edit-variables v-model="openVariableEditor" :variables="taskJson.vars"
    @update="handleUpdateVariables"></edit-variables>
    <edit-actions v-model="openActionEditor" :actions="taskJson.actions"
    @update="handleUpdateActions"></edit-actions>
    <edit-scenario-parser v-model="openScenarioParser"
    @save="handleSaveScenarioParserList"
    :scenarioParserList="taskJson.taskFinders"></edit-scenario-parser>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import EditScenario from './EditScenario';
import EditVariables from './EditVariables';
import EditActions from './EditActions';
import EditScenarioParser from './EditScenarioParser';
import utils from '../js/common/utils';

export default {
  props: {
    taskJson: {
      type: Object,
      default() {
        return {};
      },
    },
    lastModified: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      // 修改任务名字
      editTaskName: '',
      isEditingName: false,
      // .
      selectedNode: {},
      openVariableEditor: false,
      openActionEditor: false,
      openScenarioParser: false,
      openTaskInfoDlg: false,
    };
  },
  components: {
    EditScenario,
    EditVariables,
    EditActions,
    EditScenarioParser,
  },
  computed: {
    ...mapGetters([
      'appId',
    ]),
    showEditEntry() {
      return this.selectedNode && this.selectedNode.id === 'entry';
    },
    showEditGroup() {
      return this.selectedNode && this.selectedNode.nodes;
    },
    showEditQuestion() {
      return this.selectedNode && !this.showEditGroup && !this.showEditTrigger;
    },
  },
  methods: {
    handleToSubScenario(genNode) {
      this.$emit('toSubScenario', genNode);
    },
    // 编辑场景名字
    startEditTaskName() {
      this.isEditingName = true;
      this.editTaskName = this.taskJson.taskName;
      this.$nextTick(() => {
        this.$refs.refTaskName.focus();
      });
    },
    cancelEditTaskName() {
      this.isEditingName = false;
    },
    confirmEditTaskName() {
      this.isEditingName = false;
      if (this.editTaskName && this.editTaskName !== this.taskJson.taskName) {
        this.taskJson.taskName = this.editTaskName;
      }
      this.$emit('update');
    },
    handleChooseMore(command) {
      if (command === 'editVariable') {
        this.openVariableEditor = true;
      } else if (command === 'editActions') {
        this.openActionEditor = true;
      } else if (command === 'taskInfo') {
        this.openTaskInfoDlg = true;
      } else if (command === 'editScenarioParsers') {
        this.openScenarioParser = true;
      }
    },
    handleUpdateVariables(variables) {
      this.taskJson.vars = variables;
      this.handleUpdate();
    },
    handleUpdateActions(actions) {
      this.taskJson.actions = actions;
      this.handleUpdate();
    },
    handleUpdate() {
      this.$emit('update');
    },
    handleNavBack() {
      this.$router.go(-1);
    },
    handleExportTaskJson() {
      utils.exportJsonFile(this.taskJson, this.taskJson.taskName);
    },
    handleSaveScenarioParserList(newParserList) {
      this.taskJson.taskFinders = newParserList;
      this.handleUpdate();
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../assets/scss/index";
.main-scenario-wrapper{
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .header-wrapper{
    display: flex;
    padding: 0px 20px;
    align-items: center;
    height: 50px;
    min-height: 50px;
    box-shadow: 0px 1px 0px 0px rgba(233,233,233,1);
    .title-box{
      flex: 1;
      height: 24px;
      .title{
        vertical-align: top;
        font-size: 16px;
        color: #333333;
        flex: 1;
        line-height: 24px;
      }
      .edit-btn{
        width: 24px;
        height: 24px;
        margin-left: 10px;
        cursor: pointer;
      }
      .task-name-input{
        width: 300px;
        height: 28px;
        /deep/ input{
          font-size: 14px;
        }
      }
    }
    .label{
      margin-right: 10px;
      margin-left: 30px;
      color: #666666;
      font-size: 14px;
    }
    .label-exit{
      margin-left: 20px;
    }
    .export-btn{
      width: 64px;
      height: 28px;
      cursor: pointer;
    }
    .more-btn{
      width: 28px;
      height: 28px;
      padding-right: 20px;
      cursor: pointer;
      box-shadow: 1px 0px 0px 0px #E9E9E9;
    }
    .exit-btn{
      width: 64px;
      height: 28px;
      cursor: pointer;
    }
  }
  .content-wrapper{
    flex: 1;
    display: flex;
    margin-top: 1px;
    overflow: hidden;
  }
}
.task-info-dlg{
  /deep/ .el-dialog{
    width: 500px;
  }
  .line{
    display: flex;
    margin-top: 20px;
    &:first-child{
      margin-top: 30px;
    }
    &:last-child{
      margin-bottom: 30px;
    }
    label{
      flex: 1;
      text-align: right;
      color: #666666;
      margin-right: 20px;
    }
    span{
      flex: 2;
      color: #311717;
    }
  }
}
</style>
