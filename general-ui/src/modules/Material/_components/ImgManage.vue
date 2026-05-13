<template>
    <!-- 图片 -->
  <div class="scroll-box">
    <div class="image-material">
    <div v-for="(item, i) in imageData" :key="i" class="img-box" @click="handleChooseImage(item, i)">
      <div class="img-box-inner">
        <img :src="item.icon"/>
      </div>
      <span>{{ item.name }}</span>
      <div class="image-cover" :class="{'active': item.selected === true}">
      <i class="el-icon-success"></i>
      </div>
    </div>
    </div>
    <el-pagination class="emotibot page-control"
      v-show="total > 0"
      small
      layout="prev, pager, next, sizes"
      :current-page.sync="pageIndex" 
      :page-size="pageSize"
      :page-sizes="pageLimits"
      @size-change="handlePageChangeSize" 
      @current-change="handlePageChangeList"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
export default {
  props: {
    fileType: {
      type: String,
      default: '',
    },
    imageData: {
      type: Array,
      default: () => [],
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
  data() {
    return {
      currentIndex: -1,
      pageIndex: 1,
      pageSize: 8,
      pageLimits: [8, 16, 100],
      selLen: 0,
      selData: [],
    };
  },
  methods: {
    handleChooseImage(item, i) {
      if (this.imageData[i].selected === true) {
        this.$set(this.imageData[i], 'selected', false);
        const index = this.selData.indexOf(item.icon);
        this.selData.splice(index, 1);
        this.selLen -= 1;
      } else {
        if (this.len + this.selLen >= 5) {
          this.$message.warning(this.$t('material_library.tips.max_res_item'));
          return;
        }
        this.$set(this.imageData[i], 'selected', true);
        this.selData.push(item.icon);
        this.selLen += 1;
      }
      this.$emit('handleChoose', this.selData);
    },
    handlePageChangeList(pageIndex) {
      this.selLen = 0;
      this.selData = [];
      this.currentIndex = -1;
      this.pageIndex = pageIndex;
      this.$emit('handleChangePageIndex', this.pageIndex, this.pageSize);
      this.$emit('handleChoose', this.selData);
    },
    handlePageChangeSize(pageSize) {
      this.currentIndex = -1;
      this.pageSize = pageSize;
      this.$emit('handleChangePageIndex', this.pageIndex, this.pageSize);
    },
    initStatus() {
      this.pageIndex = 1;
      this.pageSize = 8;
      this.currentIndex = -1;
      this.selLen = 0;
      this.selData = [];
    },
  },
};
</script>

<style lang="scss" scoped>
.image-material{
  display: flex;
  flex-wrap: wrap;
  padding: 0 10px;
  flex: 1;
  max-height: 340px;
  min-height: 340px;
  overflow-y: auto;
  .img-box{
    display: flex;
    flex-direction: column;
    position: relative;
    margin: 0 10px 20px;
    width: 155px;
    height: 180px;
    .img-box-inner {
      display: flex;
      position: relative;
      height: 140px;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
    img{
      width: auto;
      height: auto;
      max-width: 100%;
      overflow: hidden;
      position: absolute;
      // width: auto;
      // height: 110px;
    }
    >span{
      flex: 1;
      flex-shrink: 0;
      background-color: #F7F7F7;
      text-align: center;
      @include font-12px();
      line-height: 40px;
      height: 40px;
      overflow:hidden; /*超出的部分隐藏起来。*/ 
      white-space:nowrap;/*不显示的地方用省略号...代替*/
      text-overflow:ellipsis;/* 支持 IE */
      color: #666666;
    }
    .image-cover{
      position: absolute;
      width: 100%;
      height: calc(100% - 40px);
      top: 0;
      left: 0;
      &:hover{
        background-color: rgba(255, 255, 255, .3);
      }
      >i{
        position: absolute;
        right: 10px;
        bottom: 10px;
        font-size: 23px;
        color: #1875F0;
        background: #fff;
        border-radius: 100%;
        display: none;
      }
      &.active{
        i{
          display: block;
        }
      }
    }
  }
}
.scroll-box{
  display: flex;
  flex-direction: column;
}
.page-control{
  text-align: right;
  padding: 0 0 20px;
  box-sizing: border-box;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
}
</style>
