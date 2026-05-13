<template>
  <div class="line-customized-wrapper">
    <img src="../../../assets/images/line.svg">
    <div class="input-area">
      <div class="line">
        <span class="input-label">{{$t('robot_setting.secret')}}</span>
        <info-input v-model="secret" :maxlength="200"
        :msg="$t('robot_setting.tip_line_secret')"
        :placeholder="$t('robot_setting.enter_secret_id')"></info-input>
      </div>
      <div class="line">
        <span class="input-label">{{$t('robot_setting.token')}}</span>
        <info-input v-model="token" :maxlength="200"
        :msg="$t('robot_setting.tip_token')"
        :placeholder="$t('robot_setting.enter_token')"></info-input>
      </div>
      <text-button class="generate-btn" :button-type="enableGenerate?'fill':'disable'"
      @click="handleSetIntegrationConfig">{{$t('robot_setting.generate')}}</text-button>
      <p class="genereate-tip1">{{$t('robot_setting.generate_tip5')}}</p>
    </div>
    <div class="result-area">
      <span class="genereate-tip4">{{$t('robot_setting.generate_tip6')}}</span>
      <p class="result-title" @click="handleCheckLineIntegrationGuide">{{$t('robot_setting.check_guide')}}</p>
      <div class="line">
        <span class="label">{{$t('robot_setting.line_webhook_url')}}</span>
        <input id="generatedURL" v-model="generatedURL" type="password" disabled />
        <span class="copy-btn" @click="handleCopyToClipboard(generatedURL)">{{$t('general.copy')}}</span>
      </div>
      <p class="result-title" @click="popUpLineList">{{$t('general.view')}}{{$t('robot_setting.binded_line_list')}}</p>
    </div>
  </div>
</template>

<script>

import misc from '@/utils/js/misc';
import robotAPI from '../_api/robot';
import LineList from './LineList';

export default {
  api: robotAPI,
  data() {
    return {
      lineList: [],
      secret: '',
      token: '',
      generatedURL: '',
    };
  },
  created() {
    this.getLineList();
  },
  computed: {
    enableGenerate() {
      return this.secret && this.token;
    },
  },
  methods: {
    data() {
      return {
        secret: this.secret,
        token: this.token,
      };
    },
    handleCheckLineIntegrationGuide() {
      this.$api.checkLineIntegrationGuide();
    },
    getLineList() {
      this.$api.getPlatformList('line').then((res) => {
        this.lineList = res;
      });
    },
    handleSetIntegrationConfig() {
      if (!this.enableGenerate) {
        return;
      }
      if (this.lineList.length === 1) {
        this.$notifyWarn(this.$t('robot_setting.line_maximum'));
        return;
      }
      this.$api.setIntegrationConfig('line',
        this.data()).then((res) => {
          this.generatedURL = res.url.replace(/http:\/\/|https:\/\//g, '');
        });
    },
    popUpLineList() {
      this.$emit('cancel');
      const options = {
        title: this.$t('robot_setting.binded_line_list'),
        component: LineList,
        data: {
          readonly: true,
        },
        buttons: ['cancel', 'ok'],
        validate: false,
      };
      this.$pop(options);
    },
    // 复制链接内容到剪切板
    handleCopyToClipboard(text) {
      misc.copyToClipboard(text);
    },
  },
};
</script>

<style lang="scss" scoped>
.line-customized-wrapper{
  width: 480px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 16px;
  border-top: 1px solid $color-borderline-disabled;
  border-bottom: 1px solid $color-borderline-disabled;
  img{
    width: 64px;
    height: 64px;
    margin-bottom: 10px;
  }
  .input-area{
    width: 100%;
    border-bottom: 1px solid $color-borderline;
    .line{
      display: flex;
      margin-bottom: 10px;
      .input-label{
        width: 145px;
        @include font-14px-line-height-28px();
      }
      .info-input{
        margin-left: 10px;
        flex: 1;
      }
    }
    .generate-btn{
      margin: 10px 0px;
      width: 100%;
    }
    .genereate-tip1{
      color: $color-font-mark;
      margin-bottom: 20px;
    }
  }
  .result-area{
    padding-top: 35px;
    position: relative;
    .genereate-tip4{
      @include font-14px();
    }
    .result-title{
      @include font-14px-line-height-28px();
      color: $app-active-color;
      cursor: pointer;
    }
    .line{
      margin-top: 10px;
      display: flex;
      .label{
        width: 160px;
        @include font-14px-line-height-28px();
      }
      input{
        flex: 1;
      }
      .copy-btn{
        @include font-14px-line-height-28px();
        color: $color-primary;
        margin-left: 10px;
        cursor: pointer;
      }
    }
  }
}
</style>