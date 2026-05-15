<template>
  <div id="trigger-page" class="page trigger-page">
    <div id="card-content">
      <div id="card-content-header">
        <div class="nav">
          <div>
            <nav-bar :options="synonymMap" v-model="synonymType"/>
          </div>
          <div class="operation">
            <el-input
                ref='searchRef'
                size='mini'
                :autofocus='true'
                class="emotibot"
                :placeholder="$t('knowledge_graph.data_manage.search_placeholder_02')"
                v-model="synonymKeyword"
                suffix-icon="emoti-icon icon-search"
                >
            </el-input>
            <el-button
                id='create_synon_button'
                v-if="canEdit"
                @click="popAddSynonym">
                <i class="emoti-icon icon-edit" style="font-size: 12px" />
                    {{ $t('knowledge_graph.synonym_manage.pop_title') }}
            </el-button>
          </div>
        </div>
      </div>
      <template v-if='loaded'>
        <el-table
              :data="tableData"
              :header-cell-style="tableHeaderCellStyle"
              :cell-style="tableCellStyle"
              :row-key="getRowKey"
              :empty-text="$t('general.no_data')"
              border
            >
              <el-table-column
                key="name"
                prop="name"
                :label="$t('knowledge_graph.synonym_manage.synonym_name')"
                width='180'
              ></el-table-column>
              <el-table-column
                key="synonym"
                :label="$t('knowledge_graph.synonym_manage.synonyms')"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                    <div class="column-tag" 
                        >
                        {{ scope.row.synonym.join("  ") }}
                    </div>
                </template>
               <!-- <template slot-scope="{row}">
                  <div class='synonym_warp'>
                    <span v-for='s in row.synonym' class='synonym_val'>{{s}}</span>
                  </div>
               </template> -->
              </el-table-column>
              <el-table-column 
                v-if="canEdit" 
                :label="$t('general.actions')" 
                width='100'>
                <template slot-scope="scope">
                  <div>
                      <emoti-icon
                            iconClass="operation-icon" 
                            name="icon-edit-pen" 
                            hover
                            hoverColor="#1875f0"
                            :popContent="$t('general.edit')"
                            :size="16" 
                            @click="editSynonym(scope.row)">
                        </emoti-icon>
                        <emoti-icon 
                            name="icon-delete"
                            iconClass="operation-icon" 
                            :size="16" 
                            hover
                            :popContent="$t('general.delete')"
                            hoverColor="#f67270"
                            @click="deleteSynonym(scope.row)">
                        </emoti-icon>
                    <!-- <span class="edit" v-if="canEdit" @click="editSynonym(scope.row)">{{ $t('general.edit') }}</span>
                    <span class="delete" v-if="canEdit" @click="deleteSynonym(scope.row)">{{ $t('general.delete') }}</span> -->
                  </div>
                </template>
              </el-table-column>
            </el-table>
        <div id="card-content-footer">
          <!-- <v-pagination class="emotibot" size="small" :total="curTotal" :pageIndex="curPageIdx" :pageSize="pageLimit"
                        :layout="['prev', 'pager', 'next', 'jumper']" @page-change="handlePageChange"></v-pagination> -->
            <el-pagination
                class="emotibot" 
                background
                @current-change="handlePageChange"
                :current-page="curPageIdx"
                :page-size="pageLimit"
                layout="prev, pager, next, jumper"
                :total="curTotal">
            </el-pagination>
        </div>
      </template>
      <template v-else>
        <div class="loading card h-fill w-fill">
          <loading-dot></loading-dot>
        </div>
      </template>
    </div>
      <DeleteDialog
      :params='curDeleteData'
      :isShow='isShowDeleteDialog'
      @confirm='onDeleteConfirm'
      @cancel='isShowDeleteDialog = false'
      >
      </DeleteDialog>
    </div>
  </template>

  <script>
  import NavBar from '@/components/NavigationBar';
  import misc from '@/utils/js/misc';
  import { mapGetters } from 'vuex';
  import SynonymPop from '../popups/AddSynonymPop';
  import api from '../../_api/knowledgeGraph';
  import DeleteDialog from '../dialog/DialogDelete';

  export default {
    name: 'synonym-manage',
    api,
    props: ['canEdit', 'canExport', 'canImport'],
    components: {
      NavBar,
      DeleteDialog,
    },
    data() {
      return {
        synonymMap: {
          entity: `${this.$t('knowledge_graph.synonym_manage.entity')}`,
          property: `${this.$t('knowledge_graph.synonym_manage.property')}`,
          property_value: `${this.$t('knowledge_graph.synonym_manage.property_value')}`,
        },
        synonymType: 'entity',
        SYNONYMTYPE: { ENTITY: 'entity', PROPERTY: 'property', PROPERTY_VALUE: 'property_value' },
        currentSynonyms: [], // 当前表数据
        synonymKeyword: '', // 搜索值
        tableHeader: [
          {
            key: 'name',
            text: this.$t('knowledge_graph.synonym_manage.synonym_name'),
            width: '180px',
          },
          {
            key: 'synonym',
            text: this.$t('knowledge_graph.synonym_manage.synonyms'),
            type: 'tag',
          },
        ],
        tableAction: [],
        checkedProperty: [],
        curPageIdx: 1,
        pageLimit: 10,
        originSynonymset: [], // http请求原始数据，用来做搜索
        loaded: false,
        isShowDeleteDialog: false,
        curDeleteData: {}, // 当前需要删的数据
      };
    },
    computed: {
      ...mapGetters([
        'wordbank',
        // 'currentCategory',
        'isEditMode',
        'robotID',
        'userID',
      ]),
      tableData() { // This is curPage
        // Handle empty data cause curPageIdx to zero;
        if (this.curPageIdx <= 0) {
          this.toFirstPage();
        }

        const startIdx = (this.curPageIdx - 1) * this.pageLimit;
        const endIdx = startIdx + this.pageLimit;
        if (this.currentSynonyms !== undefined && this.currentSynonyms.length > 0) {
          return this.currentSynonyms.slice(startIdx, endIdx)
            .map((data) => {
              const tableRow = {
                id: data.id,
                name: data.name.trim(),
                synonym: (data.synonym || []),
                // synonym: (data.synonym || []).map(item => `[${item}]`).join(' '),
              };
              return tableRow;
            });
        }
        return [];
      },
      curTotal() {
        return this.currentSynonyms.length;
      },
      lastPageIdx() {
        return Math.floor((this.curTotal - 1) / this.pageLimit) + 1;
      },
    },
    watch: {
      synonymType() {
        this.initialCurrentSynonyms();
      },
      synonymKeyword() {
        this.searchByKeyword();
      },
      lastPageIdx() {
        if (this.curPageIdx > this.lastPageIdx) {
          this.toCurPage(this.lastPageIdx);
        }
      },
      originSynonymset(v1) {
        // this.searchByKeyword();
        this.currentSynonyms = v1;
        this.synonymKeyword = '';
      },
    },
    methods: {
      tableHeaderCellStyle({ columnIndex }) {
        return `padding-left:${columnIndex === 0 ? '10px' : '0px'};
        background: #F6F6F6;
        color: #666666;
        border-right: none;
        font-size: 14px`;
      },
      tableCellStyle({ columnIndex }) {
        return `border-right: none;
        padding-left:${columnIndex === 0 ? '10px' : '0px'};
        font-size: 14px`;
      },
      // 指定table的唯一rowkey
      getRowKey() {
        return `${Math.random()}`;
      },
      searchByKeyword() {
        this.currentSynonyms = !this.synonymKeyword ? this.originSynonymset : this.originSynonymset
          .filter((item) => {
            const nameSearchResult = item.name && item.name.includes(this.synonymKeyword);
            let valueSearchResult = false;
            (item.synonym || []).map((inner) => {
              if (inner && inner.includes(this.synonymKeyword)) {
                valueSearchResult = true;
              }
              return item;
            });
            return nameSearchResult || valueSearchResult;
          });
      },

      fileTypeInvalid(file) {
        const validType = ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
        const suffix = file.name.split('.');
        const ExcelSuffix = 'xlsx';
        const isExecl = suffix && suffix.length > 0 && suffix[suffix.length - 1] === ExcelSuffix;
        return validType.indexOf(file.type) === -1 && !isExecl;
      },

      updateFilename(msg) {
        this.filename = msg || this.file.name;
      },

      handlePageChange(page) {
        if (page <= 0) {
          this.toFirstPage();
        } else {
          this.toCurPage(page);
        }
        this.checkedProperty = [];
      },

      loadTableActionByPrivilege() {
        this.tableAction = [];
        if (this.canEdit) {
          this.tableAction.push({
            text: this.$t('general.edit'),
            type: 'primary',
            onclick: this.editSynonym,
          });
          this.tableAction.push({
            text: this.$t('general.delete'),
            type: 'error',
            onclick: this.deleteSynonym,
          });
        }

        // if (this.canDelete) {
        //   this.tableAction.push({
        //     text: this.$t('general.delete'),
        //     type: 'error',
        //     onclick: this.deleteSynonym,
        //   });
        // }
      },

      editSynonym(data) {
        let prop = {
          id: '',
          name: '',
          synonym: [],
        };
        const selectedProperty = this.currentSynonyms.filter(item => item.id === data.id);
        if (selectedProperty.length > 0) {
          prop = {
            synonymSet: selectedProperty[0].synonym,
            synonymType: this.synonymType,
            sourceName: selectedProperty[0].id,
            name: selectedProperty[0].name,
          };
        }
        this.popEditProperty(prop);
      },

      popEditProperty(property) {
        const options = {
          component: SynonymPop,
          title: this.$t('knowledge_graph.synonym_manage.pop_title_edit'),
          extData: {
            editMode: true,
            synonym: property,
          },
          validate: true,
          callback: {
            ok: (param) => {
              this.updateSynonyms(param);
            },
          },
        };
        this.$pop(options);
      },

      updateSynonyms(param) {
        const selectedSynonym = this.currentSynonyms
          .filter(item => item.id === parseInt(param.id, 10))[0];
        if (selectedSynonym !== undefined) {
          const selectedIndex = this.currentSynonyms.indexOf(selectedSynonym);
          if (param.synonym !== null && param.synonym !== undefined && param.synonym.length > 0) {
            selectedSynonym.synonym = param.synonym;
            this.currentSynonyms.splice(selectedIndex, 1, selectedSynonym);
          } else {
            this.currentSynonyms.splice(selectedIndex, 1);
          }
        } else {
          this.initialCurrentSynonyms();
        }
      },

      // isWordbankSensitive() {  // By recursive through sensitive category
      //   const isIn = false;
      //   return isIn;
      // },

      handleCheckedChange(checked) {
        this.checkedProperty = checked;
      },

      deleteSynonym(data) {
        console.log('showDeletePop:data:', data);
        const mainTitle = this.$t('knowledge_graph.synonym_manage.delete_synonym_msg',
          { name: misc.getEllipsisStr(data.name, 6) });
        const subTitle = this.$t('knowledge_graph.data_manage.delete_unrecoverable');
        this.curDeleteData = { ...data, mainTitle, subTitle };
        this.isShowDeleteDialog = true;
        // const option = {
        //   data: {
        //     msg: this.$t('knowledge_graph.synonym_manage.delete_synonym_msg', { name: data.name }),
        //   },
        //   callback: {
        //     ok: () => {
        //       this.confirmdeleteSynonym(data.id);
        //     },
        //   },
        // };
        // this.$popCheck(option);
      },
      popAddSynonym() {
        const synonymProp = {
          Id: undefined,
          appid: this.robotID,
          synonymSet: [],
          synonymType: this.synonymType,
          sourceName: '',
        };
        const options = {
          component: SynonymPop,
          title: this.$t('knowledge_graph.synonym_manage.pop_title'),
          extData: {
            editMode: false,
            synonym: synonymProp,
          },
          // disable_ok: true,
          validate: true,
          callback: {
            ok: (param) => {
              this.updateSynonyms(param);
            },
          },
        };
        this.$pop(options);
      },

      confirmdeleteSynonym(id) {
        if (this.synonymType === this.SYNONYMTYPE.PROPERTY_VALUE) {
          this.deleteKeywordSynonym(id);
        } else {
          this.$api.deleteSynoyms(this.robotID, id, this.synonymType)
            .then(() => {
              // this.initialTableHeader('');
              this.isShowDeleteDialog = false;
              this.currentSynonyms = this.currentSynonyms.filter(item => item.id !== id);
            })
            .catch(() => {
              this.$notifyFail(this.$t('knowledge_graph.error.delete_property_fail'));
            });
        }
      },

      initialCurrentSynonyms() {
        this.loaded = false;
        if (this.synonymType === this.SYNONYMTYPE.PROPERTY_VALUE) {
          this.getAllSynonymKeywordInfo();
        } else {
          const param = {
            show: 'matchAll',
            type: this.synonymType,
          };
          this.$api.getSynonym(this.robotID, param).then((res) => {
            this.loaded = true;
            this.originSynonymset = (((res || {}).data || {}).data || []);
          });
        }
      },

      toFirstPage() {
        this.curPageIdx = 1;
      },
      toCurPage(page) {
        this.curPageIdx = page;
      },
      // 获取所有Keyword值with同义词列表
      getAllSynonymKeywordInfo() {
        this.$api.getAllSynonymKeywordInfo(this.robotID)
          .then((res) => {
            this.loaded = true;
            this.originSynonymset = (((res || {}).data || []).data || []).map((item, index) => {
              item.id = item.id || index;
              item.synonym = ((item || {}).synonym || []).filter(inner => !!inner);
              return item;
            }).filter(item => item.synonym.length > 0);
          })
          .catch((err) => {
            console.log('getAllSynonymKeywordInfo:err:', err);
            this.loaded = true;
            this.$notifyFail(`${this.$t('error_msg.data_format_err')}:${err.message}`);
          });
      },
      // 删除Keyword值以及同义词
      deleteKeywordSynonym(id) {
        const temp = this.currentSynonyms.filter(item => item.id === id);
        const param = {
          name: temp[0].name,
        };
        this.$api.deleteKeywordSynonym(this.robotID, param)
          .then(() => {
            this.currentSynonyms = this.currentSynonyms.filter(item => item.id !== id);
            this.isShowDeleteDialog = false;
          })
          .catch((err) => {
            console.log('deleteKeywordSynonym:err:', err);
            this.$notifyFail(`${this.$t('error_msg.data_format_err')}:${err.message}`);
          });
      },
      onDeleteConfirm(data) {
        console.log('onDeleteConfirm', data);
        this.confirmdeleteSynonym(data.id);
      },
    },
    beforeMount() {
      this.initialCurrentSynonyms();
      this.loadTableActionByPrivilege();
      this.checkedProperty = [];
    },
    mounted() {

    },
  };
</script>

<style lang="scss" scoped>
@import 'styles/variable';

#trigger-page {
  height: 100%;
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  // padding: 20px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 0px 5px 0px rgba(102, 102, 102, 0.08);
  border-radius: 4px;
  .add-trigger-container {
    flex: 0 0 auto;
    padding: 10px;
    height: 86px;
    background: #f8f8f8;
    border-radius: 4px;
    .row {
      display: flex;
      flex-direction: row;
      .label-add-trigger {
        color: $color-font-active;
        line-height: 28px;
        font-size: 14px;
      }
      .icon-container {
        margin-left: 4px;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
      .select-add-trigger {
        height: 28px;
        background: #ffffff;
      }
      .button-add-trigger {
        margin-left: 10px;
      }
    }
    .row-margin-top {
      margin-top: 10px;
    }
  }
  .intent-list {
    padding-top: 25px;
  }
}
.operation-icon {
    margin-right: 10px;
}
.edit {
  color: $color-primary;
  cursor: pointer;
}
.delete {
  color: $color-error;
  cursor: pointer;
  margin-left: 20px;
}
.nav {
  flex: 1 1 auto;
  display: flex;
  // padding-right: 20px;
  justify-content: space-between;
  align-items: center;
//   box-shadow: inset 0 -1px 0 0 #e9e9e9;

  .operation {
    padding: 0px 10px;
    display: flex;
    flex-direction: row;
    #prop_search {
      height: 32px;
      border-radius: 2px;
      border: 1px solid rgba(219, 219, 219, 1);
      font-size: 12px;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: rgba(204, 204, 204, 1);
      line-height: 20px;
    }

    #create_synon_button {
        min-width:62px;
        height:28px;
        background:rgba(255,255,255,1);
        border-radius:3px;
        border:1px solid rgba(219,219,219,1);
        font-size:12px;
        font-family:PingFangSC-Regular,PingFang SC;
        font-weight:400;
        color:rgba(102,102,102,1);
        line-height:20px;
        margin: 0px 10px 0px 20px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-around;
    }
  }
    ::v-deep .emotibot {
        &.el-input {
          width: 200px;
          height: 28px;
          .el-input__inner {
            width: 100%;
            height: 28px;
          }
          .el-input__suffix {
            display: flex;
            justify-content: center;
            align-items: center;
          }
        }
      }
}

#card-content {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  #card-content-header {
    flex: 0 0 40px;
    // border-bottom: 1px solid $color-borderline;
    display: flex;
    align-items: center;
    justify-content: space-between;
    #card-content-title {
      @include font-16px();
      color: $color-font-active;
    }
    #io-buttons {
      display: flex;
      justify-content: space-between;
      .text-button {
        margin: 0 5px;
      }
      :last-child {
        margin-right: 0px;
      }
    }
  }
  #card-content-content {
    height: calc(100% - 55px);
    #toolbar {
      flex: 0 0 auto;
      margin: 10px 20px;
      display: flex;
      .text-button {
        margin: 0 5px;
      }
      :first-child {
        margin-left: 0px;
      }
    }
    .content-table {
      overflow: hidden;
      height: 100%;
    }
  }
  #card-content-footer {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    border-top: 2px solid #e6e6e6;
  }

  #content-blocker {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.55);
  }

  ::v-deep .el-table::before {
          height: 0;
        }
  ::v-deep .el-table__body-wrapper.is-scrolling-none {
        max-height:calc(100% - 48px);
        @include auto-overflow-Y();
        @include customScrollbar();
        }
}
.synonym_warp {
  .synonym_val {
    background-color: #eeeeee;
    border-radius: 2px;
    margin-left: 5px;
    cursor:pointer;
    padding: 0 5px;
    &:first-child {
      margin-left: 0px;
    }
    &:hover {
      font-weight: bold;
      background-color: #e9e9e9;
    }
  }
}
</style>
