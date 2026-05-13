<template>
  <div class="ner-wrapper">
    <el-tabs v-model="activeTab">
    <el-tab-pane
    :label="$t('ner.extractor.user_define')" name="userDefineExtractor">
      <n-e-r-extractor-list class="card-wrapper"></n-e-r-extractor-list>
    </el-tab-pane>
    <el-tab-pane
    :label="$t('pages.ner.ner_test_report') " name="testReport">
      <n-e-r-test-report class="card-wrapper"></n-e-r-test-report>
    </el-tab-pane>
  </el-tabs>
  </div>
</template>

<script>
import NERExtractorList from './NERExtractorList';
import NERTestReport from './NERTestReport';

export default {
  privCode: 'ner_factory',
  data() {
    return {
      activeTab: 'userDefineExtractor', // testReport
    };
  },
  components: {
    NERExtractorList,
    NERTestReport,
  },
};
</script>

<style lang="scss" scoped>
.ner-wrapper{
  padding: 0px !important;
  box-sizing: border-box;
  width: 100%;
  height: 100%; 
  /deep/ .el-tabs{
    .el-tabs__content{
      margin: 10px;
      width: calc(100% - 20px) !important;
      height: calc(100% - 60px) !important;
      border-radius: 4px;
      background-color: #FFFFFF;
      overflow-y: auto;
    }
  }
}
</style>