<template>
  <div>
    <div class="ner-test-wrapper h-fill w-fill">
      <div class="header-section">
        <h1 class="title">{{$t('ner.test.test_and_report')}}</h1>
        <span>{{$t('ner.test.extractor')}}</span>
        <dropdown-select v-model="selectedParserArr" :placeholder="$t('general.please_choose')"
        :options="optionsParser" @input="handleSelectParser"/>
        <text-button v-if="canImport" :button-type="selectedParserArr.length===0?'disable':'default'"
        @click="handleUploadTestCase">{{$t('ner.test.upload_testcase')}}</text-button>
        <text-button v-if="canExport" :buttonType="selectedParserArr.length===0||testTableData.length===0?'disable':'default'" @click="handleExportTestCase">
        {{$t('ner.test.export_all')}}</text-button>
        <text-button v-if="canEdit" :buttonType="selectedParserArr.length===0||testTableData.length===0||currentTestStatus?'disable':'fill'" @click="handleTestParser">
        {{$t('ner.test.start_test')}}</text-button>
      </div>
      <div class="test-res-box">
        <div class="left-part">
          <div class="test-result" v-if="testTableData.length===0">
            <div class="icon-box"><icon iconType="info_warning"></icon></div>
            <span>{{$t('ner.test.no_testcase')}}</span>
          </div>
          <div v-else-if="lastTestTime">
            <div class="test-result">
              <div class="icon-box"><icon iconType="info_success"></icon></div>
              <span class="test-time">{{$t('ner.test.test_time')}}：{{lastTestTime}}</span>
            </div>
            <text-button class="check-result-btn" height="32px" @click="handleExportTestResult">
            {{$t('ner.test.check_test_result')}}</text-button>
          </div>
        </div>
        <search-input v-model="textInSearchInput" class="search-box"
        :fill="true" @search="handleSearchTestCase"></search-input>
      </div>
      <span class="total-test-count">{{$t('ner.test.test_case_total').replace('%1', Number(testTotalNumber))}}</span>
      <div class="tc-table-wrapper">
        <el-table :data="testTableData" class="test-case-table" :empty-text="$t('ner.test.no_data')"
        :header-cell-style="{'background':'#F7F7F7','color':'#666666','height':'50px'}">
          <el-table-column prop="content" :label="$t('ner.test.test_question')" min-width="120px"></el-table-column>
          <el-table-column prop="expectAnswer" :label="$t('ner.test.expect_result')">
            <template slot-scope="scope">
              <div v-for="(item, index) in scope.row.expectAnswer" :key="index">
              {{item.content}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="actualAnswer" :label="$t('ner.test.robot_result')">
            <template slot-scope="scope">
              <div v-for="(item, index) in scope.row.actualAnswer" :key="index"
              :class="{'error-text':!item.flag}">
              {{item.content}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="compareResult" :label="$t('ner.test.test_result')">
            <template slot-scope="scope">
              <span v-show="scope.row.compareResult" :class="{'error-text':scope.row.compareResult!==1}">
              {{scope.row.compareResult===1?'正确':'错误'}}</span>
            </template>
          </el-table-column>   
        </el-table>
        <div class="testing-wrapper" v-if="currentTestStatus">
          <loading-dot :magnify="1"></loading-dot>
          <span class="testing-text">{{$t('ner.test.is_testing')}}</span>
        </div>
      </div>
      <!-- <v-pagination class="pager" size="small" v-show="testTotalNumber"
      :pageIndex="testPageIndex" :total="Number(testTotalNumber)"
        :page-size="testPageSize" :pageSizeOption="[15, 25, 50, 100, 200]"
        :layout="['prev', 'pager', 'next', 'sizer', 'jumper']"
        @page-change="handlePageIndexChange" @page-size-change="handlePageSizeChange">
      </v-pagination> -->
      <el-pagination class="emotibot pager" small v-show="testTotalNumber"
        :current-page="testPageIndex" :total="Number(testTotalNumber)"
        :page-size="testPageSize" :page-sizes="testPageSizes"
        @size-change="handlePageSizeChange"
        @current-change="handlePageIndexChange"
        :pager-count="5"
        layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>
    </div>
    <upload-excel v-model="isUploadingFile" :title="$t('ner.test.upload_testcase')"
    :tips="$t('ner.test.upload_testcase_tips')"
    @downloadTempl="handleDownloadTCTempl" @upload="uploadNERTestCase"></upload-excel>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import UploadExcel from '@/components/UploadExcel';
import api from './_api/ner';

export default {
  privCode: 'ner_factory',
  api,
  components: {
    UploadExcel,
  },
  data() {
    return {
      customParserList: [],
      selectedParserArr: [],
      selectedParserId: '',
      testResult: '', // '', 'success', 'fail'
      lastTestTime: '',
      testTableData: [],
      isLoading: false,
      testPageSize: 100,
      testPageSizes: [100, 200, 300, 400],
      testPageIndex: 1,
      textInSearchInput: '',
      searchStr: '',
      testTotalNumber: '',
      isUploadingFile: false,
    };
  },
  computed: {
    ...mapGetters([
      'robotID',
      'robotName',
      'currentTestStatus',
      'testingStatus',
      'currentParserId',
    ]),
    // 解析器选择列表
    optionsParser() {
      if (this.customParserList.length === 0) {
        return [];
      }
      const options = [];
      this.customParserList.forEach((parser) => {
        if (parser.flag !== 1) {
          return;
        }
        options.push({
          text: parser.name,
          value: parser.parserId,
        });
      });
      return options;
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
    this.selectedParserId = '';
    this.setCurrentParser('');
  },
  mounted() {
    this.$api.registerNERUser(this.robotID, this.robotName).then(() => {
      console.log('ner user registered');
    }).catch((e) => {
      this.$notifyFail(e.message || e.response.data.message);
    });
  },
  methods: {
    ...mapMutations([
      'setTestingStatus',
      'setCurrentParser',
    ]),
    // 获取自定义抽取器列表
    getCustomParserList() {
      this.$startPageLoading();
      this.$api.getCustomParserList(this.robotID).then((list) => {
        this.customParserList = list;
      }).catch((e) => {
        this.$notifyFail(e.response.data.message);
      }).finally(() => {
        this.$emit('endLoading');
      });
    },
    // 获取当前解析器的测试题列表
    getParserTestCase() {
      this.isLoading = true;
      this.$api.getParserTestData(this.robotID, this.selectedParserId,
        this.testPageSize, this.testPageIndex, this.testTotalNumber, this.searchStr).then((res) => {
          if (res.status === 'success') {
            this.testTableData = res.data.quizDataList || [];
            // 封装数据为测试结果模板数据
            this.testTableData.forEach((item) => {
              const expectAnswerArr = item.expectAnswer === '' ? [] : item.expectAnswer.split('|');
              const actualAnswerArr = item.actualAnswer === '' ? [] : item.actualAnswer.split('|');
              const expectArr = [];
              const actualArr = [];
              for (let i = 0; i < expectAnswerArr.length; i += 1) {
                expectArr.push({ content: expectAnswerArr[i], flag: true });
                if (actualAnswerArr[i] !== undefined) {
                  actualArr.push({
                    content: actualAnswerArr[i],
                    flag: actualAnswerArr[i] === expectAnswerArr[i],
                  });
                }
              }
              item.expectAnswer = expectArr;
              item.actualAnswer = actualArr;
            });
            // 获取上一次测试时间
            if (this.testTableData[0] && this.testTableData[0].createdTime) {
              this.lastTestTime = this.testTableData[0].updatedTime;
            } else {
              this.lastTestTime = '';
            }
            this.testTotalNumber = res.data.totalNumber;
          }
        }).catch((e) => {
          this.$notifyFail(e.message);
        }).finally(() => {
          this.isLoading = false;
        });
    },
    uploadNERTestCase(fileContent, uploadMode) {
      this.$api.uploadNERTestCase(this.robotID, this.selectedParserId,
      fileContent, uploadMode).then((res) => {
        if (res.status === 'success') {
          this.$notify({ text: this.$t('ner.test.upload_testcase_success') });
          this.getParserTestCase();
        }
      }).catch((e) => {
        this.$notifyFail(e.response.data.message);
      });
    },
    handleUploadTestCase() {
      if (this.selectedParserArr.length === 0) {
        return;
      }
      this.isUploadingFile = true;
    },
    handleDownloadTCTempl() {
      this.$api.getTestCaseTemplate(this.robotID, this.selectedParserId);
    },
    handleSelectParser(parserIdArr) {
      this.selectedParserId = parserIdArr[0];
      this.setCurrentParser(this.selectedParserId);
      this.testPageIndex = 1;
      this.testTotalNumber = '';
      this.searchStr = '';
      this.textInSearchInput = '';
      this.getParserTestCase();
    },
    handlePageIndexChange(pageIndex) {
      this.testPageIndex = pageIndex;
      this.getParserTestCase();
    },
    handlePageSizeChange(pageSize) {
      this.testPageSize = pageSize;
      this.testPageIndex = 1;
      this.getParserTestCase();
    },
    handleSearchTestCase(searchStr) {
      if (this.searchStr === searchStr) {
        return;
      }
      this.searchStr = searchStr;
      this.testTotalNumber = '';
      this.testPageIndex = 1;
      this.getParserTestCase();
    },
    handleTestParser() {
      if (this.selectedParserArr.length === 0
      || this.testTableData.length === 0
      || this.currentTestStatus) {
        return;
      }
      this.$api.startTestParser(this.robotID, this.selectedParserId).then(() => {
        this.setTestingStatus({
          parserId: this.selectedParserId,
          status: true,
        });
        this.getTestParserProgress(this.selectedParserId);
      }).catch((e) => {
        this.$notifyFail(e.response.data.message);
      });
    },
    getTestParserProgress(parserId) {
      this.$api.getTestProgress(this.robotID, parserId).then((res) => {
        if (this.timer) {
          window.clearTimeout(this.timer);
        }
        if (res.data.finishFlag === 0) {
          // 测试还在进行中
          this.timer = window.setTimeout(() => {
            this.getTestParserProgress(parserId);
          }, 1000);
        } else if (res.data.finishFlag === 1) {
          // 已完成测试
          this.setTestingStatus({
            parserId,
            status: false,
          });
          this.getParserTestCase();
          this.lastTestTime = res.data.createdTime;
        }
      }).catch((e) => {
        if (this.timer) {
          window.clearTimeout(this.timer);
        }
        this.setTestingStatus({
          parserId,
          status: false,
        });
        this.$notifyFail(e.response.data.message);
      });
    },
    handleExportTestCase() {
      if (this.selectedParserArr.length === 0 || this.testTableData.length === 0) {
        return;
      }
      this.$api.exportTestCase(this.robotID, this.selectedParserId);
    },
    handleExportTestResult() {
      this.$api.exportTestResult(this.robotID, this.selectedParserId);
    },
  },
};
</script>

<style lang="scss" scoped>
.ner-test-wrapper{
  padding: 20px 0px;
  min-width: 850px;
  .header-section{
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    padding: 0px 20px;
    .title{
      flex: 1;
      display: inline-block;
      font-size: 18px;
      color: $color-font-active;
    }
    .dropdown-container{
      width: 200px;
      margin: 0px 10px;
      display: inline-block;
    }
    .text-button{
      margin-left: 10px;
    }
  }
  .test-res-box{
    display: flex;
    margin-bottom: 3px;
    padding: 0px 20px;
    height: 32px;
    .left-part{
      flex: 1;
      .test-result{
        flex: 1;
        background: #FCFCFC;
        display: inline-block;
        margin-right: 10px;
        height: 32px;
        padding: 0px 10px;
        border-radius:2px;
        border:1px solid $color-borderline-disabled;
        .icon-box{
          display: inline-block;
          width: 16px;
          height: 32px;
          margin-right: 5px;
          vertical-align: top;
          .icon{
            display: inline;
          }
        }
        .test-time{
          width: 200px;
        }
        span{
          display: inline-block;
          line-height: 32px;
        }
      }
      .check-result-btn{
        margin-right: 10px;
        vertical-align: top;
      }
      .clickable-link{
        color: $app-active-color;
        cursor: pointer;
      }
    }
    .search-box{
      width: 190px;
      margin-right: 0px;
    }
  }
  .total-test-count{
    position: relative;
    top: 31px;
    left: 80px;
    z-index: 10;
    color: $color-font-mark;
  }
  .tc-table-wrapper{
    width: 100%;
    height: calc(100% - 140px);
    min-height: 100px;
    position: relative;
    ::v-deep .test-case-table{
      width: 100%;
      height: 100%;
      .el-table__body-wrapper{
        height: calc(100% - 50px);
        overflow-y: auto;
      }
      .cell{
        padding-left: 20px;
      }
      .error-text{
        color: red;
      }
    }
    .testing-wrapper{
      position: absolute;
      top: 50px;
      left: 0px;
      background:#FFFFFF;
      width: 100%;
      height: calc(100% - 50px);
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      .testing-text{
        margin-top: 10px;
        @include font-14px();
      }
    }
  }
  .pager{
    margin-top: 18px;
    margin-right: 20px;
    float: right;
  }
}
.header-column{
  background: $color-borderline-disabled;
  color: $color-font-normal;
}
</style>