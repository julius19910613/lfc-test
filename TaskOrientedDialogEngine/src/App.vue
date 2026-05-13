<template>
  <div id="app">
    <div class="page-header">
      <page-header
        :enterpriseInfo="enterpriseInfo"
        :robotInfo="robotInfo"
        :userInfo="userInfo"
        :leftNavList="headerPrivilegeLocal"
        :logo = 'logo_url'
        :licenseSwitch="licenseSwitch"
        @tomanagepage="toManagePage"
        @logout = 'logout_local'
        :locale="$i18n.locale">
      </page-header>
    </div>
    <div class="content-wrapper">
      <page-menu
      :currentRoute="currentRoute"
      :menuPages = 'privilege_local'
      @topage="toPage">
      </page-menu>
      <div class="card-panel" @click="handleBlur2HideCB">
        <router-view></router-view>
      </div>
      <qa-test ref="qaTest"
      :robotName="robotInfo.robotName"
      :chatTest="chatTest"
      :tagTypes = 'tagTypeList'
      @qaRequest = 'sendMessage'></qa-test>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
// import jwt from 'jsonwebtoken';
import TaskEngine from './components/TaskEngine';
import api from './js/http/requests';

const localData = require('./js/mockdata/localstorage');

export default {
  $api: api,
  name: 'App',
  components: {
    TaskEngine,
  },
  data() {
    return {
      logo_url: '',
      enterpriseInfo: {},
      robotInfo: {},
      userInfo: {},
      currentPage: {},
      currentRoute: 'new-tde',
      privilege_local: [],
      testWidth: 700,
      chatTest: false,
      tagTypeList: [],
      headerPrivilegeLocal: [],
      licenseSwitch: false,
    };
  },
  created() {
    if (process.env.NODE_ENV === 'development') {
      this.setLocalStorage();
    }
    this.setRobotId(localStorage.getItem('appid'));
    const enterpriseId = localStorage.getItem('enterprise');
    this.$api.getAuthMenus(enterpriseId).then((res) => {
      if (res && res.result && res.result.body_left) {
        this.privilege_local = res.result.body_left;
      }
    });
    this.$api.apiGetIntentsList().then((res) => {
      this.setIntentsList(res.result || []);
    }).catch(() => {
      console.log('errr');
    });
    this.$api.apiGetParserList().then((res) => {
      this.setParsersList(res || []);
    }).catch(() => {
      console.log('error');
    });
    // 设置Page Header参数
    if (localStorage.getItem('licenseInfo') && localStorage.getItem('licenseInfo').length > 0) {
      this.licenseSwitch = JSON.parse(localStorage.getItem('licenseInfo')).license_switch;
    }
    // const INFO = jwt.decode(localStorage.getItem('token'));
    // debugger;
    if (!localStorage.getItem('token') || !localStorage.getItem('appid')) {
      window.location = '/#/manage/robot-manage';
      return;
    }
    // const info = {
    //   userid: localStorage.getItem('userInfo').id, // INFO.custom.id,
    //   appids: [{ appid: localStorage.getItem('appid') }],
    //   username: localStorage.getItem('appid'),
    // };
    // this.setUserInfo(info);
    this.enterpriseInfo = {
      enterpriseID: localStorage.getItem('enterprise'),
      enterpriseName: JSON.parse(localStorage.getItem('enterpriseInfo'))[0].name,
    };
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
    this.robotInfo = {
      robotID: localStorage.getItem('appid'),
      robotName: localStorage.getItem('robotName'),
    };
    this.$root.$on('open-chat-test', () => {
      this.chatTest = true;
    });
    this.$root.$on('close-chat-test', () => {
      this.chatTest = false;
    });
  },
  mounted() {
    // 获取页签
    // this.getIcon('favicon', localStorage.getItem('enterprise')).then(
    //   () => {
    //     this.changeFavicon(
    // this.getIconURL('favicon', localStorage.getItem('enterprise')));
    //   },
    //   () => this.getIcon('favicon', '').then(() => {
    //     this.changeFavicon(this.getIconURL('favicon', ''));
    //   })).catch(() => {
    //   this.changeFavicon('/static/favicon.png');
    // });
    // // 获取header图片
    // this.getIcon('app', localStorage.getItem('enterprise')).then(
    //   () => {
    //     this.logo_url =
    // `url("api/v1/ui/logo?type=app&enterprise=${localStorage.getItem('enterprise')}")`;
    //   },
    //   () => this.getIcon('app', '').then(() => {
    //     this.logo_url = 'url("api/v1/ui/logo?type=app")';
    //   })).catch(() => {
    //   this.logo_url = '';
    // });
    // document.title = this.$t('title.net_name');
    this.getTagTypes();
  },
  methods: {
    ...mapActions([
      'setIntentsList',
      'setParsersList',
      'setRobotId',
    ]),
    setLocalStorage() {
      Object.keys(localData).forEach((key) => {
        const value = localData[key];
        if (value instanceof Object) {
          localStorage.setItem(key, JSON.stringify(value));
        } else {
          localStorage.setItem(key, localData[key]);
        }
      });
    },
    toPage(page) {
      // if (page.is_link) {
      //   window.localStorage.setItem('path', '');
      //   if (page.route === 'new-tde') {
      //     this.currentRoute = 'new-tde';
      //     this.$router.push({ path: '/tde-list' });
      //   }
      // }
      if (page.route === 'new-tde') {
        this.currentRoute = 'new-tde';
        this.$router.push({ path: '/tde-list' });
      } else if (page.is_link) {
        window.location = `/${page.route}.html`;
      } else {
        window.location = `/#/${page.route}`;
      }
    },
    toManagePage(path) {
      window.location = path;
    },
    logout_local() {
      console.log('logout_local');
      this.$clearCookie('appid');
      this.$clearCookie('userid');
      this.$clearCookie('verify');
      this.$clearCookie('access_token');
      localStorage.removeItem('userInfo');
      localStorage.removeItem('token');
      localStorage.removeItem('enterpriseInfo');
      localStorage.removeItem('enterprise');
      localStorage.removeItem('modules');
      localStorage.removeItem('role');
      sessionStorage.removeItem('appid');
      sessionStorage.removeItem('enterprise');
      window.location = '/login.html';
    },
    getIconURL(iconType, enterprise) {
      return `api/v1/ui/logo?type=${iconType}${enterprise ? `&enterprise=${enterprise}` : ''}`;
    },
    getIcon(iconType, enterprise) {
      return this.$api.apiGetIcon(this.getIconURL(iconType, enterprise));
    },
    changeFavicon(src) {
      const link = document.createElement('link');
      const oldLink = document.getElementsByTagName('link')[0];
      link.id = 'dynamic-favicon';
      link.rel = 'shortcut icon';
      link.href = src;
      if (oldLink) {
        document.head.removeChild(oldLink);
      }
      document.head.appendChild(link);
    },
    getTagTypes() {
      this.$api.apiGetTagTypes().then((res) => {
        const ret = res.result.map(category => ({
          id: category.id,
          text: category.name,
          allChecked: true,
          type: category.code,
          values: category.values.map(value => ({
            tagId: value.id,
            id: value.code,
            text: value.value,
            checked: false,
          })),
        }));
        // sort by type id
        ret.sort((a, b) => (a.id - b.id));
        this.tagTypeList = ret.filter(r => r.values.length > 0);
      });
    },
    sendMessage(text, filter, isonline, chatNode) {
      const params = {
        qtype: 'debug',
        top: 2,
        text,
        info: filter,
        extend_data: {
          online: isonline,
        },
      };
      this.$api.apiSendChatRequest(params).then((res) => {
        // if (res.status !== 0) {
        //  this.$confirm(res.message, that.$t("message.alert"), {
        //    confirmButtonText: that.$t("buttons.confirm"),
        //    showClose:false,
        //    howCancelButton:false,
        //    type: 'error'
        //  }).then(() => {}).catch();
        //    return;
        // }
        if (res.result.answers && res.result.answers.length > 0) {
          // old format use 'result' part in return obj
          this.$refs.qaTest.appendChatArrayDelay(res.result.answers, 'robot');
        } else if (res.data !== undefined) {
          // new format use 'data' part as answer
          this.$refs.qaTest.appendChatArrayDelay(res.data, 'robot');
        } else {
          // this.$confirm(res.message, that.$t("message.alert"), {
          //   confirmButtonText: that.$t("buttons.confirm"),
          //   showClose:false,
          //   showCancelButton:false,
          //   type: 'error'
          // }).then(() => {}).catch();
          // return;
        }
        this.$refs.qaTest.handleAnalysis(chatNode, res);
      });
    },
    handleBlur2HideCB() {
      this.chatTest = false;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./assets/scss/index";
#app {
  width:100%;
  height: 100%;
  background: #EEEEEE;
  .page-header{
    width: 100%;
    height: 50px;
    background-color: pink;
  }
  .content-wrapper{
    width: 100%;
    height: calc(100% - 50px);
    display: flex;
    .card-panel{
      flex: 1;
      height: calc(100% - 40px);
      @extend .white-panel;
      margin-left: 170px;
      box-sizing: border-box;
    }
  }
}
</style>
