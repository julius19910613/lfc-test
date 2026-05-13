<template>
  <el-dialog class="emotibot wb-detail-wrapper" :title="$t('ner.wb.wb_detail')" :before-close="closeWBDetail"
  :visible.sync="value" :show-close="false" :append-to-body="true">
    <div>
      <span class="wb-item-name-label">{{$t('ner.wb.wb_item_name')}}</span>
      <span class="wb-item-name-value">{{wb.name}}</span>
    </div>
    <div class="wb-items-wrapper">
      <div class="loading-wb-wrapper" v-if="isLoading">
        <loading-dot :magnify="0.5"></loading-dot>
      </div>
      <div v-else class="wb-items-box">
        <div class="wb-item-box" v-for="item in currentWordsList" :key="item.id">
          <div class="wb-item">{{item.name}}</div>
          <div class="gap"></div>
          <div class="similar-words">
            <span v-for="(similarWord, index) in getSimilarWords(item.similarWords)" :key="index"
            class="tag">
            {{similarWord}}</span>
          </div>
        </div>
      </div>
    </div>
    <el-pagination class="emotibot pager" small
      @size-change="handleSizeChange"
      @current-change="handlePageChange"
      :current-page="currentPage"
      :page-sizes="[100, 200, 300, 400]"
      :page-size="pageSize" :pager-count="5"
      layout="total, sizes, prev, pager, next, jumper"
      :total="wordsList.length">
    </el-pagination>
    <div slot="footer">
      <button class="btn-white-gray btn-small" @click="closeWBDetail">{{$t('general.ok')}}</button>
    </div>
  </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex';
import api from '../_api/ner';

export default {
  api,
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    wb: {
      type: Object,
    },
  },
  data() {
    return {
      isLoading: false,
      wordsList: [],
      currentPage: 1,
      pageSize: 100,
    };
  },
  computed: {
    ...mapGetters([
      'robotID',
    ]),
    currentWordsList() {
      return this.wordsList.slice((this.currentPage - 1) * this.pageSize,
      this.currentPage * this.pageSize);
    },
  },
  created() {
    this.getWordsList();
  },
  watch: {
    wb() {
      this.getWordsList();
    },
    value(visible) {
      if (!visible) {
        this.$emit('input', false);
      }
    },
  },
  methods: {
    // 获取词条列表
    getWordsList() {
      if (!this.wb || !this.wb.id) {
        return;
      }
      this.currentPage = 1;
      this.isLoading = true;
      this.$api.getWBWordsList(this.robotID, this.wb.id).then((res) => {
        this.wordsList = res || [];
      }).catch((e) => {
        this.$notifyFail(e.message || e.response.data.message);
      }).finally(() => {
        this.isLoading = false;
      });
    },
    getSimilarWords(similarWords) {
      if (!similarWords) {
        return [];
      }
      return similarWords.split(',');
    },
    handlePageChange(page) {
      this.currentPage = page;
    },
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
    },
    closeWBDetail() {
      this.$emit('input', false);
    },
  },
};
</script> 

<style lang="scss" scoped>
.wb-detail-wrapper{
  /deep/ .el-dialog{
    width: 800px;
    margin-top: 8vh !important;
    .el-dialog__body{
      min-height: 400px;
    }
  }
  .wb-item-name-label{
    display: inline-block;
    @include font-14px();
    color: #666666;
    margin-bottom: 20px;
  }
  .wb-item-name-value{
    @include font-14px();
    color: #333333;
    margin-left: 10px;
  }
  .wb-items-wrapper{
    height: 400px;
    overflow-y: auto;
    .loading-wb-wrapper{
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .wb-items-box{
      .wb-item-box{
         border:1px solid #DBDBDB;
         margin-top: 10px;
         width: 100%;
         padding: 14px 10px;
         display: flex;
         &:first-child{
           margin-top: 0px;
         }
         .wb-item{
           display: inline-block;
           flex: 1;
           margin-right: 10px;
           @include font-14px();
           color: #3A4049;
         }
         .gap{
           border-right: 1px solid #DBDBDB;
         }
         .similar-words{
           display: inline-block;
           flex: 4;
           margin-left: 10px;
           overflow: hidden;
           margin-top: -5px;
           .tag{
             margin-right: 5px;
             margin-top: 5px;
             max-width: 100%;
             display: inline-block;
             background: #EEEEEE;
             padding: 5px 10px;
             height: 28px;
             overflow: hidden;
             text-overflow: ellipsis;
             white-space: nowrap;
             color: #3A4049;
             @include font-14px();
           }
         }
      }
    }
  }
  .pager{
    margin-top: 20px;
    text-align: right;
  }
}
</style>


