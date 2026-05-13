<template>
  <div class="messenger-wrapper">
    <img src="../../../assets/images/messenger.svg">
    <div class="input-area">
      <div class="line">
        <span class="input-label">{{$t('robot_setting.page_id')}}</span>
        <info-input v-model="pageId" :maxlength="50"
        :msg="$t('robot_setting.tip_page_id')"
        :placeholder="$t('robot_setting.enter_page_id')"></info-input>
      </div>
      <div class="line">
        <span class="input-label">{{$t('robot_setting.access_token')}}</span>
        <info-input v-model="accessToken" :maxlength="200"
        :msg="$t('robot_setting.tip_access_token')"
        :placeholder="$t('robot_setting.enter_access_token')"></info-input>
      </div>
      <text-button class="generate-btn" :button-type="enableGenerate?'fill':'disable'"
      @click="handleSetIntegrationConfig">{{$t('robot_setting.generate')}}</text-button>
      <p class="genereate-tip1">{{$t('robot_setting.generate_tip3')}}</p>
    </div>
    <div class="result-area">
      <span class="genereate-tip4">{{$t('robot_setting.generate_tip4')}}</span>
      <p class="result-title" @click="handleCheckMessengerIntegrationGuide">{{$t('robot_setting.check_guide')}}</p>
      <div class="line">
        <span class="label">{{$t('robot_setting.messenger_webhook_url')}}</span>
        <input id="generatedURL" v-model="generatedURL" type="password" disabled />
        <span class="copy-btn" @click="handleCopyToClipboard(generatedURL)">{{$t('general.copy')}}</span>
      </div>
      <div class="line">
        <span class="label">{{$t('robot_setting.messenger_verify_token')}}</span>
        <input id="generatedToken" v-model="generatedToken" type="password" disabled />
        <span class="copy-btn" @click="handleCopyToClipboard(generatedToken)">{{$t('general.copy')}}</span>
      </div>
      <p class="result-title" @click="popUpMessengerList">{{$t('general.view')}}{{$t('robot_setting.binded_messenger_list')}}</p>
    </div>
  </div>
</template>

<script>
import misc from '@/utils/js/misc';
import robotAPI from '../_api/robot';
import MessengerList from './MessengerList';

export default {
  api: robotAPI,
  data() {
    return {
      messengerList: [],
      pageId: '',
      accessToken: '',
      generatedURL: '',
      generatedToken: '',
    };
  },
  created() {
    this.getMessengerList();
  },
  computed: {
    enableGenerate() {
      return this.pageId && this.accessToken;
    },
  },
  methods: {
    data() {
      return {
        'page-id': this.pageId,
        'access-token': this.accessToken,
      };
    },
    handleCheckMessengerIntegrationGuide() {
      this.$api.checkMessengerIntegrationGuide();
    },
    getMessengerList() {
      this.$api.getPlatformList('messenger').then((res) => {
        this.messengerList = res;
      });
    },
    handleSetIntegrationConfig() {
      if (!this.enableGenerate) {
        return;
      }
      if (this.messengerList.length === 1) {
        this.$notifyWarn(this.$t('robot_setting.messenger_maximum'));
        return;
      }
      this.$api.setIntegrationConfig('messenger',
        this.data()).then((res) => {
          this.generatedURL = res.url;
          this.generatedToken = res['verify-token'];
        });
    },
    popUpMessengerList() {
      this.$emit('cancel');
      const options = {
        title: this.$t('robot_setting.binded_messenger_list'),
        component: MessengerList,
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
.messenger-wrapper{
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
        width: 56px;
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
        width: 118px;
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