
const MyPlugin = {
  install(Vue) {
    Vue.directive('throttle', {
      bind(el, binding) {
        let throttleTime = binding.value; // 节流时间
        if (!throttleTime) { // 用户若不设置节流时间，则默认2s
          throttleTime = 2000;
        }
        let cbFun;
        el.addEventListener('click', () => {
          el.isDisableClick = true;
          if (!cbFun) {
            cbFun = setTimeout(() => {
              el.isDisableClick = false;
              cbFun = null;
            }, throttleTime);
          }
        }, true);
      },
    });
  },
};

export default MyPlugin;

