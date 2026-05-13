<template>
  <div class="task-engine-list-wrapper">
    <div class="no-scenario-wrapper" v-if="tasksList.length === 0">
      <div class="left-part">
        <h1>开始创建您的第一个多轮对话场景吧！</h1>
        <div class="links">
          <span><img src="../assets/images/play.png" class="play-icon"/>教学视频</span>
          <span><img src="../assets/images/upload.png" class="upload-icon"/>上传转换数据</span>
        </div>
        <div class="operations">
          <span class="btn-blue btn-big" @click="showCreateDlg=true">创建场景</span>
          <span class="btn-white-gray btn-big">导入场景</span>
        </div>
      </div>
      <div class="right-part">
        <img src="../assets/images/no_scenario.png">
      </div>
    </div>
    <div class="scenario-list-wrapper" v-else>
      <div class="header">
        <h1>场景列表</h1>
        <el-input class="task-search-input" placeholder="输入文字"
        v-model="searchKeyWord"
        suffix-icon="el-icon-search" size="small"></el-input>
      </div>
      <div class="operations-bar">
        <span class="btn-blue btn-medium" @click="showCreateDlg=true">创建场景</span>
        <span class="btn-white-gray btn-medium" @click="handleImportTask">导入场景</span>
        <span class="btn-white-gray btn-medium"
        @click="handleExportAllTaskJson">导出全部场景</span>
        <input class="file-input" type="file" ref="uploadFileInput"
        accept="application/json" @change="getUploadFile">
      </div>
      <div class="scenario-list-box">
        <div class="scenario-box" v-for="(item, index) in currentTaskList" :key="index">
          <!-- {{item}} -->
          <div class="task-header">
            <h1>{{item.taskName}}</h1>
            <!-- <div class="edit-box">
              <i class="el-icon-edit"></i>
            </div> -->
            <el-switch v-model="item.published" @change="handlePublishTask(item)"></el-switch>
          </div>
          <div class="footer">
            <span class="normal-btn" @click="handleDeleteTask(item.taskId)">删除</span>
            <span class="normal-btn" @click="handleExportTaskJson(item.taskId)">导出</span>
            <span class="emphasize-span btn-big"
            @click="handleEditTask(item.taskId, item.lastModified)">编辑</span>
          </div>
        </div>
      </div>
    </div>
    <el-dialog :visible.sync="showCreateDlg" :show-close="false"
    title="场景创建" class="create-scenario-dialog">
      <div class="dlg-content">
        <div>
          <i class="el-icon-star-on"></i>
          <span>场景名称</span>
          <el-input v-model="newTaskName"></el-input>
        </div>
        <div>
          <span class="template-span">场景模板</span>
          <el-select v-model="newTaskTemplate">
            <el-option v-for="item in templates" :key="item.value"
            :label="item.label" :value="item.value">
          </el-option>
          </el-select>
        </div>
      </div>
      <span slot="footer">
        <button class="btn-white-gray btn-small" @click="clearNewTask">取消</button>
        <button class="btn-dark-blue btn-small" @click="handleCreateScenario">确定创建</button>
      </span>
    </el-dialog>
    <base-loading class="loading-indicator" v-show="isLoading"></base-loading>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import api from '../js/http/requests';
import templates from '../store/templates';
import utils from '../js/common/utils';

export default {
  data() {
    return {
      isLoading: false,
      tasksList: [],
      searchKeyWord: '',
      showCreateDlg: false,
      newTaskName: '',
      newTaskTemplate: '',
      templates: [
        // { value: '模板1', label: '模板1' },
        // { value: '模板2', label: '模板2' },
      ],
      uploadFile: '',
    };
  },
  created() {
    this.$api = api;
    this.getScenarioList();
  },
  computed: {
    ...mapGetters([
      'appId',
    ]),
    currentTaskList() {
      return this.tasksList.filter(item => item.taskName.indexOf(this.searchKeyWord) !== -1);
    },
  },
  beforeRouteEnter(from, to, next) {
    next();
    this.$nextTick(() => {
      this.getScenarioList();
    });
  },
  methods: {
    // 获取场景列表
    getScenarioList() {
      if (!this.appId) {
        return;
      }
      this.isLoading = true;
      this.$api.apiGetTaskList(this.appId).then((list) => {
        this.tasksList = list;
        // this.tasksList.push(
        //   { taskId: 'skyworth', taskName: 'skyworth-v3', published: false },
        //   { taskId: 'empty', taskName: '空场景', published: false },
        // );
        this.isLoading = false;
      });
    },
    validateTaskName() {
      if (this.tasksList.length === 0) {
        return true;
      }
      if (!this.newTaskName) {
        return false;
      }
      const sameNameTasks = this.tasksList.filter(item => item.taskName === this.newTaskName);
      if (sameNameTasks.length > 0) {
        return false;
      }
      return true;
    },
    // 创建新的场景
    handleCreateScenario() {
      if (!this.validateTaskName()) {
        return;
      }
      const scenarioJson = templates.getEmptyScenarioTemplate(this.newTaskName);
      this.updateTaskDetail(scenarioJson);
    },
    updateTaskDetail(scenarioJson) {
      this.$api.apiUpdateTaskDetail(this.appId, scenarioJson).then((res) => {
        if (res.stateCode === 0) {
          this.$message({ message: '场景创建成功', type: 'success' });
          this.getScenarioList();
        } else {
          this.$message({ message: res.stateMessage || '场景创建失败', type: 'warning' });
        }
      }).catch(() => {
        this.$message({ message: '场景创建失败', type: 'error' });
      }).finally(() => {
        this.clearNewTask();
      });
    },
    clearNewTask() {
      this.showCreateDlg = false;
      this.newTaskName = '';
      this.newTaskTemplate = '';
    },
    // 编辑场景
    handleEditTask(id, lastModified) {
      if (!id) {
        return;
      }
      // debugger;
      this.$router.push(`/tde-detail/${id}/${lastModified}`);
    },
    // 删除场景
    handleDeleteTask(id) {
      this.$confirm('确定删除该场景吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.confirmDeleteTask(id);
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除',
        });
      });
    },
    confirmDeleteTask(id) {
      this.$api.apiDeleteTask(this.appId, id).then((res) => {
        if (res.stateCode === 0) {
          this.$message({ message: '场景删除成功', type: 'success' });
          this.getScenarioList();
        } else {
          this.$message({ message: res.stateMessage || '场景删除失败', type: 'warning' });
        }
      }).catch(() => {
        this.$message({ message: '场景删除失败', type: 'error' });
      });
    },
    // 导出全部场景
    handleExportAllTaskJson() {
      this.tasksList.forEach((task) => {
        this.handleExportTaskJson(task.taskId);
      });
    },
    // 导出场景
    handleExportTaskJson(taskId) {
      if (!taskId) {
        return;
      }
      this.$api.apiGetTaskDetail(this.appId, taskId).then((res) => {
        const exportJson = res;
        if (exportJson.taskId && exportJson.taskName) {
          utils.exportJsonFile(exportJson, exportJson.taskName);
        } else {
          this.$message({ message: '场景有问题无法导出', type: 'error' });
        }
      }).catch(() => {
        this.$message({ message: '获取场景失败', type: 'error' });
      });
    },
    // 导入场景
    handleImportTask() {
      this.$refs.uploadFileInput.click();
    },
    // 获取上传的文件内容
    getUploadFile(e) {
      const { target: { files: [arr] } } = e;
      if (arr) {
        this.uploadFile = arr;
        this.submitFile(this.uploadFile);
      }
    },
    // 根据上传Excel的内容，批量导入意图
    submitFile(file) {
      if (file) {
        if (!/(?:.json)$/.test(file.name)) {
          // 返回错误提示信息
          this.$message({ message: '只能上传JSON格式文件', type: 'error' });
          return;
        }
        const reader = new FileReader();
        reader.readAsText(file, 'UTF-8');
        reader.onload = (event) => {
          const fileString = event.currentTarget.result;
          if (fileString) {
            try {
              const fileJson = JSON.parse(fileString);
              this.updateTaskDetail(fileJson);
            } catch (error) {
              this.$message({ message: '文件不是合格的JSON格式', type: 'error' });
            }
          } else {
            // 返回错误提示信息
            this.$message({ message: '读取文件失败', type: 'error' });
          }
        };
      }
    },
    handlePublishTask(task) {
      this.$api.apiUpdateTaskInfo(this.appId, task.taskId,
        task.taskName, task.published).then((res) => {
        if (res.stateCode === 0) {
          this.$message({ message: '修改场景成功', type: 'success' });
        } else {
          this.$message({ message: res.stateMessage, type: 'error' });
        }
      }).catch(() => {
        this.$message({ message: '修改场景修改', type: 'error' });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../assets/scss/index";
.task-engine-list-wrapper{
  width: 100%;
  height: 100%;
  overflow-y: auto;
  .loading-indicator{
    background: rgba(255, 255, 255, 0.5) !important;
  }
  .no-scenario-wrapper{
    width: 100%;
    height: 100%;
    display: flex;
    min-width: 1100px;
    min-height: 590px;
    .left-part{
      flex: 8;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      font-family:PingFangHK-Regular;
      font-weight: 400;
      h1{
        margin: 0px 80px;
        font-size: 38px;
        color: #333333;
        line-height:54px;
        letter-spacing:1px;
      }
      .links{
        margin: 20px 80px 40px 80px;
        cursor: pointer;
        span{
          font-size: 16px;
          color: #1875F0;
          line-height: 12px;
          margin-right: 40px;
        }
        .play-icon{
          width: 11px;
          height: 14px;
          margin-right: 10px;
          vertical-align: middle;
        }
        .upload-icon{
          width: 15px;
          height: 13px;
          margin-right: 10px;
          vertical-align: middle;
        }
      }
      .operations{
        margin: 0px 0px 0px 80px;
        cursor: pointer;
        span{
          margin-right: 20px;
          display: inline-block;
          vertical-align: middle;
          width: 140px;
        }
      }
    }
    .right-part{
      flex: 10;
      display: flex;
      align-items: center;
      img {
        width: 100%;
      }
    }
  }
  .scenario-list-wrapper{
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding: 25px 0px;
    .task-search-input{
      font-size: 14px;
      height: 32px;
      line-height: 32px;
    }
    .header{
      display: flex;
      // margin-bottom: 20px;
      margin: 0px 20px 20px 20px;
      h1{
        font-size:18px;
        color: #333333;
        line-height: 32px;
        flex: 1;
      }
      .el-input{
        width: 220px;
        height: 32px;
        /deep/ input{
          height: 32px;
        }
      }
    }
    .operations-bar{
      margin: 0px 20px;
      .btn-medium{
        display: inline-block;
        cursor: pointer;
        margin-right: 20px;
        height: 32px;
        line-height: 32px;
        padding: 0 25px;
      }
      .file-input{
        display: none;
      }
      .links{
        float: right;
        span{
          cursor: pointer;
          font-size: 14px;
          color: #1875F0;
          line-height: 14px;
          margin-left: 40px;
        }
        .play-icon{
          width: 11px;
          height: 14px;
          margin-right: 10px;
          vertical-align: middle;
        }
        .upload-icon{
          width: 15px;
          height: 13px;
          margin-right: 10px;
          vertical-align: middle;
        }
      }
    }
    .scenario-list-box{
      width: 100%;
      box-sizing: border-box;
      margin-top: 20px;
      padding: 0px 0px 20px 20px;
      height: calc(100% - 60px);
      overflow: auto;
      .scenario-box{
        float: left;
        margin: 0px 20px 20px 0px;
        width: calc(33% - 13px);
        height:164px;
        border-radius:2px;
        border: 1px solid rgba(233,233,233,1);
        padding: 30px;
        box-sizing: border-box;
        &:nth-child(3n) {
          margin: 0px 0px 20px 0px;
        }
        &:hover{
          box-shadow: 0px 5px 10px 0px rgba(0,0,0,0.15);
          .task-header{
            .edit-box{
              display: inline-block;
            }
          }
          .footer{
            .emphasize-span{
              @extend .btn-blue;
            }
          }
        }
        .task-header{
          display: flex;
          align-items: center;
          h1{
            flex: 1;
            // width: 100%;
            font-size: 16px;
            color: #333333;
            line-height:26px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
          .edit-box{
            display: none;
            width: 24px;
            height: 24px;
            border-radius: 100%;
            background:rgba(238,238,238,1);
            text-align: center;
            margin: 0px 20px 0px 16px;
            cursor: pointer;
            i{
              font-size: 16px;
              line-height: 24px;
              color: #6F7378;
            }
          }
          .el-switch{
            margin-top: 3px;
          }
        }
        .footer{
          display: flex;
          justify-content: flex-end;
          margin-top: 40px;
          span{
            display: inline-block;
            height: 38px;
            line-height: 38px;
            box-sizing: border-box;
          }
          .normal-btn{
            width: 35px;
            margin-right: 30px;
            font-size:14px;
            color: #666666;
            cursor: pointer;
          }
          .emphasize-span{
            width: 100px;
            @extend .btn-white-gray;
          }
        }
      }
    }
  }
  .create-scenario-dialog{
    /deep/ .el-dialog{
      width: 650px;
    }
    /deep/ .el-dialog__header{
      box-shadow: 0px 1px 0px 0px rgba(233,233,233,1);
    }
    /deep/ .el-dialog__body{
      padding: 0px !important;
      box-shadow: 0px 1px 0px 0px rgba(233,233,233,1);
    }
    .dlg-content{
      padding: 50px 20px;
      >div{
        &:first-child{
          margin-bottom: 30px;
        }
        display: flex;
        >i{
          width: 12px;
          line-height: 32px;
          font-size: 12px;
          color: #F25C62;
          vertical-align: top;
        }
        span{
          margin-left: 10px;
          width: 56px;
          height: 32px;
          line-height: 32px;
          margin-right: 20px;
        }
        /deep/ .el-input{
          flex: 1;
          height: 32px;
          line-height: 32px;
          input{
            height: 32px;
            line-height: 32px;
          }
        }
        /deep/ .el-select{
          flex: 1;
          height: 32px;
          line-height: 32px;
        }
        .template-span{
          margin-left: 21px;
        }
      }
    }
  }
}
</style>
