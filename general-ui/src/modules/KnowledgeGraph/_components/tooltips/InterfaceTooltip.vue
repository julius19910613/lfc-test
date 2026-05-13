<template>
  <div class="interface_tooltip">
    <div class="row">
      <v-checkbox
        v-model="implementInterface"
      >{{ $t('knowledge_graph.data_manage.implement_interface') }}</v-checkbox>
    </div>
    <div class="row">
      <div class="row_title">{{ $t('knowledge_graph.data_manage.interface_address') }}</div>
      <div class="row-input-col">{{ URL }}</div>
    </div>
    <div class="row">
      <div class="row_title">{{ $t('knowledge_graph.data_manage.interface_param') }}</div>
      <!--      <div class="row-input-col">-->
      <!--        <text-button-->
      <!--          button-type="primary"-->
      <!--          @click.stop="addSlotInfo"-->
      <!--        >{{ $t('knowledge_graph.property_edit.add_parameter') }}</text-button>-->
      <!--      </div>-->
    </div>
    <div class="param-wrap" v-if="slotInfo.length>0">
      <template v-for="(item, idx) in slotInfo">
        <div class="param" :key="idx">
          <div class="param_info">
            <div class="row">
              <div class="row-subtitle">{{ $t('knowledge_graph.property_edit.param_name') }}</div>
              <div class="row-input-col" :title="item.slotName">{{ item.slotName }}</div>
              <div class="row-subtitle">{{ $t('knowledge_graph.property_edit.param_type') }}</div>
              <div class="row-input-col" :title="item.slotType">{{ item.slotType }}</div>
            </div>
            <!--            <div class="row">-->
            <!--              -->
            <!--              <dropdown-selector-->
            <!--                class="param_selector"-->
            <!--                :options="paramSelection"-->
            <!--                v-model="item.slotType"-->
            <!--              ></dropdown-selector>-->
            <!--            </div>-->
          </div>
          <!--          <div class="operations">-->
          <!--            <text-button-->
          <!--              class="row-subtitle"-->
          <!--              button-type="error"-->
          <!--              @click.stop="deleteSlotInfo(idx)"-->
          <!--            >{{ $t('general.delete') }}</text-button>-->
          <!--          </div>-->
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import DropdownSelector from '@/components/DropdownSelect';
import VCheckbox from '../../../../components/EasyTable/v-checkbox/src/checkbox';
import api from '../../_api/knowledgeGraph';

export default {
  name: 'InterfaceTooltip',
  props: {
    extData: {
      type: Object,
      default: {},
    },
  },
  api,
  components: {
    VCheckbox,
    DropdownSelector,
  },
  computed: {
    ...mapGetters([
      'robotID',
    ]),
    slotInfoTemp() {
      const temp = this.extData.slotInfo;
      // console.log(JSON.stringify(this.extData, null, 2), 22222111122222);
      return temp;
    },
  },
  watch: {
    extData() {
      this.init();
    },
  },
  // mounted() {
  //   this.init();
  // },

  methods: {
    validate() {
      if (!this.editMode) {
        const param = {
          implementInterface: this.implementInterface,
          fromEntityId: this.entityId,
          fromEntityName: this.entityName,
          propertyId: this.propertyId,
          propertyName: this.propertyName,
          category: parseInt(this.category, 10),
          // unit: this.unit,
          // toEntityId: '',
          toEntityName: [this.implementInterface.toString()],
          isInheritParent: false,
          inheritedParentEntityId: '-1',
          slotInfo: this.extData.slotInfo,
        };
        this.$api.addPropertyValue(this.robotID, param).then((res) => {
          param.relationId = res.data.data.id;
          param.toEntityId = res.data.data.toEntityId;
          this.$emit('validateSuccess', param);
        });
      } else {
        // update relation mode
        const param = {
          implementInterface: this.implementInterface,
          id: this.relationId,
          fromEntityId: this.entityId,
          fromEntityName: this.entityName,
          propertyId: this.propertyId,
          propertyName: this.propertyName,
          category: parseInt(this.category, 10),
          unit: this.unit,
          toEntityId: this.propertyValueId,
          toEntityName: [this.implementInterface.toString()],
          isInheritParent: false,
          inheritedParentEntityId: '-1',
          slotInfo: this.extData.slotInfo,
        };
        this.$api.updatePropertyValue(this.robotID, param).then(() => {
          this.$emit('validateSuccess', param);
        });
      }
    },
    addSlotInfo() {
      this.slotInfo.push(
        {
          slotType: [''],
          slotName: '',
        },
      );
    },

    deleteSlotInfo(idx) {
      this.slotInfo.splice(idx, 1);
    },
    init() {
      this.$api.getSlotTypes().then((res) => {
        this.paramSelection = res.data.type.map(r => ({
          value: r.id,
          text: r.name,
        }));
        console.log(this.extData.slotInfo);
        if (Object.keys(this.extData.slotInfo).length > 0) {
          this.URL = (this.extData.slotInfo || {}).url || '';
          console.log(this.extData.slotInfo);
          const temList = [];
          this.extData.slotInfo.slotList.forEach((item) => {
            temList.push({
              slotName: item.slotName,
              slotType: this.paramSelection.find(i => i.value === item.slotType).text,
            });
          });
          this.slotInfo = temList;
        }
        this.implementInterface = this.extData.editMode;

        this.propertyValue = this.extData.propertyValue;
        this.editMode = this.extData.editMode;
        this.relationId = this.extData.relationId;
        this.entityId = this.extData.entityId;
        this.entityName = this.extData.entityName;
        this.propertyId = this.extData.propertyId;
        this.propertyName = this.extData.propertyName;
        this.propertyValueId = this.extData.propertyValueId;
        this.category = this.extData.category;
        this.unit = this.extData.unit;
        this.$on('validate', this.validate);
      });
    },
  },

  data() {
    return {
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
      implementInterface: false,
      URL: '',
      paramSelection: [
      ],
      slotInfo: [],
    };
  },

  beforeMount() {
    this.init();
    // this.$on('validate', this.validate);
  },
};
</script>

<style lang="scss" scoped>
.interface_tooltip {
  width: 100%;
  display: flex;
  flex-direction: column;
  .param-wrap {
    max-height: 20vh;
    width: 300px;
    // overflow: scroll;
  }
  .param {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
    .param_info {
      flex: 1;
      display: flex;
      flex-direction: column;
      padding-right: 10px;
    }
    .operation {
      width: 10%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .row {
    flex: 0 0 40px;
    display: flex;
    flex-direction: row;
    .row-subtitle {
      margin: 0px 10px;
      display: flex;
      align-items: center;
    }
    .row_title {
      flex: 0 0 60px;
      max-width: 60px;
      display: flex;
      align-items: center;
    }
    .row-input-col {
      /*flex: 0 0 140px;*/
      flex: 1;
      /*max-width: 140px;*/
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    input {
      width: 100%;
    }
    textarea {
      width: 100%;
    }
  }
  .param_selector {
    flex: 1;
    input {
      width: 100%;
    }
  }
}
</style>
