
<template>
  <div class="wordbank-wrapper">
      <div class="filter-list card h-fill"
      :class="{'hide-menu': !isDisplayMenu}">
        <category-tree class="category-list"
        :categoryList="categoryTree" :categoryPathMap="categoryPathMap"
        @addCategory="handleAddCategory" @deleteCategory="handleDeleteCategory"
        @selectCategory="handleSelectCategory" @updateSelCateName="handleUpdateCurCategoryName"></category-tree>
        <el-collapse v-model="activeNames" class="status-wrapper">
          <el-collapse-item :title="$t('wordbank.status.title')" name="wbStatus">
            <div class="status" :class="{'selected': wbStatus===undefined}" @click="handleSelectAllStatus">
              {{ $t('wordbank.status.all') }}
              <div v-if="wbStatus===undefined" class="selector-icon"></div>
            </div>
            <div class="status" :class="{'selected': wbStatus===true}" @click="handleSelectEnableStatus">
              {{ $t('wordbank.status.enable') }}
              <div v-if="wbStatus===true" class="selector-icon"></div>
            </div>
            <div class="status" :class="{'selected': wbStatus===false}" @click="handleSelectDisableStatus">
              {{ $t('wordbank.status.disable') }}
              <div v-if="wbStatus===false" class="selector-icon"></div>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
    <wordbank-list class="wordbank-list card h-fill" :categoryList="copyCategoryTree"
    :isLoading="isLoadingWordbanks"
    :totalWBCount="totalNumber" :wordbanks="wordbankList"
    :categoryName="currentCategoryName" :categoryId="currentCategoryId" :categoryPathMap="categoryPathMap"
    @refresh="handleRefreshData" @page="handlePageChange" @expand="isDisplayMenu = !isDisplayMenu"
    @search="handleKeywordSearch"></wordbank-list>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import api from './_api/wordbank_v2';
import CategoryTree from './_components/CategoryTree';
import WordbankList from './_components/WordbankList';

export default {
  privCode: 'wordbank',
  api,
  components: {
    CategoryTree,
    WordbankList,
  },
  data() {
    return {
      isDisplayMenu: true,
      currentCategoryId: -1,
      currentCategoryName: '',
      searchKeyType: 1,
      searchKeyword: '',
      pageIndex: 1,
      pageSize: 50,
      totalNumber: 0,
      categoryTree: [],
      copyCategoryTree: [],
      categoryPathMap: {},
      wordbankList: [],
      isLoadingWordbanks: false,
      activeNames: ['wbStatus'],
      wbStatus: undefined,
    };
  },
  computed: {
    ...mapGetters([
      'robotID',
    ]),
  },
  watch: {
    categoryTree() {
      this.updateCopyCategory();
    },
  },
  created() {
    this.getWordBankList(true);
  },
  methods: {
    // 子页面发出请求 - 需要刷新页面
    handleRefreshData(refreshAll) {
      this.pageIndex = 1;
      this.getWordBankList(refreshAll);
    },
    // 初始化时更新category列表 & 词库列表， 搜索或选择category时只更新词库列表
    getWordBankList(refreshAll) {
      if (refreshAll) {
        this.$startPageLoading();
      } else {
        this.isLoadingWordbanks = true;
      }
      // this.pageIndex = 1;
      this.$api.getWordBankList(this.robotID,
      this.searchKeyType, this.searchKeyword || undefined,
      this.currentCategoryId || undefined, this.currentCategoryName,
      this.wbStatus, this.pageIndex - 1, this.pageSize).then((res) => {
        if (res.status === 0 && res.result) {
          if (refreshAll) {
            const tempList = res.result.children || [];
            const tempRs = [];
            tempList.forEach((item) => {
              if (item.name === '敏感词库') {
                item.name = '违禁词库';
                tempRs.push(item);
              }
              if (item.name === '通用词库') {
                item.name = '同义词';
                tempRs.push(item);
              }
            });
            this.categoryTree = tempRs;
            // this.categoryTree.unshift({
            //   id: '',
            //   name: this.$t('wordbank.category.all'),
            //   readonly: true,
            // });
            this.initCategoryIdPathMap(this.categoryTree, '', 1);
          }
          this.wordbankList = res.result.wordbank || [];
          this.totalNumber = res.result.number || 0;
        }
      }).catch((err) => {
        this.$message.error(err.message);
      }).finally(() => {
        if (refreshAll) {
          this.$endPageLoading();
        } else {
          this.isLoadingWordbanks = false;
        }
      });
    },
    initCategoryIdPathMap(categoryT, parentPath, layer) {
      if (!categoryT) {
        return;
      }
      const prefix = parentPath ? `${parentPath}/` : '';
      categoryT.forEach((category) => {
        this.categoryPathMap[category.id] = `${prefix}${category.name}`;
        category.layer = layer;
        if (category.children && category.children.length) {
          this.initCategoryIdPathMap(category.children, `${prefix}${category.name}`, layer + 1);
        }
      });
    },
    // bug修复 - 添加多层目录时，【移至】列表中不刷新
    updateCopyCategory() {
      this.copyCategoryTree = Array.concat(this.categoryTree);
      // 移除目录【全部】
      this.copyCategoryTree.splice(0, 1);
    },
    handleAddCategory() {
      this.updateCopyCategory();
    },
    handleDeleteCategory() {
      this.updateCopyCategory();
    },
    handleSelectCategory(categoryId, categoryName) {
      if (this.currentCategoryId === categoryId) {
        return;
      }
      this.currentCategoryId = categoryId;
      this.currentCategoryName = categoryName;
      this.pageIndex = 1;
      this.getWordBankList();
    },
    handleUpdateCurCategoryName(categoryId, categoryName) {
      if (this.currentCategoryId === categoryId) {
        this.currentCategoryName = categoryName;
      }
      this.getWordBankList();
      this.updateCopyCategory();
    },
    handleSelectAllStatus() {
      if (this.wbStatus === undefined) {
        return;
      }
      this.wbStatus = undefined;
      this.getWordBankList();
    },
    handleSelectEnableStatus() {
      if (this.wbStatus === true) {
        return;
      }
      this.wbStatus = true;
      this.getWordBankList();
    },
    handleSelectDisableStatus() {
      if (this.wbStatus === false) {
        return;
      }
      this.wbStatus = false;
      this.getWordBankList();
    },
    handleKeywordSearch(keyType, keyword) {
      this.searchKeyType = keyType;
      this.searchKeyword = keyword;
      this.getWordBankList();
    },
    handlePageChange(pageIndex, pageSize) {
      this.pageIndex = pageIndex;
      this.pageSize = pageSize;
      this.getWordBankList();
    },
  },
};
</script>
<style lang="scss" scoped>
@import 'styles/variable';
.wordbank-wrapper{
  display: flex;
  .filter-list {
    width: 200px;
    min-width: 200px;
    height: 100%;
    overflow: hidden;
    border-radius: 2px;
    display: flex;
    flex-direction: column;
    transition: all 0.5s;
    &.hide-menu{
      width: 0px;
      min-width: 0px;
      margin-left: -20px;
    }
    .category-list{
      height: calc(100% - 217px);
    }
    ::v-deep .status-wrapper{
      width: 100%;
      .el-collapse-item__header{
        border-width: 0px;
        padding-left: 20px;
        height: 40px;
      }
      .el-collapse-item__wrap{
        border-width: 0px;
        .el-collapse-item__content{
          padding: 0px 20px 100px 20px;
        }
      }
      .status{
        display: inline-block;
        box-sizing: border-box;
        width: 64px;
        height: 28px;
        line-height: 26px;
        border: 1px solid $color-borderline;
        border-radius: 2px;
        margin: 0px 10px 10px 0px;
        cursor: pointer;
        color: $color-font-normal;
        text-align: center;
        position: relative;
        .selector-icon{
          position: absolute;
          bottom: -1px;
          right: -1px;
          margin-right: 0px !important;
          @include icon('../../assets/icons/selector.svg', 22px, 19px);
        }
        &.selected{
          border-color: $active-color;
          color: $active-color;
        }
      }
    }
  }
  .wordbank-list {
    flex: 1 0 0;
    margin-left: 10px;
    transition: all 0.5s;
  }
}
.fade-enter-active, .fade-leave-active {
  transition: all .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
  width: 0px;
  // transform: translateX(-300px);
}
</style>
