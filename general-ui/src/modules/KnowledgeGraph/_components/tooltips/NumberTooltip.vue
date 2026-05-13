<template>
  <div class="number_tooltip">
    <!--    <div class="row">-->
    <!--      <text-button button-type="primary" @click.stop="addPropertyValue">{{ $t('general.add') }}</text-button>-->
    <!--    </div>-->
    <div class="param-wrap">
      <div v-for="(item, idx) in propertyValues" :key="idx">
        <div class="row">
          <div class="row_title">{{ $t('knowledge_graph.entity_edit.number') }}</div>
          <div class="row-input-col">
            <input @change='onNumberChange($event, item.propertyValue)' v-model="item.propertyValue" type="number" :max='MAX_VAL' :min='-1*MAX_VAL'/>
          </div>
        </div>
        <div class="row">
          <div class="row_title">{{ $t('knowledge_graph.entity_edit.unit') }}</div>
          <div class="row-input-col">{{ unit }}</div>
        </div>
        <!--        <div class="row">-->
        <!--          <text-button-->
        <!--            button-type="error"-->
        <!--            @click.stop="deletePropertyValue(idx)"-->
        <!--          >{{ $t('general.delete') }}</text-button>-->
        <!--        </div>-->
      </div>
    </div>
    <!-- <div class="row">
      <v-checkbox v-model="isInherited">{{ $t('knowledge_graph.data_manage.is_inherit') }}</v-checkbox>
    </div>-->
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Misc from '@/utils/js/misc';
import VCheckbox from '../../../../components/EasyTable/v-checkbox/src/checkbox';
import api from '../../_api/knowledgeGraph';


export default {
  name: 'NumberTooltip',
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
      // propertyValue: '',
      // propertyValueId: '',
      editMode: false,
      relationId: '',
      entityId: '',
      entityName: '',
      propertyId: '',
      propertyName: '',
      category: '',
      unit: '',
    };
  },

  computed: {
    ...mapGetters([
      'robotID',
    ]),
  },

  watch: {
    extData() {
      this.init();
    },
  },

  methods: {
    onNumberChange($event, val) {
      console.log('$event:', $event, val);
    },

    addPropertyValue() {
      this.propertyValues.push({
        propertyValueId: '',
        propertyValue: '0',
      });
    },

    deletePropertyValue(idx) {
      this.propertyValues.splice(idx, 1);
    },

    validate() {
      /**
       * 0. 支持±；
       * 1. 非空验证：
       * 2. 带自然数e 验证：
       * 3. 最大值15个9验证：
       * 4. 最小值负15个9验证：
       * 5. 小数位/整数位：123451234512345.123451234512345 可过：ok
       * 6. 整数位多个0处理：正则验证至多一个0；
       * 7. 小数位多个0处理：末尾不能为0；
       * 8. 001:x,001.0:x,0.1:√,0.10:x,101:√,1e3:x    以上测试值通过；
       */
      const val = this.propertyValues[0].propertyValue;
      const regRes = val.match(this.regNum);
      console.error('regRes:', regRes);
      if (!regRes) {
        this.$notifyFail(this.$t('knowledge_graph.error.empty_param'));
        return;
      }
      if (+val > this.MAX_VAL) {
        this.$notifyFail(this.$t('knowledge_graph.error.param_gt_max'));
        return;
      }
      if (+val < (-1 * this.MAX_VAL)) {
        this.$notifyFail(this.$t('knowledge_graph.error.param_lt_min'));
        return;
      }
      if (Misc.decimalPlaces(val) > 15) {
        this.$notifyFail(this.$t('knowledge_graph.error.param_decimal_error'));
        return;
      }
      const propertyValuesTemp1 = this.propertyValues.filter(item =>
        !!item.propertyValue || item.propertyValue === '0') || []; // 验证数字非空
      const unEmptyParamCount = propertyValuesTemp1.length;
      if (unEmptyParamCount !== 0 && unEmptyParamCount < this.propertyValues.length) {
        this.$notifyFail(this.$t('knowledge_graph.error.param_error'));
        return;
      }
      if (!this.editMode) {
        const param = {
          fromEntityId: this.entityId,
          fromEntityName: this.entityName,
          propertyId: this.propertyId,
          propertyName: this.propertyName,
          category: parseInt(this.category, 10),
          // unit: this.unit,
          // toEntityId: '',
          toEntityName: propertyValuesTemp1.map((item) => {
            if (item.propertyValue === '-0') {
              item.propertyValue = '0';
            }
            return item.propertyValue;
          }),
          isInheritParent: false,
          inheritedParentEntityId: '-1',
        };
        if (unEmptyParamCount === 0) {
          this.$notifyFail(this.$t('knowledge_graph.error.empty_param'));
          return;
        }
        this.$api.addPropertyValue(this.robotID, param).then((res) => {
          // param.relationId = res.data.data.id;
          param.toEntityId = res.data.data.toEntityId;
          this.$emit('validateSuccess', param);
        });
      } else {
        // update relation mode
        const param = {
          id: this.relationId,
          fromEntityId: this.entityId,
          fromEntityName: this.entityName,
          propertyId: this.propertyId,
          propertyName: this.propertyName,
          category: parseInt(this.category, 10),
          unit: this.unit,
          toEntityId: propertyValuesTemp1.map(item => item.propertyValueId),
          // toEntityName: propertyValuesTemp2.map(item => item.propertyValue),
          toEntityName: propertyValuesTemp1.map((item) => {
            if (item.propertyValue === '-0') {
              item.propertyValue = '0';
            }
            return `${item.propertyValue}`;
          }),
          isInheritParent: false,
          inheritedParentEntityId: '-1',
        };
        if (unEmptyParamCount === 0) {
          // delete mode
          const temp = {
            relations: [{
              fromEntityId: this.extData.entityId,
              propertyId: `${this.extData.propertyId}`,
            }],
          };
          this.$api.deletePropertyValue(this.robotID, temp).then(() => {
            this.$emit('validateSuccess', param);
          }).catch((err) => {
            console.log('deletePropertyValue:err:', err);
          });
          return;
        }
        this.$api.updatePropertyValue(this.robotID, param).then(() => {
          this.$emit('validateSuccess', param);
        });
      }
    },
    init() {
      // this.propertyValue = this.extData.propertyValue;
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
          propertyValue: '0',
        });
      }
      this.relationId = this.extData.relationId;
      this.entityId = this.extData.entityId;
      this.entityName = this.extData.entityName;
      this.propertyId = this.extData.propertyId;
      this.propertyName = this.extData.propertyName;
      // this.propertyValueId = this.extData.propertyValueId;
      this.category = this.extData.category;
      this.unit = this.extData.unit;
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
    width: 300px;
    max-height: 300px;
  }
  .row {
    display: flex;
    flex-direction: row;
    padding: 10px 0px;
    .row_title {
      display: flex;
      justify-content: start;
      align-items: center;
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
    }

    input {
      width: 100%;
    }
  }
}
</style>
