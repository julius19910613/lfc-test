<template>
  <div class="dialog_wrap"  v-if="isShow">
    <el-dialog
      custom-class="common-dialog"
      width="40vw"
      :title="params.title || '提示'"
      :visible.sync="isShow"
      :close-on-click-modal="false"
      :show-close="false"
    >
      <div class="dialog-content_wrap">
          <div class="icon_wrap">
            <i class="el-icon-warning warn-icon"></i>
          </div>
          <div class="tip-text_wrap">
            <div class="main">{{params.mainTitle || 'please input the mainTitle param!'}}</div>
            <div class="sub" v-if="!!params.subTitle">{{params.subTitle}}</div>
          </div>
      </div>
      <div slot="footer" class="dialog-footer">
       <el-button @click="onBtnClick('cancel')" class="btn-normal">{{params.cancelText || '取消'}}</el-button>
       <el-button @click="onBtnClick('confirm')" class="btn-dark-blue btn-normal"
          >{{params.confirmText || '确认'}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
/**
 * 删除提示弹窗
 */
export default {
  name: 'DeleteDialog',
  props: {
    isShow: {
      type: Boolean,
      default: false,
    },
    params: {
      type: Object,
      default: () => { },
    },
    extData: {
      type: Object,
      default: () => { },
    },
  },
  data() {
    return {
      name: 'DeleteDialog',
    };
  },
  watch: {
    params(val) {
      console.log('params:watch:', val);
      this.init();
    },
    isShow(val) {
      if (val) {
        this.reset();
        console.info('params:', JSON.stringify(this.params, null, 2));
      } else {
        console.log(this, 'isShow', val);
      }
    },
  },
  methods: {
    onBtnClick(type) {
      console.log('onBtnClick', type);
      this.$emit(type, this.params, this.name);
    },
    init() {
      console.log('init');
    },
    reset() {
      console.log('reset');
    },
  },
};
</script>

<style lang="scss" scoped>
.dialog_wrap {
  width: 100%;
  .dialog-content_wrap {
    min-height: 100px;
    margin: 20px 40px 20px 20px;
    width: calc(100% - 60px);
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .icon_wrap {
       .warn-icon {
         color: #f25c62;
         font-size: 55px;
         margin: 0 10px;
       }
    }
    .tip-text_wrap {
      margin-left: 10px;
      .main {
        line-height: 22px;
        font-size: 18px;
        columns: #333333;
      }
      .sub {
        line-height: 16px;
        margin-top: 20px;
        font-size: 14px;
        columns: #666666;
      }
    }
  }
}
/deep/ .common-dialog {
    &.el-dialog {
      .el-dialog__header {
        padding: 17px 20px;
        box-shadow: 0px 1px 0px 0px #e7e7e7;
        line-height: 1.2em;
        .el-dialog__title {
          font-size: 20px;
          color: $color-font-active;
        }
      }
      .el-dialog__body {
        padding: 0;
      }
      .el-dialog__footer {
        box-shadow: 0px -1px 0px 0px rgba(233, 233, 233, 1);
        padding: 18px 20px;
        button {
          margin-left: 20px;
        }
      }
    }
  }
  .btn-normal{
    @include box-sizing(box-border);
    font-size: 12px;
    height: 32px;
    padding: 0px 20px;
    min-width: 80px;
    text-align: center;
  }
  // 深蓝色底 白色字体
  .btn-dark-blue{
    border-radius: 2px !important;
    border: 1px solid $color-button !important;
    font-weight: 400 !important;
    background-color: $color-button !important;
    color: $color-white !important;
    cursor: pointer;
    &:hover {
      background: #5D5D74 !important;
      border-color: #5D5D74 !important;
    }
  }
</style>
