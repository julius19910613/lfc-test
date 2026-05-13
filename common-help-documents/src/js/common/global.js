// eslint-disable-next-line
// 设置cookie
function setCookie(cname, cvalue, exdays, path) {
  // cname  cookie名
  // cvalue =  cookie值
  // exdays = cookie 过期时间(天)
  const d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  const expires = `expires=${d.toUTCString()}`;
  if (path && path === '/BF') {
    document.cookie = `${cname}=${cvalue};${expires}; path=/BF`;
  } else {
    document.cookie = `${cname}=${cvalue};${expires}; path=/`;
  }
}
// 获取cookie
function getCookie(cname) {
  const name = `${cname}=`;
  const ca = document.cookie.split(';');
  let cookie = '';
  ca.forEach((val) => {
    let item = val;
    if (item.charAt(0) === ' ') {
      item = item.substring(1);
    }
    if (item.indexOf(name) !== -1) {
      cookie = item.substring(name.length, item.length);
    }
    return false;
  });
  return cookie;
}
// 清除cookie
function clearCookie(cname, path) {
  setCookie(cname, '', -1, path);
}

// 清除所有cookie
function clearAllCookie(path) {
  // eslint-disable-next-line
  const cookies = document.cookie.split(';').map((ckey) => {
    return ckey.split('=')[0].trim();
  });
  cookies.forEach((c) => {
    clearCookie(c, path);
  });
}

// 输出数字用千分号分隔
function formatNumberRgx(num) {
  const parts = num.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
}

// 数组按关键字去重
function uniqueArr(arr, key) {
  const result = [];
  const hash = {};
  arr.forEach((val) => {
    const elem = val[key];
    if (!hash[elem]) {
      result.push(val);
      hash[elem] = true;
    }
  });
  return result;
}

// 判断是否是JSON
function formatJSON(json) {
  try {
    const jsonbak = JSON.parse(json);
    if (Number.isInteger(jsonbak)) {
      return false;
    }
    return true;
  } catch (err) {
    return false;
  }
}

const G = {
  install(Vue) {
    Vue.prototype.$setCookie = setCookie;
    Vue.prototype.$getCookie = getCookie;
    Vue.prototype.$clearCookie = clearCookie;
    Vue.prototype.$clearAllCookie = clearAllCookie;
    Vue.prototype.$formatNumberRgx = formatNumberRgx;
    Vue.prototype.$uniqueArr = uniqueArr;
    Vue.prototype.$formatJSON = formatJSON;
  },
};

export default G;
