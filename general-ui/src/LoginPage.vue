<template>
  <div class="login-page">
    <div class="left-img_wrap">
      <img src="../static/images/login_index.png" class="login_bg_img">
    </div>
    <div class="right-content">
      <div class="log-img_wrap">
        <img :src="logoPic" ref="logo" class="logo_img">
      </div>
      <div class="container">
        <div v-if="canChangeLoginMethod" class="change_login_icon_wrap" :title="$t('login.switch_login_type')" @click='onSwitchLogin'>
          <img class="change_login_icon" src="./assets/icons/login_switch_icon.svg"/>
        </div>
        <div class="login-text">{{loginType.name}}</div>
        <div class="input-row">
          <input
            ref="user"
            type="text"
            :disabled='isLogining'
            v-model.trim="input.account"
            :placeholder="$t('login.account_place')"
            @keydown="passwordKey"
            @focus="onFocus('user')"
            @blur="onFocus()"
            class="input-style"
            :class="{active: focusOnUser, disabled: isLogining}"
          />
            <img v-if="focusOnUser && !isLogining"  class="right-suffix" src="./assets/icons/login_user_on.svg"/>
            <img v-else  class="right-suffix" src="./assets/icons/login_user_off.svg"/>
        </div>
        <div class="input-row">
          <input
            ref="password"
            type="password"
            :disabled='isLogining'
            v-model.trim="input.password"
            :placeholder="$t('login.password_place')"
            @keydown="passwordKey"
            autocomplete="off"
            @focus="onFocus('pwd')"
            @blur="onFocus()"
            class="input-style"
            :class="{active: focusOnPassword, disabled: isLogining}"
          />
          <img v-if="focusOnPassword && !isLogining"  class="right-suffix" src="./assets/icons/login_password_on.svg"/>
          <img v-else  class="right-suffix" src="./assets/icons/login_password_off.svg"/>
        </div>
        <div class="input-row captcha-row" v-if="useCaptcha">
          <img :src="captchaSrc" />
          <input
            ref="captcha"
            type="text"
            v-model="input.captcha"
            :placeholder="$t('login.captcha_place')"
            :maxlength="captchaLength"
            @keydown="passwordKey"
            autocomplete="off"
          />
        </div>
        <div class="input-button-row" @click="submit">
          <loading-button main fill ref="btn">
            <template slot="init">{{ $t('login.login') }}</template>
            <template slot="loading">{{ $t('login.login') }}ing</template>
          </loading-button>
        </div>
        <div class="message">{{ $t('login.contact_sm') }}</div>
      </div>
    </div>
    <notification></notification>
  </div>
</template>

<script>
import misc from '@/utils/js/misc';
import Icon from './components/basic/Icon';
import LoadingButton from './components/basic/LoadingButton';
import api from './api/system';

import logoPic from '../static/images/BF2020_LOGO.png';

export default {
  name: 'login',
  components: {
    icon: Icon,
    LoadingButton,
  },
  api,
  data() {
    return {
      logoPic,
      canChangeLoginMethod: false,
      input: {
        account: '',
        password: '',
      },
      hasError: false,
      i18n: {},
      redirect: '',
      useCaptcha: false,
      captchaSrc: '',
      captchaLength: 6,
      triggerStatus: true,
      focusOnUser: true,
      focusOnPassword: false,
      loginType: { name: this.$t('login.bf_account'), type: 'normal' },
      LOGIN_TYPE: {
        NORMAL: {
          type: 'normal',
          name: this.$t('login.bf_account'),
        },
        LDAP: {
          type: 'ladp',
          name: this.$t('login.ldap_account'),
        },
      },
      isLogining: false, // 是否正在登陆ing
    };
  },
  methods: {
    onSwitchLogin() {
      this.loginType = this.loginType.type === this.LOGIN_TYPE.NORMAL.type
      ? this.LOGIN_TYPE.LDAP : this.LOGIN_TYPE.NORMAL;
    },
    onFocus(type) {
      this.focusOnUser = type === 'user';
      this.focusOnPassword = type === 'pwd';
    },
    submit() {
      if (this.loginType.type === this.LOGIN_TYPE.LDAP.type) {
        this.loginType = this.LOGIN_TYPE.NORMAL;
        this.$notify({ text: this.$t('login.unsupport_login_type'), type: 'fail' });
        return;
      }
      const that = this;
      if (that.input.password.length === 0 || that.input.password.length === 0) {
        that.$notify({ text: that.$t('login.input_empty'), type: 'fail' });
        return;
      }
      that.$refs.user.blur();
      that.$refs.password.blur();
      if (!that.input.account || !that.input.password) {
        that.$notify({ text: that.$t('login.notify_input'), type: 'fail' });
        if (!that.input.account) {
          that.$refs.user.focus();
        } else {
          that.$refs.password.focus();
        }
        return;
      }
      this.$refs.btn.click();
      that.$refs.btn.$emit('loading');
      this.isLogining = true;
      that
        .$login(that.input)
        .then(
          (result) => {
            if (result.authV2 === undefined) {
              return;
            }
            const info = result.authV2.info;
            if (info === undefined) {
              return;
            }
            if (info.type === 0) {
              window.location = '/#/manage/enterprise-manage';
            } else if (info.product && info.product.indexOf('IM') >= 0) {
              window.location = '/im-admin/imIndex';
            } else {
              // that.$api.getSelectOrg(info.id).then((res) => {
              //   console.log(res);
              //   if (res.length > 1) {
              //     // 可以在这里再存一个值，表示进“select-org”面还是“robot-manage'”
              //     localStorage.setItem('beforePro', true);
              //     window.location = '/#/manage/select-org';
              //   } else {
              //     const data = [];
              //     if (Array.isArray(res[0].productInfos)) {
              //       res[0].productInfos.map((item) => {
              //         data.push(item.productid);
              //         return item;
              //       });
              //     }
              //     localStorage.setItem('beforePro', false);
              //     localStorage.setItem('setProduct', data);
              //     // localStorage.setItem(
              //     //   'enterprise',
              //     //   that.list[this.radio].orgid,
              //     // );
              //     // that.$store.commit('setEnterprise', that.list[this.radio].orgid);
              //     window.location = '/#/manage/robot-manage';
              //   }
              // });
              window.location = '/#/manage/robot-manage';
            }
          },
          (err) => {
            if (err.response.status === 400 && that.useCaptcha) {
              that.$notify({
                text: that.$t('login.validate_fail'),
                type: 'fail',
              });
              if (that.$refs.captcha) {
                that.$refs.captcha.focus();
              }
            } else {
              that.reloadCaptcha();
              that.$notify({
                text: that.$t('login.notify_fail'),
                type: 'fail',
              });
              that.$refs.user.focus();
            }
          },
        )
        .finally(() => {
          that.$refs.btn.$emit('reset');
          this.isLogining = false;
        });
    },
    passwordKey(e) {
      if (e.keyCode === 13) {
        this.submit();
      }
    },
    reloadCaptcha() {
      const that = this;
      that.captchaSrc = '';
      that.input.captcha = '';
      that.$api.getEnv().then((env) => {
        if (env.USE_CAPTCHA === '1' || env.USE_CAPTCHA === 'true' || env.USE_CAPTCHA === true) {
          that.useCaptcha = true;
          return that.$api.getCaptcha().then((rsp) => {
            that.captchaSrc = rsp.data;
            that.input.captchaID = rsp.id;
          });
        }
        return new Promise((r) => {
          setTimeout(r(), 0);
        });
      });
    },
    loadLogo() {
      const that = this;
      that.$api.getIcon('login').then(() => {
        if (that.$refs.logo) {
          that.$refs.logo.src = that.$api.getIconURL('login');
        }
      }).catch((err) => {
        console.log(err);
        that.$refs.logo.src = this.logoPic;
      });

      that.$api.getIcon('favicon').then(() => {
        misc.changeFavicon(that.$api.getIconURL('favicon'));
      }).catch((err) => {
        console.log(err);
      });
      // that.$api.getIcon('login').then(() => {
      //   that.$refs.logo.src = `url("${that.$api.getIconURL('login')}")`;
      // }, () => {
      //   that.$refs.logo.classList.add('default');
      // });
      // that.$api.getIcon('favicon').then(() => {
      //   misc.changeFavicon(that.$api.getIconURL('favicon'));
      // });
    },
    // 处理登出通过Url带出来的信息
    handleUrl() {
      const that = this;
      const querys = document.location.search.substr(1).split('&');
      const queryMap = {};
      querys.forEach((query) => {
        const idx = query.indexOf('=');
        queryMap[query.substr(0, idx)] = query.substr(idx + 1);
      });
      if (Object.keys(queryMap).indexOf('invalid') >= 0) {
        that.$notifyFail(that.$t('login.auth_expire'));
      }
      if (Object.keys(queryMap).indexOf('redirect') >= 0) {
        that.redirect = decodeURIComponent(queryMap.redirect);
      }
      if (queryMap && queryMap.r) {
        that.$notifyFail(that.$t('login.module_forbidden'));
      }
    },
  },
  mounted() {
    const that = this;
    that.$refs.user.focus();
    this.handleUrl();
    that.reloadCaptcha();
    that.loadLogo();
  },
};
</script>

<style lang="scss">
@import "styles/reset.scss";

input:-webkit-autofill {
  -webkit-box-shadow:0 0 0 50px white inset;
  -webkit-text-fill-color: #333;
}
::-webkit-input-placeholder {
  text-align: center;
}

:-moz-placeholder { /* Firefox 18- */
  text-align: center;
}

::-moz-placeholder {  /* Firefox 19+ */
  text-align: center;
}

:-ms-input-placeholder {
  text-align: center;
}
div {
  box-sizing: border-box;
}
.login-page {
  font-family: PingFangHK-Regular, PingFangSC, 'Microsoft YaHei', 'Microsoft JhengHei';
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  position: relative;
  background:linear-gradient(180deg,rgba(166,188,255,1) 0%,rgba(136,198,254,1) 100%);
  height: 100vh;
  width: 100vw;
  .right-content {
    position: absolute;
    left: 68vw;
    .log-img_wrap {
      width:320px;
      height: 45px;
      margin-top: -80px;
      margin-bottom: 20px;
      .logo_img {
        padding: 0 10px;
        height: 100%;
        width: 100%;
      }
    }
    .container {
      position: relative;
      flex: 0 0 auto;
      display: flex;
      flex-direction: column;
      align-items: stretch;
      width:320px;
      height:345px;
      background:linear-gradient(180deg,rgba(255,255,255,0.7) 0%,rgba(242,242,255,0.7) 100%),
      linear-gradient(to left bottom, transparent 100%, #CAD9FF 0) no-repeat 100% 0 / 40px 40px,
      linear-gradient(-135deg, transparent 40px, rgba(242,242,255,0.7) 0);
      box-shadow:0px 4px 10px 0px rgba(25,25,173,0.16);
      background-clip:padding-box,border-box;
      background-origin:padding-box,border-box;
      background-image:linear-gradient(135deg,rgba(255, 255, 255, 0.2)),linear-gradient(135deg,rgba(255, 255, 255, 0.2),rgba(25, 25, 173, 0.16));
      border:12px transparent solid;
      .change_login_icon_wrap {
        position: relative;
        display: flex;
        justify-content: flex-end;
        align-items: start;
        background: #3498db;
        .change_login_icon {
          position: absolute;
          margin: 8px -8px;
          width: 16px;
          height: 16px;
          cursor: pointer;
          &:hover {
            width: 17px;
            height: 17px;
          }
        }
      }
      .login-text {
        margin-top: 30px;
        margin-left: 20px;
        margin-bottom: 40px;
        height:28px;
        font-size:18px;
        font-family:PingFang-SC-Bold,PingFang-SC;
        font-weight:bold;
        color:rgba(61,75,99,1);
        line-height:28px;
      }
      .logo {
        flex: 0 0 auto;
        margin-bottom: 40px;

        display: flex;
        justify-content: center;
        #app-logo {
          width: 200px;
          height: 120px;
          background-repeat: no-repeat;
          background-position: center center;
          background-color: transparent;
          background-size: 200px 120px;
          &.default.zh-cn {
            background-image: url("/static/emotibot_logo_chs.svg");
          }
          &.default.zh-tw {
            background-image: url("/static/emotibot_logo_cht.svg");
          }
        }
      }
      .input-row {
        display: flex;
        justify-content: center;
        align-items: center;
        width:100%;
        height:40px;
        margin-bottom: 20px;
        padding: 0 20px;
        .input-style {
          width: calc(100% - 40px);
          height: 40px;
          background: #EBF2FF !important;
          border-radius:4px;
          border:1px solid rgba(155,166,177,1) !important;
          font-size: 14px;
          line-height: 40px;
          box-sizing: border-box;
          display: inline-block;
          padding: 0 8px;
          width: 100%;
          outline: none;
          border: none;
          background: none;
          &::placeholder {
            color: #999999;
          }
        }
        .active {
          opacity:0.8;
          border:1px solid rgba(24,117,240,1) !important;
          background: #FFFFFF !important;
        }
        .disabled {
          opacity:0.8;
          border:1px solid #cccccc  !important;
          background: #eeeeee !important;
        }
        .right-suffix {
          height: 16px;
          width: 16px;
          position: absolute;
          right: 40px;
        }
        &.captcha-row {
          border: none;
          justify-content: space-between;
          input {
            border: solid 1px $color-borderline;
            border-radius: 2px;
            width: calc(50% - 4px);
          }
          img {
            width: 50%;
            border: solid 1px $color-borderline;
            border-radius: 2px;
          }
        }
      }
      .input-button-row {
        flex: 0 0 auto;
        margin-top: 20px;
        margin-bottom: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        height:40px;
        padding: 0 20px;
        .fill {
          height: 100%;
          .text-button {
            height: 40px;
          }
        }
      }
      .message {
        font-size: 12px;
        text-align: center;
        color: #666666;
      }
    }
  }
  .left-img_wrap {
    position: absolute;
    height: 80vh;
    width: 60vw;
    .login_bg_img {
      width: 100%;
      height:100%;
    }
  }

  div.loading {
    @media screen and (max-width: $break-small) {
      left: 0;
      top: $page-header-height;
      width: 100vw
    }
    position: fixed;
    height: 100vh;
    width: 100vw;
    background: rgba(0%, 0%, 0%, 0.6);
    color: white;
    font-size: 1.5em;
    display: flex;
    align-items: center;
    justify-content: center;
    @keyframes spin {
      0% { transform: rotate(0deg); }
      25% { transform: rotate(192deg); }
      50% { transform: rotate(278deg); }
      75% { transform: rotate(336deg); }
      100% { transform: rotate(360deg); }
    }
    .loader {
      margin-right: 10px;
      border: 8px solid #f3f3f3; /* Light grey */
      border-top: 8px solid #3498db; /* Blue */
      border-radius: 50%;
      width: 40px;
      height: 40px;
      animation: spin 2s linear infinite;
    }
  }
}
</style>
