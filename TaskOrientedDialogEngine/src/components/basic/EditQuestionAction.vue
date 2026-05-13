<template>
  <div class="question-action-wrapper">
    <h1 class="title">执行</h1>
      <!-- {{triggers}} -->
      <!-- {{terminations}} -->
      <!-- {{confirms.options}} -->
      <!-- {{ globalActions }} -->
    <div class="action-wrapper" v-for="(action, index) in actionList" :key="index">
      <div class="action-title-box">
        <span class="action-title">执行{{ index + 1 }}</span>
        <span class="delete-btn" @click="handleDeleteAction(index)">删除执行{{ index + 1 }}</span>
      </div>
      <div class="action-content-box">
        <div class="action-item-box">
          <span class="label">执行位置</span>
          <el-select v-model="action.position" size="small" @change="handleUpdate">
            <el-option v-for="position in optionPositions"
            :key="position.value" :value="position.value" :label="position.label"></el-option>
          </el-select>
        </div>
        <div class="action-item-box">
          <span class="label">执行动作</span>
          <el-select v-model="action.actionId" size="small" @change="handleUpdate">
            <el-option v-for="action in globalActions"
            :key="action.id" :value="action.id" :label="action.name"></el-option>
          </el-select>
        </div>
      </div>
    </div>
    <button class="btn-dark-blue add-trigger-btn" @click="handleAddAction">+新增执行</button>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  props: {
    value: {
      type: Array,
      default() {
        return [];
      },
    },
    triggers: {
      type: Array,
      default() {
        return [];
      },
    },
    terminations: {
      type: Array,
      default() {
        return [];
      },
    },
    confirms: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      actionList: [],
    };
  },
  created() {
    this.initializeData();
  },
  watch: {
    value() {
      this.initializeData();
    },
  },
  computed: {
    ...mapGetters([
      'globalActions',
    ]),
    optionTriggers() {
      const res = [];
      for (let i = 0; i < this.triggers.length; i += 1) {
        res.push({
          label: `触发${i + 1}`,
          value: `TRIGGER-${i}`,
          execPoint: 'TRIGGER',
          pos: i,
        });
      }
      return res;
    },
    optionTerminations() {
      const res = [];
      for (let i = 0; i < this.terminations.length; i += 1) {
        res.push({
          label: `结束${i + 1}`,
          value: `TERMINATION-${i}`,
          execPoint: 'TERMINATION',
          pos: i,
        });
      }
      return res;
    },
    optionConfirms() {
      const res = [];
      if (!this.confirms || !this.confirms.options) {
        return [];
      }
      for (let i = 0; i < this.confirms.options.length; i += 1) {
        res.push({
          label: `确认${i + 1}`,
          value: `CONFIRM-${i}`,
          execPoint: 'CONFIRM',
          pos: i,
        });
      }
      return res;
    },
    optionOthers() {
      const res = [
        { label: '节点初始化', value: 'INIT', execPoint: 'INIT', pos: '' },
        { label: '首次触发本节点', value: 'FIRST_TRIGGER', execPoint: 'FIRST_TRIGGER', pos: '' },
        { label: '每次触发本节点', value: 'TRIGGER', execPoint: 'TRIGGER', pos: '' },
        { label: '节点结束', value: 'TERMINATION', execPoint: 'TERMINATION', pos: '' },
      ];
      return res;
    },
    optionPositions() {
      return Array.concat(this.optionOthers);
      // return Array.concat(this.optionTriggers, this.optionTerminations,
      //   this.optionConfirms, this.optionOthers);
    },
  },
  methods: {
    initializeData() {
      this.actionList = [];
      if (this.value && this.value.length) {
        this.value.forEach((action) => {
          const act = Object.assign({}, action);
          if (act.execPoint === 'INIT' || act.execPoint === 'TERMINATION'
          || act.execPoint === 'FIRST_TRIGGER' || act.execPoint === 'TRIGGER') {
            act.position = act.execPoint;
          } else if (act.execPoint) {
            act.position = `${act.execPoint}-${act.pos}`;
          } else {
            act.position = '';
          }
          this.actionList.push(act);
        });
      }
    },
    handleUpdate() {
      const res = [];
      this.actionList.forEach((action) => {
        console.log(action);
        let execPoint = '';
        let pos = '';
        if (action.position) {
          if (action.position.indexOf('INIT') !== -1 || action.position.indexOf('TERMINATION') !== -1 ||
            action.position.indexOf('TRIGGER') !== -1 || action.position.indexOf('FIRST_TRIGGER') !== -1) {
            execPoint = action.position;
            pos = '';
          } else {
            execPoint = action.position.substring(0, action.position.indexOf('-'));
            pos = action.position.substring(action.position.indexOf('-') + 1);
          }
        }
        const finalAction = {
          actionId: action.actionId,
          execPoint,
          pos,
        };
        res.push(finalAction);
      });
      this.$emit('update', res);
    },
    handleAddAction() {
      this.actionList.push({
        actionId: '',
        execPoint: '',
        pos: '',
      });
      this.handleUpdate();
      // actions: [
      //   {
      //     actionId: 'queryAddress',
      //     execPoint: 'TRIGGER',
      //     pos: 1,
      //   }
      // ]
    },
    handleDeleteAction(index) {
      this.actionList.splice(index, 1);
      this.handleUpdate();
    },
  },
};
</script>

<style lang="scss" scoped>
.question-action-wrapper{
  .title{
    margin-top: 20px;
    color: #333333;
    font-size: 14px;
    line-height: 20px;
    margin-bottom: 10px;
  }
  .action-wrapper{
    margin-top: 10px;
    background-color: #F7F7F7;
    border-radius: 2px;
    border:1px solid rgba(219,219,219,1);
    &:hover{
      box-shadow:0px 5px 10px 0px rgba(0,0,0,0.15);
    }
    .action-title-box{
      background-color: #EEEEEE;
      height: 40px;
      display: flex;
      padding: 0px 20px;
      align-items: center;
      border-radius: 2px 2px 0px 0px;
      .action-title{
        color: #666666;
        font-size: 14px;
        flex: 1;
      }
      .delete-btn{
        color: #666666;
        font-size: 12px;
        cursor: pointer;
        &:hover{
          color: #F25C62;
        }
      }
    }
    .action-content-box{
      background-color: #F7F7F7;
      padding: 10px 20px 20px 20px;
      font-size: 14px;
      .action-item-box{
        background-color: #EEEEEE;
        display: flex;
        height: 52px;
        align-items: center;
        margin-top: 10px;
        padding: 0px 20px;
        .label{
          color: #666666;
          width: 80px;
          text-align: right;
          margin-right: 10px;
        }
        .el-select{
          flex: 1;
        }
      }
    }
  }
  .add-trigger-btn{
    width: 160px;
    height: 32px;
    margin-top: 10px;
    font-size: 14px;
  }
}
</style>
