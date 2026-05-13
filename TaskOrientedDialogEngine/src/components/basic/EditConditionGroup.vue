<template>
  <div class="condition-group-wrapper">
    <!-- {{selectionsWithDollar}} -->
    <div class="group-title-box">
      <span class="group-operator" v-if="groupIndex > 0">
        {{ groupOperator === 'OR' ? '或' : '并且' }}</span>
      <span class="group-title">条件组{{ groupIndex + 1 }} </span>
      <span class="description">符合 {{ data.operator === 'AND' ? '全部' : '任意' }} 以下条件</span>
      <span class="delete-btn" @click="handleDeleteGroup">删除条件组{{ groupIndex + 1 }}</span>
    </div>
    <div class="condition-wrapper" v-for="(condition, index) in conditions" :key="index">
      <span class="label" v-if="index === 0">当</span>
      <span class="label" v-else>{{ data.operator === 'AND' ? '并且' : '或者'}}</span>
      <div class="cond-div">
        <div class="cond1">
          <!-- 高级模式选择类型 -->
          <el-select class="type-selection small-selector"
          v-if="advanceMode" @change="handleChangeConditionType(condition)"
          v-model="condition.type" placeholder="请选择触发类型">
            <el-option v-for="item in optionsSubEntryTypes"
              :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
         <!-- 左边操作数 -->
         <!-- 条件 -->
          <reference-input class="slot-input"
          @change="handleUpdate"
          v-model="condition.left" v-if="condition.type === 'NORMAL' || !advanceMode"
          :referenceList="selectionsWithDollar"></reference-input>
          <el-select class="right-value small-selector"
          @change="handleUpdate" v-if="condition.type === 'NORMAL' || !advanceMode"
          v-model="condition.operator" placeholder="请选择">
            <el-option v-for="item in optionsOperators"
              :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
          <!-- 意图 -->
          <el-select class="operator-selection small-selector"
          @change="handleUpdate"
          v-if="condition.type === 'INTENT'"
          v-model="condition.right" placeholder="请选择">
            <el-option v-for="item in intentsList"
              :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
          <el-input
          @change="handleUpdate"
          v-else-if="condition.type==='REG_EXP' || condition.type==='SPEECH_ACT' "
          v-model="condition.right" class="slot-input" size="small"></el-input>
        </div>
        <!-- 右边操作数 -->
        <div class="cond2" v-if="showRightValue(condition.operator)
        && (condition.type === 'NORMAL' || !advanceMode)">
          <el-select class="operator-selection small-selector" style="margin-left:0px"
          @change="handleUpdate"
          v-model="condition.rightType" placeholder="请选择">
            <el-option v-for="item in optionsRightTypes"
              :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
          <reference-input v-if="condition.rightType==='VAR'" class="slot-input right-value"
          @change="handleUpdate"
          :referenceList="selectionsWithDollar"
          v-model="condition.right"></reference-input>
          <el-input v-else
          @change="handleUpdate"
          v-model="condition.right" class="slot-input right-value" size="small"></el-input>
        </div>
      </div>
      <img class="delete-btn"
      @click="handleRemoveCondition(index)" src="../../assets/images/delete_s.png"/>
    </div>
    <span class="add-condition-btn" @click="handleAddCondition">+新增条件</span>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import ReferenceInput from './ReferenceInput';

export default {
  props: {
    groupIndex: {
      type: Number,
    },
    groupOperator: {
      type: String,
      default: 'OR',
    },
    data: {
      type: Object,
      default() {
        return {
          operator: 'AND',
          items: [],
        };
      },
    },
    // 高级模式，支持选择意图&正则表达式等
    advanceMode: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      conditions: [],
    };
  },
  created() {
    this.initializeData();
  },
  watch: {
    data() {
      this.initializeData();
    },
  },
  components: {
    ReferenceInput,
  },
  computed: {
    ...mapGetters([
      'optionsSubEntryTypes', // 意图，正则表达式，Speech Act, 条件
      'optionsOperators',
      'optionsRightTypes',
      'selectionsWithDollar',
      'intentsList',
    ]),
  },
  methods: {
    initializeData() {
      let conds = [];
      if (this.data && this.data.items) {
        conds = this.data.items;
      }
      this.conditions = conds;
    },
    handleUpdate() {
      this.$emit('update');
    },
    showRightValue(operator) {
      let res = false;
      const currentOP = this.optionsOperators.filter(op => op.value === operator);
      if (currentOP && currentOP[0]) {
        res = !currentOP[0].single;
      }
      return res;
    },
    // 新增条件
    handleAddCondition() {
      this.conditions.push({
        left: '',
        operator: '',
        right: '',
      });
      this.data.items = this.conditions;
      this.handleUpdate();
    },
    // 删除条件
    handleRemoveCondition(index) {
      this.conditions.splice(index, 1);
      this.data.items = this.conditions;
      this.handleUpdate();
    },
    handleDeleteGroup() {
      this.$emit('deleteGroup', this.groupIndex);
    },
    // 高级模式 - 条件的类型发生变化
    handleChangeConditionType(condition) {
      condition.left = '';
      condition.operator = '';
      condition.right = '';
      this.handleUpdate();
    },
  },
};
</script>

<style lang="scss" scoped>
.condition-group-wrapper{
  box-shadow:0px 1px 0px 0px #E9E9E9;
  padding: 20px;
  .group-title-box{
    display: flex;
    .group-operator {
      color: #666666;
      margin-right: 10px;
      font-size: 14px;
      line-height: 20px;
    }
    .group-title{
      color: #333333;
      font-size: 14px;
      line-height: 20px;
      font-weight: bold;
    }
    .description{
      flex: 1;
      margin-left: 10px;
      color: #666666;
      font-size: 14px;
      line-height: 20px;
    }
    .delete-btn{
      color: #666666;
      font-size: 12px;
      line-height: 20px;
      cursor: pointer;
      &:hover{
        color: #F25C62;
      }
    }
  }
  .condition-wrapper{
    display: flex;
    align-items: center;
    background-color: #EEEEEE;
    margin-top: 10px;
    // height: 52px;
    padding: 10px 17px 10px 10px;
    .label{
      min-width: 40px;
      margin-right: 10px;
      text-align: right;
      color: #666666;
      font-size: 14px;
    }
    .cond-div{
      flex: 1;
      .cond1, .cond2{
        width: 100%;
        display: flex;
        .type-selection{
          width: 200px;
          margin-right: 10px;
        }
        .right-value{
          margin-left: 10px;
          flex: 1;
        }
        .slot-input, .operator-selection {
          flex: 1;
          // margin-left: 10px;
        }
      }
      .cond2{
        margin-top: 10px;
      }
    }
    .delete-btn{
      margin-left: 23px;
      width: 13px;
      height: 16px;
      cursor: pointer;
    }
  }
  .add-condition-btn{
    display: inline-block;
    color: #1875F0;
    font-size: 14px;
    cursor: pointer;
    margin-top: 10px;
  }
}
</style>
