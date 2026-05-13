<template>
  <el-dialog class="emotibot" :visible.sync="value"
  :before-close="handleCloseDialog" :show-close="false"
  :title="title">
    <div class="test-result-wrapper">
      <el-input ref="refTestInputBox" v-model="testSentence" class="test-input-box"
      :placeholder="$t('parser.library.test_input_placeholder')"
      @keyup.enter.native="handleSingleTest"></el-input>
      <div class="result-title">{{ $t('parser.library.test_sentence') }}</div>
      <div class="result-string">{{ testSentenceInResult }}</div>
      <div class="result-title">{{$t('parser.library.test_result')}}</div>
      <div class="table-header">
        <div class="table-header-col" v-for="(header, index) in testTableHeader" :key="index">
          {{ header }}</div>
      </div>
      <div class="table-content">
        <div class="loading-box" v-if="isTesting">
          <loading-dot></loading-dot>
        </div>
        <div v-for="(row, index) in testTableData" :key="index" class="content-row">
          <div class="row-cell" v-for="(col, colIndex) in row" :key="colIndex">
            {{ col }}
          </div>
        </div>
      </div>
    </div>
    <div slot="footer">
      <button class="btn-white-gray btn-small" @click="handleCloseDialog">关闭</button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '',
    },
    testTableHeader: {
      type: Array,
      default() {
        return [this.$t('parser.library.return_slot'), this.$t('parser.library.desc'), this.$t('parser.library.result')];
      },
    },
    testTableData: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      isTesting: false,
      testSentence: '',
      testSentenceInResult: '',
    };
  },
  watch: {
    testTableData() {
      this.testSentenceInResult = this.testSentence;
      this.testSentence = '';
      this.$refs.refTestInputBox.focus();
    },
  },
  methods: {
    handleCloseDialog() {
      this.$emit('input', false);
    },
    handleSingleTest() {
      this.$emit('test', this.testSentence);
    },
    // handleSingleTest() {
    //   this.isTesting = true;
    //   this.$api.singleTestClassifier(this.robotID,
    // this.parserId, this.testSentence).then((res) => {
    //     this.testResults = res.data.labels || [];
    //     if (this.testResults.length === 0) {
    //       this.testResults.push({
    //         label: '-',
    //         confidence: '-',
    //       });
    //     }
    //     this.testSentenceInResult = this.testSentence;
    //     this.testSentence = '';
    //     this.$refs.refTestInputBox.focus();
    //   }).catch((e) => {
    //     this.$message({ message: e.message || '测试失败', type: 'error' });
    //   }).finally(() => {
    //     this.isTesting = false;
    //   });
    // },
  },
};
</script>

<style lang="scss" scoped>
.test-result-wrapper{
  height: 300px;
  overflow-y: auto;
  .test-input-box{
    /deep/ input {
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
    padding: 10px 0px;
    box-shadow: 0px 1px 0px 0px #E9E9E9;
    display: flex;
    align-items: center;
    .row-cell{
      flex: 1;
      margin-right: 20px;
      padding-left: 10px;
      color: #666666;
      font-size: 12px;
      line-height: 18px;
    }
  }
}
</style>