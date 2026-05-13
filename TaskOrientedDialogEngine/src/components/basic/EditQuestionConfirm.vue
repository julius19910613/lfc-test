<template>
  <div class="edit-confirm-wrapper">
    <h1 class="title">信息确认</h1>
    <div class="mode-wrapper">
      <span>模式</span>
      <el-select v-model="confirmMode"
      @change="handleChangeConfirmMode(confirmMode)" class="small-selector">
        <el-option v-for="item in optionsMode"
        :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
    </div>
    <div class="content-wrapper" v-if="data.options && data.options.length">
      <div v-if="confirmMode==='NORMAL'" class="confirm-wrapper">
        <!-- 普通模式 -->
        <div class="slots-wrapper">
          <div class="slot-item"
          v-for="(slot, slotIndex) in data.options[0].targets" :key="slotIndex">
            <span class="slot-name">Slot{{ slotIndex + 1 }}: {{ slot }}</span>
            <span class="condition">(条件：当{{ slot }}存在)</span>
            <span class="delete-slot"
            @click="handleDeleteSlot(0, slot, slotIndex)">删除Slot{{ slotIndex + 1 }}</span>
          </div>
        </div>
        <div class="normal-speech-wrappper">
          <div>
            <span>确认话术</span>
            <reference-input class="slot-input" v-model="data.options[0].nlTemplates.options[0]"
            @change="handleUpdate"
            :referenceList="selectionsWithDollar"></reference-input>
          </div>
          <div v-if="data.options[0].fNlTemplates"
          style="margin-top:10px;">
            <span>失败话术</span>
            <reference-input class="slot-input"
            v-model="data.options[0].fNlTemplates.options[0]"
            @change="handleUpdate" :referenceList="selectionsWithDollar"></reference-input>
          </div>
        </div>
      </div>
      <div v-else>
        <!-- 高级模式 -->
        <div v-for="(confirm, confirmIndex) in data.options" :key="confirmIndex"
        class="confirm-wrapper">
          <div class="slots-wrapper">
            <div class="slot-item" v-for="(slot, slotIndex) in confirm.targets" :key="slotIndex">
              <span class="slot-name">Slot{{ slotIndex + 1 }}: {{ slot }}</span>
              <span class="condition">(条件：当{{ slot }}存在)</span>
              <span class="delete-slot"
              @click="handleDeleteSlot(confirmIndex, slot, slotIndex)">
              删除Slot{{ slotIndex + 1 }}</span>
            </div>
          </div>
          <div class="conditions-wrapper" v-if="confirm.criteriaSet">
            <edit-condition-group v-for="(data, index) in confirm.criteriaSet.items" :key="index"
            @update="handleUpdate"
            :groupIndex="index" :groupOperator="confirm.criteriaSet.operator"
            @deleteGroup="handleDeleteCondGroup(index)"
            :data="data"></edit-condition-group>
          </div>
          <div class="advance-speech-wrapper">
            <h1 class="speech-title">话术</h1>
            <div>
              <span>确认话术</span>
              <reference-input
              @change="handleUpdate"
              class="slot-input" v-model="confirm.nlTemplates.options[0]"
              :referenceList="selectionsWithDollar"></reference-input>
            </div>
            <div v-if="confirm.fNlTemplates">
              <span>失败话术</span>
              <reference-input
              @change="handleUpdate"
              class="slot-input" v-model="confirm.fNlTemplates.options[0]"
              :referenceList="selectionsWithDollar"></reference-input>
            </div>
          </div>
        </div>
        <button class="add-btn btn-dark-blue" @click="handleAddConfirm">+新增一组确认</button>
      </div>
    </div>
    <!-- <img class="delete-btn" src="../../assets/images/delete_s.png"/> -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import EditConditionGroup from './EditConditionGroup';
import ReferenceInput from './ReferenceInput';
import templates from '../../store/templates';

export default {
  props: {
    data: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  computed: {
    ...mapGetters([
      'selectionsWithDollar',
    ]),
  },
  components: {
    EditConditionGroup,
    ReferenceInput,
  },
  data() {
    return {
      confirmMode: '', // 'ADVANCED'
      optionsMode: [
        { label: '普通模式', value: 'NORMAL' },
        { label: '高级模式', value: 'ADVANCED' },
      ],
      confirms: [],
    };
  },
  watch: {
    data() {
      this.initialization();
    },
  },
  created() {
    this.initialization();
  },
  methods: {
    initialization() {
      if (this.data.options.length === 1 && !this.data.options[0].criteriaSet) {
        this.confirmMode = 'NORMAL';
      } else {
        this.confirmMode = 'ADVANCED';
      }
      // this.confirms = this.data.options;
    },
    handleUpdate() {
      this.$emit('update');
    },
    // 确认模式改变 - 普通 & 高级
    handleChangeConfirmMode(mode) {
      if (mode === 'NORMAL') {
        // 从高级模式变成普通模式 - 删除criteria
        this.data.options.splice(1, this.data.options.length - 1);
        this.data.options[0].criteriaSet = undefined;
      }
      // 从普通模式变成高级模式 - 增加criteria
      this.data.options[0].criteriaSet = templates.getConditionGroupTemplate();
      this.data.options[0] = Object.assign({}, this.data.options[0]);
      this.data.options = Array.concat(this.data.options);
      this.$forceUpdate();
      // this.data.options = this.data.options;
      this.handleUpdate();
    },

    // 新增一组确认（高级模式）
    handleAddConfirm() {
      let targets = [];
      if (this.data.options && this.data.options.length) {
        targets = this.data.options[0].targets;
      }
      const newAdvanceConfirm = templates.getAdvanceConfirmNodeTemplate(targets);
      this.data.options.push(newAdvanceConfirm);
      this.handleUpdate();
    },
    // 删除槽位
    handleDeleteSlot(confirmIndex, slotName, slotIndex) {
      // 从确认信息中删除
      const confirm = this.data.options[confirmIndex];
      const targets = confirm.targets;
      targets.splice(slotIndex, 1);
      if (targets.length === 0) {
        this.data.options.splice(confirmIndex, 1);
      }
      // 若确认信息中没有槽位，则设置解析器列表中的槽位确认类型为NONE
      let hasSlot = false;
      this.data.options.forEach((item) => {
        if (item.targets.indexOf(slotName) !== -1) {
          hasSlot = true;
        }
      });
      if (!hasSlot) {
        this.$emit('changeSlotConfirmType', slotName, 'NONE');
      }
      this.handleUpdate();
    },
    handleDeleteCondGroup() {
      console.log('handleDeleteCondGroup');
    },
  },
};
</script>

<style lang="scss" scoped>
.edit-confirm-wrapper{
  .title{
    color: #333333;
    font-size: 14px;
  }
  .mode-wrapper{
    margin-top: 10px;
  }
  .content-wrapper{
    .confirm-wrapper{
      &:hover{
        box-shadow:0px 5px 10px 0px rgba(0,0,0,0.15);
      }
      margin-top: 10px;
      background:#F7F7F7;
      border-radius: 2px;
      border:1px solid rgba(219,219,219,1);
      .slots-wrapper{
        background-color: #EEEEEE;
        padding: 10px 20px;
        .slot-item{
          display: flex;
          align-items: center;
          margin-top: 10px;
          &:first-child{
            margin-top: 0px;
          }
          .slot-name{
            color: #666666;
            font-size: 14px;
            line-height: 20px;
          }
          .condition{
            color: #999999;
            font-size: 12px;
            margin-left: 5px;
            flex: 1;
          }
          .delete-slot{
            font-size: 12px;
            color: #666666;
            line-height: 20px;
            cursor: pointer;
            &:hover{
              color: #F25C62;
            }
          }
        }
      }
      .normal-speech-wrappper{
        padding: 10px 20px;
        background-color: #F7F7F7;
        >div{
          background-color: #EEEEEE;
          padding: 16px 10px;
          display: flex;
          align-items: center;
          border-radius: 1px;
          >span{
            min-width: 80px;
            color: #666666;
            font-size: 14px;
          }
          .el-input{
            flex: 1;
            margin-left: 10px;
          }
        }
      }
      .conditions-wrapper{
        background-color: #F7F7F7;
        box-shadow: 0px 1px 0px 0px rgba(233,233,233,1);
      }
      .advance-speech-wrapper{
        padding: 20px;
        .speech-title{
          color: #333333;
          font-size: 14px;
          font-weight: bold;
        }
        >div{
          margin-top: 10px;
          background-color: #EEEEEE;
          padding: 16px 10px;
          display: flex;
          align-items: center;
          border-radius: 1px;
          >span{
            min-width: 80px;
            color: #666666;
            font-size: 14px;
          }
          .el-input{
            flex: 1;
            margin-left: 10px;
          }
        }
      }
    }
    .add-btn{
      width: 160px;
      height: 32px;
      font-size: 14px;
      margin-top: 20px;
    }
  }
}
</style>
