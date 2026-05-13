<template>
  <drag-unit @dragStart="onGroupDragStart" @dragEnd="onGroupDragEnd"
  @dropOnTop="dropOnGroupTop" @dropOnBottom="dropOnGroupBottom" @dropOnContent="dropOnGroupContent"
  :marginTop="marginTop" :marginBottom="marginBottom"
  :canDrag="canDrag" :canDrop="canDrop" :canDropOnLine="canDropOnLine"
  :lineHeight="lineHeight">
    <div class="drag-group-wrapper"
    :class="{'selected': isSelected, 'is-confirm': data.type === 'confirm'}"
    @click="handleSelectGroup">
      <img v-if="canDrag && !isSelected" src="../../assets/images/drag.png"/>
      <img v-else-if="canDrag && isSelected" src="../../assets/images/drag_selected.png"/>
      <div class="nodes-box" v-if="data.nodes && data.nodes.length > 0">
        <transition-group name="node-list" tag="ul">
           <drag-node v-for="(item, index) in data.nodes" :key="item.id" :data="item"
            :marginTop="index===0?10:8" :marginBottom="index===data.nodes.length-1?10:0"
            :groupIndex="groupIndex" :nodeIndex="index"
            :draggingObj="draggingObj" :selectObjId="selectObjId"
            @select="handleSelectNode"
            @nodeDragStart="onNodeDragStart" @nodeDragEnd="onNodeDragEnd"
            @dropOnNodeTop="dropOnNodeTop" @dropOnNodeBottom="dropOnNodeBottom"
            @dropOnNodeContent="dropOnNodeContent">
            </drag-node>
        </transition-group>
      </div>
      <div class="nodes-box" v-else-if="data.targets && data.targets.length > 1">
        <transition-group name="node-list" tag="ul">
           <drag-node v-for="(item, index) in data.targets" :key="item.id" :data="item"
            :marginTop="index===0?10:8" :marginBottom="index===data.targets.length-1?10:0"
            :groupIndex="groupIndex" :nodeIndex="index"
            :draggingObj="draggingObj" :selectObjId="selectObjId"
            @select="handleSelectGroup"
            @nodeDragStart="onNodeDragStart" @nodeDragEnd="onNodeDragEnd"
            @dropOnNodeTop="dropOnNodeTop" @dropOnNodeBottom="dropOnNodeBottom"
            @dropOnNodeContent="dropOnNodeContent">
            </drag-node>
        </transition-group>
      </div>
    </div>
  </drag-unit>
</template>

<script>
import DragUnit from './DragUnit';
import DragNode from './DragNode';

export default {
  props: {
    data: {
      type: Object,
    },
    groupIndex: {
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
    marginTop: {
      type: Number,
      default: 10,
    },
    marginBottom: {
      type: Number,
      default: 0,
    },
    lineHeight: {
      type: Number,
      default: 2,
    },
  },
  components: {
    DragNode,
    DragUnit,
  },
  computed: {
    isSelected() {
      return this.selectObjId === this.data.id;
    },
    // 判断拖拽中结点能否放到该结点上
    canDrop() {
      let canDrop = true;
      const topObj = this.draggingObj || {};
      const bottomGroup = this.emitData;
      if (topObj.data && topObj.data.id === bottomGroup.data.id) {
        // 1. 组本身，拖拽无意义
        canDrop = false;
      } else if (topObj.nodeIndex === -1) {
        // 2. 其他组不能拖拽到组内，组与组不能嵌套
        canDrop = false;
      } else if (topObj.groupIndex === bottomGroup.groupIndex && topObj.nodeIndex !== -1) {
        // 3. 已经在本组内的结点
        canDrop = false;
      } else if (topObj.data && bottomGroup.data
      && topObj.data.type !== bottomGroup.data.type) {
        // 4. 组类型和节点类型不
        canDrop = false;
      }
      return canDrop;
    },
    // 判断拖拽中结点能否放到该结点上
    canDropOnLine() {
      const canDrop = true;
      // const topObj = this.draggingObj || {};
      // const bottomGroup = this.emitData;
      // if (topObj.data && topObj.data.id === bottomGroup.data.id) {
      //   // 1. 组本身，不允许拖拽
      //   canDrop = false;
      // }
      return canDrop;
    },
    emitData() {
      return {
        data: this.data,
        groupIndex: this.groupIndex,
        nodeIndex: -1,
      };
    },
  },
  methods: {
    handleSelectGroup() {
      this.$emit('select', this.data);
    },
    onGroupDragStart() {
      this.$emit('groupDragStart', this.emitData);
    },
    onGroupDragEnd() {
      this.$emit('groupDragEnd', this.emitData);
    },
    dropOnGroupTop() {
      this.$emit('dropOnGroupTop', this.emitData);
    },
    dropOnGroupBottom() {
      this.$emit('dropOnGroupBottom', this.emitData);
    },
    dropOnGroupContent() {
      this.$emit('dropOnGroupContent', this.emitData);
    },
    handleSelectNode(data) {
      this.$emit('selectNode', data);
    },
    onNodeDragStart(obj) {
      this.$emit('nodeDragStart', obj);
    },
    onNodeDragEnd(obj) {
      this.$emit('nodeDragEnd', obj);
    },
    dropOnNodeTop(obj) {
      this.$emit('dropOnNodeTop', obj);
    },
    dropOnNodeBottom(obj) {
      this.$emit('dropOnNodeBottom', obj);
    },
    dropOnNodeContent(obj) {
      this.$emit('dropOnNodeContent', obj);
    },
  },
};
</script>

<style lang="scss" scoped>
.drag-group-wrapper{
  width: 100%;
  background-color: #E7ECF0;
  border: 1px solid #E7ECF0;
  padding: 0px 10px;
  border-radius: 2px;
  display: flex;
  align-items: center;
  cursor: pointer;
  img {
    margin-right: 10px;
  }
  .nodes-box{
    flex: 1;
  }
  &.selected{
    background-color: #3D80FF;
    border-color: #3D80FF;
  }
  &.is-confirm{
    border-radius: 10px;
  }
}
.node-list-move {
  transition: transform 0.3s;
}
</style>
