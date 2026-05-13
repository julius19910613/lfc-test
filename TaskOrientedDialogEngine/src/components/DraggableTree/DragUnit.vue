<template>
  <div class="drag-unit-wrapper">
    <div class="top-wrapper">
      <div class="drag-over-box" :style="{'height': marginTop+'px'}"
        @dragover.stop="handleDragOverTop($event)"
        @dragleave.stop="handleDragLeaveTop($event)"
        @drop.stop="handleDropOnTop">
      </div>
      <div class="line" v-show="hoverOnTop" :style="{'height': lineHeight+'px'}">
        <div class="circle circle-left"></div>
        <div class="circle circle-right"></div>
      </div>
    </div>
    <div class="content-wrapper" :class="{'hover-class':hoverOnContent}"
      :draggable="canDrag"
      @dragstart.stop="onDragStart" @drop.stop="handleDropOnContent"
      @dragover.stop="handleDragOverContent($event)"
      @dragleave.stop="handleDragLeaveContent($event)">
      <slot></slot>
    </div>
    <div class="bottom-wrapper">
      <div class="drag-over-box" :style="{'height': marginBottom+'px'}"
        @dragover.stop="handleDragOverBottom($event)"
        @dragleave.stop="handleDragLeaveBottom($event)"
        @drop.stop="handleDropOnBottom">
      </div>
      <div class="line" v-show="hoverOnBottom" :style="{'height': lineHeight+'px'}">
        <div class="circle circle-left"></div>
        <div class="circle circle-right"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    // Unit能不能拖拽
    canDrag: {
      type: Boolean,
      default: true,
    },
    canDrop: {
      type: Boolean,
      default: true,
    },
    canDropOnLine: {
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
      default: 1,
    },
  },
  data() {
    return {
      hoverOnTop: false,
      hoverOnBottom: false,
      hoverOnContent: false,
    };
  },
  methods: {
    onDragStart(ev) {
      this.isDragging = true;
      ev.dataTransfer.setData('Text', ev.target.id);
      this.$emit('dragStart');
    },
    onDragEnd(ev) {
      this.isDragging = false;
      ev.dataTransfer.setData('Text', '');
      this.$emit('dragEnd');
    },
    handleDropOnTop() {
      if (!this.canDrag || !this.canDropOnLine) {
        return;
      }
      this.$emit('dropOnTop');
      this.hoverOnContent = false;
      this.hoverOnTop = false;
      this.hoverOnBottom = false;
    },
    handleDropOnBottom() {
      if (!this.canDrag || !this.canDropOnLine) {
        return;
      }
      this.$emit('dropOnBottom');
      this.hoverOnContent = false;
      this.hoverOnTop = false;
      this.hoverOnBottom = false;
    },
    handleDropOnContent() {
      if (!this.canDrag || !this.canDrop) {
        return;
      }
      this.$emit('dropOnContent');
      this.hoverOnContent = false;
      this.hoverOnTop = false;
      this.hoverOnBottom = false;
    },
    handleDragOverContent(ev) {
      ev.preventDefault();
      if (!this.canDrag || !this.canDrop) {
        return;
      }
      this.hoverOnContent = true;
    },
    handleDragLeaveContent(ev) {
      ev.preventDefault();
      if (!this.canDrag || !this.canDropOnLine) {
        return;
      }
      this.hoverOnContent = false;
    },
    handleDragOverTop(ev) {
      ev.preventDefault();
      if (!this.canDrag || !this.canDropOnLine) {
        return;
      }
      this.hoverOnTop = true;
    },
    handleDragLeaveTop(ev) {
      ev.preventDefault();
      if (!this.canDrag || !this.canDropOnLine) {
        return;
      }
      this.hoverOnTop = false;
    },
    handleDragOverBottom(ev) {
      ev.preventDefault();
      if (!this.canDrag || !this.canDropOnLine) {
        return;
      }
      this.hoverOnBottom = true;
    },
    handleDragLeaveBottom(ev) {
      ev.preventDefault();
      if (!this.canDrag || !this.canDropOnLine) {
        return;
      }
      this.hoverOnBottom = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.drag-unit-wrapper {
  width: 100%;
  .content-wrapper {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    border-radius: 2px;
    // border: 1px solid transparent;
    &.hover-class{
      // border: 1px solid red;
      box-shadow:0px 5px 10px 0px rgba(0,0,0,0.15);
    }
  }
  .top-wrapper, .bottom-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    .drag-over-box {
      width: 100%;
      z-index: 10;
      background: transparent;
    }
    .line{
      position: absolute;
      width: 100%;
      background: #3D80FF;
      .circle{
        display: inline-block;
        width: 4px;
        height: 4px;
        border-radius: 50px;
        border: 2px solid #3D80FF;
      }
      .circle-left{
        position: absolute;
        top: -3px;
        left: -8px;
      }
      .circle-right{
        position: absolute;
        top: -3px;
        right: -8px;
      }
    }
  }
}
</style>
