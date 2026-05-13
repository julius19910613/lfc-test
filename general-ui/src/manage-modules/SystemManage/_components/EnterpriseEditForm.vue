<template>
  <div class="form">
    <div class="row">
      <div class="row-title">
        <div class="required">＊</div>
        {{ $t('management.enterprise_name') }}
      </div>
      <input class="row-input" v-model="name"
        :class="{'error': isNameTooltipShown}"
        :placeholder="$t('management.input_placeholder')"
        v-tooltip="nameTooltip"
        maxlength=50
        ref="name">
    </div>
    <div class="row">
      <div class="row-title">
        <div class="required"></div>
        {{ $t('management.enterprise_description') }}
      </div>
      <input class="row-input long" v-model="description" maxlength=50
        :placeholder="$t('management.length_50_placeholder')">
    </div>


    <!-- 产品列表 -->
    <div class="row module-title">
      <div class="row-title part" v-tooltip="moduleTooltip" ref="moduleTitle">{{ $t('management.product_list') }}</div>
    </div>  
    <div class="row multi-line">
      <div class="module" v-for="(prod, idx) in products" :key="idx">
        <input type="checkbox" v-model="prod.checked" :disabled="prod.disabled">
        <label class="module-name">{{ prod.name }}</label>
        <icon icon-type="help" :size=15 v-if="prod.description && prod.description !== ''"
        v-tooltip="{msg: prod.description}" />
      </div>
    </div>

    <!-- 模块列表 -->
    <div class="row module-title">
      <div class="row-title part" v-tooltip="moduleTooltip" ref="moduleTitle">{{ $t('management.module_list') }}</div>
    </div>
    <div class="row multi-line">
      <div v-for="(mod, idx) in modules" :key="idx" class="module">
        <input type="checkbox" v-model="mod.checked" :disabled="mod.disabled">
        <label class="module-name">{{ mod.name }}</label>
        <icon icon-type="help" :size=15 v-if="mod.description && mod.description !== ''"
         v-tooltip="{msg: mod.description}" />
      </div>
    </div>

    

  </div>  
</template>

<script>
import event from '@/utils/js/event';

export default {
  name: 'enterprise-edit-form',
  props: {
    extData: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      name: '',
      description: '',
      existedEnterprises: [],
      modules: [],
      products: [],

      nameTooltip: this.genErrTooltip(),
      moduleTooltip: this.genErrTooltip(),
      isNameTooltipShown: false,
    };
  },
  watch: {
    name() {
      if (this.name.trim() !== '') {
        this.isNameTooltipShown = false;
        this.$refs.name.dispatchEvent(event.createEvent('tooltip-hide'));
      }
    },
  },
  methods: {
    genErrTooltip() {
      return {
        msg: '',
        eventOnly: true,
        errorType: true,
        alignLeft: true,
      };
    },
    showUpdatedTooltip(context, tooltip, msg) {
      tooltip.msg = msg;
      const triggerObj = context.$el ? context.$el : context;

      triggerObj.focus();
      this.$nextTick(() => {
        triggerObj.dispatchEvent(event.createEvent('tooltip-reload'));
        triggerObj.dispatchEvent(event.createEvent('tooltip-show'));
      });
    },
    closeModuleTooltip() {
      this.$refs.moduleTitle.dispatchEvent(event.createEvent('tooltip-hide'));
    },
    validate() {
      const that = this;
      that.name = that.name.trim();
      let isValid = true;
      if (that.name === '') {
        isValid = false;
        that.isNameTooltipShown = true;
        that.showUpdatedTooltip(that.$refs.name, that.nameTooltip, that.$t('management.err_enterprise_name_empty'));
      } else if (that.name !== that.extData.name &&
        that.existedEnterprises.findIndex(name =>
        name.toLowerCase() === that.name.toLowerCase()) > -1) {
        isValid = false;
        that.showUpdatedTooltip(that.$refs.name, that.nameTooltip, that.$t('management.err_enterprise_duplicate'));
      }
      const pickAnyModule = that.modules.reduce((val, mod) => val || mod.checked, false);
      if (!pickAnyModule) {
        isValid = false;
        that.showUpdatedTooltip(that.$refs.moduleTitle, that.moduleTooltip, that.$t('management.err_pick_no_modules'));
      }
      if (isValid) {
        that.$emit('validateSuccess', {
          name: that.name,
          description: that.description,
          modules: that.modules.filter(mod => mod.checked).map(mod => mod.code),
          products: that.products.filter(prod => prod.checked).map(prod => prod.code),
        });
      }
    },
  },
  mounted() {
    const that = this;

    that.name = that.extData.name || '';
    that.description = that.extData.description || '';
    that.modules = that.extData.modules || [];
    that.products = that.extData.products || [];
    that.existedEnterprises = that.extData.existedEnterprises || [];
    that.$on('validate', that.validate);

    const modMap = {};
    that.modules.forEach((mod) => {
      modMap[mod.code] = mod;
    });
    if (that.extData.checkedModules.length >= 0) {
      that.extData.checkedModules.forEach((mod) => {
        if (modMap[mod.code]) {
          modMap[mod.code].checked = mod.status;
          if (modMap[mod.code].checked) {
            modMap[mod.code].disabled = true;
          }
        }
      });
    }
    const prodMap = {};
    that.products.forEach((prod) => {
      prodMap[prod.code] = prod;
    });
    if (that.extData.checkedProducts.length >= 0) {
      that.extData.checkedProducts.forEach((prod) => {
        if (prodMap[prod.code]) {
          prodMap[prod.code].checked = prod.status;
          if (prodMap[prod.code].checked) {
            prodMap[prod.code].disabled = true;
          }
        }
      });
    }
  },
};
</script>

<style lang="scss" scoped>
@mixin module() {
  .module {
    flex: 0 0 140px;

    display: flex;
    align-items: center;
    margin-bottom: 20px;
    .module-name {
      margin-left: 5px;
      margin-right: 7px;
      cursor: pointer;
    }
    input[type=checkbox] {
      width: 14px;
      height: 14px;
      cursor: pointer;
      &:disabled{
        cursor: default;
        +label {
          cursor: default;
        }
      }
    }
  }
}

.form {
  width: 700px;
  padding: 0 24px;
  color: #666666;
  @include font-14px();

  display: flex;
  flex-direction: column;
  .row {
    margin-bottom: 12px;

    display: flex;
    align-items: center;
    &.multi-line {
      flex-wrap: wrap;
      align-content: flex-start;

      @include module();
    }
    &.splitter {
      flex: 0 0 1px;
      box-shadow: inset 0 1px 0 0 $color-borderline;
    }
    &.module-title {
      margin-top: 8px;
      margin-bottom: 20px;
    }
    .row-title {
      flex: 0 0 100px;
      .required {
        display: inline-block;
        width: 14px;
        color: $color-primary;
      }
      &.part {
        flex: 0 0 200px;
        display: flex;
        align-items: center;
        .icon {
          margin-left: 5px;
        }
      }
    }
    .row-input {
      flex: 0 0 240px;
      display: flex;
      &.long {
        flex: 0 0 540px;
      }
    }
  }
}
</style>
