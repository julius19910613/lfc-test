<template>
  <div class="parser-editor-wrapper">
    <div class="basic-block">
      <div class="title-box">
        <span class="title">* {{$t('ner.extractor.basic_info')}}</span>
      </div>
      <div class="input-line name-input-line">
        <label>{{$t('ner.extractor.parser_name')}}</label>
        <input :disabled="!canEdit" :maxlength="32" :placeholder="$t('ner.extractor.enter_parser_name')"
        v-model="parserObj.parserName" :class="{'error':validateMsg['extractorName']}"
        @change="handleValidation('extractorName', parserObj.parserName)">
      </div>
      <!-- 槽位列表 -->
      <div class="variant-box" v-for="(slot, index) in parserObj.slots" :key="index+slot.related_type">
        <div class="input-line">
          <label>{{$t('ner.extractor.output_variant')}}{{index+1}}</label>
          <input :disabled="!canEdit" :ref="'slot'+index" :maxlength="32" :placeholder="$t('ner.extractor.enter_variant_name')"
          :class="{'error':validateMsg[`variantName${index}`]||validateMsg[`variantRepeat${index}`]}"
          v-model="slot.name" @focus="focusSlotName(slot.name, index)"
          @change="handleChangeSlotName(slot, index)" @blur="handleBlurSlotName(slot, index)">
          <div v-if="canEdit" class="icon-box" v-show="parserObj.slots.length > 1">
            <el-popover popper-class="emotibot" placement="top" width="300" v-model="slot.isDeleting"
            v-if="isEditMode || isSlotInUse(slot)">
              <p style="text-align: center; margin-top:5px;"
              v-html="isSlotInUse(slot)?$t('ner.extractor.delete_slot_in_corpus'):$t('ner.extractor.delete_corpus_alert')"></p>
              <div style="text-align: right; margin-top: 10px" v-if="!isSlotInUse(slot)">
                <button class="btn-small btn-white-gray" @click="slot.isDeleting = false">
                {{$t('ner.extractor.delete_later')}}</button>
                <button class="btn-small btn-white-gray" @click="handleDeleteVariant(index, slot)">
                {{$t('ner.extractor.confirm_delete')}}</button>
              </div>
              <i class="delete-icon" slot="reference"></i>
            </el-popover>
            <i v-else class="delete-icon" @click="handleDeleteVariant(index)"></i>
          </div>
        </div>
        <div class="input-line">
          <label>{{$t('ner.extractor.related_type')}}</label>
          <dropdown-select :disabled="!canEdit"
          :placeholder="$t('ner.extractor.select_related_type')"
          v-model="slot.related_type" :key="index"
          :options="optionsRelType"
          :showError="validateMsg[`relatedType${index}`]!==undefined"
          @input="handleSwitchRelType(slot, index)"/>
          <dropdown-select :disabled="!canEdit"
          :class="{'hide':!slot.related_type}" v-model="slot.related_value"
          :placeholder="slot.related_type.length?$t('general.please_choose'):''"
          :options="getOptionsRelValues(slot.related_type)"
          :showError="validateMsg[`relatedValue${index}`]!==undefined" 
          @input="handleValidation('relatedValue', slot, index)"/>
        </div>
      </div>
      <p v-if="canEdit" :class="{'add-variant-btn':true, 'add-variant-btn-disable':parserObj.slots.length>=maxSlotNum}"
        @click="handleAddVariant">
      +{{$t('ner.extractor.add_variant')}}</p>
    </div>
    <!-- 语料部分 -->
    <div class="corpus-block">
      <!-- 导入导出 -->
      <div class="title-box">
        <span class="title">* {{$t('ner.extractor.train_corpus')}}</span>
        <span class="sub-title">{{corpusCountMsg}}</span>
        <text-button v-if="canEdit" :button-type="isUploading||isTraining?'disable':'default'"
        @click="handleUploadCorpus">{{$t('ner.extractor.upload_corpus')}}</text-button> 
        <text-button v-if="canExport" v-show="parserObj.parserId"
        :button-type="isUploading||isTraining||!originCorpusLength?'disable':'default'"
        @click="handleExportCorpus">{{$t('ner.extractor.export_corpus')}}</text-button>
      </div>
      <!-- 手动添加语料 -->
      <reference-input :disabled="!canEdit" :emptytext="$t('ner.extractor.no_variant')"
      :placeholder="$t('ner.extractor.ref_input_placeholder')" :refMandatory="true"
      @enter="handleAddCorpusByStr" :referenceList="referenceList" width="780px"></reference-input>
      <div class="training-indicator" v-show="isUploading||isTraining">
        <loading-dot :magnify="0.5"></loading-dot>
        <span v-if="isUploading">{{$t('ner.extractor.uploading_corpus')}}</span>
        <span v-else>{{$t('ner.extractor.training_corpus')}}</span>
      </div>
      <div class="corpus-list">
        <div class="corpus-item" v-for="(item, index) in parserObj.corpus" :key="index">
          <p class="corpus-text">{{item.content}}</p>
          <span v-if="canEdit" class="delete-btn" @click="handleDeleteCorpus(index)">{{$t('general.delete')}}</span>
        </div>
      </div>
    </div>
    <upload-excel v-model="isUploadingFile" :title="$t('ner.extractor.upload_title')"
    :tips="$t('ner.extractor.upload_corpus_tips')"
    @downloadTempl="handleDownloadCorpusTempl" @upload="uploadNERCorpusFileContent"></upload-excel>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import UploadExcel from '@/components/UploadExcel';
import ReferenceInput from './ReferenceInput';
import api from '../_api/ner';

export default {
  api,
  props: {
    value: {
      type: Object,
    },
  },
  components: {
    ReferenceInput,
    UploadExcel,
  },
  data() {
    return {
      isUploadingFile: false,
      optionsRelType: [
        { value: 'wordbank', text: this.$t('ner.extractor.wordbank') },
        { value: 'general_extractor', text: this.$t('ner.extractor.general_extractor') },
      ],
      validateMsg: {},
      isUploading: false,
      isTraining: false,
      needTrain: false,
      maxCorpusCount: 2000,
      maxCorpusLength: 100,
      isParserChanged: false,
      originParserName: '',
      originCorpusLength: 0,
      maxSlotNum: 5,
      invalidSlotIndex: undefined,
      originSlotNamesArr: [],
      currentSlotNamesArr: [],
    };
  },
  computed: {
    ...mapGetters([
      'robotID',
    ]),
    canEdit() {
      return this.value.canEdit;
    },
    canExport() {
      return this.value.canExport;
    },
    parserObj() {
      return this.value.extractor;
    },
    // 创建抽取器或编辑抽取器
    isEditMode() {
      return this.parserObj.parserId !== '';
    },
    optionsWordBank() {
      const res = [];
      if (this.value.wordBankList && this.value.wordBankList.length > 0) {
        this.value.wordBankList.forEach((item) => {
          res.push({ text: item.displayName, value: item.id });
        });
      }
      return res;
    },
    optionsGeneralParser() {
      const res = [];
      if (this.value.generalParserList && this.value.generalParserList.length > 0) {
        this.value.generalParserList.forEach((item) => {
          res.push({ text: item.name, value: item.id });
        });
      }
      return res;
    },
    referenceList() {
      const refSet = new Set();
      this.parserObj.slots.forEach((slot) => {
        if (slot.name !== '') {
          refSet.add(slot.name);
        }
      });
      return [...refSet];
    },
    noTrainCount() {
      return this.parserObj.corpus.filter(corpus => corpus.flag === 0).length;
    },
    errorTrainCount() {
      return this.parserObj.corpus.filter(corpus => corpus.flag === 2).length;
    },
    corpusCountMsg() {
      return this.$t('ner.extractor.corpus_total_count')
      .replace('%1', this.parserObj.corpus.length)
      .replace('%2', this.noTrainCount)
      .replace('%3', this.errorTrainCount);
    },
  },
  created() {
    this.initialData();
    this.originParserName = this.parserObj.parserName;
    this.originCorpusLength = this.parserObj.corpus.length || 0;
  },
  mounted() {
    this.$on('validate', this.handleValidation);
    this.$on('cancelValidate', () => {
      // 只有抽取器改动时才做二次确认
      if (this.isParserChanged) {
        this.$emit('showReminder', {
          buttonRef: 'cancelBtn',
          content: this.$t('task_engine_v2.node_edit_page.popup.content'),
          ok_msg: this.$t('task_engine_v2.node_edit_page.popup.confirm'),
          cancel_msg: this.$t('task_engine_v2.node_edit_page.popup.cancel'),
          cancel: () => {},
          ok: () => {
            this.$emit('cancelValidateSuccess');
          },
        });
      } else {
        this.$emit('cancel');
      }
    });
  },
  methods: {
    // 初始化数据
    initialData() {
      this.parserObj.slots.forEach((slot) => {
        this.originSlotNamesArr.push(slot.name);
        this.currentSlotNamesArr.push(slot.name);
        const slotExtractor = slot.extractor;
        if (slotExtractor && slotExtractor.baseParsers && slotExtractor.baseParsers.length > 0) {
          slot.related_type = ['general_extractor'];
          slot.related_value = [slotExtractor.baseParsers[0]];
          return;
        } else if (slotExtractor && slotExtractor.dicts && slotExtractor.dicts.length > 0) {
          slot.related_type = ['wordbank'];
          slot.related_value = [Number(slotExtractor.dicts[0])];
          return;
        }
        slot.related_type = [];
        slot.related_value = [];
      });
    },
    // 保存时设置数据
    finalizeData() {
      this.parserObj.slots.forEach((slot) => {
        slot.extractor = {
          baseParsers: [],
          dicts: [],
          rules: [],
        };
        if (slot.related_type.length === 0 || slot.related_value.length === 0) {
          delete slot.related_type;
          delete slot.related_value;
          return;
        }
        if (slot.related_type[0] === 'general_extractor') {
          slot.extractor = {
            baseParsers: [slot.related_value[0]],
            dicts: [],
            rules: [],
          };
        } else if (slot.related_type[0] === 'wordbank') {
          slot.extractor = {
            baseParsers: [],
            dicts: [slot.related_value[0]],
            rules: [],
          };
        }
        delete slot.related_type;
        delete slot.related_value;
      });
    },
    // 获取每个槽位所选关联类型的关联值列表
    getOptionsRelValues(relTypeArr) {
      // const relTypeArr = this.getRelatedType(slotExtractor);
      const relType = relTypeArr.length > 0 ? relTypeArr[0] : '';
      let relValues = [];
      switch (relType) {
        case 'wordbank':
          relValues = this.optionsWordBank;
          break;
        case 'general_extractor':
          relValues = this.optionsGeneralParser;
          break;
        default:
          relValues = [];
      }
      return relValues;
    },
    // 判断删除槽位时是否需要二次确认
    isSlotInUse(slot) {
      if (!slot.name) {
        return false;
      }
      const usingCorpus = this.parserObj.corpus.filter(item =>
      item.content.indexOf(`\${${slot.name}}`) !== -1);
      return usingCorpus.length > 0;
    },
    // 字段验证
    handleValidation(field, value, index) {
      this.validateMsg = {};
      if (field === 'extractorName') {
        this.isParserChanged = true;
        this.validateParserName(value);
      } else if (field === 'variantName') {
        this.isParserChanged = true;
        this.validateVariantName(value, index);
      } else if (field === 'relatedType') {
        this.isParserChanged = true;
        this.validateRelatedType(value, index);
      } else if (field === 'relatedValue') {
        this.isParserChanged = true;
        this.validateRelatedValue(value, index);
      } else if (field === undefined) {
        // 全部检测 = 解析器名字（不能为空&重复） + 变量名字（不能为空&重复）
        // 变量数组长度不能为空 + 相关类型 + 相关类型的值
        this.validateParserName(this.parserObj.parserName);
        // 变量列表不能为空
        this.validateVariantLength();
        // 变量名字 & 相关类型 & 相关类型值不能为空
        this.parserObj.slots.forEach((slot, indx) => {
          this.validateVariantName(slot, indx);
          this.validateRelatedType(slot, indx);
          this.validateRelatedValue(slot, indx);
        });
        // 变量名字不能重复
        this.validateVariantRepeat();
        // 用户点击了保存且发布(训练) - 没有语料不能训练
        if (!this.parserObj.onlySave) {
          this.validateCorpusLength();
        }
      }
      // 弹出验证失败的消息
      this.validateMsg = Object.assign({}, this.validateMsg);
      const messages = Object.values(this.validateMsg);
      this.popUpErrorMessage(messages);
      // 点击【保存】或【保存且发布】按钮，且验证成功时，发送消息执行数据库操作
      if (field === undefined && messages.length === 0) {
        if (this.getIfSlotNameNotChange()) {
          this.finalizeData();
          this.$emit('validateSuccess');
        } else {
          this.$popWarn({
            data: {
              msg: this.$t('ner.extractor.update_used_parser'),
            },
            callback: {
              ok: () => {
                this.finalizeData();
                this.$emit('validateSuccess');
              },
            },
          });
        }
      }
      return messages.length === 0;
    },
    getIfSlotNameNotChange() {
      if (!this.parserObj.used_num) {
        return true;
      }
      if (this.originSlotNamesArr.length !== this.currentSlotNamesArr.length) {
        return false;
      }
      for (let i = 0; i < this.originSlotNamesArr.length; i += 1) {
        if (this.originSlotNamesArr[i] !== this.currentSlotNamesArr[i]) {
          return false;
        }
      }
      return true;
    },
    popUpErrorMessage(messages) {
      if (!messages.length) {
        return;
      }
      // 设置timer避免连续多次点击时重复弹出错误消息
      if (this.messageTimer) {
        window.clearTimeout(this.messageTimer);
      }
      this.messageTimer = window.setTimeout(() => {
        messages.forEach((message) => {
          this.$notifyWarn(message);
        });
      }, 300);
    },
    validateParserName(inputValue) {
      // 名字不为空且与已有名字不重复
      if (!inputValue) {
        this.validateMsg.extractorName = this.$t('ner.extractor.valmsg_emptyparsername');
        return;
      } else if (inputValue.indexOf('/') !== -1) {
        this.validateMsg.extractorName = this.$t('ner.extractor.valmsg_parsername_invalidcarh');
        return;
      } else if (!this.parserObj.parserId
        && this.value.existParserNames.indexOf(inputValue) !== -1) {
        // 新增解析器，名字不能重复
        this.validateMsg.extractorName = this.$t('ner.extractor.valmsg_repeatparsername');
        return;
      } else if (this.parserObj.parserId && inputValue !== this.originParserName
        && this.value.existParserNames.indexOf(inputValue) !== -1) {
        // 修改解析器，名字修改与其他解析器重名
        this.validateMsg.extractorName = this.$t('ner.extractor.valmsg_repeatparsername');
        return;
      }
      if (this.validateMsg.extractorName) {
        delete this.validateMsg.extractorName;
      }
    },
    validateVariantName(slot, index) {
      if (!slot.name) {
        this.validateMsg[`variantName${index}`] = this.$t('ner.extractor.valmsg_emptyvarname').replace('%1', index + 1);
      } else if (!(/^[a-zA-Z0-9_]+$/.test(slot.name))) {
        this.validateMsg[`variantName${index}`] = this.$t('ner.extractor.valmsg_invalidvarname').replace('%1', index + 1);
      } else if (this.validateMsg[`variantName${index}`]) {
        delete this.validateMsg[`variantName${index}`];
      }
    },
    validateVariantLength() {
      if (this.parserObj.slots.length === 0) {
        this.validateMsg.slotsLength = this.$t('ner.extractor.valmsg_novariant');
      } else if (this.validateMsg.slotsLength) {
        delete this.validateMsg.slotsLength;
      }
    },
    validateRelatedType(slot, index) {
      if (slot.related_type.length === 0) {
        this.validateMsg[`relatedType${index}`] = this.$t('ner.extractor.valmsg_emptyvartype').replace('%1', index + 1);
      } else if (this.validateMsg[`relatedType${index}`]) {
        delete this.validateMsg[`relatedType${index}`];
      }
    },
    validateRelatedValue(slot, index) {
      if (slot.related_value.length === 0) {
        this.validateMsg[`relatedValue${index}`] = this.$t('ner.extractor.valmsg_emptyvarvalue').replace('%1', index + 1);
      } else if (this.validateMsg[`relatedValue${index}`]) {
        delete this.validateMsg[`relatedValue${index}`];
      }
    },
    validateCorpusLength() {
      if (this.parserObj.corpus.length === 0) {
        this.validateMsg.corpusLength = this.$t('ner.extractor.valmsg_emptycorpus');
      } else if (this.validateMsg.corpusLength) {
        delete this.validateMsg.corpusLength;
      }
    },
    handleSwitchRelType(slot, index) {
      slot.related_value = [];
      this.handleValidation('relatedType', slot, index);
    },
    validateVariantRepeat(index) {
      const uniqueSlots = [];
      const notEmptySlots = [];
      this.parserObj.slots.forEach((slot) => {
        if (slot.name && uniqueSlots.indexOf(slot.name) === -1) {
          uniqueSlots.push(slot.name);
        }
        if (slot.name) {
          notEmptySlots.push(slot.name);
        }
      });
      if (uniqueSlots.length !== notEmptySlots.length) {
        if (index !== undefined) {
          this.validateMsg[`variantRepeat${index}`] = this.$t('ner.extractor.valmsg_repeatvariant');
          // this.$notifyFail(this.validateMsg[`variantRepeat${index}`]);
          this.popUpErrorMessage([this.validateMsg[`variantRepeat${index}`]]);
        } else {
          this.validateMsg.variantRepeat = this.$t('ner.extractor.valmsg_repeatvariant');
        }
        return false;
      } else if (this.validateMsg.variantRepeat) {
        if (index !== undefined) {
          delete this.validateMsg[`variantRepeat${index}`];
        } else {
          delete this.validateMsg.variantRepeat;
        }
      }
      return true;
    },
    // blur事件会被连续多次触发，设置timer使blur事件只触发一次
    handleBlurSlotName(slot, index) {
      if (this.blurTimer) {
        return;
      }
      this.blurTimer = window.setTimeout(() => {
        this.handleChangeSlotName(slot, index);
        this.blurTimer = undefined;
      }, 100);
    },
    focusSlotName(variantName, index) {
      if (this.invalidSlotIndex && this.invalidSlotIndex !== index) {
        // this.$refs[`slot${index}`][0].blur();
        this.$refs[`slot${this.invalidSlotIndex}`][0].focus();
      }
    },
    handleChangeSlotName(slot, index) {
      // 验证字段是否合规
      this.invalidSlotIndex = undefined;
      const oldName = this.currentSlotNamesArr[index];
      // const oldName = this.originVariantName;
      // 新增抽取器 & 槽位名不符合规则时，强制focus,需要用户马上修改
      const validRes = this.handleValidation('variantName', slot, index);
      // 如果重名，都需要强制input获取focus，要求用户马上修改
      const validRepeat = this.validateVariantRepeat(index);
      if (oldName === slot.name) {
        return;
      }
      if (!validRes || !validRepeat) {
        this.invalidSlotIndex = index;
        // 需要强制获取焦点
        if (this.$refs[`slot${index}`][0]) {
          this.$refs[`slot${index}`][0].focus();
        }
        return;
      }
      this.currentSlotNamesArr[index] = slot.name;
      // 判断是否有需要替换的语料
      // eslint-disable-next-line
      const hasOriginCorpus = this.parserObj.corpus.filter(item => item.content.indexOf('${' + oldName + '}') !== -1);
      if (!hasOriginCorpus.length) {
        return;
      }
      const that = this;
      this.$popCheck({
        data: {
          msg: that.$t('ner.extractor.change_corpus_alert'),
        },
        callback: {
          ok: () => {
            // 执行替换操作
            hasOriginCorpus.forEach((item) => {
              const reg = new RegExp(`\\$\\{${oldName}\\}`, 'g');
              // item.flag = 0; // 设置为新语料
              // eslint-disable-next-line
              item.content = item.content.replace(reg, '${' + slot.name + '}');
            });
            this.parserObj.corpus.forEach((item) => {
              item.flag = 0;
              item.id = undefined;
            });
            this.parserObj.corpus = Array.concat([], this.parserObj.corpus);
          },
          cancel: () => {
            // 执行恢复操作
            slot.name = oldName;
          },
        },
      });
    },
    // 新增自定义槽位
    handleAddVariant() {
      if (this.parserObj.slots.length >= this.maxSlotNum) {
        return;
      }
      this.isParserChanged = true;
      this.parserObj.slots.push({ name: '', related_type: [], related_value: [] });
      this.currentSlotNamesArr.push('');
    },
    // 删除自定义槽位
    handleDeleteVariant(index, slot) {
      this.isParserChanged = true;
      this.parserObj.slots.splice(index, 1);
      this.currentSlotNamesArr.splice(index, 1);
      if (slot && slot.isDeleting) {
        slot.isDeleting = false;
      }
    },
    validReferenceInInput(inputValue, referenceList) {
      // 验证是否选择了引用，引用是否存在在引用列表中
      let validMsg = '';
      const pattern = new RegExp('\\$\\{(.)+?\\}', 'igm');
      const refs = inputValue.match(pattern) || [];
      if (!refs.length) {
        validMsg = this.$t('ner.extractor.no_slot_in_corpus');
      } else {
        const optionRefSet = new Set(referenceList);
        const errorRefs = refs.filter((item) => {
          const refItem = item.substring(2, item.length - 1);
          return !optionRefSet.has(refItem);
        });
        if (errorRefs.length > 0) {
          validMsg = this.$t('ner.extractor.invalid_slot_in_corpus').replace('%1', errorRefs[0]);
        }
      }
      // if (validMsg) {
      //   this.$notifyWarn(validMsg);
      // }
      return validMsg;
    },
    // 手动添加语料 - 预处理
    handleAddCorpusByStr(strArr) {
      const corpusList = [];
      strArr.forEach((str) => {
        corpusList.push({
          content: str,
          flag: 0, // 0=未训练; 1=已训练; 2=训练异常;
        });
      });
      this.handleAddCorpusByUpload(corpusList);
    },
    // 批量添加语料
    handleAddCorpusByUpload(newCorpusList, uploadMode) {
      // 全量替换 - 清空已有数据
      let newCorpus = Array.concat([], this.parserObj.corpus);
      if (uploadMode === 1) {
        newCorpus = [];
      }
      let hasExist = false;
      let maxCount = false;
      let invalidRef = false;
      let hasOversize = false;
      let hasValidData = false;
      newCorpusList.forEach((corpus) => {
        const isExist = newCorpus.filter(existCorpus =>
          existCorpus.content === corpus.content);
        if (isExist.length > 0) {
          // 已经存在
          hasExist = true;
        } else if (newCorpus.length >= this.maxCorpusCount) {
          // 语料数量达到上限
          maxCount = true;
        } else if (uploadMode !== undefined
        && this.validReferenceInInput(corpus.content, this.referenceList)) {
          // 上传语料时，做每条的reference验证
          invalidRef = true;
        } else if (corpus.content.length > this.maxCorpusLength) {
          hasOversize = true;
        } else {
          this.needTrain = true;
          hasValidData = true;
          newCorpus.unshift(corpus);
        }
      });
      // 部分语料已存在
      if (hasExist) {
        this.$notifyWarn(this.$t('ner.extractor.upload_corpus_exist'));
      }
      // 该抽取器达到语料上线
      if (maxCount) {
        this.$notifyWarn(this.$t('ner.extractor.upload_corpus_maxcount').replace('%1', this.maxCorpusCount));
      }
      // 存在上传的语料无效（不包含槽位或包含无效槽位）
      if (invalidRef) {
        this.$notifyWarn(this.$t('ner.extractor.invalid_corpus_exist'));
      }
      if (hasOversize) {
        this.$notifyWarn(this.$t('ner.extractor.corpus_max_count'));
      }
      if (!hasValidData) {
        // 无有效行
        this.$notifyWarn(this.$t('ner.extractor.no_valid_corpus'));
        return;
      }
      this.parserObj.corpus = newCorpus;
      this.isParserChanged = true;
    },
    handleDeleteCorpus(index) {
      this.isParserChanged = true;
      this.parserObj.corpus.splice(index, 1);
    },
    handleDownloadCorpusTempl() {
      this.$api.downloadCorpusTemplUrl();
    },
    handleUploadCorpus() {
      if (this.isUploading || this.isTraining) {
        return;
      }
      this.isUploadingFile = true;
    },
    handleExportCorpus() {
      if (this.isUploading || this.isTraining
      || !this.parserObj.parserId || !this.originCorpusLength) {
        return;
      }
      this.$api.exportParserCorpus(this.robotID, this.parserObj.parserId,
      this.parserObj.parserName);
    },
    // 上传语料
    uploadNERCorpusFileContent(file, uploadMode) {
      this.isUploading = true;
      this.$api.uploadNERCorpusFile(file).then((res) => {
        if (res.status === 'success' && res.data.length) {
          this.handleAddCorpusByUpload(res.data, uploadMode);
        } else {
          this.$notifyFail(res.message);
        }
      }).catch((e) => {
        this.$notifyFail(e.response.data.message);
      }).finally(() => {
        this.isUploading = false;
      });
    },
    handleTrainingCorpus() {
      // 未更新语料，不需要训练
      if (!this.needTrain) {
        return;
      }
      this.isTraining = true;
      this.$api.trainCustomParser(this.robotID, this.parserObj).then((res) => {
        if (res.status === 'success') {
          this.$notify({ text: this.$t('ner.extractor.train_success') });
          this.refreshCorpusList();
        } else {
          this.$notifyWarn(res.message);
        }
      }).catch((e) => {
        this.$notifyFail(e.response.data.message);
      }).finally(() => {
        this.isTraining = false;
      });
    },
    // 用户点击训练语料后，获取语料训练结果
    refreshCorpusList() {
      this.$api.getCustomParser(this.robotID, this.parserObj.parserId).then((detail) => {
        if (detail.status === 'success') {
          this.parserObj.corpus = detail.data.corpus;
        }
      }).catch((e) => {
        this.$notifyWarn(e.response.data.message);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.parser-editor-wrapper{
  width: 800px;
  padding: 20px;
  border-top: 1px solid $color-borderline-disabled;
  border-bottom: 1px solid $color-borderline-disabled;
  .title-box{
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    width: 100%;
    .title{
      color: $color-font-active;
      @include font-14px();
    }
    .sub-title{
      margin-left: 10px;
      flex: 1;
    }
    .text-button{
      margin-left: 10px;
    }
  }
  .basic-block{
    box-shadow: 0px 1px 0px 0px $color-borderline-disabled;
    padding-bottom: 20px;  
    .input-line{
      width: 100%;
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      &:last-child{
        margin-bottom: 0px;
      }
      label{
        color: $color-font-normal;
        width: 65px;
        margin-right: 20px;
        @include font-14px();
      }
      input{
        flex: 1;
      }
      .dropdown-container{
        flex: 1;
        margin-right: 10px;
        &:last-child{
          margin-right: 0px;
        }
      }
      .icon-box {
        width: 18px;
        height: 18px;
        margin-left: 10px;
        cursor: pointer;
        .delete-icon{
          @include icon('../../../assets/icons/remove.png', 18px, 18px);
        }
      }
      .hide{
        opacity: 0;
      }
    }
    .name-input-line{
      margin-bottom: 20px;
      label{
        width: 70px;
      }
    }
    .variant-box{
      background-color: $color-disabled;
      padding: 17px 20px;
      margin-bottom: 10px;
    }
    .add-variant-btn{
      display: inline-block;
      width: 115px;
      color: $app-active-color;
      cursor: pointer;
      @include font-14px();
    }
    .add-variant-btn-disable{
      color: $color-disabled;
      cursor: not-allowed;
    }
  }
  .corpus-block{
    padding-top: 20px;
    padding-bottom: 10px;
    .corpus-input{
      width: 100%;
      height: 38px;
    }
    .training-indicator{
      margin-top: 20px;
      margin-bottom: 20px;
      width: 100%;
      text-align: center;
      .loading-gif{
        width: 40px;
        display: inline-block;
      }
    }
    .corpus-list{
      .corpus-item{
        background-color: $color-disabled;
        padding: 14px 20px;
        display: flex;
        align-items: center;
        margin-top: 10px;
        .corpus-text{
          flex: 1;
          overflow: hidden;
          word-break: break-all;
          color: $color-font-normal;
          margin-right: 10px;
          @include font-14px();
        }
        .delete-btn{
          width: 28px;
          color: $color-font-normal;
          @include font-14px();
          display: none;
          cursor: pointer;
        }
        &:hover{
          background-color: #EAF3FF;
          .delete-btn{
            display: inline-block;
          }
        }
      }
    }
  }
}
</style>