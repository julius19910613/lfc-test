<template>
  <div id="app">
    <page-header
      :currentModule="currentModule"
      :customMenus="headerData"
      @clickMenu="handleSelectHeaderMenu"
      :customHomeMenu="customHomeMenu"
    ></page-header>
    <product-menu :currentModule="currentModule" :productMenuList="productMenuList"></product-menu>
    <page-menu :currentModule="currentModule" :menuPages="menuData"
    :currentRoute="currentRoute"></page-menu>
    <div class="card-panel" @click="handleBlur2HideCB">
      <router-view></router-view>
    </div>
    <qa-test
      class="qa-test-box"
      :robotName="robotInfo.robotName"
      :chatTest="chatTest"
      :tagTypes="tagTypeList"
      ref="qaTest"
      @qaRequest="sendMessage"
    ></qa-test>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import api from './js/http/requests';

const localData = require('./js/mockdata/localstorage');

export default {
  $api: api,
  name: 'App',
  data() {
    return {
      currentModule: 'wiki',
      logo_url: '',
      customHomeMenu: {
        title: '在线文档',
        isRouter: true,
        toModule: '',
        toRoute: '',
        icon: 'header_robot_list',
      },
      enterpriseId: '',
      enterpriseInfo: {},
      robotInfo: {},
      userInfo: {},
      productMenuList: [],
      headerData: {},
      currentPage: {},
      privilege_local: [],
      testWidth: 700,
      chatTest: false,
      tagTypeList: [],
      headerPrivilegeLocal: [],
      licenseSwitch: false,
    };
  },
  computed: {
    currentRoute() {
      if (this.$route.path && this.$route.path.indexOf('/api/') !== -1) {
        return 'bf/ssm';
      }
      return 'api/login';
    },
    menuData() {
      if (this.$route.path && this.$route.path.indexOf('/api/') !== -1) {
        return this.apiDocsMenuData;
      }
      return this.productDocsMenuData;
    },
    productDocsMenuData() {
      return [
        {
          name: '机器人平台',
          toModule: this.currentModule,
          toRoute: '',
          type: 1,
          icon: 'icon-knowledge-graph',
          items: [
            {
              name: '标准问题',
              toModule: this.currentModule,
              toRoute: 'bf/ssm',
            },
            {
              name: '任务引擎',
              toModule: this.currentModule,
              toRoute: 'bf/te',
            },
            {
              name: '机器人技能',
              toModule: this.currentModule,
              toRoute: 'bf/skill',
            },
            {
              name: '意图引擎',
              toModule: this.currentModule,
              toRoute: 'bf/intent',
            },
            {
              name: '知识推理引擎',
              toModule: this.currentModule,
              toRoute: 'bf/dkg',
            },
            {
              name: '文本解析器',
              toModule: this.currentModule,
              toRoute: 'bf/ner',
            },
            {
              name: '词库',
              toModule: this.currentModule,
              toRoute: 'bf/wordbank',
            },
          ],
        },
        {
          name: '电话机器人',
          toModule: this.currentModule,
          toRoute: '',
          type: 1,
          icon: 'icon-knowledge-graph',
          items: [
            {
              name: '展板',
              toModule: this.currentModule,
              toRoute: 'ccbot/DashBoard',
            },
            {
              name: '任务管理',
              toModule: this.currentModule,
              toRoute: 'ccbot/TaskManage',
            },
            {
              name: '运营管理',
              toModule: this.currentModule,
              toRoute: 'ccbot/MaintainManage',
            },
            {
              name: '报表中心',
              toModule: this.currentModule,
              toRoute: 'ccbot/ReportCenter',
            },
          ],
        },
        {
          name: '质检机器人',
          toModule: this.currentModule,
          toRoute: '',
          type: 1,
          icon: 'icon-knowledge-graph',
          items: [
            {
              name: '报表管理',
              toModule: this.currentModule,
              toRoute: 'qabot/ReportManage',
            },
            {
              name: '质检通话列表',
              toModule: this.currentModule,
              toRoute: 'qabot/CallList',
            },
          ],
        },
        {
          name: '销售助手',
          toModule: this.currentModule,
          toRoute: '',
          type: 1,
          icon: 'icon-knowledge-graph',
          items: [
            {
              name: '优质客户',
              toModule: this.currentModule,
              toRoute: 'sa/custom',
            },
            {
              name: '会话历史',
              toModule: this.currentModule,
              toRoute: 'sa/history',
            },
            {
              name: '管理设置',
              toModule: this.currentModule,
              toRoute: 'sa/manage',
            },
          ],
        },
        {
          name: '坐席助手',
          toModule: this.currentModule,
          toRoute: '',
          type: 1,
          icon: 'icon-knowledge-graph',
          items: [
            {
              name: '坐席地图',
              toModule: this.currentModule,
              toRoute: 'csa/map',
            },
            {
              name: '系统设置',
              toModule: this.currentModule,
              toRoute: 'csa/system',
            },
            {
              name: '会话分析',
              toModule: this.currentModule,
              toRoute: 'csa/csaDialog',
            },
            {
              name: '通话状态',
              toModule: this.currentModule,
              toRoute: 'csa/csaChat',
            },
            {
              name: '助手启动',
              toModule: this.currentModule,
              toRoute: 'csa/helper',
            },
          ],
        },
        {
          name: '长文本标注平台',
          toModule: this.currentModule,
          toRoute: '',
          type: 1,
          icon: 'icon-knowledge-graph',
          items: [
            {
              name: '长文本标注平台',
              toModule: this.currentModule,
              toRoute: 'aq/AqLong',
            },
          ],
        },
        {
          name: '语音平台',
          toModule: this.currentModule,
          toRoute: '',
          type: 1,
          icon: 'icon-knowledge-graph',
          items: [
            {
              name: '语音平台指南',
              toModule: this.currentModule,
              toRoute: 'asr/asr',
            },
          ],
        },
        {
          name: '运维管理',
          toModule: this.currentModule,
          toRoute: '',
          type: 1,
          icon: 'icon-knowledge-graph',
          items: [
            {
              name: '查看监控',
              toModule: this.currentModule,
              toRoute: 'maintenance/viewwatch',
            },
            {
              name: '常见错误处理',
              toModule: this.currentModule,
              toRoute: 'maintenance/errorhandle',
            },
            {
              name: '机器初始化',
              toModule: this.currentModule,
              toRoute: 'maintenance/initmachine',
            },
            {
              name: '日志查看',
              toModule: this.currentModule,
              toRoute: 'maintenance/viewlog',
            },
            {
              name: '使用脚本部署bf2020产品',
              toModule: this.currentModule,
              toRoute: 'maintenance/deploy2020',
            },
          ],
        },
      ];
    },
    apiDocsMenuData() {
      return [
        {
          name: '登录',
          toModule: this.currentModule,
          toRoute: '',
          type: 1,
          icon: 'icon-knowledge-graph',
          items: [
            {
              name: '登录接口',
              toModule: this.currentModule,
              toRoute: 'api/login',
            },
          ],
        },
        {
          name: '机器人',
          toModule: this.currentModule,
          toRoute: '',
          type: 1,
          icon: 'icon-knowledge-graph',
          items: [
            {
              name: '创建机器人',
              toModule: this.currentModule,
              toRoute: 'api/robotAdd',
            },
            {
              name: '初始化机器人数据',
              toModule: this.currentModule,
              toRoute: 'api/robotData',
            },
          ],
        },
        {
          name: '对话',
          toModule: this.currentModule,
          toRoute: '',
          type: 1,
          icon: 'icon-knowledge-graph',
          items: [
            {
              name: '对话接口',
              toModule: this.currentModule,
              toRoute: 'api/dialog',
            },
          ],
        },
        {
          name: '问答管理',
          toModule: this.currentModule,
          toRoute: '',
          type: 1,
          icon: 'icon-knowledge-graph',
          items: [
            {
              name: '发布标准问语料',
              toModule: this.currentModule,
              toRoute: 'api/dac',
            },
            {
              name: '上传文件状态',
              toModule: this.currentModule,
              toRoute: 'api/upload',
            },
            {
              name: '修改回答',
              toModule: this.currentModule,
              toRoute: 'api/answer',
            },
            {
              name: '修改语料',
              toModule: this.currentModule,
              toRoute: 'api/lq',
            },
            {
              name: '删除某测试题',
              toModule: this.currentModule,
              toRoute: 'api/testset',
            },
            {
              name: '删除某语料',
              toModule: this.currentModule,
              toRoute: 'api/deletelq',
            },
            {
              name: '上传文件（标准问回答，语料，测试题）',
              toModule: this.currentModule,
              toRoute: 'api/dacupload',
            },
            {
              name: '回答发布',
              toModule: this.currentModule,
              toRoute: 'api/status',
            },
            {
              name: '新增回答',
              toModule: this.currentModule,
              toRoute: 'api/addanswer',
            },
            {
              name: '新增标准问',
              toModule: this.currentModule,
              toRoute: 'api/sq',
            },
            {
              name: '新增语料',
              toModule: this.currentModule,
              toRoute: 'api/addlq',
            },
            {
              name: '训练',
              toModule: this.currentModule,
              toRoute: 'api/train',
            },
            {
              name: '训练状态',
              toModule: this.currentModule,
              toRoute: 'api/trainstatus',
            },
          ],
        },
        {
          name: '数据优化',
          toModule: this.currentModule,
          toRoute: '',
          type: 1,
          icon: 'icon-knowledge-graph',
          items: [
            {
              name: '日志管理查询',
              toModule: this.currentModule,
              toRoute: 'api/records',
            },
            {
              name: '热门问题',
              toModule: this.currentModule,
              toRoute: 'api/question',
            },
          ],
        },
        {
          name: '满意度',
          toModule: this.currentModule,
          toRoute: '',
          type: 1,
          icon: 'icon-knowledge-graph',
          items: [
            {
              name: '会话满意度调查',
              toModule: this.currentModule,
              toRoute: 'api/feedback',
            },
            {
              name: '对话解决未解决',
              toModule: this.currentModule,
              toRoute: 'api/chat',
            },
          ],
        },
        {
          name: '词库（v1）',
          toModule: this.currentModule,
          toRoute: '',
          type: 1,
          icon: 'icon-knowledge-graph',
          items: [
            {
              name: '词库上传',
              toModule: this.currentModule,
              toRoute: 'api/dictionary',
            },
            {
              name: '词库增量新增',
              toModule: this.currentModule,
              toRoute: 'api/uploadIncrement',
            },
          ],
        },
        {
          name: '词库（v2）',
          toModule: this.currentModule,
          toRoute: '',
          type: 1,
          icon: 'icon-knowledge-graph',
          items: [
            {
              name: '更新主词',
              toModule: this.currentModule,
              toRoute: 'api/wordbank',
            },
            {
              name: '新增同义词',
              toModule: this.currentModule,
              toRoute: 'api/similar',
            },
            {
              name: '删除同义词',
              toModule: this.currentModule,
              toRoute: 'api/deletesimilar',
            },
            {
              name: '新增主词',
              toModule: this.currentModule,
              toRoute: 'api/addv2',
            },
            {
              name: '移动主词',
              toModule: this.currentModule,
              toRoute: 'api/move',
            },
            {
              name: '更新同义词',
              toModule: this.currentModule,
              toRoute: 'api/updatev2',
            },
            {
              name: '批量删除词库主词',
              toModule: this.currentModule,
              toRoute: 'api/deletev2',
            },
          ],
        },
        {
          name: '知识推理引擎',
          toModule: this.currentModule,
          toRoute: '',
          type: 1,
          icon: 'icon-knowledge-graph',
          items: [
            {
              name: '更新属性',
              toModule: this.currentModule,
              toRoute: 'api/property',
            },
            {
              name: '删除实体',
              toModule: this.currentModule,
              toRoute: 'api/deleteEntity',
            },
            {
              name: '开始训练',
              toModule: this.currentModule,
              toRoute: 'api/trainTrigger',
            },
            {
              name: '获取训练状态',
              toModule: this.currentModule,
              toRoute: 'api/trainResult',
            },
            {
              name: '同步生产环境',
              toModule: this.currentModule,
              toRoute: 'api/synchronize',
            },
          ],
        },
      ];
    },
  },
  created() {
    if (process.env.NODE_ENV === 'development') {
      this.setLocalStorage();
    }
    this.setRobotId(localStorage.getItem('appid'));
    this.enterpriseId = localStorage.getItem('enterprise');
    this.enterpriseInfo = {
      name: localStorage.getItem('enterprise'),
      enterpriseName: JSON.parse(localStorage.getItem('enterpriseInfo'))[0].name,
    };
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
    this.robotInfo = {
      robotID: localStorage.getItem('appid'),
      robotName: localStorage.getItem('robotName'),
    };
    // bug fix
    // if (!localStorage.getItem('token') || !localStorage.getItem('appid')) {
    //   window.location = '/#/manage/robot-manage';
    //   return;
    // }
    this.$root.$on('open-chat-test', () => {
      this.chatTest = true;
    });
    this.$root.$on('close-chat-test', () => {
      this.chatTest = false;
    });
  },
  mounted() {
    // 获取页签
    this.fetchProductMenu();
    this.$api
      .apiGetParserList()
      .then((res) => {
        this.setParsersList(res || []);
      })
      .catch(() => {
        this.$message({
          message: '获取数据失败',
          type: 'error',
        });
      });
    // 获取API数据
    this.$api
      .apiGetIntentsList()
      .then((res) => {
        this.setIntentsList(res.result || []);
      })
      .catch(() => {
        this.$message({
          message: '获取数据失败',
          type: 'error',
        });
      });
    this.getTagTypes();
  },
  methods: {
    ...mapActions(['setIntentsList', 'setParsersList', 'setRobotId']),
    // this.fetchProductMenu();
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
    getIconURL(iconType, enterprise) {
      return `api/v1/ui/logo?type=${iconType}${
        enterprise ? `&enterprise=${enterprise}` : ''
      }`;
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
    fetchProductMenu() {
      this.$api.apiGetProductsList(this.userInfo.id).then((res) => {
        const list = res && res.result ? res.result : [];
        if (list && list instanceof Array) {
          this.productMenuList = [];
          list.forEach((item) => {
            this.productMenuList.push({
              toModule: item.code,
              toRoute: item.route,
              name: item.name,
              icon: item.icon,
            });
          });
        }
      });
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
        ret.sort((a, b) => a.id - b.id);
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
    // 处理顶部菜单栏的事件
    handleSelectHeaderMenu(key) {
      if (key === 'chat-test') {
        this.chatTest = true;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./assets/scss/index";
#app {
  width: 100%;
  height: 100%;
  background: #eeeeee;
  .card-panel {
    flex: 1;
    width: calc(100% - 250px);
    height: calc(100% - 60px);
    @extend .white-panel;
    margin-left: 240px;
    margin-top: 50px;
    box-sizing: border-box;
    > div {
      position: absolute;
    }
  }
  .qa-test-box {
    z-index: 1000;
    position: relative;
  }
}
</style>
