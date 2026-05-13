<template>
<div id="setting-edit-tab">
  <div class="header-toggle">
    <!-- <div class="label-header">{{$t('task_engine_v2.setting_edit_tab2.node_name')}}</div>
    <input class="input-rounded" ref="input-content" v-tooltip="tooltip"
      v-model="nodeName"
      @focus="onInputFocus"/> -->
      <div>
        <span v-t="'task_engine_v2.setting_edit_tab2.help_config'"></span>
      </div>
      <toggle v-model="isUsingResponse" :size="'medium'" :showLabel="true" :label="toggleLabel"></toggle>
    <!-- <input class="input-rounded" ref="input-content" v-tooltip="tooltip"
      @focus="onInputFocus"/> -->
  </div>
  <div class="block fill-h reset-margin">
    <!-- <div class="label-header">{{$t('task_engine_v2.setting_edit_tab2.response_setting')}}</div> -->
    <div class="response-setting" :class="{'fill-h': !isUsingResponse}">
      <!-- <div class="block">
        <label>
          <input type="checkbox" v-model="isUsingResponse"/>
          <span v-t="'task_engine_v2.setting_edit_tab2.enable_response'"></span>
        </label>
      </div> -->
      <span class="skip-response" v-if="!isUsingResponse" v-t="'task_engine_v2.setting_edit_tab2.skip_response'"></span>
      <template v-else>
        <!-- 预设话术-->
        <div class="block">
          <div class="title-wrapper">
            <div class="label-header">{{$t('task_engine_v2.setting_edit_tab2.default_q')}}</div>
            <icon class="icon" iconType="info" :size="16" enableHover v-tooltip="defaultQTooltip"></icon>
            <span  v-if="voiceSet" class="small-tip" style="font-size: 12px;" @click="showAddChoice('defaultQ')">
            <span class="addvoice" v-t="'task_engine_v2.setting_edit_tab2.add_prerecording'"></span>
            <div v-show="defaultQ" class="addChoice">
              <dropdown-select
                class="select"
                ref="selectElseThenGoto"
                :value="[]"
                :placeholder="placeholder"
                @input="receive"
                :options="voiceFileOptions"
                :fixedListWidth="false"
                :showCheckedIcon="false"
                :showSearchBar="false"
                width="200px"
                :inputBarStyle="selectStyle"/>
              <div class="addchoicebutton">
                <text-button button-type="default"  @click.stop="cancle('defaultQ')">{{ $t('task_engine_v2.global_TTSinfo.cancel')}}</text-button>
                <text-button button-type="primary" @click.stop="ensure('defaultQ')">{{ $t('task_engine_v2.global_TTSinfo.ensure')}}</text-button>
              </div>
            </div>
          </span>
          </div>
          <textarea
            class="text-response"
            ref="defaultQ"
            :placeholder="$t('task_engine_v2.setting_edit_tab2.default_q_placeholder')"
            v-model="initialResponse"
            v-tooltip="tooltip"
            @focus="onInputFocus">
          </textarea>
        </div>
        <!-- 解析失败 -->
        <!-- <div class="block">
          <div class="title-wrapper">
            <div class="label-header">{{$t('task_engine_v2.setting_edit_tab2.parse_fail_q')}}</div>
            <icon class="icon" iconType="info" :size="16" enableHover v-tooltip="failQTooltip"></icon>
            <span v-if="voiceSet" class="small-tip" style="font-size: 12px;" @click="showAddChoice('fail-textarea')">
            <span class="addvoice" v-t="'task_engine_v2.setting_edit_tab2.add_prerecording'"></span>
            <div v-show="failTextarea" class="addChoice">
              <dropdown-select
                class="select"
                ref="selectElseThenGoto"
                :value="[]"
                :placeholder="placeholder"
                @input="receive"
                :options="voiceFileOptions"
                :fixedListWidth="false"
                :showCheckedIcon="false"
                :showSearchBar="false"
                width="200px"
                :inputBarStyle="selectStyle"/>
              <div class="addchoicebutton">
                <text-button button-type="default"  @click.stop="cancle('fail-textarea')">{{ $t('task_engine_v2.global_TTSinfo.cancel')}}</text-button>
                <text-button button-type="primary" @click.stop="ensure('fail-textarea')">{{ $t('task_engine_v2.global_TTSinfo.ensure')}}</text-button>
              </div>
            </div>
          </span>
          </div>
          <textarea
            class="text-response"
            ref="fail-textarea"
            :placeholder="$t('task_engine_v2.setting_edit_tab2.fail_q_placeholder')"
            v-model="failureResponse"
            v-tooltip="tooltip"
            @focus="onInputFocus">
          </textarea>
        </div> -->
        <template v-if="showAdvancedSetting">
           <!-- 重复话术 -->
          <div class="block">
            <div class="title-wrapper">
              <div class="label-header">{{$t('task_engine_v2.setting_edit_tab2.repeat_q')}}</div>
              <icon class="icon" iconType="info" :size="16" enableHover v-tooltip="repeatQTooltip"></icon>
              <span v-if="voiceSet" class="small-tip" style="font-size: 12px;" @click="showAddChoice('repeatQ')">
            <span class="addvoice" v-t="'task_engine_v2.setting_edit_tab2.add_prerecording'"></span>
            <div v-show="repeatQ" class="addChoice">
              <dropdown-select
                class="select"
                ref="selectElseThenGoto"
                :value="[]"
                :placeholder="placeholder"
                @input="receive"
                :options="voiceFileOptions"
                :fixedListWidth="false"
                :showCheckedIcon="false"
                :showSearchBar="false"
                width="200px"
                :inputBarStyle="selectStyle"/>
              <div class="addchoicebutton">
                <text-button button-type="default"  @click.stop="cancle('repeatQ')">{{ $t('task_engine_v2.global_TTSinfo.cancel')}}</text-button>
                <text-button button-type="primary" @click.stop="ensure('repeatQ')">{{ $t('task_engine_v2.global_TTSinfo.ensure')}}</text-button>
              </div>
            </div>
          </span>
            </div>
            <textarea
              class="text-response"
              ref="repeatQ"
              :placeholder="$t('task_engine_v2.setting_edit_tab2.repeat_q_placeholder')"
              v-model="repeatResponse">
            </textarea>
          </div>
          <!-- 兜回话术 -->
          <div class="block">
            <div class="title-wrapper">
              <div class="label-header">{{$t('task_engine_v2.setting_edit_tab2.rewind_q')}}</div>
              <icon class="icon" iconType="info" :size="16" enableHover v-tooltip="rewindQTooltip"></icon>
              <span v-if="voiceSet" class="small-tip" style="font-size: 12px;" @click="showAddChoice('rewindQ')">
            <span class="addvoice" v-t="'task_engine_v2.setting_edit_tab2.add_prerecording'"></span>
            <div v-show="rewindQ" class="addChoice">
              <dropdown-select
                class="select"
                ref="selectElseThenGoto"
                :value="[]"
                :placeholder="placeholder"
                @input="receive"
                :options="voiceFileOptions"
                :fixedListWidth="false"
                :showCheckedIcon="false"
                :showSearchBar="false"
                width="200px"
                :inputBarStyle="selectStyle"/>
              <div class="addchoicebutton">
                <text-button button-type="default"  @click.stop="cancle('rewindQ')">{{ $t('task_engine_v2.global_TTSinfo.cancel')}}</text-button>
                <text-button button-type="primary" @click.stop="ensure('rewindQ')">{{ $t('task_engine_v2.global_TTSinfo.ensure')}}</text-button>
              </div>
            </div>
          </span>
            </div>
            <textarea
              class="text-response"
              ref="rewindQ"
              :placeholder="$t('task_engine_v2.setting_edit_tab2.rewind_q_placeholder')"
              v-model="rewindResponse">
            </textarea>
          </div>
        </template>
        <button class="advanced_setting" @click.stop="showAdvancedSetting = !showAdvancedSetting">
          {{ showAdvancedSetting ? $t('task_engine_v2.setting_edit_tab2.hide_advanced_setting') : $t('task_engine_v2.setting_edit_tab2.advanced_setting')}}
        </button>
      </template>
    </div>
  </div>
</div>
</template>

<script>
import { mapGetters } from 'vuex';
import api from '@/modules/TaskEngine/_api/nerFactoryDal';
import event from '@/utils/js/event';
import general from '@/modules/TaskEngine/_utils/general';
import optionConfig from '../_utils/optionConfig';

export default {
  props: {
    settingTab: {
      type: Object,
      required: true,
    },
    globalVarOptions: {
      type: Array,
      required: true,
    },
    nodeType: {
      type: String,
      required: true,
    },
    scenarioId: {
      type: String,
      required: true,
    },
  },
  api: [api],
  data() {
    const settingTab = this.settingTab;
    // render entityModuleOptions
    const entityModuleOptionsMap = optionConfig.getEntityModuleOptionsMap();
    return {
      nodeName: settingTab.nodeName,
      parser: settingTab.parser,
      targetEntities: settingTab.targetEntities,
      skipIfKeyExist: settingTab.skipIfKeyExist,
      initialResponse: settingTab.initialResponse,
      // failureResponse: settingTab.failureResponse,
      repeatResponse: settingTab.repeatResponse,
      rewindResponse: settingTab.rewindResponse,
      parseFromThisNode: settingTab.parseFromThisNode,
      entityModuleOptions: entityModuleOptionsMap[this.parser],
      varDropdown: undefined,
      tooltip: {
        msg: this.$t('task_engine_v2.err_empty'),
        eventOnly: true,
        errorType: true,
        alignLeft: true,
        absolute: true,
      },
      showAdvancedSetting: false,
      defaultQTooltip: {
        msg: this.$t('task_engine_v2.setting_edit_tab2.default_q_hint'),
      },
      failQTooltip: {
        msg: this.$t('task_engine_v2.setting_edit_tab2.fail_q_hint'),
      },
      repeatQTooltip: {
        msg: this.$t('task_engine_v2.setting_edit_tab2.repeat_q_hint'),
      },
      rewindQTooltip: {
        msg: this.$t('task_engine_v2.setting_edit_tab2.rewind_q_hint'),
      },
      isUsingResponse: !settingTab.skipDialogue,
      defaultQ: false,
      failTextarea: false,
      repeatQ: false,
      rewindQ: false,
      selectStyle: {
        height: '36px',
        'border-radius': '5px',
      },
      voiceFileOptions: [],
      placeholder: this.$t('task_engine_v2.voice_setting_tab.please_select'),
      toggleLabel: {
        on: '开',
        off: '关',
      },
    };
  },
  computed: {
    ...mapGetters([
      'enterpriseID',
      'voiceSet',
    ]),
    result() {
      const result = {
        nodeName: this.nodeName,
        parser: this.parser,
        targetEntities: this.targetEntities,
        skipIfKeyExist: this.skipIfKeyExist,
        initialResponse: this.initialResponse,
        // failureResponse: this.failureResponse,
        repeatResponse: this.repeatResponse,
        rewindResponse: this.rewindResponse,
        parseFromThisNode: this.parseFromThisNode,
        skipDialogue: !this.isUsingResponse,
      };
      // console.log(result);
      return result;
    },
  },
  watch: {
    result: {
      handler() {
        this.$emit('update', this.result);
        this.$emit('update:valid', this.isValid());
      },
      deep: true,
    },
  },
  methods: {
    receive(res) {
      this.speechvalue = res[0];
    },
    showAddChoice(ref) {
      if (ref === 'defaultQ') {
        this.defaultQ = true;
      } else if (ref === 'fail-textarea') {
        this.failTextarea = true;
      } else if (ref === 'repeatQ') {
        this.repeatQ = true;
      } else if (ref === 'rewindQ') {
        this.rewindQ = true;
      }
    },
    cancle(ref) {
      if (ref === 'defaultQ') {
        this.defaultQ = false;
      } else if (ref === 'fail-textarea') {
        this.failTextarea = false;
      } else if (ref === 'repeatQ') {
        this.repeatQ = false;
      } else if (ref === 'rewindQ') {
        this.rewindQ = false;
      }
    },
    ensure(ref) {
      if (ref === 'defaultQ') {
        this.defaultQ = false;
      } else if (ref === 'fail-textarea') {
        this.failTextarea = false;
      } else if (ref === 'repeatQ') {
        this.repeatQ = false;
      } else if (ref === 'rewindQ') {
        this.rewindQ = false;
      }
      this.voiceFileOptions.forEach((item) => {
        if (item.value === this.speechvalue) {
          const areaField = this.$refs[ref];
          // IE浏览器
          if (document.selection) {
            areaField.focus();
            const sel = document.selection.createRange();
            sel.text = item.text;
          } else if (areaField.selectionStart) {
            const startPos = areaField.selectionStart;
            const endPos = areaField.selectionEnd;
            const restoreTop = areaField.scrollTop;
            if (ref === 'defaultQ') {
              this.initialResponse = `${this.initialResponse.substring(0, startPos)}[[${item.text}]]${this.initialResponse.substring(endPos, this.initialResponse.length)}`;
            } else if (ref === 'fail-textarea') {
              this.failureResponse = `${this.failureResponse.substring(0, startPos)}[[${item.text}]]${this.failureResponse.substring(endPos, this.failureResponse.length)}`;
            } else if (ref === 'repeatQ') {
              this.repeatResponse = `${this.repeatResponse.substring(0, startPos)}[[${item.text}]]${this.repeatResponse.substring(endPos, this.repeatResponse.length)}`;
            } else if (ref === 'rewindQ') {
              this.rewindResponse = `${this.rewindResponse.substring(0, startPos)}[[${item.text}]]${this.rewindResponse.substring(endPos, this.rewindResponse.length)}`;
            }
            if (restoreTop > 0) {
              areaField.scrollTop = restoreTop;
            }
            areaField.focus();
            areaField.selectionStart = startPos + item.text.length;
            areaField.selectionEnd = startPos + item.text.length;
          } else {
            if (ref === 'defaultQ') {
              this.initialResponse = `[[${item.text}]]${this.initialResponse}`;
            } else if (ref === 'fail-textarea') {
              this.failureResponse = `[[${item.text}]]${this.failureResponse}`;
            } else if (ref === 'repeatQ') {
              this.repeatResponse = `[[${item.text}]]${this.repeatResponse}`;
            } else if (ref === 'rewindQ') {
              this.rewindResponse = `[[${item.text}]]${this.rewindResponse}`;
            }
            areaField.focus();
          }
        }
      });
    },
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
    onInputFocus(evt) {
      evt.target.dispatchEvent(event.createEvent('tooltip-hide'));
    },
    isValid() {
      return general.isInputContentsValid(this.$refs['input-content']);
    },
    showToolTip() {
      general.showInputContentTooltip(this.$refs['input-content']);
    },
  },
  mounted() {
    this.$on('showToolTip', this.showToolTip);
    // 预录音控制变量
    if (this.voiceSet) {
      this.getVoiceOption();
    }
  },
};
</script>

<style lang="scss" scoped>
#setting-edit-tab {
  display: flex;
  flex-direction: column;
  padding: 0 20px;
  height: 100%;
  .header-toggle{
    display: flex;
    flex-direction: row;
    height: 48px;
    line-height: 48px;
    align-items: center;
    justify-content: space-between;
    background: rgba(247,247,247,1);
    border-radius: 2px;
    border: 1px solid rgba(219,219,219,1);
    padding: 0 20px;
    margin-bottom: 20px;
  }
  .skip-response {
    position: absolute;
    color: $color-font-normal;
    @include font-14px();
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .fill-h {
    height: 100%;
  }
  .response-setting {
    position: relative;
    background-color: $color-disabled;
    padding: 20px;
    border-radius: 2px;
    border: 1px solid rgba(219,219,219,1);
    .advanced_setting {
      color: $color-primary;
      border: none;
      background-color: $color-disabled;
      padding: 0;
      @include font-14px();
    }
    .title-wrapper {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      position: relative;
      .label-header {
        margin-bottom: 0;
      }
      .icon {
        margin-left: 5px;
      }
      .small-tip{
        font-size: 12px;
        height: 15px;
        width:96px;
        color: rgba(24,117,240,1);
        line-height: 15px;
        border-radius: 1px;
        text-align: center;
        position: absolute;
        top: 0;
        right: 0;
        .addvoice{
          cursor: pointer;
        }
        .addChoice{
          position: absolute;
          right: 0;
          top: 18px;
          display: flex;
          flex-direction: column;
          background: #fff;
          width: 152px;
          box-shadow:0px 1px 6px 0px rgba(86,86,86,0.5);
          padding: 10px 8px 10px;
          border-radius:1px;
        }
        .addchoicebutton{
          display: flex;
          margin-top: 25px;
          justify-content: space-around;
        }
      }
    }
    label {
      margin-right: auto;
      color: $color-font-normal;
      @include font-14px();
    }
  }
  .block {
    &.reset-margin {
      margin: 0;
    }
    display: flex;
    flex-direction: column;
    padding: 0px 0px 20px 0px;
    .label-header {
      @include font-14px();
      color: $color-font-active;
      margin-bottom: 10px;
    }
    .input-rounded {
      height: 32px;
      background: white;
      &:disabled{
        background: #F3F7F9;
      }
    }
    .text-response {
      height: 100px;
      color: $color-font-normal;
    }
  }
  input[type=checkbox]{
    @include general-checkbox();
  }
}
</style>
