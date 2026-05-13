<template>
  <div class="wx-miniprogram-wrapper">
       <!-- wait icon -->
    <img src="../../../assets/images/wx_android.svg">
    <p class="title">{{$t('robot_setting.scan_qrcode')}}</p>
    <p class="robot-name">{{$t('robot_setting.android_name')}}</p>
    <div id="qrcode" class="qr-code"></div>
    <p class="robot-name">
      {{$t('robot_setting.android_content')}}：
      <a href="https://emotibot-app.oss-cn-shanghai.aliyuncs.com/小竹子.apk" download="小竹子.apk" class="android-a">
       <span>小竹子.apk</span>
      </a>
    </p>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import QRCode from 'qrcodejs2';

export default {
  computed: {
    ...mapGetters([
      'robotID',
      'robotName',
    ]),
  },
  mounted() {
    this.generateQRCode();
  },
  methods: {
    // 生成微信小程序链接二维码
    generateQRCode() {
      setTimeout(() => {
        const qrcode = new QRCode('qrcode', {
          width: 120,
          height: 120,
          text: `{"appid":"${this.robotID}"}`,
        });
        console.log(qrcode);
      }, 100);
    },
  },
};
</script>

<style lang="scss" scoped>
.wx-miniprogram-wrapper{
  width: 480px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 10px;
  border-top: 1px solid $color-borderline-disabled;
  border-bottom: 1px solid $color-borderline-disabled;
  img{
    width: 64px;
    margin-bottom: 30px;
  }
  .title, .robot-name{
    margin-bottom: 10px;
    @include font-14px();
  }
  .qr-code{
    width: 120px;
    height: 120px;
    background: black;
    margin-bottom: 20px;
  }
  .android-a{
    text-decoration:none;
    color:lightseagreen;
  }
}
</style>