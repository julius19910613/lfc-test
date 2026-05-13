<template>
  <el-dialog :visible.sync="value" class="edit-scenario-parser-dlg">
    <div class="title-wrapper" slot="title">
      <span class="title">场景解析器</span>
      <span class="description">场景解析器设定后可在整个场景中应用，不影响节点中的解析配置</span>
    </div>
    <div class="content-wrapper">
      <span class="add-parser-btn" @click="handleAddParser">+新增场景解析器</span>
      <div class="parser-list">
        <div class="parser-item" v-for="(sceParser, index) in uiScenarioParserList" :key="index">
          <div class="parser-title-box">
            <span class="parser-title">场景解析器 - {{sceParser.name}}</span>
            <span class="delete-btn" @click="handleRemoveParser(index)">删除</span>
          </div>
          <div class="parser-content">
            <div class="basic-line">
              <span class="label">解析器选择</span>
              <el-select
                class="parser-selection small-selector"
                filterable
                @change="handleSelectParser(sceParser, index)"
                v-model="sceParser.id"
                placeholder="请选择"
              >
                <el-option
                  v-for="parser in selParsersList"
                  :key="parser.id"
                  :label="parser.name"
                  :value="parser.id"
                ></el-option>
              </el-select>
            </div>
            <!-- 输入 - 参数列表 -->
            <!-- {{value.finder.inputs}} -->
            <template v-if="sceParser.args.length">
              <div class="arguments-wrapper">
                <div class="arguments-title">输入</div>
                <div class="arguments-content">
                  <div
                    v-for="(arg, index) in sceParser.args"
                    :key="index"
                    class="arguments-line"
                  >
                    <span class="line-title">{{arg.name}}</span>
                    <!-- <el-select
                      class="line-type small-selector"
                      v-model="input.type"
                      placeholder="请选择值类型"
                    >
                      <el-option key="text" label="输入文字" value="text"></el-option>
                      <el-option key="value" label="输入值" value="value"></el-option>
                    </el-select>
                    {{input.value}} -->
                    <el-input
                      class="line-value"
                      size="small"
                      v-model="arg.value"
                    ></el-input>
                    <!-- <reference-input
                      class="line-value"
                      :referenceList="selectionsWithDollar"
                      v-else
                      v-model="input.value"
                    ></reference-input> -->
                  </div>
                </div>
              </div>
            </template>
            <!-- 输出 - 槽位列表 -->
            <template v-if="sceParser.slots && sceParser.slots.length">
              <div class="arguments-wrapper">
                <div class="arguments-title">输出</div>
                <div class="arguments-content">
                  <div v-for="(slot, index) in sceParser.slots" :key="index" class="arguments-line">
                    <span class="line-title">{{slot.name}}</span>
                    <el-select
                      clearable
                      class="line-type small-selector"
                      v-model="slot.initValue"
                      placeholder="请选择初始值"
                    >
                      <el-option
                        v-for="type in allVariantsInScenario"
                        :key="type.title"
                        :label="type.title"
                        :value="type.title"
                      ></el-option>
                    </el-select>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
    <div slot="footer">
      <button class="btn-white-gray btn-small" @click="handleCancelEdit">取消</button>
      <button class="btn-dark-blue btn-small" @click="handleConfirmEdit">确认修改</button>
    </div>
  </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex';
import ReferenceInput from './basic/ReferenceInput';

export default {
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    scenarioParserList: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      uiScenarioParserList: [
        // {
        //   id: 'address4',
        //   name: '地址解析器(支持四级)',
        //   inputs: [
        //     {
        //       name: 'bizHours',
        //       type: 'value',
        //       value: '123',
        //     },
        //     {
        //       name: 'orientation',
        //       type: 'value',
        //       value: '123',
        //     },
        //     {
        //       name: 'duration',
        //       type: 'text',
        //       value: '',
        //     },
        //   ],
        //   slots: [
        //     {
        //       name: 'l1',
        //       var: '',
        //     },
        //     {
        //       name: 'l2',
        //       var: '',
        //     },
        //     {
        //       name: 'l3',
        //       var: '',
        //     },
        //     {
        //       name: 'l4',
        //       var: '',
        //     },
        //     {
        //       name: 'detail',
        //       var: '',
        //     },
        //     {
        //       name: 'address',
        //       var: '',
        //     },
        //   ],
        // },
      ],
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
  watch: {
    value(visible) {
      if (visible) {
        try {
          //
          this.uiScenarioParserList = this.createUIParserList(this.scenarioParserList);
        } catch (error) {
          console.log(error);
          this.uiScenarioParserList = [];
        }
      }
    },
  },
  computed: {
    ...mapGetters([
      'parsersList',
      'allVariantsInScenario',
      'selectionsWithDollar',
    ]),
    selParsersList() {
      return this.parsersList.slice(1);
    },
  },
  components: {
    ReferenceInput,
  },
  methods: {
    findParserDef(parserDefList, parserId) {
      // eslint-disable-next-line
      for (const parserDef of parserDefList) {
        if (parserDef.id === parserId) {
          return parserDef;
        }
      }
      return null;
    },
    createUIParserList(scenarioParserList) {
      const uiParserList = [];
      const scenarioParsers = JSON.parse(JSON.stringify(scenarioParserList));
      if (!scenarioParsers || !scenarioParsers.length) {
        return uiParserList;
      }
      // eslint-disable-next-line
      for (const scenarioParser of scenarioParsers) {
        if (!scenarioParser.finder || !scenarioParser.finder.id) {
          // eslint-disable-next-line
          continue;
        }
        const parserDef = this.findParserDef(
          this.parsersList,
          scenarioParser.finder.id,
        );
        if (parserDef && parserDef.slotDef && parserDef.slotDef.slotFields) {
          const uiParser = {
            args: [],
            slots: [],
          };
          uiParserList.push(uiParser);
          uiParser.id = parserDef.id;
          uiParser.title = parserDef.name;
          // MOCK DATA
          parserDef.argsDef = JSON.parse(JSON.stringify(this.argsDef));
          // MOCK DATA
          // 输入值 - 参数列表
          const argsDef = parserDef.argsDef || [];
          argsDef.forEach((argDef) => {
            // 查找参数值
            const argValue = this.findArgValue(scenarioParser, argDef.name);
            uiParser.args.push({
              name: argDef.name,
              label: argDef.label,
              dataType: argDef.dataType,
              elementType: argDef.elementType,
              valueOptions: argDef.valueOptions,
              value: argValue,
            });
          });
          // 输出值 - 槽位列表 - 槽位默认值
          const parserSlots = parserDef.slotDef.slotFields || [];
          parserSlots.forEach((parserSlot) => {
            const slotInitValue = this.findSlotInitValue(scenarioParser, parserSlot.name);
            uiParser.slots.push({
              name: parserSlot.name,
              confirmType: 'NONE',
              initValue: slotInitValue,
            });
          });
        }
      }
      return uiParserList;
    },
    findArgValue(scenarioParser, argName) {
      if (!scenarioParser || !scenarioParser.finder
      || !scenarioParser.finder.args || !argName) {
        return null;
      }
      const args = scenarioParser.finder.args;
      return args[argName] ? args[argName] : null;
    },
    findSlotInitValue(scenarioParser, slotName) {
      if (!scenarioParser || !scenarioParser.finder
      || !scenarioParser.finder.slots || !slotName) {
        return null;
      }
      const slots = scenarioParser.finder.slots;
      // eslint-disable-next-line
      for (const slot of slots) {
        if (slot.name === slotName) {
          return slot.initValue;
        }
      }
      return null;
    },

    handleAddParser() {
      this.uiScenarioParserList.unshift({
        id: '',
        name: '',
        args: [],
        slots: [],
      });
    },
    handleRemoveParser(index) {
      this.uiScenarioParserList.splice(index, 1);
    },
    // 修改某个场景解析器下的解析器选择
    handleSelectParser(currentParser) {
      currentParser.slots = [];
      currentParser.args = [];
      const selParsers = this.parsersList.filter(parser => parser.id === currentParser.id);
      // console.log(JSON.stringify(selParsers[0]));
      if (selParsers.length > 0 && selParsers[0].slotDef
      && selParsers[0].slotDef.slotFields) {
        currentParser.name = selParsers[0].name;
        // MOCK DATA
        selParsers[0].argsDef = JSON.parse(JSON.stringify(this.argsDef));
        // MOCK DATA
        // 输入值 - 参数列表
        const parserArgs = selParsers[0].argsDef || [];
        parserArgs.forEach((argDef) => {
          currentParser.args.push({
            name: argDef.name,
            label: argDef.label,
            dataType: argDef.dataType,
            elementType: argDef.elementType,
            valueOptions: argDef.valueOptions,
            value: argDef.value,
          });
        });
        // 输出值 - 槽位列表 - 槽位默认值
        const parserSlots = selParsers[0].slotDef.slotFields || [];
        parserSlots.forEach((slot) => {
          currentParser.slots.push({
            name: slot.name,
            confirmType: 'NONE',
            initValue: null,
          });
        });
      }
    },
    handleCancelEdit() {
      this.$emit('input', false);
    },
    handleConfirmEdit() {
      const uiScenarioParsers = [...this.uiScenarioParserList];
      this.$emit('save', this.convertToSenarioParsers(uiScenarioParsers));
      this.$emit('input', false);
    },
    convertToSenarioParsers(uiScenarioParsers) {
      const scenarioParsers = [];
      if (!uiScenarioParsers || !uiScenarioParsers.length) {
        return scenarioParsers;
      }
      // eslint-disable-next-line
      for (const uiScenarioParser of uiScenarioParsers) {
        const args = {};
        if (uiScenarioParser.args && uiScenarioParser.args.length) {
          uiScenarioParser.args.forEach((arg) => {
            args[arg.name] = arg.value;
          });
        }
        const slots = [];
        if (uiScenarioParser.slots && uiScenarioParser.slots.length) {
          uiScenarioParser.slots.forEach((slot) => {
            slots.push({
              name: slot.name,
              initValue: slot.initValue,
              confirmType: slot.confirmType,
            });
          });
        }
        scenarioParsers.push({
          id: uiScenarioParser.id,
          title: uiScenarioParser.name,
          finder: {
            id: uiScenarioParser.id,
            args,
            slots,
          },
        });
      }
      return scenarioParsers;
    },
  },
};
</script>

<style scoped lang="scss">
.edit-scenario-parser-dlg {
  /deep/ .el-dialog {
    width: 900px;
  }
}
.title-wrapper {
  .title {
    font-size: 16px;
    color: #333333;
  }
  .description {
    margin-left: 10px;
    font-size: 12px;
    color: #666666;
  }
}
.content-wrapper {
  padding: 20px;
  .add-parser-btn {
    font-size: 14px;
    color: #1875f0;
    cursor: pointer;
  }
  .parser-list {
    height: 500px;
    overflow-y: auto;
    .parser-item {
      border-radius: 2px;
      border: 1px solid rgba(219, 219, 219, 1);
      border-radius: 2px;
      margin-top: 10px;
      background-color: #f7f7f7;
      .parser-title-box {
        background-color: #eeeeee;
        display: flex;
        align-items: center;
        padding: 0px 20px;
        height: 40px;
        .parser-title {
          color: #666666;
          flex: 1;
        }
        .delete-btn {
          cursor: pointer;
          color: #666666;
          font-size: 12px;
          &:hover {
            color: #f25c62;
          }
        }
      }
      .parser-content {
        padding: 20px 20px;
        .basic-line {
          margin-top: 10px;
          display: flex;
          align-items: center;
          &:first-child {
            margin-top: 0px;
          }
          .label {
            min-width: 70px;
            color: #666666;
            font-size: 14px;
            text-align: right;
            margin-right: 10px;
          }
          .label-slot {
            flex: 1;
            color: #666666;
            font-size: 14px;
            margin-right: 10px;
          }
          .input-box {
            flex: 1;
            font-size: 14px;
          }
          .parser-selection {
            flex: 1;
          }
          .confirm-type-selection {
            width: 300px;
            margin-left: 10px;
          }
          .switch-parser {
            margin-left: 10px;
          }
        }
        .arguments-wrapper {
          margin-top: 10px;
          display: flex;
          font-size: 14px;
          .arguments-title {
            width: 70px;
            text-align: right;
            margin-right: 10px;
            line-height: 32px;
          }
          .arguments-content {
            flex: 1;
            padding: 10px;
            box-sizing: border-box;
            background-color: #eeeeee;
            .arguments-line {
              display: flex;
              margin-top: 12px;
              &:first-child {
                margin-top: 0px;
              }
              .line-title {
                width: 100px;
                line-height: 32px;
                text-align: right;
              }
              .line-type {
                margin-left: 10px;
                flex: 2;
              }
              .line-value {
                margin-left: 10px;
                flex: 3;
              }
            }
          }
        }
      }
    }
  }
}
</style>
