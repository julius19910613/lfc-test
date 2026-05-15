<template>
  <div id='material-manage'>
   <!-- <emoti-icon
    style='margin-top:40px;'
    name='icon-setting'
    :size='42'
    clickable
    hover
    popMode='light'
    popContent='edit'
    popPlacement='left'
    popClass='pop-class'
    hoverColor='red'
    normalColor='blue'
    @click='onIconClick'
    ></emoti-icon>
    111
    <div class="el-icon-setting"></div>
    222 -->
    <!-- <div>
      <i class="emoti-icon icon-setting" style='font-size:44px;color:yellowgreen'></i>
      <span class="emoti-icon icon-setting" style='font-size:66px;color:#FDA028'></span>
    </div>
    <div style="display:flex;margin-top:20px" class="test">
      <el-input
        placeholder="icon"
        prefix-icon="el-icon-setting"></el-input>
      <el-input
        placeholder="emoti-icon"
        prefix-icon="emoti-icon icon-setting"></el-input>
    </div>
    <emoti-icon
    style='margin-top:40px;'
    name='icon-setting'
    :size='42'
    clickable
    hover
    popMode='light'
    popContent='edit'
    popPlacement='left'
    popClass='pop-class'
    hoverColor='red'
    normalColor='blue'
    ></emoti-icon>
    <emoti-icon
    style='margin-top:40px;'
    name='icon-setting'
    :size='42'
    clickable
    hover
    gradient
    popMode='light'
    popContent='edit'
    popPlacement='top'
    popClass='pop-class'
    hoverColor='red'
    normalColor='blue'
    >
    </emoti-icon>
    <emoti-icon
    style='margin-top:40px;'
    name='color-query'
    :size='66'
    clickable
    hover
    popContent='add'
    popMode='dark'
    popPlacement='right'
    popClass='pop-class'
    ></emoti-icon> -->
      <div class="empty_content">
        <div class="empty_words">
            <div class="word_content" :style="{marginTop: !isDataSyncOk||isDataChanged?'33%':'50%'}">
              <div class="h4" >{{ titleMsg }}</div>
              <div class="h3" v-if='!!subtileMsg'>{{ subtileMsg }}</div>
              <div class="action-btn-wrap" v-if='!isDataSyncOk||isDataChanged'>
                <el-button
                  @click.stop="$router.push('/data-manage')"
                  v-if ='isEmptyData'
                  class="action-btn"
                >{{ $t('knowledge_graph.test_report.goto_data_manage_btn') }}</el-button>
                <div class="operations" v-if='!isEmptyData'>
                  <text-button
                    button-type="primary"
                    class="btn2"
                    @click.stop="onStartTraining">{{ $t('knowledge_graph.test_report.publish') }}</text-button>
                  <text-button
                    v-if='isShowRollbackBtn'
                    button-type="default"
                    class="btn2 right-btn"
                    @click.stop="rollbackSandBoxSettings">{{ $t('knowledge_graph.audit_manage.rollback') }}</text-button>
                </div>
              </div>
            </div>
          </div>
          <div class="empty_pic">
            <img class="background" src="../../../static/images/kg_no_data.png">
          </div>
      </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import api from './_api/knowledgeGraph';

export default {
  privCode: 'kg_audit_manage',
  api,
  data() {
    return {
      titleMsg: '', // 主信息
      loopRequestTimer: null, // 轮询获取状态接口
      statusData: {}, // 数据状态
      isEmptyData: false, // 是否没有实体数据
      isInitLoadOk: false, // 初始化ok
      isProcessing: false, // 是否处于 同步/训练中...
      isDataChanged: false, // 数据是否改变
      isDataSyncOk: false, // 数据是否 训练/同步 完成
      isDataSyncError: false, // 数据是否 训练/同步 失败
      isDataRollbackError: false, // 数据是否 回滚 失败
      hasLastSyncSuccess: false, // 曾经是否成功同步过 用来判断是否回滚
      loopCount: 0, // 轮询请求次数记录
      loopTime: 5 * 1000, // 5s 轮询一次
      STEP: { // 步骤常量
        INIT: 0,
        PROCESSING: 1,
        DONE: 2,
        ERROR: -1,
      },
      subtileMsg: '', // 副标题
      ACTION_TYPE: { // 源头操作类型 同步操作/训练操作
        SYNC: 'sync',
        TRAIN: 'train',
      },
      isShowRollbackBtn: false, // 是否显示回滚按钮
      syncErrorCount: 0, // 同步错误次数  超过次数则报错，并不再同步了
      MAX_SYNC_ERROR_COUNT: 2, // 最大可错误同步次数
    };
  },

  computed: {
    ...mapGetters([
      'robotID',
      'lastActionType',
    ]),
    canEdit() {
      return this.$hasRight('edit');
    },
    canDelete() {
      return this.$hasRight('delete');
    },
    canImport() {
      return this.$hasRight('import');
    },
  },

  methods: {
    ...mapMutations([
      'setLastActionType',
    ]),
    onIconClick(e) {
      console.log('onIconClick', e);
      // this.$router.push('');
    },
    // 触发同步操作
    triggerOperation() {
      this.$emit('startLoading', this.$t('knowledge_graph.audit_manage.is_training'));
      this.setLastActionType(this.ACTION_TYPE.SYNC);
      this.$api.syncSandBoxSettings(this.robotID)
        .then(() => this.$api.syncDataAfterTest(this.robotID))
        .then(() => new Promise((resolve) => {
          setTimeout(() => { resolve(); }, 5000); // 瞎估估延时5s，等待后台程序处理 风险存在点...
        })).then(() => {
          this.getDataStatus();
        });
    },
    // 回滚操作
    rollbackSandBoxSettings() {
      this.$emit('startLoading', this.$t('knowledge_graph.audit_manage.is_rollback'));
      this.$api.withdrawSandBoxSettings(this.robotID)
      .then(() => new Promise((resolve) => {
        setTimeout(() => { resolve(); }, 5000); // 瞎估估延时5s，等待后台程序处理 风险存在点...
      }))
      .then(() => this.getDataStatus());
    },

    // 同步沙箱数据
    onStartTraining() {
      this.$emit('startLoading', this.$t('knowledge_graph.audit_manage.is_training'));
      this.setLastActionType(this.ACTION_TYPE.TRAIN);
      this.$api.triggerTraining(this.robotID)
          .then((data) => {
            if (data.data.status === 'success') {
              this.getDataStatus(true);
            } else {
              this.$message({
                message: this.$t('knowledge_graph.audit_manage.trigger_training_error'),
                type: 'error',
              });
            }
          })
          .catch((err) => {
            console.log('triggerTraining', err.response);
            // 约等于 训练成功 直接触发sync
            if (err.response.data.message === 'no_available_corpus') {
              this.triggerOperation();
            }
          });
    },

    // 检查沙箱数据是否有改动
    checkSandBoxStatus() {
      return new Promise((resolve) => {
        this.$api.getSandBoxStatus(this.robotID).then((res) => {
          this.handleCheckSandboxResult(res.data || {});
          this.removeLoopTimer();
        }).finally(() => resolve());
      });
    },
   // 清除轮询操作
    removeLoopTimer() {
      if (this.loopRequestTimer) {
        clearTimeout(this.loopRequestTimer);
        this.loopRequestTimer = null;
      }
    },
    // 处理沙箱状态结果
    handleCheckSandboxResult(data) {
      if (data.hasModify === '1') {
        this.titleMsg = this.$t('knowledge_graph.audit_manage.info_modified');
        this.subtileMsg = this.$t('knowledge_graph.audit_manage.need_publish');
        this.isDataChanged = true;
      } else {
        this.titleMsg = this.$t('knowledge_graph.audit_manage.info_unmodified');
        this.subtileMsg = this.$t('knowledge_graph.audit_manage.do_nothing');
        this.isDataChanged = false;
      }
    },
    // 轮询获取状态
    loopRequest(sync) {
      this.$emit('startLoading', this.$t('knowledge_graph.audit_manage.is_training'));
        // 进行状态，开始轮询方式获取最新状态
      this.loopRequestTimer = setTimeout(() => {
        console.log(`数据训练/同步进行状态，第${this.loopCount}次获取数据状态，间隔:${this.loopTime}毫秒`);
        if (!this) {
          console.error('instance had destoryed');
          return;
        }
        this.loopCount += 1;
        this.getDataStatus(sync);
      }, this.loopTime);
    },
     /**
     *  "trainingStatus": 2,
     *  "syncStatus": 2,
     *  "revertStatus": 0,
     *  "lastSuccessSync": 1
     */
    getDataStatus(sync = false) {
      this.removeLoopTimer();
      this.isShowRollbackBtn = false;
      this.$api.getKGDataStatus(this.robotID).then((res) => {
        console.log('getKGDataStatus:res ', JSON.stringify(res, null, 2));
        this.statusData = res.data;
        const isProcess = this.statusData.trainingStatus === this.STEP.PROCESSING
          || this.statusData.syncStatus === this.STEP.PROCESSING;
        this.isDataSyncOk = this.statusData.syncStatus === this.STEP.DONE;
        const LAST_SUCCESS_SYNC = 1;
        this.hasLastSyncSuccess = this.statusData.lastSuccessSync === LAST_SUCCESS_SYNC;
        if (isProcess) {
          this.titleMsg = this.$t('knowledge_graph.audit_manage.is_training');
          this.subtileMsg = this.$t('knowledge_graph.audit_manage.plz_waiting');
        }
        const isRollbackProcess = this.statusData.revertStatus === this.STEP.PROCESSING;
        if (isRollbackProcess) {
          this.titleMsg = this.$t('knowledge_graph.audit_manage.is_rollback');
          this.subtileMsg = this.$t('knowledge_graph.audit_manage.plz_waiting');
        }
        /**
         * STEP   训练  同步  操作              回滚
         * 00-1    -1    -1    [SandBoxStatus]+tips -1/0/1/2
         * 00-2     0    -1    [SandBoxStatus] -1/0/1/2
         * 00-3     1    -1    loop->00-4     -1/0/1/2
         * 00-4     2    -1    sync->06      -1/0/1/2
         * 00      -1   0    [SBS]
         * 01      0    0    [SandBoxStatus] or [train -->02]    012
         * 02      1    0    loop --> 03      02
         * 03      2    0    sync --> 06      02 （跳出  /跳入后产生...）
         * 031     -1   1    [SBS]
         * 04      0    1    loop -> 07  （x）     02
         * 05      1    1    （x）                02
         * 06      2    1    loop -> 09 -->SBS    02
         * 061     -1   2    [SBS]
         * 07      0    2    [SBS] or [train --> 08]    012
         * 08      1    2    loop -> 09 -->sync   02
         * 09      2    2    SBS               012
         * 注： 不处理的error 始终会出现
         */
        const ts = this.statusData.trainingStatus;
        const ss = this.statusData.syncStatus;
        // const s0 = ss === this.STEP.ERROR || ts === this.STEP.ERROR;
        const s01 = ss === this.STEP.ERROR && ts === this.STEP.ERROR;
        const s02 = ss === this.STEP.ERROR && ts === this.STEP.INIT;
        const s03 = ss === this.STEP.ERROR && ts === this.STEP.PROCESSING;
        const s04 = ss === this.STEP.ERROR && ts === this.STEP.DONE;
        const s0 = ss === this.STEP.INIT && ts === this.STEP.ERROR;
        const s1 = ss === this.STEP.INIT && ts === this.STEP.INIT;
        const s2 = ss === this.STEP.INIT && ts === this.STEP.PROCESSING;
        const s3 = ss === this.STEP.INIT && ts === this.STEP.DONE;
        const s31 = ss === this.STEP.PROCESSING && ts === this.STEP.ERROR;
        const s4 = ss === this.STEP.PROCESSING && ts === this.STEP.INIT;
        const s5 = ss === this.STEP.PROCESSING && ts === this.STEP.PROCESSING;
        const s6 = ss === this.STEP.PROCESSING && ts === this.STEP.DONE;
        const s61 = ss === this.STEP.DONE && ts === this.STEP.ERROR;
        const s7 = ss === this.STEP.DONE && ts === this.STEP.INIT;
        const s8 = ss === this.STEP.DONE && ts === this.STEP.PROCESSING;
        const s9 = ss === this.STEP.DONE && ts === this.STEP.DONE;
        if (s01 || s02 || s03 || s04 || s1 || s2 || s3 || s7 || s8 || s0 || s31 || s61) {
          this.setLastActionType(this.ACTION_TYPE.TRAIN);
        } else if (s6) {
          this.setLastActionType(this.ACTION_TYPE.SYNC);
        }
        if (ts === this.STEP.ERROR) {
          this.$message({
            message: 'Training Error!',
          });
        }
        if (!s04) { // 非 s04 状态下重置错误同步次数
          this.syncErrorCount = 1;
        }
        if (s01 || s02 || s1 || s7 || s0 || s31 || s61) {
          this.isShowRollbackBtn = this.hasLastSyncSuccess;
          this.checkSandBoxStatus().then(() => {
            this.$emit('endLoading');
          });
        } else if (s03 || s2 || s4 || s5 || s6 || s8) {
          this.loopRequest(sync);
        } else if (s3) {
          this.triggerOperation(sync);
        } else if (s04) {
          if (this.syncErrorCount < this.MAX_SYNC_ERROR_COUNT) {
            this.triggerOperation(sync);
            this.syncErrorCount += 1;
          } else {
            this.$message({
              message: 'Sync Error!',
              type: 'error',
            });
          }
        } else if (s9) {
          // 需要判断前一步骤
          if (this.lastActionType === this.ACTION_TYPE.TRAIN) {
            this.triggerOperation(sync);
          } else if (!this.lastActionType || this.lastActionType === this.ACTION_TYPE.SYNC) {
            this.isShowRollbackBtn = this.hasLastSyncSuccess;
            this.checkSandBoxStatus().then(() => {
              this.$emit('endLoading');
            });
          }
        } else {
          this.removeLoopTimer();
        }
      })
      .catch((err) => {
        this.removeLoopTimer();
        console.log('getDataStatus:err', err);
      });
    },
  },
  beforeMount() {
    this.$emit('startLoading');
    this.$api.checkKGDataChangeReview(this.robotID)
      .then((res) => {
        console.log('checkKGDataChangeReview:res', res, res.data.result);
        if (res) {
          this.isEmptyData = !res.data.result;
          if (!this.isEmptyData) {
            this.getDataStatus(false);
          } else {
            this.$emit('endLoading');
            this.titleMsg = this.$t('knowledge_graph.audit_manage.no_kg_data_exist');
            this.subtileMsg = this.$t('knowledge_graph.audit_manage.info_initial');
          }
        }
      }).catch((err) => {
        console.log('getSandBoxStatus:err', err);
        this.$emit('endLoading');
      });
  },
  beforeDestroy() {
    this.removeLoopTimer();
  },
};
</script>

<style lang="scss" scoped>
  @import '../../assets/styles/variable';
  #material-manage {
    height: 100%;
    font-family:PingFangSC-Regular;
    .empty_content {
      height: 95%;
      flex: 1;
      margin: 20px 0px;
      // background: #ffffff;
      display: flex;
      flex-direction: row;
      align-items: stretch;
      .empty_words {
        width: 35%;
        flex: 1;
        display: flex;
        flex-direction: row;
        background: #ffffff;
        .word_content {
          display: flex;
          flex-direction: column;
          margin-left: 15%;
          margin-top: 33%;
          .action-btn-wrap {
            margin-top: 40px;
            .operations {
              display: flex;
              justify-content: flex-start;
              align-items: center;
            }
            .action-btn {
              width:140px;
              height:46px;
              border-radius:4px;
              border:1px solid rgba(255,255,255,0);
              background:rgba(61,75,99,1);
              color: white;
            }
            .btn1 {
              width:145px;
              height:46px;
              border-radius:2px;
              background:rgba(247,247,247,1);
              border:1px solid rgba(233,233,233,1);
              color: #333333;
              font-size: 14px;
              &::before {
                content: '';
                margin-right: 5px;
                width:8px;
                height:8px;
                background:rgba(33,198,149,1);
                border-radius: 50%;
              }
            }
            .btn2{
              width:140px;
              height:46px;
              background:rgba(61,75,99,1);
              border-radius:4px;
              border:1px solid rgba(255,255,255,0);
              color: white;
              font-size: 14px;
            }
            .right-btn {
              margin-left: 20px;
            }
          }
          .template_download {
            margin-top: 10px;
            display: flex;
            flex-direction: row;
            align-items: center;
            cursor: pointer;
            img {
              height: 13px;
              width: 13px;
            }
          }

          .h4 {
            font-size: 38px;
            font-family: PingFangHK-Regular;
            font-weight: 400;
            color: rgba(51, 51, 51, 1);
            line-height: 54px;
            letter-spacing: 1px;
          }

          .h3 {
            width: 340px;
            word-wrap:break-word;
            margin-top: 6px;
            font-size: 20px;
            font-family: PingFangSC-Regular;
            font-weight: 400;
            color: rgba(102, 102, 102, 1);
            line-height: 30px;
          }

          h2 {
            margin-top: 20px;
            margin-bottom: 40px;
            font-size: 16px;
            font-family: PingFangHK-Regular;
            font-weight: 400;
            color: rgba(24, 117, 240, 1);
            line-height: 24px;
          }

          h1 {
            padding: 0px 3px;
            font-size: 14px;
            font-family: PingFangSC-Regular;
            font-weight: 400;
            color: rgba(24, 117, 240, 1);
            line-height: 20px;
          }
        }
      }
    }
    .empty_pic {
      background: #ffffff;
      width: 70%;
      display: flex;
      justify-content: flex-end;
      align-items: flex-end;
      flex: 1;
      .background {
        height: 80%;
        width: 100%;
      }
    }
  }
  .test{
    ::v-deep .el-input {
      width: 200px;
    }
  }
</style>
