<template>
  <el-dialog class="emotibot" :visible.sync="value"
  :before-close="handleCloseDialog" :show-close="false"
  :title="$t('parser.classifier.extractor_test')+ ' - ' + parserName">
    <div class="test-result-wrapper">
      <el-input ref="refTestInputBox" v-model="testSentence" class="test-input-box"
      :placeholder="$t('parser.library.test_input_placeholder')"
      @keyup.enter.native="handleSingleTest"></el-input>
      <div class="result-title">{{$t('parser.library.test_sentence')}}</div>
      <div class="result-string">{{ testSentenceInResult }}</div>
      <div class="result-title">{{$t('parser.library.test_result')}}</div>
      <div class="table-header">
        <div class="table-header-col">{{$t('parser.classifier.return_value')}}</div>
        <div class="table-header-col">{{$t('parser.classifier.return_value_desc')}}</div>
        <div class="table-header-col">{{$t('parser.library.result')}}</div>
      </div>
      <div class="table-content">
        <div class="loading-box" v-if="isTesting">
          <loading-dot></loading-dot>
        </div>
        <div v-for="(item, index) in testResults" :key="index" class="content-row">
          <div class="row-cell">{{ testParserAct }}</div>
          <div class="row-cell">{{ testParserActDesc }}</div>
          <div class="row-cell">{{ item.label }}</div>
        </div>
      </div>
    </div>
    <div slot="footer">
      <button class="btn-white-gray btn-small" @click="handleCloseDialog">关闭</button>
    </div>
  </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex';
import api from '../_api/dialogueAct';

export default {
  api,
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    parserId: {
      type: String,
      default: '',
    },
    parserName: {
      type: String,
      default: '',
    },
    testParserAct: {
      type: String,
      default: '',
    },
    testParserActDesc: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      isTesting: false,
      testSentence: '',
      testSentenceInResult: '',
      testResults: [],
    };
  },
  computed: {
    ...mapGetters([
      'robotID',
    ]),
  },
  methods: {
    handleCloseDialog() {
      this.$emit('input', false);
    },
    handleSingleTest() {
      this.isTesting = true;
      this.$api.singleTestClassifier(this.robotID, this.parserId, this.testSentence).then((res) => {
        this.testResults = res.data.labels || [];
        if (this.testResults.length === 0) {
          this.testResults.push({
            label: '-',
            confidence: '-',
          });
        }
        this.testSentenceInResult = this.testSentence;
        this.testSentence = '';
        this.$refs.refTestInputBox.focus();
      }).catch((e) => {
        this.$message({ message: e.message || this.$t('parser.library.test_failed'), type: 'error' });
      }).finally(() => {
        this.isTesting = false;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.test-result-wrapper{
  height: 300px;
  overflow-y: auto;
  .test-input-box{
    ::v-deep input {
      width: 100%;
    }
  }
  .result-title{
    color: #333333;
    font-size: 14px;
    margin-top: 24px;
    font-weight: bold;
  }
  .result-string{
    margin-top: 10px;
    line-height: 20px;
    font-size: 12px;
  }
  .table-header{
    margin-top: 16px;
    background-color: #F7F7F7;
    height: 32px;
    box-shadow: 0px 1px 0px 0px #E9E9E9;
    display: flex;
    align-items: center;
    .table-header-col{
      flex: 1;
      padding-left: 10px;
      color: #666666;
      font-size: 12px;
    }
  }
  .table-content{
    position: relative;
    .loading-box{
      width: 100%;
      height: 40px;
      position: absolute;
      top: 0;
      left: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  .content-row{
    background-color: #FFFFFF;
    height: 39px;
    box-shadow: 0px 1px 0px 0px #E9E9E9;
    display: flex;
    align-items: center;
    .row-cell{
      flex: 1;
      padding-left: 10px;
      color: #666666;
      font-size: 12px;
    }
  }
}
</style>