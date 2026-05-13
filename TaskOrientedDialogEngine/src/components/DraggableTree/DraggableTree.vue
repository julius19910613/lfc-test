<template>
  <div class="draggable-tree-wrapper">
    <transition-group name="list" tag="ul">
      <div v-for="(item, index) in data" :key="item.id">
        <drag-group v-if="item.nodes || (item.targets && item.targets.length > 1)"
          :data="item" :groupIndex="index"
          :marginTop="10" :marginBottom="index===data.length-1?10:0"
          :draggingObj="draggingObj" :selectObjId="selectObjId"
          @select="handleSelectGroup" @selectNode="handleSelectNode"
          @groupDragStart="onGroupDragStart" @groupDragEnd="onGroupDragEnd"
          @dropOnGroupTop="dropOnGroupTop" @dropOnGroupBottom="dropOnGroupBottom"
          @dropOnGroupContent="dropOnGroupContent"
          @nodeDragStart="onNodeDragStart" @nodeDragEnd="onNodeDragEnd"
          @dropOnNodeTop="dropOnNodeTop" @dropOnNodeBottom="dropOnNodeBottom"
          @dropOnNodeContent="dropOnNodeContent">
        </drag-group>
        <drag-node v-else :data="item"
          :draggingObj="draggingObj"  :selectObjId="selectObjId"
          :nodeIndex="index" :groupIndex="-1"
          @select="handleSelectNode"
          @nodeDragStart="onNodeDragStart" @nodeDragEnd="onNodeDragEnd"
          @dropOnNodeTop="dropOnNodeTop" @dropOnNodeBottom="dropOnNodeBottom"
          @dropOnNodeContent="dropOnNodeContent"
          :canDrag="index!==0" :marginBottom="index===data.length-1?10:0">
        </drag-node>
      </div>
    </transition-group>
    <div class="add-node-wrapper">
      <div class="add-node-btn" v-if="!addingNode" @click="handleCreateNode">
        +新增BOT问
      </div>
      <div class="input-node-box" v-else>
        <el-input v-model="newNodeName" size="small" ref="refNodeInput"
        @keyup.enter.native="confirmCreateNode"></el-input>
        <span class="confirm-btn" @click="confirmCreateNode">确定</span>
        <span class="cancel-btn" @click="clearCreateNode">取消</span>
      </div>
    </div>
  </div>
</template>

<script>
import DragNode from './DragNode';
import DragGroup from './DragGroup';

export default {
  props: {
    data: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  components: {
    DragNode,
    DragGroup,
  },
  data() {
    return {
      draggingObj: {},
      selectObjId: '',
      addingNode: false,
      newNodeName: '',
    };
  },
  watch: {
    data() {
      // this.selectNodeByIndex(0);
    },
  },
  methods: {
    selectNodeByIndex(index) {
      if (this.data.length <= index) {
        return;
      }
      this.timer = window.setTimeout(() => {
        this.handleSelectNode(this.data[index]);
        window.clearTimeout(this.timer);
        this.timer = undefined;
      }, 200);
    },
    clearCreateNode() {
      this.addingNode = false;
      this.newNodeName = '';
    },
    handleCreateNode() {
      this.addingNode = true;
      this.$nextTick(() => {
        this.$refs.refNodeInput.focus();
      });
    },
    confirmCreateNode() {
      this.$emit('add', this.newNodeName);
      this.clearCreateNode();
    },
    handleSelectGroup(data) {
      this.selectObjId = data.id;
      this.$emit('select', data);
    },
    handleSelectNode(data) {
      this.selectObjId = data.id;
      this.$emit('select', data);
    },
    // 组的拖拽
    onGroupDragStart(obj) {
      this.draggingObj = obj;
    },
    onGroupDragEnd() {
      this.draggingObj = null;
    },
    dropOnGroupTop(obj) {
      this.reOrderTwoObjects(this.draggingObj, obj, true);
    },
    dropOnGroupBottom(obj) {
      this.reOrderTwoObjects(this.draggingObj, obj, false);
    },
    dropOnGroupContent(obj) {
      const topObj = this.draggingObj;
      const bottomGroup = obj;
      // 拖拽中的是组 或 拖拽结点已在本组，则无效 - 只能其他组的或者一级结点拖到组内
      if (topObj.nodeIndex === -1 || topObj.groupIndex === bottomGroup.groupIndex) {
        return;
      }
      let topObjArr = this.data;
      if (topObj.groupIndex >= 0 && topObj.groupIndex < this.data.length) {
        if (this.data[topObj.groupIndex].nodes) {
          topObjArr = this.data[topObj.groupIndex].nodes;
        } else {
          topObjArr = this.data[topObj.groupIndex].targets;
        }
      }
      topObjArr.splice(topObj.nodeIndex, 1);
      if (bottomGroup.data.nodes) {
        bottomGroup.data.nodes.push(topObj.data);
      } else {
        bottomGroup.data.targets.push(topObj.data);
      }
      this.removeEmptyGroup();
      this.$emit('drag');
    },
    // 单结点的拖拽
    onNodeDragStart(obj) {
      this.draggingObj = obj;
    },
    onNodeDragEnd() {
      this.draggingObj = null;
    },
    dropOnNodeTop(obj) {
      this.reOrderTwoObjects(this.draggingObj, obj, true);
    },
    dropOnNodeBottom(obj) {
      this.reOrderTwoObjects(this.draggingObj, obj, false);
    },
    dropOnNodeContent(node) {
      // 允许拖拽到结点上的情况： 1. 一级结点与一级结点合并 2. 二级结点与一级结点合并 = 结果都是合并成新的组
      const topObj = this.draggingObj;
      const bottomNode = node;
      if (bottomNode.groupIndex !== -1 || topObj.nodeIndex === -1
      || topObj.data.id === bottomNode.data.id) {
        return;
      }
      let topObjArr = this.data;
      if (topObj.groupIndex >= 0 && topObj.groupIndex < this.data.length) {
        if (this.data[topObj.groupIndex].nodes) {
          topObjArr = this.data[topObj.groupIndex].nodes;
        } else {
          topObjArr = this.data[topObj.groupIndex].targets;
        }
      }
      // 判断新增节组是confirm类型还是节点类型
      let type;
      if (topObj.data && topObj.data.type) {
        type = topObj.data.type;
      }
      const bottomArr = this.data;
      const newGroup = {
        id: `group-${Math.random()}`,
        title: '',
        type,
      };
      if (type === 'confirm') {
        newGroup.targets = [topObj.data, bottomNode.data];
      } else {
        newGroup.nodes = [topObj.data, bottomNode.data];
      }
      // 删除顺序会影响新增结点index - 先删除后面的，再删除前面的
      let gap = 0;
      if (topObj.groupIndex === bottomNode.groupIndex && topObj.nodeIndex < bottomNode.nodeIndex) {
        gap = 1;
      }
      topObjArr.splice(topObj.nodeIndex, 1);
      bottomArr.splice(bottomNode.nodeIndex - gap, 1, newGroup);
      this.removeEmptyGroup();
      this.$emit('drag');
    },
    reOrderTwoObjects(topObj, bottomObj, beforeFlag) {
      // 决定之后插入topObj的index
      let bottomArr = this.data;
      if (bottomObj.nodeIndex !== -1
      && bottomObj.groupIndex >= 0 && bottomObj.groupIndex < this.data.length) {
        if (this.data[bottomObj.groupIndex].nodes) {
          bottomArr = this.data[bottomObj.groupIndex].nodes;
        } else {
          bottomArr = this.data[bottomObj.groupIndex].targets;
        }
      }
      let gap = beforeFlag ? 0 : -1;
      // 两个同组结点
      if (topObj.groupIndex === bottomObj.groupIndex && topObj.nodeIndex < bottomObj.nodeIndex
      && topObj.nodeIndex !== -1 && bottomObj.nodeIndex !== -1) {
        gap += 1;
      } else if ((topObj.groupIndex === -1 || topObj.nodeIndex === -1)
      && (bottomObj.groupIndex === -1 || bottomObj.nodeIndex === -1)) {
        // 一级组 或 一级结点
        const topIndex = topObj.nodeIndex === -1 ? topObj.groupIndex : topObj.nodeIndex;
        const bottomIndex = bottomObj.nodeIndex === -1 ? bottomObj.groupIndex : bottomObj.nodeIndex;
        if (topIndex < bottomIndex) {
          gap += 1;
        }
      }
      // 将topObj从原本的数组中删除 - 可能是group或者一级结点或者二级结点
      // 将删除的结点插入到新的数组中
      let topArr = this.data;
      if (topObj.nodeIndex !== -1
      && topObj.groupIndex >= 0 && topObj.groupIndex < this.data.length) {
        if (this.data[topObj.groupIndex].nodes) {
          topArr = this.data[topObj.groupIndex].nodes;
        } else {
          topArr = this.data[topObj.groupIndex].targets;
          // 确认节点从节点组当中拖拽出来时
          // if (!topObj.data.targets) {
          //   const target = topObj.data;
          //   topObj.data = {
          //     id: Math.random().toString(),
          //     title: target.title,
          //     targets: [target],
          //     type: 'confirm',
          //   }
          // }
        }
      }
      if (topObj.nodeIndex === -1) {
        topArr.splice(topObj.groupIndex, 1);
      } else {
        topArr.splice(topObj.nodeIndex, 1);
      }
      if (bottomObj.nodeIndex === -1) {
        bottomArr.splice(bottomObj.groupIndex - gap, 0, topObj.data);
      } else {
        bottomArr.splice(bottomObj.nodeIndex - gap, 0, topObj.data);
      }
      this.removeEmptyGroup();
      this.$emit('drag');
    },
    removeEmptyGroup() {
      for (let i = 0; i < this.data.length; i += 1) {
        const element = this.data[i];
        if (element.nodes && element.nodes.length === 1) {
          // this.data.splice(i, 1);
          // i -= 1;
          this.data[i] = this.data[i].nodes[0];
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.draggable-tree-wrapper{
  .add-node-wrapper{
    .add-node-btn{
      display: flex;
      align-items: center;
      height: 34px;
      padding-left: 15px;
      border-radius: 2px;
      background-color: #FFFFFF;
      border: 1px dashed #DBDBDB;
      color: #666666;
      cursor: pointer;
      &:hover{
        color: #1875F0;
        border-color: #B1CCFF;
      }
    }
    .input-node-box{
      position: relative;
      /deep/ .el-input{
        height: 32px;
        input{
          height: 32px;
          padding-right: 70px;
        }
      }
      .confirm-btn, .cancel-btn{
        color: #1875F0;
        font-size: 12px;
        position: absolute;
        top: 11px;
        right: 10px;
        cursor: pointer;
      }
      .cancel-btn {
        right: 40px;
      }
    }
  }
}
.list-enter-active {
  transition: all 0.5s;
}
.list-leave-active {
  transition: all 0.2s;
}
.list-enter
/* .list-leave-active for below version 2.1.8 */ {
  opacity: 0;
  transform: translateX(-5px);
}

.list-leave-to{
  opacity: 0;
  transform: translateX(-5px);
  // transform: scale(0.7, 0.7);
}
.list-move {
  transition: transform 0.3s;
}
</style>

