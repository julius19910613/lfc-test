<template>
  <div id="app">
    <div :class="{blur: isBackgroundBlur}">
      <page-header :customMenus="customPageHeaderMenus" :customHomeMenu="customHomeMenu"
      @clickMenu="handleSelectHeaderMenu"></page-header>
      <product-menu 
        :productMenuList="productMenuList" 
        :currentModule="currentModule"
        ref="emotiProductMenu"></product-menu>
      <page-menu v-if="!isManageModule && hasRobot" :menuPages="pageMenuParams"
      :currentModule="currentModule" :currentRoute="currentRoute"></page-menu>
      <!-- if not Manage Module, show robot page -->
      <template v-if="!isManageModule && ready"> 
        <div v-if="showSwitchRobotLoading" class="app-loading-container">
          <div class="loading card h-fill w-fill">
            <loading-dot></loading-dot>
            <div class="loading-msg"> {{ $t('general.loading') }}</div>
          </div>
        </div>
        <div id="app-page" v-if="ready">
          <div v-if="showLoading" class="app-body">
            <div class="loading card h-fill w-fill">
              <loading-dot v-if="loadingType==='dot'"></loading-dot>
              <loading-line v-if="loadingType==='line'"></loading-line>
              <div class="loading-msg"> {{ loadingMsg || $t('general.loading') }}</div>
            </div>  
          </div>
          <router-view class="app-body" @startLoading="startLoading" @endLoading="endLoading"/>
        </div>
      </template>
      <!-- if isManageModule, show enterprise admin page -->
      <template v-else-if="isManageModule && ready">
        <div id="app-page" class="manage">
          <div v-if="showLoading" class="app-body">
            <div class="loading card h-fill w-fill">
              <loading-dot v-if="loadingType==='dot'"></loading-dot>
              <loading-line v-if="loadingType==='line'"></loading-line>
              <div class="loading-msg"> {{ loadingMsg || $t('general.loading') }}</div>
            </div>
          </div>
          <router-view class="app-body" @startLoading="startLoading" @endLoading="endLoading"/>
        </div>
      </template>
    </div>
    <qa-test :key="qaTestKey" ref="qaTest" :robotName="robotName" :chatTest="chatTest"
      class="qa-test-box" :tagTypes = 'dimensionList'
      @qaRequest = 'sendMessage'></qa-test>
    <notification></notification>
    <context-menu></context-menu>
  </div>
</template>

<script>
import axios from 'axios';
import { mapMutations, mapGetters, mapActions } from 'vuex';
import constant from '@/utils/js/constant';
import tagTypeAPI from '@/api/tagType';
import bus from '@/components/bus';
import taskEngineApi from '@/modules/TaskEngine/_api/taskEngine';
import qaTest from '@/modules/FAQ/_api/qatest';
// import UserPreference from '@/manage-modules/UserPreference';
import userAPI from '@/manage-modules/_api/user';
import adminAPI from '@/manage-modules/SystemManage/_api/system';
import systemAPI from '@/api/system';
import misc from '@/utils/js/misc';
import enterpriseAPI from './manage-modules/SystemManage/_api/enterprise';
import roleAPI from './manage-modules/_api/role';
import licenseAPI from './manage-modules/License/_api/license';
import dimensionApi from './modules/RobotSetting/_api/config';

const defaultPath = '/statistic-dash';

const debugCodeArr = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
  'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
let debugCodeIdx = 0;
let debugTimer;

function forceUpdate(vueObj) {
  vueObj.$children.forEach((child) => {
    forceUpdate(child);
  });
  vueObj.$forceUpdate();
}

export default {
  name: 'app',
  api: [userAPI, adminAPI, systemAPI, enterpriseAPI,
    roleAPI, licenseAPI, tagTypeAPI, qaTest, dimensionApi, taskEngineApi],
  computed: {
    isManageModule() {
      const manageModule = /^\/manage(.*)?/;
      return manageModule.test(this.$route.path);
    },
    customPageHeaderMenus() {
      if (!this.robotID) {
        return {};
      }
      return {
        left: this.pageHeaderParams,
        right: [
          {
            key: 'chat-box',
            title: this.robotName,
            icon: 'header_robot',
            isRouter: false,
          },
          {
            key: 'chat-test',
            title: this.$t('generl.chat_test'),
            icon: 'icon-chat-test-01',
            isRouter: false,
          },
        ],
      };
    },
    ...mapGetters([
      'robotID',
      'robotName',
      'userID',
      'userRole',
      'userRoleMap',
      'currentPage',
      'enterpriseID',
      'userPrivilege',
      'showLanguage',
      'privilegeList',
      'environment',
      'UIModules',
      'licenseInfo',
      'pageMenuParams',
      'pageHeaderParams',
      'dimensionList',
      'debugInfoEnv',
      'currentRoute',
    ]),
    pageMensItemName() {
      return this.pageMenuParams.reduce((pre, cur) =>
       pre.concat((cur.items || []).map(i => i.toRoute)), []);
    },
  },
  data() {
    return {
      qaTestKey: '',
      productMenuList: [],
      customHomeMenu: {
        title: this.$t('general.platform_name'),
        isRouter: true,
        toModule: '',
        toRoute: 'manage/robot-manage',
        icon: 'header_robot_list',
      },
      loadingType: 'dot',
      showLoading: false,
      showSwitchRobotLoading: false,
      loadingMsg: '',
      ready: false,
      userInfo: {},
      isBackgroundBlur: false,
      // testComponent: QATest,
      checkCookieMs: 5000,
      checkCookieLoop: undefined,
      getPrivilegeChange: true,
      chatTest: false,
      tagTypeList: [],
      currentModule: 'bf',
      // currentRoute: 'statistic-dash',
      tagflag: false,
      showidList: [],
      hasRobot: false,
    };
  },
  watch: {
    enterpriseID(val) {
      this.setPrivilegeList(this.$getPrivModules());
      this.$cookie.set('enterprise', val, { expires: constant.cookieTimeout });
      // this.loadLogo();
    },
    robotID(val) {
      if (val === '') {
        return;
      }
      this.getPrivilegeChange = false;
      this.$cookie.set('appid', val, { expires: constant.cookieTimeout });
      this.$setReqAppid(val);
      this.getUIModule.call(null, this);

      const robotData = {
        appid: val,
      };
      const str = JSON.stringify(robotData);
      const expires = new Date();
      expires.setTime(expires.getTime() + (24 * 60 * 60 * 1000));
      // no using context.$cookie because of it will encoded cookie value
      document.cookie = `robotDataJson=${str}; expires=${expires.toGMTString()};path=/`;
      this.showSwitchRobotLoading = true;
      this.setupPages();
      this.closeChatTest();
      this.fetchDimensionList();
      // appId变化的时候刷新对话测试组件以重新放入数据
      this.qaTestKey = new Date().getTime();
    },
    userID() {
      this.$cookie.set('userid', this.userID, { expires: constant.cookieTimeout });
    },
    $route(val) {
      this.hasRobot = localStorage.getItem('appid');
      if (!this.ready) {
        return;
      }
      if (!this.getPrivilegeChange) {
        return;
      }
      this.checkPrivilege();
      this.endLoading();
      // debug-info
      this.getdebugInfoType(val);
      this.updateCommonModule(val);
    },
    showLanguage(val) {
      this.$i18n.locale = val;
      forceUpdate(this.$root);
    },
  },
  created() {
    this.initDataFromLocalStorage();
    this.$root.$on('open-chat-test', () => {
      this.chatTest = true;
    });
    this.$root.$on('close-chat-test', () => {
      this.chatTest = false;
    });
    this.getdebugInfoType(this.$route);
  },
  methods: {
    ...mapActions(['getEnv', 'getUIModule']),
    ...mapMutations([
      'setPrivilegeList',
      'setPageInfos',
      'setLeftNavbar',
      'setPrivilegedEnterprise',
      'setLicenseInfo',
      'setRobotList',
      'setUser',
      'setUserRoleMap',
      'setCurrentPage',
      'openChatTest',
      'closeChatTest',
      'setUserInfo',
      'setRobot',
      'setEnterprise',
      'setLanguage',
      'setUserRole',
      // 'showUserPreference',
      'setScreenHeight',
      'setScreenWidth',
      'setDimensionList',
      'setShowScenrioId',
      'setShowNodeScenrioId',
      'sethasDebugInfo',
      'setCurrentRoute',
    ]),
    initDataFromLocalStorage() {
      this.hasRobot = localStorage.getItem('appid');
      // 设置产品列表参数
      try {
        const products = JSON.parse(window.localStorage.getItem('products'));
        if (products && products.length) {
          this.productMenuList = products;
        }
      } catch (_) {
        console.log('no product list in local storage');
      }
      // 设置PageMenu - 左侧菜单栏参数 & 设置PageHeader - 顶部菜单栏左边参数
      try {
        const userPrivilege = JSON.parse(window.localStorage.getItem('userPrivilege'));
        if (userPrivilege) {
          const pageMenuParams = userPrivilege.filter(menu => menu.position === 'body_left') || [];
          const pageHeaderParams = userPrivilege.filter(menu => menu.position === 'nav_left_3') || [];
          if (pageMenuParams.length > 0) {
            this.setPageInfos(pageMenuParams);
            this.setLeftNavbar(pageHeaderParams);
          }
        }
      } catch (_) {
        console.log('no page menu params in local storage');
      }
      if (localStorage.getItem('currentRoute')) {
        const localCurrentRoute = localStorage.getItem('currentRoute');
        this.setCurrentRoute(localCurrentRoute);
        // this.currentRoute = localStorage.getItem('currentRoute');
      }
    },
    // 项目内部更新route之后，更新pageMenus的active item
    updateCommonModule(route) {
      const path = (((route.matched || [])[0] || {}).path || '').substring(1);
      const isExistInMenus = this.pageMensItemName.find(name => name === path);
      this.currentModule = isExistInMenus ? path : this.currentModule;
      localStorage.setItem('currentRoute', path);
      this.setCurrentRoute(path);
    },
    // debug-info type
    getdebugInfoType(val) {
      if (val.path === '/task-engine-scenario-v2') {
        this.showtagtype = '1';
        this.tagfalg = true;
      } else if (val.path.indexOf('scenario') > -1) {
        this.showtagtype = '3';
        this.tagfalg = true;
      } else {
        this.tagfalg = false;
      }
    },
    getTagTypes() {
      this.$api.getTagTypes().then((res) => {
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
    // getTagTypes() {
    //   this.$api.getTagTypes().then((res) => {
    //     const ret = res.result.map(category => ({
    //       id: category.id,
    //       text: category.name,
    //       allChecked: true,
    //       type: category.code,
    //       values: category.values.map(value => ({
    //         tagId: value.id,
    //         id: value.code,
    //         text: value.value,
    //         checked: false,
    //       })),
    //     }));
    //     // sort by type id
    //     ret.sort((a, b) => (a.id - b.id));
    //     this.tagTypeList = ret.filter(r => r.values.length > 0);
    //   });
    // },
    // 发送chat test 请求
    sendMessage(text, filter, isonline, chatNode) {
      this.$api.QATest(text, filter, isonline).then((res) => {
        // debug-info
        if (this.tagfalg && this.debugInfoEnv) {
          let numid = this.showidList.length;
          if (res.data.result.task_info) {
            const debugInfo = res.data.result.task_info.debugInfo;
            if (this.showtagtype === '1') {
              const id = debugInfo.scenarioidinfo[0];
              this.setShowScenrioId(id);
            } else if (this.showtagtype === '3') {
              debugInfo.nodeinfo.forEach((el) => {
                numid += 1;
                this.showidList.push({
                  num: numid,
                  NodeId: el.NodeId,
                  ScenarioId: el.ScenarioId,
                  info: el.info,
                });
              });
              this.setShowNodeScenrioId(this.showidList);
            }
          }
        }
        if (res.data.result.answers && res.data.result.answers.length > 0) {
          // old format use 'result' part in return obj
          this.$refs.qaTest.appendChatArrayDelay(res.data.result.answers, 'robot');
        } else if (res.data.data !== undefined) {
          // new format use 'data' part as answer
          this.$refs.qaTest.appendChatArrayDelay(res.data.data, 'robot');
        } else {
          this.$message({
            message: 'Chat Response Empty !',
            type: 'error',
          });
        }
        // // hack function，对于技能出话，转换其相关问格式为bfop标准格式
        // if (res.info.module === 'remote_skill') {
        //     let recommandIndex = -1;
        //     let recommandObj = {};

        //     res.data.forEach((item) => {
        //         if (item.type === 'text' && item.subType === 'recommand') {
        //             recommandIndex = res.data.indexOf(item);
        //             recommandObj = item;
        //         }
        //     })
        // }

        this.$refs.qaTest.handleAnalysis(chatNode, res.data);
      });
    },
    // 处理顶部菜单栏的事件
    handleSelectHeaderMenu(key) {
      if (key === 'chat-test') {
        this.chatTest = !this.chatTest;
      }
    },
    fetchProductMenu() {
      this.$api.fetchProducts(this.userID)
        .then((res) => {
          if (res.result && res.result instanceof Array) {
            // 判断是否和当前的productMenuList值相同，如果相同则不做操作，否则重新设置productMenuList
            // bug fix - 当用户已登录，信息已存入localStrorage后，Products发生变化时，客户端无法刷新问题
            const productCodes = res.result.map(v => v.code);
            const productCodesInStorage = this.productMenuList.map(v => v.code);
            if (productCodes.sort().join('-') !== productCodesInStorage.sort().join('-')) {
              this.productMenuList = res.result.map(v => ({
                ...v,
                toModule: v.code,
                toRoute: v.route,
                name: v.name,
                icon: v.icon,
              }));
              window.localStorage.setItem('products', JSON.stringify(this.productMenuList));
            }
          }
        });
    },
    fetchDimensionList() {
      this.$api.fetchDimensionList(this.robotID).then((res) => {
        if (res.status === 0 && res.result instanceof Array) {
          this.setDimensionList(res.result);
        }
      });
    },
    checkAuditRoute() {
      const that = this;
      const auditURL = [
        '/manage/audit-system',     // 0
        '/manage/audit-enterprise', // 1
        '/manage/audit-robot',      // 2
      ];
      const isAuditURL = that.$route.matched.reduce((val, match) =>
        val || auditURL.indexOf(match.path) !== -1, false);
      if (!isAuditURL) return false;

      // Users can only go to audit page according to it's previledge
      if (that.userInfo.type >= 2) {  // normal user
        if (auditURL.splice(that.userInfo.type).indexOf(that.$route.path) === -1) {
          that.$router.push('/manage/audit-robot');
        }
      } else if (that.userInfo.type === 1) {  // enterprise admin
        if (auditURL.splice(that.userInfo.type).indexOf(that.$route.path) === -1) {
          that.$router.push('/manage/audit-enterprise');
        }
      } // else system admin, can go wherever he/she wants
      return true;
    },
    checkPrivilege() {
      const that = this;
      const isAuditRoute = this.checkAuditRoute();
      if (isAuditRoute) {
        return;
      }
      // license过期
      if (!this.licenseInfo.license_exist && !this.licenseInfo.license_Probation) {
        this.$router.beforeEach((to, from, next) => {
          if (to.matched[0].path !== '/manage') {
            this.$router.push('/manage/robot-manage');
            return;
          }
          next();
        });
      }
      // special route for central controller system ui jump user info page
      if (that.$route.fullPath === '/manage/ccs/user-info') {
        that.$router.push('/manage/robot-manage');
        // that.showUserPreference();
        return;
      }
      // 当前没有选择企业，智能跳转到validURL中的地址
      if (that.enterpriseID === '') {
        if (that.userInfo.type >= 1) {
          that.$router.push('error');
          return;
        }
        // when enterprise is empty, path should only in enterprise list or system user list
        const validURL = [
          '/manage/user-preference',
          '/manage/enterprise-manage',
          '/manage/license',
          '/manage/system-admin-list',
          '/manage/audit-system',
          '/manage/system-setting',
        ];
        const valid = that.$route.matched.reduce((val, match) =>
          val || validURL.indexOf(match.path) >= 0, false);
        if (!valid) {
          that.$router.push('/manage/enterprise-manage');
          return;
        }
      }
      // 机器人id为空，只能跳转到管理页面 或 wiki页面
      if (that.robotID === '' && (!sessionStorage.getItem('appid') || sessionStorage.getItem('appid') === '')) {
        if (that.$route.path !== '/onlinewiki' && that.$route.path !== '/apiwiki' && that.$route.path !== '/bf/ssm' && that.$route.path !== '/api/login') {
          if (that.$route.matched.length <= 0 || that.$route.matched[0].path !== '/manage') {
            that.$router.push('/manage/robot-manage');
            return;
          }
        }
        return;
      }
      // check if user use 'last page' to go management page, not use button on page
      let isManage = false;
      that.$route.matched.forEach((route) => {
        if (route.path === '/manage') {
          if (that.robotID !== '') {
            that.setRobot('');
            isManage = true;
            // that.$router.push('/manage/robot-manage');
          } else if (that.enterpriseID !== '') {
            that.setEnterprise('');
            isManage = true;
            // that.$router.push('/manage/enterprise-manage');
          }
        }
      });
      if (isManage) {
        return;
      }
      if (that.$route.matched.length <= 0) {
        if (that.$route.fullPath === '/') {
          that.$router.push(defaultPath);
        } else if (that.$route.fullPath === '/manage/user-info') {
          that.$router.push(defaultPath);
          // that.showUserPreference();
        } else {
          that.$router.push('/error');
        }
        return;
      }
      const route = that.$route.matched[0];
      if (!route.components.default) {
        return;
      }
      const component = route.components.default;
      if (that.userInfo.type < 2 && component.privCode !== 'management') {
        // system admin and enterprise admin can use all module active in enterprise
        let foundPage = false;
        that.privilegeList.forEach((item) => {
          if (!item.sub_cmd) {
            return;
          }
          if (item.sub_cmd.findIndex(l => l.code === component.privCode) >= 0) {
            foundPage = true;
          }
        });
        if (!foundPage) {
          that.$router.push('error');
        }
      }
      if (component.privCode === 'management') {
        return;
      }
      // TODO: get user privilege of specific robot
      const privileges = [];
      // eslint-disable-next-line
      const userPrivilege = that.userPrivilege.length === 0 ? JSON.parse(localStorage.getItem('userPrivilege')) : that.userPrivilege;
      userPrivilege.forEach((item) => {
        if (!item.sub_cmd) {
          return;
        }
        item.sub_cmd.forEach((cmd) => {
          privileges.push(cmd.cmd_key);
        });
      });
      // If user has no privileges, invalid user
      // TODO: if user has no privileges of this robot, return to list
      if (privileges.length === 0) {
        that.$router.push('/manage/robot-manage');
        return;
      }
      if (privileges.indexOf(`${component.privCode}_view`) < 0
      && privileges.indexOf(`${component.privCode}_edit`) < 0
      && privileges.indexOf(`${component.privCode}_white_list`) < 0
      && privileges.indexOf(`${component.privCode}_data_sort`) < 0
      && privileges.indexOf(`${component.privCode}_search_sort`) < 0
      && privileges.indexOf(`${component.privCode}_data_manage`) < 0) {
        that.goPage(userPrivilege[0].sub_cmd[0]);
      }
    },
    goPage(page) {
      const that = this;
      if (page.is_link) {
        localStorage.setItem('path', page.route);
        window.location = `/${page.route}.html`;
      } else {
        this.$router.push({ path: `/${page.route}` });
      }
      that.setCurrentPage(page);
    },
    startLoading(msg, type = 'dot') {
      this.loadingType = type;
      this.showLoading = true;
      this.loadingMsg = msg;
    },
    endLoading() {
      this.showLoading = false;
    },
    setupPages() {
      // let pageModules = [];
      if (this.robotID === '') {
        return;
      }
      this.fetchPriviledgeMenus();
    },
    fetchPriviledgeMenus() {
      const that = this;
      that.$api.getMenuPages(that.enterpriseID).then((data) => {
        const pageMenuItems = data.body_left;
        pageMenuItems.forEach((pageModule) => {
          if (pageModule.sub_cmd && pageModule.sub_cmd.length) {
            pageModule.sub_cmd.forEach((menu) => {
              // remove after import new dkg
              if (that.$route.matched.length > 0 && `/${menu.route}` === that.$route.matched[0].path) {
                that.setCurrentPage(menu);
                setTimeout(() => {
                  that.showSwitchRobotLoading = false;
                }, 500);
              }
            });
          }
        });
        that.setPageInfos(pageMenuItems);
        const pageHeaderMenus = data.nav_left_3;
        if (pageHeaderMenus) {
          that.setLeftNavbar(pageHeaderMenus);
          that.showSwitchRobotLoading = false;
        }
        that.getPrivilegeChange = true;
        that.checkPrivilege();
      }).catch(() => {
        that.showSwitchRobotLoading = false;
      });
    },
    checkCookie() {
      const that = this;
      that.checkCookieLoop = undefined;
      if (!that.$cookie.get('verify')) {
        that.$logout(true);
        that.goLoginPage();
      } else if (that.checkCookieLoop === undefined) {
        that.checkCookieLoop = setTimeout(() => {
          that.checkCookie();
        }, that.checkCookieMs);
      }
    },
    goLoginPage(notification) {
      const that = this;
      const fullPath = that.$route.fullPath;

      const ssoLoginPath = that.environment.SSO_LOGIN_URL;
      if (ssoLoginPath) {
        window.location = `${ssoLoginPath}?redirect=${window.location}`;
        return;
      }
      if (notification) {
        window.location = `/login.html?invalid=1&redirect=${encodeURIComponent(fullPath)}`;
      } else {
        window.location = `/login.html?redirect=${encodeURIComponent(fullPath)}`;
      }
    },
    debugListener(e) {
      if (debugTimer) {
        clearTimeout(debugTimer);
        debugTimer = undefined;
      }

      const code = e.code;
      if (code === debugCodeArr[debugCodeIdx]) {
        debugCodeIdx += 1;
      } else if (code === debugCodeArr[0]) {
        debugCodeIdx = 1;
      }

      if (debugCodeIdx === debugCodeArr.length) {
        window.open('/version.html');
        debugCodeIdx = 0;
      } else if (debugCodeIdx !== 0) {
        debugTimer = setTimeout(() => {
          debugCodeIdx = 0;
        }, 500);
      }
    },
    loadLogo() {
      const that = this;
      axios.get(that.$api.getIconURL('favicon'))
        .then(() => {
          misc.changeFavicon(that.$api.getIconURL('favicon'));
        })
        .catch(() => {
          misc.changeFavicon('/static/favicon.png');
        });
      axios.get(this.$api.getIconURL('app'))
        .then(() => {
          if (this.$refs.emotiProductMenu) {
            this.$refs.emotiProductMenu.enterprisePic = this.$api.getIconURL('app');
          }
        })
        .catch(() => {
          if (this.$refs.logo) {
            this.$refs.logo.classList.add('default');
            this.$refs.logo.style.backgroundImage = '';
          }
        });
      // }
        // .then(() => {
        //   if (this.$refs.logo) {
        //     this.$refs.logo.style.backgroundImage =
        // `url("${this.$api.getIconURL('app', that.enterpriseID)}")`;
        //   }
        // }, () => this.$api.validateGetIconURL('app', '').then(() => {
        //   if (this.$refs.logo) {
        //     this.$refs.logo.style.backgroundImage = `url("${this.$api.getIconURL('app', '')}")`;
        //   }
        // }));
      // } catch (err) {
      //   console.log(err);
      //   if (this.$refs.logo) {
      //     this.$refs.logo.classList.add('default');
      //     this.$refs.logo.style.backgroundImage = '';
      //   }
      // }

      // that.$api.validateGetIconURL('favicon', that.enterpriseID).then(() => {
      //   misc.changeFavicon(that.$api.getIconURL('favicon', that.enterpriseID));
      // }, () => that.$api.getIcon('favicon', '').then(() => {
      //   misc.changeFavicon(that.$api.getIconURL('favicon', ''));
      // }))
      // .catch(() => {
      //   misc.changeFavicon('/static/favicon.png');
      // });
    },
    setup() {
      const that = this;

      misc.setPageTitle(that.$t('general.system_name_default'));
      that.loadLogo();

      const token = that.$getToken();
      // that.checkCookie();
      that.$setReqToken(token);
      this.getEnv.call(null, this)
      .then(() => this.getUIModule.call(null, this))
      .then(() => {}, () => {
        console.log('Get UI modules Fail');
      })
      .then(() => this.$api.getLicenseInfo())
      .then((res) => {
        if (res.status >= 0) {
          that.setLicenseInfo(res.result);
        }
      })
      .then(() => that.$setIntoWithToken(token))
      .then(() => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));

        let getUserInfoPromise;
        if (userInfo.type === 0) {
          getUserInfoPromise = that.$api.getAdmin(userInfo.id);
        } else {
          getUserInfoPromise = that.$api.getEnterpriseUser(userInfo.enterprise, userInfo.id);
        }
        return getUserInfoPromise;
      })
      .then((data) => {
        const enterpriseList = that.$getUserEnterprises();
        that.userInfo = data;
        that.setUser(data.id);
        that.setUserInfo(data);
        that.setPrivilegedEnterprise(enterpriseList);

        if (data.type !== 0) {
          const robots = that.$getRobots();
          // const userRoleMap = JSON.parse(localStorage.getItem('roleMap'));
          that.setRobotList(robots);
          // that.setUserRoleMap(userRoleMap);
          that.setPrivilegeList(that.$getPrivModules());
        }
        let promise = new Promise(r => r());
        const lastRobot = window.sessionStorage.getItem('appid');
        const lastEnterprise = window.sessionStorage.getItem('enterprise');
        if (enterpriseList.findIndex(e => e.id === lastEnterprise) >= 0) {
          promise = promise
            .then(() => that.$api.getEnterpriseModules(lastEnterprise))
            .then((datas) => {
              const showModules = datas.filter(mod => mod.is_show);
              localStorage.setItem('enterprise', lastEnterprise);
              localStorage.setItem('modules', JSON.stringify(showModules));
              this.setEnterprise(lastEnterprise);
            })
            .then(() => that.$loadRobotOfUser(that.userInfo))
            .then((robots) => {
              that.setRobotList(robots);
              that.setPrivilegeList(that.$getPrivModules());
              return robots;
            })
            .then((robots) => {
              if (robots.findIndex(e => e.id === lastRobot) >= 0) {
                const p = new Promise(r => r());
                return p.then(() => {
                  that.setRobot(lastRobot);
                });
              }
              return new Promise(r => r());
            });
        }

        promise.then(() => {
          that.ready = true;
          that.setupPages();
          that.checkPrivilege();
        });
      })
      .then(() => {})
      .then(() => {
        // this.getTagTypes();
        this.fetchProductMenu();
      })
      .catch((err) => {
        console.log(err);
        that.goLoginPage();
      });

      that.$root.$on('pop-window', () => {
        that.$nextTick(() => {
          that.isBackgroundBlur = that.$isBackgroundBlur();
        });
      });
      that.$root.$on('close-window', () => {
        that.$nextTick(() => {
          that.isBackgroundBlur = that.$isBackgroundBlur();
        });
      });
      that.$root.$on('open-chat-test', () => {
        that.openChatTest();
      });
      that.$root.$on('close-chat-test', () => {
        that.closeChatTest();
      });

      that.$root.$on('reload-logo', () => {
        that.loadLogo();
      });
      window.addEventListener('keydown', that.debugListener);
      // 添加响应事件，屏幕大小改变时重新获取屏幕宽高度
      window.addEventListener('resize', () => {
        this.onResizeScreenInfo();
      });
      // 默认先计算一次高度
      this.onResizeScreenInfo();
    },
    // 设置屏幕尺寸
    onResizeScreenInfo() {
      window.screenHeight = document.documentElement.clientHeight || document.body.clientHeight;
      window.screenWidth = document.documentElement.clientWidth || document.body.clientWidth;
      this.setScreenHeight(window.screenHeight);
      this.setScreenWidth(window.screenWidth);
    },
    getdebugInfoEnv() {
      this.$api.taskConfig()
        .then((data) => {
          const hasDebugInfo = data.task_engine_v2.enable_debug_info;
          this.sethasDebugInfo(hasDebugInfo);
        });
    },
    clearShowNode() {
      this.showidList = [];
      this.setShowNodeScenrioId(this.showidList);
    },
  },
  mounted() {
    this.hasRobot = localStorage.getItem('appid');
    this.setup();
    this.setLanguage(this.$i18n.locale);
    // debug-info
    this.getdebugInfoEnv();
    bus.$on('clearShowNode', this.clearShowNode);
  },
};
</script>

<style lang="scss">
@import "styles/reset.scss";
@import "styles/main.scss";
@import "styles/editors.scss";
@import "styles/elementui_reset.scss";

@import './assets/styles/lib/font-awesome.css';

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  @include font-14px();
  color: $color-font-mark;
  .loading-msg {
    margin-top: 20px;
  }
}
.app-loading-container{
  margin-top: 50px;
  margin-left: 240px;
  position: relative;
  height: 100vh;
  background: #fff;
  z-index: 1000;
  /deep/ .loading {
    background: #fff;
    height: 100vh;
    position: absolute;
    margin-left: calc(50% - 50px);
  }
}
.text-button{
  min-width: 75px !important;
}
.qa-test-box {
  > div {
    z-index: 10;
  }
}
</style>
