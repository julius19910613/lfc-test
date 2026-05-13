<template>
  <li>
    <span
      @mouseenter="triggerOperation()"
      @mouseleave="triggerOperation()"
      :class="{ selected: isSelected }"
    >
      <div class="name_column">
        <em  @click="expandEntity" v-if="hasChild" class="icon">
          <icon icon-type="category_dropdown" :size=16></icon>
        </em>
        <em @click="expandEntity" v-if="!hasChild" class="icon file-text">
          <icon icon-type="category_close" :size=16></icon>
        </em>
        <div v-if="!isEditEntityName" @click="selectEntity" :title='treeItemData.name' class="name_column_text">{{treeItemData.name}}</div>
        <input v-else
                type="text"
                v-model="treeItemData.name"
                :placeholder="$t('knowledge_graph.entity_edit.ph_add_sub_entity')"
                @click="stopBubble"
                @keyup.enter="updateEntityName"/>
      </div>
      <div class="operations" v-show="treeItemData.isHover && editMode">
        <icon v-if="canEdit" @click="editEntityName" icon-type="edit_pen_1" :size="12"></icon>
        <icon v-if="canEdit" @click="deleteEntity" icon-type="edit_delete" :size="12"></icon>
      </div>
    </span>
    <ul v-show="requiredAddSubEntity">
      <input type="text"
             v-model="newSubEntity"
             :placeholder="$t('knowledge_graph.entity_edit.ph_add_sub_entity')"
             @keyup.enter="addNewSubEntity"
             @click="stopBubble"
      />
    </ul>
    <ul v-show="open && hasChild">
      <tree-item
        class="sub_item"
        v-for="(item, index) in treeItemData.children"
        :data="item"
        :key="index"
        :addingRootEntity="addingRootEntity"
        :selectedEntity="selectedEntity"
        :addingSubEntity="addingSubEntity"
        :entityNeedDeleted="entityNeedDeleted"
        :editMode="editMode"
        :addSubNodeList="addSubNodeList"
        :editNodeList="editNodeList"
        :entityTreeKeyword="entityTreeKeyword"
        :addRootNodeList="addRootNodeList"
        :currentIndex="item.currentIndex"
        :totalIndex="item.totalIndex"
        :canEdit = "canEdit"
        :canExport = "canExport"
        @closeSubEntity="bubbleCloseSubEntity"
        @selectEntity="bubbleSelectedEntity"
        @deleteEntity="bubbleDeleteEntity"
        @addDeleteEntity="deleteChildEntity"
        @editEntityName="bubbleEditEntityName"
        @updateCurrentIndex="bubbleUpdateCurrentIndex"
      ></tree-item>
    </ul>
    <ul v-show="open && !isLastIndex">
      <div style="flex: 1; padding: 2px 20px">
        <text-button style="width: 100%;"
                     button-type="default"
        @click="loadMoreChild">
          {{ $t('general.load_more') }}
        </text-button>
      </div>
    </ul>
  </li>
</template>

<script>
  import { mapGetters } from 'vuex';
  import Utils from '@/utils/js/misc';
  import api from '../_api/knowledgeGraph';
  import MixinValidate from '../_mixin/Validate';

  export default {
    name: 'tree-item',
    api,
    props: {
      data: {
        type: [Object, Array],
        required: true,
      },
      selectedEntity: {

      },
      addingSubEntity: {

      },
      editMode: {

      },
      entityNeedDeleted: {

      },
      refreshTreeCode: {

      },
      addingRootEntity: {

      },
      addSubNodeList: {

      },
      editNodeList: {

      },
      addRootNodeList: {

      },
      entityTreeKeyword: {

      },
      currentIndex: {

      },
      totalIndex: {

      },
      canEdit: false,
      canExport: false,
    },
    mixins: [MixinValidate],
    mounted() {
      this.treeItemData = this.data;
      this.getSubEntities();
    },


    computed: {
      ...mapGetters([
        'robotID',
        'userID',
        'deleteEntityId',
      ]),

      isLastIndex() {
        // if (this.treeItemData) {
        //   return this.treeItemData.currentIndex === this.treeItemData.totalIndex;
        // }
        return this.currentIndex === this.totalIndex;
      },

      hasChild() {
        if (this.treeItemData.children !== undefined) {
          // this.open = true;
          return this.treeItemData.children && this.treeItemData.children.length > 0;
        }
        return false;
      },

      isSelected() {
        if (this.treeItemData
          && this.treeItemData.id
          && this.selectedEntity
          && this.selectedEntity.id) {
          return this.treeItemData.id === this.selectedEntity.id;
        }
        return false;
      },

      requiredAddSubEntity() {
        if (this.treeItemData
            && this.treeItemData.id
            && this.selectedEntity
            && this.selectedEntity.id
        ) {
          return this.treeItemData.id === this.selectedEntity.id &&
          this.addingSubEntity;
        }
        return false;
      },
    },

    watch: {
      deleteEntityId() {
        if (this.treeItemData.children.filter(item => item.id === this.deleteEntityId).length > 0) {
          this.deleteChildEntity(this.deleteEntityId);
        }
      },
      addingRootEntity() {
        if (this.addingRootEntity) {
          if (this.addingSubEntity) {
            this.newSubEntity = '';
            this.$emit('closeSubEntity', {});
          }
          if (this.isEditEntityName) {
            this.treeItemData.name = this.originEdieName;
            this.isEditEntityName = !this.isEditEntityName;
          }
        }
      },

      addingSubEntity() {
        if (this.addingSubEntity) {
          if (this.isEditEntityName) {
            this.treeItemData.name = this.originEdieName;
            this.isEditEntityName = !this.isEditEntityName;
          }
        }
      },

      refreshTreeCode() {
        if (this.open) {
          this.getSubEntities().then(() => {
          });
        }
      },

      data() {
        this.treeItemData = this.data;
        this.getSubEntities();
      },

      entityNeedDeleted() {
        if (this.treeItemData.id === this.entityNeedDeleted.parentId) {
          // delete entity from children
          this.$api.deleteEntityUnderRobot(this.robotID, this.entityNeedDeleted.id).then(() => {
            const child = this.treeItemData.children
              .filter(item => item.id === this.entityNeedDeleted.id)[0];
            if (child !== undefined) {
              const childIndex = this.treeItemData.children.indexOf(child);
              this.treeItemData.children.splice(childIndex, 1);
            }
          });
        }
      },
      editMode() {
        if (!this.editMode) {
          this.isEditEntityName = false;
        }
      },
    },

    methods: {
      bubbleDeleteEntityPop(param) {
        this.$emit('deleteEntityPop', param);
      },
      bubbleUpdateCurrentIndex(param) {
        console.log(this.treeItemData.children);
        // this.treeItemData.currentIndex = param.index;
        // if (this.treeItemData.currentIndex > this.treeItemData.totalIndex) {
        //   this.treeItemData.currentIndex = this.treeItemData.totalIndex;
        // }

        if (parseInt(param.id, 10) !== 0) {
          const selectedChildren = this.treeItemData.children.find(item => item.id === param.id);
          const childIndex = this.treeItemData.children.indexOf(selectedChildren);

          selectedChildren.currentIndex = param.index;
          if (selectedChildren.currentIndex > selectedChildren.totalIndex) {
            selectedChildren.currentIndex = selectedChildren.totalIndex;
          }

          console.log(this.treeItemData.children);

          this.$api.getChildNodes(this.robotID, param.id,
            { page: selectedChildren.currentIndex })
            .then((res) => {
              const newResult = res.data.data.map(item => ({
                name: item.name,
                id: item.id,
                parentId: '0',
                visible: true,
                hasChild: false,
                showChild: false,
                isHover: false,
                children: [],
              }));

              selectedChildren.children = [...selectedChildren.children, ...newResult];
              console.log(this.treeItemData);
              this.treeItemData.children.splice(childIndex, 1, selectedChildren);
              if (this.treeItemData.children.length > 0) {
                this.treeItemData.hasChild = true;
              }
              console.log(this.treeItemData);
            });
        }
      },

      loadMoreChild() {
        const param = this.treeItemData.currentIndex + 1;
        this.$emit('updateCurrentIndex', {
          id: this.treeItemData.id,
          index: param,
        });
      },

      validateLocalNameDuplicated(param) { // 检查修改中的数据是否已存在同名实体
        if (this.addRootNodeList.filter(item => item.name === param.name).length > 0) {
          return true;
        } else if (this.addSubNodeList.filter(item => item.name === param.name).length > 0) {
          return true;
        } else if (this.editNodeList.filter(item => item.name === param.name).length > 0) {
          return true;
        }
        return false;
      },

      deleteChildEntity(deleteId) {
        const selectedChild = this.treeItemData.children.filter(child => child.id === deleteId)[0];
        const childIndex = this.treeItemData.children.indexOf(selectedChild);
        this.treeItemData.children.splice(childIndex, 1);
        this.treeItemData.children = this.treeItemData.children.map((item) => {
          item.isHover = false;
          return item;
        });
        this.$emit('deleteEntity', deleteId);
        // this.$api.deleteEntityUnderRobot(this.robotID, deleteId).then(() => {
        //   this.treeItemData.children.splice(childIndex, 1);
        // });
      },

      bubbleDeleteEntity(param) {
        this.$emit('deleteEntity', param);
      },

      confirmDeleteEntity() {
        if (this.treeItemData.parentId === '0') {
          // parentId 为0，是全部集合下的元素
          this.$emit('addDeleteEntity', this.treeItemData.id);
        } else if (this.treeItemData.parentId.length === 0) {
          // parentId为空，是一层根实体
          console.log('aaa');
          this.$emit('deleteEntity', this.treeItemData.id);
        } else if (this.treeItemData.parentId) {
          // parentId有值，是子实体
          this.$emit('addDeleteEntity', this.treeItemData.id);
        }
      },
      deleteEntity() {
        if (this.treeItemData.children.length === 0) {
          this.confirmDeleteEntity();
        } else {
          const msg = this.$t('knowledge_graph.entity_edit.entity_delete_msg',
         { name: this.treeItemData.name });
          const option = {
            data: {
              msg,
            },
            callback: {
              ok: () => {
                // console.log('deleteProperty:callback:', JSON.stringify(data, null, 2));
                this.confirmDeleteEntity();
              },
            },
          };
          this.$popCheck(option);
        }
        // this.treeItemData.isHover = false;
      },

      getSubEntities() {
        if (!this.treeItemData.id) {
          return new Promise((resolve) => {
            resolve();
          });
        } else if (this.treeItemData.id !== '0') {
          if (this.treeItemData.parentId === '0') {
            return new Promise((resolve) => {
              resolve();
            });
          }
          return new Promise((resolve) => {
            if (this.treeItemData && this.treeItemData.id && (`${this.treeItemData.id}` || '').indexOf('new_') === -1) {
              // id 合规，是已存在的数据
              this.$api.getChildNodes(this.robotID, this.treeItemData.id,
              { page: 1 })
              .then((res) => {
                this.treeItemData.children = res.data.data.map(d => ({
                  name: d.name,
                  id: d.id,
                  parentId: d.parentId,
                  visible: true,
                  hasChild: false,
                  showChild: false,
                  isHover: false,
                  children: [],
                }));
                if (this.treeItemData.children.length > 0) {
                  this.treeItemData.hasChild = true;
                }
                // console.log(this.data);
                this.treeItemData.currentIndex = 1;
                this.treeItemData.totalIndex = res.data.total === 0 ? 1 : res.data.total;
                resolve();
              });
            } else {
              // id 不合规，是处于添加阶段的数据
              this.treeItemData.children = [];
              this.treeItemData.hasChild = false;
              this.treeItemData.currentIndex = 1;
              this.treeItemData.totalIndex = 1;
            }
          });
        }

        return new Promise((resolve) => {
          this.$api
            .getAllEntitiesByRobotId(this.robotID, { page: 1, keyword: this.entityTreeKeyword })
            .then((res) => {
              this.treeItemData.childTotalIndex = res.data.total;
              this.treeItemData.children = res.data.entities.map(item => ({
                name: item.name,
                id: item.id,
                parentId: '0',
                visible: true,
                hasChild: false,
                showChild: false,
                isHover: false,
                children: [],
              }));
              if (this.treeItemData.children.length > 0) {
                this.treeItemData.hasChild = true;
              }
              this.treeItemData.currentIndex = 1;
              this.treeItemData.totalIndex = res.data.total === 0 ? 1 : res.data.total;
              resolve();
            });
        });
      },

      addNewSubEntity() {
        const tempName = this.onFormatName((this.newSubEntity || '').trim());
        const errMsg = this.$t('knowledge_graph.entity_edit.str_length_error',
          { text: Utils.getEllipsisStr(tempName, 6), len: this.MIXIN_ENTITY_MAX_LENGTH });
        const check = this.onStrLengthCheck({ ...this.checkEntityNameDataBase,
          str: tempName,
          errMsg });
        if (!check) {
          return;
        }
        if (tempName.length > 0) {
          // const entityChain = [];
          const param = {
            id: `new_${Math.random()}`,
            name: tempName,
            parentEntityId: this.treeItemData.id,
          };
          this.$api.checkReapeatEntityName(this.robotID, tempName, '').then((res) => {
            if (res.data.data.found || this.validateLocalNameDuplicated(param)) {
              this.$notifyWarn(
                this.$t('knowledge_graph.entity_edit.duplicated_name_msg', { text: Utils.getEllipsisStr(tempName) }));
            } else {
              this.treeItemData.children.splice(0, 0, {
                id: param.id,
                name: param.name,
                visible: true,
                hasChild: false,
                showChild: false,
                isHover: false,
                children: [],
                currentIndex: 1,
                totalIndex: 1,
                parentId: this.treeItemData.id,
              });
              this.open = true;
              this.$emit('closeSubEntity', param);
              this.newSubEntity = '';
            }
          });
        }
      },

      bubbleCloseSubEntity(param) {
        this.$emit('closeSubEntity', param);
      },

      bubbleSelectedEntity(param) {
        this.$emit('selectEntity', param);
      },

      bubbleEditEntityName(param) {
        this.$emit('editEntityName', param);
      },
      onSubmitDataCheck(list = []) {
        console.log('addRootNodeList', list);
        let valid = true;
        list.map((item) => {
          console.log('list', JSON.stringify(item, null, 2));
          const tempName = this.onFormatName((item.name || '').trim());
          const check = this.onStrLengthCheck({ ...this.checkEntityNameDataBase,
            str: tempName,
            errMsg: `[${Utils.getEllipsisStr(tempName, 6)}] 字符长度超过${this.MIXIN_ENTITY_MAX_LENGTH}个, 请修改!` });
          valid = valid && check;
          return { ...item,
            name: tempName };
        });
        console.error('valid', JSON.stringify(valid, null, 2));
        return { valid, list };
      },
      updateEntityName() {
        const name = ((this.treeItemData || {}).name || '');
        const tempName = this.onFormatName(name.trim());
        const errMsg = this.$t('knowledge_graph.entity_edit.str_length_error',
          { text: Utils.getEllipsisStr(tempName, 6), len: this.MIXIN_ENTITY_MAX_LENGTH });
        const check = this.onStrLengthCheck({ ...this.checkEntityNameDataBase,
          str: tempName,
          errMsg });
        if (!check) {
          return;
        }
        if (tempName.length > 0) {
          if (tempName !== this.originEdieName) {
            const param = {
              name: tempName,
              id: this.treeItemData.id,
            };

            this.$api.checkReapeatEntityName(this.robotID,
              tempName,
              this.treeItemData.id)
              .then((res) => {
                if (res.data.data.found || this.validateLocalNameDuplicated(param)) {
                  this.$notifyWarn(
                    this.$t('knowledge_graph.entity_edit.duplicated_name_msg', { text: Utils.getEllipsisStr(tempName) }));
                } else {
                  this.treeItemData.name = tempName;
                  this.isEditEntityName = false;
                  this.treeItemData.isHover = false;
                  this.$emit('editEntityName', param);
                }
              });
          } else {
            this.treeItemData.name = tempName;
            this.isEditEntityName = false;
            this.treeItemData.isHover = false;
          }
        }
      },

      stopBubble() {

      },

      editEntityName() {
        this.isEditEntityName = true;
        this.originEdieName = this.treeItemData.name;
      },

      triggerOperation() {
        this.treeItemData.isHover = !this.treeItemData.isHover;
      },

      selectEntity() {
        if (!this.editMode) {
          this.$emit('selectEntity', this.treeItemData);
        }
      },

      expandEntity() {
        if (!this.editMode) {
          // this.getSubEntities().then(() => {
          //
          // });
          if (this.hasChild) {
            this.open = !this.open;
          }
        } else {
          this.open = !this.open;
        }
      },
    },

    data() {
      return {
        open: false,
        treeItemData: {
          currentIndex: 1,
          totalIndex: 1,
        },
        isEditEntityName: false,
        newSubEntity: '',
        originEdieName: '',
        chilidrenList: [],
      };
    },
  };
</script>

<style lang="scss" scoped>
  .sub_item {
    padding-left: 20px;
  }

  .selected {
    background:rgba(234,243,255,1);
    color:rgba(24,117,240,1);
  }

  ul {
    list-style: none;
    // margin: 10px 0;
  }
  li {
    // padding: 3px 0;
  }
  li > span {
    cursor: pointer;
    font-size:12px;
    font-family:PingFangSC-Regular;
    font-weight:400;
    color:rgba(102,102,102,1);
    line-height:28px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    .name_column {
      width: 60%;
      display: flex;
      flex-direction: row;
      align-items: center;
      .name_column_text {
        @include textEllipsis();
      }
    }
    .operations {
      // width: 30%;
    }
    input {
      width: 100%;
    }
  }
  li > span:visited{
    background: #fff;
  }
  em.icon {
    display: inline-block;
    width: 20px;
    height: 20px;
    margin-right: 5px;
    background-repeat: no-repeat;
    vertical-align: middle;
  }
  .tree-menu li {
    line-height: 1.5;
  }
</style>
