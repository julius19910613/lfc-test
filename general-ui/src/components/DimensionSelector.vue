<template>
  <div class="dimension-selector">
    <div class="category-row"
      v-for="(category, idx) in this.value" :key="idx">
      <div class="category-title">{{ category.name }}：</div>
      <div class="category-all-check" v-if="showType==='check'">
        <input type="checkbox" v-on:change="setAllChecked(category)" v-model="category.allChecked" :id="`${category.code}_all`">
        <label :for="`${category.code}_all`">{{ $t('general.all') }}</label>
      </div>
      <div class="category-value-container">
        <div class="category-value" v-for="(value, index) in category.list" :key="index">
          <input v-if="showType === 'check'" v-on:change="checkAll(category)" v-model="value.checked" type="checkbox" :name="category.code" :id="`${category.code}_${value.id}`">
          <input v-if="showType !== 'check'" v-on:change="setOneCheck(category, value)" :checked="value.checked" type="radio" :name="category.code" :id="`${category.code}_${value.id}`">
          <label :for="`${category.code}_${value.id}`">{{ value.name }}</label>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Array,
      required: true,
    },
    extData: {
      type: Object,
    },
  },
  data() {
    return {
      allCheck: [],
    };
  },
  mounted() {
    const that = this;
    this.$on('reset', that.reset);
  },
  methods: {
    reset() {
      const that = this;
      that.value.forEach((category) => {
        category.allChecked = true;
        category.list.forEach((value) => {
          value.checked = false;
        });
      });
    },
    setAllChecked(category) {
      category.list.forEach((value) => {
        value.checked = false;
      });
      category.allChecked = true;
    },
    checkAll(category) {
      const allChecked = category.list.reduce((ret, value) => ret && value.checked, true);
      const allNotChecked = category.list.reduce((ret, value) => ret && !value.checked, true);
      category.allChecked = allChecked || allNotChecked;

      // if all checked, unselect all value
      if (category.allChecked) {
        category.list.forEach((value) => {
          value.checked = false;
        });
      }
      return allChecked || allNotChecked;
    },
    setOneCheck(category, selectedValue) {
      category.list.forEach((value) => {
        value.checked = false;
      });
      selectedValue.checked = true;
      category.allChecked = false;
    },
  },
  computed: {
    showType() {
      if (!this.extData.type) {
        return 'check';
      }
      return this.extData.type;
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'styles/variable.scss';

$selected-color: #1875F0;
$row-height: 50px;

.dimension-selector {
  @include font-14px();
  min-width: 510px;
  padding: 0 24px;
  .category-row {
    display: flex;
    line-height: $row-height;
    .category-title {
      min-width: 80px;
      color: $color-font-active;
      font-weight: 500;
    }
    .category-all-check {
      margin-right: 10px;
    }
    .category-value-container {
      display: inline-block;
      .category-value {
        display: inline-block;
        margin: 0 10px;
      }
    }
    
    input {
      display: none;

      &:checked + label {
        border-radius: 2px;
        background: white;
        color: $selected-color;
        border: 1px solid $selected-color;
      }

      & + label {
        padding: 5px 13px;
        cursor: pointer;
        user-select: none;
      }
    }
  }
}
</style>
