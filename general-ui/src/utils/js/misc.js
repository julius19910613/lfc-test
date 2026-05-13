function useIE() {
  // for Now, detect IE 11 and Edge only, other IE version will has no support
  return (navigator.appName === 'Microsoft Internet Explorer' ||
    !!(navigator.userAgent.match(/Trident/) ||
    navigator.userAgent.match(/rv:11/) ||
    navigator.userAgent.match(/Edge/)));
}

function isEllipsisActive(elem) {
  // Check whether text ellipsis is active
  return elem.offsetWidth < elem.scrollWidth;
}

function downloadRawFile(blobData, filename) {
  if (blobData != null && navigator.msSaveBlob) {
    navigator.msSaveBlob(blobData, filename);
    return;
  }
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blobData);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  window.URL.revokeObjectURL(link.href);
  document.body.removeChild(link);
}

const passKeys = [
  16, // shift
  17, // ctrl
  18, // alt
  91, // meta
  93, // meta
  9, // tab
  20, // caps lock
];
// e is keyboard event, check if press controll key only
function controlKeyOnly(e) {
  for (let i = 0; i < passKeys.length; i += 1) {
    if (e.keyCode === passKeys[i]) {
      return true;
    }
  }
  return false;
}

function getBrowserLanguage() {
  const browserLanguage = window.navigator.language;
  const validZHTW = ['zh-TW', 'zh-HK'];

  return validZHTW.find(i18n => i18n === browserLanguage) ? 'zh-tw' : 'zh-cn';
}

function copyToClipboard(text) {
  const input = document.createElement('input');
  input.value = text;
  const body = document.querySelector('body');
  body.append(input);

  input.select();
  document.execCommand('copy');
  input.remove();
}

// eslint-disable-next-line
document.head || (document.head = document.getElementsByTagName('head')[0]);
function changeFavicon(src) {
  const link = document.createElement('link');
  const oldLink = document.getElementById('dynamic-favicon');
  link.id = 'dynamic-favicon';
  link.rel = 'shortcut icon';
  link.href = src;
  if (oldLink) {
    document.head.removeChild(oldLink);
  }
  document.head.appendChild(link);
}

function getParameterByName(name, url) {
  let useURL = url;
  if (!useURL) {
    useURL = window.location.href;
  }
  const useName = name.replace(/[[]]/g, '\\$&');
  const regex = new RegExp(`[?&]${useName}(=([^&#]*)|&|#|$)`);
  const results = regex.exec(useURL);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function getRemoteFile(res) {
  if (!res) {
    return null;
  }
  const head = res.headers['content-disposition'];
  const type = res.headers['content-type'];

  const blob = new Blob([res.data], { type });
  let filename = head.split(';')[1].split('=')[1];
  const reg = new RegExp('"', 'g');
  filename = filename.replace(reg, '');
  return ({
    blob, filename,
  });
}

function randomID() {
  return parseInt(Math.random() * 100000, 10).toString();
}

function isJsonString(str) {
  try {
    if (typeof JSON.parse(str.replace(/\n/g, '\\n').replace(/\r/g, '\\r')) === 'object') {
      return true;
    }
  } catch (e) {
    console.error('isJsonString:', e, JSON.stringify(str, null, 2));
  }
  return false;
}

function recognizeJSDataType(obj) {
  let classToType;
  if (!classToType) {
    classToType = {};
    ['Boolean', 'Number', 'String', 'Function', 'Array', 'Date', 'RegExp', 'Object', 'Error'].forEach((e) => {
      classToType[`[object ${e}]`] = e.toLowerCase();
    });
  }
  if (obj === null) {
    return 'null';
  }
  if (typeof obj === 'object' || typeof obj === 'function') {
    return classToType[classToType.toString.call(obj)] || 'object';
  }
  return typeof obj;
}

function setPageTitle(name) {
  document.title = name;
}

/**
 * 获取小数位数字的位数
 * @param {数值/字符串数字} num
 * @thanks https://codeday.me/bug/20170907/69068.html
 */
function decimalPlaces(num) {
  const match = (`${num}`).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
  if (!match) { return 0; }
  return Math.max(
       0,
       // Number of digits right of decimal point.
       (match[1] ? match[1].length : 0)
       // Adjust for scientific notation.
       - (match[2] ? +match[2] : 0));
}

// 如果超过设定字数，返回省略号字符串
function getEllipsisStr(str, num) {
  // console.log('getEllipsisStr:', str, num);
  if (!str || typeof str !== 'string') {
    return str;
  }
  return str.length > num ? `${str.slice(0, num)}...` : str;
}


export default {
  useIE,
  isEllipsisActive,
  downloadRawFile,
  controlKeyOnly,
  getBrowserLanguage,
  copyToClipboard,
  changeFavicon,
  getParameterByName,
  getRemoteFile,
  randomID,
  isJsonString,
  recognizeJSDataType,
  setPageTitle,
  decimalPlaces,
  getEllipsisStr,
};
