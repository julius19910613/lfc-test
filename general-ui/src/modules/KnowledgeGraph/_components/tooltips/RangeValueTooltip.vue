<template>
  <div class="number_tooltip">
    <div class="param-wrap">
      <div class="row">
        <div class="row_title">{{ $t('knowledge_graph.entity_edit.number') }}</div>
        <div class="row-input-col">
          <input v-model="valueLow" type="number" :max='MAX_VAL' :min='0' @change='onNumChange($event, valueLow, "low")'>
        </div>
        <span class="div-flag">—</span>
        <div class="row-input-col">
          <input v-model="valueHigh" type="number" :max='MAX_VAL' :min='0' @change='onNumChange($event, valueHigh, "high")'>
        </div>
      </div>
      <div class="row">
        <div class="row_title">{{ $t('knowledge_graph.entity_edit.unit') }}</div>
        <div class="row-input-col">{{ unit }}</div>
      </div>
    </div>
    <!-- <div class="row">
      <v-checkbox v-model="isInherited">{{ $t('knowledge_graph.data_manage.is_inherit') }}</v-checkbox>
    </div> -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Misc from '@/utils/js/misc';
import VCheckbox from '../../../../components/EasyTable/v-checkbox/src/checkbox';
import api from '../../_api/knowledgeGraph';

/* 数值范围选择弹窗 */
export default {
  name: 'RangeValueTooltip',
  api,
  components: { VCheckbox },

  props: {
    extData: {
    },
  },

  data() {
    return {
      regNum: new RegExp('^(-?(0|[1-9][0-9]*))(\\.\\d*[1-9]+)?$'),
      MAX_VAL: 999999999999999,
      propertyValues: [],
      isInherited: false,
      propertyValue: '',
      propertyValueId: '',
      editMode: false,
      relationId: '',
      entityId: '',
      entityName: '',
      propertyId: '',
      propertyName: '',
      category: '',
      unit: '',
      valueLow: '', // 范围低值
      valueHigh: '', // 范围高值
    };
  },

  computed: {
    ...mapGetters([
      'robotID',
    ]),
    rangeValueStr() {
      return `${this.valueLow}-${this.valueHigh}`;
    },
  },

  watch: {
    extData() {
      this.init();
    },
  },

  methods: {
    onNumChange($event, val, tag) {
      if (!val) {
        return;
      }
      console.log('onNumChange', $event, val, tag);
      // const res = val.match(this.regNum);
      // if (!res) {
      //   this.valueLow = tag === 'low' ? '' : this.valueLow;
      //   this.valueHigh = tag === 'high' ? '' : this.valueHigh;
      // }
    },
    onValidForm() {
      /**
        * 1. 非负数：ok
        * 2. 小数位不能大于15位：ok
        * 3. 不能为空 (新增：任一不为空，编辑：单个不能为空， 都为空则删除): ok
        * 4. 小于最大整数:9007199254740991(提示：15位：999...999，改为最大：15个9) 大于0 : ok
        * 5. 左边小于右边值 ok （都为0不过：ok）
        * 6. 带自然数e，不过：ok eg.1e；
        * 7. 小数位/整数位：123451234512345.123451234512345 可过：ok
        * 8. 整数位多个0处理：正则验证至多一个0；
        * 9. 小数位多个0处理：小数末尾不能为0；
        * 10. 001:x,001.0:x,0.1:√,0.10:x,101:√,1e3:x    以上测试值通过；
       */
      let isValid = true;
      const resLow = this.valueLow.match(this.regNum);
      const resHigh = this.valueHigh.match(this.regNum);
      console.error('this.valueLow', JSON.stringify(this.valueLow, null, 2), resLow);
      console.error('this.valueHigh', JSON.stringify(this.valueHigh, null, 2), resHigh);
      if (!resLow || !resHigh) {
        if (isValid) {
            // 值不能为空//或者参数错误
          this.$notifyFail(this.$t('knowledge_graph.error.range_param_emtpy'));
        }
        isValid = false;
      }
      if ((!this.valueLow && this.valueLow !== 0)
      || (!this.valueHigh && this.valueHigh !== 0)) {
        if (isValid) {
          // 值不能为空
          this.$notifyFail(this.$t('knowledge_graph.error.range_param_emtpy'));
        }
        isValid = false;
      }
      if (Misc.decimalPlaces(this.valueLow) > 15 || Misc.decimalPlaces(this.valueHigh) > 15) {
        if (isValid) {
          // 小数位不大于15位
          this.$notifyFail(this.$t('knowledge_graph.error.range_param_decimal_error'));
        }
        isValid = false;
      }
      if (Number.parseFloat(this.valueLow) < 0) {
        if (isValid) {
          // 值非负值
          this.$notifyFail(this.$t('knowledge_graph.error.range_param_lt_zero'));
        }
        isValid = false;
      }
      if (Number.parseFloat(this.valueHigh) > this.MAX_VAL) {
        if (isValid) {
          // 值不能大于最大的安全整数:MAX_VAL
          this.$notifyFail(this.$t('knowledge_graph.error.range_param_gt_max'));
        }
        isValid = false;
      }
      if (Number.parseFloat(this.valueLow) >= Number.parseFloat(this.valueHigh)) {
        if (isValid) {
          // 大值必须大于小值
          this.$notifyFail(this.$t('knowledge_graph.error.range_param_error'));
        }
        isValid = false;
      }
      return isValid;
    },
    validate() {
      // eslint-disable-next-line prefer-const
      let param = {
        id: this.relationId,
        fromEntityId: this.entityId,
        fromEntityName: this.entityName,
        propertyId: this.propertyId,
        propertyName: this.propertyName,
        category: parseInt(this.category, 10),
        unit: this.unit,
        toEntityId: this.propertyValues.map(item => item.propertyValueId),
        toEntityName: [this.rangeValueStr],
        isInheritParent: false,
        inheritedParentEntityId: '-1',
      };
      if (this.editMode) {
        if (this.valueLow !== 0 && !this.valueLow && this.valueHigh !== 0 && !this.valueHigh) {
          // delete mode
          const temp = {
            relations: [{
              fromEntityId: this.extData.entityId,
              propertyId: `${this.extData.propertyId}`,
            }],
          };
          this.$api.deletePropertyValue(this.robotID, temp).then(() => {
            this.$emit('validateSuccess', param);
          });
        } else {
          // eslint-disable-next-line no-lonely-if
          if (!this.onValidForm()) {
            return;
          }
          // update mode
          this.$api.updatePropertyValue(this.robotID, param).then(() => {
            this.$emit('validateSuccess', param);
          });
        }
      } else {
        // create mode
        // eslint-disable-next-line no-lonely-if
        if (!this.onValidForm()) {
          return;
        }
        this.$api.addPropertyValue(this.robotID, param).then((res) => {
          param.toEntityId = res.data.data.toEntityId;
          this.$emit('validateSuccess', param);
        });
      }
    },
    /**
     * 处理
     * 1. 1-3
     * 2. -1-3
     * 3. -1--3
     * 的范围数字情况
     */
    getRangeValueFromProps(props) {
      if (!props) {
        return ['', ''];
      }
      const dividerChar = '-';
      const count = props.split('').filter(item => item === dividerChar).length;
      if (count === 1) {
        return props.split('-');
      }
      const temp0 = props.slice(1);
      const index = temp0.indexOf(dividerChar);
      const temp1 = [`${props.startsWith(dividerChar) ? '-' : ''}${temp0.slice(0, index)}`, temp0.slice(index + 1)];
      return temp1;
    },
    init() {
      this.propertyValue = this.extData.propertyValue;
      this.editMode = this.extData.editMode;
      this.propertyValues.length = 0;
      if (this.editMode) {
        this.extData.propertyValueId.forEach((id, idx) => {
          this.propertyValues.push({
            propertyValueId: id,
            propertyValue: this.extData.propertyValue[idx],
          });
        });
      } else {
        this.propertyValues.push({
          propertyValueId: '',
          propertyValue: '',
        });
      }
      this.relationId = this.extData.relationId;
      this.entityId = this.extData.entityId;
      this.entityName = this.extData.entityName;
      this.propertyId = this.extData.propertyId;
      this.propertyName = this.extData.propertyName;
      this.propertyValueId = this.extData.propertyValueId;
      this.category = this.extData.category;
      this.unit = this.extData.unit;
      const [valueLow, valueHigh] = this.getRangeValueFromProps(((this.propertyValue || [])[0] || ''));
      this.valueHigh = valueHigh;
      this.valueLow = valueLow;
    },
  },
  beforeMount() {
    this.init();
    this.$on('validate', this.validate);
  },
};
</script>

<style lang="scss" scoped>
.number_tooltip {
  width: 100%;
  display: flex;
  flex-direction: column;
  .param-wrap {
    max-width: 300px;
    max-height: 300px;
  }
  .row {
    display: flex;
    flex-direction: row;
    padding: 10px 0px;
    .div-flag {
      margin: 0 10px;
    }
    .row_title {
      flex: 0 0 60px;
      max-width: 60px;
    }
    .row-input-col {
      /*flex: 0 0 140px;*/
      flex: 1;
      /*max-width: 140px;*/
      display: flex;
      align-items: center;
      justify-content: space-between;
      &:last-child {
        margin-right: 10px;
      }
    }

    input {
      width: 100%;
    }
  }
}
</style>
–
