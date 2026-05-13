
<template>
  <div class="wb-list-wrapper">
    <!-- 修改 -->
    <div class="header-wrapper">
      <img class="title-img" src="../../../assets/images/category.png"
      @click="handleExpandMenu"/>
      <div class="title">{{categoryName}}</div>
      <div class="io-buttons">
        <div class="uploading-wrapper" v-if="uploadingDocuments && uploadingDocuments.length > 0">
          <span class="document">{{ uploadingDocuments[0] }}</span>
          <span class="status">{{ $t('wordbank.processing') }}</span>
          <el-popover placement="bottom-end" width="260" trigger="click"
          popper-class="popover-write-theme" v-if="uploadingDocuments.length > 1">
            <div v-for="(item, index) in uploadingDocuments" :key="index"
            style="height:28px;line-height:28px">
              <span
              style="display:inline-block;width:180px;color:#333333;
              overflow:hidden;font-size:12px;flex:1;text-overflow: ellipsis;white-space: nowrap;">
              {{ item }}</span>
              <span style="color:#666666;font-size:12px;margin-left:10px;vertical-align:top">{{ $t('wordbank.processing') }}</span>
            </div>
            <span slot="reference" class="show-all">{{ $t('wordbank.all') }}</span>
          </el-popover>
        </div>
        <button @click="handleClickAddWordbank" class="btn-white-gray wb-button">
          {{$t('wordbank.add_wordbank')}}</button>
        <button @click="clickUploadWordbank" class="btn-white-gray wb-button">
          <i class="data-import"></i>
          {{$t('wordbank.batch_import')}}</button>
        <button @click="clickExportAll" class="btn-white-gray wb-button">
          <i class="data-export"></i>
          {{$t('wordbank.export_all')}}</button>
      </div>
    </div>
    <div class="content-wrapper">
      <div class="table-toolbar">
        <button v-if="canDelete" @click="deleteMultiWordbank" class="btn-small"
        :class="{'btn-red': selWBCount > 0, 'btn-disabled': selWBCount === 0}">
        {{$t('wordbank.batch_delete')}}</button>
        <el-popover placement="bottom" width="260" trigger="manual" v-model="isMovePopoverOpen"
          popper-class="popover-write-theme">
          <category-tree :style="{'height': '300px'}"
          :categoryList="categoryList" ref="refMove2Tree" :maxLevel="5"
          :showTitle="false" :circleSearch="true" :readonly="true" :defaultSelectFirstLine="false"
          @selectCategory="selectMove2Category"></category-tree>
          <div :style="{'text-align':'right', 'margin-top':'5px'}">
            <button class="btn-small btn-white-gray" @click="clearMove2Category">{{ $t('general.cancel') }}</button>
            <button class="btn-small btn-dark-blue" :style="{'margin-left':'5px'}"
            @click="confirmMove2Category">{{ $t('general.confirm_edit') }}</button>
          </div>
          <button slot="reference" class="btn-small" @click="handleClickMoveTo"
          :class="{'btn-white-gray':selWBCount>0, 'btn-disabled': selWBCount===0}">
          {{$t('wordbank.moveto')}}</button>
        </el-popover>
        <button v-if="canEdit" @click="handleBatchUpdateStatus(true)" class="btn-small"
        :class="{'btn-white-gray':selWBCount>0, 'btn-disabled': selWBCount===0}">
        {{$t('wordbank.status.enable')}}</button>
        <button v-if="canEdit" @click="handleBatchUpdateStatus(false)" class="btn-small"
        :class="{'btn-white-gray':selWBCount>0, 'btn-disabled': selWBCount===0}">
        {{$t('wordbank.status.disable')}}</button>
        <span class="count">
          {{$t('wordbank.all_select_wb_count').replace('%1', totalWBCount).replace('%2', selWBCount)}}
        </span>
        <div class="search-box">
          <el-input v-model="searchKeyword" class="emotibot search-input"
          :placeholder="$t('general.search_placeholder')" :maxlength="100"
          size="mini" suffix-icon="el-icon-search"
          @change="handleSearchWB">
            <el-select v-model="searchKeyType" @change="handleChangeSearchType" slot="prepend" placeholder="请选择">
              <el-option :label="$t('wordbank.main_word')" :value="1"></el-option>
              <el-option :label="$t('wordbank.synonym')" :value="2"></el-option>
            </el-select>
          </el-input>
        </div>
      </div>
      <div class="table-wrapper">
        <el-table ref="wordbanksTable" :data="wordbanks" style="width: 100%"
        :header-cell-style="{'background':'#F7F7F7', 'color':'#666666', 'height':'50px','padding-left':'10px'}"
        :cell-style="{'padding-left':'10px'}"
        @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="50"></el-table-column>
          <el-table-column :label="$t('wordbank.single_word')" width="120">
            <template slot-scope="scope">
              <span class="one-line-text">{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('wordbank.synonym')">
            <template slot-scope="scope">
              <span class="one-line-text">{{ getSimilarWordsString(scope.row.similarInfos) }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('wordbank.category.category')" width="250">
            <template slot-scope="scope">
              <el-popover popper-class="popover-left-theme"
                placement="left-start"
                width="300"
                trigger="hover"
                :content="scope.row.catalogPath">
                <span class="one-line-text" slot="reference">{{ scope.row.catalogPath }}</span>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column prop="effect" :label="$t('wordbank.status.status')" width="100">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.effect" @change="handleSwitchEffect(scope.row)">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column :label="$t('wordbank.operation')" width="100">
            <template slot-scope="scope">
                <emoti-icon name="icon-edit-pen" :size="16"
                hover 
                @click="handleEditWordBank(scope.row)"></emoti-icon>
                <emoti-icon name="icon-delete" :size="16" 
                hover
                hoverColor="#f67270"
                @click="handleDeleteWordBank(scope.row)"></emoti-icon>
            </template>
          </el-table-column>
        </el-table>
        <loading-dot class="loading-indicator" v-show="isLoading||showLoading"></loading-dot>
      </div>   
      <div class="pager-wrapper">
        <el-pagination 
        background
        @size-change="handleSizeChange" @current-change="handlePageChange"
        :page-sizes="[50, 100, 200, 500, 1000]" layout="prev, pager, next, sizes, jumper"
        :current-page="currentPage" :page-size="pageSize"
        :total="totalWBCount">
        </el-pagination>
      </div>
    </div>
    <wordbank-edit-pop v-if="openWordbankEditDlg"
    v-model="openWordbankEditDlg" @refresh="handleRefreshData"
    :wordbank="editingWordbank" :existWordbanks="wordbanks" :categoryPathMap="categoryPathMap">
    </wordbank-edit-pop>
    <export-all
    v-model="openHistoryDlg"
    :historyList="uploadedHistoryList" :btnText="[this.$t('wordbank.export_current_wordbank')]"
    @operate="handleOperation" @download="handleDownloadHistory">
    </export-all>
    <upload-excel v-model="openUploadDlg" :tips="$t('wordbank.upload_tooltip')"
    :customUploadDescriptions="{replace: $t('wordbank.upload_replace_description')}"
    @downloadTempl="downloadWBTemplate" @upload="handleUploadWordbank"></upload-excel>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import { Notification } from 'element-ui';
import ExportAll from '@/components/ExportAll';
import UploadExcel from '@/components/UploadExcel';
import WordbankEditPop from './WordbankEditPop';
import CategoryTree from './CategoryTree';
import api from '../_api/wordbank_v2';

const WB_DOWNLOAD_ERROR_REPORT = '/adm/wordbank/v2/uploadHistory/downloadErrorReportFile?errorReportFile=';

export default {
  path: 'wordbank-list',
  privCode: 'wordbank',
  displayNameKey: 'wordbank_list',
  icon: 'white_folder',
  api,
  components: {
    ExportAll,
    UploadExcel,
    WordbankEditPop,
    CategoryTree,
    Notification,
  },
  props: {
    categoryId: {
      default: '',
    },
    categoryName: {
      type: String,
      default: '',
    },
    categoryList: {
      type: Array,
      default() {
        return [];
      },
    },
    categoryPathMap: {
      type: Object,
    },
    wordbanks: {
      type: Array,
      default() {
        return [];
      },
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
    totalWBCount: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      showLoading: false,
      searchKeyType: 1,
      searchKeyword: '',
      openWordbankEditDlg: false,
      openUploadDlg: false,
      editingWordbank: {},
      // 导出历史记录
      openHistoryDlg: false,
      uploadHistoryList: [],
      uploadHistoryStatus: {},
      uploadingDocuments: [],
      // 词库列表
      selectedWordbanks: [],
      currentPage: 1,
      pageSize: 50,
      move2Category: null,
      isMovePopoverOpen: false,
    };
  },
  watch: {
    categoryId() {
      this.currentPage = 1;
    },
  },
  computed: {
    ...mapGetters([
      'robotID',
      'showLanguage',
    ]),
    uploadedHistoryList() {
      let res = [];
      if (this.uploadHistoryList && this.uploadHistoryList.length) {
        res = this.uploadHistoryList.filter(item => item.status !== 0);
      }
      // 按时间倒序排列
      res.sort((v1, v2) => {
        if (v1.createTime > v2.createTime) {
          return -1;
        }
        return 1;
      });
      res.forEach((item) => {
        item.operations = [
          { text: this.$t('general.export_all.download'), value: 'download', error: false },
        ];
        if (item.uploadType === 0) {
          item.uploadType = this.$t('general.export_all.add_mode');
        } else if (item.uploadType === 1) {
          item.uploadType = this.$t('general.export_all.replace_mode');
        }
        switch (item.status) {
          case 1:
            item.statusTooltip = this.$t('general.export_all.upload_success');
            break;
          case 2:
            item.statusTooltip = this.$t('general.export_all.upload_fail');
            item.operations.push({
              text: this.$t('general.export_all.download_error'),
              value: 'downloadError',
              error: true,
            });
            break;
          case 3:
            item.statusTooltip = this.$t('general.export_all.file_replaced');
            break;
          case 4:
            item.statusTooltip = this.$t('general.export_all.no_sheet_file');
            break;
          case 5:
            item.statusTooltip = this.$t('general.export_all.invalid_templ_version');
            item.operations.push({
              text: this.$t('general.export_all.download_error'),
              value: 'downloadError',
              error: true,
            });
            break;
          case 6:
            item.statusTooltip = this.$t('general.export_all.part_success');
            break;
          default:
            break;
        }
        if (item.status === 1 || item.status === 5) {
          item.status = true;
        } else {
          item.status = false;
        }
      });
      return res;
    },
    selWBCount() {
      return this.selectedWordbanks.length;
    },
    canCreate() {
      return this.$hasRight('create');
    },
    canDelete() {
      return this.$hasRight('delete');
    },
    canEdit() {
      return this.$hasRight('edit');
    },
    canImport() {
      return this.$hasRight('import');
    },
    canExport() {
      return this.$hasRight('export');
    },
  },
  created() {
    this.fetchUploadHistoryList(true);
  },
  beforeDestroy() {
    if (this.uploadTimer) {
      window.clearTimeout(this.uploadTimer);
    }
  },
  deactivated() {
    if (this.uploadTimer) {
      window.clearTimeout(this.uploadTimer);
    }
  },
  methods: {
    handleExpandMenu() {
      this.$emit('expand');
    },
    handleClickMoveTo() {
      if (!this.selectedWordbanks.length) {
        return;
      }
      this.isMovePopoverOpen = !this.isMovePopoverOpen;
      this.$refs.refMove2Tree.clearSearch();
    },
    // 移动词条目录
    confirmMove2Category() {
      const toCateId = this.move2Category;
      this.clearMove2Category();
      if (this.selectedWordbanks.length === 0) {
        return;
      }
      const idArr = [];
      const nameArr = [];
      this.selectedWordbanks.forEach((wb) => {
        idArr.push(wb.id);
        nameArr.push(wb.name);
      });
      this.$api.apiMoveWordbank(this.robotID, toCateId, idArr, nameArr).then((res) => {
        if (res.status === 0) {
          this.$message({ message: this.$t('wordbank.message.move_success'), type: 'success' });
          this.handleRefreshData();
        } else {
          this.$message({ message: res.message || this.$t('wordbank.message.move_fail'), type: 'warning' });
        }
      }).catch(() => {
        this.$message({ message: this.$t('wordbank.message.move_fail'), type: 'error' });
      });
    },
    clearMove2Category() {
      this.move2Category = null;
      this.isMovePopoverOpen = false;
    },
    selectMove2Category(toCateId) {
      this.move2Category = toCateId;
    },
    handleClickAddWordbank() {
      if (!this.categoryId) {
        this.$message({ message: this.$t('wordbank.select_category_first'), type: 'warning' });
        return;
      }
      this.editingWordbank = {
        cid: this.categoryId,
        // name: '',
        // effect: false,
        // spell: false,
        // similarInfos: [],
      };
      this.openWordbankEditDlg = true;
    },
    handleRefreshData(refreshCategory) {
      // this.handlePageChange(1);
      this.currentPage = 1;
      this.$emit('refresh', refreshCategory);
    },
    handleSearchWB() {
      this.$emit('search', this.searchKeyType, this.searchKeyword);
    },
    handleChangeSearchType() {
      this.$emit('search', this.searchKeyType, this.searchKeyword);
    },
    handlePageChange(page) {
      this.currentPage = page;
      this.$emit('page', this.currentPage, this.pageSize);
    },
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.$emit('page', this.currentPage, this.pageSize);
    },
    getSimilarWordsString(words) {
      if (!words || !words.length) {
        return '';
      }
      let str = '';
      for (let i = 0; i < words.length; i += 1) {
        str += words[i].name;
        if (i !== words.length - 1) {
          str += '、';
        }
      }
      return str;
    },
    // 修改主词状态
    handleSwitchEffect(data) {
      if (!data.id) {
        return;
      }
      this.$api.apiUpdateWordbank(this.robotID, data.id,
      data.cid, data.name, data.effect, data.spell).then((res) => {
        if (res) {
          this.$message({ message: this.$t('wordbank.message.word_effect_success'), type: 'success' });
        } else {
          // 修改失败回滚
          data.spell = !data.spell;
          this.$message({ message: res.message || this.$t('wordbank.message.word_effect_fail'), type: 'warning' });
        }
      }).catch(() => {
        // 修改失败回滚
        data.spell = !data.spell;
        this.$message({ message: this.$t('wordbank.message.word_effect_fail'), type: 'error' });
      });
    },
    // 编辑主词
    handleEditWordBank(wbData) {
      this.editingWordbank = wbData;
      this.editingWordbank.isSensitive = false;
      this.openWordbankEditDlg = true;
    },
    // 删除主词
    handleDeleteWordBank(wbData) {
      if (!wbData.id) {
        return;
      }
      this.confirmDeleteWordbank([wbData.id], [wbData.name]);
    },
    confirmDeleteWordbank(idArr, nameArr) {
      this.$confirm(this.$t('wordbank.confirm_delete_word'), this.$t('general.description'), {
        confirmButtonText: this.$t('general.ok'),
        cancelButtonText: this.$t('general.cancel'),
        type: 'warning',
        showClose: false,
      }).then(() => {
        this.batchDeleteWordBank(idArr, nameArr);
      }).catch(() => {
        this.$message({ message: this.$t('general.canceled'), type: 'info' });
      });
    },
    batchDeleteWordBank(idArr, nameArr) {
      this.$api.apiBatchDeleteWordbank(this.robotID, idArr, nameArr).then((res) => {
        if (res.status === 0) {
          this.$message({ message: this.$t('wordbank.message.word_delete_success'), type: 'success' });
          this.handleRefreshData();
        } else {
          this.$message({ message: res.message || this.$t('wordbank.message.word_delete_fail'), type: 'warning' });
        }
      }).catch(() => {
        this.$message({ message: this.$t('wordbank.message.word_delete_fail'), type: 'warning' });
      });
    },
    // 点击【全部导出】
    clickExportAll() {
      this.openHistoryDlg = true;
      this.fetchUploadHistoryList(false);
    },
    // 点击【导入词库】
    clickUploadWordbank() {
      this.openUploadDlg = true;
    },
    fetchUploadHistoryList(polling) {
      // 查看是否有待处理的上传文档
      if (this.uploadTimer) {
        window.clearTimeout(this.uploadTimer);
        this.uploadTimer = undefined;
      }
      this.$api.apiGetWBHistory(this.robotID).then((res) => {
        if (res.status === 0) {
          this.uploadHistoryList = res.result;
          // 查找
          if (this.uploadHistoryList && this.uploadHistoryList.length) {
            this.uploadHistoryList.forEach((item) => {
              if (item.status === 0) {
                // 待处理
                this.uploadHistoryStatus[item.id] = item.documentName || '空文件';
              } else if (this.uploadHistoryStatus[item.id]) {
                if (item.status === 1) {
                  // 1 - 导入成功
                  this.$message({
                    message: `<p style="margin-bottom:10px">${item.documentName}</p> 
                    <p>${this.$t('general.export_all.upload_success')}</p>`,
                    dangerouslyUseHTMLString: true,
                    type: 'success',
                  });
                  this.handleRefreshData(true);
                } else if (item.status === 2) {
                  // 2 - 导入失败 - 下载错误报告
                  this.$message({
                    dangerouslyUseHTMLString: true,
                    duration: 0,
                    showClose: true,
                    type: 'error',
                    message: `<p style="margin-top:10px">${item.documentName}</p>
                    <div style="margin-top:10px">${this.$t('general.export_all.upload_fail')} 
                    <a href="${WB_DOWNLOAD_ERROR_REPORT + item.errorDocumentStore}"
                    style="color:#1875F0;margin-top:10px" target="_blank">${this.$t('general.export_all.download_error')}</a>
                    </div>`,
                  });
                } else if (item.status === 5) {
                  // 5 - 部分导入成功 - 可以下载错误报告
                  this.$message({
                    type: 'success',
                    duration: 0,
                    showClose: true,
                    dangerouslyUseHTMLString: true,
                    message: `<p style="margin-top:10px">${item.documentName}</p>
                    <div style="margin-top:10px">${this.$t('general.export_all.part_success')}
                    <a href="${WB_DOWNLOAD_ERROR_REPORT + item.errorDocumentStore}"
                    style="color:#1875F0;margin-top:10px" target="_blank">${this.$t('general.export_all.download_error')}</a>
                    </div>`,
                  });
                  this.handleRefreshData(true);
                } else if (item.status === 3 || item.status === 4 || item.status === 6) {
                  // 3 - 文件被覆盖 - 没有错误报告
                  // 4 - 上传文件中找不到目标页
                  // 6 - 导入模板不适配
                  let message = '';
                  if (item.status === 3) {
                    message = `<p style="margin-top:10px">${item.documentName}</p>
                    <p style="margin-top:10px">${this.$t('general.export_all.file_replaced')}</p>`;
                  } else if (item.status === 4) {
                    message = `<p style="margin-top:10px">${item.documentName}</p>
                    <p style="margin-top:10px">${this.$t('general.export_all.no_sheet_file')}</p>`;
                  } else {
                    message = `<p style="margin-top:10px">${item.documentName}</p>
                    <p style="margin-top:10px">${this.$t('general.export_all.invalid_templ_version')}</p>`;
                  }
                  this.$message({
                    type: 'error',
                    dangerouslyUseHTMLString: true,
                    message,
                  });
                }
                // 删除状态 - 只有在状态从0变成其他时，才需要展示消息
                delete this.uploadHistoryStatus[item.id];
              }
            });
          }
          // 设置轮询
          // this.uploadingDocuments = Object.values(this.uploadHistoryStatus);
          this.uploadingDocuments = Object.values(this.uploadHistoryStatus);
          if (Object.values(this.uploadHistoryStatus).length > 0
          && polling) {
            this.uploadTimer = window.setTimeout(() => {
              this.fetchUploadHistoryList(polling);
            }, 2000);
          }
        }
      });
    },
    handleOperation() {
      this.$api.downloadWBCurrent(this.robotID, this.showLanguage);
    },
    handleDownloadHistory(document, op) {
      if (!op.error) {
        // 下载报告
        this.$api.downloadWBHistoryFile(document.id);
      } else {
        // 下载错误报告
        this.$api.downloadWBError(document.errorDocumentStore);
      }
    },
    deleteMultiWordbank() {
      if (!this.selectedWordbanks || !this.selectedWordbanks.length) {
        return;
      }
      const idArr = [];
      const nameArr = [];
      this.selectedWordbanks.forEach((wb) => {
        idArr.push(wb.id);
        nameArr.push(wb.name);
      });
      this.confirmDeleteWordbank(idArr, nameArr);
    },
    handleBatchUpdateStatus(isEnable) {
      if (!this.selectedWordbanks || !this.selectedWordbanks.length) {
        return;
      }
      const idArr = [];
      const nameArr = [];
      this.selectedWordbanks.forEach((wb) => {
        idArr.push(wb.id);
        nameArr.push(wb.name);
      });
      const that = this;
      this.$api.apiBatchUpdateWordbank(this.robotID, idArr, isEnable, nameArr).then((res) => {
        if (res.status === 0) {
          this.$message({ message: this.$t('wordbank.message.batch_update_success'), type: 'success' });
          that.selectedWordbanks.forEach((wb) => {
            wb.effect = isEnable;
          });
        } else {
          this.$message({ message: res.message || this.$t('wordbank.message.batch_update_fail'), type: 'warning' });
        }
      }).catch(() => {
        this.$message({ message: this.$t('wordbank.message.batch_update_fail'), type: 'error' });
      });
    },
    handleSelectionChange(val) {
      this.selectedWordbanks = val;
    },
    downloadWBTemplate() {
      this.$api.downloadWBTemplate(this.showLanguage);
    },
    handleUploadWordbank(fileContent, uploadType) {
      this.$api.apiImportWordbank(this.robotID, fileContent, uploadType).then((res) => {
        if (res.status === 200) {
          this.$message({ message: this.$t('wordbank.message.upload_success'), type: 'success' });
          this.fetchUploadHistoryList(true);
        } else {
          this.$message({ message: res.message || this.$t('wordbank.message.upload_fail'), type: 'warning' });
        }
      }).catch(() => {
        this.$message({ message: this.$t('wordbank.message.upload_fail'), type: 'error' });
      });
    },
  },
};
</script>
<style lang="scss" scoped>
@import 'styles/variable';

.wb-list-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-width: 900px;
  .header-wrapper {
    flex: 0 0 66px;
    padding: 0 20px;
    box-shadow: 0px 1px 0px 0px $color-borderline-disabled;
    display: flex;
    align-items: center;
    .title-img{
      width: 18px;
      margin-right: 20px;
      cursor: pointer;
    }
    .title {
      flex: 1;
      font-size: 18px;
      color: $color-font-active;
      margin-top: 2px;
    }
    .io-buttons {
      display: flex;
      justify-content: space-between;
      .uploading-wrapper{
        width: 280px;
        height: 28px;
        border-radius: 2px;
        display: flex;
        align-items: center;
        padding: 0px 8px;
        display: flex;
        align-items: flex-end;
        .document{
          flex: 1;
          color:$color-font-active;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 14px;
          text-align: right;
        }
        .status{
          font-size: 14px;
          margin-left: 10px;
          width: 42px;
          color:$color-font-mark;
        }
        .show-all{
          font-size: 12px;
          color: $app-active-color;
          margin-left: 10px;
          cursor: pointer;
        }
        /deep/ .popover-write-theme{
          .uploading-item{
            display: flex;
            width: 100%;
          }
        }
      }
      .wb-button {
        margin-left: 10px;
        width: 116px;
        height: 32px;
        font-size: 14px;
        .data-import{
          @include icon('../../../assets/icons/data_import.svg', 15px, 15px);
        }
        .data-export{
          @include icon('../../../assets/icons/import.svg', 15px, 14px);
        }
      }
    }
  }
  .content-wrapper {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    .table-toolbar {
      flex: 0 0 auto;
      margin: 20px;
      display: flex;
      button {
        margin-right: 10px;
        width: 70px;
      }
      .count{
        color: $color-font-mark;
        font-size: 14px;
        line-height: 28px;
        flex: 1;
      }
      .search-box{
        width: 260px !important;
        /deep/ .search-input{
          .el-input-group__prepend{
            input{
              width: 100px;
            }
            background-color: transparent;
          }
          font-size: 14px !important;
          .el-input__suffix{
            right: 10px;
          }
        }
      }
    }
    .table-wrapper{
      flex: 1;
      position: relative;
      overflow: hidden;
      /deep/ .el-table{
        height: 100%;
        display: flex;
        flex-direction: column;
        .el-table__header-wrapper{
          min-height: 50px;
        }
        .el-table__body-wrapper{
          overflow-y: scroll;
          flex: 1;
        }
        .one-line-text{
          overflow:hidden;
          text-overflow:ellipsis;
          white-space:nowrap
        }
      }
      .loading-indicator{
        position: absolute;
        top: 50px;
        left: 0px;
        width: 100%;
        height: calc(100% - 50px);
        background-color: $color-white;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10;
      }
    }
    .pager-wrapper{
      padding: 15px 20px;
      text-align: right;
    }
  }
}
</style>
