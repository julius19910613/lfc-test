<template>
  <div class="category-tree-wrapper">
    <sidebar-tree class="sidebar-tree"
    ref="refSideBarTree"
    :title="$t('pages.wordbank.wordbank_list')"
    :addBtnText="$t('wordbank.add_category')"
    :maxLevel="5"
    :showTitle="showTitle" :circleSearch="circleSearch"
    :readonly="readonly" :defaultSelectFirstLine="defaultSelectFirstLine"
    :tooltip="$t('wordbank.category.tooltip')"
    :treeList="categoryList"
    @selectNode="handleSelectNode"
    @addNode="handleAddNode"
    @deleteNode="handleDeleteNode"
    @updateNode="handleUpdateNode"></sidebar-tree>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import SidebarTree from '@/components/SidebarTree';
import api from '../_api/wordbank_v2';

export default {
  api,
  props: {
    showTitle: {
      type: Boolean,
      default: true,
    },
    circleSearch: {
      type: Boolean,
      default: false,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    defaultSelectFirstLine: {
      type: Boolean,
      default: true,
    },
    categoryList: {
      type: Array,
      default() {
        return [];
      },
    },
    categoryPathMap: {
      type: Object,
    },
  },
  computed: {
    ...mapGetters([
      'robotID',
    ]),
  },
  methods: {
    clearSearch() {
      this.$refs.refSideBarTree.clearSearch();
    },
    handleSelectNode(data) {
      this.$emit('selectCategory', data.id, data.name);
    },
    findChildCategories(parentId, categoryList, parentNode) {
      if (categoryList && categoryList.length) {
        for (let i = 0; i < categoryList.length; i += 1) {
          const item = categoryList[i];
          if (item.id === parentId) {
            parentNode.nodes = item.children;
          }
          this.findChildCategories(parentId, item.children, parentNode);
        }
      }
    },
    findSiblingCategories(nodeId, categoryList, siblingNodes) {
      if (categoryList && categoryList.length) {
        for (let i = 0; i < categoryList.length; i += 1) {
          const item = categoryList[i];
          if (item.id === nodeId) {
            const siblings = categoryList.filter(node => node.id !== nodeId);
            siblingNodes.nodes = siblings;
          }
          this.findSiblingCategories(nodeId, item.children, siblingNodes);
        }
      }
    },
    validateCategoryName(data, mode = 'add') {
      // 文件夹不能包含斜杠
      if (data.name.indexOf('/') !== -1 || data.name === '') {
        this.$message({ message: this.$t('wordbank.message.category_invalid'), type: 'warning' });
        return false;
      }
      // 同名文件夹不允许创建
      const validNode = {};
      if (mode === 'add') {
        this.findChildCategories(data.parent_id, this.categoryList, validNode);
      } else if (mode === 'edit') {
        this.findSiblingCategories(data.id, this.categoryList, validNode);
      }
      if (validNode.nodes && validNode.nodes.length) {
        const sameNode = validNode.nodes.filter(item => item.name === data.name);
        if (sameNode.length) {
          this.$message({
            message: this.$t('wordbank.dupliacate_folder').replace('%1', data.name),
            type: 'warning',
          });
          return false;
        }
      }
      return true;
    },
    handleAddNode(data, fnCallBack) {
      const validRes = this.validateCategoryName(data);
      if (!validRes) {
        fnCallBack('fail');
        return;
      }
      this.$api.apiAddCategory(this.robotID, data.parent_id, data.name).then((res) => {
        if (res.status === 0) {
          data.id = res.result.id;
          if (this.categoryPathMap) {
            const parentPath = this.categoryPathMap[data.parent_id];
            if (parentPath) {
              this.categoryPathMap[data.id] = `${parentPath}/${data.name}`;
            }
          }
          this.$emit('addCategory');
          fnCallBack('success', data);
        } else {
          fnCallBack('fail');
        }
      }).catch(() => {
        fnCallBack('error');
      });
    },
    handleUpdateNode(params, fnCallBack) {
      if (!params.id) {
        return;
      }
      if (!this.validateCategoryName(params, 'edit')) {
        fnCallBack('fail');
        return;
      }
      this.$api.apiUpdateCategory(this.robotID, params.id, params.name).then((res) => {
        if (res.status === 0) {
          this.$emit('updateSelCateName', params.id, params.name);
          fnCallBack('success');
        } else {
          fnCallBack('fail');
        }
      }).catch(() => {
        fnCallBack('error');
      });
    },
    handleDeleteNode(params, fnCallBack) {
      this.$api.apiDeleteCategory(this.robotID, params.id).then((res) => {
        if (res.status === 0) {
          if (this.categoryPathMap[params.id]) {
            this.categoryPathMap[params.id] = undefined;
          }
          fnCallBack('success');
          this.$emit('deleteCategory');
        } else {
          fnCallBack('error');
        }
      }).catch(() => {
        fnCallBack('error');
      });
    },
  },
  components: {
    SidebarTree,
  },
};
</script>

<style lang="scss" scoped>
</style>


