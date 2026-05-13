<template>
  <drag-unit class="drag-node-wrapper"
    @dragStart="onDragStart" @dragEnd="onDragEnd"
    :marginTop="marginTop" :marginBottom="marginBottom"
    :canDrag="canDrag" :canDrop="canDrop" :canDropOnLine="canDropOnLine"
    @dropOnTop="dropOnNodeTop" @dropOnBottom="dropOnNodeBottom" @dropOnContent="dropOnNodeContent"
    :lineHeight="lineHeight">
    <div class="node-wrapper"
    @click.stop.prevent="handleSelectNode"
    :class="{'in-group-node': inGroup,
    'normal-node': !inGroup, 'selected': isSelected,
    'is-confirm-node': data.type === 'confirm'}">
      <img v-if="canDrag && !isSelected" src="../../assets/images/drag.png"/>
      <img v-else-if="canDrag && isSelected" src="../../assets/images/drag_selected.png"/>
      <span :class="{'margin-left-5': !canDrag}">{{data.title}}</span>
    </div>
  </drag-unit>
</template>

<script>
import DragUnit from './DragUnit';

export default {
  props: {
    data: {
      type: Object,
      default() {
        return { id: Math.random(), name: '是否本人' };
      },
    },
    groupIndex: {
      type: Number,
      default: -1,
    },
    nodeIndex: {
      type: Number,
    },
    draggingObj: {
      type: Object,
      default() {
        return {};
      },
    },
    selectObjId: {
      type: String,
    },
    canDrag: {
      type: Boolean,
      default: true,
    },
    lineHeight: {
      type: Number,
      default: 2,
    },
    marginTop: {
      type: Number,
      default: 10,
    },
    marginBottom: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    inGroup() {
      return this.groupIndex && this.groupIndex !== -1;
    },
    isSelected() {
      return this.selectObjId === this.data.id;
    },
    // 判断拖拽中结点能否放到该结点上
    canDrop() {
      let canDrop = true;
      const topObj = this.draggingObj || {};
      const bottomNode = this.emitData;
      if (topObj.data && topObj.data.id === bottomNode.data.id) {
        // 1. 结点本身
        canDrop = false;
      } else if (bottomNode.groupIndex !== -1) {
        // 2. 结点是二级结点，拖拽到二级结点上无效果
        canDrop = false;
      } else if (topObj.nodeIndex === -1) {
        // 3. 把组拖拽到结点上无效果
        canDrop = false;
      } else if (topObj.data && bottomNode.data
      && topObj.data.type !== bottomNode.data.type) {
        // 4. 不同类型节点不允许拖拽
        canDrop = false;
      }
      return canDrop;
    },
    // 判断拖拽中结点能否放到该结点上
    canDropOnLine() {
      let canDrop = true;
      const topObj = this.draggingObj || {};
      const bottomNode = this.emitData;
      // if (topObj.data && topObj.data.id === bottomNode.data.id) {
      //   // 1. 结点本身
      //   canDrop = false;
      // } else
      if (topObj.nodeIndex === -1 && bottomNode.groupIndex !== -1) {
        // 2. 组不能拖拽到与二级结点并列
        canDrop = false;
      } else if (bottomNode.groupIndex !== -1 && bottomNode.data && topObj.data
      && bottomNode.data.type !== topObj.data.type) {
        // 3. 无法将一个节点拖拽到一个不同类型的组内
        canDrop = false;
      }
      return canDrop;
    },
    emitData() {
      return {
        data: this.data,
        groupIndex: this.groupIndex,
        nodeIndex: this.nodeIndex,
      };
    },
  },
  methods: {
    handleSelectNode() {
      this.$emit('select', this.data);
    },
    onDragStart() {
      this.$emit('nodeDragStart', this.emitData);
    },
    onDragEnd() {
      this.$emit('nodeDragEnd', this.emitData);
    },
    dropOnNodeTop() {
      console.log('dropOnNodeTop');
      this.$emit('dropOnNodeTop', this.emitData);
    },
    dropOnNodeBottom() {
      this.$emit('dropOnNodeBottom', this.emitData);
    },
    dropOnNodeContent() {
      this.$emit('dropOnNodeContent', this.emitData);
    },
  },
  components: {
    DragUnit,
  },
};
</script>

<style lang="scss" scoped>
.drag-node-wrapper{
  width: 100%;
  .node-wrapper{
    cursor: pointer;
    width: 100%;
    display: flex;
    align-items: center;
    border-radius:2px;
    &.is-confirm-node{
      border-radius: 10px;
    }
    &.normal-node {
      height: 34px;
      padding: 0px 10px;
      background-color: #E7ECF0;
      border: 1px solid #E7ECF0;
      img{
        margin-right: 10px;
      }
      span{
        font-size: 14px;
        color: #6B8093;
      }
    }
    &.in-group-node {
      height: 30px;
      padding: 0px 8px;
      background-color: #FFFFFF;
      border: 1px solid #FFFFFF;
      img{
        margin-right: 6px;
      }
      span{
        font-size: 12px;
        color: #6B8093;
      }
    }
    &:hover{
      border-color: #B1CCFF;
    }
    &.selected{
      background-color: #3D80FF;
      border-color: #3D80FF;
      span{
        color: #FFFFFF;
      }
    }
  }
  .margin-left-5{
    margin-left: 5px;
  }
}
</style>

