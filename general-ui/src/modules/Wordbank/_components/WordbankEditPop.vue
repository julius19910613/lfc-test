<template>
  <el-dialog :visible.sync="value" class="wb-editor-wrapper"
  :title="isEditMode?$t('wordbank.edit_word'):$t('wordbank.add_word')" 
  :before-close="handleClose" :show-close="false">
    <div class="header-wrapper">
      <div class="header-line">
        <span class="label">{{ $t('wordbank.status.title') }}</span>
        <el-switch v-model="wordbankEffect" @change="handleSwitchEffect"></el-switch>
      </div>
      <div class="header-line">
        <span class="label">{{ $t('wordbank.main_word') }}</span>
        <input type="text" ref="wordbankName"
          :class="{'invalid-input': !validNameInput}"
          v-model="wordbankName" @change="handleEditWordbankName"
          v-tooltip="wordbankNameTooltip" :maxlength="wordNameLengthLimit" :disabled="readonly">
        <span class="label sencond-label" v-show="!hideWordSpell">{{ $t('wordbank.main_word_spell') }}</span>
        <el-switch v-show="!hideWordSpell" v-model="wordbankSpell" @change="handleSwitchSepll"></el-switch>
      </div>
      <!-- 新增同义词 -->
      <div v-if="!readonly" class="header-line">
        <span class="label">{{ $t('wordbank.synonym') }}</span>
        <input type="text" ref="synonymInput"
        v-model="newSynonym" v-tooltip="addSynonymTooltip"
        :class="{'invalid-input':isNewSynonymDuplicate}"
        :maxlength="synonymLengthLimit" :placeholder="$t('wordbank.placeholder_synonym')"
        @compositionstart="setCompositionState(true)" @compositionend="setCompositionState(false)"
        @keydown.enter="detectCompositionState" @keyup.enter="addSynonym">
      </div>
      <div class="header-line" v-if="isSensitive">
        <!-- 敏感词问答 -->
        <span class="label">{{ $t('wordbank.sensitive_word') }}</span>
        <el-radio-group v-model="isDefaultSensitive" @change="handleSwitchSensitive">
          <el-radio :label="true" :disabled="readonly" class="radio-left">
            {{ $t('wordbank.default') }}</el-radio>
          <el-radio :label="false" :disabled="readonly" class="radio-right">
            {{ $t('wordbank.define') }}</el-radio>
        </el-radio-group>
        <el-input class="sensitive-answer search-input" v-model="sensitiveAnswer" ref="sensitiveInputBox"
        :disabled="readonly||isDefaultSensitive" size="mini"
        @change="handleChangeSensitiveWord"></el-input>
      </div>
      <div class="header-line toolbar">
        <button class="btn-small" v-if="!hideWordSpell"
        :class="{'btn-white-gray':selSynWordsCount!==0,'btn-disabled':selSynWordsCount===0}"
        @click="enableMultiSynonym">{{ $t('wordbank.batch_enable') }}</button>
        <button class="btn-small" v-if="!hideWordSpell"
        :class="{'btn-white-gray':selSynWordsCount!==0,'btn-disabled':selSynWordsCount===0}"
        @click="disableMultiSynonym">{{ $t('wordbank.batch_disable') }}</button>
        <button class="btn-small" :class="{'btn-red':selSynWordsCount!==0,'btn-disabled':selSynWordsCount===0}"
        @click="deleteMultiSynonym">{{ $t('wordbank.batch_delete') }}</button>
        <span class="total-count">
          {{ $t('wordbank.all_select_count').replace('%1',totalSynWordsCount).replace('%2',selSynWordsCount)}}
        </span>
        <el-input v-model="synonymKeyword" class="search-input"
          :placeholder="$t('general.search_placeholder')"
          size="mini" suffix-icon="el-icon-search"></el-input>
      </div>
    </div>
    <!-- 同义词列表 -->
    <div class="content-wrapper">
      <el-tooltip class="item" effect="dark" placement="top" v-if="!hideWordSpell">
        <p slot="content" :style="{'width':'200px','line-height':'18px'}">
          {{ $t('wordbank.synonym_spell_tooltip') }}
        </p>
        <i class="el-icon-info spell-tooltip"></i>
      </el-tooltip>
      <el-table :data="currentPageWords" style="width: 100%"
        :header-cell-style="{'background':'#F7F7F7', 'color':'#666666', 'height':'50px','padding-left':'10px'}"
        :cell-style="{'padding-left':'10px'}"
        @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="50"></el-table-column>
          <el-table-column :label="$t('wordbank.synonym')">
            <template slot-scope="scope">
              <input v-if="editingSynonyms === scope.row" class="edit-sync-input"
              :class="{'invalid-input':!isEditSynValid}"
              type="text" ref="editingSynonyms" v-model="editingSynonymsInput"
              @blur="clearEditSynonymsName"
              @keyup.enter="handleEditSynonymsName"
              v-tooltip="editingSynonymsTooltip" :maxlength="wordNameLengthLimit">
              <span v-else>{{scope.row.name}}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('wordbank.spell')" width="120" v-if="!hideWordSpell">
             <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" :content="$t('wordbank.change_spell')" placement="left">
                <el-switch v-model="scope.row.spell"
                @change="handleSwitchSynSpell(scope.row)"></el-switch>
              </el-tooltip>
             </template>
          </el-table-column>
          <el-table-column :label="$t('wordbank.operation')" width="150">
            <template slot-scope="scope">
              <span style="color:#1875F0; cursor:pointer"
              @click="handleEditSimilarWord(scope.$index, scope.row)">{{ $t('general.edit') }}</span>
              <span style="color:#F76260; cursor:pointer; margin-left:30px;"
              @click="confirmBatchDeleteSimilarW([scope.row])">{{ $t('general.delete') }}</span>
            </template>
          </el-table-column>
        </el-table>
        <div class="pager-wrapper">
          <el-pagination small class="emotibot"
          @size-change="handlePageSizeChange" @current-change="handlePageChange"
          :page-sizes="[50, 100, 200, 500, 1000]" layout="prev, pager, next, sizes, jumper"
          :current-page="curPageIdx" :page-size="pageLimit"
          :total="curTotal">
          </el-pagination>
        </div> 
    </div>
    <div class="footer-wrapper" slot="footer">
      <button class="btn-small btn-white-gray" @click="handleClose">{{ $t('general.cancel') }}</button>
      <button class="btn-small" @click="handleValidate"
      :class="{'btn-disabled': isCreatingWB, 'btn-dark-blue': !isCreatingWB}">{{ $t('general.ok') }}</button>
    </div>
  </el-dialog>
</template>
<script>
import { mapGetters } from 'vuex';
import event from '@/utils/js/event';
import api from '../_api/wordbank_v2';

export default {
  api,
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    wordbank: {
      type: Object,
    },
    existWordbanks: {
      type: Array,
      default: [],
    },
    categoryPathMap: {
      type: Object,
    },
  },
  data() {
    return {
      isCreatingWB: false,
      isDefaultSensitive: undefined,
      // 绑定词条属性
      wordbankId: undefined,
      categoryId: undefined,
      wordbankName: '',
      wordbankEffect: false,
      wordbankSpell: false,
      synonyms: [],
      filteredSynonyms: [],
      currentSynonyms: [],
      sensitiveAnswer: '',
      newSynonym: '',
      compositionState: false,
      wasCompositioning: false,

      checkedSynonyms: [],
      synonymKeyword: '',

      curPageIdx: 1,
      pageLimit: 50,
      wordNameLengthLimit: 80,
      synonymLengthLimit: 80,

      editingSynonymsInput: '',
      editingSynonyms: null,
      validNameInput: true,
      // 主词是否在同一个一级目录下的其他子目录下，与其他主词或同义词重复
      isWordNameDuplicateInOtherCategory: false,
      addSynonymTooltip: {
        msg: this.$t('wordbank.message.duplicate_synonym'),
        eventOnly: true,
        errorType: true,
        alignLeft: true,
      },
      wordbankNameTooltip: {
        msg: '',
        eventOnly: true,
        errorType: true,
        alignLeft: true,
      },
      editingSynonymsTooltip: {
        msg: this.$t('wordbank.message.duplicate_synonym'),
        eventOnly: true,
        errorType: true,
        alignLeft: true,
      },
    };
  },
  computed: {
    ...mapGetters([
      'robotID',
    ]),
    isEditMode() {
      return this.wordbank && this.wordbank.id;
    },
    isSensitive() {
      let isSen = false;
      if (this.categoryPathMap && this.wordbank.cid
      && this.categoryPathMap[this.wordbank.cid]) {
        isSen = this.categoryPathMap[this.wordbank.cid].indexOf('敏感词库') === 0 ||
        this.categoryPathMap[this.wordbank.cid].indexOf('敏感詞庫') === 0;
      }
      return isSen;
    },
    hideWordSpell() {
      const hideCategories = [
        '敏感词库',
        '转人工词库',
        '任务引擎词库',
        '解析器词库',
        '敏感詞庫',
        '转人工词库',
        '轉人工詞庫',
        '任務引擎詞庫',
        '解析器詞庫',
      ];
      let isHide = false;
      if (this.categoryPathMap && this.wordbank.cid
      && this.categoryPathMap[this.wordbank.cid]) {
        for (let i = 0; i < hideCategories.length; i += 1) {
          const cate = hideCategories[i];
          if (this.categoryPathMap[this.wordbank.cid].indexOf(cate) === 0) {
            isHide = true;
            break;
          }
        }
      }
      return isHide;
    },
    totalSynWordsCount() {
      return this.synonyms.length || 0;
    },
    selSynWordsCount() {
      return this.checkedSynonyms.length || 0;
    },
    currentPageWords() {
      const startIdx = (this.curPageIdx - 1) * this.pageLimit;
      const endIdx = startIdx + this.pageLimit;
      return this.currentSynonyms.slice(startIdx, endIdx);
    },
    curTotal() {
      return this.currentSynonyms.length;
    },
    lastPageIdx() {
      return Math.floor((this.curTotal - 1) / this.pageLimit) + 1;
    },
    // 主词验证
    isWordbankNameValid() {
      return !this.isWordbankNameEmpty && !this.isWordbankNameTooLong
        && !this.isWordbankNameDuplicate;
    },
    isWordbankNameEmpty() {
      return this.wordbankName.trim() === '';
    },
    isWordbankNameTooLong() {
      this.wordbankName = this.wordbankName.trim();
      return this.wordbankName.length > this.wordNameLengthLimit;
    },
    isWordbankNameDuplicate() {
      if (this.wordbankName.trim() === this.wordbank.name) { // same, don't check
        return false;
      }
      const duplicateInSameCategory = this.existWordbanks
        .findIndex(bank => bank.name === this.wordbankName) !== -1;
      return duplicateInSameCategory || this.isWordNameDuplicateInOtherCategory;
    },
    // 同义词验证
    isNewSynonymValid() {
      return !this.isNewSynonymEmpty && !this.isNewSynonymTooLong;
    },
    isNewSynonymEmpty() {
      this.newSynonym = this.newSynonym.trim();
      return this.newSynonym === '';
    },
    isNewSynonymTooLong() {
      this.newSynonym = this.newSynonym.trim();
      return this.newSynonym.length > this.synonymLengthLimit;
    },
    isNewSynonymDuplicate() {
      return this.newSynonym !== '' && this.synonyms.filter(synonym => synonym.name === this.newSynonym.trim()).length > 0;
    },
    isEditSynValid() {
      return !this.isEditSynDuplicate && !this.isEditSynEmpty;
    },
    isEditSynDuplicate() {
      return this.editingSynonyms && this.editingSynonymsInput !== this.editingSynonyms.name
      && this.synonyms.filter(synonym => synonym.name === this.editingSynonymsInput).length > 0;
    },
    isEditSynEmpty() {
      return this.editingSynonyms && this.editingSynonymsInput.trim() === '';
    },
  },
  mounted() {
    this.setWordbankEdit();
  },
  watch: {
    wordbank() {
      this.setWordbankEdit();
    },
    synonymKeyword() {
      if (this.synonymKeyword !== '') {
        this.filteredSynonyms = this.synonyms
          .filter(word => word.name.indexOf(this.synonymKeyword) !== -1);
        this.currentSynonyms = this.filteredSynonyms;
      } else {
        this.currentSynonyms = this.synonyms;
        this.filteredSynonyms = [];
      }
      this.toFirstPage();
    },
    wordbankName() {
      this.isWordNameDuplicateInOtherCategory = false;
    },
    isWordbankNameEmpty() {
      this.updateNameTooltip();
    },
    isWordbankNameDuplicate() {
      this.updateNameTooltip();
    },
    isWordNameDuplicateInOtherCategory() {
      this.updateNameTooltip();
    },
    isEditSynDuplicate() {
      this.updateEditSynTooltip();
    },
    isEditSynEmpty() {
      this.updateEditSynTooltip();
    },
    isNewSynonymDuplicate() {
      if (!this.isNewSynonymDuplicate) {
        this.$refs.synonymInput.dispatchEvent(event.createEvent('tooltip-hide'));
      } else {
        this.$refs.synonymInput.dispatchEvent(event.createEvent('tooltip-show'));
      }
    },
  },
  methods: {
    // 更新词条状态
    handleSwitchEffect() {
      if (!this.isEditMode) {
        return;
      }
      this.$api.apiUpdateWordbank(this.robotID, this.wordbankId, this.categoryId,
      this.wordbank.name, this.wordbankEffect, this.wordbank.spell).then((res) => {
        if (res.status === 0) {
          // 更新列表中的状态
          this.wordbank.effect = this.wordbankEffect;
          this.$message({ message: this.$t('wordbank.message.word_effect_success'), type: 'success' });
          this.$emit('refresh');
        } else {
          this.$message({ message: res.message || this.$t('wordbank.message.word_effect_fail'), type: 'warning' });
        }
      }).catch(() => {
        this.$message({ message: this.$t('wordbank.message.word_effect_fail'), type: 'error' });
      });
    },
    // 更新主词拼音纠错
    handleSwitchSepll() {
      if (!this.isEditMode) {
        return;
      }
      this.$api.apiUpdateWordbank(this.robotID, this.wordbankId, this.categoryId,
      this.wordbank.name, this.wordbank.effect, this.wordbankSpell).then((res) => {
        if (res.status === 0) {
          // 更新列表中的状态
          this.wordbank.spell = this.wordbankSpell;
          this.$message({ message: this.$t('wordbank.message.word_spell_success'), type: 'success' });
          this.$emit('refresh');
        } else {
          this.$message({ message: res.message || this.$t('wordbank.message.word_spell_fail'), type: 'warning' });
        }
      }).catch(() => {
        this.$message({ message: this.$t('wordbank.message.word_spell_fail'), type: 'error' });
      });
    },
    // 更新主词文字
    handleEditWordbankName() {
      if (!this.isWordbankNameValid || !this.isEditMode) {
        return;
      }
      if (this.isEditMode) {
        this.isUpdatingWB = true;
        this.isWordNameDuplicateInOtherCategory = false;
        this.$api.apiUpdateWordbank(this.robotID, this.wordbankId, this.categoryId,
        this.wordbankName, this.wordbank.effect, this.wordbank.spell).then((res) => {
          if (res.status === 0) {
            // 更新列表中的状态
            this.wordbank.name = this.wordbankName;
            this.$message({ message: this.$t('wordbank.message.word_name_success'), type: 'success' });
            this.$emit('refresh');
          } else if (res.status === 1) {
            this.isWordNameDuplicateInOtherCategory = true;
          } else {
            this.$message({ message: res.message || this.$t('wordbank.message.word_name_fail'), type: 'warning' });
          }
        }).catch(() => {
          this.$message({ message: this.$t('wordbank.message.word_name_fail'), type: 'error' });
        }).finally(() => {
          this.isUpdatingWB = false;
        });
      }
    },
    // 切换敏感词回答类型
    handleSwitchSensitive() {
      if (this.isSensitive && this.isDefaultSensitive) {
        this.sensitiveAnswer = '';
        this.handleChangeSensitiveWord();
      }
    },
    // 更新敏感词回答
    handleChangeSensitiveWord() {
      if (!this.isEditMode || this.wordbank.answer === this.sensitiveAnswer) {
        return;
      }
      this.isUpdatingWB = true;
      this.$api.apiUpdateWordbank(this.robotID, this.wordbankId, this.categoryId,
      this.wordbank.name, this.wordbank.effect, this.wordbank.spell,
      this.sensitiveAnswer).then((res) => {
        if (res.status === 0) {
          // 更新列表中的状态
          this.wordbank.answer = this.sensitiveAnswer;
          this.$message({ message: this.$t('wordbank.message.word_sensitive_success'), type: 'success' });
          this.$emit('refresh');
        } else {
          this.$message({ message: res.message || this.$t('wordbank.message.word_sensitive_fail'), type: 'warning' });
        }
      }).catch(() => {
        this.$message({ message: this.$t('wordbank.message.word_sensitive_fail'), type: 'error' });
      }).finally(() => {
        this.isUpdatingWB = false;
      });
    },
    // 添加同义词
    addSynonym() {
      this.newSynonym = this.newSynonym.trim();
      if (this.wasCompositioning) {
        return;
      }
      if (this.isNewSynonymDuplicate) {
        this.$refs.synonymInput.dispatchEvent(event.createEvent('tooltip-show'));
        return;
      }
      this.$refs.synonymInput.dispatchEvent(event.createEvent('tooltip-hide'));
      const newSynWordObj = {
        pid: this.wordbankId,
        name: this.newSynonym.trim(),
        spell: false,
      };
      if (!this.isNewSynonymValid) {
        return;
      }
      if (this.isEditMode) {
        this.isUpdatingWB = true;
        this.$api.apiAddSimilarWord(this.robotID, this.wordbankId,
        this.newSynonym.trim(), false).then((res) => {
          if (res.status === 0) {
            if (!res.message || res.message === 'success') {
              this.$message({ message: this.$t('wordbank.message.add_synonym_success'), type: 'success' });
            } else {
              this.$message({ message: res.message, type: 'success' });
            }
          } else {
            this.$message({ message: res.message || this.$t('wordbank.message.add_synonym_fail'), type: 'warning' });
          }
          newSynWordObj.id = res.result.id;
          this.synonyms.unshift(newSynWordObj);
          this.currentSynonyms = this.synonyms;
          this.toFirstPage();
          this.newSynonym = '';
          this.$emit('refresh');
        }).catch(() => {
          this.$message({ message: this.$t('wordbank.message.add_synonym_fail'), type: 'error' });
        }).finally(() => {
          this.isUpdatingWB = false;
        });
      } else {
        this.synonyms.unshift(newSynWordObj);
        this.currentSynonyms = this.synonyms;
        this.toFirstPage();
        this.newSynonym = '';
        this.$nextTick(() => {
          this.synonymKeyword = '';
        });
      }
    },
    // 删除同义词
    deleteSynonym(synWords) {
      if (!synWords || !synWords.length) {
        return;
      }
      synWords.forEach((toDelete) => {
        const idx = this.synonyms.findIndex(synonym => synonym === toDelete);
        if (idx !== -1) {
          this.synonyms.splice(idx, 1);
          if (this.currentSynonyms === this.filteredSynonyms) {
            const filteredIdx = this.filteredSynonyms.findIndex(word => word === toDelete);
            this.filteredSynonyms.splice(filteredIdx, 1);
          }
          if (this.curPageIdx > this.lastPageIdx) {
            this.toCurPage(this.lastPageIdx);
          }
        }
      });
    },
    confirmBatchDeleteSimilarW(synWords) {
      if (!synWords.length) {
        return;
      }
      this.$confirm(this.$t('wordbank.confirm_delete_synonym'), this.$t('general.description'), {
        confirmButtonText: this.$t('general.ok'),
        cancelButtonText: this.$t('general.cancel'),
        type: 'warning',
        showClose: false,
      }).then(() => {
        this.batchDeleteSimilarWord(synWords);
      }).catch(() => {
        this.$message({ message: this.$t('general.canceled'), type: 'info' });
      });
    },
    // 删除同义词
    batchDeleteSimilarWord(synWords) {
      if (this.isEditMode) {
        const idArr = [];
        const nameArr = [];
        synWords.forEach((word) => {
          idArr.push(word.id);
          nameArr.push(word.name);
        });
        this.isUpdatingWB = true;
        this.$api.apiBatchDeleteSynWords(this.robotID, idArr, nameArr).then((res) => {
          if (res.status === 0) {
            this.deleteSynonym(synWords);
            this.$message({ message: this.$t('wordbank.message.delete_synonym_success'), type: 'success' });
            this.$emit('refresh');
          } else {
            this.$message({ message: res.message || this.$t('wordbank.message.delete_synonym_fail'), type: 'warning' });
          }
        }).catch(() => {
          this.$message({ message: this.$t('wordbank.message.delete_synonym_fail'), type: 'error' });
        }).finally(() => {
          this.isUpdatingWB = false;
          this.checkedSynonyms = [];
        });
      } else {
        this.deleteSynonym(synWords);
      }
    },
    updateEditSynTooltip() {
      if (!this.$refs.editingSynonyms) {
        return;
      }
      if (this.isEditSynDuplicate) {
        this.editingSynonymsTooltip.msg = this.$t('wordbank.message.duplicate_synonym');
        this.$refs.editingSynonyms.dispatchEvent(event.createEvent('tooltip-reload'));
        this.$refs.editingSynonyms.dispatchEvent(event.createEvent('tooltip-show'));
      } else if (this.isEditSynEmpty) {
        this.editingSynonymsTooltip.msg = this.$t('wordbank.message.empty_synonym');
        this.$refs.editingSynonyms.dispatchEvent(event.createEvent('tooltip-reload'));
        this.$refs.editingSynonyms.dispatchEvent(event.createEvent('tooltip-show'));
      } else {
        this.$refs.editingSynonyms.dispatchEvent(event.createEvent('tooltip-hide'));
      }
    },
    // 修改同义词名称
    handleEditSynonymsName() {
      if (this.isEditSynDuplicate || this.isEditSynEmpty) {
        this.updateEditSynTooltip();
        return;
      }
      if (this.editingSynonymsInput === this.editingSynonyms.name) {
        return;
      }
      if (this.isEditMode && this.editingSynonyms.id) {
        this.isUpdatingWB = true;
        this.$api.apiUpdateSimilarWord(this.robotID, this.wordbankId,
        this.editingSynonyms.id, this.editingSynonymsInput,
        this.editingSynonyms.spell).then((res) => {
          if (res.status === 0) {
            if (!res.message || res.message === 'success') {
              this.$message({ message: this.$t('wordbank.message.update_synonym_success'), type: 'success' });
            } else {
              this.$message({ message: res.message, type: 'success' });
            }
          } else {
            this.$message({ message: res.message || this.$t('wordbank.message.update_synonym_fail'), type: 'warning' });
          }
          this.editingSynonyms.name = this.editingSynonymsInput;
          this.$emit('refresh');
        }).catch(() => {
          this.$message({ message: this.$t('wordbank.message.update_synonym_fail'), type: 'error' });
        }).finally(() => {
          this.clearEditSynonymsName();
          this.isUpdatingWB = false;
        });
      } else {
        this.editingSynonyms.name = this.editingSynonymsInput;
        this.clearEditSynonymsName();
      }
    },
    clearEditSynonymsName() {
      this.editingSynonymsInput = '';
      this.editingSynonyms = null;
      this.$refs.editingSynonyms.dispatchEvent(event.createEvent('tooltip-hide'));
    },
    handleSwitchSynSpell(synWord) {
      if (!this.isEditMode || !synWord.id) {
        return;
      }
      this.isUpdatingWB = true;
      this.$api.apiUpdateSimilarWord(this.robotID, this.wordbankId,
      synWord.id, synWord.name, synWord.spell).then((res) => {
        if (res.status === 0) {
          this.$message({ message: this.$t('wordbank.message.synonym_spell_success'), type: 'success' });
        } else {
          // 更新失败回滚
          synWord.spell = !synWord.spell;
          this.$message({ message: res.message || this.$t('wordbank.message.synonym_spell_fail'), type: 'warning' });
          this.$emit('refresh');
        }
      }).catch(() => {
        // 更新失败回滚
        synWord.spell = !synWord.spell;
        this.$message({ message: this.$t('wordbank.message.synonym_spell_fail'), type: 'error' });
      }).finally(() => {
        this.isUpdatingWB = false;
      });
    },
    handleSelectionChange(val) {
      this.checkedSynonyms = val;
    },
    handleEditSimilarWord(index, data) {
      this.editingSynonymsInput = data.name;
      this.editingSynonyms = data;
      this.$nextTick(() => {
        this.$refs.editingSynonyms.focus();
      });
    },
    handleClose() {
      this.$emit('input', false);
    },
    toFirstPage() {
      this.curPageIdx = 1;
    },
    toCurPage(page) {
      this.curPageIdx = page;
    },
    handlePageChange(page) {
      this.toCurPage(page);
      this.checkedSynonyms = [];
    },
    handlePageSizeChange(pageSize) {
      this.pageLimit = pageSize;
      this.toFirstPage();
      this.checkedSynonyms = [];
    },
    setCompositionState(bool) {
      this.compositionState = bool;
    },
    detectCompositionState() {
      this.wasCompositioning = this.compositionState;
    },
    // 批量启用同义词
    enableMultiSynonym() {
      this.batchUpdateSynWords(this.checkedSynonyms, true);
    },
    // 批量停用同义词
    disableMultiSynonym() {
      console.log('disableMultiSynonym');
      this.batchUpdateSynWords(this.checkedSynonyms, false);
    },
    // 批量修改同义词拼音纠错
    batchUpdateSynWords(synWords, isEnable) {
      if (!synWords || !synWords.length) {
        return;
      }
      const idArr = [];
      synWords.forEach((word) => {
        idArr.push(word.id);
      });
      if (this.isEditMode) {
        this.isUpdatingWB = true;
        this.$api.apiBatchUpdateSynWords(this.robotID, idArr, isEnable).then((res) => {
          if (res) {
            this.$message({ message: this.$t('wordbank.message.synonym_spell_success'), type: 'success' });
            this.batchChangeSynWords(synWords, isEnable);
            this.$emit('refresh');
          } else {
            this.$message({ message: res.message || this.$t('wordbank.message.synonym_spell_fail'), type: 'warning' });
          }
        }).catch(() => {
          this.$message({ message: this.$t('wordbank.message.synonym_spell_fail'), type: 'error' });
        }).finally(() => {
          this.isUpdatingWB = false;
        });
      } else {
        this.batchChangeSynWords(synWords, isEnable);
      }
    },
    batchChangeSynWords(synWords, isEnable) {
      synWords.forEach((word) => {
        word.spell = isEnable;
      });
    },
    // 批量删除同义词
    deleteMultiSynonym() {
      if (!this.checkedSynonyms || !this.checkedSynonyms.length) {
        return;
      }
      this.confirmBatchDeleteSimilarW(this.checkedSynonyms);
    },
    updateNameTooltip() {
      if (!this.$refs.wordbankName) {
        return;
      }
      if (!this.isWordbankNameValid) {
        this.$emit('disableOK');
        this.validNameInput = false;
        if (this.isWordbankNameEmpty) {
          this.wordbankNameTooltip.msg = this.$t('wordbank.message.wordbank_name_empty');
        } else if (this.isWordbankNameDuplicate) {
          this.wordbankNameTooltip.msg = this.$t('wordbank.message.wordbank_name_duplicate');
        }
        this.$refs.wordbankName.dispatchEvent(event.createEvent('tooltip-reload'));
        this.$refs.wordbankName.dispatchEvent(event.createEvent('tooltip-show'));
      } else {
        this.$emit('enableOK');
        this.validNameInput = true;
        this.$refs.wordbankName.dispatchEvent(event.createEvent('tooltip-hide'));
      }
    },
    setWordbankEdit() {
      // 初始化编辑框数据
      this.wordbankId = this.wordbank.id || '';
      this.categoryId = this.wordbank.cid || '';
      this.wordbankName = this.wordbank.name || '';
      // 词条状态默认开启
      this.wordbankEffect = this.wordbank.effect === undefined ? true : this.wordbank.effect;
      // 词条拼音纠错默认关闭
      this.wordbankSpell = this.wordbank.spell === undefined ? false : this.wordbank.spell;
      this.synonyms = this.wordbank.similarInfos || [];
      this.currentSynonyms = this.synonyms;
      this.sensitiveAnswer = this.wordbank.answer || '';
      this.isDefaultSensitive = this.sensitiveAnswer.length === 0;
    },
    handleValidate() {
      // 连续点击多次确认按钮时，会创建多条记录
      if (this.isCreatingWB) {
        return;
      }
      const wordbankNameElem = this.$refs.wordbankName;
      if (!this.isWordbankNameValid) {
        wordbankNameElem.focus();
        return;
      }
      if (this.isWordbankNameDuplicate) {
        wordbankNameElem.focus();
        this.$refs.wordbankName.dispatchEvent(event.createEvent('tooltip-show'));
        return;
      }
      // 新增词条
      if (!this.isEditMode) {
        this.handleAddWordbank();
      } else {
        if (this.updateTimer) {
          window.clearTimeout(this.updateTimer);
        }
        if (this.isUpdatingWB) {
          this.updateTimer = window.setTimeout(() => {
            this.handleValidate();
          }, 500);
        } else {
          this.handleClose();
        }
      }
    },
    // 添加主词
    handleAddWordbank() {
      this.showLoading = true;
      this.isCreatingWB = true;
      this.isWordNameDuplicateInOtherCategory = false;
      this.$api.apiAddWordbank(this.robotID, this.categoryId, this.wordbankEffect,
      this.wordbankSpell, this.wordbankName.trim(),
      this.synonyms, this.sensitiveAnswer).then((res) => {
        if (res.status === 0) {
          if (!res.message || res.message === 'success') {
            this.$message({ message: this.$t('wordbank.message.add_wordbank_success'), type: 'success' });
          } else {
            this.$message({ message: res.message, type: 'success' });
          }
          this.$emit('refresh');
          this.handleClose();
        } else if (res.status === 1 && res.result) {
          if (res.result.type === 1) {
            // 主词重复
            this.isWordNameDuplicateInOtherCategory = true;
          } else if (res.result.type === 2) {
            // 同义词重复
            this.$message({
              message: `${res.message}: ${res.result.failname}` || this.$t('wordbank.message.add_wordbank_fail'),
              type: 'warning',
            });
            this.$emit('refresh');
            this.handleClose();
          }
        } else {
          this.$message({ message: res.message || this.$t('wordbank.message.add_wordbank_fail'), type: 'warning' });
        }
      }).catch(() => {
        this.$message({ message: this.$t('wordbank.message.add_wordbank_fail'), type: 'error' });
      }).finally(() => {
        this.showLoading = false;
        this.isCreatingWB = false;
      });
    },
  },
};
</script>
<style lang="scss" scoped>
@import 'styles/variable';
.wb-editor-wrapper{
  /deep/ .el-dialog{  
    width: 770px;
    margin-top: 5vh !important;
    .el-dialog__body{
      padding: 20px 0px;
    }
  }
  .header-wrapper{
    .header-line{
      margin-bottom: 12px;
      padding: 0px 20px;
      display: flex;
      align-items: center;
      &.toolbar{
        margin: 20px 0px;
      }
      .label{
        min-width: 80px;
        margin-right: 10px;
      }
      .sencond-label{
        margin-left: 20px;
      }
      .total-count{
        color: $color-font-mark;
        margin-left: 10px;
        flex: 1;
      }
      >input{
        width: 293px;
      }
      button{
        margin-right: 10px;
      }
      .search-input{
        width: 160px;
        font-size: 14px;
      }
      .radio-left{
        width: 40px;
      }
      .radio-right{
        width: 100px;
      }
      .sensitive-answer{
        flex: 1;
      }
    }
  }
  .content-wrapper{
    position: relative;
    .spell-tooltip{
      position: absolute;
      right: 170px;
      top: 16px;
      font-size: 16px;
      z-index: 10;
      cursor: pointer;
      color: #BABABA;
      &:hover{
        color: $active-color;
      }
    }
    /deep/ .el-table{
      height: 240px;
      display: flex;
      flex-direction: column;
      .el-table__header-wrapper{
        min-height: 50px;
      }
      .el-table__body-wrapper{
        overflow-y: scroll;
        flex: 1;
      }
      &::before{
        height: 0px !important;
      }
    }
    .edit-sync-input{
      width: 100%;
    }
    .pager-wrapper{
      padding: 10px 20px 0px 0px;
      text-align: right;
    }
  }
  .footer-wrapper{
    text-align: right;
    .btn-small{
      margin-left: 10px;
    }
  }
  .invalid-input{
    background-color: $color-input-error;
  }
}
</style>
