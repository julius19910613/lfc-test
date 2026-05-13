<template>
<div class="condition-action-block">
  <div class="header" :class={headerSticky:isheight}>
    <!-- 可编辑连线名称 start-->
    <input type="text" class="edit-name" v-show="editFlag" v-model="edgeName" @blur="editNameblur" @keyup.enter="editNameblur"  @focus="onInputFocus"  maxlength="20">
    <span v-show="!editFlag">{{edgeName}}</span><div class="edit-icon" @click="editFlag=true"><i class="emoti-icon icon-edit"></i></div>
    <!-- end-->
    <span class="info">
      {{ $t('task_engine_v2.condition_action_block.to') }}
      {{ $t('task_engine_v2.condition_action_block.colon') }}
      <div class="to-node">{{ toNodeText }}</div>
      {{ $t('task_engine_v2.condition_action_block.condition_action', { condition: rules.length, action: actions.length + 1}) }}
    </span>
    <button
      class="copy"
      v-if="edgeType!=='pc_succeed' && edgeType!=='pc_failed' && edgeType!=='virtual_global_edges'"
      @click="copyEdge">
      <!-- {{ $t('task_engine_v2.condition_action_block.copy') }} -->
      <i class="emoti-icon icon-copy"></i>
    </button>
    <button
      class="delete"
      v-if="edgeType!=='pc_succeed' && edgeType!=='pc_failed' && edgeType!=='virtual_global_edges'"
      @click="deleteEdge">
      <!-- {{ $t('task_engine_v2.condition_action_block.delete') }} -->
      <i class="emoti-icon icon-delete"></i>
    </button>
    <button class="toggle" :class="{collapse: !showConditionsAndActions}" @click="togglebutton">
      <img src="@/assets/icons/month_left_icon.svg"/>
    </button>
  </div>
  <div style="position: relative;">
  <template v-if="showConditionsAndActions">
    <!-- 条件设置 -->
    <div class="normal-edge" v-if="(edgeType==='normal' || edgeType==='trigger' || edgeType==='normal_2.0' || edgeType==='global_normal_2.0')">
      <div class="edge-content">
        <div class="title"  v-show="rules.length" v-t="'task_engine_v2.condition_action_block.condition_setup'"></div>
        <div class="dropdown-select-container" v-show="rules.length">
          {{ $t('task_engine_v2.condition_action_block.match') }}
          <dropdown-select
            class="dropdown-select"
            :options="conditionOptions"
            :showCheckedIcon="false"
            width="100px"
            @input="selectedOption = [conditionOptions.find(option => option.value === $event[0]).value]"
            :value="selectedOption"
            :inputBarStyle="selectStyle">
            </dropdown-select>
          {{ $t('task_engine_v2.condition_action_block.below_conditions')}}
        </div>
        <draggable v-model='rules'
                   :disabled="drag"
        >
        <template v-for="(rule, index) in rules">
          <div :key="rule.id" class="block">
            <div class="row">
              <span class="label" v-if="index === 0" v-t="'task_engine_v2.condition_action_block.if'"></span>
              <span class="label" v-if="index !== 0">{{ andOrIfText }}</span>
              <dropdown-select
                class="dropdown-select"
                :ref="`selectSource_${index}`"
                :value="[rule.source]"
                @input="onSelectSourceInput(index, $event)"
                :options="sourceOptions"
                :showCheckedIcon="false"
                :inputBarStyle="selectStyle"/>
              <dropdown-select
                class="dropdown-select"
                :ref="`selectFunction_${index}`"
                :value="[rule.funcName]"
                @input="onSelectFunctionInput(index, $event)"
                :options="getFuncOptions(rule.source)"
                :showCheckedIcon="false"
                :fixedListWidth="false"
                :inputBarStyle="selectStyle"/>
<!--              <icon class="trash" :size="14" iconType="trash" @click="deleteRule(index)"></icon>-->
              <emoti-icon class="trash" name="icon-delete-filled" :size="14" @click="deleteRule(index)"></emoti-icon>
            </div>
            <!-- 完全相符 / 包含文本 -->
            <div class="row" v-if="rule.funcName === 'match' || rule.funcName == 'contains'">
              <span class="label" v-t="'task_engine_v2.condition_action_block.label_content'"></span>
              <input ref="input-content" class="input-content" v-model="rule.content" v-tooltip="inputTooltip" :placeholder="$t('task_engine_v2.condition_action_block.input_placeholder')" @focus="onInputFocus" @blur="stopselect"/>
            </div>
            <!-- 正则表示式 -->
            <div class="row" v-if="rule.funcName === 'regular_exp'">
              <span class="label" v-t="'task_engine_v2.condition_action_block.label_pattern'"></span>
              <input ref="input-content" class="input-content" v-model="rule.content.pattern" v-tooltip="inputTooltip" :placeholder="$t('task_engine_v2.condition_action_block.input_placeholder')" @focus="onInputFocus" @blur="stopselect"/>
            </div>
            <!-- Intent意图匹配 -->
            <div class="row" v-if="rule.funcName === 'intent_parser'">
              <span class="label" v-t="'task_engine_v2.condition_action_block.label_content'"></span>
              <div class="dropdown-container"
                :key="intentDropdown.options.length ? `${index}_has_options`: index"
                v-dropdown="renderIntentDropdown(index)"
              >
                <input ref="input-content" v-tooltip="inputTooltip" class="input-content" v-model="rule.content.intentName" @focus="onInputFocus" @blur="stopselect">
              </div>
            </div>
            <!-- 键值匹配 -->
            <div :key="rule.funcName" v-if="rule.funcName === 'key_val_match'">
              <div class="row">
                <span class="label" v-t="'task_engine_v2.condition_action_block.label_compare_operator'"></span>
                <dropdown-select
                  class="dropdown-select"
                  :key="rule.funcName"
                  :value="[rule.content.compare]"
                  @input="rule.content.compare = $event[0]"
                  :options="keyValMatchCompareOptions"
                  :showCheckedIcon="false"
                  :inputBarStyle="selectStyle"/>
              </div>
              <div class="row">
                <span class="label" v-t="'task_engine_v2.condition_action_block.label_key'"></span>
                <div ref="insertVarDropdown" class="dropdown-container" v-dropdown="insertVarDropdown(rule.id, rule.content, 'key')">
                  <input ref="input-content" v-tooltip="inputTooltip" class="input-content" v-model="rule.content.key" :placeholder="$t('task_engine_v2.condition_action_block.input_placeholder')" @focus="onInputFocus" @blur="stopselect">
                </div>
              </div>
              <div class="row">
                <span class="label" v-t="'task_engine_v2.condition_action_block.label_value'"></span>
                <!-- <input v-if="rule.content.compare === '>' || rule.content.compare === '>=' || rule.content.compare === '<' || rule.content.compare === '<='"
                  class="input-content"
                  type="number"
                  v-model="rule.content.val"
                  :placeholder="$t('task_engine_v2.condition_action_block.input_placeholder')"
                  @focus="onInputFocus"
                  @blur="changetoNumber($event)"/> -->
                <input
                  class="input-content"
                  v-model="rule.content.val"
                  :placeholder="$t('task_engine_v2.condition_action_block.input_placeholder')"
                  @focus="onInputFocus"
                  @blur="stopselect"/>
              </div>
            </div>
            <!-- 键键匹配 -->
            <div :key="rule.funcName" v-if="rule.funcName === 'key_key_match'">
              <div class="row">
                <span class="label" v-t="'task_engine_v2.condition_action_block.label_compare_operator'"></span>
                <dropdown-select
                  class="dropdown-select"
                  :key="rule.funcName"
                  :value="[rule.content.compare]"
                  @input="rule.content.compare = $event[0]"
                  :options="keyKeyMatchCompareOptions"
                  :showCheckedIcon="false"
                  :inputBarStyle="selectStyle"/>
              </div>
              <div class="row">
                <span class="label" v-t="'task_engine_v2.condition_action_block.label_key'"></span>
                <div ref="insertVarDropdown" class="dropdown-container" v-dropdown="insertVarDropdown(rule.id, rule.content, 'key1')">
                  <input ref="input-content" v-tooltip="inputTooltip" class="input-content" v-model="rule.content.key1" :placeholder="$t('task_engine_v2.condition_action_block.input_placeholder')" @focus="onInputFocus" @blur="stopselect">
                </div>
              </div>
              <div class="row">
                <span class="label" v-t="'task_engine_v2.condition_action_block.label_key'"></span>
                <div ref="insertVarDropdown" class="dropdown-container" v-dropdown="insertVarDropdown(rule.id, rule.content, 'key2')">
                  <input ref="input-content" v-tooltip="inputTooltip" class="input-content" v-model="rule.content.key2" :placeholder="$t('task_engine_v2.condition_action_block.input_placeholder')" @focus="onInputFocus" @blur="stopselect"/>
                </div>
              </div>
            </div>
            <!-- 包含键 -->
            <div :key="rule.funcName" class="row" v-if="rule.funcName === 'contain_key'">
              <span class="label" v-t="'task_engine_v2.condition_action_block.label_key'"></span>
              <div ref="insertVarDropdown" class="dropdown-container" v-dropdown="insertVarDropdown(rule.id, rule.content, 'key')">
                <input ref="input-content" v-tooltip="inputTooltip" class="input-content" v-model="rule.content.key" :key="rule.funcName" :placeholder="$t('task_engine_v2.condition_action_block.input_placeholder')" @focus="onInputFocus" @blur="stopselect">
              </div>
            </div>
            <!-- 不包含键 -->
            <div :key="rule.funcName" class="row" v-if="rule.funcName === 'not_contain_key'">
              <span class="label" v-t="'task_engine_v2.condition_action_block.label_key'"></span>
              <div ref="insertVarDropdown" class="dropdown-container" v-dropdown="insertVarDropdown(rule.id, rule.content, 'key')">
                <input ref="input-content" v-tooltip="inputTooltip" class="input-content" v-model="rule.content.key" :key="rule.funcName" :placeholder="$t('task_engine_v2.condition_action_block.input_placeholder')" @focus="onInputFocus" @blur="stopselect">
              </div>
            </div>
            <!-- 序列长度匹配 -->
            <div :key="rule.funcName" v-if="rule.funcName === 'list_length_match'">
              <div class="row">
                <span class="label" v-t="'task_engine_v2.condition_action_block.label_compare_operator'"></span>
                <dropdown-select
                  class="dropdown-select"
                  :key="rule.funcName"
                  :value="[rule.content.compare]"
                  @input="rule.content.compare = $event[0]"
                  :options="listLengthMatchCompareOptions"
                  :showCheckedIcon="false"
                  :inputBarStyle="selectStyle"/>
              </div>
              <div class="row">
                <span class="label" v-t="'task_engine_v2.condition_action_block.label_key'"></span>
                <div ref="insertVarDropdown" class="dropdown-container" v-dropdown="insertVarDropdown(rule.id, rule.content, 'key')">
                  <input ref="input-content" v-tooltip="inputTooltip" class="input-content" v-model="rule.content.key" :placeholder="$t('task_engine_v2.condition_action_block.input_placeholder')" @focus="onInputFocus" @blur="stopselect">
                </div>
              </div>
              <div class="row">
                <span class="label" v-t="'task_engine_v2.condition_action_block.label_value'"></span>
                <input
                  class="input-content"
                  ref="input-content"
                  v-tooltip="inputTooltip"
                  oninput="this.value = this.value.replace(/[^0-9]/g, '');"
                  v-model="rule.content.val"
                  :placeholder="$t('task_engine_v2.condition_action_block.input_placeholder')"
                  @focus="onInputFocus"
                  @blur="stopselect"/>
              </div>
            </div>
            <!-- 轮次检查 -->
            <div class="row" v-if="rule.funcName === 'counter_check'">
              <span class="label" v-t="'task_engine_v2.condition_action_block.label_content'"></span>
              <dropdown-select
                class="dropdown-select"
                :key="rule.funcName"
                :value="[rule.content]"
                @input="rule.content = $event[0]"
                :options="counterCheckOptions"
                :showCheckedIcon="false"
                :inputBarStyle="selectStyle"/>
            </div>
            <!-- 正则表示式 -->
            <template v-if="rule.funcName === 'regular_exp_from_var'">
              <div class="row">
                <span class="label" v-t="'task_engine_v2.condition_action_block.label_pattern'"></span>
                <input ref="input-content" v-tooltip="inputTooltip" class="input-content" v-model="rule.content.pattern" :placeholder="$t('task_engine_v2.condition_action_block.input_placeholder')" @focus="onInputFocus" @blur="stopselect"/>
              </div>
              <div class="row">
                <span class="label" v-t="'task_engine_v2.condition_action_block.label_source_key'"></span>
                <div ref="insertVarDropdown" class="dropdown-container" v-dropdown="insertVarDropdown(rule.id, rule.content, 'from_key')">
                  <input ref="input-content" v-tooltip="inputTooltip" class="input-content" v-model="rule.content.from_key" :placeholder="$t('task_engine_v2.condition_action_block.input_placeholder')" @focus="onInputFocus" @blur="stopselect">
                </div>
              </div>
            </template>
            <!-- 数据转换解析匹配 -->
            <div :key="rule.funcName" v-if="rule.funcName === 'user_custom_transform'">
              <div class="row">
                <span class="label" v-t="'task_engine_v2.condition_action_block.label_mapping_table'"></span>
                <dropdown-select
                  class="dropdown-select"
                  filterable
                  :value="[rule.content.trans]"
                  @input="rule.content.trans = $event[0]"
                  :options="mapTableOptions"
                  :showCheckedIcon="false"
                  :inputBarStyle="selectStyle"/>
              </div>
              <div class="row">
                <span class="label" v-t="'task_engine_v2.condition_action_block.label_source_key'"></span>
                <div ref="insertVarDropdown" class="dropdown-container" v-dropdown="insertVarDropdown(rule.id, rule.content, 'from_key')">
                  <input ref="input-content" v-tooltip="inputTooltip" class="input-content" v-model="rule.content.from_key" :placeholder="$t('task_engine_v2.condition_action_block.input_placeholder')" @focus="onInputFocus" @blur="stopselect"/>
                </div>
              </div>
            </div>
          </div>
        </template>
        </draggable>
        <div class="add-condition-rule" >
          <button class="addbtn" @click="addConditionActionClick($event, 'toggleAddCondition')" v-dropdown="sourceDropdown" @blur="toggleAddCondition = false">
            {{ $t('task_engine_v2.condition_action_block.add_condition')}}
          </button>
        </div>
      </div>
    </div>
    <!--新增操作 -->
    <div class="normal-edge" v-if="(edgeType==='normal' || edgeType==='trigger' || edgeType==='normal_2.0' || edgeType==='global_normal_2.0')">
      <div class="edge-content">
        <div class="title"  v-show="actions.length" v-t="'task_engine_v2.condition_action_block.action_setup'"></div>
        <draggable v-model='actions' :disabled="drag" >
        <template v-for="(action, index) in actions">
          <div :key="action.id" class="block">
            <!-- 键值赋值 / 键键赋值-->
            <template v-if="action.type === ActionType.AssignValue">
              <div class="row">
                <span class="label" v-t="'task_engine_v2.condition_action_block.label_assign_value'"></span>
                <dropdown-select
                  class="dropdown-select"
                  :ref="`selectSource_${index}`"
                  :value="[action.content.operation]"
                  @input="action.content.operation = $event[0];"
                  :options="assignValueOptions"
                  :showCheckedIcon="false"
                  :inputBarStyle="selectStyle"/>
<!--                <icon class="trash" :size="14" iconType="trash" @click="deleteAction(index)"></icon>-->
                <emoti-icon class="trash" name="icon-delete-filled" :size="14" @click="deleteAction(index)"></emoti-icon>
              </div>
              <div class="row" v-if="action.content.operation === 'set_key_to_value'">
                <span class="label" v-t="'task_engine_v2.condition_action_block.label_exec'"></span>
                <div key="set_key_to_value_input1" ref="insertVarDropdown" class="dropdown-container" v-dropdown="insertVarDropdown(action.id, action.content, 'key')">
                  <input ref="input-content" v-tooltip="inputTooltip" class="input-content" v-model="action.content.key" :placeholder="$t('task_engine_v2.condition_action_block.key_placeholder')" @focus="onInputFocus" @blur="stopselect">
                </div>
                <span class="label" v-t="'task_engine_v2.condition_action_block.label_equal'"></span>
                <input ref="input-content" v-tooltip="inputTooltip" class="input-content" v-model="action.content.val" :placeholder="$t('task_engine_v2.condition_action_block.value_placeholder')" @focus="onInputFocus" @blur="stopselect"/>
              </div>
              <div class="row" v-if="action.content.operation === 'set_key_to_key'">
                <span class="label" v-t="'task_engine_v2.condition_action_block.label_exec'"></span>
                <div key="set_key_to_key_input1" ref="insertVarDropdown" class="dropdown-container" v-dropdown="insertVarDropdown(action.id, action.content, 'key1')">
                  <input ref="input-content" v-tooltip="inputTooltip" class="input-content" v-model="action.content.key1" :placeholder="$t('task_engine_v2.condition_action_block.key_placeholder')" @focus="onInputFocus" @blur="stopselect">
                </div>
                <span class="label" v-t="'task_engine_v2.condition_action_block.label_equal'"></span>
                <div ref="insertVarDropdown" class="dropdown-container" v-dropdown="insertVarDropdown(action.id, action.content, 'key2')">
                  <input ref="input-content" v-tooltip="inputTooltip" class="input-content" v-model="action.content.key2" :placeholder="$t('task_engine_v2.condition_action_block.key_placeholder')" @focus="onInputFocus" @blur="stopselect">
                </div>
              </div>
            </template>
            <!--计数器自增-->
            <template v-if="action.type === ActionType.SelfIncrement">
              <div class="row">
                <span class="label" v-t="'task_engine_v2.condition_action_block.label_assign_value'"></span>
                <dropdown-select
                  class="dropdown-select"
                  :ref="`selectSource_${index}`"
                  :value="[action.content.operation]"
                  @input="action.content.operation = $event[0];"
                  :options="selfIncrementOptions"
                  :showCheckedIcon="false"
                  :inputBarStyle="selectStyle"/>
<!--                <icon class="trash" :size="14" iconType="trash" @click="deleteAction(index)"></icon>-->
                <emoti-icon class="trash" name="icon-delete-filled" :size="14" @click="deleteAction(index)"></emoti-icon>
              </div>
              <div class="row" v-if="action.content.operation === 'self_increament'">
                <span class="label" v-t="'task_engine_v2.condition_action_block.label_exec'"></span>
                <div key="set_key_to_value_input1" ref="insertVarDropdown" class="dropdown-container" v-dropdown="insertVarDropdown(action.id, action.content, 'key')">
                  <input ref="input-content" v-tooltip="inputTooltip" class="input-content" v-model="action.content.key" :placeholder="$t('task_engine_v2.condition_action_block.key_placeholder')" @focus="onInputFocus" @blur="stopselect">
                </div>
                <span class="label" v-t="'task_engine_v2.condition_action_block.label_equal'"></span>
                <input ref="input-content" v-tooltip="inputTooltip" class="input-content" v-model="action.content.val" :placeholder="$t('task_engine_v2.condition_action_block.value_placeholder')" @focus="onInputFocus" @blur="stopselect"/>
              </div>
              <div class="row" v-if="action.content.operation === 'set_key_to_key'">
                <span class="label" v-t="'task_engine_v2.condition_action_block.label_exec'"></span>
                <div key="set_key_to_key_input1" ref="insertVarDropdown" class="dropdown-container" v-dropdown="insertVarDropdown(action.id, action.content, 'key1')">
                  <input ref="input-content" v-tooltip="inputTooltip" class="input-content" v-model="action.content.key1" :placeholder="$t('task_engine_v2.condition_action_block.key_placeholder')" @focus="onInputFocus" @blur="stopselect">
                </div>
                <span class="label" v-t="'task_engine_v2.condition_action_block.label_equal'"></span>
                <div ref="insertVarDropdown" class="dropdown-container" v-dropdown="insertVarDropdown(action.id, action.content, 'key2')">
                  <input ref="input-content" v-tooltip="inputTooltip" class="input-content" v-model="action.content.key2" :placeholder="$t('task_engine_v2.condition_action_block.key_placeholder')" @focus="onInputFocus" @blur="stopselect">
                </div>
              </div>
            </template>
            <!-- Web API 调用 -->
            <div class="row" v-if="action.type === ActionType.WebAPI">
              <span class="label" v-t="'task_engine_v2.condition_action_block.label_web_api'"></span>
              <input ref="input-content" v-tooltip="inputTooltip" class="input-content" v-model="action.content" :placeholder="$t('task_engine_v2.condition_action_block.http_placeholder')" @focus="onInputFocus" @blur="stopselect"/>
<!--              <icon class="trash" :size="14" iconType="trash" @click="deleteAction(index)"></icon>-->
              <emoti-icon class="trash" name="icon-delete-filled" :size="14" @click="deleteAction(index)"></emoti-icon>
            </div>
            <!-- 文字回复 -->
            <div class="row" v-if="action.type === ActionType.ResponseText">
              <span class="label" v-t="'task_engine_v2.condition_action_block.label_text_response'"></span>
              <input ref="input-content" v-tooltip="inputTooltip" class="input-content" v-model="action.content" :placeholder="$t('task_engine_v2.condition_action_block.input_placeholder')" @focus="onInputFocus" @blur="stopselect"/>
<!--              <icon class="trash" :size="14" iconType="trash" @click="deleteAction(index)"></icon>-->
              <emoti-icon class="trash" name="icon-delete-filled" :size="14" @click="deleteAction(index)"></emoti-icon>
            </div>
            <!-- 语音回复 -->
            <div v-if="action.type === ActionType.ResponseVoice">
              <div class="row">
                <span class="label" v-t="'task_engine_v2.condition_action_block.label_voice_response'"></span>
                <span  v-if="voiceSet" class="small-tip" style="font-size: 12px;" @click="showAddChoice(index)">
                  <span class="addvoice" v-t="'task_engine_v2.global_TTSinfo.add_prerecording'"></span>
                  <div v-show="waitChoiceFlag[index]" class="addChoice">
                    <dropdown-select
                      class="select"
                      ref="selectElseThenGoto"
                      :value="[]"
                      @input="receive"
                      :options="voiceFileOptions"
                      :fixedListWidth="false"
                      :showCheckedIcon="false"
                      :showSearchBar="false"
                      width="200px"
                      :inputBarStyle="selectStyle"/>
                    <div class="addchoicebutton">
                      <text-button button-type="default"  @click.stop="cancle(index)">{{ $t('task_engine_v2.global_TTSinfo.cancel')}}</text-button>
                      <text-button button-type="primary" @click.stop="ensure(index, $event)">{{ $t('task_engine_v2.global_TTSinfo.ensure')}}</text-button>
                    </div>
                  </div>
                </span>
<!--                <icon class="trash" :size="14" iconType="trash" @click="deleteAction(index)"></icon>-->
                <emoti-icon class="trash" name="icon-delete-filled" :size="14" @click="deleteAction(index)"></emoti-icon>
              </div>
              <div class="row" >
                <span class="label" ></span>
                <input ref="input-content" v-tooltip="inputTooltip" class="input-content" v-model="action.content.msg" :placeholder="$t('task_engine_v2.condition_action_block.input_placeholder')" @focus="onInputFocus" @blur="stopselect"/>
              </div>
            </div>
            <!-- 解析器 -->
            <template v-if="action.type === ActionType.Parser">
              <div class="row">
                <span class="label" v-t="'task_engine_v2.condition_action_block.label_parser'"></span>
                <dropdown-select
                  class="dropdown-select"
                  :ref="`selectSource_${index}`"
                  :value="[action.parser]"
                  @input="parserInput(action, {parser: $event[0], source: 'text'})"
                  :options="parserOptions"
                  :placeholder="$t('task_engine_v2.condition_action_block.parser_placeholder')"
                  :showCheckedIcon="false"
                  :inputBarStyle="selectStyle"/>
<!--                <icon class="trash" :size="14" iconType="trash" @click="deleteAction(index)"></icon>-->
                <emoti-icon class="trash" name="icon-delete-filled" :size="14" @click="deleteAction(index)"></emoti-icon>
              </div>
              <!-- 规则解析器 -->
              <div :key="action.parser" v-if="action.parser === 'reg_parser'">
                <div class="row">
                  <span class="label" v-t="'task_engine_v2.condition_action_block.label_source'"></span>
                  <dropdown-select
                    class="dropdown-select"
                    :ref="`selectSource_${index}`"
                    :value="[action.source]"
                    @input="parserInput(action, {source: $event[0], parser: action.parser})"
                    :options="sourceOptions"
                    :showCheckedIcon="false"
                    :inputBarStyle="selectStyle"/>
                </div>
                <div class="row">
                  <span class="label" v-t="'task_engine_v2.condition_action_block.label_pattern'"></span>
                  <input ref="input-content" v-tooltip="inputTooltip" class="input-content" v-model="action.content.pattern" :placeholder="$t('task_engine_v2.condition_action_block.reg_placeholder')" @focus="onInputFocus" @blur="stopselect"/>
                </div>
                <div class="row" v-if="action.source === 'global_info'">
                  <span class="label" v-t="'task_engine_v2.condition_action_block.label_source_key'"></span>
                  <div ref="insertVarDropdown" class="dropdown-container" v-dropdown="insertVarDropdown(action.id, action.content, 'from_key')">
                    <input ref="input-content" v-tooltip="inputTooltip" class="input-content" v-model="action.content.from_key" @focus="onInputFocus" @blur="stopselect">
                  </div>
                </div>
                <div class="row">
                  <span class="label"></span>
                  <button
                    class="add-new-row"
                    v-t="'task_engine_v2.condition_action_block.add_target_key'"
                    @click="action.content.operations.push({index: 0, key: '', operation: 'set_to_global_info'})">
                  </button>
                </div>
                <template v-for="(operation, idx) in action.content.operations">
                  <div class="row" :key="idx">
                    <span class="label" v-t="'task_engine_v2.condition_action_block.label_match'"></span>
                    <input class="input-content" ref="input-content" v-tooltip="inputTooltip"
                        oninput="this.value = this.value.replace(/[^0-9]/g, ''); this.value = this.value.replace(/(^[0-9]{1,2}).*/g, '$1');"
                        v-model.number="operation.index"
                        @focus="onInputFocus" @blur="stopselect"/>
                    <span class="label" v-t="'task_engine_v2.condition_action_block.label_target_key'"></span>
                    <input ref="input-content" v-tooltip="inputTooltip" class="input-content" v-model="operation.key" @focus="onInputFocus" @blur="stopselect">
                    <button class="delete-button" v-t="'task_engine_v2.condition_action_block.delete'" @click="action.content.operations.splice(idx, 1)"></button>
                  </div>
                </template>
              </div>
              <!-- 是否解析器 -->
              <div :key="action.parser" v-if="action.parser === 'polarity_parser'">
                <div class="row">
                  <span class="label" v-t="'task_engine_v2.condition_action_block.label_source'"></span>
                  <dropdown-select
                    class="dropdown-select"
                    :ref="`selectSource_${index}`"
                    :value="[action.source]"
                    @input="parserInput(action, {source: $event[0], parser: action.parser})"
                    :options="sourceOptions"
                    :showCheckedIcon="false"
                    :inputBarStyle="selectStyle"/>
                </div>
                <div class="row" v-if="action.source === 'global_info'">
                  <span class="label" v-t="'task_engine_v2.condition_action_block.label_source_key'"></span>
                  <div ref="insertVarDropdown" class="dropdown-container" v-dropdown="insertVarDropdown(action.id, action.content, 'from_key')">
                    <input ref="input-content" v-tooltip="inputTooltip" class="input-content" v-model="action.content.from_key" :placeholder="$t('task_engine_v2.condition_action_block.input_placeholder')" @focus="onInputFocus" @blur="stopselect">
                  </div>
                </div>
                <div class="row">
                  <span class="label" v-t="'task_engine_v2.condition_action_block.label_target_key'"></span>
                  <input ref="input-content" v-tooltip="inputTooltip" class="input-content" v-model="action.content.key" :placeholder="$t('task_engine_v2.condition_action_block.input_placeholder')" @focus="onInputFocus" @blur="stopselect"/>
                </div>
              </div>
              <!-- 酒店预定语句解析器 / 通用语句解析器 / 场景语句解析器 -->
              <div :key="action.parser" v-if="action.parser === 'common_parser' || action.parser === 'hotel_parser' || action.parser === 'task_parser'">
                <div class="row">
                  <span class="label" v-t="'task_engine_v2.condition_action_block.label_source'"></span>
                  <dropdown-select
                    class="dropdown-select"
                    :ref="`selectSource_${index}`"
                    :value="[action.source]"
                    @input="parserInput(action, {source: $event[0], parser: action.parser})"
                    :options="sourceOptions"
                    :showCheckedIcon="false"
                    :inputBarStyle="selectStyle"/>
                </div>
                <div class="row">
                  <span class="label" v-t="'task_engine_v2.condition_action_block.label_content'"></span>
                  <dropdown-select
                    v-tooltip="inputTooltip"
                    class="dropdown-select"
                    :key="action.funcName"
                    :ref="`selectTargetEntity_${index}`"
                    :multi="true"
                    :value="action.content.tags.split(',')"
                    @input="action.content.tags = $event.join(',')"
                    :options="entityModuleOptions(action.funcName)"
                    :showCheckedIcon="true"
                    :showSearchBar="true"
                    :placeholder="$t('task_engine_v2.condition_action_block.multi_placeholder')"
                    :inputBarStyle="selectFixedStyle"
                    :showtooltipflag="true"
                    @hide="hidetooltip(`selectTargetEntity_${index}`)"
                    />
                </div>
                <div class="row" v-if="action.source === 'global_info'">
                  <span class="label" v-t="'task_engine_v2.condition_action_block.label_source_key'"></span>
                  <div ref="insertVarDropdown" class="dropdown-container" v-dropdown="insertVarDropdown(action.id, action.content, 'from_key')">
                    <input ref="input-content" v-tooltip="inputTooltip" class="input-content" v-model="action.content.from_key" :placeholder="$t('task_engine_v2.condition_action_block.input_placeholder')" @focus="onInputFocus" @blur="stopselect">
                  </div>
                </div>
              </div>
              <!-- 转换数据解析器 -->
              <div :key="action.parser" v-if="action.parser === 'user_custom_parser'">
                <div class="row">
                  <span class="label" v-t="'task_engine_v2.condition_action_block.label_source'"></span>
                  <dropdown-select
                    class="dropdown-select"
                    :ref="`selectSource_${index}`"
                    :value="[action.source]"
                    @input="parserInput(action, {source: $event[0], parser: action.parser})"
                    :options="sourceOptions"
                    :showCheckedIcon="false"
                    :inputBarStyle="selectStyle"/>
                </div>
                <div class="row">
                  <span class="label" v-t="'task_engine_v2.condition_action_block.label_mapping_table'"></span>
                  <dropdown-select
                    v-tooltip="inputTooltip"
                    :key="action.source"
                    class="dropdown-select"
                    :ref="`selectSource_${index}`"
                    filterable
                    :value="[action.content.trans]"
                    @input="action.content.trans = $event[0]"
                    :options="mapTableOptions"
                    :showCheckedIcon="false"
                    :inputBarStyle="selectStyle"
                    :showtooltipflag="true"
                    @hide="hidetooltip(`selectSource_${index}`)"/>
                </div>
                <div class="row" v-if="action.source === 'global_info'">
                  <span class="label" v-t="'task_engine_v2.condition_action_block.label_source_key'"></span>
                  <div ref="insertVarDropdown" class="dropdown-container" v-dropdown="insertVarDropdown(action.id, action.content, 'from_key')">
                    <input ref="input-content" v-tooltip="inputTooltip" class="input-content" v-model="action.content.from_key" :placeholder="$t('task_engine_v2.condition_action_block.input_placeholder')" @focus="onInputFocus" @blur="stopselect"/>
                  </div>
                </div>
                <div class="row">
                  <span class="label" v-t="'task_engine_v2.condition_action_block.label_target_key'"></span>
                  <input ref="input-content" v-tooltip="inputTooltip" class="input-content" v-model="action.content.to_key" :placeholder="$t('task_engine_v2.condition_action_block.input_placeholder')" @focus="onInputFocus" @blur="stopselect"/>
                </div>
              </div>
              <!-- NLU解析器 -->
              <div :key="action.parser" v-if="action.parser === 'nlu_parser'">
                <div class="row" v-if="(action.funcUrl !== undefined && action.funcUrl !== '') || hadCustomUrl">
                  <div class="label label-start">
                    {{$t("task_engine_v2.condition_block.label_link")}}
                  </div>
                  <input v-tooltip="inputTooltip" class="input-content" v-model="action.funcUrl" @focus="onInputFocus" @blur="stopselect">
                </div>
                <div class="row">
                  <span class="label" v-t="'task_engine_v2.condition_action_block.label_type'"></span>
                  <dropdown-select
                    v-tooltip="inputTooltip"
                    class="dropdown-select"
                    :ref="`selectSource_${index}`"
                    :value="[action.nluType]"
                    :placeholder="$t('task_engine_v2.condition_action_block.nlu_placeholder')"
                    @input="nluParserInput(action, { nluType: $event[0], source: 'text'})"
                    :options="nluTypeOptions"
                    :showCheckedIcon="false"
                    :inputBarStyle="selectStyle"
                    :showtooltipflag="true"
                    @hide="hidetooltip(`selectSource_${index}`)"
                    />
                </div>
                <div class="row" v-if="action.nluType === NLUTypeMap.TIME">
                  <span class="label" v-t="'task_engine_v2.condition_action_block.label_default'"></span>
                  <dropdown-select
                  v-tooltip="inputTooltip"
                    class="dropdown-select"
                    :ref="`selectSource_${index}`"
                    :value="[action.content.tags.split(',')[0]]"
                    @input="action.content.tags = $event[0]"
                    :options="nluTimeOptions"
                    :showCheckedIcon="false"
                    :inputBarStyle="selectStyle"
                    :showtooltipflag="true"
                    @hide="hidetooltip(`selectSource_${index}`)"
                    />
                </div>
                <template v-if="action.nluType === NLUTypeMap.SELECT">
                  <div class="row">
                    <span class="label" v-t="'task_engine_v2.condition_action_block.label_select_mode'"></span>
                    <dropdown-select
                      class="dropdown-select"
                      :ref="`selectSource_${index}`"
                      :value="[action.content.tags.split(',')[0]]"
                      @input="setNluSelectOptionType(action, $event[0])"
                      :options="nluSelectOptions"
                      :showCheckedIcon="false"
                      :inputBarStyle="selectStyle"/>
                  </div>
                  <template v-if="action.content.tags === NLUParserMap.SELECT_CUSTOMIZE_OPTIONS">
                    <div class="row">
                      <span class="label"></span>
                      <button
                        class="add-new-row"
                        v-t="'task_engine_v2.condition_action_block.add_option'"
                        @click="addNLUSelectOption(action)">
                      </button>
                    </div>
                    <div class="row" v-for="(option, index) in action.content.options" :key="index">
                      <span class="label">{{`${$t('task_engine_v2.condition_action_block.label_option')}${index + 1}`}}</span>
                      <input ref="input-content" v-tooltip="inputTooltip" class="input-content" v-model="action.content.options[index]" @focus="onInputFocus" @blur="stopselect">
                      <button class="delete-button red" v-t="'task_engine_v2.condition_action_block.delete'" @click="action.content.options.splice(index, 1); $forceUpdate();"></button>
                    </div>
                  </template>
                  <div class="row" v-if="action.content.tags === NLUParserMap.SELECT_OPTIONS_IN_KEY">
                    <span class="label" v-t="'task_engine_v2.condition_action_block.label_option_key'"></span>
                    <input ref="input-content" v-tooltip="inputTooltip" class="input-content" v-model="action.content.option_key" :placeholder="$t('task_engine_v2.condition_action_block.input_placeholder')" @focus="onInputFocus" @blur="stopselect">
                  </div>
                  <div class="row">
                    <span class="label" v-t="'task_engine_v2.condition_action_block.label_fuzzy_match'"></span>
                    <toggle v-model="action.content.fuzzy_match" :size="'medium'" :showLabel="true" :label="toggleLabel"></toggle>
                  </div>
                </template>
                <div class="row">
                  <span class="label" v-t="'task_engine_v2.condition_action_block.label_source'"></span>
                  <dropdown-select
                    :key="action.source"
                    class="dropdown-select"
                    :ref="`selectSource_${index}`"
                    :value="[action.source]"
                    @input="action.source = $event[0]; delete action.content.from_key"
                    :options="sourceOptions"
                    :showCheckedIcon="false"
                    :inputBarStyle="selectStyle"/>
                </div>
                <div class="row" v-if="action.source === 'global_info'">
                  <span class="label" v-t="'task_engine_v2.condition_action_block.label_source_key'"></span>
                  <div ref="insertVarDropdown" class="dropdown-container" v-dropdown="insertVarDropdown(action.id, action.content, 'from_key')">
                    <input ref="input-content" v-tooltip="inputTooltip" class="input-content" v-model="action.content.from_key" :placeholder="$t('task_engine_v2.condition_action_block.input_placeholder')" @focus="onInputFocus" @blur="stopselect">
                  </div>
                </div>
                <div class="row" v-if="action.nluType === NLUTypeMap.PERSON_NAME">
                  <span class="label" v-t="'task_engine_v2.condition_action_block.label_get_surname'"></span>
                  <toggle :value="renderOnlyParseSurname(action.content.tags)" @change="onlyParseSurnameChange(action, $event)" :size="'medium'" :showLabel="true" :label="toggleLabel"></toggle>
                </div>
                <div class="row"
                  v-if="action.content.tags!==NLUParserMap.SELECT_CUSTOMIZE_OPTIONS &&
                        action.content.tags!==NLUParserMap.SELECT_OPTIONS_IN_KEY &&
                        action.content.tags!==NLUParserMap.POLARITY">
                  <span class="label" v-t="'task_engine_v2.condition_action_block.label_has_context'"></span>
                  <toggle v-model="action.content.has_context" :size="'medium'" :showLabel="true" :label="toggleLabel"></toggle>
                </div>
              </div>
              <!-- 自定义解析器 -->
              <div :key="action.parser" v-if="action.parser === 'custom_parser'">
                <div class="row">
                  <span class="label" v-t="'task_engine_v2.condition_action_block.label_custom_parser'"></span>
                  <dropdown-select
                    class="dropdown-select"
                    :value="[action.customParserType]"
                    @input="customParserInput(action, {customParserType: $event[0], source: 'text'})"
                    :options="customParserOptions"
                    :placeholder="$t('task_engine_v2.condition_action_block.parser_placeholder')"
                    :showCheckedIcon="false"
                    :showSearchBar="true"
                    :inputBarStyle="selectStyle"/>
                </div>
                <div class="row">
                  <span class="label" v-t="'task_engine_v2.condition_action_block.label_custom_parser_slot'"></span>
                  <dropdown-select
                    class="dropdown-select"
                    :value="[action.content.slot.slotId]"
                    @input="customParserSlotInput(action, $event[0])"
                    :options="action.content.parserData.slotInfo.map(slot => ({text: slot.slotName, value: slot.slotId}))"
                    :placeholder="$t('task_engine_v2.condition_action_block.slot_placeholder')"
                    :showCheckedIcon="false"
                    :showSearchBar="true"
                    :clearcheckflag="true"
                    :inputBarStyle="selectStyle"/>
                </div>
                <div class="row">
                  <span class="label" v-t="'task_engine_v2.condition_action_block.label_source'"></span>
                  <dropdown-select
                    :key="action.source"
                    class="dropdown-select"
                    :ref="`selectSource_${index}`"
                    :value="[action.source]"
                    @input="action.source = $event[0]; delete action.content.from_key"
                    :options="sourceOptions"
                    :showCheckedIcon="false"
                    :inputBarStyle="selectStyle"/>
                </div>
                <div class="row" v-if="action.source === 'global_info'">
                  <span class="label" v-t="'task_engine_v2.condition_action_block.label_source_key'"></span>
                  <div ref="insertVarDropdown" class="dropdown-container" v-dropdown="insertVarDropdown(action.id, action.content, 'from_key')">
                    <input ref="input-content" v-tooltip="inputTooltip" class="input-content" v-model="action.content.from_key" :placeholder="$t('task_engine_v2.condition_action_block.input_placeholder')" @focus="onInputFocus" @blur="stopselect">
                  </div>
                </div>
              </div>
              <!-- 对话行为分类解析器 -->
              <div :key="action.parser" v-if="action.parser === 'dialog_act_parser'">
                <div class="row">
                  <span class="label" v-t="'task_engine_v2.condition_action_block.label_dialog_act_parser'"></span>
                  <dropdown-select
                    class="dropdown-select"
                    :value="[action.dialogActParserType]"
                    @input="dialogActParserInput(action, {dialogActParserType: $event[0], source: 'text'})"
                    :options="dialogActParserOptions"
                    :placeholder="$t('task_engine_v2.condition_action_block.parser_placeholder')"
                    :showCheckedIcon="false"
                    :showSearchBar="true"
                    :inputBarStyle="selectStyle"/>
                </div>
                <div class="row" v-if="action.content.parserData">
                  <span class="label" v-t="'task_engine_v2.condition_action_block.label_dialog_act_parser_slot_name'"></span>
                  <div ref="insertVarDropdown" class="dropdown-container">
                    <input disabled v-tooltip="inputTooltip" class="input-content" v-model="action.content.parserData.predictSlotName">
                  </div>
                </div>
              </div>
            </template>
            <!-- JS 脚本使用 -->
            <template v-if="action.type === ActionType.JSScript">
              <div class="row">
                <span class="label" v-t="'task_engine_v2.condition_action_block.label_script'"></span>
                <dropdown-select
                  class="dropdown-select"
                  :value="[action.content]"
                  @input="action.content = $event[0]"
                  :options="jsCodeOptions"
                  :placeholder="$t('task_engine_v2.condition_action_block.script_placeholder')"
                  :showCheckedIcon="false"/>
<!--                <icon class="trash" :size="14" iconType="trash" @click="deleteAction(index)"></icon>-->
                <emoti-icon class="trash" name="icon-delete-filled" :size="14" @click="deleteAction(index)"></emoti-icon>
              </div>
            </template>
            <!-- 删除键 -->
            <div class="row" v-if="action.type === ActionType.RemoveKey">
              <span class="label" v-t="'task_engine_v2.condition_action_block.label_remove_key'"></span>
              <input ref="input-content" v-tooltip="inputTooltip" class="input-content" v-model="action.content" :placeholder="$t('task_engine_v2.condition_action_block.key_placeholder')" @focus="onInputFocus" @blur="stopselect"/>
<!--              <icon class="trash" :size="14" iconType="trash" @click="deleteAction(index)"></icon>-->
              <emoti-icon class="trash" name="icon-delete-filled" :size="14" @click="deleteAction(index)"></emoti-icon>
            </div>
            <!-- 子场景 -->
            <div class="row" v-if="action.type === ActionType.SubScenario">
              <span class="label" v-t="'task_engine_v2.condition_action_block.label_sub_scenario'"></span>
              <input ref="input-content" v-tooltip="inputTooltip" class="input-content" v-model="action.content.scenario.id" @focus="onInputFocus" @blur="stopselect"/>
              <span class="label" v-t="'task_engine_v2.condition_action_block.label_sub_scenario_node'"></span>
              <input v-tooltip="inputTooltip" class="input-content" v-model="action.content.node.id" @focus="onInputFocus" @blur="stopselect"/>
<!--              <icon class="trash" :size="14" iconType="trash" @click="deleteAction(index)"></icon>-->
              <emoti-icon class="trash" name="icon-delete-filled" :size="14" @click="deleteAction(index)"></emoti-icon>
            </div>
          </div>
        </template>
        </draggable>
        <div class="add-condition-rule">

        <button class="addbtn" @click="addConditionActionClick($event, 'toggleAddAction')" v-dropdown="actionDropdown" @blur="toggleAddAction = false">
          {{ $t('task_engine_v2.condition_action_block.add_action')}}
          </button>
        </div>

      </div>
      </div>
      <!--然後执行跳转 -->
      <div class="normal-edge " style="border-bottom: none;">
        <div class="block-instruction" v-show=" !rules.length && !actions.length"> 执行跳转 </div>
        <div class="block-instruction" v-show="rules.length || actions.length"> 然后执行跳转 </div>
          <div class="block" v-if="edgeType!=='trigger'">
            <!--跳转-->
            <div class="row">
              <span class="label" v-t="'task_engine_v2.condition_action_block.to'"></span>
              <dropdown-select
                class="dropdown-select"
                ref="selectGoto"
                filterable
                :value="[toNode]"
                @input="onSelectGoto($event[0])"
                :options="toNodeOptions"
                :fixedListWidth="false"
                :showCheckedIcon="false"
                :inputBarStyle="selectStyle"/>
            </div>
          </div>
          <!--biaoqian-->
          <div class="block" v-if="edgeType!=='trigger'">
          <div class="row" >
            <div class="label">
              <span  v-t="'task_engine_v2.condition_action_block.label_tag'"></span>
              <span>
                <toggle style="padding:0;" v-model="toNodeLabelsEnable" :size="'small'" :showLabel="true" :label="toggleLabel"></toggle>
              </span>
            </div>
            <div class="dropdown-container" v-if="edgeType!=='trigger' && toNodeLabelsEnable" >
              <tag-input ref='tonoderef'
                :origTags="origToNodeLabels"
                :tagsList="origToNodeLabelsList"
                :maxlength="10"
                @selectedTagsChanged="updateTags"
                width="522px"
                :iconflag='false'
                :placeholder="inputholder"
                style="width: 100%;"
              ></tag-input>
            </div>
          </div>
          <div class="row" v-if="edgeType!=='trigger' && toNodeLabelsEnable">
              <span class="label"></span>
              <div class="dropdown-container" style="background:#fff;width: 100%;border:1px solid #dedede;">
                <div style="padding:5px 10px;">{{ $t("task_engine_v2.edge_edit_tab.label_command")}}</div>
                <ul class="taglistul">
                  <li  class='taglistli' v-for="(item, index) in origToNodeLabelsList" :key='index' >
                    <img src="../../../_icon/images/add.png" alt="" class="addicon" @click="addlitext(index)">
                    <span class="litext" @click="addlitext(index)">{{item}}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
    </div>
  </template>
  </div>
  <div class="add-new-line-wrap" @mouseover="addNewlineFlag=true"  @mouseout="addNewlineFlag = false">
      <el-popover
        placement="top"
        width="80"
        trigger="hover"
        >
        <div class="newLinepopContent" >
          <p class="title"> {{ $t('task_engine_v2.edge_edit_tab2.you_can_do')}}</p>
          <p class="option" @click="addnewACblock('new')">{{ $t('task_engine_v2.edge_edit_tab2.create_newEdge')}}</p>
          <p class="option" @click="addnewACblock('copy')" v-show="copyACblock!==0">{{ $t('task_engine_v2.edge_edit_tab2.paste_edge')}}</p>
        </div>
        <!-- <p slot="reference" class="add-new-line" v-show="addNewlineFlag"></p> -->
        <p slot="reference" v-show="addNewlineFlag">
          <img src="../../../_icon/images/addline.png" style="width:100%;"/>
        </p>
      </el-popover>
  </div>
</div>
</template>

<script>
import draggable from 'vuedraggable';
import { mapGetters, mapMutations } from 'vuex';
// import draggable from 'vuedraggable';
import event from '@/utils/js/event';
import DropdownSelect from '@/components/DropdownSelect';
import intentApi from '@/modules/IntentEngine/_api/intent';
import Toggle from '@/components/basic/Toggle';
import general from '@/modules/TaskEngine/_utils/general';
import taskEngineApi from '@/modules/TaskEngine/_api/taskEngine';
import nerFactoryDalApi from '@/modules/TaskEngine/_api/nerFactoryDal';
import TagInput from '@/components/basic/TagInput';
import scenarioInitializer from '../_utils/scenarioInitializer';
import optionConfig from '../_utils/optionConfig';
import getTagList from '../_utils/getTagList';


const ActionType = optionConfig.ActionType;
const NLUParserMap = optionConfig.NLUParserMap;
const NLUTypeMap = optionConfig.NLUTypeMap;
const NLUTypeOptions = optionConfig.NLUTypeOptions;
const ConditionOption = {
  AND: 'AND',
  OR: 'OR',
};
const NLUTimeParsers = optionConfig.NLUTimeParsers;
const NLUSelectParsers = optionConfig.NLUSelectParsers;

export default {
  api: [taskEngineApi, intentApi, nerFactoryDalApi],
  components: {
    draggable,
    DropdownSelect,
    Toggle,
    TagInput,
  },
  props: {
    scenarioId: {
      type: String,
    },
    num: {
      type: Number,
    },
    index: {
      type: Number,
    },
    showConditionsAndAction: {
      type: Boolean,
    },
    nodeId: {
      type: String,
      required: true,
    },
    initialEdge: {
      type: Object,
      required: true,
    },
    toNodeOptions: {
      type: Array,
      required: true,
    },
    globalVarOptions: {
      type: Array,
      required: true,
    },
    mapTableOptions: {
      type: Array,
      required: true,
    },
    jsCodeAlias: {
      type: Array,
      default: () => [],
    },
    currentTab: {
      type: String,
    },
    isheight: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    const edge = this.initialEdge;
    const edgeType = edge.edge_type;
    const edgeName = edge.edge_name || '跳转规则';
    const sourceOptions = optionConfig.getSourceOptionsV2(this);
    const sourceDropdownOptions = sourceOptions.map(option => ({
      ...option,
      onclick: () => {
        this.addRule(option.value);
        this.toggleAddCondition = false;
      },
    }));
    const sourceDropdown = {
      width: '150px',
      alignLeft: true,
      options: sourceDropdownOptions,
    };
    const funcOptionMap = optionConfig.getFuncOptionMapV2(this);
    const actionOptionMap = optionConfig.getActionOptionMap(this);
    const keyValMatchCompareOptions = optionConfig.getKeyValMatchCompareOptions(this);
    const keyKeyMatchCompareOptions = optionConfig.getKeyKeyMatchCompareOptions(this);
    const listLengthMatchCompareOptions = optionConfig.getListLengthMatchCompareOptions(this);
    const counterCheckOptions = optionConfig.getCounterCheckOptions(this);
    const obj = this.renderNormalEdge(edge);
    const rules = obj.rules;
    const toNode = obj.toNode;
    const origToNodeLabels = obj.toNodeLabels;
    const toNodeLabels = obj.toNodeLabels;
    const toNodeLabelsEnable = obj.toNodeLabelsEnable;
    const actions = obj.actions;
    const flagLength = actions.length;
    const waitChoiceFlag = [];
    for (let i = 0; i < flagLength; i += 1) {
      waitChoiceFlag.push(false);
    }
    const conditionOptions = [
      { text: this.$t('task_engine_v2.condition_action_block.condition_options.all'), value: ConditionOption.AND },
      { text: this.$t('task_engine_v2.condition_action_block.condition_options.any'), value: ConditionOption.OR },
    ];
    return {
      edge,
      edgeType,
      rules,
      actions,
      toNode,
      origToNodeLabels,
      toNodeLabels,
      toNodeLabelsEnable,
      selectStyle: {
        height: '32px',
        'border-radius': '2px',
      },
      selectFixedStyle: {
        height: '32px',
        'border-radius': '2px',
        flex: true,
      },
      keyValMatchCompareOptions,
      keyKeyMatchCompareOptions,
      listLengthMatchCompareOptions,
      counterCheckOptions,
      sourceOptions,
      funcOptionMap,
      inputTooltip: {
        msg: this.$t('task_engine_v2.err_empty'),
        eventOnly: true,
        errorType: true,
        alignLeft: true,
        absolute: true,
      },
      toggleAddCondition: false,
      toggleAddAction: false,
      showConditionsAndActions: true,
      sourceDropdown,
      actionDropdown: {},
      conditionOptions,
      selectedOption: [edge.logic || conditionOptions[0].value],
      intentDropdown: {
        width: '450px',
        options: [],
      },
      ActionType,
      assignValueOptions: actionOptionMap[ActionType.AssignValue],
      selfIncrementOptions: actionOptionMap[ActionType.SelfIncrement],
      customParsers: [],
      customParserOptions: [],
      dialogActParsers: [],
      dialogActParserOptions: [],
      parserOptions: actionOptionMap[ActionType.Parser],
      nluTypeOptions: NLUTypeOptions.map(parser => ({
        text: this.$t(`task_engine_v2.condition_action_block.nlu_options.${parser}`),
        value: parser,
      })),
      NLUTypeMap,
      nluTimeOptions: NLUTimeParsers.map(parser => ({
        text: this.$t(`task_engine_v2.condition_action_block.nlu_time_options.${parser}`),
        value: parser,
      })),
      nluSelectOptions: NLUSelectParsers.map(parser => ({
        text: this.$t(`task_engine_v2.condition_action_block.nlu_select_options.${parser}`),
        value: parser,
      })),
      NLUParserMap,
      toggleLabel: {
        on: this.$t('task_engine_v2.condition_action_block.on'),
        off: this.$t('task_engine_v2.condition_action_block.off'),
      },
      hadCustomUrl: false,
      origToNodeLabelsList: [],
      inputholder: '输入标签按回车添加',
      inputContentRefs: [],
      dropRefs: [],
      waitChoiceFlag,
      voiceFileOptions: [],
      speechvalue: '',
      placeholder: this.$t('task_engine_v2.voice_setting_tab.please_select'),
      editFlag: false,
      edgeName,
      addNewlineFlag: false,
      drag: false,
    };
  },
  computed: {
    ...mapGetters([
      'robotID',
      'modelDAta',
      'enterpriseID',
      'voiceSet',
      'copyACblock',
    ]),
    toNodeText() {
      const isNodeOptionExist = this.toNodeOptions.find(option => option.value === this.toNode);
      if (!isNodeOptionExist) { this.toNode = null; }
      return this.toNodeOptions.find(option => option.value === this.toNode).text;
    },
    jsCodeOptions() {
      return this.jsCodeAlias.map(item => ({ value: item, text: item }));
    },
    andOrIfText() {
      return this.selectedOption[0] === ConditionOption.AND ?
        this.$t('task_engine_v2.condition_action_block.and_if') : this.$t('task_engine_v2.condition_action_block.or_if');
    },
  },
  watch: {
    drag(val) {
      this.$emit('changeDrag', val);
    },
    edgeName() {
      this.emitUpdate();
    },
    modelDAta: {
      handler() {
        this.getTagList();
      },
    },
    num() {
      this.showConditionsAndActions = this.showConditionsAndAction;
    },
    selectedOption() {
      this.emitUpdate();
    },
    actions: {
      handler() {
        this.emitUpdate();
      },
      deep: true,
    },
    rules: {
      handler() {
        this.emitUpdate();
      },
      deep: true,
    },
    toNode: {
      handler() {
        this.emitUpdate();
      },
      deep: true,
    },
    toNodeLabels: {
      handler() {
        this.emitUpdate();
      },
      deep: true,
    },
    toNodeLabelsEnable: {
      handler() {
        this.emitUpdate();
      },
      deep: true,
    },
    globalVarOptions: {
      handler() {
        this.$nextTick(() => {
          if (this.$refs.insertVarDropdown) {
            this.$refs.insertVarDropdown.forEach((dpd) => {
              dpd.dispatchEvent(event.createEvent('dropdown-reload'));
            });
          }
        });
      },
    },
  },
  methods: {
    ...mapMutations([
      'setcpoyConditionActionBlock',
    ]),
    changetoNumber(e) {
      if (!e.target.value) {
        e.target.value = 0;
      }
      this.drag = false;
    },
    addnewACblock(val) {
      const newEdge = {
        index: this.index,
        type: val,
      };
      this.$emit('addNewEdge', newEdge);
    },
    copyEdge() {
      const conditionBlock = {
        id: this.edge.id,
        edge_type: this.edgeType,
        to_node_id: this.toNode,
        to_node_labels: this.toNodeLabels,
        to_node_labels_enable: this.toNodeLabelsEnable,
        logic: this.selectedOption[0],
        actions: this.actions.map(action => ({
          source: action.source,
          function: {
            function_name: action.funcName,
            content: action.content,
            function_url: action.funcUrl,
          },
          type: action.type,
          parser: action.parser,
          nluType: action.nluType,
          customParserType: action.customParserType,
          dialogActParserType: action.dialogActParserType,
        })),
        condition_rules: this.rules.map(rule => ({
          source: rule.source,
          function: {
            function_name: rule.funcName,
            content: rule.content,
          },
        })),
      };
      conditionBlock.valid = this.isValid();
      this.setcpoyConditionActionBlock(JSON.parse(JSON.stringify(conditionBlock)));
      this.$message('复制成功');
    },
    receive(res) {
      this.speechvalue = res[0];
    },
    showAddChoice(index) {
      this.waitChoiceFlag[index] = true;
      this.$forceUpdate();
    },
    cancle(index) {
      this.waitChoiceFlag[index] = false;
      this.$forceUpdate();
    },
    ensure(index, e) {
      let waitingTextArea = this.actions[index].content.msg;
      this.voiceFileOptions.forEach((item) => {
        if (item.value === this.speechvalue) {
          const areaField = e.target.parentNode.parentNode
            .parentNode.parentNode.parentNode.nextElementSibling.lastElementChild;
          // IE浏览器
          if (document.selection) {
            areaField.focus();
            const sel = document.selection.createRange();
            sel.text = item.text;
          } else if (areaField.selectionStart) {
            const startPos = areaField.selectionStart;
            const endPos = areaField.selectionEnd;
            const restoreTop = areaField.scrollTop;
            waitingTextArea = `${waitingTextArea.substring(0, startPos)}[[${item.text}]]${waitingTextArea.substring(endPos, waitingTextArea.length)}`;
            if (restoreTop > 0) {
              areaField.scrollTop = restoreTop;
            }
            areaField.focus();
            areaField.selectionStart = startPos + item.text.length;
            areaField.selectionEnd = startPos + item.text.length;
          } else {
            waitingTextArea = `[[${item.text}]]${waitingTextArea}`;
            areaField.focus();
          }
        }
      });
      this.actions[index].content.msg = waitingTextArea;
      this.cancle(index);
    },
    togglebutton() {
      this.showConditionsAndActions = !this.showConditionsAndActions;
      const obj = {
        open: this.showConditionsAndActions ? 1 : 0,
        index: this.index,
      };
      this.$emit('changeFlag', obj);
    },
    hidetooltip(ref) {
      this.$refs[ref].forEach((el) => {
        el.$el.dispatchEvent(event.createEvent('tooltip-hide'));
      });
    },
    dropDownUpdate() {
      this.inputContentRefs = [];
      this.dropRefs = [];
      this.actions.forEach((item, index) => {
        if (this.$refs[`selectSource_${index}`]) {
          this.inputContentRefs.push(this.$refs[`selectSource_${index}`]);
        }
        if (this.$refs[`selectTargetEntity_${index}`]) {
          this.dropRefs.push(this.$refs[`selectTargetEntity_${index}`]);
        }
      });
    },
    onInputFocus(evt) {
      this.drag = true;
      evt.target.dispatchEvent(event.createEvent('tooltip-hide'));
    },
    stopselect() {
      this.drag = false;
    },
    editNameblur() {
      this.editFlag = false;
      this.drag = false;
    },
    renderNormalEdge(edge) {
      // render andRules
      const rules = edge.condition_rules.map(rule => ({
        id: this.$uuid.v1(),
        source: rule.source,
        funcName: rule.function.function_name,
        content: rule.function.content,
      }));
      // render Actions
      const actions = edge.actions.map(action => ({
        id: this.$uuid.v1(),
        source: action.source,
        funcName: action.function.function_name,
        content: action.function.content,
        type: action.type,
        parser: action.parser,
        nluType: action.nluType,
        funcUrl: action.function.function_url,
        customParserType: action.customParserType,
        dialogActParserType: action.dialogActParserType,
      }));
      // render toNode
      const toNode = edge.to_node_id;
      const toNodeLabels = edge.to_node_labels || [];
      const toNodeLabelsEnable = edge.to_node_labels_enable || false;
      return { rules, toNode, toNodeLabels, toNodeLabelsEnable, actions };
    },
    deleteEdge() {
      this.$emit('deleteEdge');
    },
    addRule(source = 'text') {
      this.edge.valid = false;
      const rule = scenarioInitializer.initialRule(source);
      this.rules.push({
        id: this.$uuid.v1(),
        source: rule.source,
        funcName: rule.functions[0].function_name,
        content: rule.functions[0].content,
      });
    },
    addAction(actionType = 'parser') {
      this.edge.valid = false;
      const action = scenarioInitializer.initialAction(actionType);
      this.actions.push({
        id: this.$uuid.v1(),
        source: action.source,
        funcName: action.function.function_name,
        content: action.function.content,
        type: actionType,
      });
      this.waitChoiceFlag.push(false);
      this.dropDownUpdate();
    },
    deleteRule(index) {
      this.edge.valid = false;
      this.rules.splice(index, 1);
    },
    deleteAction(index) {
      this.edge.valid = false;
      this.actions.splice(index, 1);
      this.waitChoiceFlag.splice(index, 1);
      this.dropDownUpdate();
    },
    onSelectSourceInput(index, newValue) {
      const newSource = newValue[0];
      const options = this.funcOptionMap[newSource];
      if (this.rules[index].source === newSource) return;
      this.rules[index].source = newSource;
      const selectFunctionRef = `selectFunction_${index}`;
      if (this.$refs[selectFunctionRef]) {
        this.$refs[selectFunctionRef][0].$emit('updateOptions', options);
        this.$refs[selectFunctionRef][0].$emit('select', options[0].value);
      }
      this.reloadTooltip();
    },
    onSelectFunctionInput(index, newValue) {
      const newFuncName = newValue[0];
      const originalEdgeType = this.edgeType;
      this.changeToNormalEdge(originalEdgeType, index, newFuncName);
      this.reloadTooltip();
    },
    dialogActParserInput(action, { dialogActParserType, source }) {
      action.dialogActParserType = dialogActParserType;
      // action.parser = action.parser;
      action.source = source;
      action.funcName = action.parser;
      action.content = scenarioInitializer.initialFunctionContentV2(action.parser, this.nodeId);
      action.content.parserData =
        this.dialogActParsers.filter(item => item.classifierId === dialogActParserType)[0];
      this.$forceUpdate();
    },
    customParserInput(action, { customParserType, source }) {
      action.customParserType = customParserType;
      // action.parser = action.parser;
      action.source = source;
      action.funcName = action.parser;
      action.content = scenarioInitializer.initialFunctionContentV2(action.parser, this.nodeId);
      action.content.parserData =
        this.customParsers.filter(item => item.parserId === customParserType)[0];
      this.$forceUpdate();
    },
    customParserSlotInput(action, slotId) {
      if (slotId === '-1') {
        action.content.slot = {};
      } else {
        action.content.slot = action.content.parserData.slotInfo.filter(
          slot => slot.slotId === slotId)[0];
      }
      this.$forceUpdate();
    },
    parserInput(action, { parser, source }) {
      action.parser = parser;
      action.source = source;
      action.funcName = parser;
      if (parser === 'reg_parser') {
        if (source === 'text') {
          action.funcName = 'regular_exp';
        } else if (source === 'global_info') {
          action.funcName = 'regular_exp_from_var';
        }
      } else if (parser === 'user_custom_parser') {
        if (source === 'text') {
          action.funcName = 'user_custom_parser';
        } else if (source === 'global_info') {
          action.funcName = 'user_custom_transform';
        }
      }
      action.content = scenarioInitializer.initialFunctionContentV2(action.funcName, this.nodeId);
      delete action.nluType;
      delete action.customParserType;
      delete action.dialogActParserType;
      this.$forceUpdate();
    },
    nluParserInput(action, { nluType, source }) {
      action.nluType = nluType;
      action.source = source;
      action.content = scenarioInitializer.initialFunctionContentV2(action.funcName, this.nodeId);
      switch (nluType) {
        case NLUTypeMap.ADDRESS: {
          action.content.tags = NLUParserMap.ADDRESS;
          break;
        }
        case NLUTypeMap.TIME: {
          action.content.tags = NLUParserMap.TIME_FUTURE;
          break;
        }
        case NLUTypeMap.MONEY: {
          action.content.tags = NLUParserMap.MONEY;
          break;
        }
        case NLUTypeMap.MOBILE_PHONE: {
          action.content.tags = NLUParserMap.MOBILE_PHONE;
          break;
        }
        case NLUTypeMap.PERSON_NAME: {
          action.content.tags = NLUParserMap.PERSON_NAME;
          break;
        }
        case NLUTypeMap.SELECT: {
          action.content.tags = NLUParserMap.SELECT_CUSTOMIZE_OPTIONS;
          this.$set(action.content, 'options', ['']);
          this.$set(action.content, 'fuzzy_match', true);
          action.content.has_context = true;
          break;
        }
        case NLUTypeMap.POLARITY: {
          action.content.tags = NLUParserMap.POLARITY;
          action.content.has_context = true;
          break;
        }
        default:
          break;
      }
      this.$forceUpdate();
    },
    setNluSelectOptionType(action, type) {
      const content = action.content;
      content.tags = type;
      delete content.options;
      delete content.option_key;
      if (type === NLUParserMap.SELECT_CUSTOMIZE_OPTIONS) {
        this.$set(content, 'options', ['']);
      }
      if (type === NLUParserMap.SELECT_OPTIONS_IN_KEY) {
        this.$set(content, 'option_key', '');
      }
    },
    renderOnlyParseSurname(tags) {
      if (tags === NLUParserMap.SURNAME) {
        return true;
      }
      return false;
    },
    onlyParseSurnameChange(action, onlyParseSurname) {
      action.content.tags = onlyParseSurname ? NLUParserMap.SURNAME : NLUParserMap.PERSON_NAME;
    },
    reloadTooltip() {
      if (this.$refs['input-content']) {
        this.$refs['input-content'].forEach((el) => {
          el.dispatchEvent(event.createEvent('tooltip-reload'));
        });
      }
    },
    changeToNormalEdge(originalEdgeType, index, newFuncName) {
      if (this.rules[index].funcName === newFuncName) return;
      this.rules[index].funcName = newFuncName;
      // initial content
      const content = scenarioInitializer.initialFunctionContentV2(newFuncName, this.nodeId);
      this.rules[index].content = content;

      // update parser options
      if (newFuncName === 'common_parser' ||
          newFuncName === 'task_parser' ||
          newFuncName === 'hotel_parser') {
        const options = this.entityModuleOptions(newFuncName);
        const selectRef = `selectTargetEntity_${index}`;
        if (this.$refs[selectRef] && this.$refs[selectRef].length > 0) {
          this.$refs[selectRef][0].$emit('updateOptions', options);
          content.tags.split(',').forEach((target) => {
            this.$refs[selectRef][0].$emit('select', target);
          });
        }
      }
    },
    onSelectTargetEntity(index, newValue) {
      this.rules[index].content.tags = newValue.join(',');
      // this.emitUpdate();
    },
    onSelectMapTableInput(index, newValue) {
      const newMapTable = newValue[0];
      if (this.rules[index].content.trans === newMapTable) return;
      this.rules[index].content.trans = newMapTable;
      // this.emitUpdate();
    },
    insertVarDropdown(id, obj, key) {
      const options = this.globalVarOptions.map(option => ({
        text: `${option.text}：${option.value}`,
        onclick: this.insertVarSelect.bind(this, obj, key, option.value),
      }));
      return {
        options,
        width: '542px',
      };
    },
    insertVarSelect(obj, key, value) {
      obj[key] = value;
      this.$forceUpdate();
      this.emitUpdate();
    },
    renderIntentDropdown(index) {
      let options = this.intentDropdown.options.map((option) => {
        const onclick = () => {
          this.rules[index].content = {
            module: 'intent_engine_2.0',
            intentName: option.name,
          };
        };
        return {
          ...option,
          onclick,
        };
      });
      // pre-pend a no intent option, trigger scenario when there is no intent matched
      const textNoIntent = this.$t('task_engine_v2.condition_block.option.no_intent');
      options = [
        {
          text: textNoIntent,
          onclick: () => {
            this.rules[index].content = {
              module: 'intent_engine_2.0',
              intentName: textNoIntent,
            };
          },
        },
        ...options,
      ];
      return {
        ...this.intentDropdown,
        options,
      };
    },
    emitUpdate() {
      const conditionBlock = {
        id: this.edge.id,
        edge_type: this.edgeType,
        edge_name: this.edgeName,
        to_node_id: this.toNode,
        to_node_labels: this.toNodeLabels,
        to_node_labels_enable: this.toNodeLabelsEnable,
        logic: this.selectedOption[0],
        actions: this.actions.map(action => ({
          source: action.source,
          function: {
            function_name: action.funcName,
            content: action.content,
            function_url: action.funcUrl,
          },
          type: action.type,
          parser: action.parser,
          nluType: action.nluType,
          customParserType: action.customParserType,
          dialogActParserType: action.dialogActParserType,
        })),
        condition_rules: this.rules.map(rule => ({
          source: rule.source,
          function: {
            function_name: rule.funcName,
            content: rule.content,
          },
        })),
      };
      this.$nextTick(() => {
        conditionBlock.valid = this.isValid();
        // console.log(this.isValid());
        this.$emit('update', conditionBlock);
      });
    },
    entityModuleOptions(parser) {
      const entityModuleOptions = optionConfig.getEntityModuleOptionsMap();
      return entityModuleOptions[parser];
    },
    getFuncOptions(source) {
      return this.funcOptionMap[source];
    },
    onSelectGoto(toNode) {
      if (toNode === 'add_new_dialogue_node') {
        const newNodeID = scenarioInitializer.guid_sort();
        this.$emit('addNewDialogueNode', newNodeID);
        this.toNode = newNodeID;
      } else {
        this.toNode = toNode;
      }
    },
    addConditionActionClick(e, flag) {
      // if (this[flag]) {
      //   e.target.dispatchEvent(new Event('dropdown-hide'));
      // }
      this[flag] = true;
    },
    addNLUSelectOption(action) {
      if (action.content.options) {
        action.content.options.push('');
      } else {
        this.$set(action.content, 'options', ['']);
      }
      this.$forceUpdate();
    },
    isValid() {
      for (let i = 0; i < this.dropRefs.length; i += 1) {
        const el = this.dropRefs[i];
        for (let j = 0; j < el.length; j += 1) {
          if (el[j].checkedValues.length === 0) {
            return false;
          }
        }
      }
      for (let i = 0; i < this.inputContentRefs.length; i += 1) {
        const el = this.inputContentRefs[i];
        for (let j = 0; j < el.length; j += 1) {
          if (el[j].checkedValues.length === 0) {
            return false;
          }
        }
      }
      return general.isInputContentsValid(this.$refs['input-content']);
    },
    showToolTip() {
      general.showInputContentTooltip(this.$refs['input-content']);
      if (this.inputContentRefs.length > 0) {
        this.inputContentRefs.forEach((item) => {
          item.forEach((el) => {
            if (el.checkedValues.length === 0) {
              el.$el.dispatchEvent(event.createEvent('tooltip-show'));
            }
          });
        });
      }
      if (this.dropRefs.length > 0) {
        this.dropRefs.forEach((item) => {
          item.forEach((el) => {
            if (el.checkedValues.length === 0) {
              el.$el.dispatchEvent(event.createEvent('tooltip-show'));
            }
          });
        });
      }
    },
    getTaskConfigInfo() {
      const that = this;
      this.$api.taskConfig()
        .then((data) => {
          that.hadCustomUrl = data.task_engine_v2.enable_custom_url;
        });
    },
    updateTags(tags) {
      this.toNodeLabels = tags;
    },
    getTagList() {
      this.origToNodeLabelsList = getTagList.getTagList(this.modelDAta);
    },
    addlitext(idx) {
      this.$refs.tonoderef.addTagBySelector(idx);
    },
    // 获取添加预录音
    getVoiceOption() {
      const enterpriseIid = this.enterpriseID;
      const scenarioId = this.scenarioId;
      this.$api.getVoiceOption(enterpriseIid, scenarioId)
      .then((res) => {
        const data = res.data;
        if (data.length <= 0) {
          return;
        }
        data.forEach((item, index) => {
          this.voiceFileOptions.push({
            text: item.name,
            value: index,
          });
        });
      })
      .catch((error) => {
        console.log(error);
      });
    },
    // 初始“新增动作”该下拉框数据
    getActionDropDownOption() {
      const actionOptions = optionConfig.getActionOptions(this);
      if (this.voiceSet) {
        actionOptions.push({
          text: this.$t('task_engine_v2.condition_action_block.action.response_voice'),
          value: ActionType.ResponseVoice,
        });
      }
      const actionDropdownOptions = actionOptions.map(option => ({
        ...option,
        onclick: () => {
          this.addAction(option.value);
          this.toggleAddAction = false;
        },
      }));
      this.actionDropdown = {
        width: '150px',
        alignLeft: true,
        options: actionDropdownOptions,
      };
    },
  },
  beforeMount() {
    this.getTaskConfigInfo();
    if (this.voiceSet) {
      this.getVoiceOption();
    }
    this.getActionDropDownOption();
  },
  mounted() {
    this.$on('showToolTip', this.showToolTip);
    this.$api.getIntentsDetail().then((intents) => {
      this.intentDropdown.options = intents.map(intent => ({
        ...intent,
        text: intent.name,
      }));
    });
    this.appId = this.robotID;
    const that = this;
    this.$api.getNerParserList(this.appId).then((data) => {
      that.customParsers = data.data;
      that.customParserOptions = that.customParsers.map(parser => ({
        text: parser.name,
        value: parser.parserId,
      }));
    });
    this.$api.getDialogActParserList(this.appId).then((data) => {
      that.dialogActParsers = data.data;
      that.dialogActParserOptions = that.dialogActParsers.map(parser => ({
        text: parser.classifierName,
        value: parser.classifierId,
      }));
    });
    this.getTagList();
    this.dropDownUpdate();
  },
};
</script>

<style lang="scss" scoped>
.condition-action-block {
  position: relative;
  background: #f7f7f7;
  border-radius: 2px;
  @include font-14px();
  cursor: move;
  padding-bottom: 10px;
  background:rgba(247,247,247,1);
  .add-new-line-wrap{
    position: absolute;
    bottom: -15px;
    height: 15px;
    box-sizing: border-box;
    width: 100%;
  }
  .dropdown-select {
    background-color: white;
  }
  .headerSticky{
    position: sticky;
    top: 0px!important;
  }
  .header {
    position: sticky;
    top: 50px;
    z-index: 1;
    padding: 10px 20px;
    color: $color-font-mark;
    display: flex;
    align-items: center;
    // box-shadow: inset 0 -1px 0 0 #dbdbdb;
    background:rgba(238,238,238,1);
    button {
      border: none;
      outline: none;
      background-color: transparent;
      display: flex;
      align-items: center;
      @include font-14px();
      cursor: pointer;
      padding: 0;
    }
    .add {
      color: #3d80ff;
      &:not(:last-child) {
        margin-right: 20px;
      }
      .arrow {
        width: 12px;
        height: 12px;
        margin-left: 6px;
        transition: transform .5s ease-in-out;
        &.rotate180 {
          transform: rotate(180deg);
        }
      }
    }
    .info {
      font-size: 10px;
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      .to-node {
        text-overflow: ellipsis;
        overflow: hidden;
        display: inline-block;
        max-width: 120px;
        white-space: nowrap;
      }
    }
    .delete {
      color: #f25c62;
      margin: 0 10px;
    }
    .copy{
      margin: 0 10px;
    }
    .toggle {
      transform: rotate(90deg);
      transition: transform .5s ease-in-out;
      &.collapse {
        transform: rotate(270deg);
      }
      img {
        width: 24px;
        height: 24px;
      }
    }
  }
  .normal-edge {
    position: relative;
    padding: 0 10px;
    margin: 10px 0;
    border-bottom: 1px solid rgba(219,219,219,1);
    .edge-content{
      background: transparent;
      width: 100%;
      padding: 0 10px;
    }
    .title {
      font-weight: 500;
      color: rgba(59,59,59,1);
      line-height: 28px;
      height: 28px;
      border-bottom: 2px solid #f7f7f7;
    }
    .dropdown-select-container {
      color: rgba(146,146,146,1);
      font-weight: 400;
      margin: 10px 38px;
      display: flex;
      align-items: center;
      .dropdown-select {
        margin: 0 10px;
      }
    }
  }
  .block {
    border-radius: 1px;
    background-color: #eeeeee;
    color: $color-font-normal;
    position: relative;
    padding: 5px 0;
    margin: 10px 0;
    &:last-of-type {
      margin-bottom: 0;
    }
    .row {
      padding: 5px 42px 5px 0;
      display: flex;
      align-items: center;
      .label {
        text-align: right;
        width: 100px;
        margin-right: 10px;
        &:not(:first-of-type) {
          margin-left: 10px;
          width: auto;
        }
      }
      .tags-container{
        height: 36px;
      }
      .taglistul{
        margin: 5px 10px;
        overflow: auto;
        .taglistli{
          float: left;
          margin-right: 10px;
          margin-bottom: 5px;
          padding: 5px;
          height: 24px;
          background: rgb(238, 238, 238);
          font-size: 12px;
          .addicon{
            width: 14px;
            height: 14px;
            opacity: 0.7;
          }
          .litext{
            display: inline-block;
            font-size: 12px;
            position: relative;
            top: -2px;
            line-height: 14px;
          }
        }
      }
      .dropdown-select {
        &:not(:first-of-type) {
          margin-left: 10px;
        }
        flex: 1;
        background-color: white;
      }
      .trash {
        align-self: flex-start;
        position: absolute;
        right: 10px;
        cursor: pointer;
      }
      .dropdown-container {
        flex: 1;
        .input-content {
          width: 100%;
        }
      }
    }
    .input-content {
      flex: 1;
    }
  }
  .add-new-row {
    color: $color-primary;
    border: none;
    background-color: transparent;
    padding: 0;
    @include font-14px();
    cursor: pointer;
  }
  .delete-button {
    width: 70px;
    height: 32px;
    background-color: $color-font-disabled;
    padding: 0;
    border: none;
    font-size: 12px;
    margin-left: 8px;
    color: white;
    cursor: pointer;
    &.red {
      background-color: $color-error;
    }
  }
}
.newLinepopContent{
  font-size: 10px;
  font-weight: 400;
  line-height: 20px;
  color: rgba(84,84,84,1);
  cursor: pointer;
  .title{
    font-size: 12px;
    line-height: 16px;
    color: #868686;
    margin-bottom: 10px;
  }
  .option{
    font-size: 14px;
    line-height: 34px;
    &:hover{
      color: rgba(24,117,240,1);
    }
  }
}
.small-tip{
    font-size: 12px;
    display: inline-block;
    height: 15px;
    width:66px;
    line-height: 15px;
    background: rgba(216,216,216,1);
    border-radius: 1px;
    text-align: center;
    position: relative;
    .addvoice{
      cursor: pointer;
    }
    .addChoice{
      position: absolute;
      display: flex;
      flex-direction: column;
      background: #fff;
      width: 152px;
      box-shadow:0px 1px 6px 0px rgba(86,86,86,0.5);
      padding: 10px 8px 10px;
      border-radius:1px;
      z-index: 1;
    }
    .addchoicebutton{
      display: flex;
      margin-top: 25px;
      justify-content: space-around;
    }
  }
  .add-condition-rule{
    .addbtn{
      border: none;
      outline: none;
      background-color: transparent;
      display: flex;
      align-items: center;
      @include font-14px();
      cursor: pointer;
      padding: 0;
      height:34px;
      line-height: 34px;
      color: $color-primary;
    }
  }
  .blockTO{
    background: #f7f7f7!important;
  }
  .taglabel{
    width: 30px!important;
  }
  .edit-icon{
    margin-left:8px;
    cursor: pointer;
  }
  /* 去掉el-popover组建的最小宽度*/
  .el-popover{
    min-width: 0!important;
    padding:  6px !important;
  }
.block-instruction{
  margin: 20px 0 10px 0;
}
</style>
