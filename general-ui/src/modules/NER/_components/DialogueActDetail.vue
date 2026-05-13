<template>
  <div class="dialogue-act-detail">
    <div class="header-box">
      <span class="title">{{$t('parser.classifier.classifier_detail')}}</span>
      <el-popover placement="bottom" width="220"
      trigger="manual" v-model="showConfirmPopover">
        <p style="text-align: center;font-size:12px;line-height:20px">{{$t('parser.classifier.goback_warn')}}</p>
        <p style="text-align: center;font-size:12px;line-height:20px">{{$t('parser.classifier.after_goback')}}</p>
        <div style="text-align: right; margin-top:10px;">
          <button class="btn-small btn-white-gray" @click="cancelNavBack">{{$t('parser.classifier.cancel')}}</button>
          <button class="btn-small btn-dark-blue" style="margin-left:5px;"
            @click="handleNavBack">{{$t('parser.classifier.confirm_goback')}}</button>
        </div>
        <button ref="backBtn" class="btn-small btn-white-gray back-btn" slot="reference"
        @click.prevent.stop="handleClickNavBack">{{$t('parser.classifier.goback_to_list')}}</button>
      </el-popover>
      <button class="upload-btn btn-white-gray btn-small" @click="isUploadingFile = true">
        <i></i>导入
      </button>
      <button class="download-btn btn-small"
      :class="{'btn-disabled':!actDetailObj.classifierId, 'btn-white-gray':actDetailObj.classifierId}"
      @click="exportDialogAct">
        <i></i>{{$t('parser.classifier.export')}}
      </button>
      <button class="btn-small btn-dark-blue save-btn" @click="handleSaveParser">{{$t('parser.classifier.save_and_train')}}</button>
    </div>
    <div class="content-wrapper">
      <div class="basic-info-wrapper">
        <div class="section-title">{{$t('parser.classifier.class_detail')}}</div>
        <div class="basic-info-box">
          <div class="row">
            <span class="mandatory-mark">*</span>
            <span class="row-title">{{$t('parser.classifier.class_name')}}</span>
            <el-input class="input-box" v-model="actDetailObj.classifierName"
            :maxlength="100"
            size="mini" :placeholder="$t('parser.classifier.please_enter')" @change="markDataChanged"></el-input>
          </div>
          <div class="row">
            <span class="row-title">{{$t('parser.classifier.class_explain')}}</span>
            <el-input class="input-box" v-model="actDetailObj.description"
            :maxlength="100"
            size="mini" :placeholder="$t('parser.classifier.please_enter')" @change="markDataChanged"></el-input>
          </div>
          <div class="row">
            <span class="mandatory-mark">*</span>
            <span class="row-title">{{$t('parser.library.return_slot')}}</span>
            <el-input class="input-box" v-model="actDetailObj.predictSlotName"
            :maxlength="20"
            size="mini" :placeholder="$t('parser.classifier.please_enter')" @change="markDataChanged"></el-input>
          </div>
          <div class="row">
            <span class="row-title">{{$t('parser.library.slot_desc')}}</span>
            <el-input class="input-box" v-model="actDetailObj.predictSlotDesc"
            :maxlength="100"
            size="mini" :placeholder="$t('parser.classifier.please_enter')" @change="markDataChanged"></el-input>
          </div>
        </div>
      </div>
      <div class="tags-list-wrapper">
        <div class="section-box">
          <span class="section-title">{{$t('parser.classifier.class_corpus_edit')}}</span>
          <button class="btn-small btn-white-gray" :class="{'btn-disabled': isAllTagExpanded}"
          @click="handleExpandAllTags">{{$t('parser.classifier.expand_all')}}</button>
          <button class="btn-small btn-white-gray" :class="{'btn-disabled': isAllTagsCollapsed}"
          @click="handleCollapseAllTags">{{$t('parser.classifier.collapse_all')}}</button>
        </div>
        <el-collapse v-model="activeTagsCollapse" class="emotibot tags-collapse" ref="tagCollapse">
          <el-collapse-item v-for="(tag, index) in uiTagsList" :key="tag.uuid"
          :name="tag.uuid">
            <template slot="title">
              <div class="tag-header-box">
                <div class="display-box" v-if="editingTagIndex !== index">
                  <span class="tag-title">{{ tag.tagName }}</span>
                  <span class="tag-description">{{ tag.tagDesc }}</span>
                  <i class="edit-tag-btn"
                  v-if="tag.tagName!=='Other'"
                  @click.stop.prevent="handleEditTagInfo(index, tag)"></i>
                </div>
                <div class="edit-box" v-else>
                  <el-input v-model="editingTagName" size="mini" ref="editTagName" class="tag-name-input"
                  :placeholder="$t('parser.classifier.tag_name')" @keyup.native.prevent.stop="" @click.native.prevent.stop=""
                  :maxlength="20"
                  @keyup.enter.native.prevent.stop="handleSaveTagInfo(tag)"></el-input>
                  <el-input v-model="editingTagDesc" size="mini" class="tag-desc-input"
                  :placeholder="$t('parser.classifier.tag_desc')" @keyup.native.prevent.stop="" @click.native.prevent.stop=""
                  :maxlength="100"
                  @keyup.enter.native.prevent.stop="handleSaveTagInfo(tag)"></el-input>
                  <span class="save-btn" @click.stop.prevent="handleSaveTagInfo(tag)">{{$t('parser.classifier.finish')}}</span>
                </div>
                <el-popover v-if="tag.tagName!=='Other'"
                placement="left" width="220" trigger="click">
                  <p style="text-align: center;font-size:12px;line-height:20px">{{$t('parser.classifier.confirm_delete')}}</p>
                  <p style="text-align: center;font-size:12px;line-height:20px">{{$t('parser.classifier.after_delete_class')}}</p>
                  <div style="text-align: right; margin-top:10px;">
                    <button class="btn-small btn-white-gray" @click="cancelDeleteTag(index)">{{$t('parser.classifier.cancel_delete')}}</button>
                    <button class="btn-small btn-dark-blue" style="margin-left:5px;"
                     @click="handleDeleteTag(index)">{{$t('parser.classifier.delete_all')}}</button>
                  </div>
                  <span ref="deleteTag" class="delete-btn" slot="reference"
                  @click.prevent.stop="">{{$t('parser.classifier.delete_class')}}</span>
                </el-popover>
              </div>
            </template>
            <div class="tag-corpus-wrapper">
              <el-tabs v-model="tag.activeTab">
                <el-tab-pane :label="$t('parser.classifier.define_corpus')" name="corpusTab">
                  <reference-input class="corpurs-input"
                  v-if="isTagItemExpanded(tag)" v-model="tag.corpusInputValue"
                  :maxlength="200"
                  :referenceList="dropdownSlotsList" @enter="handleAddCorpus($event, tag)"
                  :placeholder="$t('parser.classifier.add_corpus_placeholder')"></reference-input>
                  <div class="table-header">
                    <div class="col flex6">{{$t('parser.classifier.corpus')}}</div>
                    <div class="col flex2">{{$t('parser.classifier.class')}}</div>
                    <!-- <div class="col flex1">上文关联</div> -->
                    <div class="col flex1">{{$t('parser.classifier.operation')}}</div>
                  </div>
                  <div class="table-content">
                    <div class="table-row" v-for="(corpus, corpusIndex) in tag.corpusesInfo"
                    :key="corpusIndex">
                      <div class="cell flex6">
                        <el-input v-if="editingCorpusTag === tag && editingCorpusObj === corpus"
                        ref="corpusInput" v-model="editingCorpusName"
                        @keyup.enter.native="handleSaveCorpus(tag, corpus)" @blur="cancelEditCorpus"
                        class="corpus-input-box" size="mini"></el-input>
                        <span v-else>{{ corpus.content }}</span>
                      </div>
                      <div class="cell flex2">
                        <el-select v-model="corpus.tags" class="tags-selector"
                        @change="handleChangeSelTags($event, tag, corpus)"
                        @remove-tag="handleRemoveSelTags($event, tag, corpus)"
                        @visible-change="handleSelTagsVisible($event, tag, corpus)"
                        multiple filterable>
                          <el-option v-for="item in uiTagsList"
                          :key="item.tagName" :label="item.tagName" :value="item.tagName">
                          </el-option>
                        </el-select>
                      </div>
                      <div class="cell flex1">
                        <i class="btn-edit" @click="handleEditCorpus(tag, corpus)"></i>
                        <i class="btn-delete" @click="handleDeleteCorpus(tag, corpus)"></i>
                      </div>
                    </div>
                  </div>
                </el-tab-pane>
                <el-tab-pane :label="$t('parser.classifier.system_model')" name="systemActTab">
                  <div class="system-act-box">
                    <div class="selector-box">
                      <el-select v-model="tag.systemActLogicNames" @change="handleChangeSystemAct(tag)"
                        multiple collapse-tags class="tags-selector system-acts-selector">
                        <el-option v-for="item in systemActList"
                          :key="item.sysActLogicName" :label="item.sysActName" :value="item.sysActLogicName">
                        </el-option>
                      </el-select>
                      <div class="selector-placeholder">{{$t('parser.classifier.select_system_model')}}</div>
                      <span class="desc">{{$t('parser.classifier.select_system_model_desc')}}</span>
                    </div>
                    <div class="system-act-list">
                      <div class="system-act" v-for="(sysAct, index) in tag.systemActInfo" :key="index">
                        <span class="act-name">{{ sysAct.sysActName }}</span>
                        <emoti-icon class="act-icon" name="icon-edit-01" :size="18"
                        @click="handleTestSystemAct(sysAct)"></emoti-icon>
                        <emoti-icon class="act-icon" name="icon-delete" :size="18"
                        @click="handleRemoveSystemAct(tag, sysAct.sysActLogicName)"></emoti-icon>
                      </div>
                    </div>
                  </div>
                </el-tab-pane>
              </el-tabs>
            </div>
          </el-collapse-item>
        </el-collapse>
        <button class="add-tag-btn"
        :class="{'btn-disabled':editingTagIndex!==-1, 'btn-dark-blue':editingTagIndex===-1}"
        v-if="uiTagsList && uiTagsList.length && uiTagsList.length < 20"
        @click="handleAddTag">+{{$t('parser.classifier.add_class')}}</button>
      </div>
    </div>
    <upload-excel v-model="isUploadingFile"
    :uploadModesArray="['replace']" :showTemplate="false"
    @upload="importActContent" @downloadTempl="downloadActTemplate"></upload-excel>
    <parser-tester v-model="isTestingSystemAct" :title="testingSysActTitle"
    :testTableData="sysActTestResult" @test="handleTestSysAct"></parser-tester>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import ReferenceInput from '@/components/ReferenceInput';
import UploadExcel from '@/components/UploadExcel';
import ParserTester from './ParserTester';
import api from '../_api/dialogueAct';

export default {
  props: {
    actDetailObj: {
      type: Object,
      default: null,
    },
  },
  api,
  data() {
    return {
      isDataChanged: false,
      needRefreshList: false, // 是否保存过数据库
      showConfirmPopover: false,
      activeTagsCollapse: [],
      uiTagsList: [],
      // 编辑标签基础信息
      editingTagIndex: -1,
      editingTagName: '',
      editingTagDesc: '',
      // 编辑标签语料
      editingCorpusTag: null,
      editingCorpusObj: null,
      editingCorpusName: '',
      // 导入导出
      isUploadingFile: false,
      systemActList: [],
      // 测试系统对话行为分类器
      isTestingSystemAct: false,
      testingSysActTitle: '',
      testingSysActObj: null,
      sysActTestResult: [],
    };
  },
  created() {
    this.initializeData();
    this.$api.getSystemActList().then((res) => {
      this.systemActList = res.data || [];
    }).catch(() => {
      this.$message({
        message: this.$t('parser.classifier.get_sysmodel_list_failed'),
        type: 'error',
      });
    });
  },
  watch: {
    actDetailObj() {
      this.initializeData();
    },
  },
  components: {
    ReferenceInput,
    UploadExcel,
    ParserTester,
  },
  computed: {
    ...mapGetters([
      'robotID',
      'showLanguage',
    ]),
    isAllTagExpanded() {
      return this.activeTagsCollapse.length === this.uiTagsList.length;
    },
    isAllTagsCollapsed() {
      return this.activeTagsCollapse.length === 0;
    },
    dropdownSlotsList() {
      const list = [];
      if (this.actDetailObj.predictSlotName) {
        list.push({
          title: this.actDetailObj.predictSlotName,
          description: this.actDetailObj.predictSlotDesc,
        });
      }
      return list;
    },
  },
  methods: {
    initializeData() {
      this.actDetailObj.useGeneralModel = Boolean(this.actDetailObj.useGeneralModel);
      this.uiTagsList = [].concat(this.actDetailObj.tagsInfo);
      this.uiTagsList = this.uiTagsList.map(v => ({
        ...v,
        corpusesInfo: v.corpusesInfo.map(cor => ({
          ...cor,
          tags: this.calculateTagsListOfCorpus(cor.content, v.tagName),
        })),
        uuid: v.id,
        corpusInputValue: '',
        activeTab: 'corpusTab',
        systemActLogicNames: v.systemActInfo && v.systemActInfo.length ?
        v.systemActInfo.map(sysAct => sysAct.sysActLogicName) : [],
      }));
    },
    calculateTagsListOfCorpus(corpus, currentTag) {
      console.log(`corpus = ${corpus}, currentTag = ${currentTag}`);
      const allTagsList = this.uiTagsList || [];
      const otherTags = allTagsList.filter((tagInfo) => {
        if (tagInfo.tagName === currentTag) {
          return false;
        }
        const sameCorpus = tagInfo.corpusesInfo.filter(corp => corp.content === corpus);
        return sameCorpus.length > 0;
      });
      const otherTagsName = otherTags.map(tag => tag.tagName);
      console.log(`result = ${[currentTag].concat(otherTagsName)}`);
      return [currentTag].concat(otherTagsName);
    },
    finalizeData() {
      // this.actDetailObj.useGeneralModel = this.actDetailObj.useGeneralModel ? 1 : 0;
      this.actDetailObj.tagsInfo = this.uiTagsList.map(v => ({
        ...v,
        corpusesInfo: v.corpusesInfo.map(cor => ({
          ...cor,
          tags: undefined,
        })),
        uuid: undefined,
        corpusInputValue: undefined,
        activeTab: undefined,
        systemActLogicNames: undefined,
      }));
      const saveObj = Object.assign({}, this.actDetailObj);
      saveObj.useGeneralModel = saveObj.useGeneralModel ? 1 : 0;
      return saveObj;
    },
    validateData() {
      console.log(this.actDetailObj);
      if (!this.actDetailObj.classifierName) {
        this.$message({
          message: this.$t('parser.classifier.class_name_empty'),
          type: 'error',
        });
        return false;
      }
      if (!this.actDetailObj.predictSlotName) {
        this.$message({
          message: this.$t('parser.classifier.class_return_slot_empty'),
          type: 'error',
        });
        return false;
      }
      let validTags = true;
      this.uiTagsList.forEach((tag) => {
        if (tag.tagName !== 'Other' && tag.corpusesInfo.length < 1
        && tag.systemActLogicNames.length < 1) {
          validTags = false;
        }
      });
      if (!validTags) {
        this.$message({
          message: this.$t('parser.classifier.class_corpus_not_enough'),
          type: 'error',
        });
        return false;
      }
      return true;
    },
    handleSaveParser() {
      if (!this.validateData()) {
        return;
      }
      const saveObj = this.finalizeData();
      if (saveObj.id) {
        this.$api.updateDialogAct(saveObj).then((res) => {
          console.log(res);
          this.$message({
            message: this.$t('parser.classifier.classifier_saved'),
            type: 'success',
          });
          this.isDataChanged = false;
          this.needRefreshList = true;
          this.$emit('back', this.needRefreshList);
        }).catch((e) => {
          try {
            const message = JSON.parse(e.request.response).message;
            this.$message({
              message,
              type: 'error',
            });
          } catch (_) {
            this.$message({
              message: e.request && e.request.response ? e.request.response : this.$t('parser.classifier.classifier_saved'),
              type: 'error',
            });
          }
        });
      } else {
        this.$api.createDialogAct(saveObj).then((res) => {
          this.actDetailObj.id = res.data.classifierId || '';
          this.$message({
            message: this.$t('parser.classifier.classifier_saved'),
            type: 'success',
          });
          this.isDataChanged = false;
          this.needRefreshList = true;
          this.$emit('back', this.needRefreshList);
        }).catch((e) => {
          try {
            const message = JSON.parse(e.request.response).message;
            this.$message({
              message,
              type: 'error',
            });
          } catch (_) {
            this.$message({
              message: e.request && e.request.response ? e.request.response : this.$t('parser.classifier.classifier_saved'),
              type: 'error',
            });
          }
        });
      }
    },
    handleClickNavBack() {
      if (this.isDataChanged) {
        this.showConfirmPopover = !this.showConfirmPopover;
      } else {
        this.handleNavBack();
      }
    },
    // 返回列表
    handleNavBack() {
      this.$emit('back', this.needRefreshList);
      this.showConfirmPopover = false;
    },
    // 取消返回列表
    cancelNavBack() {
      this.showConfirmPopover = false;
    },
    markDataChanged() {
      this.isDataChanged = true;
    },
    // 当前标签的详情是否展开
    isTagItemExpanded(tag) {
      return this.activeTagsCollapse.indexOf(tag.uuid) !== -1;
    },
    // 收起全部
    handleCollapseAllTags() {
      this.activeTagsCollapse = [];
    },
    // 展开全部
    handleExpandAllTags() {
      this.activeTagsCollapse = this.uiTagsList.map(v => v.uuid);
    },
    // 新增标签
    handleAddTag() {
      if (this.editingTagIndex !== -1) {
        return;
      }
      const newTag = {
        uuid: this.generateUUID(),
        tagName: '',
        tagDesc: '',
        corpusesInfo: [],
        id: null,
        activeTab: 'corpusTab',
        classifierId: this.actDetailObj.classifierId,
        createdTime: '',
        updatedTime: '',
      };
      this.uiTagsList.push(newTag);
      this.$nextTick(() => {
        this.handleEditTagInfo(this.uiTagsList.length - 1, newTag);
      });
      this.markDataChanged();
    },
    generateUUID() {
      return Math.random();
    },
    // 编辑标签名字 + 描述
    handleEditTagInfo(index, tag) {
      this.editingTagIndex = index;
      this.editingTagName = tag.tagName;
      this.editingTagDesc = tag.tagDesc;
      this.$nextTick(() => {
        this.$refs.editTagName[0].focus();
      });
    },
    handleSaveTagInfo(tag) {
      this.editingTagName = this.editingTagName.trim();
      if (!this.editingTagName) {
        this.$message({
          message: this.$t('parser.classifier.tag_name_empty'),
          type: 'error',
        });
        this.$refs.editTagName[0].focus();
        return;
      }
      const existedTags = this.uiTagsList.filter(t => t.tagName === this.editingTagName);
      if (existedTags.length > 0 && this.editingTagName !== tag.tagName) {
        this.$message({
          message: this.$t('parser.classifier.tag_existed').replace('%1', this.editingTagName),
          type: 'error',
        });
        return;
      }
      tag.tagName = this.editingTagName;
      tag.tagDesc = this.editingTagDesc;
      this.clearEditingTag();
      this.markDataChanged();
    },
    clearEditingTag() {
      if (!this.editingTagName) {
        return;
      }
      this.editingTagName = '';
      this.editingTagDesc = '';
      this.editingTagIndex = -1;
    },
    // 删除标签
    handleDeleteTag(index) {
      this.uiTagsList.splice(index, 1);
      if (this.editingTagIndex === index) {
        this.editingTagIndex = -1;
      }
      this.cancelDeleteTag(index);
      this.markDataChanged();
    },
    // 取消删除标签
    cancelDeleteTag(index) {
      // 第一个Other标签没有【删除分类】
      if (this.$refs.deleteTag.length && index >= 1 && index <= this.$refs.deleteTag.length) {
        this.$refs.deleteTag[index - 1].click();
      }
    },
    // 添加语料
    handleAddCorpus(addCorpusList, tag) {
      // 判断当前tag的标签名称是否为空，如果为空，让用户先填写标签名称
      if (!tag.tagName) {
        this.$message({
          message: this.$t('parser.classifier.tag_name_empty'),
          type: 'error',
        });
        this.$refs.editTagName[0].focus();
        return;
      }
      for (let i = 0; i < addCorpusList.length; i += 1) {
        const existedCorpus = tag.corpusesInfo.filter(corp => corp.content === addCorpusList[i]);
        if (existedCorpus.length > 0) {
          this.$message({
            message: this.$t('parser.classifier.corpus_existed').replace('%1', addCorpusList[i]),
            type: 'error',
          });
          addCorpusList.splice(i, 1);
          i -= 1;
        }
      }
      if (addCorpusList.length === 0) {
        return;
      }
      // 新增一条语料 -> 在当前标签中添加语料，且设置tags列表；
      // 其他也同时有该语料的tag，修改tag下该语料的tag list
      addCorpusList.forEach((corpusV) => {
        const tagNameList = this.calculateTagsListOfCorpus(corpusV, tag.tagName);
        const addCorpusContent = {
          id: null,
          content: corpusV,
          classifierId: this.actDetailObj.classifierId,
          classifierTagId: tag.id,
          tags: tagNameList,
          isContextSensitive: 0,
        };
        // 当前标签新增corpus
        tag.corpusesInfo.unshift(addCorpusContent);
        // 其他标签更新corpus的tag list
        const otherTagsInfoList = this.uiTagsList.filter(tagInfo =>
        tagNameList.indexOf(tagInfo.tagName) !== -1);
        otherTagsInfoList.forEach((otherTagInfo) => {
          if (otherTagInfo.tagName === tag.tagName) {
            return;
          }
          const sameCorps = otherTagInfo.corpusesInfo.filter(corp => corp.content === corpusV);
          if (sameCorps.length > 0) {
            const sameCorp = sameCorps[0];
            sameCorp.tags = [].concat(tagNameList);
            sameCorp.tags.splice(sameCorp.tags.indexOf(otherTagInfo.tagName), 1);
            sameCorp.tags.unshift(otherTagInfo.tagName);
          }
        });
      });
      tag.corpusInputValue = '';
      this.markDataChanged();
    },
    // 分类标签列表显示&隐藏
    handleSelTagsVisible(visible, currentTag, currentCorpus) {
      if (visible) {
        this.editingTag = {
          currentTag,
          currentCorpus,
          oldTags: [].concat(currentCorpus.tags),
        };
      } else {
        this.editingTag = null;
      }
    },
    // 选择分类标签
    handleChangeSelTags(newTasgName, currentTag, currentCorpus) {
      // console.log(`handleChangeSelTags = value = ${newTasgName}`);
      // debugger;
      // 不允许删除当前标签
      if (newTasgName.indexOf(currentTag.tagName) === -1) {
        newTasgName.unshift(currentTag.tagName);
        return;
      }
      if (this.editingTag === null || this.editingTag.currentTag !== currentTag
      || this.editingTag.currentCorpus !== currentCorpus) {
        return;
      }
      const oldTagsName = this.editingTag.oldTags;
      if (oldTagsName.length > newTasgName.length) {
        // 删除
        const removeTagsName = oldTagsName.filter(tagName => newTasgName.indexOf(tagName) === -1);
        const tagTarget = this.uiTagsList.filter(tag => tag.tagName === removeTagsName[0]);
        if (tagTarget.length > 0) {
          this.handleDeleteCorpus(tagTarget[0], currentCorpus);
        }
      } else if (oldTagsName.length < newTasgName.length) {
        // 新增
        const addTagsName = newTasgName.filter(tagName => oldTagsName.indexOf(tagName) === -1);
        const tagTarget = this.uiTagsList.filter(tag => tag.tagName === addTagsName[0]);
        if (tagTarget.length > 0) {
          this.handleAddCorpus([currentCorpus.content], tagTarget[0]);
        }
      }
      this.editingTag.oldTags = [].concat(newTasgName);
      this.markDataChanged();
    },
    handleRemoveSelTags(removeTagName, currentTag, currentCorpus) {
      const otherTagsInfo = this.uiTagsList.filter(tagInfo => tagInfo.tagName === removeTagName);
      if (otherTagsInfo.length > 0) {
        this.handleDeleteCorpus(otherTagsInfo[0], currentCorpus);
      }
      console.log(`handleRemoveSelTags remove tag = ${removeTagName}`);
    },
    // 编辑语料
    handleEditCorpus(tag, corpusObj) {
      this.editingCorpusTag = tag;
      this.editingCorpusObj = corpusObj;
      this.editingCorpusName = corpusObj.content;
      this.$nextTick(() => {
        this.$refs.corpusInput[0].focus();
      });
    },
    handleSaveCorpus(tag, corpus) {
      if (this.editingCorpusName === '') {
        return;
      }
      const existedCorpus = tag.corpusesInfo.filter(corp =>
      corp.content === this.editingCorpusName);
      if (existedCorpus.length > 0 && this.editingCorpusName !== corpus.content) {
        this.$message({
          message: this.$t('parser.classifier.corpus_existed').replace('%1', this.editingCorpusName),
          type: 'error',
        });
        return;
      }
      corpus.content = this.editingCorpusName;
      this.cancelEditCorpus();
      this.markDataChanged();
    },
    cancelEditCorpus() {
      this.editingCorpusTag = null;
      this.editingCorpusObj = null;
      this.editingCorpusName = '';
    },
    // 删除标签语料
    handleDeleteCorpus(tag, corpus) {
      // 更新其他tag下该语料的tag列表
      const corpusTagNameList = corpus.tags;
      if (corpusTagNameList.length > 1) {
        const otherTagsList = this.uiTagsList.filter(uTag =>
        corpusTagNameList.indexOf(uTag.tagName) !== -1);
        otherTagsList.forEach((tagInfo) => {
          const sameCorps = tagInfo.corpusesInfo.filter(corpInfo =>
          corpInfo.content === corpus.content);
          if (sameCorps.length > 0) {
            const sameCorp = sameCorps[0];
            const indx = sameCorp.tags.indexOf(tag.tagName);
            if (indx !== -1) {
              sameCorp.tags.splice(indx, 1);
            }
          }
        });
      }
      // 从当前分类中删除语料
      const targetCss = tag.corpusesInfo.filter(corpusI => corpusI.content === corpus.content);
      const targetCIndx = tag.corpusesInfo.indexOf(targetCss[0]);
      if (targetCIndx !== -1) {
        tag.corpusesInfo.splice(targetCIndx, 1);
      }
      this.markDataChanged();
    },
    importActContent(fileContent) {
      this.$api.importDialogAct(fileContent, this.robotID).then((res) => {
        this.$message({
          message: this.$t('parser.classifier.import_success'),
          type: 'success',
        });
        this.$emit('refresh', res.data || {});
      }).catch((e) => {
        try {
          const message = JSON.parse(e.request.response).message;
          this.$message({
            message,
            type: 'error',
          });
        } catch (_) {
          this.$message({
            message: e.request && e.request.response ? e.request.response : this.$t('parser.classifier.import_failed'),
            type: 'error',
          });
        }
      });
    },
    downloadActTemplate() {
      this.$api.downloadDialogActTempl(this.showLanguage || 'zh-cn');
    },
    exportDialogAct() {
      if (!this.robotID || !this.actDetailObj.classifierId) {
        return;
      }
      this.$api.exportDialogAct(this.robotID, this.actDetailObj.classifierId);
    },
    // 修改通用模型列表
    handleChangeSystemAct(tag) {
      tag.systemActInfo = this.systemActList
      .filter(act => tag.systemActLogicNames.indexOf(act.sysActLogicName) !== -1)
      .map(act => ({
        ...act,
        id: null,
        classifierId: this.actDetailObj.id,
        classifierTagId: tag.id,
      }));
      this.isDataChanged = true;
    },
    // 移除通用模型
    handleRemoveSystemAct(tag, actLogicName) {
      const indx = tag.systemActLogicNames.indexOf(actLogicName);
      if (indx !== -1) {
        tag.systemActLogicNames.splice(indx, 1);
        this.handleChangeSystemAct(tag);
      }
    },
    handleTestSystemAct(sysAct) {
      this.testingSysActObj = sysAct;
      this.sysActTestResult = [];
      this.testingSysActTitle = `${this.$t('parser.classifier.test_sys_class')} - ${sysAct.sysActName}`;
      this.isTestingSystemAct = true;
    },
    handleTestSysAct(testSentence) {
      debugger;
      const logicName = this.testingSysActObj.sysActName;
      this.$api.testSystemAct(this.robotID,
      [this.testingSysActObj.sysActLogicName], testSentence).then((res) => {
        this.sysActTestResult = res.data.labels && res.data.labels.length ?
        res.data.labels.map(v => ([
          // this.testingSysActObj.sysActlogicName,
          logicName,
          this.testingSysActObj.description,
          v.label,
        ])) : [[
          // this.testingSysActObj.sysActlogicName,
          logicName,
          this.testingSysActObj.description,
          '-',
        ]];
      }).catch((e) => {
        try {
          const message = JSON.parse(e.request.response).message;
          this.$message({
            message,
            type: 'error',
          });
        } catch (_) {
          this.$message({
            message: e.request && e.request.response ? e.request.response : this.$t('parser.library.test_failed'),
            type: 'error',
          });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.dialogue-act-detail {
  margin: 10px;
  width: calc(100% - 20px);
  height: calc(100% - 20px);
  box-sizing: border-box;
  background-color:#FFFFFF;
  border-radius: 4px;
  border: 1px solid #E9E9E9;
  padding: 20px;
  display: flex;
  flex-direction: column;
  .header-box {
    width: 100%;
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    .title {
      flex: 1;
      color: #333333;
      font-size: 16px;
    }
    button{
      margin-left: 10px;
      &.back-btn {
        width: 80px;
      }
      &.save-btn {
        width: 110px;
      }
      &.upload-btn {
        border-radius: 3px 0px 0px 3px;
        i{
          @include icon('../../../assets/icons/import.svg', 15px, 13px);
        }
      }
      &.download-btn {
        margin-left: 0px;
        border-radius: 0px 3px 3px 0px;
        border-left: 0px;
        i {
          @include icon('../../../assets/icons/import.svg', 16px, 17px);
        } 
      }
    }
  }
  .content-wrapper{
    flex: 1;
    overflow: auto;
    .section-box{
      display: flex;
      height: 28px;
      align-items: center;
      margin-bottom: 10px;
      button{
        margin-left: 10px;
      }
    }
    .section-title{
      font-size:14px;
      color:#333333;
      line-height:20px;
      flex: 1;
    }
    .basic-info-wrapper{
      margin-bottom: 20px;
      .basic-info-box{
        width: 100%;
        background:#F7F7F7;
        border-radius: 2px;
        border: 1px solid #DBDBDB;
        padding: 10px 20px 20px 20px;
        margin-top: 10px;
        .row{
          display: flex;
          margin-top: 10px;
          align-items: center;
          height: 32px;
          position: relative;
          .mandatory-mark{
            color: #F25C62;
            position: absolute;
            left: 0;
          }
          .row-title{
            width: 125px;
            font-size:14px;
            color:#666666;
            text-align: right;
            margin-right: 10px;
          }
          .input-box {
            flex: 1;
            /deep/ input {
              width: 100%;
              font-size: 14px;
            }
          }
        }
      }
    }
    /deep/ .tags-collapse{
      .tag-header-box{
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center; 
        .display-box{
          flex: 1;
          .tag-title{
            color: #333333;
            font-size: 14px;
          }
          .tag-description{
            margin-left: 10px;
            color: #666666;
            font-size: 12px;
          }
          .edit-tag-btn{
            margin-left: 8px;
            @include icon('../../../assets/icons/edit_s.svg', 14px, 14px);
          }
        }
        .edit-box{
          flex: 1;
          height: 32px;
          line-height: 32px;
          .tag-name-input{
            width: 220px;
            /deep/ input{
              width: 100%;
              font-size: 14px;
            }
          }
          .tag-desc-input{
            width: 330px;
            margin-left: 10px;
            /deep/ input{
              width: 100%;
              font-size: 14px;
            }
          }
          .save-btn{
            color: #1875F0;
            font-size: 12px;
            margin-left: 10px;
            cursor: pointer;
          }
        }
        .delete-btn{
          color: #666666;
          font-size: 12px;
          margin: 0px 10px;
          &:hover{
            color: #F25C62;
          }
        }
      }
      .tag-corpus-wrapper{
        padding: 10px 0px;
        .el-tabs{
          display: inline-block;
          width: 100%;
          /deep/ .el-tabs__header{
            width: 182px;
            margin: 0px 0px 10px 0px;
            .el-tabs__nav-wrap{
              padding: 0px 15px;
              height: 32px;
              border: 1px solid #DBDBDB;
              border-bottom: 0px;
              border-radius: 4px 4px 2px 2px;
              .el-tabs__nav{
                height: 32px;
                .el-tabs__item{
                  height: 32px;
                  line-height: 32px;
                  vertical-align: top;
                  &:last-child{
                    border-left: 1px solid #DBDBDB;
                  }
                }
                .el-tabs__active-bar{
                  height: 3px;
                  width: 38% !important;
                }
              }
            }
          }
        }
        /deep/ .corpurs-input{
          width: 100%;
          input{
            width: 100% !important;
          }
        }
        .table-header{
          display: flex;
          .col{
            padding-left: 20px;
            height: 40px;
            line-height: 40px;
            color: #7B8594;
            font-size: 14px;
          }
        }
        .table-content{
          max-height: 354px;
          overflow: auto;
        }
        .table-row{
          margin-top: 5px;
          // height: 40px;
          display: flex;
          align-items: center;
          background:#FFFFFF;
          border-radius: 2px;
          &:first-child{
            margin-top: 0px;
          }
          .cell{
            padding: 5px 0px 5px 20px;
            color: #666666;
            font-size: 14px;
            min-width: 100px;
            .corpus-input-box{
              /deep/ input{
                font-size: 14px;
              }
            }
            .btn-edit{
              cursor: pointer;
              @include icon('../../../assets/icons/edit_s1.svg', 18px, 18px);
            }
            .btn-delete{
              cursor: pointer;
              @include icon('../../../assets/icons/delete_s.svg', 18px, 18px);
            }
          }
        }
        .flex1{
          flex: 1;
        }
        .flex2{
          flex: 3;
        }
        .flex6{
          flex: 6;
        }
      }
    }
    .system-act-box{
      .selector-box{
        position: relative;
        /deep/ .el-select {
          .el-select__tags{
            display: none;
          }
        }
        .system-acts-selector{
          width: calc(50% - 5px);
        }
        .selector-placeholder{
          position: absolute;
          top: 5px;
          left: 10px;
          color:#606266;
          background: #FFFFFF;
        }
        .desc{
          margin-left: 10px;
          color:#666666;
          font-size: 12px;
        }
      }
      .system-act-list{
        width: 100%;
        max-height: 340px;
        overflow: auto;
        .system-act{
          display: inline-block;
          width: calc(50% - 5px);
          background-color: #E9E9E9;
          border-radius: 2px;
          align-items: center;
          padding: 0px 10px;
          margin-top: 10px;
          margin-left: 10px;
          &:nth-child(2n+1) {
            margin-left: 0px;
          }
          .act-name{
            display: inline-block;
            font-size: 12px;
            line-height: 18px;
            padding-bottom: 5px;
            color: #666666;
            width: calc(100% - 66px);
          }
          .act-icon{
            margin-left: 10px;
            cursor: pointer;
          }
        }
      }
    }
    .add-tag-btn{
      margin-top: 8px;
      width: 120px;
      height: 32px;
      font-size: 14px;
    }
  }
}
/deep/ .tags-selector{
  width: 100%;
  height: 32px;
  .el-select__tags{
    height: 28px;
    >span{
      width: calc(100% - 50px);
      max-height: 28px;
      display: inline-block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      word-break: keep-all;
      span{
        &:first-child{
          i{
            display: none;
          }
        }
      }
    }
  }
  .el-input{
    height: 32px;
    input{
      height: 32px !important;
    }
    .el-select__caret{
      line-height: 32px;
    }
  }
}
</style>