<template>
  <div class="material-list">
    <div class="material-list-header">
      <el-row>
        <el-col :span="10"><span>{{ $t('material_manage.file_name') }}</span></el-col>
        <el-col :span="4"><span>{{$t('material_library.file_size')}}</span></el-col>
        <el-col :span="5"><span>{{$t('material_library.upload_date')}}</span></el-col>
        <el-col :span="5"><span>{{$t('material_library.upload_account')}}</span></el-col>
      </el-row>
    </div>
    <div class="material-list-body"  v-if="materialList.length > 0">
      <el-checkbox-group v-model="checkedMaterial" @change="handleCheckedMaterial">
        <el-row v-for="(item, idx) in materialList" :key="idx">
          <el-col :span="10">
            <span class="col-name-item">
              <el-checkbox class="emotibot emotibot-checkbox" :label="item.name"></el-checkbox>
              <img v-if="fileType === $t('material_library.btn_image')" class="file-type-icon" :src="item.icon" />
              <page-icon 
                v-if="fileType === 'document' || fileType === 'audio'" 
                :size=26 class="button" 
                :icon-type="fileType === 'document' ? item.fileType : 'audio'"></page-icon>
              <p>&nbsp;&nbsp;{{item.name}}</p>
            </span>
          </el-col>
          <el-col :span="4"><span>{{item.file_size_format}}</span></el-col>
          <el-col :span="5"><span>{{item.upload_date_format}}</span></el-col>
          <el-col :span="5"><span>{{item.upload_user}}</span></el-col>
        </el-row>
      </el-checkbox-group>
    </div>
    <div class="material-list" v-else>
      <p class="data-empty">{{$t('material_library.data_empty')}}</p>
    </div>
    <el-pagination class="page-control"
      v-show="total > 0"
      small
      background
      :page-sizes="pageLimits"
      :current-page.sync="pageIndex" 
      :page-size="pageSize"  
      @size-change="handlePageSizeChange" 
      @current-change="handleChangePageIndex"
      layout="prev, pager, next, sizes"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
import PageIcon from '@/components/basic/Icon';

export default {
  name: 'file-material',
  props: {
    materialList: {
      default: () => [],
      type: Array,
    },
    fileType: {
      type: String,
      default: '',
    },
    total: {
      type: Number,
      default: 0,
    },
    len: {
      type: Number,
      default: 0,
    },
  },
  components: {
    PageIcon,
  },
  data: () => ({
    checkedMaterial: [],
    pageLimits: [8, 16, 100],
    pageIndex: 1,
    pageSize: 8,
  }),
  created() {},
  methods: {
    handleCheckedMaterial() {
      if (this.len + this.checkedMaterial.length > 5) {
        this.checkedMaterial.splice(this.checkedMaterial.length - 1, 1);
        this.$message.warning(this.$t('material_library.tips.max_res_item'));
        return;
      }
      this.$emit('handleChoose', this.checkedMaterial);
    },
    handleChangePageIndex(pageIndex) {
      this.pageIndex = pageIndex;
      this.checkedMaterial = [];
      this.$emit('handleChangePageIndex', this.pageIndex, this.pageSize);
    },
    handlePageSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.$emit('handleChangePageIndex', this.pageIndex, this.pageSize);
    },
    initStatus() {
      this.pageIndex = 1;
      this.pageSize = 8;
      this.checkedMaterial = [];
    },
  },
};
</script>

<style lang="scss" scoped>

.material-list{
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  height: 383px;
  .data-empty{
    width: 100%;
    text-align: center;
    font-size: 14px;
    color: #666666;
    margin-top: 50px;
    min-height: 150px;
  }
  /deep/ .el-checkbox__label{
    display: none;
  }
  .material-list-header{
    height: 36px;
    background:rgba(247,247,247,1);
    box-shadow: inset 0px -1px 0px 0px rgba(233,233,233,1);
    .el-row{
      span{
        width: 100%;
        display: inline-block;
        height: 36px;
        line-height: 36px;
        padding-left: 20px;
        box-sizing: border-box;
        -moz-box-sizing: border-box;
        -webkit-box-sizing: border-box;
        font-size: 12px;
        color: #666666;
        i{
          color: #BABABA;
          cursor: pointer;
        }
      }
    }
  }
  .material-list-body{
    flex: 1;
    overflow-y: auto;
    .el-col{
      padding: 2px 0 2px 20px;
      box-shadow: inset 0px -1px 0px 0px rgba(233,233,233,1);
      box-sizing: border-box;
      -moz-box-sizing: border-box;
      -webkit-box-sizing: border-box;
      span{
        display: inline-block;
        line-height: 36px;
        font-size: 12px;
        &.col-name-item{
          display: flex;
          flex-direction: row;
          align-items: center;
          p{
            flex: 1;
            overflow:hidden; /*超出的部分隐藏起来。*/ 
            white-space:nowrap;/*不显示的地方用省略号...代替*/
            text-overflow:ellipsis;/* 支持 IE */
            margin: 0;
            max-width: 200px!important;
            font-size: 12px;
          }
        }
        &.operate{
          i{
            cursor: pointer;
            font-size: 14px;
            color: #1875F0;
          }
          a{
            color: #1875F0;
            text-decoration: none;
            cursor: pointer;
            margin-left: 6px;
          }
          .delete{
            color: #F25C62;
            margin-left: 6px;
          }
        }
      }
    }
  }
}
.page-control{
  text-align: right;
  padding: 20px 0;
  box-sizing: border-box;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
}
.emotibot-checkbox{
  /deep/ &.el-checkbox{
    margin-right: 30px;
  }
}
</style>