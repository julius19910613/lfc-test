<template>
  <div class="edit-question-wrapper">
    <div class="header-wrapper">
      <span class="title">节点详细规则 -【{{value.title}}】</span>
      <el-popover placement="left"
      width="200" trigger="click">
        <span slot="reference" class="ungroup-btn" ref="btnDeleteNode">删除节点</span>
        <div style="font-size: 14px; margin-bottom: 10px;">节点删除后将无法恢复，确定删除吗？</div>
        <div style="text-align:right;">
          <button class="btn-white-gray" style="padding:5px 15px;margin-right:10px;"
          @click="handleCancelDeleteNode">取消</button>
          <button class="btn-dark-blue"
          style="padding:5px 15px;" @click="handleDeleteNode">确认</button>
        </div>
      </el-popover>
    </div>
    <!-- 基础信息 -->
    <div class="basic-wrapper">
      <h1 class="title"></h1>
      <div class="basic-box">
        <div class="basic-line">
          <span class="label">节点名称</span>
          <el-input class="input-box" v-model="qTitle" size="small"
          @change="handleUpdateTitle"></el-input>
        </div>
        <!-- 解析器选择 -->
        <div class="basic-line" v-if="value.slotFinder">
          <span class="label">解析器选择</span>
          <el-select class="parser-selection small-selector"
          filterable
          :disabled="!canChangeParser"
          @change="handleSelectParser(slotFinderId)"
          v-model="slotFinderId" placeholder="请选择">
            <el-option v-for="parser in parsersList"
              :key="parser.id" :label="parser.name" :value="parser.id">
            </el-option>
          </el-select>
          <el-switch class="switch-parser" v-model="canChangeParser"></el-switch>
        </div>
        <!-- 输入 - 参数列表 -->
        <!-- {{value.slotFinder.args}} -->
        <template v-if="value.slotFinder
        && value.slotFinder.args && value.slotFinder.args.length">
          <div class="arguments-wrapper">
            <div class="arguments-title">输入</div>
            <div class="arguments-content">
              <div v-for="(input, index) in value.slotFinder.args" :key="index"
              class="arguments-line">
                <span class="line-title">{{input.name}}</span>
                <el-select class="line-type small-selector"
                @change="handleChangeArgumentValueType(input)"
                v-model="input.type" placeholder="请选择值类型">
                  <el-option key="text" label="输入文字" value="text"></el-option>
                  <el-option key="value" label="输入值" value="value"></el-option>
                </el-select>
                <!-- {{input.value}} -->
                <el-input class="line-value" size="small" @change="handleUpdate"
                v-if="input.type==='value'" v-model="input.value"></el-input>
                <reference-input class="line-value" @change="handleUpdate"
                :referenceList="selectionsWithDollar"
                v-else v-model="input.value"></reference-input>
              </div>
            </div>
          </div>
        </template>
        <!-- 输出 - 槽位列表 -->
        <template v-if="value.slotFinder &&
        value.slotFinder.slots && value.slotFinder.slots.length">
          <div class="arguments-wrapper">
            <div class="arguments-title">输出</div>
            <div class="arguments-content">
              <div v-for="(slot, index) in value.slotFinder.slots" :key="index"
              class="arguments-line">
                <span class="line-title">{{slot.name}}</span>
                <el-select clearable
                class="line-type small-selector"
                @change="handleUpdate"
                v-model="slot.initValue" placeholder="请选择初始值">
                  <el-option v-for="type in allVariantsInScenario"
                    :key="type.title" :label="type.title" :value="type.title">
                  </el-option>
                </el-select>
                <el-select class="line-value small-selector"
                @change="handleChangeConfirmType(slot, index)"
                v-model="slot.confirmType" placeholder="请选择">
                  <el-option v-for="type in confirmTypeList"
                    :key="type.value" :label="type.label" :value="type.value">
                  </el-option>
                </el-select>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
    <div class="entry-wrapper" v-if="slotFinderId">
      <!-- 触发 -->
      <h1 class="title">触发</h1>
      <edit-question-trigger class="block"
      @update="handleUpdate"
      v-for="(trigger, index) in value.triggers" :key="value.id+'entry'+index"
      :triggerIndex="index" :data="trigger" :nodeId="value.id"
      @deleteTrigger="handleRemoveTrigger"></edit-question-trigger>
      <button class="btn-dark-blue add-trigger-btn" @click="handleAddTrigger">+新增一组触发</button>
      <!-- 确认信息 -->
      <edit-question-confirm
      @update="handleUpdate"
      class="question-confirm" :key="value.id+'confirm'"
      v-if="this.value.confirm && this.value.confirm.options
      && this.value.confirm.options.length"
      @changeSlotConfirmType="handleChangeSlotConfirmType"
      :data="value.confirm"></edit-question-confirm>
      <!-- 结束 -->
      <h1 class="title">结束</h1>
      <edit-question-exit
      @update="handleUpdate"
      class="block"
      v-for="(termination, index) in value.terminations" :key="value.id+'exit'+index"
      :exitIndex="index" :data="termination" @delete="handleRemoveTermination"></edit-question-exit>
      <button class="btn-dark-blue add-trigger-btn" @click="handleAddTermination">+新增一组结束</button>
      <!-- 执行动作 -->
      <edit-question-action ref="editQuestionAction"
      :value="value.actions" :key="value.id+'action'"
      @update="handleUpdateAction"
      :triggers="value.triggers" :confirms="value.confirm"
      :terminations="value.terminations"></edit-question-action>
      <!-- 其他 -->
      <h1 class="title" v-if="slotFinderId !== 'empty'">解析失败</h1>
      <div class="speech-wrapper"
      v-if="value.failure && value.failure.nlTemplates && slotFinderId !== 'empty'">
        <div class="speech-item"
        v-for="(item, index) in value.failure.nlTemplates.options"
        :key="'others'+index">
          <div class="label">解析失败话术</div>
          <el-input class="failure-text" size="mini"
          v-model="value.failure.nlTemplates.options[index]"
          @change="handleUpdate" placeholder="请输入解析失败后的话术表达"></el-input>
        </div>
        <div class="speech-item" v-if="value.failure.exceedMaxTimes">
          <div class="line-1">
            <span class="label">当前语句解析失败</span>
            <el-input-number size="mini" :min="1"
            v-model="value.failure.maxTimes"
            @change="handleUpdate"></el-input-number>
            <span class="label">次，则</span>
            <el-select v-model="value.failure.exceedMaxTimes.action"
            @change="handleUpdate"
            placeholder="请选择执行动作" size="mini">
              <el-option v-for="action in globalActions"
              :key="action.id" :label="action.name" :value="action.id">
              </el-option>
            </el-select>
          </div>
          <div class="line-2">
            <span class="label">退出话术</span>
            <el-switch v-model="value.failure.exceedMaxTimes.nlTemplates.enabled"
            @change="handleUpdate"></el-switch>
            <el-input size="mini"
            @change="handleUpdate"
            v-model="value.failure.exceedMaxTimes.nlTemplates.options[0]"></el-input>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import ReferenceInput from './basic/ReferenceInput';
import EditQuestionTrigger from './basic/EditQuestionTrigger';
import EditQuestionExit from './basic/EditQuestionExit';
import EditQuestionConfirm from './basic/EditQuestionConfirm';
import EditQuestionAction from './basic/EditQuestionAction';
import templates from '../store/templates';

export default {
  props: {
    value: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  components: {
    ReferenceInput,
    EditQuestionTrigger,
    EditQuestionExit,
    EditQuestionConfirm,
    EditQuestionAction,
  },
  data() {
    return {
      qTitle: '',
      slotFinderId: '-',
      canChangeParser: false,
      confirmTypeList: [
        { value: 'RIGHT_NOW', label: '当前节点确认' },
        // { value: 'OTHER_NODE', label: '其他节点确认' },
        { value: 'NONE', label: '无需确认' },
      ],
      slotsList: [],
      argsDef: [
        {
          name: 'bizHours',
          optional: true,
          dataType: 'list',
          elementType: 'string',
        },
        {
          name: 'orientation',
          optional: true,
          dataType: 'string',
          valueOptions: [
            {
              value: 'Y',
              label: '忘记生日',
            },
            {
              value: 'N',
              label: '没忘记生日',
            },
          ],
        },
        {
          name: 'duration',
          optional: true,
          dataType: 'object',
          children: [
            {
              name: 'extract',
              dataType: 'bool',
            },
            {
              name: 'onlyOne',
              dataType: 'string',
              valueOptions: [
                {
                  value: 'last',
                  label: '最后一个',
                },
                {
                  value: 'first',
                  label: '第一个',
                },
              ],
            },
          ],
        },
      ],
    };
  },
  created() {
    this.initializeData();
  },
  watch: {
    value() {
      this.initializeData();
    },
    slotFinderId(slotFinderId) {
      if (slotFinderId) {
        this.canChangeParser = false;
      } else {
        this.canChangeParser = true;
      }
    },
  },
  computed: {
    ...mapGetters([
      'parsersList',
      'selectionsWithDollar',
      'allVariantsInScenario',
      'globalActions',
    ]),
    selectedParser() {
      let selectedParser = {};
      const selArr = this.parsersList.filter(item => item.id === this.value.slotFinder.id);
      if (selArr.length > 0) {
        selectedParser = selArr[0];
      }
      return selectedParser;
    },
    showOthers() {
      return this.value.failure && this.value.failure.nlTemplates
      && this.value.failure.nlTemplates.options;
    },
    showConfirmInfo() {
      return this.value.confirm && this.value.confirm.options
      && this.value.confirm.options.length;
    },
  },
  methods: {
    // 初始化
    initializeData() {
      // 问题节点名字
      this.qTitle = this.value.title || '';
      // 解析器 & 槽位
      // if (this.value && this.value.slotFinder && this.value.slotFinder.id) {
      //   this.canChangeParser = false;
      // } else {
      //   this.canChangeParser = true;
      // }
      if (!this.value.slotFinder) {
        this.value.slotFinder = {
          id: '',
          slots: [],
        };
      }
      this.slotFinderId = this.value.slotFinder.id || '';
      // this.setSlotsList();
      // 初始化others
      // this.optionsOther = [''];
      // if (this.value.failure && this.value.failure.nlTemplates
      // && this.value.failure.nlTemplates.options) {
      //   this.optionsOther = this.value.failure.nlTemplates.options;
      // }
    },
    setSlotsList() {
      // 初始化槽位列表
      this.slotsList = [];
      if (this.value && this.value.slotFinder
      && this.value.slotFinder.slots) {
        this.value.slotFinder.slots.forEach((item) => {
          if (!item.initValue) {
            item.initValue = '';
          }
          this.slotsList.push(Object.assign({}, item));
        });
      }
    },
    handleChangeArgumentValueType() {
      // input.value = '';
      this.$forceUpdate();
      this.handleUpdate();
    },
    handleUpdateTitle() {
      if (this.qTitle) {
        this.value.title = this.qTitle;
        this.handleUpdate();
      }
    },
    handleChangeSlotConfirmType(name, type) {
      if (this.value && this.value.slotFinder
      && this.value.slotFinder.slots) {
        const slotRes = this.value.slotFinder.slots.filter(slot => slot.name === name);
        if (slotRes.length > 0) {
          slotRes[0].confirmType = type;
        }
      }
      // this.setSlotsList();
    },
    // 解析器选择 - 初始化每个槽位的confirm type为NONE
    // 将该节点的确认信息设置为空
    handleSelectParser(parserId) {
      this.value.slotFinder.id = parserId;
      this.value.slotFinder.slots = [];
      this.value.slotFinder.args = [];
      const selParsers = this.parsersList.filter(parser => parser.id === parserId);
      console.log(JSON.stringify(selParsers[0]));
      if (selParsers.length > 0 && selParsers[0].slotDef && selParsers[0].slotDef.slotFields) {
        // MOCK DATA
        selParsers[0].argsDef = JSON.parse(JSON.stringify(this.argsDef));
        // MOCK DATA
        // 输入值 - 参数列表
        const parserArgs = selParsers[0].argsDef || [];
        parserArgs.forEach((item) => {
          this.value.slotFinder.args.push({
            name: item.name,
            type: 'text', // 'value'
            value: '',
          });
        });
        // 输出值 - 槽位列表 - 槽位默认值
        const parserSlots = selParsers[0].slotDef.slotFields || [];
        parserSlots.forEach((item) => {
          // const slot = { name: item.name, confirmType: 'NONE' };
          this.value.slotFinder.slots.push({
            name: item.name,
            confirmType: 'NONE',
            initValue: '',
          });
        });
        this.value.slotFinder = Object.assign({}, this.value.slotFinder);
        this.$emit('input', this.value);
      }
      // this.setSlotsList();
      this.value.confirm = {};
      this.handleUpdate();
    },
    handleChangeSlotInitial(slot, index) {
      this.value.slotFinder.slots[index].initValue = slot.initValue;
      this.handleUpdate();
    },
    // 解析器 - 槽位 - 确认类型修改
    handleChangeConfirmType(slot, index) {
      const oldType = this.value.slotFinder.slots[index].confirmType;
      const newType = slot.confirmType;
      if (oldType === newType) {
        return;
      }
      // 删除修改前的确认信息
      if (oldType === 'RIGHT_NOW') {
        // 从当前节点的确认当中删除
        if (this.value.confirm && this.value.confirm.options
        && this.value.confirm.options.length) {
          const options = this.value.confirm.options;
          for (let i = 0; i < options.length; i += 1) {
            const item = options[i];
            const delIndex = item.targets.indexOf(slot.name);
            if (delIndex !== -1) {
              item.targets.splice(delIndex, 1);
            }
            if (item.targets.length === 0) {
              options.splice(i, 1);
              i -= 1;
            }
          }
          this.value.confirm.options = options;
        }
      } else if (oldType === 'OTHER_NODE') {
        // 从其他确认节点中删除
        console.log('delete from other confirmation node');
      }
      // 新增修改后的确认信息
      if (newType === 'RIGHT_NOW') {
        // 新增当前节点确认信息
        if (!(this.value.confirm && this.value.confirm.options
        && this.value.confirm.options.length)) {
          // 初始化确认信息模块
          const confirmData = templates.getRightNowConfirmTemplate();
          confirmData.options[0].targets = [slot.name];
          this.value.confirm = confirmData;
          // this.value = Object.assign({}, this.value);
          this.$emit('input', Object.assign({}, this.value));
          // this.$forceUpdate();
        } else {
          // 给targets添加slot
          this.value.confirm.options.forEach((option) => {
            option.targets.push(slot.name);
          });
        }
      } else if (newType === 'OTHER_NODE') {
        // 新增其他节点确认信息
        console.log('delete from other confirmation node');
      }
      this.value.slotFinder.slots[index].confirmType = slot.confirmType;
      this.handleUpdate();
    },
    // 触发
    handleAddTrigger() {
      if (!this.value.terminations) {
        this.value.terminations = [];
        this.$forceUpdate();
      }
      this.value.triggers.push(templates.getTriggerExitTemplate('trigger'));
      this.handleUpdate();
    },
    handleRemoveTrigger(index) {
      this.value.triggers.splice(index, 1);
      this.handleRemoveAction('TRIGGER', index);
      this.handleUpdate();
    },
    // 结束
    handleAddTermination() {
      if (!this.value.terminations) {
        this.value.terminations = [];
        this.$emit('input', Object.assign({}, this.value));
      }
      this.value.terminations.push(templates.getTriggerExitTemplate('exit'));
      this.handleUpdate();
    },
    handleRemoveTermination(index) {
      this.value.terminations.splice(index, 1);
      this.handleRemoveAction('TERMINATION', index);
      this.handleUpdate();
    },
    handleUpdateAction(actions) {
      this.value.actions = actions;
      this.handleUpdate();
    },
    handleRemoveAction(type, index) {
      if (!this.value.actions || !this.value.actions.length) {
        return;
      }
      let changed = false;
      for (let i = 0; i < this.value.actions.length; i += 1) {
        const action = this.value.actions[i];
        if (action.execPoint === type && Number(action.pos) === index) {
          action.execPoint = '';
          action.pos = '';
          changed = true;
        }
      }
      if (changed) {
        this.$refs.editQuestionAction.initializeData();
      }
      // const filterActions = this.value.actions.filter((action) => {
      //   if (action.execPoint === type && action.pos === index) {
      //     return true;
      //   }
      //   return false;
      // });
      // if (filterActions.length) {
      //   filterActions.forEach((action) => {
      //     action.execPoint = '';
      //     action.pos = '';
      //   });
      // }
    },
    // 修改解析失败话术
    handleChangeOthers() {
      // if (!(this.value.failure && this.value.failure.nlTemplates
      // && this.value.failure.nlTemplates.options)) {
      //   this.value.failure = {
      //     nlTemplates: {
      //       options: this.optionsOther,
      //     },
      //   };
      // }
      this.handleUpdate();
    },
    // 删除问题节点
    handleDeleteNode() {
      this.$emit('delete', this.value);
    },
    handleCancelDeleteNode() {
      this.$refs.btnDeleteNode.click();
    },
    handleUpdate() {
      this.$emit('update');
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../assets/scss/index";
.edit-question-wrapper{
  box-sizing: border-box;
  padding: 20px;
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
      flex: 1;
    }
    .ungroup-btn{
      cursor: pointer;
      &:hover{
        color: #F25C62;
      }
    }
  }
  .basic-wrapper{
    margin-top: 20px;
    .title{
      color: #333333;
      font-size: 14px;
      line-height: 20px;
    }
    .basic-box{
      border-radius: 2px;
      margin-top: 10px;
      background-color: #F7F7F7;
      padding: 20px 20px;
      .basic-line{
        margin-top: 10px;
        display: flex;
        align-items: center;
        &:first-child{
          margin-top: 0px;
        }
        .label{
          min-width: 70px;
          color: #666666;
          font-size: 14px;
          text-align: right;
          margin-right: 10px;
        }
        .label-slot{
          flex: 1;
          color: #666666;
          font-size: 14px;
          margin-right: 10px;
        }
        .input-box{
          flex: 1;
          font-size: 14px;
        }
        .parser-selection{
          flex: 1;
        }
        .confirm-type-selection{
          width: 300px;
          margin-left: 10px;
        }
        .switch-parser{
          margin-left: 10px;
        }
      }
      .arguments-wrapper{
        margin-top: 10px;
        display: flex;
        font-size: 14px;
        .arguments-title{
          width: 70px;
          text-align: right;
          margin-right: 10px;
          line-height: 32px;
        }
        .arguments-content{
          flex: 1;
          padding: 10px;
          box-sizing: border-box;
          background-color: #EEEEEE;
          .arguments-line{
            display: flex;
            margin-top: 12px;
            &:first-child{
              margin-top: 0px;
            }
            .line-title{
              width: 100px;
              line-height: 32px;
              text-align: right;
            }
            .line-type{
              margin-left: 10px;
              flex: 2;
            }
            .line-value{
              margin-left: 10px;
              flex: 3;
            }
          }
        }
      }
    }
  }
  .entry-wrapper{
    .title{
      margin-top: 20px;
      color: #333333;
      font-size: 14px;
      line-height: 20px;
      margin-bottom: 10px;
    }
    .block {
      margin-top: 10px;
    }
    .add-trigger-btn{
      width: 160px;
      height: 32px;
      margin-top: 10px;
      font-size: 14px;
    }
    .question-confirm{
      margin-top: 20px;
    }
    .speech-wrapper{
      /deep/ .el-input{
        input{
          font-size: 14px;
        }
      }
      .speech-item{
        margin-bottom: 10px;
        padding: 20px 17px;
        background-color: #F7F7F7;
        &:first-child{
          margin-top: 0px;
        }
        .label{
          margin-right: 10px;
          font-size: 14px;
        }
        .failure-text{
          margin-top: 10px;
        }
        .line-1{
          display: flex;
          align-items: center;
          .el-input-number{
            margin-right: 10px;
          }
          .el-select{
            flex: 1;
          }
        }
        .line-2{
          display: flex;
          align-items: center;
          margin-top: 10px;
          .label{
            margin-right: 10px;
          }
          .el-input{
            margin-left: 10px;
            flex: 1;
          }
        }
      }
    }
  }
}
</style>
