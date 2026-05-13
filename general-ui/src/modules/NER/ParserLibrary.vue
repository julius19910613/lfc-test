<template>
  <div class="parser-library-wrapper">
    <div class="title-box">
      <h1 class="title">{{ $t('parser.library.parser_lirabry') }}</h1>
      <el-input :placeholder="$t('parser.library.search_by_model')" v-model="searchStr"
      size="mini" class="search-box" suffix-icon="el-icon-search"></el-input>
    </div>
    <div class="parser-library-list">
      <emoti-card v-for="(parser, index) in filterParsersList" :key="index"
      class="parser-item" v-model="parser.status"
      :title="parser.name" :subTitle="$t('parser.library.extractor')" clickCard
      :cardData="parser" :text="parser.description"
      :actions="btnGroup" @click="handleCheckParserDetail(parser)"
      type="status" :statusMap="statusMap"/>
    </div>
    <single-test-dialog v-model="popSingleTestDlg"
    :parserId="testParserId" :parserName="testParserName"></single-test-dialog>
    <parser-detail-dialog v-model="popParserDetailDlg" :parserObj="checkParserObj"></parser-detail-dialog>
  </div>
</template>

<script>
import SingleTestDialog from './_components/SingleTestDialog';
import ParserDetailDialog from './_components/ParserDetailDialog';
import api from './_api/ner';

export default {
  privCode: 'ner_factory',
  api,
  data() {
    return {
      isLoading: false,
      searchStr: '',
      parsersList: [],
      popSingleTestDlg: false,
      popParserDetailDlg: false,
      testParserId: '',
      testParserName: '',
      checkParserObj: null,
      btnGroup: [
        {
          icon: 'icon-edit-01',
          className: 'danger',
          // label: '测试', // 只有指定label时, ⿏标悬停在按钮上才会出现tooltip提示框
          onClick: (parser) => {
            this.handleTestParser(parser);
          },
        },
        {
          icon: 'icon-view-detail',
          // label: '查看',
          onClick: (parser) => {
            this.handleCheckParserDetail(parser);
          },
        },
      ],
      statusMap: {
        0: { label: '未发布', color: '#F25C62' },
        1: { label: '已发布', color: '#00A699' },
      },
    };
  },
  components: {
    SingleTestDialog,
    ParserDetailDialog,
  },
  created() {
    this.getParsersList();
  },
  computed: {
    filterParsersList() {
      return this.parsersList.filter(parser => parser.name.indexOf(this.searchStr) !== -1);
    },
  },
  methods: {
    getParsersList() {
      this.isLoading = true;
      this.$api.getParserLibraryList().then((res) => {
        this.parsersList = res.data || [];
        this.parsersList = this.parsersList.map(v => ({
          ...v,
          status: 1,
        }));
      }).catch((e) => {
        this.$message({ message: e.message || this.$t('parser.library.get_parser_list_fail'), type: 'error' });
      }).finally(() => {
        this.isLoading = false;
      });
    },
    handleTestParser(parser) {
      this.testParserId = parser.parserId;
      this.testParserName = parser.name;
      this.popSingleTestDlg = true;
    },
    handleCheckParserDetail(parser) {
      this.checkParserObj = parser;
      this.popParserDetailDlg = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.parser-library-wrapper{
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 20px 0px 20px 20px !important;
  background-color: #F6F6F6;
  .title-box{
    display: flex;
    align-items: center;
    width: calc(100% - 22px);
    .title{
      flex: 1;
      font-size: 16px;
      font-weight: 400;
      color: $color-font-active;
    }
    .search-box{
      width: 220px;
      /deep/ input{
        width: 100%;
        font-size: 14px;
      }
    }
  }
  .parser-library-list{
    width: 100%;
    box-sizing: border-box;
    margin-top: 20px;
    padding: 0px 0px 20px 0px;
    height: calc(100% - 85px);
    overflow: auto;
    .parser-item{
      float: left;
      margin: 0px 20px 20px 0px;
      width: calc(25% - 20px);
      min-width: 360px;
      max-width: 600px;
      box-sizing: border-box;
      height: 124px;
    }
  }
}
</style>