<template>
  <div id="voice-setting-tab">
    <!-- 头 打断配置 -->
    <div class="block ">
      <div class="row">
        <div class="row-title">
          {{ $t('task_engine_v2.voice_setting_tab.turn_arrange') }}
        </div>
        <div class="row-right">
          <el-radio v-model="interruptRadio" label = '1' >{{ $t('task_engine_v2.voice_setting_tab.use_default') }}</el-radio>
          <el-radio  v-model='interruptRadio' label = '2' >{{ $t('task_engine_v2.voice_setting_tab.custom') }}</el-radio>
        </div>
      </div>
      <div class="row" v-show="interruptRadio === '2'">
        <div class="row-title">
          {{ $t('task_engine_v2.voice_setting_tab.bargein_status') }}
        </div>
        <div class="row-right">
          <toggle v-model="custombargeinValue" :size="'small'" :showLabel="true" :label="toggleLabel"></toggle>
          <span>{{customvoiceEnableText}}</span>
        </div>
      </div>
      <div class="row" v-show="interruptRadio === '1'">
        <div class="row-title">
          {{ $t('task_engine_v2.voice_setting_tab.bargein_status') }}
        </div>
        <div class="row-right defaultRight">
          <span>{{bargeinValue ? '开启' : '关闭'}}</span>
          <span>({{voiceEnableText}})</span>
        </div>
      </div>
      <div class="row" v-show="interruptRadio === '2' && custombargeinValue" >
        <div class="row-title"> {{ $t('task_engine_v2.voice_setting_tab.interrupt_speech') }}</div>
        <div class="row-right">
          <input ref="bargein" class="input-width" v-tooltip="tooltip" type="text" placeholder="好的，您说" v-model="custombargeinSpeech" @focus="onInputFocus">
        </div>
      </div>
      <div class="row" v-show="interruptRadio === '1' && bargeinValue" >
        <div class="row-title"> {{ $t('task_engine_v2.voice_setting_tab.interrupt_speech') }}</div>
        <div class="row-right defaultRight">
          {{bargeinSpeech}}
        </div>
      </div>
    </div>



    <!-- 中间 -->
    <div class="block" >
      <div class="row">
        <div class="row-title">
          {{ $t('task_engine_v2.voice_setting_tab.wait_for_arrange') }}
        </div>
        <div class="row-right">
          <el-radio v-model="radio" label = '1' >{{ $t('task_engine_v2.voice_setting_tab.use_default') }}</el-radio>
          <el-radio  v-model='radio' label = '2' >{{ $t('task_engine_v2.voice_setting_tab.custom') }}</el-radio>
        </div>
      </div>
      <div class="row">
        <div class="row-title">{{ $t('task_engine_v2.voice_setting_tab.bargein_status') }}</div>
        <div class="row-right" v-show='radio === "2"'>
          <toggle v-model="customsilenceSwitch" :size="'medium'" :showLabel="true" :label="toggleLabel"></toggle>
        </div>
        <div class="row-right defaultRight" v-show="radio === '1'">{{silenceSwitch? '开启':'关闭'}}</div>
      </div>
      <div class="row" v-if="radio === '1'? silenceSwitch : customsilenceSwitch">
        <div class="row-title">
          {{ $t('task_engine_v2.voice_setting_tab.silenceDuration') }}
        </div>
        <div class="row-right" v-show='radio === "2"'>
          <input type="text" ref="silence-1" v-tooltip="tooltip" style="width:281px;" v-model="customsilenceDuration"  @focus="onInputFocus">
          <span class="oms">ms</span>
        </div>
        <div class="row-right defaultRight" v-show="radio === '1'">
          {{silenceDuration}}ms
        </div>
      </div>
      <div class="row" v-if="radio === '1'? silenceSwitch : customsilenceSwitch">
        <div class="row-title">
          <span>{{ $t('task_engine_v2.voice_setting_tab.silenceSpeech')}}</span>
        </div>
        <div class="row-right defaultRight" v-show='radio === "1"'>
          <span >
            {{silenceSpeech}}
          </span>
        </div>
        <div class="row-right" v-show='radio === "2"'>
          <span  class="small-tip" style="font-size: 12px;" @click="showAddChoice('wait')">
            <span class="addvoice">{{ $t('task_engine_v2.voice_setting_tab.add_prerecording')}}</span>
            <div v-show="waitChoiceFlag" class="addChoice">
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
                <text-button button-type="default"  @click.stop="cancle('wait')">{{ $t('task_engine_v2.voice_setting_tab.cancel')}}</text-button>
                <text-button button-type="primary" @click.stop="ensure('wait')">{{ $t('task_engine_v2.voice_setting_tab.ensure')}}</text-button>
              </div>
            </div>
          </span>
        </div>
      </div>
      <div class="voicearea"  v-show='radio === "2" && customsilenceSwitch'>
        <textarea ref="silence-2" v-tooltip="tooltip" @focus="onInputFocus"  v-model="customsilenceSpeech" ></textarea>
      </div>
      <div class="row" v-if="radio === '1'? silenceSwitch : customsilenceSwitch">
        <div class="label label-margin-left">
          {{ $t('task_engine_v2.voice_setting_tab.continuous_exceedance')}}
        </div>
        <span v-show='radio === "1"' style="margin: 0 10px;">{{exceedNum}}</span>
        <input  ref="silence-3" v-show='radio === "2"' type="text" v-model="customexceedNum" class="input-limit" @focus="onInputFocus" v-tooltip="tooltip"/>
        <div class="label">
          {{ $t('task_engine_v2.voice_setting_tab.ecxeedtime')}}
        </div>
        <div class="label label-margin-left">
          {{ $t('task_engine_v2.voice_setting_tab.end_dialogue')}}
        </div>
      </div>
      <div class="row" style="margin-bottom: 0px;" v-if="radio === '1'? silenceSwitch : customsilenceSwitch">
        <div class="row-title">
          {{ $t('task_engine_v2.voice_setting_tab.silence_stopSpeech')}}
        </div>
        <div class="row-right defaultRight" v-show="radio === '1'">
          <span>
           {{stopSpeech}}
          </span>
        </div>
        <div class="row-right" v-show="radio === '2'">
          <span  class="small-tip" style="margin-top:4px;" @click="showAddChoice('stop')">
            <span class="addvoice" v-t="'task_engine_v2.global_TTSinfo.add_prerecording'"></span>
            <div v-show="stopChoiceFlag" class="addChoice">
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
                <text-button button-type="default"  @click.stop="cancle('stop')">{{ $t('task_engine_v2.global_TTSinfo.cancel')}}</text-button>
                <text-button button-type="primary" @click.stop="ensure('stop')">{{ $t('task_engine_v2.global_TTSinfo.ensure')}}</text-button>
              </div>
            </div>
          </span>
        </div>
      </div>
      <div class="voicearea" style="border: none" v-if="radio === '2' && customsilenceSwitch">
        <textarea  ref="silence-4"  v-model="customstopSpeech" @focus="onInputFocus" v-tooltip="tooltip"/>
      </div>
    </div>

    <!-- 静音检测时间 -->
    <div class="block">
      <div class="row">
        <div class="row-title">
          <el-tooltip class="item" effect="dark" :content="SpeechTimeOutContent" placement="top">
            <i class="el-icon-warning-outline"></i>
          </el-tooltip>
          {{ $t('task_engine_v2.voice_setting_tab.mute_testtime')}}
        </div>
        <div class="row-right">
          <el-radio v-model="vadradio" label = '1' >{{ $t('task_engine_v2.voice_setting_tab.use_default') }}</el-radio>
          <el-radio  v-model='vadradio' label = '2' >{{ $t('task_engine_v2.voice_setting_tab.custom') }}</el-radio>
        </div>
      </div>
      <div class="row">
        <div class="row-title">
           {{ $t('task_engine_v2.voice_setting_tab.mute_time')}}
        </div>
        <div class="row-right defaultRight" v-show="vadradio === '1'">
          <span>
            {{vadValue}}ms
          </span>
        </div>
        <div class="row-right" v-show="vadradio === '2'">
          <input ref="vad" type="text" style="width:281px;" v-model="customvadValue" @focus="onInputFocus" v-tooltip="tooltip"/>
          <span class="oms">ms</span>
        </div>
      </div>
    </div>

    <!-- VSP设定-->
    <div class="block">
      <div class="row">
        <div class="row-title">
          <el-tooltip class="item" effect="dark" :content="vspContent" placement="top">
            <i class="el-icon-warning-outline"></i>
          </el-tooltip>
          {{ $t('task_engine_v2.voice_setting_tab.vsp_setting')}}
        </div>
        <div class="row-right">
          <el-radio v-model="VSPradio" label = '1' >{{ $t('task_engine_v2.voice_setting_tab.use_default') }}</el-radio>
          <el-radio  v-model='VSPradio' label = '2' >{{ $t('task_engine_v2.voice_setting_tab.custom') }}</el-radio>
        </div>
      </div>
      <div class="row">
        <div class="row-title">
          {{ $t('task_engine_v2.voice_setting_tab.parameter')}}
        </div>
        <div class="row-right defaultRight" v-show="VSPradio === '1'">
          <span>
            {{vspValue}}
          </span>
        </div>
        <div class="row-right" v-show="VSPradio === '2'">
          <input type="text" v-tooltip="tooltip" style="width:281px;" v-model="customvspValue" ref="vsp" @focus="onInputFocus"/>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import event from '@/utils/js/event';
import Toggle from '@/components/basic/Toggle';
import api from '@/modules/TaskEngine/_api/nerFactoryDal';
import general from '@/modules/TaskEngine/_utils/general';

export default {
  components: {
    Toggle,
  },
  api: [api],
  props: {
    nodeId: {
      type: String,
      required: true,
    },
    ttsInfo: {
      type: Object,
    },
    scenarioId: {
      type: String,
      required: true,
    },
  },
  computed: {
    ...mapGetters([
      'enterpriseID',
      'globalTTSinfo',
    ]),
  },
  data() {
    return {
      bargeinDefault: true,
      bargeinValue: '',
      bargeinSpeech: '',
      silenceDefault: true,
      stopSpeech: '',
      vadDefault: true,
      vadValue: '',
      vspDefault: true,
      vspValue: '',
      toggleLabel: {
        on: '开',
        off: '关',
      },
      silenceSpeech: '',
      silenceDuration: '',
      voiceEnableText: this.$t('task_engine_v2.voice_setting_tab.arrange_on'),
      voiceFileOptions: [],
      selectStyle: {
        height: '36px',
        'border-radius': '5px',
      },
      tooltip: {
        msg: this.$t('task_engine_v2.err_empty'),
        eventOnly: true,
        errorType: true,
        alignLeft: true,
        absolute: true,
      },
      interruptRadio: '1',
      radio: '1',
      SpeechTimeOutContent: this.$t('task_engine_v2.voice_setting_tab.Speech_Complete_Timeout'),
      vspContent: this.$t('task_engine_v2.voice_setting_tab.Vendor_Specific_Parameters'),
      vadradio: '1',
      VSPradio: '1',
      exceedNum: '',
      waitingTextArea: '',
      waitChoiceFlag: false,
      stopChoiceFlag: false,
      silenceSwitch: '',
      // 自定义的变量
      customvoiceEnableText: this.$t('task_engine_v2.voice_setting_tab.arrange_on'),
      custombargeinValue: true,
      custombargeinSpeech: '',
      customsilenceDuration: '',
      customsilenceSpeech: '',
      customexceedNum: '',
      customstopSpeech: '',
      customvadValue: '',
      customvspValue: '',
      customsilenceSwitch: true,
      placeholder: this.$t('task_engine_v2.voice_setting_tab.please_select'),
    };
  },
  watch: {
    custombargeinSpeech() {
      this.emitUpdate();
    },
    customsilenceDuration() {
      this.emitUpdate();
    },
    customsilenceSpeech() {
      this.emitUpdate();
    },
    customexceedNum() {
      this.emitUpdate();
    },
    customstopSpeech() {
      this.emitUpdate();
    },
    customvadValue() {
      this.emitUpdate();
    },
    customvspValue() {
      this.emitUpdate();
    },
    bargeinSpeech() {
      this.emitUpdate();
    },
    silenceDuration() {
      this.emitUpdate();
    },
    silenceSpeech: {
      handler() {
        this.emitUpdate();
      },
    },
    exceedNum() {
      this.emitUpdate();
    },
    stopSpeech() {
      this.emitUpdate();
    },
    vadValue() {
      this.emitUpdate();
    },
    vspValue() {
      this.emitUpdate();
    },
    interruptRadio(val) {
      if (val === '1') { // 使用全局定义
        this.bargeinDefault = true;
      } else { // 自定义
        this.bargeinDefault = false;
      }
      this.emitUpdate();
    },
    vadradio(val) {
      if (val === '1') {
        this.vadDefault = true;
      } else {
        this.vadDefault = false;
      }
      this.emitUpdate();
    },
    VSPradio(val) {
      if (val === '1') {
        this.vspDefault = true;
      } else {
        this.vspDefault = false;
      }
      this.emitUpdate();
    },
    radio(val) {
      if (val === '1') { // 静默等待配置使用全局定义
        this.silenceDefault = true;
      } else { // 自定义
        this.silenceDefault = false;
      }
      this.emitUpdate();
    },
    bargeinValue(val) {
      if (val) {
        this.voiceEnableText = this.$t('task_engine_v2.voice_setting_tab.arrange_on');
      } else {
        this.voiceEnableText = this.$t('task_engine_v2.voice_setting_tab.arrange_off');
      }
      this.emitUpdate();
    },
    custombargeinValue(val) {
      if (val) {
        this.customvoiceEnableText = this.$t('task_engine_v2.voice_setting_tab.arrange_on');
      } else {
        this.customvoiceEnableText = this.$t('task_engine_v2.voice_setting_tab.arrange_off');
      }
      this.emitUpdate();
    },
    customsilenceSwitch() {
      this.emitUpdate();
    },
  },
  methods: {
    initData() {
      this.bargeinDefault = this.ttsInfo.bargein.bargein_default;
      this.silenceDefault = this.ttsInfo.silence.silence_default;
      this.vadDefault = this.ttsInfo.vad.vad_default;
      this.vspDefault = this.ttsInfo.vsp.vsp_default;
      this.interruptRadio = this.bargeinDefault ? '1' : '2';
      this.bargeinValue = this.globalTTSinfo.bargein;
      this.bargeinSpeech = this.globalTTSinfo.interrupt_speech;
      this.custombargeinValue = this.ttsInfo.bargein.bargein_value;
      this.custombargeinSpeech = this.ttsInfo.bargein.bargein_speech;
      if (!this.bargeinValue) {
        this.voiceEnableText = this.$t('task_engine_v2.voice_setting_tab.arrange_off');
      }
      if (!this.custombargeinValue) {
        this.customvoiceEnableText = this.$t('task_engine_v2.voice_setting_tab.arrange_off');
      }
      this.radio = this.silenceDefault ? '1' : '2';
      this.silenceDuration = this.globalTTSinfo.silence.silence_waitingduration;
      this.silenceSwitch = this.globalTTSinfo.silence.silence_switch;
      this.silenceSpeech = this.globalTTSinfo.silence.silence_waitingspeech;
      this.exceedNum = this.globalTTSinfo.silence.silence_limit;
      this.stopSpeech = this.globalTTSinfo.silence.silence_stopspeech;
      this.customsilenceDuration = this.ttsInfo.silence.silence_duration;
      this.customsilenceSwitch = this.ttsInfo.silence.silence_switch;
      this.customsilenceSpeech = this.ttsInfo.silence.slient_speech;
      this.customexceedNum = this.ttsInfo.silence.num_limit;
      this.customstopSpeech = this.ttsInfo.silence.stop_speech;
      // 兼容旧版本没有silence_switch字段
      this.vadradio = this.vadDefault ? '1' : '2';
      this.vadValue = this.globalTTSinfo.vad_time;
      this.customvadValue = this.ttsInfo.vad.vad_value;

      this.VSPradio = this.vspDefault ? '1' : '2';
      this.vspValue = this.globalTTSinfo.vsp_setting;
      this.customvspValue = this.ttsInfo.vsp.vsp_value;
    },
    onInputFocus(evt) {
      evt.target.dispatchEvent(event.createEvent('tooltip-hide'));
    },
    showAddChoice(type) {
      if (type === 'stop') {
        this.stopChoiceFlag = true;
      } else if (type === 'wait') {
        this.waitChoiceFlag = true;
      }
    },
    cancle(type) {
      if (type === 'stop') {
        this.stopChoiceFlag = false;
      } else if (type === 'wait') {
        this.waitChoiceFlag = false;
      }
    },
    ensure(type) {
      let ref = '';
      let waitingTextArea = '';
      if (type === 'stop') {
        ref = 'silence-4';
        waitingTextArea = this.customstopSpeech;
      } else if (type === 'wait') {
        ref = 'silence-2';
        waitingTextArea = this.customsilenceSpeech;
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
      if (type === 'stop') {
        this.customstopSpeech = waitingTextArea;
      } else if (type === 'wait') {
        this.customsilenceSpeech = waitingTextArea;
      }
      this.cancle(type);
    },
    receive(res) {
      this.speechvalue = res[0];
    },
    emitUpdate() {
      let outcomebargeinValue = '';
      let outcomebargeinSpeech = '';
      let outcomesilenceDuration = '';
      let outcomesilenceSpeech = '';
      let outcomeexceedNum = '';
      let outcomestopSpeech = '';
      let outcomevadValue = '';
      let outcomevspValue = '';
      let outcomesilenceswitch = '';
      if (this.bargeinDefault) {
        outcomebargeinValue = this.bargeinValue;
        outcomebargeinSpeech = this.bargeinSpeech;
      } else {
        outcomebargeinValue = this.custombargeinValue;
        outcomebargeinSpeech = this.custombargeinSpeech;
      }
      if (this.silenceDefault) {
        outcomesilenceswitch = this.silenceSwitch;
        outcomesilenceDuration = this.silenceDuration;
        outcomesilenceSpeech = this.silenceSpeech;
        outcomeexceedNum = this.exceedNum;
        outcomestopSpeech = this.stopSpeech;
      } else {
        outcomesilenceswitch = this.customsilenceSwitch;
        outcomesilenceDuration = this.customsilenceDuration;
        outcomesilenceSpeech = this.customsilenceSpeech;
        outcomeexceedNum = this.customexceedNum;
        outcomestopSpeech = this.customstopSpeech;
      }
      if (this.vadDefault) {
        outcomevadValue = this.vadValue;
      } else {
        outcomevadValue = this.customvadValue;
      }
      if (this.vspDefault) {
        outcomevspValue = this.vspValue;
      } else {
        outcomevspValue = this.customvspValue;
      }
      const newttsInfo = {
        bargein: {
          bargein_default: this.bargeinDefault,
          bargein_value: outcomebargeinValue,
          bargein_speech: outcomebargeinSpeech,
        },
        silence: {
          silence_default: this.silenceDefault,
          silence_switch: outcomesilenceswitch,
          silence_duration: outcomesilenceDuration,
          slient_speech: outcomesilenceSpeech,
          num_limit: outcomeexceedNum,
          stop_speech: outcomestopSpeech,
        },
        vad: {
          vad_default: this.vadDefault,
          vad_value: outcomevadValue,
        },
        vsp: {
          vsp_default: this.vspDefault,
          vsp_value: outcomevspValue,
        },
      };
      this.$emit('update', newttsInfo);
      this.$emit('update:valid', this.isValid());
    },
    isValid() {
      let bargeinValid = true;
      const silenceValid = [];
      let vadValid = true;
      let newsilenceValid = true;
      let vspValid = true;
      if (this.interruptRadio === '2' && this.custombargeinValue) {
        bargeinValid = general.isInputContentsValid(this.$refs.bargein);
      }
      if (this.radio === '2' && this.customsilenceSwitch) {
        for (let i = 0; i <= 3; i += 1) {
          silenceValid[i] = general.isInputContentsValid(this.$refs[`silence-${i + 1}`]);
        }
        newsilenceValid = silenceValid.every(el => el === true);
      }
      if (this.vadradio === '2') {
        vadValid = general.isInputContentsValid(this.$refs.vad);
      }
      if (this.VSPradio === '2') {
        vspValid = general.isInputContentsValid(this.$refs.vsp);
      }
      if (!bargeinValid || !newsilenceValid || !vadValid || !vspValid) {
        return false;
      }
      return true;
    },
    showToolTip() {
      if (this.interruptRadio === '2' && this.bargeinValue) {
        general.showInputContentTooltip(this.$refs.bargein);
      }
      if (this.radio === '2' && this.customsilenceSwitch) {
        for (let i = 1; i <= 4; i += 1) {
          general.showInputContentTooltip(this.$refs[`silence-${i}`]);
        }
      }
      if (this.vadradio === '2') {
        general.showInputContentTooltip(this.$refs.vad);
      }
      if (this.VSPradio === '2') {
        general.showInputContentTooltip(this.$refs.vsp);
      }
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
  },
  created() {
    this.initData();
  },
  mounted() {
    this.$on('showToolTip', this.showToolTip);
    this.getVoiceOption();
    this.emitUpdate();
  },
};
</script>

<style lang="scss" scoped>
@import 'styles/variable.scss';
.display_flex{
  display: -moz-box;  /* Firefox */
  display: -ms-flexbox;    /* IE10 */
  display: -webkit-box;    /* Safari */
  display: -webkit-flex;    /* Chrome, WebKit */
  display: flex;
}
@mixin flex($height) {
  -prefix-box-flex: 0 0 $height;
  -webkit-box-flex: 0 0 $height;
  -webkit-flex: 0 0 $height;
  -moz-box-flex: 0 0 $height;
  -ms-flex: 0 0 $height;
}


  #voice-setting-tab {
    display: flex;
    flex-direction: column;
    padding: 0 20px;
    font-size: 12px;
    .block{
      display: flex;
      @extend .display_flex;
      flex-direction: column;
      padding-top: 12px;
      padding-bottom: 12px;
      // box-sizing: border-box;
      background: #f7f7f7;
      margin-bottom: 12px;
      .row{
        flex: 0 0 36px;
        display: flex;
        @include flex(36px);
        @extend .display_flex;
        flex-direction: row;
        align-items: center;
        .row-title{
          width: 133px;
          margin-right: 12px;
          text-align: right;
        }
        .row-right{
          flex: 1;
          position: relative;
        }
        .defaultRight{
          color: #999;
        }
      }
    }

    .setting-toggle {
      flex: 0 0 73px;
      background: #f7f7f7;
      display: flex;
      flex-direction: column;
    }
      .toggle-row{
        flex: 0 0 30px;
        font-size: 14px;
        font-weight: 400;
        padding-top: 10px;
        position: relative;
      }
      .toggle-title {
        padding-left: 32px;
      }
      .toggle-connet{
          padding-left: 65px;
      }

    .voice-config {
      margin-top: 13px;
      background: #f7f7f7;
      padding-bottom: 10px;
    }
    .voicearea{
      padding-left: 133px;
      margin-left: 10px;
      margin-right: 10px;
      margin-bottom: 14px;
      color: #666;
      padding-bottom: 10px;
      border-bottom: 1px dashed #d7d7d7;
      textarea{
        width: 339px;
        min-height: 104px;
      }
    }
    .check-toggle {
      margin-top: 13px;
      flex: 0 0 88px;
      background: #f7f7f7;
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
        box-shadow:0px 1px 6px 0px rgba(86,86,86,0.5);
        padding: 10px 8px 10px;
        border-radius:1px;
        z-index: 100;
      }
      .addchoicebutton{
        display: flex;
        margin-top: 25px;
        justify-content: space-around;
      }
    }
    .select {
      background: white;
      border-radius: 1px;
      width: 136px;
    }
    .rowLeft{
      width: 56px;
      text-align: right;
      display: inline-block;
    }
    .ms{
      position: absolute;
      left: 190px;
      top: 3px;
    }
    .oms{
      position: absolute;
      left: 250px;
      top: 8px;
    }
  }
  input::-webkit-input-placeholder{
    font-size: 12px;
  }
  .input-limit{
      margin-top: 3px;
      height: 30px;
      margin: 0px 10px 0px 10px;
      width: 40px;
    }
</style>
