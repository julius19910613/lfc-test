<template>
  <el-dialog class="emotibot upload-excel-dialog" :title="title || $t('general.batch_import')"
  :visible.sync="value" :show-close="false" :append-to-body="true" :before-close="onCancelUploadFile">
    <div class="file-box">
      <!-- 选择文件 -->
      <div class="file-row">
        <span class="title">{{$t('general.batch_upload.upload_file')}}</span>
        <button class="upload-btn btn-white-gray btn-small" @click="onClickUpload">
          <i></i>{{$t('general.batch_upload.choose_file')}}
        </button>
        <button class="download-btn btn-white-gray btn-small"
        @click="onClickDownloadTemplate">
          <i></i>{{$t('general.batch_upload.download_template')}}
        </button>
        <span class="file-name" v-if="uploadFile && uploadFile.name">
          {{uploadFile.name}}<i class="el-icon-close" @click="onClearUpload"></i>
        </span>
        <input class="file-input" type="file" ref="uploadFileInput"
        accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" @change="getUploadFile">
      </div>
      <!-- 选择上传模式 -->
      <div class="file-row" v-if="showUploadMode && uploadModes && uploadModes.length > 0">
        <span class="title">{{$t('general.batch_upload.upload_mode')}}</span>
        <el-tooltip popper-class="emotibot" v-for="(mode, index) in uploadModes" :key="index" effect="dark" 
        placement="bottom" :manual="true" :value="selectUploadMode===index && showTooltips && value">
          <div slot="content" style="line-height: 1.5em; width: 200px;" v-html="mode.description"></div>
          <el-radio class="emotibot" v-model="selectUploadMode" :key="index" :label="index" size="mini">{{mode.label}}</el-radio>
        </el-tooltip>
      </div>
    </div>
    <div class="tips-box" v-if="showTips">
      <h3>{{$t('general.batch_upload.tip')}}</h3>
      <p v-html="tips"></p>
    </div>
    <span slot="footer">
      <button @click="onCancelUploadFile" class="btn-white-gray btn-small marginright10">
        {{$t('general.cancel')}}
      </button>
      <button @click="onSubmitUploadFile" class="btn-small"
      :class="{'btn-dark-blue': uploadFile, 'btn-disabled': !uploadFile}">
        {{$t('general.batch_upload.confirm_upload')}}
      </button>
    </span>
  </el-dialog>
</template>

<script>
import { turnWorkBook2Json, fixData, readXLSXFile } from '@/utils/js/excel';

export default {
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default() {
        return this.$t('general.batch_import');
      },
    },
    tips: {
      type: String,
      default() {
        return this.$t('general.batch_upload.tips');
      },
    },
    showUploadMode: {
      type: Boolean,
      default: true,
    },
    showTips: {
      type: Boolean,
      default: true,
    },
    uploadModesArray: {
      type: Array,
      default() {
        return ['add', 'replace'];
      },
    },
    customUploadDescriptions: {
      type: Object,
      default() {
        return {};
      },
    },
    customUploadLabels: {
      type: Object,
      default() {
        return {};
      },
    },
    maxCount: {
      type: Number,
    },
  },
  data() {
    return {
      selectUploadMode: -1,
      uploadFile: null,
      showTooltips: true,
    };
  },
  computed: {
    uploadModes() {
      const arr = [];
      this.uploadModesArray.forEach((item) => {
        if (item === 'add') {
          arr.push({
            label: this.customUploadLabels.add || this.$t('general.batch_upload.add_data'),
            description: this.customUploadDescriptions.add || this.$t('general.batch_upload.add_data_desc') });
        } else if (item === 'replace') {
          arr.push({
            label: this.customUploadLabels.replace || this.$t('general.batch_upload.replace_all'),
            description: this.customUploadDescriptions.replace || this.$t('general.batch_upload.replace_all_desc') });
        }
      });
      return arr;
    },
  },
  watch: {
    value(newVal) {
      if (newVal) {
        this.timer = window.setTimeout(() => {
          this.selectUploadMode = 0;
          this.showTooltips = true;
        }, 200);
      } else {
        // 反复快速打开关闭dialog时，导致关闭后selectUploadMode被设置为0
        if (this.timer) {
          window.clearTimeout(this.timer);
        }
        this.selectUploadMode = -1;
      }
      if (!newVal) {
        this.onCancelUploadFile();
      }
    },
  },
  methods: {
    // 点击下载模板
    onClickDownloadTemplate() {
      this.$emit('downloadTempl');
    },
    // 点击选择文件
    onClickUpload() {
      this.$refs.uploadFileInput.click();
    },
    // 点击清除已选择文件
    onClearUpload() {
      this.uploadFile = null;
      this.$refs.uploadFileInput.value = '';
    },
    // 获取上传的文件内容
    getUploadFile(e) {
      const { target: { files: [arr] } } = e;
      if (arr) {
        this.uploadFile = arr;
      }
    },
    // 取消批量导入意图
    onCancelUploadFile() {
      // this.showTooltips = false;
      this.uploadFile = null;
      this.selectUploadMode = -1;
      this.$refs.uploadFileInput.value = '';
      this.$emit('input', false);
    },
    // 点击确认提交已选文件
    onSubmitUploadFile() {
      if (this.uploadFile) {
        this.showTooltips = false;
        if (this.closeTimer) {
          window.clearTimeout(this.closeTimer);
        }
        if (this.uploadFile.size && this.uploadFile.size > 1000000) {
          // 解决页面卡顿，先隐藏掉tooltip
          this.closeTimer = window.setTimeout(() => {
            if (this.uploadModes instanceof Array
              && this.uploadModes.length > 0) {
              this.submitFile(this.uploadFile, this.selectUploadMode);
            } else {
              this.submitFile(this.uploadFile);
            }
            this.onCancelUploadFile();
          }, 500);
        } else {
          // 直接关掉
          if (this.uploadModes instanceof Array
            && this.uploadModes.length > 0) {
            this.submitFile(this.uploadFile, this.selectUploadMode);
          } else {
            this.submitFile(this.uploadFile);
          }
          this.onCancelUploadFile();
        }
      }
    },
    // 根据上传Excel的内容，批量导入意图
    submitFile(fileContent, uploadMode, readAsBinary) {
      const that = this;
      if (fileContent) {
        if (!/(?:.xlsx|.xls)$/.test(fileContent.name)) {
          // 返回错误提示信息
          this.$alert(that.$t('general.batch_upload.only_xlsx_xls'),
          that.$t('general.batch_upload.file_invalid'), {
            confirmButtonText: that.$t('general.ok'),
          });
          return;
        }
        const reader = new FileReader();
        reader.onload = (event) => {
          const validateRes = this.validateFile(event.target.result, readAsBinary);
          if (validateRes === true) {
            this.$emit('upload', fileContent, uploadMode);
          } else {
            // 返回错误提示信息
            this.$alert(validateRes, that.$t('general.batch_upload.file_invalid'), {
              confirmButtonText: that.$t('general.ok'),
            });
          }
        };
        if (readAsBinary) {
          reader.readAsBinaryString(fileContent);
        } else {
          reader.readAsArrayBuffer(fileContent);
        }
      }
    },
    // 检查上传的意图文件是否有格式错误
    validateFile(file, readAsBinary) {
      let content = null;
      if (readAsBinary) {
        content = readXLSXFile(file, { type: 'binary' });
      } else {
        const arr = fixData(file);
        content = readXLSXFile(btoa(arr), { type: 'base64' });
      }
      const checkResult = turnWorkBook2Json(content);
      const firstLine = Object.keys(checkResult)[0];
      let result = true;
      // 判断行数
      // if (JSON.stringify(checkResult) === '{}') {
      //   // 提示 - 上传的内容为空,请重新选择文件!
      //   result = this.$t('general.batch_upload.empty_file');
      // }
      if (this.maxCount && checkResult[firstLine].length > this.maxCount) {
        // 提示 - 上传的行数不可超过10000行！
        result = this.$t('general.batch_upload.oversize_file').replace('%1', this.maxCount);
      }
      return result;
    },
  },
};
</script>

<style lang="scss" scoped>
.upload-excel-dialog{
  margin-top: 10vh;
  ::v-deep .el-dialog{
    width: 650px;
    .el-dialog__body{
      padding: 20px;
      .file-box{
        p{
          height:20px;
          line-height:20px;
          font-size:14px;
          color: $color-font-active;
          margin-bottom: 24px;           
        }
        .file-row{
          margin-bottom: 18px;
          display: flex;
          align-items: center;
          &:last-child{
            margin-bottom: 24px;
          }
          .title{
            display: inline-block;
            margin-right: 30px;
            height:20px;
            line-height:20px;
            font-size:14px;
            font-weight:400;
            color: $color-font-normal;
          }
          button{
            margin-right: 10px;
            padding: 0px 10px;
            height: 28px;
            line-height: 28px;
            i{
              margin-top: -1px;
            }
            &.upload-btn{
              i{
                @include icon('../assets/icons/import.svg', 15px, 13px);
              } 
            }
            &.download-btn{
              i{
                @include icon('../assets/icons/export.svg', 16px, 17px);
              } 
            }
          }
          .file-name{
            flex: 1;
            height:28px;
            padding-right: 20px;
            display: inline-block;
            border-radius:2px;
            background:$page-base;
            color: $color-font-normal;
            font-size:12px;
            line-height: 28px;
            padding-left: 10px;
            position: relative;
            overflow-x: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            word-break: break-all;
            vertical-align: bottom;
            i{
              position: absolute;
              top: 8px;
              right: 10px;
              font-weight: bold;
              color: $color-font-disabled;
              cursor: pointer;
            }
          }
          .file-input{
            display: none;
          }
        }
        .el-radio{
          margin-top: 3px;
        }
      }
      .tips-box{
        box-shadow:0px -1px 0px 0px rgba(233,233,233,1);
        h3{
          display: inline-block;
          height:20px;
          font-size:14px; 
          margin-top: 20px;
          margin-bottom: 10px;
          line-height:20px;
          color: $color-font-active;
        }
        p{
          font-size:12px;
          color: $color-font-normal;
          line-height:20px;
        }
      }
    }
    .el-dialog__footer{
      button{
        margin-left: 20px;
      }
    }
  }
}
.btn-disabled{
  background: $color-font-disabled;
  color: $color-white;
  border-radius: 2px;
  font-weight: 400;
  border: 1px solid $color-white;
  cursor: not-allowed !important;
}
</style>