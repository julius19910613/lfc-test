<template>
  <div class="data_overview">
    <tree
      ref="entityTree"
      class="card-category"
      :class="{hide:hideTree}"
      :data="rootData"
      :selectedEntity="selectedEntity"
      :allowEdit="false"
      :canEdit = canEdit
      :canExport = canExport
      @filterEntities="handleFilterEntities"
      @selectEntity="changeSelectedEntity"
      @updateCurrentIndex="updateCurrentIndex"
    ></tree>
    <property-value
      class="card-content"
      @refreshTable="refreshTable"
      @onHideTree ='hideTree=!hideTree'
      :canEdit = canEdit
      :canImport = canImport
      :canExport = canExport
      :hideTree ='hideTree'
      >
    </property-value>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
// import CategoryPanel from './CategoryPanel';
import PropertyValue from './PropertyValue';
import Tree from '../Tree';
import api from '../../_api/knowledgeGraph';

export default {
  name: 'data-overview',
  api,
  props: ['canEdit', 'canExport', 'canImport'],
  components: {
    // CategoryPanel,
    PropertyValue,
    Tree,
  },
  watch: {
    selectedEntity() {
      if (Object.keys(this.selectedEntity).length > 0) {
        // this.setCurrentCategory(this.selectedEntity);
        const displayEntities = {
          id: this.selectedEntity.id,
          name: this.selectedEntity.name,
          keyword: this.selectedEntity.entityTreeKeyword ? this.selectedEntity.entityTreeKeyword : '',
        };
        console.log(displayEntities);
        this.setDisplayEntities(displayEntities);
      }
    },
  },

  computed: {
    ...mapGetters([
      'robotID',
      'userID',
      'displayEntities',
    ]),
    // canExport() {
    //   return this.$hasRight('export');
    // },
    // canImport() {
    //   return this.$hasRight('edit');
    // },
  },

  methods: {
    ...mapMutations([
      'setDisplayEntities',
    ]),

    updateCurrentIndex(param) {
      this.currentIndex = param.index;
      if (param.index > this.rootData.totalIndex) {
        param.index = this.rootData.totalIndex;
      }
      if (parseInt(param.id, 10) === -1) {
        const temp = this.rootData;
        this.rootData = {};
        this.$api.getRootNodes(this.robotID, { page: param.index })
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
            temp.currentIndex = param.index;
            temp.totalIndex = res.data.total === 0 ? 1 : res.data.total;
            this.rootData = temp;
          });
      }
    },

    handleFilterEntities(param) {
      const displayEntities = param.map(item => ({
        id: item.id,
        name: item.name,
        keyword: param.keyword ? param.keyword : '',
      }));
      this.setDisplayEntities(displayEntities);
    },

    refreshTable() {
      this.getRootTree();
    },

    getRootTree() {
      this.currentIndex = 1;
      this.rootData = {};
      this.selectedEntity = {};
      const result = {};
      this.$api.getRootNodes(this.robotID, { page: this.currentIndex }).then((res) => {
        if ((res.data.data || []).length === 0) {
          // 发现所有的属性都为空的时候，显示初始化的导入界面
          this.$emit('changeInitStatus');
        }
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
        console.log(result2);
        this.rootData = result2;
        if (this.rootData.tree.length > 1) {
          this.selectedEntity = this.rootData.tree[1];
        }
      });
    },

    changeSelectedEntity(param) {
      if (param.id === '-1') {
        this.getRootTree();
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
          this.selectedEntity = param;
        } else {
          this.selectedEntity = param;
        }
      } else {
        this.selectedEntity = param;
      }
    },
  },


  data() {
    return {
      rootData: [],
      selectedEntity: {},
      currentIndex: 1,
      totalIndex: 1,
      hideTree: false,
    };
  },

  beforeMount() {
    // get rootNodes and first layer subNodes
    this.getRootTree();
  },

};
</script>

<style lang="scss" scoped>
.data_overview {
  // margin-bottom: 20px;
  width: 100%;
  display: flex;
  .card-category {
    width: 20%;
    // max-height: 80vh;
    transition: all 500ms ;
    &.hide {
      width: 0%;
    }
    transition: width 500ms, opacity 300ms 200ms;
    &.hide {
      width: 0;
      opacity: 0;
    }
  }
  .card-content {
    width: 80%;
    // padding-left: 20px;
  }
}
</style>
