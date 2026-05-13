<template>
  <div class="upload-file">
    <el-upload
      class="upload-demo"
      action="string"
      :multiple="false"
      :show-file-list="false"
      :http-request="uploadFile"
      :before-upload="handleBeforeUpload"
      :file-list="fileList">
      <text-button :class="{'primary': primary}">{{btnTxt}}</text-button>
    </el-upload>
    
  </div>
</template>

<script>
import TextButton from '@/components/basic/TextButton';

export default {
  props: {
    fileType: {
      type: String,
      default: '',
    },
    btnTxt: {
      type: String,
      default: '',
    },
    primary: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      fileList: [],
      countByte: 1024,
      audioDuration: 0,
    };
  },
  components: {
    TextButton,
  },
  created() {
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.indexOf('win') > -1) {
      this.countByte = 1024;
    } else {
      this.countByte = 1000;
    }
  },
  methods: {
    handleBeforeUpload(file) {
      const fileSize = Math.round((file.size / this.countByte / this.countByte) * 10) / 10;
      let status = true;
      if (this.fileType === 'picture') {
        const regImg = /^.*?\.(png|jpg|jpeg)$/;
        if (!regImg.test(file.name) || fileSize > 2) {
          status = false;
          this.$message.warning(this.$t('material_library.tips.upload_limit_picture'));
        }
      } else if (this.fileType === 'document') {
        const regFile = /^.*?\.(doc|docx|xls|xlsx|ppt|pptx|pdf)$/i;
        if (!regFile.test(file.name) || fileSize > 20) {
          this.$message.warning(this.$t('material_library.tips.upload_limit_document'));
          status = false;
        }
      } else if (this.fileType === 'audio') {
        const url = URL.createObjectURL(file);
        const audioElement = new Audio(url);
        audioElement.addEventListener('loadedmetadata', () => {
          this.audioDuration = parseInt(audioElement.duration, 10);
        });
        const regAudio = /^.*?\.(raw|mp3|wav|amr)$/i;
        if (!regAudio.test(file.name) || fileSize > 2 || this.audioDuration > 60) {
          this.$message.warning(this.$t('material_library.tips.upload_limit_audio'));
          status = false;
        }
      }
      return status;
    },
    uploadFile(item) {
      this.$emit('handleUpload', item.file);
    },
  },
};
</script>

<style lang="scss" scoped>
  @import 'styles/variable.scss';
  .upload-file{
    display: inline-block;
  }
</style>
