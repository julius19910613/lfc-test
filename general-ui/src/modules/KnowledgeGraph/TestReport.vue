<template>
  <div id="material-manage">
    <template v-if="!isPublishedData || isEmptyData">
      <div class="empty_content">
        <div class="empty_words">
            <div class="word_content">
              <h4 v-if ='isEmptyData'>{{ $t('knowledge_graph.test_report.kg_data_empty') }}</h4>
              <h4 v-if ='!isPublishedData'>{{ $t('knowledge_graph.test_report.kg_data_unpublish') }}</h4>
              <div class="h3" v-if ='isEmptyData'>{{ $t('knowledge_graph.test_report.kg_data_empty_tip') }}</div>
              <div class="h3" v-if ='!isPublishedData'>{{ $t('knowledge_graph.test_report.kg_data_unpublish_tip') }}</div>
              <!-- <h2>{{ $t('knowledge_graph.data_manage.msg_road_map') }}</h2> -->
              <div class="btn_wrap">
                <text-button
                  button-type="fill"
                  id="data_input"
                  @click.stop="gotoPage(0)"
                  v-if ='isEmptyData'
                >{{ $t('knowledge_graph.test_report.goto_data_manage_btn') }}</text-button>
                <text-button
                  button-type="fill"
                  id="data_input"
                  @click.stop="gotoPage(1)"
                  v-if ='!isPublishedData'
                >{{ $t('knowledge_graph.test_report.go_to_publish_page') }}</text-button>
              </div>
              <!-- <div class="template_download" @click.stop="downloadKGTemplate">
                <img src="../../../static/images/kg_download.png">
                <h1>{{ $t('knowledge_graph.data_manage.btn_kg_template_download') }}</h1>
              </div>
              <a ref="templateDownloadMain"/> -->
            </div>
          </div>
          <div class="empty_pic">
            <img class="background" src="../../../static/images/kg_no_data.png">
          </div>
      </div>
    </template>
    <template v-else>
      <div class="card content h-fill w-fill">
      <div class="row title"><span class="title-text">{{ $t('knowledge_graph.material_manage.title') }}</span>
        <div class="sandbox_operation">
          <span class="data-update-tip" v-if='isLatestData'>
            <icon iconType="info_success" :size="14"  style="margin-right:4px"></icon>{{ $t('knowledge_graph.test_report.newest_data') }}</span>
          <span class="data-update-tip" v-if='hasNewKgData'>
            <icon iconType="info_warning" :size="14" style="margin-right:4px"></icon>{{ $t('knowledge_graph.test_report.has_new_data') }}</span>
          <text-button button-type="fill" v-if="canImport" class="btn_input left"
           @click.stop="onShowUploadTestFileDialog()">
           {{$t('knowledge_graph.material_manage.test_file_upload')}}
          </text-button>
          <text-button class="btn_input" v-if="canImport" @click="onShowExportTestReportDialog()">
              {{ $t('knowledge_graph.test_report.export_test_report') }}
            </text-button>
        </div>
      </div>
      <div class="row keyword">
        <div class="right_wrap">
          <div v-show="isEmptyMsg && isFirstInitOk" class="no-record-msg">
            <icon iconType="info_warning" :size="20"></icon>
            <span style="padding: 0px 5px">{{ $t('knowledge_graph.test_report.no_test_file_info') }}</span>
          </div>
          <span style="padding: 0px 10px; font-size: 14px; color: #666666">{{countInfo}}</span>
          <text-button class="btn_batch_del" v-if="isShowBatchDelBtn" @click="onBatchDel">
              {{ $t('knowledge_graph.test_report.batch_delete') }}
          </text-button>
        </div>
        <div class="search-input">
          <el-input
          @change="onSearchInputChange"
          :placeholder="$t('knowledge_graph.test_report.search_placeholder')"
           v-model="searchWordKey" class="emotibot" suffix-icon="el-icon-search" size='mini'>
            <el-select
             @change='onSearchTypeChange'
             v-model="searchTableType" slot="prepend">
              <el-option :label="$t('knowledge_graph.test_report.test_data')" value="data"></el-option>
              <el-option :label="$t('knowledge_graph.test_report.test_question')" value="question"></el-option>
            </el-select>
          </el-input>
        </div>
      </div>
      <div class="box-card">
        <div class="test-report">
          <div class="test-list">
            <el-table
              :max-height="tableHeight(0.68)"
              :data="tableData"
              :header-cell-style="mTableHeaderCellStyle"
              :cell-style="mTableCellStyle"
              :row-key="getRowKey"
              :row-style='getRowStyle'
              @selection-change='onSelectChange'
              @row-click='onTableRowClick'
              class="table-border "
              >
              <el-table-column
                type="selection"
                :reserve-selection='true'
                width="55">
              </el-table-column>
              <el-table-column
                prop="dataSetName"
                :label="$t('knowledge_graph.material_manage.dataSetName')"
                width="100px"
                >
              </el-table-column>
              <el-table-column
                prop="updatedTime"
                :label="$t('knowledge_graph.material_manage.updatedTime')"
                width="160px"
                >
              </el-table-column>
              <el-table-column
                prop="status"
                :label="$t('knowledge_graph.material_manage.test_status')"
                width="100px"
                >
              </el-table-column>
              <el-table-column
                prop="result"
                :label="$t('knowledge_graph.material_manage.accurate')"
                width="100px"
                >
                <template slot-scope="{ row }">
                  <el-progress v-if='row["result"]' :text-inside="true"
                              :stroke-width="18"
                              :percentage="parseFloat(row['result']) < 0 ? 0.0: parseFloat(row['result'])" status="success"></el-progress>
                  <div v-else>/</div>
                </template>
              </el-table-column>
              <el-table-column
                :label="$t('knowledge_graph.test_report.action')"
                >
               <template slot-scope="{row}">
                 <div class="action">
                   <span :style='{color:row.actionEnable?"#1875F0":"#999999",cursor: row.actionEnable?"pointer":"not-allowed"}' @click.stop='onReTestData(row)'>{{$t(`knowledge_graph.test_report.${row.isTested?"re_test":"start_test"}`)}}</span>
                   <span :style='{color:row.actionEnable?"#F25C62":"#999999", cursor:row.actionEnable?"pointer":"not-allowed",marginLeft:"5px"}' @click.stop='onDeleteRowData(row)'>{{$t('general.delete')}}</span>
                 </div>
               </template>
              </el-table-column>
          </el-table>
          </div>
          <div class="test-detail">
            <el-table
              :max-height="tableHeight(0.68)"
              :data="detailTableDataFilter"
              :header-cell-style="mTableHeaderCellStyle"
              :cell-style="mTableCellStyle"
              :row-key="getRowKey"
              :empty-text="getDetailTableEmptyText()"
              class="table-border "
              >
              <el-table-column
                :label="$t('knowledge_graph.material_manage.query')"
                min-width="100px"
                >
              <template slot-scope="{ row }" class="operations">
                  <el-tooltip placement="bottom">
                      <div slot="content">
                          <div class="expect_columns">
                              <div>{{ $t('knowledge_graph.material_manage.query') }}</div>
                              <div>{{ row['query'] }}</div>
                          </div>
                          <div class="expect_columns">
                              <div>{{ $t('knowledge_graph.material_manage.expectIntent') }}</div>
                              <div>{{ row['expectIntent'] }}</div>
                          </div>
                          <div class="expect_columns">
                              <div>{{ $t('knowledge_graph.material_manage.expectResult') }}</div>
                              <div>{{ row['expectResult'] }}</div>
                          </div>
                      </div>
                      <div :title="row.query" class="query-text">{{ row.query }}</div>
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column
                :label="$t('knowledge_graph.material_manage.testIntent')"
                width="100px"
                >
                 <template slot-scope="{row}">
                    <span :style='{color:row.testIntentRight?"":"#F25C62"}'>{{row.testIntent || '/'}}</span>
                </template>
              </el-table-column>
              <el-table-column
                :label="$t('knowledge_graph.material_manage.testResult')"
                >
                <template slot-scope="{row}">
                  <span :style='{color:row.testResultRight?"":"#F25C62"}'>{{row.testResult || '/'}}</span>
               </template>
              </el-table-column>
          </el-table>
          </div>
        </div>
      </div>
      </div>
    </template>
      <DialogFileUpload
        ref="DialogFileUpload"
        :visible="DIALOG.UPLOAD.isShow"
        :params="DIALOG.UPLOAD.params"
        @close="onClose"
        @startTemplateDownload='downloadKGTemplate'
        @startDownloadFailInfo='downloadKGFail'
        @onUploadFile='onUploadKGTestFile'
        >
      </DialogFileUpload>
      <el-drawer
        :title="$t('knowledge_graph.test_report.title')"
        :visible.sync="DIALOG.EXPORT.isShow"
        size='40%'
        custom-class="emotibot"
        >
         <el-table
              max-height="100vh"
              :data="exportTableData"
              :header-cell-style="mTableHeaderCellStyle"
              :cell-style="mTableCellStyle"
              :row-key="getRowKey"
              class="table-border "
              >
              <el-table-column
                prop="dataSetName"
                :label="$t('knowledge_graph.test_report.test_data_name')"
                min-width="100px"
                >
              </el-table-column>
              <el-table-column
                prop="updatedTime"
                :label="$t('knowledge_graph.test_report.test_time')"
                width="100px"
                >
              </el-table-column>
              <el-table-column
                :label="$t('knowledge_graph.test_report.action')"
                >
                <template slot-scope="{row}">
                 <div class="action">
                   <span style='color:#1875F0;cusor:pointer' @click='onDownloadTestData(row)'>{{$t('knowledge_graph.test_report.down_test_data')}}</span>
                   <span style='color:#1875F0;cusor:pointer;margin-left:10px' @click='onExportTestReport(row)'>{{$t('knowledge_graph.test_report.export_test_report')}}</span>
                 </div>
               </template>
              </el-table-column>
          </el-table>
      </el-drawer>
    </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import api from './_api/knowledgeGraph';
  import MixinTables from './_mixin/MixinTable';
  import DialogFileUpload from './_components/dialog/DialogUploadFile';

  export default {
    privCode: 'kg_test_report',
    api,
    mixins: [MixinTables],
    components: { DialogFileUpload },
    data() {
      console.log('thisssssssssssss', this);
      const title = this.$t('knowledge_graph.test_report.upload_test_data');
      const confirmExport = this.$t('knowledge_graph.test_report.confirm_export');
      const uploadTip1 = this.$t('knowledge_graph.test_report.upload_tip1');
      const uploadTip2 = this.$t('knowledge_graph.test_report.upload_tip2');
      const uploadTip3 = this.$t('knowledge_graph.test_report.upload_tip3');
      return {
        testInterval: null,
        isInitialStatus: false,
        testResultKeyword: '',
        tableDataOrigin: [],
        curSelectRow: {}, // 当前选中测试集数据
        selectedRowList: [], // 当前选中测试集数据列表
        isShowUploadDialog: false,
        isShowExportDialog: false,
        DIALOG: {
          UPLOAD: {
            isShow: false,
            params: {
              name: 'DialogUploadFile',
              title,
              confirmText: confirmExport,
              isShowExtraActionBtn: false,
              fileSizeLimit: 15 * 1024 * 1024,
              attentionList: [
                uploadTip1,
                uploadTip2,
                uploadTip3,
              ],
            },
          },
          EXPORT: {
            isShow: false,
            name: 'DialogExprot',
          },
        },
        detailTableEmptyText: '', // 详情表格提示文案
        detailTableData: [], // 详情表单数据
        isFirstInitOk: false, // 初次获取数据是否完成
        searchTableTypeVal: {
          data: 'data',
          question: 'question',
        },
        searchTableType: 'data', // 选择搜索表格 data  测试集表格还是测试题表格 question
        searchForTestQuestion: '', // 搜索测试题表格数据
        searchWordKey: '', // 搜索关键词
        entitiesData: [], // 实体数据集合
        isPublishedData: false, // 是否已有数据，但是从未发布过 此处的判断需要再次斟酌一下
        sandBoxStatus: {}, // 沙箱数据状态对象
      };
    },

    watch: {
      searchWordKey(val) {
        console.log('searchWordKey: watch', val);
        if (this.searchTableType === this.searchTableTypeVal.data) {
          this.testResultKeyword = this.searchWordKey;
        } else {
          this.searchForTestQuestion = this.searchWordKey;
        }
      },
    },

    computed: {
      ...mapGetters([
        'robotID',
      ]),
      tableData() {
        console.log('tableData update...');
        let temp = [];
        if (this.testResultKeyword) {
          temp = this.tableDataOrigin
              .filter(item => item.dataSetName
               && item.dataSetName.indexOf(this.testResultKeyword) > -1)
               .map((item, $index) => ({ ...item, $index }));
        } else {
          temp = this.tableDataOrigin.map((item, $index) => ({ ...item, $index }));
        }
        if (temp.length > 0) {
          const selectDatasetId = this.curSelectRow.datasetId;
          const tempRow = temp.find(f => f.datasetId === selectDatasetId) || {};
          if (tempRow.datasetId) {
            this.onTableRowClick(tempRow);
          } else {
            // 默认第一行作为选中
            this.onTableRowClick(temp[0]);
          }
        } else {
          this.curSelectRow = {};
          this.detailTableData = [];
        }
        return temp;
      },
      detailTableDataFilter() {
        console.log('detailTableDataFilter', this.searchForTestQuestion);
        let temp = [];
        if (this.searchForTestQuestion) {
          temp = this.detailTableData.filter(f => (f.query || '').includes(this.searchForTestQuestion));
        } else {
          temp = this.detailTableData;
        }
        /**
         * isValid：是否正确，0：意图，出话全错，1：意图正确，出话错误，2： 意图错误，出话正确， 3： 意图正确，出话正确 */
        return temp.map(item => ({ ...item,
          testIntentRight: item.isValid === '0' || item.isValid === '1',
          testResultRight: item.isValid === '0' || item.isValid === '2',
        }));
      },
      isEmptyMsg() {
        return this.tableDataOrigin.length === 0;
      },
      canEdit() {
        return this.$hasRight('edit');
      },
      canTest() {
        return this.$hasRight('test');
      },
      canImport() {
        return this.$hasRight('import');
      },
      isEmptyData() {
        return this.entitiesData.length === 0;
      },
      isLatestData() {
        return this.sandBoxStatus.hasModify === '0';
      },
      hasNewKgData() {
        return this.sandBoxStatus.hasModify === '1';
      },
      isShowBatchDelBtn() {
        return this.selectedRowList.length >= 2;
      },
      countInfo() {
        // 测试集共{{}}组 已选择{{}}组
        return this.$t('knowledge_graph.test_report.data_count_info',
         { total: this.tableData.length, selected: this.selectedRowList.length });
      },
      /**
       *  需要根据条件过滤掉未开始测试的、正在测试的、测试错误的
       *  目前根据result为非负值判定测试完成且有测试报告
       */
      exportTableData() {
        return this.tableDataOrigin.filter(f => parseInt(f.result, 10) >= 0);
      },
    },

    methods: {
      onSearchTypeChange(e) {
        console.log('onSearchTypeChange', e, this.searchTableType);
        if (e === this.searchTableTypeVal.data) {
          this.searchForTestQuestion = '';
        }
      },
      onSearchInputChange(e) {
        console.log('onSearchInputChange', e, this.searchTableType);
        if (this.tableDataOrigin.length === 0) {
          console.error('表格数据为空，不执行搜索操作');
          return;
        }
        if (this.searchTableType === this.searchTableTypeVal.data) {
          this.testResultKeyword = this.searchWordKey;
        } else {
          this.searchForTestQuestion = this.searchWordKey;
        }
      },
      getRowKey(row) {
        return row.dataSet;
      },
      getDetailTableEmptyText() {
        // eslint-disable-next-line no-nested-ternary
        const text = this.curSelectRow.status === this.$t('knowledge_graph.material_manage.processing') ?
          this.$t('knowledge_graph.test_report.test_data_testing') : (this.detailTableData || []).length > 0 ?
          '' : this.$t('knowledge_graph.test_report.empty_test_data');
        console.log('getDetailTableEmptyText', text);
        return text;
      },
      getRowStyle({ rowIndex }) {
        return rowIndex === this.curSelectRow.$index ? { background: '#EAF3FF' } : {};
      },
      onExportTestReport(row) {
        console.log('onExportTestReport:', row);
        window.open(`/xeonKgDal/testHandler/${this.robotID}/exportTestResult/${row.datasetId}`, '_blink');
      },
      onDownloadTestData(row) {
        window.open(`/xeonKgDal/testHandler/${this.robotID}/exportTestCase/${row.datasetId}`, '_blink');
        console.log('onDownloadTestData:', row);
      },
      // Dialog 关闭事件
      onClose(data, name) {
        console.log('onClose:', data, name);
        if (name === this.DIALOG.UPLOAD.params.name) {
          this.DIALOG.UPLOAD.isShow = false;
        }
      },
      onSelectChange(rowlist) {
        console.log('onSelectChange:', JSON.stringify(rowlist, null, 2));
        this.selectedRowList = rowlist;
      },
      onTableRowClick(row, col) {
        console.log('onTableRowClick', row, 'col', col);
        this.curSelectRow = row;
        if (row.status === this.$t('knowledge_graph.material_manage.finished')) {
          this.$api.getTestDetailInfo(row.taskId).then((res) => {
            if (this.detailTableData.length > 0
              && JSON.stringify(this.detailTableData) === JSON.stringify(res.data.data)) {
              console.error('getTestDetailInfo：测试结果数据未修改');
            } else {
              this.detailTableData = res.data.data;
            }
          });
        } else {
          if (col) {
            this.$message({
              message: this.$t('knowledge_graph.material_manage.no_test_result'),
              type: 'error',
            });
          }
          this.detailTableData = [];
        }
      },
      onReTestData(row) {
        console.log('onReTestData', row);
        if (row.testBtnDisabled) {
          console.error('已经触发测试按钮事件，不可再次点击,等待表格数据刷新');
          return;
        }
        this.tableDataOrigin.splice(row.$index, 1, { ...row, testBtnDisabled: true });
        this.$api.triggerKGTesting(this.robotID, row.datasetId).then(() => {
          this.onTableRowClick(row);
          if (this.testInterval === null) {
            this.testInterval = setInterval(
          () => this.getAllExistingTestResult('onReTestData'), 1000);
          }
        });
      },
      // 初始化/删除 重置选择table row 1
      onResetSelectRow() {
        if (this.tableData.length > 0) {
          this.onTableRowClick(this.tableData[0]);
        } else {
          this.selectedRowList = [];
        }
      },
      onDeleteRowData(data) {
        console.log('onDeleteRowData', JSON.stringify(data, null, 2));
        this.$api.deleteTestInfo(this.robotID, {
          dataSetId: data.datasetId,
        }).then(() => {
          this.tableDataOrigin.splice(data.$index, 1);
          this.onResetSelectRow();
        });
      },
      mTableHeaderCellStyle(data) {
        return this.tableHeaderCellStyle(data, false);
      },
      mTableCellStyle(data) {
        return this.tableCellStyle(data, false);
      },
      // 批量删除
      onBatchDel() {
        console.log('onBatchDel: selectedRowList', this.selectedRowList);
        const tempPromise = this.selectedRowList.map(item => this.$api.deleteTestInfo(this.robotID, {
          dataSetId: item.datasetId,
        }));
        Promise.all(tempPromise).then((res) => {
          console.log('onBatchDel', res);
          this.tableDataOrigin = this.tableDataOrigin
              .filter(item => !this.selectedRowList.find(s => s.datasetId === item.datasetId));
          this.selectedRowList = [];
          this.onResetSelectRow();
        });
      },
      // 下载KG模板文件
      downloadKGTemplate() {
        this.$api.TestFileTemplate()
          .then((res) => {
            const errFile = new Blob([res.data], { type: 'application/vnd.ms-excel;charset=UTF-8' });
            const name = `${this.$t('knowledge_graph.material_manage.batch_upload_test')}.xlsx`;
            this.$refs.DialogFileUpload.downTemplateFile(errFile, name);
          });
      },

      // 下载错误日志文件 如果有的话
      downloadKGFail(uploadFailFileName) {
        this.$api.getUploadFaliedInfo(this.robotID, uploadFailFileName)
          .then((res) => {
            const errFile = new Blob([res.data], { type: 'application/vnd.ms-excel;charset=UTF-8' });
            this.$refs.DialogFileUpload.downloadFailInfo(errFile, uploadFailFileName);
          });
      },
      // 轮询获取全部的测试结果
      getAllExistingTestResult(tag) {
        console.log('getAllExistingTestResult', tag, this);
        return this.$api.getAllTestInfo(this.robotID)
          .then((res) => {
            console.log('getAllTestInfo', JSON.stringify(res.data, null, 2), this);
            this.isFirstInitOk = true;
            this.$emit('endLoading');
            this.tableDataOrigin = res.data.data.map((item, idx) => {
              // result 1：== -1 processing  2： null or '' init  3：> 0 done
              if (!item.result) {
                item.status = this.$t('knowledge_graph.material_manage.initial');
                item.actionEnable = true;
                item.isTested = false;
              } else {
                // eslint-disable-next-line no-lonely-if
                if (parseInt(item.result, 10) !== -1) {
                  item.actionEnable = true;
                  item.isTested = true;
                  item.status = this.$t('knowledge_graph.material_manage.finished');
                } else {
                  item.result = '/';
                  item.actionEnable = false;
                  item.isTested = true;
                  item.status = this.$t('knowledge_graph.material_manage.processing');
                }
              }
              if (!item.updatedTime) {
                item.updatedTime = '/';
              }
              item.datasetId = item.dataSet;
              item.id = idx;
              item.$index = idx;
              return item;
            });
            const statusProcessing = this.$t('knowledge_graph.material_manage.processing');
            if (!this.tableDataOrigin
            .find(item => item.status === statusProcessing)) {
              clearInterval(this.testInterval);
              this.testInterval = null;
            }
            return new Promise((resolve) => {
              resolve();
            });
          });
      },

      // 上传测试集弹窗
      onShowUploadTestFileDialog() {
        this.DIALOG.UPLOAD.isShow = true;
      },
      // 导出测试结果弹窗
      onShowExportTestReportDialog() {
        this.DIALOG.EXPORT.isShow = true;
      },
      // 上传测试集文件
      onUploadKGTestFile(file) {
        console.log('onUploadFile', file);
        const that = this;
        this.DIALOG.UPLOAD.params = {
          ...this.DIALOG.UPLOAD.params,
          loading: true,
          isShowDownloadFailInfoBtn: false,
        };
        this.$emit('startLoading');
        this.$api.submitTestFile(file, this.robotID, this.userID)
          .then(() => {
            this.loading = false;
            this.DIALOG.UPLOAD = {
              ...this.DIALOG.UPLOAD,
              isShow: false,
              params: {
                ...this.DIALOG.UPLOAD.params,
                loading: false,
              },
            };
            if (this.testInterval) {
              clearInterval(this.testInterval);
              this.testInterval = null;
            }
            this.testInterval = setInterval(
              () => this.getAllExistingTestResult('onUploadKGTestFile'), 2000);
          })
          .catch((err) => {
            console.log('onUploadKGTestFile: err', err);
            this.DIALOG.UPLOAD.params = {
              ...this.DIALOG.UPLOAD.params,
              loading: false,
              uploadFailFileName: (err.response.data || {}).filename || '错误信息日志',
            };
            const errMsg = err.response.data.message || '';
            let msg = '上传测试集文件错误，请稍后再试...';
            if (errMsg === 'duplicated_file_name') {
              msg = this.$t('knowledge_graph.test_report.duplicated_file_name');
            } else if (err.response.data.message === 'no testcase is found') {
              msg = this.$t('knowledge_graph.test_report.no_testcase_is_found');
              this.DIALOG.UPLOAD.params = {
                ...this.DIALOG.UPLOAD.params,
                uploadFailFileName: (err.response.data || {}).filename || '错误信息日志',
                isShowDownloadFailInfoBtn: true,
              };
            } else if (err.response.data.filename) {
              msg = this.$t('knowledge_graph.test_report.test_case_err');
              this.DIALOG.UPLOAD.params = {
                ...this.DIALOG.UPLOAD.params,
                uploadFailFileName: (err.response.data || {}).filename || '错误信息日志',
                isShowDownloadFailInfoBtn: true,
              };
            }
            this.$message({
              message: msg,
              type: 'error',
            });
          })
          .finally(() => {
            that.$emit('endLoading');
          });
      },
      gotoPage(type) {
        if (type === 0) {
          this.$router.push('/data-manage');
        } else if (type === 1) {
          this.$router.push('/audit-manage');
        }
      },
    },
    mounted() {
      this.isFirstInitOk = false;
      this.$emit('startLoading');
      this.$api.getAllEntitiesByRobotId(this.robotID, { page: 1 }).then((res) => {
        this.entitiesData = res.data.entities || [];
        this.isInitialStatus = this.entitiesData.length === 0;
        console.log('this.isInitialStatus', this.isInitialStatus, this.entitiesData);
        if (!this.isInitialStatus) {
          // 判断是否发布过数据
          this.$api.getKGDataStatus(this.robotID).then((res2) => {
            console.log('getKGDataStatus', JSON.stringify(res2, null, 2));
            const d = res2.data;
            this.isPublishedData = !(d.trainingStatus === 0 && d.syncStatus === 0
              && d.lastSuccessSync === 0);
            if (this.isPublishedData) {
              this.$api.getSandBoxStatus(this.robotID).then((res3) => {
                console.log('getSandBoxStatus', JSON.stringify(res3.data, null, 2));
                this.sandBoxStatus = res3.data || {};
              });
              this.testInterval = setInterval(
              () => this.getAllExistingTestResult('mounted'), 2000);
            } else {
              console.error('数据管理中已有数据，但是还从未发布过的页面');
              this.$emit('endLoading');
            }
          });
        } else {
          this.$emit('endLoading');
        }
      }).catch(() => {
        this.$emit('endLoading');
      });
    },
    beforeDestroy() {
      clearInterval(this.testInterval);
      this.testInterval = null;
    },
  };
</script>

<style lang="scss" scoped>
  @import '../../assets/styles/variable';

  #data_input {
    width: 140px;
    height: 46px;
    border-radius: 4px;
    border: 1px solid rgba(255, 255, 255, 0);
    font-size: 14px;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
    line-height: 22px;
    margin-top: 10px;
  }


  .el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }

  .bottom {
    height: 1px;
  }

  .text {
    font-size: 14px;
  }

  .item {
    padding: 18px 0;
  }

  .result {
    // padding: 20px;
    height: 30vh;
    width: 25vw;
  }

  .clickable-link {
    color: $color-primary;
    text-decoration: underline;
    @include click-button();
  }

  #material-manage {
    height: 100%;
    font-family:PingFangSC-Regular;
    .empty_content {
      height: 95%;
      flex: 1;
      margin: 20px 0px;
      // background: #ffffff;
      display: flex;
      flex-direction: row;
      align-items: stretch;
      .empty_words {
        width: 30%;
        flex: 1;
        display: flex;
        flex-direction: row;
        background: #ffffff;
        .word_content {
          display: flex;
          flex-direction: column;
          margin-left: 15%;
          margin-top: 33%;
          .btn_wrap {
            margin-top: 20px;
          }
          .template_download {
            margin-top: 10px;
            display: flex;
            flex-direction: row;
            align-items: center;
            cursor: pointer;
            img {
              height: 13px;
              width: 13px;
            }
          }

          h4 {
            font-size: 38px;
            font-family: PingFangHK-Regular;
            font-weight: 400;
            color: rgba(51, 51, 51, 1);
            line-height: 54px;
            letter-spacing: 1px;
          }

          .h3 {
            width: 300px;
            word-wrap:break-word;
            margin-top: 6px;
            font-size: 20px;
            font-family: PingFangSC-Regular;
            font-weight: 400;
            color: rgba(102, 102, 102, 1);
            line-height: 30px;
          }

          h2 {
            margin-top: 20px;
            margin-bottom: 40px;
            font-size: 16px;
            font-family: PingFangHK-Regular;
            font-weight: 400;
            color: rgba(24, 117, 240, 1);
            line-height: 24px;
          }

          h1 {
            padding: 0px 3px;
            font-size: 14px;
            font-family: PingFangSC-Regular;
            font-weight: 400;
            color: rgba(24, 117, 240, 1);
            line-height: 20px;
          }
        }
      }
    }
    .empty_pic {
      background: #ffffff;
      width: 70%;
      display: flex;
      justify-content: flex-end;
      align-items: flex-end;
      flex: 1;
      .background {
        height: 80%;
        width: 100%;
      }
    }


    .content {
      display: flex;
      flex-direction: column;
      .row {
        flex: 0 0 48px;
        padding: 10px 20px;
        .btn_batch_del {
            width:100px;
            height:32px;
            background:rgba(247,98,96,1);
            color: white;
            font-size: 14px;
            text-align: center;
          }
        .sandbox_operation {
          display: flex;
          flex-direction: row;
          .data-update-tip {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            font-size: 12px;
            color: #999999;
            margin: 0 10px;
          }
          .btn_input {
            width:120px;
            height:32px;
            font-size:14px;
            font-family:PingFangSC-Regular;
            font-weight:400;
            line-height:28px;

            &.left {
              margin-right: 10px;
            }
          }
        }

        &.keyword {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          height: 52px;
          .search-input {
            /deep/ .emotibot {
               .el-select{
                input {
                    width: 90px;
                }
              }
              input {
                    width: 200px;
              }
            }
          }
        }

        &.title {
          @include font-16px();
          color: $color-font-active;
          flex: 0 0 60px;
          border-bottom: 1px solid $color-borderline;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .title-text {
             .total-question-text {
                font-size: 12px;
              }
          }
        }
        .right_wrap {
          display: flex;
          flex-direction: row;
          align-items: center;
        }
        .no-record-msg {
          display: flex;
          flex-direction: row;
          align-items: center;

          height:32px;
          background:rgba(252,252,252,1);
          border-radius:2px;
          border:1px solid rgba(233,233,233,1);
          font-size:12px;
          font-weight:400;
          line-height:28px;
          padding-left: 10px;
        }
      }

      .box-card {
        flex: 1;
        width: 100%;
        font-size: 14px;
        padding: 0px 15px;
        border-bottom: 1px solid $color-borderline;
        .head {
        }
        .test-report {
          width: 100%;
          display: flex;
          flex-direction: row;
          .table-border {
              border-radius:2px;
              width: 100%;
              border:1px solid rgba(233,233,233,1);
            }
          .test-list {
            padding: 0px 10px;
            width: 60%;
            display: flex;
            flex-direction: row;
            align-items: stretch;
          }
          .test-detail {
            padding: 0px 10px;
            width: 40%;
            display: flex;
            flex-direction: row;
            align-items: stretch;
          }
        }
        .results {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
        }
        .content {
          flex: 1;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          .toolbar {
            flex: 0 0 auto;
            margin: 10px 0px;
            display: flex;

            .text-button {
              margin: 0 5px;
            }
          }
          .status /deep/ {
            display: flex;
            flex-direction: row;
            align-items: center;
            padding: 0px 10px;

            .process {
              margin: 0px 10px;
              color: #1875f0;
            }
            .success {
              margin: 0px 10px;
              color: #00a699;
            }

          }
          .result_report {
            display: flex;
            flex-direction: column;
            .detail_report {
              display: flex;
              flex-direction: row;
              align-items: center;
              justify-content: center;
              padding: 10px;
            }

          }
          .overview {
            padding: 5px;
            display: flex;
            flex-direction: row;
            align-items: center;
            .content {
              .row {
                height: 20vh;
                display: flex;
                flex-direction: row;
                overflow-y: scroll;
              }
            }

          }
        }
      }
    }
  }
.query-text {
  width: 120px;
  @include textEllipsis()
}
.operations {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
}

.expect_columns {
    display: flex;
    flex-direction: column;
    margin-bottom: 10px;
}
</style>
