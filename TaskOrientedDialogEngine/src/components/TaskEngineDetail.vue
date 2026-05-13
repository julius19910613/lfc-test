<template>
  <div class="task-detail-wrapper">
    <!-- {{lastModified}} -->
    <span class="updating-result" v-if="updatingResult"
    :class="{'red': updatingResult==='场景修改失败'}">
      {{updatingResult}}</span>
    <i class="el-icon-loading" v-show="isUpdating"></i>
    <main-scenario v-if="!currentSubScenario"
    @update="handleSaveTaskDetail" :lastModified="lastModified"
    :taskJson="taskJson" @toSubScenario="handle2SubScenario"></main-scenario>
    <sub-scenario v-else
    :mainScenarioTitle="taskJson.taskName"
    @update="handleSaveTaskDetail"
    :taskJson="currentSubScenario" @back="handleBack2Main"></sub-scenario>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import api from '../js/http/requests';
import MainScenario from './MainScenario';
import SubScenario from './SubScenario';

// const skyworthData = require('../js/skyworth.json');
// const skyworthData = require('../js/mockdata/skyworth-v3.json');
// const emptyData = require('../js/mockdata/empty.json');

export default {
  $api: api,
  components: {
    MainScenario,
    SubScenario,
  },
  data() {
    return {
      taskJson: {},
      currentSubScenario: null,
      isUpdating: false,
      updatingResult: '',
    };
  },
  computed: {
    ...mapGetters([
      'appId',
    ]),
    taskId() {
      return this.$route.params.taskId;
    },
    lastModified() {
      // return '';
      const timestamp = this.$route.params.lastModified;
      if (!timestamp || !Number(timestamp)) {
        return '';
      }
      // debugger;
      const date = new Date(Number(timestamp));
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDay()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    },
  },
  created() {
    // if (this.taskId === 'skyworth-v3') {
    //   this.taskJson = skyworthData;
    //   this.setTaskJson(this.taskJson);
    // } else if (this.taskId === 'empty') {
    //   this.taskJson = emptyData;
    //   this.setTaskJson(this.taskJson);
    // }
    this.getScenarioData();
  },
  methods: {
    ...mapActions([
      'setTaskJson',
    ]),
    getScenarioData() {
      if (!this.taskId) {
        return;
      }
      this.$api.apiGetTaskDetail(this.appId, this.taskId).then((res) => {
        this.taskJson = res;
        this.setTaskJson(this.taskJson);
        if (!this.taskJson.taskName) {
          this.$message({ message: '获取数据失败', type: 'error' });
        }
      }).catch((e) => {
        console.log(e);
      });
    },
    handle2SubScenario(subScenario) {
      this.currentSubScenario = subScenario;
    },
    handleBack2Main() {
      this.currentSubScenario = null;
    },
    handleSaveTaskDetail() {
      if (this.updateTimer) {
        window.clearTimeout(this.updateTimer);
      }
      this.updateTimer = window.setTimeout(() => {
        this.handleUpdateDB();
        this.updateTimer = undefined;
      }, 1500);
    },
    handleUpdateDB() {
      console.log(JSON.stringify(this.taskJson));
      this.isUpdating = true;
      this.updatingResult = '';
      this.setTaskJson(this.taskJson);
      this.$api.apiUpdateTaskDetail(this.appId, this.taskJson).then(() => {
        this.updatingResult = '场景修改成功';
      }).catch(() => {
        this.updatingResult = '场景修改失败';
      }).finally(() => {
        this.isUpdating = false;
        if (this.clearTextTimer) {
          window.clearTimeout(this.clearTextTimer);
        }
        this.clearTextTimer = window.setTimeout(() => {
          this.updatingResult = '';
        }, 3000);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.task-detail-wrapper{
  width: 100%;
  height: 100%;
  position: relative;
  .updating-result{
    position: absolute;
    top: 18px;
    right: 520px;
    &.red{
      color: #F25C62;
    }
  }
  .el-icon-loading{
    position: absolute;
    top: 18px;
    right: 550px;
  }
}
</style>
