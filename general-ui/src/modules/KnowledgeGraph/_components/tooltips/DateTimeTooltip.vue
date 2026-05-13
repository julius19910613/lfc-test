<template>
  <div class="number_tooltip">
    <div class="param-wrap">
      <div class="row">
        <div class="row_title">{{ $t('knowledge_graph.type_date') }}</div>
        <div class="row-input-col">
          <el-date-picker
            v-model="dateTime"
            type="date"
            :clearable="true"
            :editable="true"
            :placeholder="$t('knowledge_graph.placeholder.date_time')"
            size="mini"
            style="width: 100%;"
          ></el-date-picker>
        </div>
      </div>
    </div>
    <!-- <div class="row">
      <v-checkbox v-model="isInherited">{{ $t('knowledge_graph.data_manage.is_inherit') }}</v-checkbox>
    </div>-->
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import VCheckbox from '../../../../components/EasyTable/v-checkbox/src/checkbox';
import api from '../../_api/knowledgeGraph';

/* 数值范围选择弹窗 */
export default {
  name: 'DateTimeTooltip',
  api,
  components: { VCheckbox },

  props: {
    extData: {
    },
  },

  data() {
    return {
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
      dateTime: '',
    };
  },
  computed: {
    ...mapGetters([
      'robotID',
    ]),
    selectDateTimestamp() {
      return this.dateTime ? new Date(this.dateTime).getTime() : '';
    },
  },
  watch: {
    extData() {
      this.init();
    },
  },
  methods: {
    onValidForm() {
      const valid = !!this.selectDateTimestamp;
      if (!valid) {
        this.$notifyFail(this.$t('knowledge_graph.error.empty_param'));
      }
      return valid;
    },
    validate() {
      const param = {
        id: this.relationId,
        fromEntityId: this.entityId,
        fromEntityName: this.entityName,
        propertyId: this.propertyId,
        propertyName: this.propertyName,
        category: parseInt(this.category, 10),
        unit: this.unit,
        toEntityId: this.propertyValues.map(item => item.propertyValueId),
        toEntityName: [this.selectDateTimestamp.toString()],
        isInheritParent: false,
        inheritedParentEntityId: '-1',
      };
      if (this.editMode) {
        if (!this.dateTime) {
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
      // eslint-disable-next-line no-nested-ternary
      this.dateTime = Array.isArray(this.propertyValue) ? !this.propertyValue[0]
        ? '' : new Date(Number(this.propertyValue[0]))
        : new Date(Number(this.propertyValue));
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
      &:last-child {
        margin-right: 10px;
      }
      input {
        width: 100%;
      }
    }

    input {
      width: 100%;
    }
  }
}
</style>
