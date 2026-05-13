<template>
  <div class="tree-menu">
    <div class="tree-header">
      <div class="title">{{ $t('knowledge_graph.data_manage.category_title') }}</div>
      <template v-if="!isEditMode">
        <div class="operations">
            <div v-if="!searchExpand" class="icon_edit">
              <icon @click="toggleExpandMode" iconType="kg_search" :size="24"></icon>
            </div>
            <div v-else class="search_img">
              <search-input @focus="resetInputExpand" v-model="entityNameKeyword"></search-input>
            </div>
            <div v-if="allowEdit && canEdit" @click="triggerEditMode" class="icon_edit">
              <icon iconType="kg_edit" :size="24"></icon>
            </div>
        </div>
      </template>
      <template v-else>
        <div class="operations" v-if="canEdit">
          <div class="click_operation" @click="resetEditMode">{{ $t('general.cancel') }}</div>
          <div class="click_operation" @click="submitChange">{{ $t('general.save') }}</div>
        </div>
      </template>
    </div>
    <div v-if="isEditMode" class="tree-operator">
      <div class="operate_btn" @click="triggerRootEntity">
        <div class="icon-block">
          <icon icon-type="category_add" :size=14></icon>
        </div>
        <span> {{ $t('knowledge_graph.data_manage.btn_add_root') }} </span>
      </div>
      <div class="operate_btn" @click="triggerSubEntity">
        <div class="icon-block">
          <icon icon-type="category_add" :size=14></icon>
        </div>
        <span> {{ $t('knowledge_graph.data_manage.btn_add_sub') }} </span>
      </div>
    </div>
    <div class="tree-content">
      <ul v-if="addingRootEntity">
        <input
          sytle='font-size:10px'
          type="text"
          :placeholder="$t('knowledge_graph.entity_edit.ph_add_sub_entity')"
          @keyup.enter="addRootEntity"
          v-model="newRootEntity" />
      </ul>
      <ul v-for="item in treeData">
        <c-tree-item
          :selectedEntity="selectedEntity"
          :data="item"
          :addingRootEntity="addingRootEntity"
          :addingSubEntity="addingSubEntity"
          :editMode="isEditMode"
          :entityNeedDeleted="entityNeedDeleted"
          :refreshTreeCode="refreshTreeCode"
          :addSubNodeList="addSubNodeList"
          :editNodeList="editNodeList"
          :addRootNodeList="addRootNodeList"
          :entityTreeKeyword="entityNameKeyword"
          :currentIndex="item.currentIndex"
          :totalIndex="item.totalIndex"
          :canEdit = "canEdit"
          :canExport = "canExport"
          @closeSubEntity="resetSubEntity"
          @selectEntity="bubbleSelectedEntity"
          @deleteEntity="deleteChildEntity"
          @editEntityName="resetEditEntity"
          @updateCurrentIndex="updateCurrentIndex"
        ></c-tree-item>
      </ul>
      <ul v-show="!isLastIndex">
        <div style="flex: 1; padding: 2px 20px">
          <text-button style="width: 100%;"
                       button-type="default"
                       @click="loadMoreChild">
            {{ $t('general.load_more') }}
          </text-button>
        </div>
      </ul>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import Utils from '@/utils/js/misc';
  import cTreeItem from '../_components/TreeItem';
  import SearchInput from './SearchInput';
  import api from '../_api/knowledgeGraph';
  import MixinValidate from '../_mixin/Validate';

  export default {
    api,
    props: {
      data: {
        required: true,
      },
      selectedEntity: {

      },

      allowEdit: {

      },

      entityNeedDeleted: {

      },

      refreshTreeCode: {

      },
      canEdit: false,
      canExport: false,
    },
    components: {
      cTreeItem,
      SearchInput,
    },
    mixins: [MixinValidate],
    computed: {
      ...mapGetters([
        'robotID',
      ]),

      isLastIndex() {
        return this.data.currentIndex === this.data.totalIndex;
      },
    },

    watch: {
      refreshTreeCode() {
        this.addSubNodeList = [];
        this.editNodeList = [];
        this.addRootNodeList = [];
        this.deleteNodeList = [];
        if (this.entityNameKeyword.length === 0) {
          this.treeData = [];
          // this.treeData = this.data.tree;
          this.$emit('selectEntity', {
            id: '-1',
            entityTreeKeyword: '',
          });
        } else {
          this.entityNameKeyword = '';
        }
      },
      data() {
        this.treeData = this.data.tree;
        console.log(this.treeData);
      },
      entityNameKeyword() {
        this.timer = new Date().getTime();

        setTimeout(() => {
          if (new Date().getTime() - this.timer >= 1000) {
            this.filterResultByKeyword();
          }
        }, 1000);
      },
    },

    data() {
      return {
        treeData: [],
        searchExpand: false,
        isEditMode: false,
        addingRootEntity: false,
        addingSubEntity: false,
        entityNameKeyword: '',
        newRootEntity: '',
        addSubNodeList: [],
        editNodeList: [],
        addRootNodeList: [],
        deleteNodeList: [],
        timer: null,
      };
    },
    methods: {
      updateCurrentIndex(param) {
        console.log(param);
        const selectedItem = this.treeData.find(item => item.id === param.id);
        const selectedIndex = this.treeData.indexOf(selectedItem);
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
              }));
              selectedItem.children = [...selectedItem.children, ...newResult];
              if (selectedItem.children.length > 0) {
                selectedItem.hasChild = true;
              }
            });
          this.treeData.splice(selectedIndex, 1, {});
          this.treeData.splice(selectedIndex, 1, selectedItem);
        } else {
          const param1 = {
            page: selectedItem.currentIndex,
          };
          if (this.entityNameKeyword && this.entityNameKeyword.length > 0) {
            param1.keyword = this.entityNameKeyword;
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
          this.treeData.splice(selectedIndex, 1, {});
          this.treeData.splice(selectedIndex, 1, selectedItem);
        }
      },

      loadMoreChild() {
        const newIndex = this.data.currentIndex + 1;
        this.$emit('updateCurrentIndex', {
          index: newIndex,
          id: -1,
        });
      },

      filterResultByKeyword() {
        this.treeData = [];
        if (this.entityNameKeyword.length === 0) {
          this.treeData = this.data.tree;
          this.$emit('selectEntity', {
            id: '-1',
            entityTreeKeyword: '',
          });
        } else {
          this.$emit('selectEntity', {
            id: '0',
            entityTreeKeyword: this.entityNameKeyword,
          });
        }
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
        const selectedChild = this.treeData.filter(child => child.id === deleteId)[0];
        const childIndex = this.treeData.indexOf(selectedChild);
        if (this.addSubNodeList.find(item => item.id === deleteId)) {
          const selectedSubNode = this.addSubNodeList.find(item => item.id === deleteId);
          const selectedIndex = this.addSubNodeList.indexOf(selectedSubNode);
          this.addSubNodeList.splice(selectedIndex, 1);
        } else if (this.addRootNodeList.find(item => item.id === deleteId)) {
          const selectedSubNode = this.addRootNodeList.find(item => item.id === deleteId);
          const selectedIndex = this.addRootNodeList.indexOf(selectedSubNode);
          this.addRootNodeList.splice(selectedIndex, 1);
        } else if (this.editNodeList.find(item => item.id === deleteId)) {
          const selectedSubNode = this.editNodeList.find(item => item.id === deleteId);
          const selectedIndex = this.editNodeList.indexOf(selectedSubNode);
          this.editNodeList.splice(selectedIndex, 1);
        } else if (this.deleteNodeList.find(item => item === deleteId)) {
          const selectedSubNode = this.deleteNodeList.find(item => item === deleteId);
          const selectedIndex = this.deleteNodeList.indexOf(selectedSubNode);
          this.deleteNodeList.splice(selectedIndex, 1);
        } else {
          this.deleteNodeList.push(deleteId);
        }
        if (childIndex !== -1) {
          this.treeData.splice(childIndex, 1);
          if (childIndex <= this.treeData.length - 1 && this.treeData.length > 0) {
            const nextData = this.treeData[childIndex];
            nextData.isHover = true;
            this.treeData.splice(childIndex, 1, nextData);
          }
        }
      },

      bubbleSelectedEntity(param) {
        const data = param;
        data.entityTreeKeyword = this.entityNameKeyword;
        this.$emit('selectEntity', data);
      },

      triggerSubEntity() {
        if (this.addingRootEntity) {
          this.newRootEntity = '';
          this.addingRootEntity = !this.addingRootEntity;
        }
        this.addingSubEntity = true;
      },

      resetEditEntity(param) {
        if (this.addSubNodeList.find(item => item.id === param.id)) {
          const selectedSubNode = this.addSubNodeList.find(item => item.id === param.id);
          const selectedIndex = this.addSubNodeList.indexOf(selectedSubNode);
          selectedSubNode.name = param.name;
          this.addSubNodeList.splice(selectedIndex, 1, selectedSubNode);
        } else if (this.addRootNodeList.find(item => item.id === param.id)) {
          const selectedSubNode = this.addRootNodeList.find(item => item.id === param.id);
          const selectedIndex = this.addRootNodeList.indexOf(selectedSubNode);
          selectedSubNode.name = param.name;
          this.addRootNodeList.splice(selectedIndex, 1, selectedSubNode);
        } else if (this.editNodeList.find(item => item.id === param.id)) {
          const selectedSubNode = this.editNodeList.find(item => item.id === param.id);
          const selectedIndex = this.editNodeList.indexOf(selectedSubNode);
          selectedSubNode.name = param.name;
          this.editNodeList.splice(selectedIndex, 1, selectedSubNode);
        } else {
          this.editNodeList.push(param);
        }
      },

      resetSubEntity(param) {
        this.addingSubEntity = false;
        if (Object.keys(param).length > 0) {
          this.addSubNodeList.push(param);
        }
        // this.$emit('addSubEntitySuccess', param);
      },

      triggerRootEntity() {
        if (this.addingSubEntity) {
          this.newSubEntity = '';
          this.addingSubEntity = !this.addingSubEntity;
        }
        this.addingRootEntity = true;
      },

      addRootEntity() {
        const tempName = this.onFormatName((this.newRootEntity || '').trim());
        const errMsg = this.$t('knowledge_graph.entity_edit.str_length_error',
          { text: Utils.getEllipsisStr(tempName, 6), len: this.MIXIN_ENTITY_MAX_LENGTH });
        const check = this.onStrLengthCheck({ ...this.checkEntityNameDataBase,
          str: tempName,
          errMsg });
        if (!check) {
          return;
        }
        if (tempName.length > 0) {
          const param = {
            id: `${Math.random()}`,
            name: tempName,
          };
          this.$api.checkReapeatEntityName(this.robotID, tempName, '').then((res) => {
            if (res.data.data.found || this.validateLocalNameDuplicated(param)) {
              this.$notifyWarn(
                this.$t(`knowledge_graph.entity_edit.${res.data.data.errMsg}`));
            } else {
              const newEntity = {
                name: param.name,
                id: param.id,
                visible: true,
                hasChild: false,
                showChild: false,
                editable: true,
                children: [],
                isActive: false,
                isHover: false,
                parentId: '',
                childCurrentIndex: 1,
                currentIndex: 1,
                totalIndex: 1,
              };
              this.addRootNodeList.push(param);
              const result = this.treeData.map(item => item);
              result.splice(1, 0, newEntity);
              this.treeData = [];
              this.treeData = result.map(item => item);
              // this.$emit('addRootNode', param);
              this.newRootEntity = '';
            }
          });
        }
      },

      resetInputExpand(val) {
        if (!val) {
          this.searchExpand = false;
        }
      },

      toggleExpandMode() {
        this.searchExpand = !this.searchExpand;
      },

      triggerEditMode() {
        this.isEditMode = true;
        this.entityNameKeyword = '';
        this.$emit('triggerEditMode', this.isEditMode);
      },

      resetEditMode() {
        this.addingSubEntity = false;
        this.addingRootEntity = false;
        this.isEditMode = false;
        this.$emit('resetEditMode');
        this.$emit('triggerEditMode', this.isEditMode);
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
      submitChange() {
        const addRootNodeListCheck = this.onSubmitDataCheck(this.addRootNodeList);
        const addSubNodeListCheck = this.onSubmitDataCheck(this.addSubNodeList);
        const editNodeListCheck = this.onSubmitDataCheck(this.editNodeList);
        const param = {
          addSubNodeList: addSubNodeListCheck.list,
          editNodeList: editNodeListCheck.list,
          addRootNodeList: addRootNodeListCheck.list,
          deleteNodeList: this.deleteNodeList,
        };
        if (!addRootNodeListCheck.valid || !addSubNodeListCheck.valid || !editNodeListCheck.valid) {
          console.error('submitChange:', JSON.stringify(param, null, 2));
          // this.$message({
          //   message: '提交数据有误，此处需要i18n',
          //   type: 'error',
          // });
          return;
        }
        this.addingSubEntity = false;
        this.addingRootEntity = false;
        this.isEditMode = false;
        this.$emit('submitChange', param);
        this.$emit('triggerEditMode', this.isEditMode);
      },
    },
  };
</script>

<style lang="scss" scoped>
  .tree-menu {
    display: flex;
    flex-direction: column;
    // max-height: 80%;
    overflow: auto;
    background: white;
    border-radius: 4px;
    .tree-header {
      height: 40px;
      padding: 10px;
      display: flex;
      flex-direction: row;
      justify-content: stretch;
      align-items: center;
      .title {
        min-width: 76px;
        padding: 0px 10px;
        font-size:14px;
        font-family:PingFangSC-Regular;
        font-weight:400;
        color:rgba(51,51,51,1);
        line-height:20px;
      }
      .operations {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        flex: 1;
        .search_img {
          flex: 1;
          width: 20px;
        }
        .click_operation {
          font-size:12px;
          font-family:PingFangSC-Regular;
          font-weight:400;
          color:rgba(24,117,240,1);
          line-height:16px;
          padding: 0px 10px;
          cursor: pointer;
        }
        .icon_edit {
          margin-top: 2px;
          margin-left: 10px;
        }
      }
    }
    .tree-operator {
      height: 40px;
      padding: 10px 20px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      .operate_btn {
        display: flex;
        flex-direction: row;
        align-items: center;
        font-size:12px;
        font-family:PingFangSC-Regular;
        font-weight:400;
        color:rgba(24,117,240,1);
        line-height:16px;
        cursor: pointer;
        .icon-block {
          width: 14px;
          height: 14px;
          display: flex;
          align-items: center;
          margin-right: 5px;
          justify-content: center;
        }
      }
    }
    .tree-content {
      padding: 0px 20px;
      max-height: 73vh;
      overflow: auto;
      ul {
        box-shadow:0px -1px 0px 0px rgba(233,233,233,1);
      }

      input {
        width: 100%;
      }
    }
  }

</style>
