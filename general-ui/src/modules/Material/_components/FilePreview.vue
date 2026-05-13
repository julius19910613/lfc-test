<template>
    <div class="preview">
      <el-dialog
        class="emotibot dialog-wraning"
        :visible.sync="previewStatus"
        width="30%"
        :before-close="handleCancel">
        <div class="tips-content">
          <img :src="fileUrl" class="preview-img">
        </div>
      </el-dialog>
    </div>
</template>

<script>
export default {
  props: {
    fileUrl: {
      type: String,
      default: '',
    },
    previewStatus: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {};
  },
  methods: {
    handleCancel() {
      this.$emit('closePreview');
    },
  },
};
</script>

<style lang="scss" scoped>
  /deep/ .el-dialog__headerbtn{
    top: 10px;
    right: 10px;
  }
  /deep/ .el-dialog__body{
    padding: 0 20px 20px;
  }
  .preview-img{
    width: 100%;
    height: auto;
    max-height: 400px;
  }
</style>
