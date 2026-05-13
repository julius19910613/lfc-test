export const robotID = s => s.appid;
export const robotList = (s) => {
  const ret = [];
  Object.keys(s.robotList).forEach((key) => {
    ret.push({
      id: key,
      name: s.robotList[key].name || '',
      description: s.robotList[key].description || '',
      languageId: s.robotList[key].props ? s.robotList[key].props[0].id : '',
      languageName: s.robotList[key].props ? s.robotList[key].props[0].p_name : '',
    });
  });
  return ret;
};
export const robotName = (s) => {
  const appid = s.appid;
  localStorage.setItem('robotName', appid in s.robotList ? s.robotList[appid].name : '');
  return appid in s.robotList ? s.robotList[appid].name : '';
};

export const robotDialogueLang = (s) => {
  let lang = '';
  const robotInfo = s.robotList[s.appid];
  lang = robotInfo && robotInfo.props ? robotInfo.props[0].p_value : '';
  return lang;
};

export const enterpriseID = s => s.enterpriseID;
export const enterpriseName = (s) => {
  const eID = s.enterpriseID;
  return eID in s.enterpriseList ? s.enterpriseList[eID].name : '';
};
export const enterpriseList = (s) => {
  const ret = [];
  Object.keys(s.enterpriseList).forEach((key) => {
    ret.push({
      enterpriseID: key,
      name: s.enterpriseList[key].name,
      description: s.enterpriseList[key].description || '',
    });
  });
  return ret;
};

export const privilegeList = s => s.privilegeList;

// 语音设置
export const voiceSet = (s) => {
  const env = s.env;
  let setFlag = true;
  if (env.ENABLE_TE_TTS_MODULE === '1') {
    setFlag = true;
  } else {
    setFlag = false;
  }
  return setFlag;
};
// debug_info的控制变量
export const debugInfoEnv = s => s.debugInfoEnv;

export const privilegeMap = (s) => {
  const map = {};
  s.privilegeList.forEach((priv) => {
    map[priv.privilege_name] = priv;
  });
  return map;
};
// 功能场景 开关
export const funcScenFlag = (s) => {
  const env = s.env;
  let setFlag = true;
  if (env.ENABLE_TE_FUNC_SCENARIO === '1') {
    setFlag = true;
  } else {
    setFlag = false;
  }
  return setFlag;
};

export const userID = s => s.userID;
export const userRole = s => s.userRole;
export const userRoleMap = s => s.userRoleMap;
export const currentPage = s => s.curPage;
export const isChatOpen = s => s.chatTest;
export const userInfo = s => s.userInfo;

// 当前企业的菜单栏权限，包含左侧&顶部
export const userPrivilege = (s) => {
  if (s.pageInfos.length > 0) {
    localStorage.setItem('userPrivilege', JSON.stringify([...s.pageInfos, ...s.leftNavBar]));
  }
  return [...s.pageInfos, ...s.leftNavBar];
};

// PageMenu - 左侧菜单栏参数
export const pageMenuParams = (s) => {
  const authMenuPages = s.pageInfos || [];
  // Map menus to PageMenu component parameters
  const newMenuPages = [];
  authMenuPages.forEach((menu) => {
    if (menu.is_show) {
      const newMenuItems = [];
      if (menu.sub_cmd && menu.sub_cmd instanceof Array) {
        menu.sub_cmd.forEach((subMenu) => {
          if (subMenu.is_show) {
            newMenuItems.push({
              name: subMenu.name,
              toModule: subMenu.is_link ? subMenu.route : 'bf',
              toRoute: subMenu.route,
            });
          }
        });
      }
      newMenuPages.push({
        name: menu.name,
        toModule: menu.is_link ? menu.route : 'bf',
        toRoute: menu.route,
        type: 1,
        icon: menu.icon,
        items: newMenuItems,
      });
    }
  });
  return newMenuPages;
};
// PageHeader - 顶部菜单栏左边菜单参数
export const pageHeaderParams = (s) => {
  const headerMenus = s.leftNavBar || [];
  const topLeftMenus = headerMenus.map(v => ({
    key: v.cmd_key,
    title: v.name,
    icon: v.icon,
    type: 1,
    items: v.sub_cmd && v.sub_cmd.length ? v.sub_cmd.map(itemV => ({
      key: itemV.cmd_key,
      title: itemV.name,
      isRouter: true,
      toModule: '',
      toRoute: itemV.route,
    })) : [],
  }));
  return topLeftMenus;
};

export const hasPrivilege = s => (mod, cmd) => {
  const privs = userPrivilege(s) || [];
  let hasRight = false;
  if (privs.length <= 0) {
    return false;
  }
  privs.forEach((priv) => {
    if (!priv.sub_cmd) {
      return;
    }
    if (priv.sub_cmd.findIndex(item => item.cmd_key === `${mod}_${cmd}`) >= 0) {
      hasRight = true;
    }
  });
  return hasRight;
};

export const showUserInfoPage = s => s.showUserInfo;

export const showLanguage = (s) => {
  if (s.locale) {
    return s.locale;
  }

  let ret = localStorage.getItem('locale');
  if (!ret) {
    ret = 'zh-cn';
  }
  return ret;
};

export const environment = s => s.env;
export const UIModules = s => s.uiModules;
export const showscenrioId = s => s.showscenrioId;
export const showNodescenrioId = s => s.showNodescenrioId;
export const screenHeight = s => s.screenHeight;
export const screenWidth = s => s.screenWidth;
export const licenseInfo = s => s.licenseInfo;
export const dimensionList = s => s.dimensionList;
export const currentRoute = s => s.currentRoute;
