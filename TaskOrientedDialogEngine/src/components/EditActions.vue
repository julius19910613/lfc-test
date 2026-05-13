<template>
  <el-dialog class="action-dialog"
  :visible.sync="value" title="动作设置" :before-close="handleClose">
    <div class="actions-wrapper">
      <div class="action-list-wrapper">
        <div class="menu-bar">
          <span class="title">动作列表</span>
          <button class="btn-white-gray btn-small btn"
          @click="handleAddAction">新增动作模板</button>
        </div>
        <div class="action-list">
          <div class="action-item" v-show="isAddingAction">
            <el-input ref="addActionNameInput" v-model="addActionName" size="small"
            @keyup.enter.native="confirmAddAction" @blur="cancelAddAction"></el-input>
          </div>
          <div class="action-item"
          :class="{'selected': selectedAction && selectedAction.id === action.id}"
          v-for="(action, index) in actionList" :key="index"
          @click="handleSelectAction(action)">
            <span class="action-name" v-if="editIndex!==index">{{action.name}}</span>
            <el-input ref="inputActionName" v-else v-model="editActionName" size="small"
            @keyup.enter.native="confirmEditACName" @blur="cancelEditACName"></el-input>
            <img v-if="editIndex!==index" class="edit-btn" src="../assets/images/edit_btn.png"
            @click.prevent.stop="handleEditActionName(action.name, index)">
            <img v-if="editIndex!==index" class="delete-btn" src="../assets/images/delete_s.png"
            @click.prevent.stop="handleDeleteAction(index)">
          </div>
        </div>
      </div>
      <div class="action-detail-wrapper">
        <div class="menu-bar">
          <span class="title">动作详情</span>
        </div>
        <div class="action-detail" v-if="selectedAction && selectedAction.id">
          <div class="web-api-wrapper">
            <span class="label-web">Web API</span>
            <el-select v-model="selectedAction.type" size="small">
              <el-option key="WEB_API_GET" value="WEB_API_GET" label="WebAPI-GET"></el-option>
              <el-option key="WEB_API_POST" value="WEB_API_POST" label="WebAPI-POST"></el-option>
            </el-select>
            <!-- <span class="label-http">http://</span> -->
            <el-input v-model="selectedAction.url" size="small"
            placeholder="请输入WebAPI地址"></el-input>
          </div>
          <el-input v-if="selectedAction.type === 'WEB_API_POST'"
            type="textarea" :rows="8" placeholder="请输入body"
            v-model="selectedAction.body">
          </el-input>
          <div class="btn-bar">
            <span class="add-btn" @click="handleAddResult">+新增</span>
          </div>
          <div class="table-bar">
            <div class="type">类型</div>
            <div class="result">返回值</div>
            <div class="operation">操作</div>
          </div>
          <div class="table-content">
            <div class="table-item type" :key="index"
            v-for="(item, index) in selectedAction.result">
              <el-select class="type-selector" v-model="item.type" size="mini"
              placeholder="请选择返回类型">
                <el-option v-for="type in optionsVariantTypes"
                  :key="type" :label="type" :value="type">
                </el-option>
              </el-select>
              <el-input class="result-input" v-model="item.name" size="mini"
              placeholder="请输入返回值"></el-input>
              <span class="operation" @click="handleDeleteResult(index)">删除</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div slot="footer">
      <button class="btn-small btn-white-gray" @click="cancelEdition">取消</button>
      <button class="btn-small btn-dark-blue" @click="confirmEdition">确认</button>
    </div>
  </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex';
import templates from '../store/templates';

export default {
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    actions: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      actionList: [],
      selectedAction: null,
      editIndex: -1,
      editActionName: '',
      isAddingAction: false,
      addActionName: '',
      validateFail: {},
    };
  },
  computed: {
    ...mapGetters([
      'optionsVariantTypes',
    ]),
  },
  created() {
    this.initializeData();
  },
  mounted() {
    // this.selectFirstItem();
  },
  watch: {
    value() {
      if (this.value) {
        this.initializeData();
      }
    },
    actions() {
      this.initializeData();
    },
  },
  methods: {
    initializeData() {
      const arr = [];
      if (this.actions && this.actions.length) {
        this.actions.forEach((act) => {
          const item = Object.assign({}, act);
          arr.push(item);
        });
      }
      this.actionList = arr;
      this.selectFirstItem();
    },
    selectFirstItem() {
      if (!this.actionList.length) {
        this.selectedAction = null;
        return;
      }
      this.$nextTick(() => {
        this.selectedAction = this.actionList[0];
      });
    },
    handleClose() {
      this.$emit('input', false);
    },
    handleSelectAction(action) {
      // this.editIndex = -1;
      this.selectedAction = action;
    },
    handleAddAction() {
      this.isAddingAction = true;
      this.$nextTick(() => {
        this.$refs.addActionNameInput.$el.firstElementChild.focus();
      });
    },
    confirmAddAction() {
      if (!this.addActionName) {
        return;
      }
      const action = templates.getActionTemplate(this.addActionName);
      this.isAddingAction = false;
      this.addActionName = '';
      this.actionList.unshift(action);
      this.handleSelectAction(action);
    },
    cancelAddAction() {
      this.isAddingAction = false;
      this.addActionName = '';
    },
    // 修改动作名字
    handleEditActionName(name, index) {
      this.editIndex = index;
      this.editActionName = name;
      this.$nextTick(() => {
        // this.$refs.inputActionName.$el.firstElementChild.focus()
        this.$refs.inputActionName[0].focus();
      });
    },
    confirmEditACName() {
      if (!this.editActionName) {
        return;
      }
      this.actionList[this.editIndex].name = this.editActionName;
      this.editIndex = -1;
    },
    cancelEditACName() {
      this.editIndex = -1;
    },
    handleDeleteAction(index) {
      this.actionList.splice(index, 1);
      this.selectFirstItem();
    },
    handleAddResult() {
      if (!this.selectedAction.result) {
        this.selectedAction.result = [];
        this.selectedAction = Object.assign({}, this.selectedAction);
      }
      this.selectedAction.result.unshift({
        name: '',
        type: '',
      });
    },
    handleDeleteResult(index) {
      this.selectedAction.result.splice(index, 1);
    },
    // validateItemData(item, index) {
    //   if (item.name) {
    //     this.validateFail[index] = false;
    //     this.$forceUpdate();
    //   }
    // },
    // validateData() {
    //   let res = true;
    //   this.variableList.forEach((item, index) => {
    //     this.validateFail[index] = false;
    //     if (!item.name) {
    //       res = false;
    //       this.validateFail[index] = true;
    //     }
    //   });
    //   this.$forceUpdate();
    //   return res;
    // },
    confirmEdition() {
      // if (this.validateData()) {
      //   this.$emit('update', this.variableList);
      //   this.handleClose();
      // }
      this.$emit('update', this.actionList);
      this.handleClose();
    },
    cancelEdition() {
      this.handleClose();
    },
  },
};
</script>

<style lang="scss" scoped>
.action-dialog{
  /deep/ .el-dialog{
    width: 900px;
  }
}
.actions-wrapper{
  // width: 900px;
  height: 450px;
  display: flex;
  padding: 0px 20px;
  .menu-bar{
    height: 60px;
    display: flex;
    align-items: center;
    .title{
      color: #333333;
      font-size: 14px;
    }
    .btn{
      margin-left: 20px;
      width: 100px;
      height: 28px;
    }
  }
  .action-list-wrapper{
    flex: 3;
    margin-right: 10px;
    height: 100%;
    display: inline-block;
    .action-list{
      // width: 100%;
      height: calc(100% - 60px);
      overflow: auto;
      .action-item{
        box-sizing: border-box;
        display: flex;
        align-items: center;
        width: 100%;
        height: 50px;
        border-radius: 2px;
        border: 1px solid #E9E9E9;
        margin-bottom: 10px;
        padding: 0px 20px 0px 16px;
        span{
          color: #666666;
          flex: 1;
        }
        img{
          width: 14px;
          margin-left: 10px;
          cursor: pointer;
          display: none;
        }
        &:hover{
          border-color: #CCCCCC;
          span{
            color: #333333;
          }
          img{
            display: block;
          }
        }
        &.selected{
          background-color: #3D80FF;
          border-color: #3D80FF;
          color: #FFFFFF;
          span{
            color: #FFFFFF;
          }
          box-shadow: 0px 2px 5px 0px rgba(0,0,0,0.15);
        }
        .action-name{
          color: #666666;
        }
      }
    }
  }
  .action-detail-wrapper{
    flex: 5;
    display: inline-block;
    .action-detail{
      box-sizing: border-box;
      padding: 0px 15px;
      margin-bottom: 20px;
      box-sizing: border-box;
      height: calc(100% - 80px);
      overflow: auto;
      border: 1px solid #E9E9E9;
      .web-api-wrapper{
        height: 50px;
        display: flex;
        align-items: center;
        box-shadow: 0px 1px 0px 0px #E9E9E9;
        font-size: 14px;
        .label-web{
          color: #333333;
        }
        .el-select{
          margin-left: 10px;
          width: 130px;
        }
        .label-http{
          color: #BABABA;
          margin-left: 20px;
          margin-right: 10px;
        }
        .el-input{
          margin-left: 10px;
          flex: 1;
          // height: 28px;
        }
      }
      .btn-bar{
        height: 50px;
        display: flex;
        align-items: center;
        span{
          color: #1875F0;
          cursor: pointer;
        }
      }
      .table-bar{
        font-size: 12px;
        background-color: #F7F7F7;
        box-shadow:0px 1px 0px 0px #E9E9E9;
        >div{
          box-sizing: border-box;
          height: 50px;
          line-height: 50px;
          display: inline-block;
          padding-left: 22px;
        }
      }
      .type, .operation{
        width: 25%;
      }
      .result{
        width: 48%;
      }
      .table-content{
        font-size: 12px;
        .table-item{
          box-shadow:0px 1px 0px 0px #E9E9E9;
          width: 100%;
          display: inline-block;
          line-height: 50px;
          line-height: 50px;
          .type-selector{
            margin-left: 10px;
            width: 25%;
          }
          .result-input{
            width: 48%;
            margin-left: 5px;
          }
          .operation{
            width: 25%;
            margin-left: 10px;
            cursor: pointer;
            &:hover{
              color: #F25C62
            }
          }
        }
      }
    }
  }
}
</style>
