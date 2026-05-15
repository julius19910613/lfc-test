<template>
  <div class="dialogue-act-wrapper">
    <div class="dialogue-act-classifier card h-fill" v-if="!showActDetail">
      <div class="title-box">
        <h1 class="title">{{ $t('parser.classifier.classifier_title1') }}</h1>
        <el-input :placeholder="$t('parser.library.search_by_model')" v-model="searchStr"
        size="mini" class="search-box" suffix-icon="el-icon-search"></el-input>
      </div>
      <div class="explanation-wrapper">
        <div class="explanation-left">
          <div style="padding-top: 5px;">
            <img src="../../assets/images/flow.png"/>
          </div>
          <div style="margin-left: 20px;">
            <p style="height: 28px">
              <span class="explana-title">{{ $t('parser.classifier.classifier_title') }}</span>
              <span> {{ $t('parser.classifier.classifier_list') }}</span>
            </p>
            <p class="explana-cont">{{ $t('parser.classifier.classifier_desc') }}</p>
          </div>
        </div>
      </div>
      <div class="parser-library-list">
        <div class="loading-box" v-if="isLoading">
          <loading-dot></loading-dot>
        </div>
        <emoti-card type="new" :title="$t('parser.classifier.add_classifier')" clickCard
            class="parser-item add-parser-box" @click="handleAddParser"/>
        <emoti-card v-for="(parser, index) in filterParsersList" :key="index"
        class="parser-item" v-model="parser.status"
        :title="parser.classifierName" clickCard
        :cardData="parser" :text="parser.description"
        :actions="btnGroup" @click="handleCheckParserDetail(parser)"
        type="status" :statusMap="statusMap"/>
      </div>
      <dialogue-act-test v-model="popSingleTestDlg"
      :testParserAct="testParserAct" :testParserActDesc="testParserActDesc"
      :parserId="testParserId" :parserName="testParserName"></dialogue-act-test>
    </div>
    <dialogue-act-detail v-else @back="handleBackToList"
    :actDetailObj="actDetailObj" @refresh="handleImportActContent"></dialogue-act-detail>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import DialogueActDetail from './_components/DialogueActDetail';
import DialogueActTest from './_components/DialogueActTest';
import ParserDetailDialog from './_components/ParserDetailDialog';
import actAPI from './_api/dialogueAct';
import nerAPI from './_api/ner';

export default {
  path: 'dialogue-act-classifier',
  privCode: 'ner_factory',
  api: [actAPI, nerAPI],
  data() {
    return {
      isLoading: false,
      searchStr: '',
      parsersList: [],
      popSingleTestDlg: false,
      testParserId: '',
      testParserName: '',
      testParserAct: '',
      testParserActDesc: '',
      showActDetail: false,
      actDetailObj: null,
      btnGroup: [
        {
          icon: 'icon-delete',
          // label: '删除', // 只有指定label时, ⿏标悬停在按钮上才会出现tooltip提示框
          onClick: (parser) => {
            this.handleClickDeleteParser(parser);
          },
        },
        {
          icon: 'icon-edit-01',
          // label: '测试', // 只有指定label时, ⿏标悬停在按钮上才会出现tooltip提示框
          onClick: (parser) => {
            this.handleTestParser(parser);
          },
        },
        {
          icon: 'icon-edit',
          // label: '编辑',
          onClick: (parser) => {
            this.handleCheckParserDetail(parser);
          },
        },
      ],
    };
  },
  components: {
    DialogueActTest,
    ParserDetailDialog,
    DialogueActDetail,
  },
  created() {
    this.getDialogueActList();
  },
  computed: {
    ...mapGetters([
      'robotID',
      'robotName',
    ]),
    filterParsersList() {
      return this.parsersList.filter(parser =>
      parser.classifierName.indexOf(this.searchStr) !== -1);
    },
    statusMap() {
      return {
        0: { label: this.$t('parser.library.not_publish'), color: '#F25C62' },
        1: { label: this.$t('parser.library.published'), color: '#00A699' },
      };
    },
  },
  mounted() {
    this.$api.registerNERUser(this.robotID, this.robotName).then(() => {
      console.log('ner user registered');
    }).catch((e) => {
      this.$notifyFail(e.message || e.response.data.message);
    });
  },
  methods: {
    getDialogueActList() {
      this.isLoading = true;
      this.$api.getDialogActList(this.robotID, '').then((res) => {
        this.parsersList = res.data || [];
        this.parsersList = this.parsersList.map(v => ({
          ...v,
          status: 1,
        }));
      }).catch((e) => {
        this.$message({ message: e.message || this.$t('parser.classifier.get_list_failed'), type: 'error' });
      }).finally(() => {
        this.isLoading = false;
      });
    },
    // 新增对话行为分类器
    handleAddParser() {
      this.actDetailObj = {
        id: null,
        classifierId: null,
        classifierName: '',
        description: '',
        useGeneralModel: 0,
        classifierStatus: 0,
        predictSlotName: 'ACT',
        predictSlotDesc: '',
        userId: this.robotID,
        createdTime: '',
        updatedTime: '',
        tagsInfo: [
          // {
          //   id: null,
          //   tagName: 'Yes',
          //   tagDesc: '是',
          //   corpusesInfo: [],
          //   classifierId: null,
          //   createdTime: '',
          //   updatedTime: '',
          // },
          // {
          //   id: null,
          //   tagName: 'No',
          //   tagDesc: '不是',
          //   corpusesInfo: [],
          //   classifierId: null,
          //   createdTime: '',
          //   updatedTime: '',
          // },
          {
            id: null,
            tagName: 'Other',
            tagDesc: this.$t('parser.classifier.no_tag_data'),
            corpusesInfo: [],
            classifierId: null,
            createdTime: '',
            updatedTime: '',
          },
        ],
      };
      this.showActDetail = true;
    },
    // 查看对话行为分类器详情
    handleCheckParserDetail(parser) {
      this.$api.getDialogActDetail(this.robotID, parser.classifierId).then((res) => {
        this.actDetailObj = res.data;
        this.showActDetail = true;
      }).catch((e) => {
        this.$message({ message: e.message || this.$t('parser.classifier.get_detail_failed'), type: 'error' });
      });
    },
    handleBackToList(needRefreshList) {
      this.showActDetail = false;
      if (needRefreshList) {
        this.getDialogueActList();
      }
    },
    handleImportActContent(actDetail) {
      actDetail.classifierId = this.actDetailObj.classifierId;
      actDetail.id = this.actDetailObj.id;
      this.actDetailObj = actDetail;
    },
    // 测试对话行为分类器
    handleTestParser(parser) {
      this.testParserId = parser.classifierId;
      this.testParserName = parser.classifierName;
      this.testParserAct = parser.predictSlotName;
      this.testParserActDesc = parser.predictSlotDesc;
      this.popSingleTestDlg = true;
    },
    handleClickDeleteParser(parser) {
      this.$confirm(this.$t('parser.classifier.delete_confirm').replace('%1', parser.classifierName), this.$t('parser.classifier.tip'), {
        confirmButtonText: this.$t('parser.classifier.confirm'),
        cancelButtonText: this.$t('parser.classifier.cancel'),
        type: 'warning',
      }).then(() => {
        this.handleDeleteParser(parser);
      }).catch(() => {
        this.$message({
          type: 'info',
          message: this.$t('parser.classifier.already_cancel'),
        });
      });
    },
    handleDeleteParser(parser) {
      this.$api.deleteDialogAct(parser).then(() => {
        this.$message({
          message: `${parser.classifierName}已删除`,
          type: 'success',
        });
        this.getDialogueActList();
      }).catch(() => {
        this.$message({
          message: `${parser.classifierName}${this.$t('parser.classifier.already_delete')}`,
          type: 'error',
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.dialogue-act-wrapper{
  padding: 0px !important;
}
.dialogue-act-classifier {
  box-sizing: border-box;
  width: calc(100% - 20px);
  height: 100%;
  display: flex;
  flex-direction: column;
  // padding: 20px 0px 20px 20px !important;
  background-color: #F6F6F6;
  margin: 10px;
  .title-box{
    display: flex;
    align-items: center;
    margin: 0px 0px 10px 0px;
    padding: 0px 20px;
    height: 60px;
    .title{
      flex: 1;
      font-size: 16px;
      font-weight: 400;
      color: $color-font-active;
    }
    .search-box{
      width: 220px;
      ::v-deep input{
        width: 100%;
        font-size: 14px;
      }
    }
  }
  .explanation-wrapper{
    margin: 0px 20px 20px 20px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    height: 63px;
    background: rgba(249,249,249,1);
    border-radius: 1px;
    padding: 8px 20px ;
    font-size: 14px;
    color: #8c8c8c;
    .explanation-left{
      display: flex;
      flex-direction: row;
    }
    .explana-title{
      font-size: 16px;
      color:#434343;
      line-height: 28px;
      font-weight: 400;
    }
    .explana-cont{
      line-height: 18px;
    }
  }
  .explain-box{
    background: #f9f9f9;
    border-radius: 1px;
    padding: 8px 20px;
    font-size: 14px;
    color: #8c8c8c;
  }
  .parser-library-list{
    padding: 0px 0px 20px 20px;
    flex: 1;
    min-width: 800px;
    width: 100%;
    overflow-y: auto;
    position: relative;
    vertical-align: top;
    .parser-item{
      width: calc(25% - 20px);
      box-sizing: border-box;
      max-width: 600px;
      min-width: 360px;
      height: 112px;
      margin: 0px 20px 20px 0px;
      padding: 10px 20px 20px 20px;
      display: inline-block;
      background-color: #FFFFFF;
      vertical-align: top;
      cursor: pointer;
      &.add-parser-box{
        width: calc(25% - 20px);  
        min-width: 360px;
        max-width: 600px;
        margin: 0px 16px 20px 0px;
        text-align: center;
        padding-top: 8px;
        cursor: pointer;
        .create-enterprise{
          font-size:14px;
          font-family: PingFangSC-Regular,PingFang SC;
          color:#666666;
        }
      }
    }
    .loading-box{
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>