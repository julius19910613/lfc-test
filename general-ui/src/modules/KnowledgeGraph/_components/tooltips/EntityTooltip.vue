<template>
  <div class="text_tooltip">
    <div class="row" v-if='displayValues.length > 0'>
      <input-tags
        class="row-input-col"
        :enableEdit="false"
        v-model="displayValues"
        @deleteTags="deleteSelectedValue"
      ></input-tags>
    </div>
    <div class="row">
      <!-- <search-input fill style="width: 100%" v-model="entityKeyword"></search-input> -->
       <el-input
          class="emotibot"
          :placeholder="$t('knowledge_graph.data_manage.search_placeholder_02')"
          v-model="entityKeyword">
          <i slot="suffix" class="el-icon-search" style='font-size: 14px'></i>
        </el-input>
    </div>
    <div class="row">
      <div class="row_list">
        <ul v-for="(item, idx) in treeData.tree" :key="idx">
          <entity-tree
            :selectedEntity="selectedEntity"
            :data="item"
            :currentIndex="item.currentIndex"
            :totalIndex="item.totalIndex"
            :entityTreeKeyword="entityKeyword"
            @selectEntity="bubbleSelectedEntity"
            @updateCurrentIndex="updateCurrentIndex"
          ></entity-tree>
        </ul>
        <ul v-show="!isLastIndex">
          <div style="flex: 1; padding: 2px 20px">
            <text-button style="width: 100%;"
                         button-type="default"
                         @click.stop="loadMoreChild">
              {{ $t('general.load_more') }}
            </text-button>
          </div>
        </ul>
      </div>
    </div>
<!--    <div class="row">-->
<!--      <v-checkbox v-model="isInherited">{{ $t('knowledge_graph.data_manage.is_inherit') }}</v-checkbox>-->
<!--    </div>-->
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import VCheckbox from '../../../../components/EasyTable/v-checkbox/src/checkbox';
import InputTags from '../TagsInput';
import EntityTree from '../TreeItem';
import api from '../../_api/knowledgeGraph';

export default {
  name: 'EntityTooltip',
  api,
  components: {
    VCheckbox,
    EntityTree,
    InputTags,
  },

  props: {
    extData: {

    },
    extDataId: {

    },
  },

  data() {
    return {
      rootData: [],
      selectedEntity: {},
      entityKeyword: '',
      propertyValues: [
      ],
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
      treeData: [],
      displayValues: [],
    };
  },

  watch: {
    extData() {
      this.init();
    },

    rootData() {
      this.treeData = this.rootData;
    },

    entityKeyword() {
      this.timer = new Date().getTime();

      setTimeout(() => {
        if (new Date().getTime() - this.timer >= 1000) {
          const param = {
            id: this.entityKeyword.length === 0 ? '-1' : '0',
            entityTreeKeyword: this.entityKeyword,
          };
          this.filterResultByKeyword(param);
        }
      }, 1000);
    },
    propertyValues() {
      this.displayValues = this.propertyValues.map(item => item.propertyValue);
    },
  },

  computed: {
    ...mapGetters([
      'robotID',
    ]),

    isLastIndex() {
      return this.treeData.currentIndex === this.treeData.totalIndex;
    },

    // displayValues() {
    //   return this.propertyValues.map(item => item.propertyValue);
    // },
  },

  methods: {
    loadMoreChild() {
      let currentIndex = this.rootData.currentIndex + 1;
      if (currentIndex > this.rootData.totalIndex) {
        currentIndex = this.rootData.totalIndex;
      }

      const temp = this.rootData;
      this.rootData = {};
      this.$api.getRootNodes(this.robotID, { page: currentIndex })
        .then((res) => {
          const result = res.data.data.map(data => ({
            name: data.name,
            id: data.id,
            parentId: '',
            visible: true,
            hasChild: false,
            showChild: false,
            editable: true,
            children: [],
            isActive: false,
            isHover: false,
            currentIndex: 1,
            totalIndex: 1,
          }));
          temp.tree = [...temp.tree, ...result];
          temp.currentIndex = currentIndex;
          temp.totalIndex = res.data.total === 0 ? 1 : res.data.total;
          this.rootData = temp;
        });
    },

    updateCurrentIndex(param) {
      console.log(param);
      const selectedItem = this.rootData.tree.find(item => item.id === param.id);
      const selectedIndex = this.rootData.tree.indexOf(selectedItem);
      selectedItem.currentIndex = param.index;
      if (selectedItem.currentIndex > selectedItem.totalIndex) {
        selectedItem.currentIndex = selectedItem.totalIndex;
      }
      if (parseInt(param.id, 10) !== 0) {
        this.$api.getChildNodes(this.robotID, param.id
          , { page: selectedItem.currentIndex }).then((res) => {
            const newResult = res.data.data.map(item => ({
              name: item.name,
              id: item.id,
              parentId: '0',
              visible: true,
              hasChild: false,
              showChild: false,
              isHover: false,
              children: [],
              currentIndex: 1,
              totalIndex: 1,
            }));
            selectedItem.children = [...selectedItem.children, ...newResult];
            if (selectedItem.children.length > 0) {
              selectedItem.hasChild = true;
            }
          });
        this.rootData.tree.splice(selectedIndex, 1, {});
        this.rootData.tree.splice(selectedIndex, 1, selectedItem);
      } else {
        const param1 = {
          page: selectedItem.currentIndex,
        };
        if (this.entityKeyword && this.entityKeyword.length > 0) {
          param1.keyword = this.entityKeyword;
        }
        this.$api.getAllEntitiesByRobotId(this.robotID,
          param1)
          .then((res) => {
            const newResult = res.data.entities.map(item => ({
              name: item.name,
              id: item.id,
              parentId: '0',
              visible: true,
              hasChild: false,
              showChild: false,
              isHover: false,
              children: [],
            }));
            selectedItem.children = [...selectedItem.children, ...newResult];
            if (selectedItem.children.length > 0) {
              selectedItem.hasChild = true;
            }
          });
        this.rootData.tree.splice(selectedIndex, 1, {});
        this.rootData.tree.splice(selectedIndex, 1, selectedItem);
      }
    },

    deleteSelectedValue(param) {
      const deleteItem = this.propertyValues.find(item => item.propertyValue === param);
      const deleteIndex = this.propertyValues.indexOf(deleteItem);
      this.propertyValues.splice(deleteIndex, 1);
    },

    filterResultByKeyword(param) {
      if (param.id === '-1') {
        this.init();
      } else if (param.id === '0') {
        if (param.entityTreeKeyword && param.entityTreeKeyword.length > 0) {
          // "全部"场景，重置rootData.tree, 子实体变更成"全部"下方的元素
          this.rootData = {};
          const result = {};
          result.currentIndex = 1;
          result.totalIndex = 1;
          const allDataItem = {
            name: this.$t('general.all'),
            id: '0',
            parentId: '',
            visible: true,
            hasChild: false,
            showChild: false,
            editable: true,
            children: [],
            isActive: false,
            isHover: false,
            currentIndex: 1,
            totalIndex: 1,
          };
          allDataItem.currentIndex = 1;
          allDataItem.totalIndex = 1;
          result.tree = [allDataItem];
          this.rootData = result;
        }
      }

      // if (this.entityKeyword.length === 0) {
      //   this.treeData = this.rootData;
      //   this.$emit('selectEntity', this.treeData[1]);
      // } else {
      //   const allEntities = this.rootData[0].children;
      //   this.treeData = allEntities.filter(item => item.name.indexOf(this.entityKeyword) > -1);
      //   // this.propertyValues = [this.treeData.map(item => ({
      //   //   propertyValueId: item.id,
      //   //   propertyValue: item.name,
      //   // }))];
      // }
    },

    bubbleSelectedEntity(param) {
      if (param.id && param.id.toString() !== '0') {
        if (this.propertyValues.filter(item => item.propertyValue === param.name).length === 0) {
          this.propertyValues.push({
            propertyValueId: param.id,
            propertyValue: param.name,
          });
          // this.propertyValue = param.name;
          // this.propertyValueId = param.id;
          this.selectedEntity = param;
        }
      }
    },

    validate() {
      // create relation mode
      if (!this.editMode) {
        const param = {
          fromEntityId: this.entityId,
          fromEntityName: this.entityName,
          propertyId: this.propertyId,
          propertyName: this.propertyName,
          category: parseInt(this.category, 10),
          // unit: this.unit,
          toEntityId: this.propertyValues.map(item => `${item.propertyValueId}`),
          toEntityName: this.propertyValues.map(item => item.propertyValue),
          isInheritParent: false,
          inheritedParentEntityId: '-1',
        };

        if (param.toEntityId && param.toEntityId.length > 0) {
          this.$api.addPropertyValue(this.robotID, param).then(() => {
            this.$emit('validateSuccess', param);
          });
        } else {
          const temp = {
            relations: [{
              fromEntityId: `${param.fromEntityId}`,
              propertyId: `${param.propertyId}`,
            }],
          };
          this.$api.deletePropertyValue(this.robotID, temp).then(() => {
            this.$emit('validateSuccess', param);
          });
        }
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
          toEntityId: this.propertyValues.map(item => `${item.propertyValueId}`),
          toEntityName: this.propertyValues.map(item => item.propertyValue),
          isInheritParent: false,
          inheritedParentEntityId: '-1',
        };

        console.log(param);
        if (param.toEntityId && param.toEntityId.length > 0) {
          this.$api.updatePropertyValue(this.robotID, param).then(() => {
            this.$emit('validateSuccess', param);
          });
        } else {
          const temp = {
            relations: [{
              fromEntityId: `${param.fromEntityId}`,
              propertyId: `${param.propertyId}`,
            }],
          };
          this.$api.deletePropertyValue(this.robotID, temp).then(() => {
            this.$emit('validateSuccess', param);
          });
        }
      }
    },
    init() {
      this.rootData = {};
      this.selectedEntity = {};
      const result = {};
      this.$api.getRootNodes(this.robotID, { page: this.currentIndex }).then((res) => {
        result.tree = res.data.data.map(data => ({
          name: data.name,
          id: data.id,
          parentId: '',
          visible: true,
          hasChild: false,
          showChild: false,
          editable: true,
          children: [],
          isActive: false,
          isHover: false,
          currentIndex: 1,
          totalIndex: 1,
        }));
        result.currentIndex = 1;
        result.totalIndex = res.data.total;

        result.totalIndex = res.data.total === 0 ? 1 : res.data.total;

        // this.rootData = results;
        return new Promise((resolve) => {
          resolve(result);
        });
      }).then((result1) => {
        const allDataItem = {
          name: this.$t('general.all'),
          id: '0',
          parentId: '',
          visible: true,
          hasChild: false,
          showChild: false,
          editable: true,
          children: [],
          isActive: false,
          isHover: false,
          currentIndex: 1,
          totalIndex: 1,
        };
        allDataItem.currentIndex = 1;
        allDataItem.totalIndex = 1;
        result1.tree.splice(0, 0, allDataItem);
        return new Promise((resolve) => {
          resolve(result);
        });
      }).then((result2) => {
        this.rootData = result2;
        this.entityId = this.extData.entityId;
        this.category = this.extData.category;
        this.editMode = this.extData.editMode;
        this.entityName = this.extData.entityName;
        this.propertyId = this.extData.propertyId;
        // this.propertyValues = this.extData.propertyValueId.map(item => ({
        //   propertyValueId: item,
        //   propertyValue: '',
        // }));
        this.entityKeyword = '';
        console.log(this.extData.propertyValue);
        this.propertyValues = [];
        this.extData.propertyValue.forEach((item, idx) => {
          if (item.length > 0) {
            this.propertyValues.push({
              propertyValueId: this.extData.propertyValueId[idx],
              propertyValue: item,
            });
          }
        });
        this.propertyName = this.extData.propertyName;
        this.unit = this.extData.unit;
        this.$on('validate', this.validate);
      });
    },
  },

  beforeMount() {
    this.init();
  },
};
</script>

<style lang="scss" scoped>
.text_tooltip {
  width: 100%;
  height: 25vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  .row {
    display: flex;
    flex-direction: row;
    /deep/ .emotibot {
        &.el-input {
          width: 100%;
          height: 32px;
          .el-input__inner {
            width: 100%;
            height: 32px;
          }
          .el-input__suffix {
            display: flex;
            justify-content: center;
            align-items: center;
          }
        }
      }
    .row_list {
      padding: 10px 0px 0px 10px;
      width: 100%;
      max-height: 18vh;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      @include customScrollbar();
      @include auto-overflow();
      .row-input-col {
        /*flex: 0 0 140px;*/
        flex: 1;
        /*max-width: 140px;*/
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
    }
    textarea {
      width: 100%;
    }
  }
}
</style>

