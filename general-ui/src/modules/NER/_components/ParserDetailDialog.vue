<template>
  <el-dialog class="emotibot" :title="$t('parser.classifier.parser_detail')" v-if="parserObj && parserObj.parserId"
  :show-close="false" :visible.sync="value" :before-close="handleCloseDialog">
    <div class="information-box">
      <div class="title-box">
        <span class="title">{{ parserObj.name }}</span>
        <span class="status" :class="{'published' : true, 'not-publish': false}">
          {{ true ? $t('parser.library.published') : $t('parser.library.not_publish') }}</span>
        <span class="publish-time">{{ $t('parser.classifier.publish_time') }}：{{ parserObj.created_time || '无' }}</span>
      </div>
      <p class="description">{{ parserObj.description || '' }}</p>
    </div>
    <div class="slot-title">{{$t('parser.classifier.slot_info')}}</div>
    <div class="slots-table">
      <div class="table-header">
        <div class="table-header-col col1">{{$t('parser.library.slot')}}</div>
        <div class="table-header-col">{{$t('parser.classifier.slot_desc')}}</div>
      </div>
      <div class="table-row" v-for="(item, index) in slots" :key="index">
        <div class="row-cell col1">{{ item.slotName }}</div>
        <div class="row-cell">{{ item.slotDesc }}</div>
      </div>
    </div>
    <div slot="footer">
      <button class="btn-white-gray btn-small" @click="handleCloseDialog">{{$t('parser.library.close')}}</button>
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
    parserObj: {
      type: Object,
    },
  },
  data() {
    return {
      slots: [{
        slotName: 'value',
        slotDesc: '-',
      }],
    };
  },
  methods: {
    handleCloseDialog() {
      this.$emit('input', false);
    },
  },
};
</script>

<style lang="scss" scoped>
.information-box{
  box-shadow: 0px 1px 0px 0px #E9E9E9;
  padding-bottom: 28px;
  .title-box{
    display: flex;
    align-items: center;
    .title{
      font-size: 16px;
      line-height: 24px;
      color: #333333;
      font-weight: bold;
    }
    .status{
      margin-left: 10px;
      font-size: 16px;
      font-weight: bold;
      flex: 1;
      &.published {
        color: #00A699;
      }
      &.not-publish {
        color: #00A699;
      }
    }
    .publish-time{
      color: #999999;
      font-size: 12px;
    }
  }
  .description{
    font-size: 14px;
    line-height: 24px;
    margin: 10px 0px 0px 0px;
    color: #666666;
  }
}
.slot-title{
  font-size: 14px;
  line-height: 20px;
  color:#333333;
  margin-top: 30px;
}
.slots-table{
  margin-top: 10px;
  height: 200px;
  .table-header{
    background-color: #F7F7F7;
    box-shadow:0px 1px 0px 0px #E9E9E9;
    display: flex;
    align-items: center;
    height: 32px;
    .table-header-col{
      font-size: 12px;
      color: #666666;
      padding-left: 10px;
    }
  }
  .table-row{
    background-color: #FFFFFF;
    box-shadow:0px 1px 0px 0px #E9E9E9;
    display: flex;
    align-items: center;
    height: 39px;
    .row-cell{
      font-size: 12px;
      color: #666666;
      padding-left: 10px;
    }
  }
  .col1{
    width: 200px;
  }
}
</style>