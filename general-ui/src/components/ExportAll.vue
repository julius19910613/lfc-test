<template>
  <el-drawer class="history-drawer" :title="title" :visible.sync="value" :show-close="true"
  :before-close="handleClose" size="520px">
    <div class="chat-box-wrapper">
      <div class="export-result">
        <span class="down-btn-group">
          <button :class="{'btn-disabled': exporting[i], 'btn-left': i === 0, 'btn-right': i === 1}"
          :disabled="exporting[i]" v-for="(item, i) in btnText" :key="i"
          @click="handleOperation(item, i)">{{item}}</button>
        </span>
        <div class="result-list">
          <header>{{$t("general.export_all.upload_history")}}
            <i v-if="historyCount">（{{$t("general.export_all.history_count").replace('%d', historyCount)}}）</i>
          </header>
          <div class="row-head">
            <el-row>
              <el-col :span="8"><div class="grid-content bg-purple-dark">{{$t("general.export_all.file_name")}}</div></el-col>
              <el-col :span="5"><div class="grid-content bg-purple-dark">{{$t("general.export_all.upload_time")}}</div></el-col>
              <el-col :span="4"><div class="grid-content bg-purple-dark">{{$t("general.export_all.upload_type")}}</div></el-col>
              <el-col :span="3"><div class="grid-content bg-purple-dark">{{$t("general.export_all.status")}}</div></el-col>
              <el-col :span="4"><div class="grid-content bg-purple-dark">{{$t("general.export_all.action")}}</div></el-col>
            </el-row>
          </div>
          <div class="row-body">
            <el-row v-for="(item, index) in historyList" :key="index">
              <el-col :span="8">
                <div class="grid-content bg-purple-dark grid-content-file-name">
                <el-tooltip :content="item.documentName" placement="top">
                  <span style="display:inline-block;width:100%;">{{ item.documentName }}</span>
                </el-tooltip>
                </div>
              </el-col>
              <el-col :span="5"><div class="grid-content bg-purple-dark">{{ dateString(item.createTime) }}</div></el-col>
              <el-col :span="4"><div class="grid-content bg-purple-dark">{{ item.uploadType }}</div></el-col>
              <el-col :span="3">
                <div class="grid-content bg-purple-dark grid-content-status">
                  <el-tooltip :content="item.statusTooltip" placement="top">
                    <i v-if="item.status" class="el-icon-success"></i>
                    <i v-else class="el-icon-error"></i>
                  </el-tooltip>
                </div>
              </el-col>
              <el-col :span="4">
                <div class="grid-content bg-purple-dark grid-content-operation">
                  <div v-for="(op, index) in item.operations" :key="index">
                    <span class="download-error-report" v-if="op.error"
                    @click="handleDownload(item, op)">{{op.text}}</span>
                    <span class="download-report" v-else
                    @click="handleDownload(item, op)">{{op.text}}</span>
                  </div>
                </div>
            </el-col>
              </el-row>
          </div>
        </div>
      </div>
    </div>
  </el-drawer>
</template>
<script>
// import util from '@/utils/js/format';

export default {
  name: 'export-result',
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    // direction: {
    //   type: String,
    //   default: 'rtl',
    // },
    title: {
      type: String,
      default() {
        return this.$t('general.export_all.title');
      },
    },
    btnText: {
      type: Array,
      default() {
        return [this.$t('general.export_all.export_current')];
      },
    },
    historyList: {
      type: Array,
      default() {
        return [];
      },
    },
    loadingHistory: {
      type: Boolean,
      default: false,
    },
    exporting: {
      type: Array,
      default() {
        return [false, false];
      },
    },
    historyCount: {
      type: Number,
    },
  },
  methods: {
    closeModal() {
      this.handleClose();
    },
    handleClose() {
      this.$emit('input', false);
    },
    dateString(time) {
      if (!time) {
        return '';
      }
      const date = new Date(time);
      return date.toLocaleString() || '';
      // const charTIndex = time.indexOf('T');
      // const charDotIndex = time.indexOf('.');
      // let dateStr = '';
      // let timeStr = '';
      // if (charTIndex !== -1) {
      //   dateStr = time.substring(0, charTIndex);
      // }
      // if (charDotIndex !== -1 && charDotIndex > charTIndex + 1) {
      //   timeStr = time.substring(charTIndex + 1, charDotIndex);
      // }
      // return `${dateStr} ${timeStr}`;
    },
    handleOperation(op, index) {
      this.$emit('operate', op, index);
    },
    handleDownload(item, op) {
      this.$emit('download', item, op);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../assets/styles/variable';
.history-drawer{
  /deep/ .el-drawer {
    direction: ltr !important;
  }
  /deep/ .el-drawer__header{
    font-size: 18px;
    margin-bottom: 20px;
  }
  /deep/ .el-drawer__body{
    height: calc(100% - 80px);
  }
}
// 导出
.export-result{
  display: flex;
  flex: 1;
  flex-direction: column;
  .down-btn-group{
    padding: 0 20px 20px;
    min-height: 64px;
    overflow: hidden;
    @include box-sizing(border-box);
    button{
      @extend .btn-big;
      @extend .btn-dark-blue;
      width: 45%;
      max-width: 220px;
      font-style: normal;
      line-height: 46px;
      font-size: 14px;
      text-align: center;
      border-radius: 2px;
      cursor: pointer;
      &.btn-disabled{
        background: $color-font-disabled;
        color: $color-white;
        border-radius: 2px;
        font-weight: 400;
        border: 1px solid $color-white;
        cursor: not-allowed;
      }
      &.btn-left{
        float: left;
      }
      &.btn-right{
        float: right;
      }
    }
  }
  .result-list{
    flex: 1;
    border-top: 1px solid $color-borderline;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    header{
      padding: 30px 20px 20px;
      font-size: 20px;
      color: #3A4049;
      i{
        font-style: normal;
        font-size: 14px;
        color: #6F7378;
      }
    }
    .el-row{
      border-bottom: 1px solid $color-borderline-disabled;
      display: flex;
      align-items: center;
      .el-col{
        padding: 13px 0 13px 20px;
        @include box-sizing(border-box);
        min-height: 48px;
        line-height: 24px;
        font-size: 12px;
        i{
          font-style: normal;
          color: $app-active-color;
          cursor: pointer;
        }
      }
    }
    .row-head{
      background: $color-disabled;
      .el-row{
        border-bottom: 1px solid $color-borderline-disabled;
      }
    }
    .row-body{
      position: relative;
      overflow-y: auto;
      height: 100%;
    }
    .grid-content-file-name{
      white-space:nowrap;
      text-overflow:ellipsis;
      text-decoration: none;
      overflow: hidden;
      word-break: break-all;
      vertical-align: middle;
    }
    .grid-content-status{
      i{
        margin-top: 3px;
        font-size: 16px;
        &.el-icon-loading{
          color: $color-font-normal;
        }
        &.el-icon-success{
          color: $app-active-color;
        }
        &.el-icon-error{
          color: $error-color;
        }
      }
    }
    .grid-content-operation{
      .download-report{
        cursor: pointer;
        color: #108EE9;
      }
      .download-error-report{
        cursor: pointer;
        color: $error-color;
      }
    }
  }
}
.chat-box-wrapper{
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  .export-result{
    width: 100%;
    height: 100%;
  }
}
</style>
