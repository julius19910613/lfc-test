<template>
  <div class="edit-entry-wrapper">
    <div class="header-wrapper">
      <span class="title">节点详细规则 -【{{data.title}}】</span>
    </div>
    <div class="triggers-wapper">
      <h1 class="title">开始触发</h1>
      <div class="triggers-section">
        <div class="section-title">触发条件</div>
        <div class="section-content">
          <h1 class="title">用户回答</h1>
          <div class="trigger-item" v-for="(item, index) in triggers" :key="index">
            <span class="label">{{ index === 0 ? '当回答' : '或者 回答' }}</span>
            <el-select class="type-selection small-selector"
            v-model="item.type" placeholder="请选择"
            @change="handleUpdate">
              <el-option v-for="item in optionsEntryTypes"
                :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
            <div class="value-section">
              <el-select v-if="item.type === 'INTENT'" class="value-selector small-selector"
              v-model="item.value" placeholder="请选择"
              @change="handleUpdate">
                <el-option v-for="intent in intentsList"
                  :key="intent.name" :label="intent.name" :value="intent.name">
                </el-option>
              </el-select>
              <el-input v-else v-model="item.value" size="small"
              @change="handleUpdate"></el-input>
            </div>
            <img class="delete-btn" src="../assets/images/delete_s.png"
            @click="handleDeleteTrigger(index)"/>
          </div>
          <p class="add-trigger-btn" @click="handleAddTrigger">+新增触发</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import EditConditionGroup from './basic/EditConditionGroup';

export default {
  components: {
    EditConditionGroup,
  },
  props: {
    data: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      entryTitle: '',
      triggers: [],
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
  computed: {
    ...mapGetters([
      'optionsEntryTypes',
      'intentsList',
    ]),
    // triggers() {
    //   let res = [];
    //   if (this.data && this.data.criteria && this.data.criteria.items) {
    //     res = this.data.criteria.items;
    //   }
    //   return res;
    // },
  },
  methods: {
    initializeData() {
      // 标题
      this.entryTitle = this.data.title || '';
      // 触发条件
      let triggerArr = [];
      if (this.data && this.data.criteria && this.data.criteria.items) {
        triggerArr = this.data.criteria.items;
      }
      this.triggers = triggerArr;
    },
    handleChangeTitle() {
      if (this.entryTitle) {
        this.data.title = this.entryTitle;
        this.handleUpdate();
      }
    },
    handleAddTrigger() {
      this.triggers.push({ type: '', value: '' });
      this.data.criteria.items = this.triggers;
      this.$emit('update');
    },
    handleDeleteTrigger(index) {
      this.triggers.splice(index, 1);
      this.data.criteria.items = this.triggers;
      this.handleUpdate();
    },
    handleUpdate() {
      this.$emit('update');
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../assets/scss/index";
.edit-entry-wrapper {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding: 20px;
  overflow-y: auto;
  .header-wrapper{
    border-radius: 2px;
    background-color: #F7F7F7;
    height: 50px;
    display: flex;
    align-items: center;
    padding: 0px 20px;
    .title {
      color: #333333;
      font-size: 14px;
    }
  }
  .basic-wrapper{
    margin-top: 20px;
    .title{
      color: #333333;
      font-size: 14px;
      line-height: 20px;
    }
    .node-name-box{
      border-radius: 2px;
      margin-top: 10px;
      background-color: #F7F7F7;
      height: 72px;
      display: flex;
      align-items: center;
      padding: 0px 20px;
      .label{
        color: #666666;
        font-size: 14px;
      }
      .input-box{
        flex: 1;
        margin-left: 10px;
        font-size: 14px;
      }
    }
  }
  .triggers-wapper{
    margin-top: 20px;
    .title{
      color: #333333;
      font-size: 14px;
      line-height: 20px;
    }
    .triggers-section{
      &:hover{
        box-shadow:0px 5px 10px 0px rgba(0,0,0,0.15);
      }
      margin-top: 10px;
      background-color: #F7F7F7;
      border-radius: 2px;
      .section-title{
        background-color: #EEEEEE;
        color: #666666;
        font-size: 14px;
        display: flex;
        align-items: center;
        height: 40px;
        padding: 0px 20px;
        border-radius: 2px 2px 0px 0px;
      }
      .section-content{
        padding: 20px;
        .title{
          color: #333333;
          font-size: 14px;
          line-height: 20px;
          font-weight: bold;
        }
        .trigger-item{
          background-color: #EEEEEE;
          border-radius: 1px;
          margin-top: 10px;
          display: flex;
          height: 52px;
          align-items: center;
          .label{
            width: 61px;
            margin-left: 10px;
            color: #666666;
            font-size: 14px;
            text-align: right;
          }
          .type-selection{
            flex: 1;
            margin-left: 10px;
          }
          .value-section{
            flex: 1;
            margin-left: 10px;
            .value-selector{
              width: 100%;
            }
            .el-input{
              font-size: 14px;
            }
          }
          .delete-btn{
            width: 13px;
            height: 16px;
            margin: 0 17px 0px 23px;
            cursor: pointer;
          }
        }
        .add-trigger-btn{
          color: #1875F0;
          cursor: pointer;
          font-size: 14px;
          line-height: 20px;
          margin-top: 10px;
        }
      }
    }
  }
}
</style>

