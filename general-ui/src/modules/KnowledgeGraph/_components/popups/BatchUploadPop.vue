<template>
  <div class="batch_upload">
    <template v-if="!loading">
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
              @change="validFile()"
            >
            <text-button
              id="file_upload"
              button-type="fill"
              icon-align="left"
              icon-type="kg_upload"
              @click.stop="batchUploadKG"
            >{{ $t('knowledge_graph.data_manage.btn_file_choose') }}</text-button>
          </div>
          <div class="row_btn">
            <text-button
              id="file_template"
              button-type="fill"
              icon-align="left"
              icon-type="kg_template"
              @click.stop="downloadKGTemplate"
            >{{ $t('knowledge_graph.data_manage.btn_template_download') }}</text-button>
            <a ref="templateDownload"/>
            <template v-if="isUploadFailed">
              <text-button
                button-type="fill"
                icon-align="left"
                icon-type="kg_template"
                @click.stop="downloadKGFail"
              >{{ $t('knowledge_graph.data_manage.btn_fail_download') }}</text-button>
              <a ref="failResultDownload"/>
            </template>
          </div>
          <div v-if="uploadFile !== ''" class="file_name">
            <div>{{ uploadFile }}</div>
            <div class="cancel" @click.stop="resetSelectedFile">X</div>
          </div>
        </div>
        <div class="row">
          <div class="row_text">{{ $t('knowledge_graph.data_manage.upload_type') }}</div>
          <div class="upload_mode">
            <input v-model="isFullUpdate" type="radio" :value="isFullUpdate">
            <div class="row_text">{{ $t('knowledge_graph.data_manage.replace') }}</div>
          </div>
        </div>
      </div>
      <div class="upload_content instruction">
        <div class="row">
          <div class="row_title">{{ $t('knowledge_graph.data_manage.notice') }}</div>
        </div>
        <div class="instructions">
          <h1>{{ $t('knowledge_graph.data_manage.notice_1') }}</h1>
          <h1>{{ $t('knowledge_graph.data_manage.notice_2') }}</h1>
          <h1>{{ $t('knowledge_graph.data_manage.notice_3') }}</h1>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="loading_content">
        <loading-dot>
        </loading-dot>
      </div>
    </template>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import api from '../../_api/knowledgeGraph';

export default {
  name: 'BatchUploadPop',
  props: {
    extData: {

    },
  },
  api,
  computed: {

    ...mapGetters([
      'robotID',
      'userID',
    ]),
  },
  data() {
    return {
      uploadFile: '',
      fileValid: true,
      isFullUpdate: true,
      isUploadFailed: false,
      uploadFailFileName: '',
      file: '',
      loading: false,
    };
  },

  methods: {
    validFile() {
      let msg = '';
      const fileSizeLimit = 15 * 1024 * 1024;
      const theFile = this.$refs.batchUpload.files[0];

      if (!theFile) {
        this.fileValid = false;
        msg = this.$t('knowledge_graph.notify.upload_file_undefined');
      } else if (theFile.size <= 0 || theFile.size > fileSizeLimit) {
        this.fileValid = false;
        msg = this.$t('knowledge_graph.notify.upload_file_size_error');
      } else if (this.fileTypeInvalid(theFile)) {
        this.fileValid = false;
        msg = this.$t('knowledge_graph.notify.upload_file_type_invalid');
      } else {
        this.fileValid = true;
        this.file = theFile;
        this.updateFilename();
      }

      if (!this.fileValid) {
        this.$message({
          showClose: true,
          message: msg,
          type: 'error',
        });
      }
    },

    updateFilename(msg) {
      this.uploadFile = msg || this.file.name;
    },

    fileTypeInvalid(file) {
      const validType = ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
      const suffix = file.name.split('.');
      const ExcelSuffix = 'xlsx';
      const isExecl = suffix && suffix.length > 0 && suffix[suffix.length - 1] === ExcelSuffix;
      return validType.indexOf(file.type) === -1 && !isExecl;
    },

    batchUploadKG() {
      this.$refs.batchUpload.click();
    },

    resetSelectedFile() {
      this.$refs.batchUpload.value = '';
      this.uploadFile = '';
    },

    downloadKGTemplate() {
      this.$api.batchUploadTemplate()
        .then((res) => {
          console.log(res);
          const errFile = new Blob([res.data], { type: 'application/vnd.ms-excel;charset=UTF-8' });
          window.URL = window.URL || window.webkitURL;
          this.$refs.templateDownload.href = URL.createObjectURL(errFile);
          this.$refs.templateDownload.download = `${this.$t('knowledge_graph.material_manage.batch_upload_filename')}.xlsx`;
          this.$refs.templateDownload.click();
        });
    },

    downloadKGFail() {
      this.$api.getUploadFaliedInfo(this.robotID, this.uploadFailFileName)
        .then((res) => {
          const errFile = new Blob([res.data], { type: 'application/vnd.ms-excel;charset=UTF-8' });
          window.URL = window.URL || window.webkitURL;
          this.$refs.failResultDownload.href = URL.createObjectURL(errFile);
          this.$refs.failResultDownload.download = this.uploadFailFileName;
          this.$refs.failResultDownload.click();
        });
    },

    validate() {
      if (this.loading && this.file) {
        this.$notifyFail(this.$t('knowledge_graph.error.upload_loading_error'));
        return;
      }
      const that = this;
      if (!this.file || !this.uploadFile || this.uploadFile === '') {
        that.$notifyFail(this.$t('knowledge_graph.data_manage.msg_empty_file'));
      } else {
        this.loading = true;
        this.isUploadFailed = false;
        that.$api.initBuildKG(this.file, this.robotID, this.userID)
          .then((data) => {
            this.loading = false;
            const res = data.data;
            if (res.status === 'success') {
              that.$notify({
                text: this.$t('knowledge_graph.material_manage.batch_upload_success'),
              });
              this.$emit('validateSuccess');
            }
          })
          .catch((err) => {
            this.loading = false;
            const message = this.$t('knowledge_graph.material_manage.err_msg_batch_upload_fail');
            that.$notifyFail(message);
            if (err.response.data.filename !== undefined) {
              this.uploadFailFileName = err.response.data.filename;
              this.isUploadFailed = true;
            }
          });
      }
    },
  },

  beforeMount() {
    this.$on('validate', this.validate);
  },

};
</script>

<style lang="scss" scoped>
@import '../../../../assets/styles/variable';

.batch_upload {
  width: 60vw;
  display: flex;
  flex-direction: column;
  .upload_content {
    padding: 20px 0px;
    border-bottom: 1px solid #e9e9e9;
    display: flex;
    flex-direction: column;
    &.operation {
      margin: 0px 20px;
    }
    &.instruction {
      padding: 20px;
    }
  }

  .instructions {
    h1 {
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
</style>

