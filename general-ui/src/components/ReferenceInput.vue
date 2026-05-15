<template>
  <div class="reference-input-wrapper">
    <el-dropdown trigger="click" class="dropdown-wrapper" @visible-change="handleRefListVisChange"
    @command="handleSelectReference">
      <div class="el-dropdown-link" ref="dropdownBtn">
        dropdown_list<i class="el-icon-arrow-down el-icon--right"></i>
      </div>
      <el-input ref="referenceInput" class="slot-input" :disabled="disabled"
      :placeholder="placeholder||'请输入$选择槽位'"
      v-model="inputValue" size="small" :maxlength="maxlength"
      @focus.stop.prevent="handleFocusInput"
      @blur="handleBlurInput"
      @change="handleInputChange"
      @keyup.left.native="handleInputChange"
      @keyup.right.native="handleInputChange"
      @keydown.38.native.prevent="handleKeyArrowDown"
      @keydown.40.native.prevent="handleKeyArrowUp"
      @keyup.enter.native="handleEmitValue"></el-input>
      <el-dropdown-menu slot="dropdown" :style="{'width':dropdownWidth}" class="reference-dropdown">
        <el-dropdown-item v-for="(item, index) in dropdownOptions" :key="index"
        :class="{'selected': selectedRefIndex === index, 'disabled': item.disabled}"
        :command="item.value" @mouseenter.native="handleFocusRefItem(index)">
          <div>
            <span>{{item.value}}</span>
            <span style="color:#999999;float:right;font-size:12px;">{{item.label}}</span>
          </div>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: '',
    },
    emptytext: {
      type: String,
      default: '',
    },
    width: {
      type: String,
      default: '200px',
    },
    referenceList: {
      type: Array,
      default() {
        return ['槽位1', '槽位2', '槽位3'];
      },
    },
    textExtension: {
      type: Boolean,
      default: true,
    },
    separator: {
      type: String,
      default: '|',
    },
    parantheses: {
      type: String,
      default: '#',
    },
    refMandatory: {
      type: Boolean,
      default: false,
    },
    maxlength: {
      type: Number,
      default: 100,
    },
  },
  data() {
    return {
      inputValue: '',
      cursorPosition: 0, // 鼠标光标位置
      currentReferenceList: [],
      isDropdownVisible: false,
      selectedRefIndex: 1,
      dropdownWidth: '200px',
    };
  },
  created() {
    this.inputValue = this.value;
  },
  mounted() {
    if (this.$refs.referenceInput && this.$refs.referenceInput.$el.clientWidth) {
      this.dropdownWidth = `${this.$refs.referenceInput.$el.clientWidth}px`;
    }
  },
  watch: {
    value() {
      this.inputValue = this.value;
    },
    inputValue() {
      this.handleInputChange();
      this.$emit('input', this.inputValue);
    },
  },
  computed: {
    dropdownOptions() {
      const options = [];
      this.referenceList.forEach((item) => {
        if (item.title) {
          options.push({
            value: item.title,
            label: item.description,
            disabled: false,
          });
        }
      });
      if (options.length === 0) {
        options.push({
          value: '暂无数据',
          label: '',
          disabled: true,
        });
      }
      return options;
    },
  },
  methods: {
    handleFocusRefItem(index) {
      this.selectedRefIndex = index;
    },
    // 下拉列表显示/ 隐藏时调用
    handleRefListVisChange(visible) {
      this.isDropdownVisible = visible;
    },
    // 显示引用列表
    openReferenceList() {
      if (!this.isDropdownVisible) {
        this.$refs.dropdownBtn.click();
      }
    },
    // 隐藏引用列表
    hideReferenceList() {
      this.selectedRefIndex = 0;
      // 如果正在显示，则再次点击按钮隐藏dropdown
      if (this.isDropdownVisible) {
        this.$refs.dropdownBtn.click();
      }
    },
    handleKeyArrowUp() {
      if (this.dropdownOptions.length === 0) {
        return;
      }
      this.selectedRefIndex = (this.selectedRefIndex + 1) % this.dropdownOptions.length;
    },
    handleKeyArrowDown() {
      if (this.dropdownOptions.length === 0) {
        return;
      }
      this.selectedRefIndex = ((this.selectedRefIndex - 1) + this.dropdownOptions.length)
      % this.dropdownOptions.length;
    },
    // 选择了某个引用
    handleSelectReference(selectedItem) {
      if (selectedItem === '暂无数据') {
        return;
      }
      this.inputValue = `${this.inputValue.substring(0, this.cursorPosition)}{${selectedItem}}${this.inputValue.substr(this.cursorPosition)}`;
      this.setCursorPosition(this.cursorPosition + selectedItem.length + 2);
      window.setTimeout(() => {
        this.hideReferenceList();
      }, 20);
    },
    // 输入框获取焦点
    handleFocusInput() {
      this.$nextTick(() => {
        this.handleInputChange();
      });
    },
    // 输入框中值发生变化时
    handleInputChange() {
      if (document.activeElement.tagName === 'BODY') {
        // 修复bug: 切换节点时，会导出每个reference input被初始化，handleInputChange被触发，dropdownlist自动弹出
        return;
      }
      // 两次的值没有变化的话，则不用处理
      if (this.oldInputValue === this.inputValue) {
        return;
      }
      this.oldInputValue = this.inputValue;
      const cursPos = this.getCursorPosition();
      if (this.inputValue.length === 0 || cursPos === 0) {
        this.hideReferenceList();
        return;
      }
      const charBeforeCursor = [...this.inputValue][cursPos - 1];
      if (charBeforeCursor !== '$') {
        this.hideReferenceList();
        return;
      }
      const refMaxLength = 20;
      const strAfterCursor = this.inputValue.substr(cursPos, refMaxLength);
      // $符号在输入值最后 或者 $符号后面没有{value}, 则弹出引用列表
      if (!strAfterCursor || !(strAfterCursor[0] === '{' && strAfterCursor.indexOf('}') !== -1)) {
        this.cursorPosition = cursPos;
        this.openReferenceList();
        return;
      }
      this.hideReferenceList();
    },
    // 获取光标位置
    getCursorPosition() {
      const rInput = this.$refs.referenceInput.$el.firstElementChild;
      let cursurPosition = 0;
      if (rInput.selectionStart) { // 非IE
        cursurPosition = rInput.selectionStart;
      } else { // IE
        try {
          const range = document.selection.createRange();
          range.moveStart('character', -rInput.value.length);
          cursurPosition = range.text.length;
        } catch (e) {
          cursurPosition = 0;
        }
      }
      return cursurPosition;
    },
    // 设置鼠标光标位置
    setCursorPosition(pos) {
      const ctrl = this.$refs.referenceInput.$el.firstElementChild;
      if (ctrl.setSelectionRange) {
        ctrl.focus();
        ctrl.setSelectionRange(pos, pos);
        // IE8 and below
      } else if (ctrl.createTextRange) {
        const range = ctrl.createTextRange();
        range.collapse(true);
        range.moveEnd('character', pos);
        range.moveStart('character', pos);
        range.select();
      }
    },
    // Input输入框失去焦点
    handleBlurInput() {
      // 从选项列表中点击选择时，也会触发blur input事件
      // 从而会导致选择的click事件无法触发（先Blur-隐藏select list，再选择）
      // 把Blur（隐藏selectionList)事件放到item click事件之后
      window.setTimeout(() => {
        this.showReferenceList = false;
      }, 100);
      this.$emit('change');
    },
    // 处理语料扩展，将#v1|v2|v3#中的内容解析成三个字符串
    handleTextExtension(str) {
      // const pattern = new RegExp('\\#(.| )+?\\#', 'igm');
      const pattern = new RegExp(`\\${this.parantheses}(.| )+?\\${this.parantheses}`, 'igm');
      const exts = str.match(pattern) || [];
      let resArr = [str];
      exts.forEach((extReg) => {
        // 处理ext, 得到结果
        const extValues = extReg.substring(1, extReg.length - 1).split(this.separator);
        const tempArr = [];
        extValues.forEach((extVal) => {
          resArr.forEach((strVal) => {
            tempArr.push(strVal.replace(extReg, extVal));
          });
        });
        resArr = tempArr;
      });
      return [...new Set(resArr)];
    },
    handleEmitValue() {
      if (this.inputValue === '') {
        return;
      }
      // 如果正在显示下拉框
      if (this.isDropdownVisible) {
        if (this.selectedRefIndex >= 0 && this.selectedRefIndex < this.dropdownOptions.length) {
          // Enter键选择hover项目
          this.handleSelectReference(this.dropdownOptions[this.selectedRefIndex].value);
        }
        return;
      }
      let res = [];
      if (this.textExtension) {
        res = this.handleTextExtension(this.inputValue);
      } else {
        res = [this.inputValue];
      }
      // 验证是否选择了引用，引用是否存在在引用列表中
      let validMsg = '';
      if (this.refMandatory) {
        const pattern = new RegExp('\\$\\{(.)+?\\}', 'igm');
        const refs = this.inputValue.match(pattern) || [];
        if (!refs.length) {
          validMsg = 'ner.extractor.no_slot_in_corpus';
        } else {
          const optionRefSet = new Set(this.referenceList);
          const errorRefs = refs.filter((item) => {
            const refItem = item.substring(2, item.length - 1);
            return !optionRefSet.has(refItem);
          });
          if (errorRefs.length > 0) {
            validMsg = 'ner.extractor.invalid_slot_in_corpus';
          }
        }
      }
      if (validMsg) {
        this.$notifyWarn(validMsg);
        return;
      }
      this.$emit('enter', res);
      this.$emit('change');
      // this.inputValue = '';
    },
  },
};
</script>

<style lang="scss" scoped>
// @import "../../assets/scss/index";
.selected{
  background:#E9E9EC;
}
.reference-input-wrapper{
  width: 100%;
  .slot-input{
    height: 38px;
    font-size: 14px;
    ::v-deep input{
      height: 38px;
      line-height: 38px;
    }
  }
  .dropdown-wrapper{
    width: 100%;
    input{
      width: 100%;
      height: 38px;
    }
    ::v-deep .el-dropdown-link{
      display: none;
    }
    ::v-deep .el-dropdown-menu__item{
      &:hover{
        background-color: $color-white !important;
        color: #666666;
      }
    }
  }
}
</style>
