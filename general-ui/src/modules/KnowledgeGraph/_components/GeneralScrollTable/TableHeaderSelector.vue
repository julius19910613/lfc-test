<template>
  <div id="table-header-selector">
    <div id="selector-header">
      <div id="selector-title">{{ $t('general.custom_column') }}</div>
      <icon icon-type="info_close" :size="16" button @click="$emit('close')"></icon>
    </div>
    <div class="operation-content">
      <search-input
        :fill="true"
        v-model="headerKeyWord">
      </search-input>
    </div>
    <div id="selector-content">
      <template v-for="(header, index) in currentTableHeader">
      <div v-if="header.type !== 'action'" class="selector-option" :key="header.key">
        <input :ref="`option-${header.key}`"
          :id="header.key" type="checkbox"
          :checked="header.isChecked"
          :disabled="header.lockedLeft || header.lockedRight"
          @change="handleSelectChange($event, header.key, index, header)"/>
        <label :for="header.key" :title="header.text">{{index}}-{{ getEllipsisStr(header.text, 6) }}</label>
      </div>
      </template>
    </div>
    <div id="selector-footer">
      <text-button button-type="primary" @click="resetToDefault">{{ $t('general.default_column')}}</text-button>
      <div style="width: 20px"></div>
      <text-button button-type="default" @click="selectAll">{{ $t('general.select_all') }}</text-button>
    </div>
  </div>
</template>
<script>
import Misc from '@/utils/js/misc';

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
  },
  data() {
    return {
      headerOptions: [],
      selectedHeader: [],
      headerKeyWord: '',
      currentHeader: [],
      MAX_SELECTED_COUNT: 11,
    };
  },
  watch: {
    selectedTableHeader(val) {
      this.selectedHeader = val;
    },
  },

  computed: {
    currentTableHeader() {
      if (this.headerKeyWord.length === 0) {
        return this.tableHeader;
      }
      return this.tableHeader.filter(item => item.text.indexOf(this.headerKeyWord) > -1);
    },
  },

  methods: {
    getEllipsisStr(str, num) {
      return Misc.getEllipsisStr(str, num);
    },
    handleSelectChange(e, key, index, headerItem) {
      const that = this;
      const option = that.headerOptions.find(header => header.key === key);
      const canSelected = (this.tableHeader
        .filter(item => item.isChecked).length < this.MAX_SELECTED_COUNT) || headerItem.isChecked;
      if (canSelected) {
        option.isChecked = !option.isChecked;
        this.tableHeader.splice(index, 1, { ...headerItem, isChecked: option.isChecked });
        that.setSelectedHeader();
        that.setDefaultChange(false);
      } else {
        this.tableHeader.splice(index, 1, { ...headerItem, isChecked: false });
        this.$message({
          message: `最多可选${this.MAX_SELECTED_COUNT}个`,
          type: 'error',
        });
      }
    },
    setSelectedHeader() {
      const that = this;
      that.selectedHeader = that.headerOptions
        .filter(header => header.isChecked)
        .map(header => header.key);
      that.$emit('selectedHeaderChange', that.selectedHeader);
    },
    setDefaultChange(dftBool) {
      const that = this;
      that.$emit('changeDefault', dftBool);
    },
    selectAll() {
      const that = this;
      const canSelected = this.tableHeader.length <= this.MAX_SELECTED_COUNT;
      if (!canSelected) {
        this.$message({
          message: `最多可选${this.MAX_SELECTED_COUNT}个`,
          type: 'error',
        });
        return;
      }
      this.headerKeyWord = '';
      that.headerOptions = that.tableHeader.map((header) => {
        header.isChecked = true;
        return header;
      });
      that.selectedHeader = that.headerOptions
        .map(header => header.key);
      that.$emit('selectedHeaderChange', that.selectedHeader);
      that.setDefaultChange(true);
      that.$forceUpdate();
    },

    resetToDefault() {
      const that = this;
      this.headerKeyWord = '';
      that.headerOptions = that.tableHeader.map((header) => {
        header.isChecked = header.lockedLeft === true
          || header.lockedRight === true
          || header.default === true;
        return header;
      });
      that.selectedHeader = that.headerOptions
        .filter(header => header.lockedLeft === true
          || header.lockedRight === true
          || header.default === true)
        .map(header => header.key);
      that.$emit('selectedHeaderChange', that.selectedHeader);
      that.setDefaultChange(true);
      that.$forceUpdate();
    },
    detectClickOutside(e) {
      const that = this;
      if (that.$el && !that.$el.contains(e.target)) {
        that.$emit('close');
      }
    },
  },
  beforeMount() {
    const that = this;
    that.selectedHeader = that.selectedTableHeader
      .filter((item, index) => index < this.MAX_SELECTED_COUNT);
    console.info('that.selectedTableHeader', that.selectedTableHeader);
    console.info('that.selectedHeader', that.selectedHeader);
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
    document.addEventListener('click', that.detectClickOutside);
  },
  destroyed() {
    const that = this;
    document.removeEventListener('click', that.detectClickOutside);
  },
};
</script>
<style lang="scss" scoped>
#table-header-selector {
  @include floatMenu();
  position: absolute;
  top: 40px;
  left: -292px;
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

.operation-content {
  flex: 1;
  max-height: 480px;
  padding: 10px 20px;
  display: flex;
  flex-direction: column;
  .button-operation {
    flex: 1;
    display: flex;
    flex-direction: row;
  }
}

#selector-content {
  flex: 1 1 auto;
  max-height: 300px;  // IE11 Hack: Apply max on flex children so box-sizing would work
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
  display: flex;
  flex-direction: row;
  .text-button {
    width: 100%;
  }
}
</style>
