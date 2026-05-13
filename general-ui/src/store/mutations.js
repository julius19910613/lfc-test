import * as types from './mutations_type';

export const state = {
  appid: '',
  robotList: {},
  orgId: '',
  enterpriseID: '',
  enterpriseList: {},

  privilegeList: [],
  pageInfos: [],
  leftNavBar: [],
  curPage: {},
  userID: '',
  userRole: [],
  userRoleMap: {},
  chatTest: false,
  userInfo: {},
  showUserInfo: false,
  locale: '',
  env: {
    IM_ENABLE: false,
    ENABLE_TDE_MODULE: false,
  },
  uiModules: [],
  showscenrioId: '',
  showNodescenrioId: [],
  screenHeight: 0,
  screenWidth: 0,
  licenseInfo: {},
  debugInfoEnv: false,
  dimensionList: [],
  currentRoute: 'statistic-dash',
};

export const mutations = {
  [types.SET_PRIVILEGED_ENTERPRISES]: (s, enterpriseList) => {
    s.enterpriseList = {};
    enterpriseList.forEach((enterprise) => {
      s.enterpriseList[enterprise.id] = enterprise;
    });

    const keys = Object.keys(s.enterpriseList);
    // If only one enterprise, it is normal user or enterprise admin
    if (keys.length === 1 && s.userInfo.type >= 1) {
      s.enterpriseID = keys[0];
      window.localStorage.setItem('enterprise', s.enterpriseID);
      window.sessionStorage.setItem('enterprise', s.enterpriseID);
    }
  },
  [types.SET_ROBOT]: (s, appid) => {
    window.localStorage.setItem('appid', appid);
    window.sessionStorage.setItem('appid', appid);
    if (s.appid === appid) {
      return;
    }

    if (appid in s.robotList) {
      s.appid = appid;
    } else {
      s.appid = '';
    }
  },
  [types.SET_ROBOT_LIST]: (s, robotList) => {
    window.localStorage.setItem('robots', JSON.stringify(robotList));
    s.robotList = {};

    robotList.forEach((robot) => {
      s.robotList[robot.id] = robot;
    });

    if (Object.keys(s.robotList).indexOf(s.appid) < 0) {
      s.appid = '';
    }
  },
  [types.SET_ENTERPRISE]: (s, enterpriseID) => {
    window.localStorage.setItem('enterprise', enterpriseID);
    window.sessionStorage.setItem('enterprise', enterpriseID);
    if (s.enterpriseID === enterpriseID) {
      return;
    }

    if (enterpriseID in s.enterpriseList) {
      s.enterpriseID = enterpriseID;
    } else {
      s.enterpriseID = '';
    }
  },
  [types.SET_PRIVILEGE_LIST]: (s, privilegeList) => {
    s.privilegeList = privilegeList;
  },
  [types.SET_PAGES]: (s, pageInfos) => {
    const pageMenu = pageInfos;
    s.pageInfos = [];
    pageMenu.forEach((info) => {
      const infoSubCmds = info.sub_cmd || [];
      const idx = infoSubCmds.findIndex(p => p.route === s.curPage.route);
      if (idx >= 0) {
        info.expanded = true;
      } else {
        info.expanded = false;
      }
    });
    console.log('setPageInfos');
    s.pageInfos = pageMenu;
    localStorage.setItem('userPrivilege', JSON.stringify([...s.pageInfos, ...s.leftNavBar]));
  },
  [types.SET_LEFT_NAV_BAR]: (s, pageInfos) => {
    s.leftNavBar = pageInfos;
    localStorage.setItem('userPrivilege', JSON.stringify([...s.pageInfos, ...s.leftNavBar]));
  },
  [types.SET_USER]: (s, userID) => {
    s.userID = userID;
  },
  [types.SET_USER_ROLE]: (s, role) => {
    s.userRole = role;
  },
  [types.SET_USER_ROLE_MAP]: (s, roleMap) => {
    s.userRoleMap = roleMap;
  },
  [types.SET_CUR_PAGE]: (s, curPage) => {
    s.curPage = curPage;
    // current page may set before all page info is set
    s.pageInfos.forEach((info) => {
      const infoSubCmds = info.sub_cmd || [];
      const idx = infoSubCmds.findIndex(p => p.route === curPage.route);
      if (idx >= 0) {
        info.expanded = true;
      } else {
        info.expanded = false;
      }
    });
  },
  [types.TOGGLE_PAGE_CATEGORY]: (s, code) => {
    const pageMenu = s.pageInfos.concat();
    s.pageInfos = [];
    const expandIdx = pageMenu.findIndex(page => page.code === code);
    if (expandIdx < 0) {
      return;
    }
    pageMenu[expandIdx].expanded = !pageMenu[expandIdx].expanded;
    if (pageMenu[expandIdx].expanded) {
      pageMenu.forEach((info, idx) => {
        if (idx !== expandIdx) {
          info.expanded = false;
        }
        if (info.sub_cmd.findIndex(menu => menu.cmd_key === s.curPage.cmd_key) >= 0) {
          info.expanded = true;
        }
      });
    }
    s.pageInfos = pageMenu;
  },
  [types.OPEN_CHAT_TEST]: (s) => {
    s.chatTest = true;
  },
  [types.CLOSE_CHAT_TEST]: (s) => {
    s.chatTest = false;
  },
  [types.SET_USER_INFO]: (s, info) => {
    s.userInfo = info;
  },
  [types.SHOW_USER_PREFERENCE]: (s) => {
    s.showUserInfo = true;
  },
  [types.HIDE_USER_PREFERENCE]: (s) => {
    s.showUserInfo = false;
  },
  [types.SET_LANGUAGE]: (s, language) => {
    s.locale = language;
    localStorage.setItem('locale', language);
  },
  [types.SET_ENV]: (s, env) => {
    s.env = env;
  },
  [types.SET_UI_MODULES]: (s, modules) => {
    s.uiModules = modules;
  },
  [types.SET_SHOW_SCENRIOID]: (s, id) => {
    s.showscenrioId = id;
  },
  [types.SET_SHOW_NODESCENRIOID]: (s, id) => {
    s.showNodescenrioId = id;
  },
  [types.SET_SCREEN_HEIGHT]: (s, payload) => {
    s.screenHeight = payload;
  },
  [types.SET_SCREEN_WIDTH]: (s, payload) => {
    s.screenWidth = payload;
  },
  [types.SET_LICENSE_INFO]: (s, info) => {
    s.licenseInfo = {};
    s.licenseInfo = info;
    localStorage.setItem('licenseInfo', JSON.stringify(info));
  },
  [types.SET_DIMENSION_LIST]: (s, info) => {
    s.dimensionList = info;
  },
  [types.SET_HASDEBUG_INFO]: (s, info) => {
    s.debugInfoEnv = info;
  },
  [types.SET_CURRENT_ROUTE]: (s, curroute) => {
    s.currentRoute = curroute;
    localStorage.setItem('currentRoute', curroute);
  },
};
