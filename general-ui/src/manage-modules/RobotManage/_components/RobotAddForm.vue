<template>
  <div class="form">
    <div class="row">
      <div class="row-title">* {{ $t('management.robot_name') }}</div>
      <input class="row-input" v-model="name"
        :placeholder="$t('management.input_placeholder')"
        :class="{'error': isNameTooltipShown}"
        v-tooltip="nameTooltip"
        maxlength=50
        ref="name">
    </div>
    <div class="row">
      <div class="row-title">* {{ $t('management.chat_language') }}</div>
      <dropdown-select
        class="select-add-trigger"
        ref="selectAddTrigger"
        v-model="extData.language"
        :options="languageList"
        :showCheckedIcon="false"
        :disabled = 'extData.edit'
        width="250px"
        :placeholder="$t('general.please_choose')"
      />
    </div>
    <div class="row">
      <div class="row-title">{{ $t('management.description') }}</div>
      <input class="row-input" v-model="description" maxlength=50
        :placeholder="$t('management.length_50_placeholder')">
    </div>
  </div>
</template>

<script>
import event from '@/utils/js/event';
import robotAPI from '../../_api/robot';

export default {
  name: 'robot-add-form',
  api: [robotAPI],
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
      existedRobots: [],
      nameTooltip: {
        msg: '',
        eventOnly: true,
        errorType: true,
        alignLeft: true,
      },
      isNameTooltipShown: false,
      languageList: [],
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
    getLanguageList() {
      this.$api.getLanguages().then((res) => {
        const that = this;
        this.languageList = [];
        res.data.result.forEach((item) => {
          const obj = { text: item.p_name, value: item.id };
          that.languageList.push(obj);
        });
      });
    },
    validate() {
      const that = this;
      that.name = that.name.trim();
      if (that.name === '') {
        that.nameTooltip.msg = that.$t('management.err_robot_name_empty');
        that.$refs.name.dispatchEvent(event.createEvent('tooltip-reload'));
        that.$refs.name.dispatchEvent(event.createEvent('tooltip-show'));
        that.$refs.name.focus();
        that.isNameTooltipShown = true;
        return;
      } else if (that.name !== that.extData.name && that.existedRobots.indexOf(that.name) >= 0) {
        that.nameTooltip.msg = that.$t('management.err_robot_duplicate');
        that.$refs.name.dispatchEvent(event.createEvent('tooltip-reload'));
        that.$refs.name.dispatchEvent(event.createEvent('tooltip-show'));
        that.$refs.name.focus();
        that.isNameTooltipShown = true;
        return;
      } else if (this.extData.language.length === 0) {
        that.$notifyFail(that.$t('robot_config.language_choice'));
        return;
      }
      const number = this.extData.language[0];
      that.$emit('validateSuccess', {
        name: that.name,
        description: that.description,
        app_type: 0,
        props: JSON.stringify([{ id: number }]),
      });
    },
  },
  mounted() {
    const that = this;
    that.getLanguageList();
    that.name = that.extData.name || '';
    that.description = that.extData.description || '';
    that.existedRobots = that.extData.existedRobots || [];
    that.$on('validate', that.validate);
  },
};
</script>

<style lang="scss" scoped>
.form {
  width: 400px;
  padding: 0 30px;

  display: flex;
  flex-direction: column;
  .row {
    margin-bottom: 10px;

    display: flex;
    align-items: center;
    .row-title {
      flex: 0 0 80px;
      text-align: right;
      margin-right: 10px;
    }
    .row-input {
      flex: 1;
      display: flex;
    }
  }
}
</style>
