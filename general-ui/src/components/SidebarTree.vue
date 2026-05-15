<template>
  <div class="tree-wrap">
    <p class="title" v-if="showTitle">
      {{title}}
      <el-tooltip v-if="tooltip" effect="dark" placement="top-start">
        <p slot="content" v-html="tooltip" style="width: 330px;line-height:18px;"></p>
        <i class="el-icon-info"></i>
      </el-tooltip>
    </p>
    <div class="mertial-search-input">
      <el-input size="mini"
        class="emotibot" :class="{'circle-input': circleSearch}"
        v-model.trim="searchKey" 
        :placeholder="$t('material_library.tips.search_key')"
        suffix-icon="el-icon-search">
      </el-input>
    </div>
    <el-tree
      ref="materialTree"
      class="material-tree"
      accordion
      node-key="id"
      :expand-on-click-node="false"
      :indent="7"
      :data="treeList"
      :filter-node-method="filterNode"
      @node-click="handleNodeClick">
        <span class="custom-tree-node" slot-scope="{node, data}">
          <span :title="data.name">{{ data.name }}</span>
          <!-- 操作列表 -->
          <el-button v-if="!data.readonly&&!readonly"
            type="text"
            size="mini"
            @click="() => append(data)">
            <i class="edit-tree-node" @click="showEditIcon(node, data)">...</i>
            <div class="op-list" v-show="data.isOperating" @mouseleave="handleMouseLeave(data)">
              <span @click="addChildNode(node, data)" v-show="data.layer < maxLevel">{{ addBtnText }}</span>
              <span @click="editChildNode(node, data)" v-show="data.layer !== 1">{{ editBtnText }}</span>
              <span @click="handleDeleteNode(node, data)" v-show="data.layer !== 1">{{ deleteBtnText }}</span>
            </div>
          </el-button>
          <!-- 新增 -->
          <el-input size="mini"
            :ref="`add${data.id}`"
            class="emotibot add-new-child-node"
            v-show="data.isAddChild"
            v-model.trim="newChildNode"
            maxlength="20"
            @keyup.enter.stop.native="$event.target.blur"
            @blur="handleAddNode(node, data)"
            :placeholder="$t('material_library.tips.entering')">
          </el-input>
          <!-- 编辑 -->
          <el-input size="mini"
            :ref="`edit${data.id}`"
            class="emotibot edit-child-node"
            v-show="data.isEditing"
            v-model.trim="data.name"
            maxlength="20"
            @keyup.enter.stop.native="$event.target.blur"
            @blur="handleEditNode(node, data)"
            :placeholder="$t('material_library.tips.entering')">
          </el-input>
        </span>
    </el-tree>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchKey: '',
      // treeList: [],
      currentOp: {},
      newChildNode: '',
      placeNode: {}, // 新增节点占位节点
      currentEditLabel: '',
      focusStatus: true,
      parentData: {},
    };
  },
  props: {
    // 标题
    title: {
      type: String,
      default() {
        return this.$t('material_library.classify');
      },
    },
    addBtnText: {
      type: String,
      default() {
        return this.$t('material_library.btn_add_children');
      },
    },
    editBtnText: {
      type: String,
      default() {
        return this.$t('material_library.btn_edit');
      },
    },
    deleteBtnText: {
      type: String,
      default() {
        return this.$t('material_library.btn_delete');
      },
    },
    // 是否显示标题区域
    showTitle: {
      type: Boolean,
      default: true,
    },
    // 搜索框样式
    circleSearch: {
      type: Boolean,
      default: false,
    },
    // 是否默认选中第一行
    defaultSelectFirstLine: {
      type: Boolean,
      default: false,
    },
    tooltip: {
      type: String,
      default: '',
    },
    maxLevel: {
      type: Number,
      default: 4,
    },
    treeList: {
      type: Array,
      default() {
        return [];
      },
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    canEdit: {
      type: Boolean,
      default: false,
    },
    canDelete: {
      type: Boolean,
      default: false,
    },
  },
  mounted() {
    if (this.defaultSelectFirstLine) {
      this.selectFirstNode();
    }
  },
  watch: {
    treeList() {
      if (this.defaultSelectFirstLine) {
        this.selectFirstNode();
      }
    },
    searchKey(val) {
      this.$refs.materialTree.filter(val);
    },
  },
  methods: {
    clearSearch() {
      this.searchKey = '';
    },
    selectFirstNode() {
      window.setTimeout(() => {
        if (this.treeList && this.treeList.length > 0) {
          this.$refs.materialTree.setCurrentNode(this.treeList[0]);
          this.$emit('selectNode', this.treeList[0], this.treeList);
        }
      }, 50);
    },
    handleNodeClick(data) {
      this.$emit('initSort');
      this.$emit('selectNode', data, this.treeList);
    },
    // 节点过滤
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    append() {},
    showEditIcon(node, data) {
      if (this.currentOp.data) {
        this.$set(this.currentOp.data, 'isOperating', false);
      }
      this.currentOp.data = data;
      this.currentOp.node = node;
      this.$set(data, 'isOperating', true);
    },
    // 新增子类
    addChildNode(node, data) {
      this.placeNode = {
        id: 0,
        name: '',
      };
      if (!data.children) {
        this.$set(data, 'children', []);
      }
      data.children.push(this.placeNode);
      this.$refs.materialTree.store.nodesMap[data.id].expanded = true;
      this.$set(data, 'isAddChild', true);
      this.$set(data, 'isOperating', false);
      const refs = `add${data.id}`;
      setTimeout(() => {
        this.$refs[refs].focus();
      }, 10);
    },
    handleAddNode(node, data) {
      if (this.newChildNode === '') {
        this.$set(data, 'isAddChild', false);
        // 失去焦点时，删除占位节点
        this.$refs.materialTree.remove(this.placeNode);
        return;
      }
      const layer = data.layer + 1;
      const newChildNode = {
        parent_id: data.id,
        name: this.newChildNode,
        layer,
      };
      this.$emit('addNode', newChildNode, (status, result) => {
        if (status === 'success') {
          this.$message.success(this.$t('material_library.tips.add_node_success'));
          this.$refs.materialTree.remove(this.placeNode);
          this.$set(data, 'isAddChild', false);
          this.newChildNode = '';
          if (result) {
            data.children.push(result);
          }
        } else if (status === 'error') {
          this.$message.error(this.$t('material_library.tips.add_node_error'));
        }
      });
    },
    handleMouseLeave(data) {
      this.$set(data, 'isOperating', false);
    },
    handleEditNode(node, data) {
      // 没有改动，或改为空，取消本次操作
      if (data.name === this.currentEditLabel || data.name === '') {
        this.$set(data, 'name', JSON.parse(JSON.stringify(this.currentEditLabel)));
        this.$set(data, 'isEditing', false);
        return;
      }
      const parmas = {
        name: data.name,
        id: data.id,
      };
      this.$emit('updateNode', parmas, (status) => {
        if (status === 'success') {
          this.$message.success(this.$t('material_library.tips.edit_node_success'));
        } else if (status === 'fail') {
          this.$set(data, 'name', this.currentEditLabel);
        } else if (status === 'error') {
          this.$message.error(this.$t('material_library.tips.edit_node_error'));
        }
        this.$set(data, 'isEditing', false);
      });
    },
    editChildNode(node, data) {
      this.$set(data, 'isOperating', false);
      this.$set(data, 'isEditing', true);
      this.currentEditLabel = data.name;
      const refs = `edit${data.id}`;
      setTimeout(() => {
        this.$refs[refs].focus();
      }, 10);
    },
    handleDeleteNode(node, data) {
      if (node.level === 4) {
        this.parentData = node.parent.parent.parent.data;
      } else if (node.level === 3) {
        this.parentData = node.parent.parent.data;
      } else {
        this.parentData = node.parent.data;
      }
      const params = {
        id: data.id,
      };
      this.$emit('deleteNode', params, (status) => {
        if (status === 'success') {
          this.$refs.materialTree.remove(data);
          this.$message.success(this.$t('material_library.tips.delete_success'));
          this.$refs.materialTree.setCurrentNode(this.parentData);
          this.$emit('initSort');
          this.$emit('selectNode', this.parentData, this.treeList);
        } else if (status === 'error') {
          this.$message.error(this.$t('material_library.tips.delete_error'));
        }
        this.$set(data, 'isOperating', false);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.title{
  font-size:14px;
  height: 44px;
  line-height: 44px;
  padding-left: 20px;
  box-sizing: border-box;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  .tooltip{
    background: yellow;
  }
  .el-icon-info{
    &:hover{
      color: #1875F0;
    }
  }
}
.mertial-search-input{
  padding: 0 0 10px 10px;
  box-sizing: border-box;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  box-shadow:inset 0px -1px 0px 0px rgba(238,238,238,1);
  margin-bottom: 14px;
  ::v-deep input{
    // width: 180px;
    width: calc(100% - 10px);
  }
  ::v-deep .el-input__suffix{
    right: 10px;
  }
  ::v-deep .el-input__icon{
    font-size: 16px;
  }
  ::v-deep .circle-input{
    input{
      border-radius: 50px;
    }
    .el-input__icon{
      font-size: 12px;
    }
  }
}
.tree-wrap{
  // width: 200px;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
::v-deep .el-tree-node>.el-tree-node__children{
  overflow: visible;
}

.material-tree{
  overflow-y: auto;
  ::v-deep .el-tree-node{
    &:focus{
      >.el-tree-node__content{
        background-color: #ffffff;
      }
    }
  }
  flex: 1;
  ::v-deep .el-tree-node{
    position: relative;
    &.is-current{
      >.el-tree-node__content{
        background-color: #f5f7fa;
      }
    }
  }
}
.edit-tree-node{
  position: absolute;
  width: 18px;
  height: 18px;
  background: #fff;
  vertical-align: text-top;
  border-radius: 50%;
  right: 10px;
  top: 7px;
  display: none;
}
.op-list{
  position: absolute;
  top: 30px;
  // right: -79px;
  right: 4px;
  display: flex;
  flex-direction: column;
  width: 120px;
  box-shadow:0px 2px 8px 0px rgba(0,0,0,0.2);
  background-color: #ffffff;
  border-radius:2px;
  z-index: 1000;
  background: #fff;
  span{
    height: 32px;
    width: 100%;
    color: #666666;
    font-size: 12px;
    line-height: 32px;
    text-align: left;
    padding-left: 15px;
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    font-weight: normal;
    &:hover{
      background:rgba(244,244,244,1);
    }
  }
}
.add-new-child-node{
  position: absolute;
  bottom: -2px;
  left: 10px;
  z-index: 20;
  width: calc(100% - 10px);
  background: #ffffff;
  ::v-deep input{
    height: 26px;
    width: calc(100% - 10px);
  }
}
.edit-child-node{
  width: calc(100% - 10px);
  background: #ffffff;
  position: absolute;
  left: 10px;
  top: 0;
  ::v-deep input{
    height: 26px;
    width: calc(100% - 20px);
  }
}
</style>

