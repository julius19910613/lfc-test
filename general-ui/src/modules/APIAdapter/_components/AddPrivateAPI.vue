<template>
  <div class="add-api">
    <div class="row-item">
      <p class="title">{{$t('api_adapter.api_private.basic_info')}}</p>
      <ul class="item-content">
        <li>
          <i class="left">{{$t('api_adapter.api_private.inner_api_name')}}</i>
          <div class="right">
            <el-input 
              class="emotibot"
              v-model.trim="basicData.apiAdapterName"
              :placeholder="$t('api_adapter.api_private.tips.input_inner_api_name')"
              size="mini">
            </el-input>
          </div>
        </li>
        <li>
          <i class="left">{{$t('api_adapter.api_private.api_type')}}</i>
          <div class="right">
            <el-select class="emotibot"
              v-model="basicData.apiType"
              :placeholder="$t('api_adapter.api_private.tips.select_api_type')"
              size="mini">
              <el-option
                v-for="item in typeList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
        </li>
        <li>
          <i class="left">{{$t('api_adapter.api_private.outer_api')}}</i>
          <div class="right">
            <el-select
              class="emotibot"
              v-model="basicData.outerApiId"
              :placeholder="$t('api_adapter.api_private.tips.select_outer_api')"
              size="mini">
              <el-option
                v-for="item in outerApiList"
                :key="item.id"
                :label="item.apiName"
                :value="item.id">
              </el-option>
            </el-select>
          </div>
        </li>
        <li>
          <i class="left">URL</i>
          <div class="right">{{basicData.url}}</div>
        </li>
      </ul>
    </div>
  </div> 
</template>

<script>
import api from '../_api/private';

export default {
  api: [api],
  props: {
    basicData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      typeList: [
        {
          value: 'te',
          label: 'te',
        },
      ],
      outerApiList: [],
    };
  },
  created() {
    this.fetchOuterApiList();
  },
  components: {},
  methods: {
    handleClose() {},
    fetchOuterApiList() {
      this.$api.fetchOuterApi()
        .then((res) => {
          if (res.status === 0 && (res.result instanceof Array)) {
            this.outerApiList = res.result;
          }
        })
        .catch(() => {});
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'styles/variable.scss';
.row-item {
  .title{
    @include font-14px();
    color: $color-font-active;
    margin-bottom: 10px;
  }
  li {
    display: flex;
    flex-direction: row;
    margin-bottom: 10px;
    align-items: center;
    .left {
      width: 84px;
      text-align: right;
      margin-right: 10px;
      @include font-14px();
    }
    .right {
      flex: 1;
      ::v-deep input{
        width: 100%;
      }
      .el-select{
        width: 316px;
      }
    }
  }
}
.item-content{
  background:rgba(247,247,247,1);
  border-radius:2px;
  padding: 20px;
  box-sizing: border-box;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
}
</style>
