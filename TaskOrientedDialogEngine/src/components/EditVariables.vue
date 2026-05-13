<template>
  <el-dialog class="variable-dialog"
  :visible.sync="value" title="变量声明" :before-close="handleClose">
    <div class="variables-wrapper">
      <span class="add-btn" @click="handleAddVariant">+新增声明</span>
      <div class="header-wrapper">
        <span class="type">类型</span>
        <span class="name">变量名</span>
        <span class="default">默认值</span>
        <span class="operation">操作</span>
      </div>
      <div class="content-wrapper">
        <div class="item-wrapper" v-for="(item, index) in variableList" :key="index">
          <el-select class="type type-selector" v-model="item.type" placeholder="请选择">
            <el-option v-for="option in optionsVariantTypes"
            :key="option" :label="option" :value="option">
            </el-option>
          </el-select>
          <el-input class="name name-input" v-model="item.name" size="small"
          :class="{'red-border': validateFail[index]}"
          @change="validateItemData(item, index)"></el-input>
          <el-input class="default default-input"
          v-model="item.defaultValue" size="small"></el-input>
          <span class="operation operation-btn" @click="handleDeleteVariable(index)">删除</span>
        </div>
      </div>
    </div>
    <div slot="footer">
      <button class="btn-small btn-white-gray" @click="handleCancelEdit">取消</button>
      <button class="btn-small btn-dark-blue" @click="handleSaveVariants">确认</button>
    </div>
  </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    variables: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  created() {
    this.initializeData();
  },
  watch: {
    variables() {
      this.initializeData();
    },
  },
  data() {
    return {
      message: '变量声明',
      variableList: [],
      validateFail: {},
    };
  },
  computed: {
    ...mapGetters([
      'optionsVariantTypes',
    ]),
  },
  methods: {
    initializeData() {
      const list = [];
      if (this.variables && this.variables.length) {
        this.variables.forEach((vari) => {
          list.push(Object.assign({}, vari));
        });
      }
      this.variableList = list;
    },
    handleClose() {
      this.$emit('input', false);
    },
    handleAddVariant() {
      this.variableList.unshift({
        type: '',
        name: '',
        defaultValue: '',
      });
    },
    handleDeleteVariable(index) {
      this.variableList.splice(index, 1);
    },
    validateItemData(item, index) {
      if (item.name) {
        this.validateFail[index] = false;
        this.$forceUpdate();
      }
    },
    validateData() {
      let res = true;
      this.variableList.forEach((item, index) => {
        this.validateFail[index] = false;
        if (!item.name) {
          res = false;
          this.validateFail[index] = true;
        }
      });
      this.$forceUpdate();
      return res;
    },
    handleSaveVariants() {
      if (this.validateData()) {
        this.$emit('update', this.variableList);
        this.handleClose();
      }
    },
    handleCancelEdit() {
      this.handleClose();
    },
  },
};
</script>

<style lang="scss" scoped>
.variable-dialog{
  /deep/ .el-dialog{
    width: 900px;
  }
}
.variables-wrapper{
  width: 900px;
  height: 400px;
  .type, .operation {
    flex: 1;
    padding-left: 20px;
  }
  .name {
    flex: 2;
    padding-left: 20px;
  }
  .default{
    flex: 3;
    padding-left: 20px;
  }
  .add-btn{
    display: inline-block;
    margin: 10px 20px;
    cursor: pointer;
    color: #1875F0;
  }
  .header-wrapper{
    display: flex;
    align-items: center;
    height: 50px;
    background-color: #F7F7F7;
    border-top: 1px solid #E9E9E9;
    border-bottom: 1px solid #E9E9E9;
    span{
      color: #666666;
    }
  }
  .content-wrapper{
    height: calc(100% - 50px);
    overflow: auto;
    .item-wrapper{
      display: flex;
      height: 50px;
      align-items: center;
      box-shadow: 0px 1px 0px 0px rgba(233,233,233,1);
      .type-selector{
        height: 32px;
        padding-left: 10px;
        /deep/ .el-input{
          height: 32px;
          input{
            height: 32px;
          }
        }
      }
      .name-input {
        font-size: 14px;
        &.red-border{
          /deep/ input{
            border: 1px solid #F76260;
          }
        }
      }
      .operation-btn{
        color: #F76260;
        cursor: pointer;
      }
    }
  }
}
</style>
