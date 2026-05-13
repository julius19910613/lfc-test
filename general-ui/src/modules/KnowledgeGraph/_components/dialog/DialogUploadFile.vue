<template>
  <div class="dialog_wrap"  v-if="visible">
    <el-dialog
      custom-class="common-dialog"
      width="50vw"
      :title="params.title"
      :visible.sync="visible"
      :close-on-click-modal="false"
      :show-close="false"
    >
      <div class="dialog-content_wrap">
          <div class="upload_content operation">
            <div class="row">
              <div class="row_text">{{ $t('knowledge_graph.data_manage.file_upload') }}</div>
              <div class="row_btn">
                <input
                  type="file"
                  ref="batchUpload"
                  id="entityFileChooser"
                  style="display: none"
                  accept=".xlsx"
                  @change="onUploadFileChange()"
                >
                <text-button
                  id="file_upload"
                  button-type="fill"
                  icon-align="left"
                  icon-type="kg_upload"
                  @click.stop="onUploadFile"
                >{{ $t('knowledge_graph.data_manage.btn_file_choose') }}</text-button>
              </div>
              <div class="row_btn">
                <text-button
                  id="file_template"
                  button-type="fill"
                  icon-align="left"
                  icon-type="kg_template"
                  @click.stop="startTemplateDownload"
                >{{ $t('knowledge_graph.data_manage.btn_template_download') }}</text-button>
                <a ref="templateDownload"/>
                <template v-if="isShowDownloadFailInfoBtn">
                  <text-button
                    button-type="fill"
                    icon-align="left"
                    icon-type="kg_template"
                    @click.stop="startDownloadFailInfo"
                  >{{ $t('knowledge_graph.data_manage.btn_fail_download') }}</text-button>
                  <a ref="failResultDownload"/>
                </template>
              </div>
              <div  class="file_name">
                <div>{{ uploadFileName || '请上传文件...' }}</div>
                <div class="cancel" @click.stop="resetSelectedFile">X</div>
              </div>
            </div>
            <div class="row" v-if='isShowExtraActionBtn'>
              <slot :params='params'>
                <div class="row_text">{{ $t('knowledge_graph.data_manage.upload_type') }}</div>
                <div class="upload_mode">
                  <input v-model="isFullUpdate" type="radio" :value="isFullUpdate">
                  <div class="row_text">{{ $t('knowledge_graph.data_manage.replace') }}</div>
                </div>
              </slot>
            </div>
          </div>
          <div class="upload_content instruction" v-if="params.attentionList && params.attentionList.length > 0">
            <div class="row">
              <div class="row_title">{{ $t('knowledge_graph.data_manage.notice') }}</div>
            </div>
            <div class="instructions">
              <div v-for='(attention, index) in params.attentionList' :key='`att-${index}`' class="text">{{index+1}}.{{attention}}</div>
            </div>
          </div>
      </div>
      <div slot="footer" class="dialog-footer">
       <el-button @click="onBtnClick('cancel')" class=" btn-normal">{{params.cancelText || '取消'}}</el-button>
          <el-button @click="onBtnClick('confirm')" class=" btn-normal"
          :class="!isCheckFileOk?'btn-disabled':'btn-dark-blue'"
          >{{params.confirmText}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
/**
 * @name '上传/下载文件弹窗'
 * @auther 'CHENELY'
 * @createTime 20191108
 * @desc '上传/下载文件弹窗封装'
 */
export default {
  name: 'DialogUploadFile',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    params: {
      type: Object,
      default: () => { },
    },
    extData: {
    },
  },
  data() {
    return {
      name: 'DialogUploadFile',
      fetchDataTimeRange: '',
      file: null, // 上传文件
      isUploading: false, // 正在上传中
      uploadFileName: '', // 待上传文件名称
      isFullUpdate: true,
      isShowDownloadFailInfoBtn: false,
      uploadFailFileName: '',
      loading: false,
    };
  },
  computed: {
    // 是否显示额外的操作按钮： 全量替换等，亦可以通过slot 自定义；
    isShowExtraActionBtn() {
      return this.params.isShowExtraActionBtn;
    },
    // 最后文件是否上传ok
    isCheckFileOk() {
      return !!this.file && this.file.size > 0;
    },
  },
  watch: {
    file(val) {
      console.log('file:watch:', val);
    },
    params(val) {
      console.log('params:watch:', val);
      this.init();
    },
    visible(val) {
      if (val) {
        this.reset();
        console.info('params:', JSON.stringify(this.params, null, 2));
      } else {
        console.log(this, 'visible', val);
      }
    },
  },
  methods: {
    onUploadFileChange() {
      let msg = '';
      const fileSizeLimit = this.params.fileSizeLimit;
      if (!this.$refs.batchUpload.files || this.$refs.batchUpload.files.length === 0) {
        console.error('未上传文件或者文件为空');
        this.file = null;
        return;
      }
      const theFile = this.$refs.batchUpload.files[0];
      let isFileValid = true;
      if (!theFile) {
        isFileValid = false;
        msg = this.$t('knowledge_graph.notify.upload_file_undefined');
      } else if (theFile.size <= 0 || theFile.size > fileSizeLimit) {
        isFileValid = false;
        msg = this.$t('knowledge_graph.notify.upload_file_size_error');
      } else if (this.fileTypeInvalid(theFile)) {
        isFileValid = false;
        msg = this.$t('knowledge_graph.notify.upload_file_type_invalid');
      } else {
        isFileValid = true;
        this.file = theFile;
        this.updateFilename();
      }
      if (!isFileValid) {
        this.$message({
          showClose: true,
          message: msg,
          type: 'error',
        });
      }
    },

    updateFilename(msg) {
      this.uploadFileName = msg || this.file.name;
    },

    fileTypeInvalid(file) {
      const validType = ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
      const suffix = file.name.split('.');
      const ExcelSuffix = 'xlsx';
      const isExecl = suffix && suffix.length > 0 && suffix[suffix.length - 1] === ExcelSuffix;
      return validType.indexOf(file.type) === -1 && !isExecl;
    },

    onUploadFile() {
      this.$refs.batchUpload.click();
    },

    resetSelectedFile() {
      this.$refs.batchUpload.value = '';
      this.uploadFileName = '';
    },

    startTemplateDownload() {
      this.$emit('startTemplateDownload', this.params, this.name);
    },
    startDownloadFailInfo() {
      this.$emit('startDownloadFailInfo', this.uploadFailFileName);
    },
    downloadFailInfo(errFile, fileName) {
      this.download(errFile, fileName, 'failResultDownload');
    },
    downTemplateFile(errFile, fileName) {
      this.download(errFile, fileName, 'templateDownload');
    },
    download(file, fileName, refName) {
      console.log('download', file, fileName, refName);
      window.URL = window.URL || window.webkitURL;
      this.$refs[`${refName}`].href = URL.createObjectURL(file);
      this.$refs[`${refName}`].download = fileName;
      this.$refs[`${refName}`].click();
    },
    // 点击确认按钮事件
    onConfirm() {
      if (!this.isCheckFileOk) {
        console.error('上传文件错误,请检查...');
        return;
      }
      if (this.loading) {
        this.$message({
          showClose: true,
          message: this.$t('knowledge_graph.error.upload_loading_error'),
          type: 'error',
        });
        return;
      }
      this.$emit('onUploadFile', this.file);
    },
    onBtnClick(type, index) {
      if (type === 'cancel') {
        this.$emit('close', this.params, this.name);
      } else if (type === 'confirm') {
        console.log('onBtnClick:', type, index);
        this.onConfirm(type, index);
      }
    },
    init() {
      this.name = this.params.name;
      this.loading = this.params.loading;
      this.uploadFailFileName = this.params.uploadFailFileName;
      this.isShowDownloadFailInfoBtn = this.params.isShowDownloadFailInfoBtn;
    },
    reset() {
      this.isShowDownloadFailInfoBtn = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.dialog_wrap {
  .dialog-content_wrap {
    min-height: 100px;
    padding-top: 20px;
    margin-bottom: 20px;
    width: 100%;
    .upload-file_wrap {
      height: 60px;
      width: 100%;
      .upload-btn {
        min-width: 190px;
      }
      .file-input {
        display: none;
      }
      .file-name {
        height: 38px;
        text-align: start;
        line-height: 40px;
        background: #F1F1F1;
        padding-left: 10px;
        max-width: calc(100% - 150px);
        span {
          @include textEllipsis();
          max-width: 100%;
        }
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
  // 灰色底，白色字体
  .btn-disabled{
    background: $color-font-disabled;
    color: $color-white;
    border-radius: 2px;
    font-weight: 400;
    border: 1px solid $color-white;
    cursor: not-allowed !important;
    &:focus, &:hover {
      color: #ffffff;
      background: $color-font-disabled;
      border-color: $color-white;
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
  .loading_content {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }

.dialog_wrap {
  width: 60vw;
  display: flex;
  flex-direction: column;
  .dialog-content_wrap {
    .upload_content {
      padding: 10px 0px;
      display: flex;
      flex-direction: column;
      &.operation {
        margin: 0px 20px;
        border-bottom: 1px solid #e9e9e9;
      }
      &.instruction {
        padding: 10px 20px 0 20px;
      }
    }

    .instructions {
      .text {
        padding: 5px;
        font-size: 12px;
        font-family: PingFangHK-Regular;
        font-weight: 400;
        color: rgba(102, 102, 102, 1);
        line-height: 20px;
      }
    }

    .row {
      display: flex;
      flex-direction: row;
      padding: 5px 0px;
      align-items: center;

      .row_title {
        margin: 0px 5px;
        font-size: 14px;
        font-family: PingFangHK-Regular;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
        line-height: 20px;
      }
      .row_text {
        margin: 0px 5px;
        font-size: 14px;
        font-family: PingFangHK-Regular;
        font-weight: 400;
        color: rgba(102, 102, 102, 1);
        line-height: 20px;
      }
      .row_btn {
        margin: 0px 5px;
      }
      #file_upload,
      #file_template,
      #file_fail {
        width: 96px;
        height: 28px;
        border-radius: 2px;
        border: 1px solid rgba(219, 219, 219, 1);
        background: #ffffff;
        font-size: 12px;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: rgba(102, 102, 102, 1);
        line-height: 28px;
      }
      .file_name {
        margin-right: 5px;
        height: 28px;
        flex: 1;
        display: flex;
        padding: 0px 10px;
        align-items: center;
        justify-content: space-between;
        background: rgba(238, 238, 238, 1);
        border-radius: 2px;
        font-size: 12px;
        font-family: PingFangHK-Regular;
        font-weight: 400;
        color: rgba(102, 102, 102, 1);
        line-height: 18px;
        .cancel {
          width: 10px;
          height: 10px;
          display: flex;
          align-items: center;
          cursor: pointer;
          // background:rgba(204,204,204,1);
        }
      }
      .upload_mode {
        display: flex;
        flex-direction: row;
      }
    }

    .loading_content {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
