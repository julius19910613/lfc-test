<template>
<div id="voice-seeting">
  <!-- 打断配置-->
  <div class="interrupt bg">
    <div class="row">
      <div class="title">{{ $t('task_engine_v2.voice_setting_tab.turn_arrange') }}</div>
      <div class="row-right">
        <toggle v-model="bargein" :size="'medium'" :showLabel="true" :label="toggleLabel"></toggle>
        <span>{{voiceEnableText}}</span>
      </div>
    </div>
    <div class="row" v-show="bargein">
      <div class="title"> {{ $t('task_engine_v2.voice_setting_tab.interrupt_speech') }}</div>
      <div class="row-right">
        <input ref="inputContent" class="input-width" type="text" placeholder="好的，您说" v-model="interruptSpeech" v-tooltip="tooltip" @focus="onInputFocus">
      </div>
    </div>
  </div>
    <!--静默超时-->
  <div class="waiting">
    <div class="toggle-row toggle-connet">
      <span class="title" v-t="'task_engine_v2.global_TTSinfo.silence_duration'"></span>
      <input ref="inputContent-2" class="input-width" type="text" v-model="waitingSilenceduration" v-tooltip="tooltip" @focus="onInputFocus">
      <span class="oms">ms</span>
    </div>
    <div class="toggle-row toggle-connet" style="display:flex;flex-direction: row;">
      <div class="silence-config"> {{$t('task_engine_v2.global_TTSinfo.wait_slience_config')}} </div>
      <toggle v-model="silenceSwitch" :size="'medium'" :showLabel="true" :label="toggleLabel"></toggle>
    </div>
    <div class="toggle-row toggle-connet" v-show="silenceSwitch">
          <span class="title" style="position:relative" v-t="'task_engine_v2.global_TTSinfo.silence_waitting'"></span>
          <span  class="small-tip" style="font-size: 12px;" @click="showAddChoice('wait')">
            <span class="addvoice" v-t="'task_engine_v2.global_TTSinfo.add_prerecording'"></span>
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
                <text-button button-type="default"  @click.stop="cancle('wait')">{{ $t('task_engine_v2.global_TTSinfo.cancel')}}</text-button>
                <text-button button-type="primary" @click.stop="ensure('wait')">{{ $t('task_engine_v2.global_TTSinfo.ensure')}}</text-button>
              </div>
            </div>
          </span>
    </div>
    <div class="voicearea" v-show="silenceSwitch">
        <textarea @focus="onInputFocus" ref="waitvoice"  name="" id="" v-model="waitingspeech" v-tooltip="tooltip"/>
    </div>
    <div class="row" v-show="silenceSwitch">
      <div class="label label-margin-left">
        {{ $t('task_engine_v2.voice_setting_tab.continuous_exceedance') }}
      </div>
      <input ref="inputContent-3" type="text" @focus="onInputFocus" v-model="silenceLimit" class="input-limit" v-tooltip="tooltip"/>
      <div class="label">
        {{ $t('task_engine_v2.voice_setting_tab.ecxeedtime') }}
      </div>
      <div class="label label-margin-left">
        {{ $t('task_engine_v2.voice_setting_tab.end_dialogue') }}
      </div>
    </div>

    <div v-show="silenceSwitch" class="row" style="margin-bottom: 0px;">
      <div class="title">
        {{ $t('task_engine_v2.voice_setting_tab.silence_stopSpeech') }}
      </div>
      <div class="row-right">
        <span  class="small-tip" style="margin-top:4px;" @click="showAddChoice('stop')">
          <span class="addvoice" v-t="'task_engine_v2.global_TTSinfo.add_prerecording'"></span>
          <div v-show="stopChoiceFlag" class="addChoice">
            <dropdown-select
              class="select"
              ref="selectElseThenGoto"
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
    <div class="voicearea" style="border: none" v-show="silenceSwitch">
      <textarea @focus="onInputFocus" ref="stopvoice"  name="" id="" v-model="stopSpeech" v-tooltip="tooltip"/>
    </div>
    </div>

  <!--静音检测时间 -->
  <div class="interrupt bg">
    <div class="row">
      <div class="title">
        <el-tooltip class="item" effect="dark" :content="SpeechTimeOutContent" placement="top">
          <i class="el-icon-warning-outline"></i>
        </el-tooltip>
        {{ $t('task_engine_v2.voice_setting_tab.mute_testtime') }}
      </div>
      <input @focus="onInputFocus" ref="inputContent-4" class="input-width" type="text" v-model="vadTime" v-tooltip="tooltip"/>
      <span class="time-ms">ms</span>
    </div>
  </div>
  <!-- url-->
  <div class="interrupt bg">
    <div class="row">
      <div class="title">TTS URL</div>
      <input @focus="onInputFocus" type="text" ref="inputContent-5" class="input-width" v-model="ttsurl" placeholder="http://" v-tooltip="tooltip"/>
    </div>
  </div>
  <!-- vsp设定-->
  <div class="interrupt bg">
    <div class="row">
      <div class="title">
        <el-tooltip class="item" effect="dark" :content="vspContent" placement="top">
          <i class="el-icon-warning-outline"></i>
        </el-tooltip>
        {{ $t('task_engine_v2.voice_setting_tab.vsp_setting') }}
      </div>
      <input @focus="onInputFocus" ref="inputContent-6" class="input-width" type="text" v-model="vsp" placeholder="请输入参数" v-tooltip="tooltip"/>
      <span class="time-ms">ms</span>
    </div>
  </div>

</div>
</template>

<script>
import { mapGetters } from 'vuex';
import DropdownSelect from '@/components/DropdownSelect';
import event from '@/utils/js/event';
import api from '@/modules/TaskEngine/_api/nerFactoryDal';
import general from '@/modules/TaskEngine/_utils/general';

export default {
  props: {
    value: {
      type: Object,
    },
  },
  components: {
    DropdownSelect,
  },
  api: [api],
  data() {
    const gttsInfo = this.value.globalTTSinfo;
    const bargein = gttsInfo.bargein;
    const interruptSpeech = gttsInfo.interrupt_speech;
    const gsilent = gttsInfo.silence;
    const waitingSilenceduration = gsilent.silence_waitingduration;
    // 静默话术配置
    let silenceSwitch = true;
    if (typeof gsilent.silence_switch === 'undefined') {
      silenceSwitch = true;
    } else {
      silenceSwitch = gsilent.silence_switch;
    }
    const waitingspeech = gsilent.silence_waitingspeech;
    const silenceLimit = gsilent.silence_limit;
    const stopSpeech = gsilent.silence_stopspeech;
    const vadTime = gttsInfo.vad_time;
    const ttsurl = gttsInfo.tts_url;
    const vsp = gttsInfo.vsp_setting;
    return {
      gttsInfo,
      interruptSpeech,
      waitingSilenceduration,
      ttsurl,
      waitingspeech,
      stopSpeech,
      vadTime,
      vsp,
      voiceFileOptions: [],
      AddChoice: false,
      waitChoiceFlag: false,
      stopChoiceFlag: false,
      waitingTextArea: '',
      selectStyle: {
        height: '36px',
        'border-radius': '5px',
      },
      appId: this.$store.state.appid,
      voiceEnableText: this.$t('task_engine_v2.voice_setting_tab.arrange_on'),
      bargein,
      toggleLabel: {
        on: '开',
        off: '关',
      },
      silenceLimit,
      SpeechTimeOutContent: this.$t('task_engine_v2.voice_setting_tab.Speech_Complete_Timeout'),
      vspContent: this.$t('task_engine_v2.voice_setting_tab.Vendor_Specific_Parameters'),
      tooltip: {
        msg: this.$t('task_engine_v2.err_empty'),
        eventOnly: true,
        errorType: true,
        alignLeft: true,
        absolute: true,
      },
      silenceSwitch,
      placeholder: this.$t('task_engine_v2.voice_setting_tab.please_select'),
    };
  },
  computed: {
    ...mapGetters([
      'enterpriseID',
    ]),
  },
  watch: {
    bargein(val) {
      if (val) {
        this.voiceEnableText = this.$t('task_engine_v2.voice_setting_tab.arrange_on');
      } else {
        this.voiceEnableText = this.$t('task_engine_v2.voice_setting_tab.arrange_off');
      }
    },
  },
  methods: {
    onInputFocus(evt) {
      evt.target.dispatchEvent(event.createEvent('tooltip-hide'));
    },
    isValid() {
      const inputValid = [];
      if (this.bargein) {
        inputValid.push(general.isInputContentsValid(this.$refs.inputContent));
      }
      for (let i = 2; i <= 6; i += 1) {
        inputValid.push(general.isInputContentsValid(this.$refs[`inputContent-${i}`]));
      }
      const waitValid = general.isInputContentsValid(this.$refs.waitvoice);
      const stopvalid = general.isInputContentsValid(this.$refs.stopvoice);
      const ninputValid = inputValid.every(el => el === true);
      if (!ninputValid || !waitValid || !stopvalid) {
        return false;
      }
      return true;
    },
    showToolTip() {
      if (this.bargein) {
        general.showInputContentTooltip(this.$refs.inputContent);
      }
      for (let i = 2; i <= 6; i += 1) {
        general.showInputContentTooltip(this.$refs[`inputContent-${i}`]);
      }
      general.showInputContentTooltip(this.$refs.waitvoice);
      general.showInputContentTooltip(this.$refs.stopvoice);
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
        ref = 'stopvoice';
        waitingTextArea = this.stopSpeech;
      } else if (type === 'wait') {
        ref = 'waitvoice';
        waitingTextArea = this.waitingspeech;
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
        this.stopSpeech = waitingTextArea;
      } else if (type === 'wait') {
        this.waitingspeech = waitingTextArea;
      }
      this.cancle(type);
    },
    receive(res) {
      this.speechvalue = res[0];
    },
    showAddChoice(type) {
      if (type === 'stop') {
        this.stopChoiceFlag = true;
      } else if (type === 'wait') {
        this.waitChoiceFlag = true;
      }
    },
    // 点击确认返回值
    validate() {
      if (!this.isValid()) {
        this.showToolTip();
        return;
      }
      this.$emit('validateSuccess', {
        bargein: this.bargein,
        interrupt_speech: this.interruptSpeech,
        silence: {
          silence_waitingduration: this.waitingSilenceduration,
          silence_switch: this.silenceSwitch,
          silence_waitingspeech: this.waitingspeech,
          silence_limit: this.silenceLimit,
          silence_stopspeech: this.stopSpeech,
        },
        vad_time: this.vadTime,
        tts_url: this.ttsurl,
        vsp_setting: this.vsp,
      });
    },
    inputFocus(e) {
      e.target.dispatchEvent(event.createEvent('tooltip-hide'));
    },
    // 获取添加预录音的接口
    getVoiceOption() {
      const enterpriseIid = this.enterpriseID;
      const scenarioId = this.value.scenarioId;
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
    if (typeof this.bargein === 'undefined') {
      this.bargein = true;
    }
  },
  mounted() {
    this.$on('validate', this.validate);
    this.getVoiceOption();
  },
};
</script>

<style lang="scss" scoped>
#voice-seeting {
  width: 650px;
  padding: 25px 40px;
  border-top: #e9e9e9 solid 1px;
  border-bottom: #e9e9e9 solid 1px;
  display: flex;
  flex-direction: column;
  font-size: 12px;
  .interrupt{
    // flex: 0 0 44px;
    display: flex;
    flex-direction: column;
    padding-top: 12px;
    box-sizing: border-box;
  }
  .row{
    display: flex;
    flex-direction: row;
    margin-bottom: 12px;
    position: relative;
    min-height: 22px;
    .label{
      line-height: 36px;
    }
    .input-limit{
      margin-top: 3px;
      height: 30px;
      margin: 0px 10px 0px 10px;
      width: 40px;
    }
    .row-right{
      flex: 1;
      padding-right: 34px;
      vertical-align: middle;
    }
  }
  .title{
    width: 133px;
    margin-right: 10px;
    text-align: right;
    line-height: 22px;
  }
  .waiting{
    // flex: 0 0 174px;
    background: #f7f7f7;
    margin-bottom: 10px;
    padding-bottom: 10px;
  }
  .seturl{
    flex: 0 0 62px;
    background: #f7f7f7;
    padding-left: 90px;
    padding-top: 15px;
  }
  .toggle-row{
    flex: 0 0 30px;
    font-size: 12px;
    font-weight: 400;
    padding-top: 20px;
    position: relative;
  }
  .toggle-connet{
    padding-left: 25px;
  }
    .voicearea{
      padding-left: 133px;
      margin-left: 10px;
      margin-right: 10px;
      margin-top: 6px;
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
        width: 152px;
        box-shadow:0px 1px 6px 0px rgba(86,86,86,0.5);
        padding: 10px 8px 10px;
        border-radius:1px;
        z-index: 90;
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
    .oms{
      position: absolute;
      left: 460px;
      top: 26px;
    }
    .time-ms{
      position: absolute;
      left: 460px;
      top: 10px;
    }
}
.bg{
  background: #f7f7f7;
  margin-bottom: 12px;
}
.input-width{
  width: 339px;
}
input::-webkit-input-placeholder{
  font-size: 12px;
}
.silence-config{
  width:108px;
  margin-right:10px;
  text-align:right;
  line-height:20px;
}
</style>

