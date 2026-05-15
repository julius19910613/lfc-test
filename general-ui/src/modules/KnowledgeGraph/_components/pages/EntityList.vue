<template>
  <div class="entity_list" :style="{marginLeft:hideTree?'0px':'10px'}">
    <template v-if="loading">
      <div class="loading card h-fill w-fill">
        <loading-dot></loading-dot>
      </div>
    </template>
    <template v-else>
      <div class="operation">
        <div class="title">
            <div class="title-img_wrap"
             @click='$emit("onHideTree");isHideTree=!isHideTree;isTitleImgClicked = true'>
               <img class="title-img" :class="[!isTitleImgClicked? '':isHideTree ? 'rotate90' : 'rotate-90']" src="@/assets/images/category.png">
            </div>
          {{ $t('knowledge_graph.entity_edit.title') }}</div>
        <div class="entity_search">
          <!-- <search-input v-model="entityKeyword"></search-input> -->
          <!-- <el-input
            size='mini'
            ref='searchRef'
            :autofocus='true'
            class="emotibot"
            :placeholder="$t('knowledge_graph.data_manage.search_placeholder_02')"
            v-model="entityKeyword">
            <i slot="suffix" class="el-icon-search" style='font-size: 14px'></i>
          </el-input> -->
          <el-input
                ref='searchRef'
                size='mini'
                :autofocus='true'
                class="emotibot"
                :placeholder="$t('knowledge_graph.data_manage.search_placeholder_02')"
                v-model="entityKeyword"
                suffix-icon="emoti-icon icon-search"
                >
            </el-input>
        </div>
      </div>
      <div class="table-container">
          <el-table
            ref="entityTable"
            class="emotibot"
            :data="tableData"
            style="width: 100%"
            :emptyText="$t('general.no_data')"
          >
            <el-table-column
                v-for="(item, index) in tableHeader"
                :key="index"
                :label="item.text"
                show-overflow-tooltip
                min-width="150"   
            >
                <template slot-scope="scope">
                    <template v-if="item.key=== 'synonym'">
                        <div class="column-tag" @click='onSynonymCellClick(scope.row)'>
                            <!-- <tag class="tags"
                                v-for="(tag, tagIdx) in scope.row.synonym"
                                :key="`${tagIdx}-${tag}`"
                                >
                                {{ tag }}
                            </tag> -->
                            <!-- <div
                                v-for="(tag, tagIdx) in scope.row.synonym"
                                :key="`${tagIdx}-${tag}`"
                            >
                                {{ tag }}
                            </div> -->
                            {{ scope.row.synonym.join(", ") }}
                        </div>
                    </template>
                    <template v-else>
                        <div 
                        >{{ scope.row[item.key] }}</div>
                    </template>   
                </template>
            </el-table-column>
            <el-table-column
                v-if="tableAction.length > 0"
                :label="$t('general.actions')"
                min-width="100"
            >
                <template slot-scope="scope">
                    <emoti-icon
                        iconClass="operation-icon" 
                        name="icon-edit-pen" 
                        hover
                        hoverColor="#1875f0"
                        :popContent="$t('general.edit')"
                        :size="16" @click="editEntity(scope.row)">
                    </emoti-icon>
                    <emoti-icon name="icon-delete" 
                        iconClass="operation-icon" 
                        :size="16" 
                        hover
                        :popContent="$t('general.delete')"
                        hoverColor="#f67270"
                        @click="deleteSelectedEntity(scope.row)">
                    </emoti-icon>
                </template>
            </el-table-column>

          </el-table>
      </div>
      <div id="card-content-footer">
          <el-pagination
                class="emotibot" 
                background
                
                @current-change="handlePageChange"
                :current-page="curPageIdx"
                
                :page-size="pageLimit"
                layout="prev, pager, next, jumper"
                :total="curTotal">
            </el-pagination>
        <!-- <v-pagination
          class="emotibot"
          size="small"
          :total="curTotal"
          :pageIndex="curPageIdx"
          :pageSize="pageLimit"
          :layout="['prev', 'pager', 'next', 'jumper']"
          @page-change="handlePageChange"
        ></v-pagination> -->
      </div>
    </template>
    <DialogDelete
      :params='curDeleteData'
      :isShow='isShowDeleteDialog'
      @confirm='onDeleteConfirm'
      @cancel='isShowDeleteDialog = false'
    ></DialogDelete>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex';
import misc from '@/utils/js/misc';
import api from '../../_api/knowledgeGraph';
import addEntityPop from '../popups/AddEntityPop';
import DialogDelete from '../dialog/DialogDelete';
import Tag from '../Tag';

export default {
  name: 'EntityList',
  api,
  props: ['canEdit', 'canExport', 'canImport', 'hideTree'],
  privCode: 'wordbank',
  components: {
    DialogDelete,
    Tag,
  },
  data() {
    return {
      tableHeader: [
        {
          key: 'entity',
          text: this.$t('knowledge_graph.entity_edit.entity'),
          width: '140px',
        },
        {
          key: 'displayName',
          text: this.$t('knowledge_graph.entity_edit.displayName'),
          width: '140px',
        },
        {
          key: 'synonym',
          text: this.$t('knowledge_graph.entity_edit.synonyms'),
          type: 'tag',
          clickable: true,
        },
        {
          key: 'formartIntroduction',
          text: this.$t('knowledge_graph.entity_edit.introduction'),
          clickable: true,
        },
      ],
      curPageIdx: 1,
      curTotal: 0,

      currentEntities: [],
      // filterEntities: [],
      tableAction: [],
      pageLimit: 10,
      entityKeyword: '',

      timer: null,
      loading: false,
      isHideTree: false,
      isTitleImgClicked: false,
      isShowDeleteDialog: false,
      curDeleteData: {}, // 当前准备删除的对象数据
    };
  },

  watch: {
    curPageIdx() {
      this.refreshCurrentEntities();
    },

    lastPageIdx() {
      if (this.curPageIdx > this.lastPageIdx) {
        this.toCurPage(this.lastPageIdx);
      }
    },

    entityKeyword() {
      this.timer = new Date().getTime();

      setTimeout(() => {
        if (new Date().getTime() - this.timer >= 1000) {
          if (this.curPageIdx !== 1) {
            this.toFirstPage();
          } else {
            this.refreshCurrentEntities();
          }
        }
      }, 1000);
    },

    displayEntities() {
      if (this.curPageIdx !== 1) {
        this.toFirstPage();
      } else {
        this.refreshCurrentEntities();
      }
    },
  },

  computed: {
    ...mapGetters([
      'robotID',
      'displayEntities',
    ]),

    tableData() { // This is curPage
      // Handle empty data cause curPageIdx to zero;
      if (this.curPageIdx <= 0) {
        this.toFirstPage();
      }

      // const startIdx = (this.curPageIdx - 1) * this.pageLimit;
      // const endIdx = startIdx + this.pageLimit;
      if (this.currentEntities !== undefined && this.currentEntities.length > 0) {
        return this.currentEntities
          .map((data) => {
            let formartIntroduction = '';
            console.log(data.introduction, '---data.introduction');
            try {
              let temp = '';
              if (data.introduction) {
                temp = (JSON.parse(data.introduction) || [])[0] || {};
              }
              let answer = '';
              if (temp && temp.value) {
                const tempValue = JSON.parse(temp.value);
                answer = tempValue.answer || '';
              }
              formartIntroduction = answer;
            } catch (error) {
              console.log('error', error);
              formartIntroduction = data.introduction;
            }
            console.log(formartIntroduction, 'formartIntroduction');
            const tableRow = {
              id: data.id,
              displayName: data.displayName,
              entity: data.name,
              synonym: data.synonym,
              introduction: data.introduction,
              formartIntroduction,
            };
            return tableRow;
          });
      }
      return [];
    },

    lastPageIdx() {
      return Math.floor((this.curTotal - 1) / this.pageLimit) + 1;
    },
  },

  methods: {
    ...mapMutations([
      'setDeleteId',
      'setUpdateId',
    ]),
    onDeleteConfirm(data) {
      console.log('onDeleteConfirm', JSON.stringify(data, null, 2));
      this.confirmDeleteEntity(data);
    },
    onCellClick({ rowData, key }) {
      if (rowData && rowData[key]) {
        const isEmptyArray = Array.isArray(rowData[key]) && rowData[key].length === 0;
        const isEmptyObj = typeof rowData[key] === 'object' && Object.keys(rowData[key]).length === 0;
        if (!isEmptyArray && !isEmptyObj) {
          this.editEntity(rowData);
        }
      }
    },
    refreshCurrentEntities() {
      this.loading = true;
      let param = {};
      if (this.curPageIdx > 0) {
        if (this.displayEntities.id === '0') {
          param = {
            page: this.curPageIdx,
            entityTreeKeyword: this.displayEntities.keyword,
            entityListKeyword: this.entityKeyword,
          };
        } else {
          param = {
            page: this.curPageIdx,
            entityListKeyword: this.entityKeyword,
          };
        }

        this.$api.GetEntityListData(this.robotID, this.displayEntities.id, param)
          .then((res) => {
            console.log(res.data.total);
            this.curTotal = res.data.total;
            this.currentEntities = res.data.dataDetail.map((item) => {
              // 如果对象是一个合法json，那么代表数据库中有值，需要置introductionEdit栏位为true
              if (misc.isJsonString(item.introduction)) {
                item.introductionEditMode = true;
              } else {
                item.introductionEditMode = false;
              }
              return item;
            });
            this.loading = false;
            this.$nextTick(() => {
              const el = (this.$refs.searchRef || {});
              if (el.focus) {
                // el.focus();
              }
            });
          });
      } else {
        this.loading = false;
      }
    },

    loadTableActionByPrivilege() {
      this.tableAction = [];
      if (this.canEdit) {
        this.tableAction.push({
          text: this.$t('general.edit'),
          type: 'primary',
          onclick: this.editEntity,
        });
        this.tableAction.push({
          text: this.$t('general.delete'),
          type: 'error',
          onclick: this.deleteSelectedEntity,
        });
      }
    },
    // 显示删除实体的弹窗
    deleteSelectedEntity(data) {
      console.log('showDeletePop:data:', data);
      const mainTitle = this.$t('knowledge_graph.entity_edit.entity_delete_msg',
       { name: misc.getEllipsisStr(data.entity, 6) });
      const subTitle = this.$t('knowledge_graph.data_manage.delete_unrecoverable');
      this.curDeleteData = { ...data, mainTitle, subTitle };
      this.isShowDeleteDialog = true;
      // const option = {
      //   data: {
      //     // msg: this.$t('knowledge_graph.entity_edit.delete_entity', { name: data.entity }),
      //     msg: this.$t('knowledge_graph.entity_edit.entity_delete_msg'),
      //   },
      //   callback: {
      //     ok: () => {
      //       const deleteEntity = this.currentEntities.filter(item => item.id === data.id)[0];
      //       this.confirmDeleteEntity(deleteEntity);
      //     },
      //   },
      // };
      // this.$popCheck(option);
    },

    confirmDeleteEntity(data) {
      this.$api.deleteEntityUnderRobot(this.robotID, data.id)
        .then(() => {
          this.setDeleteId(data.id);
          this.currentEntities = [];
          // const deletedEntity = this.currentEntities.find(item => item.id === data.id);
          // if (deletedEntity) {
          //   const index = this.currentEntities.indexOf(deletedEntity);
          //   this.currentEntities.splice(index, 1);
          // }
        })
        .catch(() => {
          // // console.log(err);
          this.$notifyFail(this.$t('knowledge_graph.error.delete_entity_fail'));
        });
    },


    handlePageChange(page) {
      if (page <= 0) {
        this.toFirstPage();
      } else {
        this.toCurPage(page);
      }
      // this.checkedProperty = [];
    },

    editEntity(data) {
      console.log(data);
      const editedEntity = this.currentEntities.find(item => item.id === data.id);

      const entity = {};
      const relatedEntityApi = new Promise((resolve) => {
        resolve(entity);
      });

      const relatedPropertyApi = new Promise((resolve) => {
        resolve(entity);
      });

      if (editedEntity.displayName === null || editedEntity.displayName === undefined) {
        editedEntity.displayName = editedEntity.name;
      }


      Promise.all([relatedEntityApi, relatedPropertyApi]).then((entities) => {
        const options = {
          component: addEntityPop,
          title: this.$t('knowledge_graph.entity_edit.pop_title'),
          extData: {
            editMode: true,
            entity: {
              id: editedEntity.id,
              name: editedEntity.name,
              displayName: editedEntity.displayName,
              synonym: data.synonym,
              introductionEditMode: editedEntity.introductionEditMode,
              relatedEntities: entities[0].relatedEntities,
              relatedProperties: entities[1].relatedProperties,
              relatedValues: entities[1].relatedValues,
              introduction: data.introduction,
            },
          },
          validate: true,
          callback: {
            ok: (res) => {
              const selectedEntity = this.currentEntities
                    .filter(e => e.id === res.id)[0];
              const selectedIndex = this.currentEntities
                    .indexOf(selectedEntity);
              selectedEntity.name = res.name;
              selectedEntity.displayName = res.displayName;
              selectedEntity.introduction = res.introduction;
              selectedEntity.synonym = res.synonym;
              this.currentEntities.splice(selectedIndex, 1, selectedEntity);
              // const updateEntityPromise = new Promise(resolve =>
              //   this.$api.updateNodeName(this.robotID, {
              //     id: res.id,
              //     name: res.name,
              //   }).then(() => {
              //     resolve();
              //   }));

              // const updateSynonymPromise = new Promise(resolve =>
              //   this.$api.updateSynonyms(this.robotID, 'entity', {
              //     id: res.id,
              //     synonym: res.synonym,
              //   }).then(() => {
              //     resolve();
              //   }));

              // let introductionPromise = '';
              // if (res.introductionEditMode) {
              //   introductionPromise = new Promise(resolve =>
              //     this.$api.createEntityProfile(this.robotID, res.id, {
              //       introduction: res.introduction,
              //     }).then(() => {
              //       resolve(res.introduction);
              //     }));
              // } else if (!res.introduction ||
              //   (res.introduction && res.introduction && res.introduction.length === 0) ||
              //   (misc.isJsonString(res.introduction) &&
              //     JSON.parse(res.introduction).length === 0)) {
              //   // 新增模式，判断introduction是否有内容，若无内容，不调用新增实体简介接口
              //   introductionPromise = new Promise((resolve) => { resolve(''); });
              // } else {
              //   introductionPromise = new Promise(resolve =>
              //     this.$api.createEntityProfile(this.robotID, res.id, {
              //       introduction: res.introduction,
              //     }).then(() => {
              //       resolve(res.introduction);
              //     }));
              // }

              // Promise.all([updateEntityPromise,
              //   updateSynonymPromise,
              //   introductionPromise]).then((results) => {
              //     const selectedEntity = this.currentEntities
              //       .filter(e => e.id === res.id)[0];
              //     const selectedIndex = this.currentEntities
              //       .indexOf(selectedEntity);
              //     selectedEntity.name = res.name;
              //     selectedEntity.introduction = results[2];
              //     selectedEntity.synonym = res.synonym;
              //     this.currentEntities.splice(selectedIndex, 1, selectedEntity);
              //     // this.setUpdateId(res.id);
              //   });
            },
          },
        };
        this.$pop(options);
      });
    },

    toFirstPage() {
      this.curPageIdx = 1;
    },
    toCurPage(page) {
      this.curPageIdx = page;
    },
  },

  mounted() {
    this.loadTableActionByPrivilege();
  },
};
</script>

<style lang="scss" scoped>

.column-tag {
  white-space: nowrap;
  overflow: hidden;
  text-overflow:ellipsis;
  cursor: pointer;
}
.tags {
  &.tag {
    margin: 0 5px;
    &:first-child {
      margin-left: 0px;
    }
  }
}

.operation-icon {
    margin-right: 10px;
}
.table-container {
  width: 100%;
  flex: 1 1 60vh;
  display: flex;
  flex-direction: column;
  @include auto-overflow();
  border-bottom: 1px solid #e6e6e6;
  ::v-deep .general-table-container {
    background: white;
    .general-table-header {
      background: #f6f6f6;
    }
    tbody{
      background: white;
    }
  }
}

#content-table {
  overflow: hidden;
}

.entity_list {
  background: #ffffff;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  margin-left: 10px;
  border-radius: 4px;
  .operation {
    padding: 11px 0px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    .title {
        height:28px;
        font-size:16px;
        font-family:PingFangSC-Regular,PingFang SC;
        font-weight:400;
        color:rgba(51,51,51,1);
        line-height:28px;
        margin-left: 20px;
        display: flex;
        align-items: center;
      .title-img_wrap {
        height: 44px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        .title-img {
          font-size: 18px;
          margin-right: 20px;
        }
        .rotate90 {
          animation: 500ms r90 ease-in-out forwards;
        }
        .rotate-90 {
          animation: 500ms r-90 ease-in-out forwards;
        }
      }
    }
    .entity_search {
      padding: 0px 20px;
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
  }
  #card-content-footer {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    // padding: 15px 20px;
  }
}
@keyframes r90 {
  0% { transform: rotate(0deg) }
  100% { transform: rotate(90deg) }
}
@keyframes r-90 {
  0% { transform: rotate(90deg) }
  100% { transform: rotate(0deg) }
}
</style>
