<template>
  <div id="table-header-selector" ref="toolTipSelector">
    <div id="selector-header">
      <div id="selector-title">{{ title }}</div>
      <icon icon-type="info_close" :size="16" button @click.stop="closeTooltipColumn"></icon>
    </div>
    <div id="selector-content">
      <component
                 @validateSuccess="validatePass"
                 :is="currentView" v-model="data" :extData="extData" ref="content"></component>
    </div>
    <div id="selector-footer">
      <text-button
        v-on:click.stop="click(false)"
        ref="cancelBtn"
        v-if="buttons.indexOf('cancel') != -1">{{ cancel_msg }}</text-button>
      <text-button
        :button-type="okBtnType"
        v-on:click.stop="click(true)"
        ref="okBtn"
        v-throttle
        v-if="buttons.indexOf('ok') != -1">{{ ok_msg }}</text-button>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    tableHeader: {
      type: Array,
      required: true,
      default() {
        return [];
      },
    },
    selectedTableHeader: {
      type: Array,
      default() {
        return [];
      },
    },
    useDefault: {
      type: Boolean,
      default: true,
    },

    showColumnTooltip: {
      type: Boolean,
    },

    selectedData: {

    },

    selectedKey: {

    },

    option: {

    },
  },
  data() {
    return {
      title: '',
      dft_ok_msg: this.$t('general.ok'),
      dft_cancel_msg: this.$t('general.cancel'),
      show: false,
      currentView: undefined,
      headerOptions: [],
      selectedHeader: [],
      extData: {},
      data: {},
    };
  },

  computed: {
    okBtnType() {
      if (this.disable_ok) return 'disable';
      return this.popWarn ? 'primary' : 'fill';
    },
  },

  methods: {
    close() {
      this.$emit('close', [this.selectedData, this.selectedKey]);
    },
    showWindow(option) {
      this.title = option.title;
      this.buttons = option.buttons || ['ok', 'cancel'];
      this.ok_msg = option.ok_msg || this.dft_ok_msg;
      this.cancel_msg = option.cancel_msg || this.dft_cancel_msg;
      this.data = option.data;
      this.extData = option.extData || {};
      this.validate = option.validate;
      this.currentView = option.component;
      if (option.callback) {
        this.callOk = option.callback.ok;
        this.callCancel = option.callback.cancel;
      } else {
        this.callOk = undefined;
        this.callCancel = undefined;
      }
    },


    validatePass(customData) {
      this.show = false;
      this.currentView = undefined;
      this.close();
      if (this.callOk && typeof this.callOk === 'function') {
        if (customData) {
          this.callOk.call(this, customData);
        } else {
          this.callOk.call(this, this.data);
        }
      }
    },

    cancelValidatePass(customData) {
      this.show = false;
      this.currentView = undefined;
      this.close();
      if (this.callCancel && typeof this.callCancel === 'function') {
        if (customData) {
          this.callCancel.call(this, customData);
        } else {
          this.callCancel.call(this, this.data);
        }
      }
    },

    closeTooltipColumn() {
      this.$emit('close', [this.selectedData, this.selectedKey]);
    },

    click(ok = true) {
      if (!ok) {
        if (this.cancelValidate) {
          this.$refs.content.$emit('cancelValidate');
        } else {
          this.cancelValidatePass();
        }
      }

      if (ok && !this.disable_ok) {
        if (this.validate) {
          this.$refs.content.$emit('validate');
        } else {
          this.validatePass();
        }
      }
    },
    // detectClickOutside(e) {
    //   const that = this;
    //   if (that.$el && !that.$el.contains(e.target)) {
    //     that.$emit('close', [this.selectedData, this.selectedKey]);
    //   }
    // },
  },
  beforeMount() {
    const that = this;
    that.selectedHeader = that.selectedTableHeader;
    that.headerOptions = that.tableHeader.map((header) => {
      if (that.useDefault) {
        header.isChecked = header.lockedLeft === true
          || header.lockedRight === true
          || header.default === true;
      } else {
        header.isChecked = that.selectedHeader.find(key => key === header.key) !== undefined;
      }
      return header;
    });
    // document.addEventListener('click', that.detectClickOutside);
    this.showWindow(this.option);
  },

  mounted() {
    console.log(this.$refs.toolTipSelector);
    this.$refs.toolTipSelector.style.left = `${this.option.tooltipX}px`;
    this.$refs.toolTipSelector.style.top = `${this.option.tooltipY}px`;
  },

  destroyed() {
    // const that = this;
    // document.removeEventListener('click', that.detectClickOutside);
  },
};
</script>
<style lang="scss" scoped>
#table-header-selector {
  @include floatMenu();
  position: fixed;
  top: 40px;
  // left: -292px;
  width: 320px;
  max-height: 580px;
  background: $color-white;
  border-radius: 2px;
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.2);

  display: flex;
  flex-direction: column;
  background: white;
}

#selector-header {
  flex: 0 0 48px;
  max-height: 48px;  // IE11 Hack: Apply max on flex children so box-sizing would work
  color: $color-font-active;
  border-bottom: 1px solid $color-borderline;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0px 10px 20px;
  #selector-title {
    height: 28px;
    display: flex;
    align-items: center;
  }
  .icon {
    margin-right: 15px;
  }
}

#selector-content {
  flex: 1 1 auto;
  max-height: 480px;  // IE11 Hack: Apply max on flex children so box-sizing would work
  padding: 10px 20px;
  display: flex;
  align-content: flex-start;
  flex-wrap: wrap;
  @include auto-overflow();
  @include customScrollbar();
  .selector-option {
    flex: 0 0 50%;
    margin: 4px 0;
    height: 28px;
    display: flex;
    align-items: center;
    color: $color-font-normal;
    input[type=checkbox] {
      height: 14px;
      width: 14px;
      margin-right: 8px;
      cursor: pointer;
      +label {
        cursor: pointer;
      }
      &:disabled {
        cursor: default;
        +label {
          cursor: default;
        }
      }
    }

  }
}
#selector-footer {
  flex: 0 0 48px;
  max-height: 48px; // IE11 Hack: Apply max on flex children so box-sizing would work
  padding: 10px 20px;
   .text-button {
    width: 50%;
   }
}
</style>
