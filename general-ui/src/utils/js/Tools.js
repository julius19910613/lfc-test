let lastTime = null;
let timer = null;
const OBJ_TYPE =
  '{[object Array]: "array", [object Date]: "date", [object RegExp]: "regexp", [object Object]: "object", [object Error]: "error"}'; // 引用类型(Array / Date / RegExp Error): 调用toString后根据[object XXX]进行判断

export default class Tools {
  /**
   * 节流函数
   * 链接：https://juejin.im/post/5a35ed25f265da431d3cc1b1
   * @param {*} fn 执行函数
   * @param {*} gapTime 节流时间
   * 场景使用:
   * 1.给按钮加函数防抖防止表单多次提交
   * 2.对于输入框连续输入进行AJAX验证时，用函数防抖能有效减少请求次数
   * 3.判断scroll是否滑到底部，滚动事件+函数防抖
   * remark: 使用示例：
   *                  1. Tools.debounce(fun,1000)()  第二个括号不能少
   *                  2. Tools.debounce(()=>fun(x,y),1000)()  第二个括号不能少
   */
  static throttle(fn, gapTime = 500) {
    if (fn && typeof fn === 'function') {
      return () => {
        const nowTime = +new Date();
        if (nowTime - lastTime > gapTime || !lastTime) {
          fn();
          lastTime = nowTime;
        }
      };
    }
    throw new Error(`类型错误 需要函数类型 实际: ${typeof fn}`);
  }
  /**
   * 防抖函数
   * 链接：https://juejin.im/post/5a35ed25f265da431d3cc1b1
   * @param {*} fn 执行函数
   * @param {*} wait 等待时间
   * 场景使用:
   * 1.游戏中的刷新率
   * 2.DOM元素拖拽
   * 3.Canvas画笔功能
   * 总的来说，适合大量事件按时间做平均分配触发。
   * remark: 使用示例：Tools.
   *                  1. debounce(fun,1000)()  第二个括号不能少
   *                  2. Tools.debounce(()=>fun(x,y),1000)()  第二个括号不能少
   */
  static debounce(fn, wait = 500, ...args) {
    if (fn && typeof fn === 'function') {
      return () => {
        const context = this;
        if (timer) {
          clearTimeout(timer);
          timer = null;
        }
        timer = setTimeout(() => {
          fn.apply(context, args);
        }, wait);
      };
    }
    throw new Error(`类型错误 需要函数类型 实际: ${typeof fn}`);
  }

  /**
   * 判断参数类型
   * @param {*} obj 需要判断类型的参数
   * @return String
   * 基本类型(null): 使用 String(null)
   * 基本类型(string / number / boolean / undefined) + function: 直接使用 typeof即可
   * 其余引用类型(Array / Date / RegExp Error): 调用toString后根据[object XXX]进行判断
   */
  static typeOf(obj) {
    if (obj == null) return String(obj);
    return typeof obj === 'object'
      ? OBJ_TYPE[Object.prototype.toString.call(obj)] || 'object'
      : typeof obj;
  }

  /* 生成uuid */
  static uuid() {
    const s = [];
    const hexDigits = '0123456789abcdef';
    for (let i = 0; i < 36; i += 1) {
      s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = '4'; // bits 12-15 of the time_hi_and_version field to 0010
    // bits 6-7 of the clock_seq_hi_and_reserved to 01
    // @ts-ignore
    // eslint-disable-next-line no-bitwise
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
    s[8] = '-';
    s[18] = '-';
    s[23] = '-';
    const uuid = s.join('');
    return uuid;
  }

  /* 简单版克隆对象 不含特殊对象 如函数对象 日期对象 正则 symbol等 */
  static cloneJson(obj) {
    if (!obj) {
      return obj;
    }
    return JSON.parse(JSON.stringify(obj));
  }
}
