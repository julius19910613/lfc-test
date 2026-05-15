<template>
  <div id="applyPopup" class="apply-popup">
    <div class="apply-title">{{ $t('license.apply.apply_steps') }}</div>
    <ul>
      <li v-for="(item, i) in steps" :key="i">{{ item }}</li>
    </ul>
    <section>
      <template v-if="generateStatus === 'initial'">
        <text-button @click="handleGenerateCode" :button-type="'blue'">{{ $t('license.apply.generate_code') }}</text-button>
      </template>
      <template v-else-if="generateStatus === 'generating'">
        <loading-line></loading-line>
        <p class="generating-tip">{{ $t('license.apply.generating_code') }}</p>
      </template>
      <template v-else-if="generateStatus === 'success'">
        <div class="generated success">
          {{ $t('license.apply.generate_success') }}
        </div>
        <div class="generated-code">
          <span>{{ $t('license.apply.machine_code') }}</span>
          <el-input class="emotibot" :disabled="true" v-model="generatedCode"></el-input>
          <text-button button-type="primary" class="copyButton" :data-clipboard-text="generatedCode" @click="initClipboard">{{ $t('general.copy') }}</text-button>
          <text-button button-type="primary" @click="handleDownloadCode">{{ $t('general.download') }}</text-button>
        </div>
        <p class="generated-tip">{{ $t('license.apply.generated_tips') }}</p>
      </template>
      <template v-else-if="generateStatus === 'fail'">
        <div class="generated fail">
          {{ $t('license.apply.generate_fail') }}
        </div>
        <p class="generated-tip">{{ $t('license.apply.generated_tips') }}</p>
      </template>
    </section>
  </div>
</template>
<script>
import Clipboard from 'clipboard';
import FileSaver from 'file-saver';
import moment from 'moment';
import api from '../_api/license';

export default {
  name: 'apply-popup',
  api,
  data: () => ({
    steps: [],
    generateStatus: 'initial', // intial, generating, success, fail
    clipboard: '',
    generatedCode: '',
  }),
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    generateStatus(val) {
      if (val === 'success') {
        this.clipboard = new Clipboard('.copyButton');
      }
    },
    visible(val) {
      if (!val) {
        this.generatedCode = '';
        this.generateStatus = 'initial';
      }
    },
  },
  created() {
    this.steps = JSON.parse(this.$t('license.apply.steps'));
  },
  methods: {
    handleGenerateCode() {
      this.generateStatus = 'generating';
      const params = {
        // eslint-disable-next-line
        apply_info: '{\"user_id\": \"\",\"user_name\": \"\",\"email\": \"\",\"line_num\": \"\"}',
      };
      this.$api.generateCode(params).then((data) => {
        this.generateStatus = 'success';
        this.generatedCode = data;
      }).catch(() => {
        this.generateStatus = 'fail';
      });
    },
    initClipboard() {
      this.clipboard.on('success', (e) => {
        this.$message.success(this.$t('license.apply.copy_success'));
        e.clearSelection();
        this.clipboard.destroy();
      });
    },
    handleDownloadCode() {
      if (this.generatedCode) {
        const blob = new Blob([this.generatedCode], { type: 'text/plain;charset=utf-8' });
        FileSaver.saveAs(blob, `${this.$t('license.apply.file_name')}_${moment().format('YYYYMMDDHHmmss')}.dat`);
      } else {
        this.$message.warning(this.$t('license.apply.empty_code'));
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'styles/variable';
.apply-popup {
   @include font-16px();
   color: $color-font-active;
   ul {
     @include font-14px();
     color: $color-font-normal;
     line-height: 1.8em;
   }
   section {
     margin-top: 30px;
     padding: 20px 10px;
     display: flex;
     flex-direction: column;
     align-items: center;
     justify-content: center;
     background: $color-bg-f7;
     min-height: 150px;
     >.text-button {
       padding: 0 45px;
     }
    p {
      margin-top: 10px;
      @include font-14px();
      color: $color-font-mark;
      &.generated-tip {
        width: 73%;
        text-align: center;
        @include font-12px();
      }
    }
    .generated-code {
      margin-top: 10px;
      display: flex;
      align-items: center;
      width: 100%;
      span{
        @include font-14px();
        color: $color-font-normal;
        margin-right: 10px;
        flex-shrink: 0;
      }
      .text-button {
        flex-shrink: 0;
        margin-left: 10px;
      }
      ::v-deep .el-input input {
        width: 100%;
        height: 32px;
      }
    }
  }
}
</style>
