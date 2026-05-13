<template>
  <div class="entity_manage">
    <div class="category_panel" :class="{hide: hideTree}">
      <tree
        class="card-category"
        :data="rootData"
        :selectedEntity="selectedEntity"
        :allowEdit="true"
        :refreshTreeCode="refreshTreeCode"
        :entityNeedDeleted="entityNeedDeleted"
        :currentIndex = "currentIndex"
        :totalIndex="totalIndex"
        :canEdit="canEdit"
        :canExport="canExport"
        @addRootNode="addRootNode"
        @selectEntity="changeSelectedEntity"
        @addSubEntitySuccess="addDisplayEntity"
        @resetEditMode="resetEditMode"
        @submitChange="submitChange"
        @triggerEditMode="triggerEditMode"
        @filterEntities="handleFilterEntities"
        @updateCurrentIndex="updateCurrentIndex"
      >
      </tree>
    </div>
    <template v-if="!isTreeUpdating">
      <entity-list
        :canEdit = canEdit
        :canImport = canImport
        :canExport = canExport
        :hideTree='hideTree'
        @onHideTree ='hideTree = !hideTree'
      ></entity-list>
    </template>
    <template v-else>
      <div class="loading">
        <loading-dot>
        </loading-dot>
      </div>

    </template>

  </div>
</template>
<script>
  import { mapGetters, mapMutations } from 'vuex';
  // import CategoryPanel from './CategoryPanel';
  import EntityList from './EntityList';
  import Tree from '../Tree';
  import api from '../../_api/knowledgeGraph';

  export default {
    api,
    props: ['canEdit', 'canExport', 'canImport'],

    components: {
      EntityList,
      Tree,
    },
    data() {
      return {
        isTreeUpdating: false,
        rootData: [],
        selectedEntity: '',
        entityNeedDeleted: {},
        refreshTreeCode: Math.random(),
        currentIndex: 1,
        totalIndex: 1,
        hideTree: false,
      };
    },
    computed: {
      ...mapGetters([
        'robotID',
        'userID',
        'deleteEntityId',
        'updateEntityId',
        'displayEntities',
      ]),
    },
    watch: {
      updateEntityId() {
        this.refreshTreeCode = Math.random();
      },

      deleteEntityId() {
        this.refreshTreeCode = Math.random();
        // if (this.rootData.tree.filter(item => item.id === this.deleteEntityId).length > 0) {
        //   const temp = this.rootData;
        //   this.rootData = {};
        //   temp.tree = temp.tree.filter(item => item.id !== this.deleteEntityId);
        //   this.rootData = temp;
        //   if (this.rootData.tree.length > 1) {
        //     this.selectedEntity = this.rootData.tree[1];
        //   }
        // }
      },
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

      triggerEditMode(isEditMode) {
        this.isTreeUpdating = isEditMode;
      },

      handleFilterEntities(param) {
        const displayEntities = param.map(item => ({
          id: item.id,
          name: item.name,
        }));
        this.setDisplayEntities(displayEntities);
      },

      resetEditMode() {
        // this.getRootTree();
        this.refreshTreeCode = Math.random();
      },

      executeDeleteOperation(deleteList) {
        if (deleteList.length === 0) {
          return new Promise((resolve) => {
            resolve();
          });
        }
        const deleteApiBatch = deleteList.map(item => new Promise((resolve) => {
          this.$api.deleteEntityUnderRobot(this.robotID, item).then(() => {
            resolve();
          });
        }));
        return Promise.all(deleteApiBatch).then(() => new Promise((resolve) => {
          resolve();
        }));
      },

      executeAddRootOperation(rootList) {
        if (rootList.length === 0) {
          return new Promise((resolve) => {
            resolve([]);
          });
        }

        const addRootBatch = rootList.map(item => new Promise((resolve) => {
          this.$api.addRootNode(this.robotID, {
            name: item.name,
            isUpdateDisplayName: true,
            displayName: item.name,
          }).then((res) => {
            resolve({
              oldId: item.id,
              id: res.data.data.freshEntityId,
              name: item.name,
            });
          });
        }));

        return Promise.all(addRootBatch).then(res => new Promise((resolve) => {
          resolve(res);
        }));
      },

      executeAddSubOperation(subList) {
        if (subList.length === 0) {
          return new Promise((resolve) => {
            resolve();
          });
        }

        const addSubBatch = subList.map(item => new Promise((resolve) => {
          this.$api.addSubNode(this.robotID, {
            name: item.name,
            parentEntityId: item.parentEntityId,
            isUpdateDisplayName: true,
            displayName: item.name,
          }).then(() => {
            resolve();
          });
        }));

        return Promise.all(addSubBatch).then(() => new Promise((resolve) => {
          resolve();
        }));
      },

      executeUpdateOperation(updateList) {
        if (updateList.length === 0) {
          return new Promise((resolve) => {
            resolve();
          });
        }

        const editBatch = updateList.map(item => new Promise((resolve) => {
          this.$api.updateNodeName(this.robotID, {
            id: item.id,
            name: item.name,
            isUpdateDisplayName: false,
          }).then(() => {
            resolve();
          });
        }));

        return Promise.all(editBatch).then(() => new Promise((resolve) => {
          resolve();
        }));
      },

      submitChange(param) {
        // 1 execute add root operation
        const rootList = param.addRootNodeList;
        this.executeAddRootOperation(rootList).then((res) => {
          // 2 execute add sub operation
          const subList = param.addSubNodeList;
          res.forEach((rootNode) => {
            if (subList.find(item => item.parentEntityId === rootNode.oldId)) {
              subList.filter(item => item.parentEntityId === rootNode.oldId).forEach((subNode) => {
                const index = subList.indexOf(subNode);
                subNode.parentEntityId = rootNode.id;
                subList.splice(index, 1, subNode);
              });
            }
          });

          return this.executeAddSubOperation(subList);
        }).then(() => {
          // 3 execute update operation
          const editList = param.editNodeList;
          return this.executeUpdateOperation(editList);
        }).then(() => {
          // 4 execute delete operation
          const deleteList = param.deleteNodeList;
          return this.executeDeleteOperation(deleteList);
        })
          .then(() => {
            this.getRootTree();
            this.refreshTreeCode = Math.random();
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


      addDisplayEntity(param) {
        const displayEntities = this.displayEntities;
        displayEntities.push(param);
        this.setDisplayEntities(displayEntities);
      },

      addRootNode() {
        // const originTree = this.rootData.tree.map(item => item);
        // const newEntity = {
        //   name: param.name,
        //   id: param.id,
        //   visible: true,
        //   hasChild: false,
        //   showChild: false,
        //   editable: true,
        //   children: [],
        //   isActive: false,
        //   isHover: false,
        //   parentId: undefined,
        // };
        // originTree.splice(1, 0, newEntity);
        // this.$set(this.rootData, 'tree', originTree);
      },

      getRootTree() {
        this.currentIndex = 1;
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
    },

    beforeMount() {
      this.getRootTree();
    },
  };
</script>
<style lang="scss" scoped>
  .loading {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .entity_manage {
    display: flex;
    width: 100%;
    .category_panel {
      width: 15vw;
      background: #ffffff;
      transition: width 500ms, opacity 300ms 200ms;
      &.hide {
        width: 0;
        opacity: 0;
        .card-category {
          display: none;
        }
      }
    }
  }

</style>
