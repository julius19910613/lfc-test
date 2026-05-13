<template>
  <div class="ner-list-wrapper">
    <div class="h-fill w-fill">
      <!-- <nav-bar :options="pageOptions" v-model="currentPage"></nav-bar> -->
      <div class="user-define-extractor" v-if="currentPage==='userDefineExtractor'">
        <div class="no-data-wrapper" v-if="customParserList.length===0">
          <h1 class="title">{{$t('ner.extractor.no_define_extractor')}}</h1>
          <p class="desc">{{$t('ner.extractor.no_define_extractor_desc')}}</p>
          <text-button v-if="canCreate" button-type="fill" @click="popEditCustomParserDlg()">
            {{$t('ner.extractor.add_user_define')}}</text-button>
        </div>
        <div class="has-data-wrapper" v-else>
          <!-- <text-button v-if="canCreate" button-type="fill" class="add-parser-btn" @click="popEditCustomParserDlg()">
            {{$t('ner.extractor.add_user_define')}}</text-button> -->
          <div class="list-body">
            <emoti-card v-if="canCreate" type="new" clickCard
            :title="$t('ner.extractor.add_user_define')" @click="popEditCustomParserDlg"/>
            <emoti-card clickCard @click="handleCheckParserDetail(item.parserId)"
                v-for="(item, index) in customParserList" :key="index"
                v-model="item.flag" type="status" :statusMap="statusMap"
                :title="item.name" :cardData="item" :actions="btnGroup"
              />
          </div>
        </div>
      </div>
      <div class="general-extractor" v-else-if="currentPage==='generalExtractor'">
        <div class="no-data-wrapper" v-if="generalParserList.length===0">
          <h1 class="title">{{$t('ner.extractor.no_general_extractor')}}</h1>
        </div>
        <div class="has-data-wrapper" v-else>
          <div class="parser-list">
            <div v-for="(item, index) in generalParserList" :key="index" class="general-parser-item">
              <div class="info-box">
                <p class="name">{{item.name}}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <word-bank-detail v-model="isCheckingWBDetail" :wb="currentWB" v-if="currentWB"></word-bank-detail>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import ParserEditor from './_components/ParserEditor';
import ErrorMessage from './_components/ErrorMessage';
import WordBankDetail from './_components/WordBankDetail';
import api from './_api/ner';

export default {
  privCode: 'ner_factory',
  api,
  components: {
    ParserEditor,
    ErrorMessage,
    WordBankDetail,
  },
  data() {
    return {
      pageOptions: {
        userDefineExtractor: this.$t('ner.extractor.user_define'),
        testReport: this.$t('pages.ner.ner_test_report'),
      },
      currentPage: 'userDefineExtractor',
      customParserList: [],
      generalParserList: [],
      wordBankList: [],
      parserObj: {},
      file: undefined,
      isCheckingWBDetail: false,
      currentWB: null,
      isUploadingWB: false,
      btnGroup: [
        {
          icon: 'icon-delete',
          type: 'danger',
          onClick: (parser) => {
            this.handleClickDeleteParserBtn(parser);
          },
        },
        {
          icon: 'icon-edit',
          onClick: (parser) => {
            this.handleCheckParserDetail(parser.parserId);
          },
        },
      ],
      statusMap: {
        0: { label: '未发布', color: '#F25C62' },
        1: { label: '使⽤中', color: '#00A699' },
      },
    };
  },
  watch: {
    // currentPage() {
    //   for (let i = 0; i < this.customParserList.length; i += 1) {
    //     this.customParserList[i].isDeleting = false;
    //   }
    //   for (let j = 0; j < this.wordBankList.length; j += 1) {
    //     this.wordBankList[j].isDeleting = false;
    //   }
    // },
  },
  computed: {
    ...mapGetters([
      'robotID',
      'robotName',
    ]),
    existParserNames() {
      if (this.customParserList.length === 0) {
        return [];
      }
      const names = [];
      this.customParserList.forEach((parser) => {
        names.push(parser.name);
      });
      return names;
    },
    canCreate() {
      return this.$hasRight('edit');
    },
    canDelete() {
      return this.$hasRight('edit');
    },
    canEdit() {
      return this.$hasRight('edit');
    },
    canExport() {
      return this.$hasRight('export');
    },
    canImport() {
      return this.$hasRight('edit');
    },
  },
  created() {
    this.getCustomParserList();
    this.getGeneralParserList();
    this.getWordBankList();
  },
  mounted() {
    this.$api.registerNERUser(this.robotID, this.robotName).then(() => {
      console.log('ner user registered');
    }).catch((e) => {
      this.$notifyFail(e.message || e.response.data.message);
    });
  },
  methods: {
    openFileChooser() {
      this.$refs.fileChooser.click();
    },
    // 导入词库文件
    uploadWBFile() {
      const that = this;
      this.isUploadingWB = true;
      that.$api.uploadWordBank(this.file, this.robotID)
        .then((res) => {
          if (res.status === 'success') {
            that.$notify({ text: that.$t('ner.extractor.upload_wb_success') });
            this.getWordBankList();
          }
        })
        .catch((err) => {
          if (err.response.status === 400) {
            if (err.response.data.message) {
              that.$pop({
                title: that.$t('wordbank.result.fail'),
                data: {
                  errorMessage: err.response.data.message,
                },
                component: ErrorMessage,
                buttons: ['ok'],
              });
            } else {
              that.$notifyFail(that.$t('wordbank.error.import_format_invalid'));
            }
          } else {
            that.$notifyFail(that.$t('wordbank.result.fail'));
          }
        })
        .finally(() => {
          that.$refs.fileChooser.value = '';
          this.isUploadingWB = false;
        });
    },
    validateFileSize() {
      const fileSizeLimit = 2 * 1024 * 1024;
      const theFile = this.$refs.fileChooser.files[0];
      let fileValid = false;
      if (!theFile) {
        fileValid = false;
        this.$notifyFail(this.$t('wordbank.upload_file_undefined'));
      } else if (theFile.size <= 0 || theFile.size > fileSizeLimit) {
        fileValid = false;
        this.$notifyFail(this.$t('wordbank.upload_file_size_error'));
      } else if (!/(?:.xlsx|.xls)$/.test(theFile.name)) {
        fileValid = false;
        this.$notifyFail(this.$t('general.batch_upload.only_xlsx_xls'));
      } else {
        fileValid = true;
        this.file = theFile;
      }
      if (fileValid) {
        this.uploadWBFile();
      } else {
        this.$refs.fileChooser.value = '';
      }
    },
    // 下载词库模板
    handleDownloadWBTempl() {
      this.$api.downloadNERWordBankTemplate();
    },
    handleViewWB(wb) {
      this.currentWB = wb;
      this.isCheckingWBDetail = true;
    },
    // 删除词库
    handleDeleteWb(index, wb) {
      const that = this;
      this.$api.deleteWordBank(this.robotID, wb.id).then((res) => {
        if (res.status === 'success') {
          this.$notify({
            text: that.$t('ner.wb.delete_success'),
          });
          that.getWordBankList();
        } else {
          this.$notifyWarn(res.message);
        }
      }).catch((err) => {
        this.$notifyFail(err.response.data.message || err.message);
      });
    },
    // 获取自定义抽取器列表
    getCustomParserList() {
      this.$startPageLoading();
      this.$api.getCustomParserList(this.robotID).then((list) => {
        this.customParserList = list;
        this.$endPageLoading();
      }).catch((e) => {
        this.$notifyFail(e.response.data.message);
      });
    },
    // 获取通用抽取器列表
    getGeneralParserList() {
      this.$api.getGeneralParserList(this.robotID).then((list) => {
        this.generalParserList = list;
      }).catch((e) => {
        this.$notifyFail(e.response.data.message);
      });
    },
    // 获取NER词库列表
    getWordBankList() {
      this.$api.getWordBankList(this.robotID).then((list) => {
        this.wordBankList = list;
      }).catch((e) => {
        this.$notifyFail(e.response.data.message);
      });
    },
    // 查看抽取器详情 + 编辑抽取器
    handleCheckParserDetail(parserId) {
      this.$api.getCustomParser(this.robotID, parserId).then((detail) => {
        const parserObj = detail.data;
        parserObj.parserId = parserId;
        this.popEditCustomParserDlg(parserObj);
      }).catch((e) => {
        this.$notifyFail(e.response.data.message);
      });
    },
    // 打开自定义抽取器编辑框
    popEditCustomParserDlg(parserObj) {
      if (parserObj && parserObj.parserId) {
        this.parserObj = parserObj;
      } else {
        this.parserObj = {
          parserId: '',
          parserName: '',
          slots: [
            { name: '', extractor: { baseParsers: [], dicts: [], rules: [] } },
          ],
          corpus: [],
        };
      }
      const that = this;
      const twoButtons = [{
        msg: this.$t('ner.extractor.save_and_publish'),
        event: 'validate',
        type: 'fill',
        callback: () => {
          this.parserObj.onlySave = false;
        },
      }, {
        msg: this.$t('ner.extractor.only_save'),
        event: 'validate',
        callback: () => {
          this.parserObj.onlySave = true;
        },
      }];
      const oneButton = [{
        msg: this.$t('ner.extractor.save_and_publish'),
        event: 'validate',
        type: 'fill',
        callback: () => {
          this.parserObj.onlySave = false;
        },
      }];
      const customButtons = this.parserObj.used_num > 0 ? oneButton : twoButtons;
      const option = {
        title: this.parserObj.parserName || this.$t('ner.extractor.add_user_define'),
        component: ParserEditor,
        data: {
          canEdit: this.canEdit,
          canExport: this.canExport,
          existParserNames: this.existParserNames,
          extractor: this.parserObj,
          wordBankList: this.wordBankList,
          generalParserList: this.generalParserList,
          readonly: false,
        },
        validate: true,
        cancelValidate: true,
        buttons: ['cancel'],
        custom_button: customButtons,
        callback: {
          ok() {
            if (that.parserObj.onlySave) {
              // 仅保存
              that.handleSaveCustomParser(that.parserObj, false);
            } else {
              // 保存且发布
              that.handleSaveCustomParser(that.parserObj, true);
            }
          },
        },
      };
      this.$pop(option);
    },
    handleClickDeleteParserBtn(parser) {
      if (parser.usedNum > 0) {
        this.$message({
          message: this.$t('ner.extractor.cannot_delete'),
          type: 'information',
        });
      } else {
        this.$confirm(this.$t('ner.extractor.delete_confirm'), '提示', {
          confirmButtonText: this.$t('general.confirm'),
          cancelButtonText: this.$t('general.cancel'),
          type: 'warning',
        }).then(() => {
          this.handleDeleteParser(parser);
        });
      }
    },
    handleCancelDeleteWB(index) {
      this.$refs[`deleteWBBtn${index}`][0].click();
    },
    handleDeleteParser(parser) {
      if (!parser.parserId) {
        return;
      }
      this.$api.deleteCustomParser(this.robotID, parser.parserId, parser.name).then((res) => {
        if (res.status === 'success') {
          this.$message({
            message: '删除成功',
            type: 'success',
          });
          this.getCustomParserList();
        }
      }).catch((e) => {
        this.$message({
          message: e.response.data.message,
          type: 'error',
        });
      });
    },
    handleSaveCustomParser(parserObj, flagTrain) {
      const that = this;
      delete parserObj.onlySave;
      if (parserObj.created_time) {
        // [更新|更新且训练]抽取器
        this.$api.updateCustomParser(this.robotID, parserObj, flagTrain).then((res) => {
          if (res.status === 'success') {
            const message = flagTrain ? that.$t('ner.extractor.save_train_success') : that.$t('ner.extractor.save_success');
            this.$notify({ text: message });
            this.getCustomParserList();
          }
        }).catch((e) => {
          const message = flagTrain ? that.$t('ner.extractor.save_train_fail') : that.$t('ner.extractor.save_fail');
          this.$notifyFail(e.response.data.message || message);
        });
      } else {
        // [创建|创建且训练]抽取器
        this.$api.createCustomParser(this.robotID, parserObj, flagTrain).then((res) => {
          if (res.status === 'success') {
            const msg = flagTrain ? that.$t('ner.extractor.save_train_success') : that.$t('ner.extractor.save_success');
            this.$notify({ text: msg });
            this.getCustomParserList();
          }
        }).catch((e) => {
          const message = flagTrain ? that.$t('ner.extractor.save_train_fail') : that.$t('ner.extractor.save_fail');
          this.$notifyFail(e.response.data.message || message);
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.ner-list-wrapper{
  .user-define-extractor, .general-extractor{
    width: 100%;
    height: calc(100% - 60px);
    padding: 20px;
    overflow: auto;
    .no-data-wrapper{
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      height: 100%;
      .title{
        color: $color-font-active;
        margin-bottom: 10px;
        @include font-16px();
      }
      .desc{
        color: $color-font-normal;
        margin-bottom: 30px;
        @include font-14px();
      }
    }
    .list-body {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
    }
    .emoti-card {
      margin: 0 20px 20px 0;
      width: calc(25% - 20px);
      max-width: 600px;
      min-width: 360px;
      &.new-card {
        height: 92px;
      }
    }
    .has-data-wrapper{
      .add-parser-btn{
        margin-bottom: 20px;
      }
      .parser-list{
        width: 100%;
        margin-top: 20px;
        padding: 0px 0px 20px 0px;
        height: calc(100% - 85px);
        overflow: auto;
        .general-parser-item{
          float: left;
          margin: 0px 20px 20px 0px;
          padding: 22px 20px;
          width: calc((100% - 60px) / 4);
          border: 1px solid $color-borderline-disabled;
          border-radius: 2px;
          cursor: pointer;
          overflow: hidden;
          color: $color-font-active;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          @include font-14px();
          &:hover{
            color: $color-primary;
          }
          &:nth-child(4n+4) {
            margin-right: 0px;
          }
        }
      }
    }
  }
}
</style>