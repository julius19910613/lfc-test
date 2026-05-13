<template>
  <div class="sub-scenario-wrapper">
    <div class="header-wrapper">
      <div class="title-box">
        <div v-if="!isEditingName">
          <span class="title">{{mainScenarioTitle}} - {{taskJson.title}}</span>
          <img class="edit-btn" src="../assets/images/edit_btn.png" @click="startEditTaskName"/>
        </div>
        <el-input v-else v-model="editTaskName" class="task-name-input" autofocus size="mini"
        ref="refTaskName"
        @blur="cancelEditTaskName" @keyup.enter.native="confirmEditTaskName"></el-input>
      </div>
      <label class="label label-exit">返回主场景</label>
      <img class="exit-btn" @click="handleBack2MainPage" src="../assets/images/exit_btn.png"/>
    </div>
    <div class='content-wrapper'>
      <edit-scenario :taskJson="taskJson" :isChildScenario="true"
      @update="handleUpdate"></edit-scenario>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import EditScenario from './EditScenario';
import api from '../js/http/requests';

export default {
  props: {
    taskJson: {
      type: Object,
      default() {
        return {};
      },
    },
    mainScenarioTitle: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      // 修改任务名字
      isEditingName: false,
      selectedNode: {},
    };
  },
  components: {
    EditScenario,
  },
  computed: {
    ...mapGetters([
      'appId',
    ]),
    taskId() {
      return this.$route.params.taskId;
    },
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
  created() {
    this.$api = api;
  },
  methods: {
    handleUpdate() {
      this.$emit('update');
    },
    handleBack2MainPage() {
      this.$emit('back');
    },
    startEditTaskName() {
      this.editTaskName = this.taskJson.title;
      this.$nextTick(() => {
        this.$refs.refTaskName.focus();
      });
    },
    cancelEditTaskName() {
      this.isEditingName = false;
    },
    confirmEditTaskName() {
      if (this.editTaskName && this.editTaskName !== this.taskJson.title) {
        this.taskJson.title = this.editTaskName;
      }
      this.isEditingName = false;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../assets/scss/index";
.sub-scenario-wrapper{
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
</style>
