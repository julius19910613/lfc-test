<template>
  <div class="entity_list" :style='{marginLeft:hideTree?"":"10px"}'>
    <div class="operation">
      <div class="title">
        <div class="title-img_wrap"
         @click='$emit("onHideTree");isHideTree=!isHideTree;isTitleImgClicked = true'>
          <img class="title-img" :class="[!isTitleImgClicked? '':isHideTree ? 'rotate90' : 'rotate-90']" src="@/assets/images/category.png">
        </div>
        {{ $t('knowledge_graph.data_manage.general') }}
        <span class="title-count-info" v-if='curTotal > 0'>
          {{$t('knowledge_graph.data_manage.cur_total_entity', {count: curTotal})}}
        </span>
      </div>
      <div class="entity_operation ">
        <!-- <search-input v-model="entityKeyword"></search-input> -->
        <el-input
          class="emotibot"
          :placeholder="$t('knowledge_graph.data_manage.search_placeholder_02')"
          v-model="entityKeyword">
          <i slot="suffix" class="el-icon-search" style='font-size: 14px'></i>
        </el-input>
        <text-button
          v-if="canImport"
          id="import_all_btn"
          button-type="primary"
          icon-align="left"
          icon-type="kg_import"
          @click="allImportKG"
        >
          {{
          $t('knowledge_graph.data_manage.btn_data_input')
          }}
        </text-button>
        <text-button
          id="export_all_btn"
          button-type="primary"
          icon-align="left"
          icon-type="kg_export"
          v-if="canExport"
          @click="allExportKG"
        >
          {{
          $t('knowledge_graph.data_manage.btn_data_export')
          }}
        </text-button>
        <a ref="allExportLink"></a>
      </div>
    </div>
    <div class="table-container">
      <general-scroll-table
        v-if="!loading"
        id="content-table"
        :tableHeader="tableHeader"
        :tableData="tableData"
        :action="tableAction"
        showEmpty
        allow-custom-header
        @closeTooltip="closeValueEdit"
      ></general-scroll-table>
      <template v-if="loading">
        <div class="loading card h-fill w-fill">
          <loading-dot></loading-dot>
        </div>
      </template>
    </div>
    <div id="card-content-footer" v-if="!loading">
      <v-pagination
        class="emotibot"
        size="small"
        :total="curTotal"
        :pageIndex="curPageIdx"
        :pageSize="pageLimit"
        :layout="['prev', 'pager', 'next', 'jumper']"
        @page-change="handlePageChange"
      ></v-pagination>
    </div>
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
import moment from 'moment';
import GeneralScrollTable from '../GeneralScrollTable';
import BatchUpload from '../popups/BatchUploadPop';
import TextTooltip from '../tooltips/TextTooltip';
import NumberTooltip from '../tooltips/NumberTooltip';
import EntityTooltip from '../tooltips/EntityTooltip';
import InterfaceTooltip from '../tooltips/InterfaceTooltip';
import KeywordTooltip from '../tooltips/KeywordTooltip';
import RangeValueTooltip from '../tooltips/RangeValueTooltip';
import DateTimeTooltip from '../tooltips/DateTimeTooltip';
import api from '../../_api/knowledgeGraph';
import DialogDelete from '../dialog/DialogDelete';
import misc from '../../../../utils/js/misc';

export default {
  name: 'PropertyValue',
  api,
  privCode: 'wordbank',
  props: ['canEdit', 'canExport', 'canImport', 'hideTree'],

  components: {
    GeneralScrollTable,
    TextTooltip,
    NumberTooltip,
    KeywordTooltip,
    InterfaceTooltip,
    BatchUpload,
    RangeValueTooltip,
    DateTimeTooltip,
    DialogDelete,
  },
  data() {
    return {
      propertyInfo: [],
      tableHeader: [
      ],
      tableAction: [
      ],
      curPageIdx: 1,
      curTotal: 0,
      entityKeyword: '',
      currentEntities: [],
      originEntities: [], // 缓存实体数据做搜搜；
      pageLimit: 10,
      tooltipX: '',
      tooltipY: '',
      categoryMap: {
        9: InterfaceTooltip,
        5: KeywordTooltip,
        3: NumberTooltip,
        2: TextTooltip,
        1: EntityTooltip,
        8: RangeValueTooltip,
        7: DateTimeTooltip,
      },
      titleMap: {
        9: this.$t('knowledge_graph.entity_edit.type_i'),
        3: this.$t('knowledge_graph.entity_edit.type_f'),
        2: this.$t('knowledge_graph.entity_edit.type_s'),
        1: this.$t('knowledge_graph.entity_edit.type_e'),
        5: this.$t('knowledge_graph.entity_edit.type_k'),
        8: this.$t('knowledge_graph.entity_edit.type_range'),
        7: this.$t('knowledge_graph.entity_edit.type_date'),
      },
      loading: false,
      CATEGORY_MAP_VAL: {
        INTERFACE: 9,
        KEYWORD: 5,
        NUMBER: 3,
        TEXT: 2,
        ENTITY: 1,
        RANGEVALUE: 8,
        DATE: 7,
      },
      timer: null,
      isHideTree: false,
      isTitleImgClicked: false,
      isShowDeleteDialog: false,
      curDeleteData: {}, // 当前准备删除的对象数据
    };
  },

  watch: {
    lastPageIdx() {
      if (this.curPageIdx > this.lastPageIdx) {
        this.toCurPage(this.lastPageIdx);
      }
    },

    curPageIdx() {
      this.refreshCurrentEntities();
    },

    entityKeyword() {
      this.timer = new Date().getTime();

      setTimeout(() => {
        if (new Date().getTime() - this.timer >= 1000) {
          this.refreshCurrentEntities();
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
      'userID',
      'wordbank',
      'currentCategory',
      'displayEntities',
      'isFilterMode',
      'hasNewCategory',
    ]),

    tableData() {
      if (this.curPageIdx <= 0) {
        this.toFirstPage();
      }
      // const startIdx = (this.curPageIdx - 1) * this.pageLimit;
      // const endIdx = startIdx + this.pageLimit;
      if (this.currentEntities !== undefined && this.currentEntities.length > 0) {
        console.log('currentEntities', this.currentEntities);
        return this.currentEntities.map((entity) => {
          const result = {};
          console.log(entity);
          result.id = entity.id;
          result.entityName = entity.name;
          if (entity.properties && entity.properties.length) {
            entity.properties.forEach((prop) => {
              let text = (prop.value || []).length === 0 ? ['-'] : prop.value;
              if (Number(prop.category) === this.CATEGORY_MAP_VAL.DATE
                && (prop.value || []).filter(item => !!item).length > 0) {
                text = moment(Number(prop.value[0])).format('YYYY/MM/DD');
              }
              const option = {
                text,
                showColumnTooltip: prop.showColumnTooltip,
                options: {
                  canEdit: this.canEdit,
                  tooltipX: this.tooltipX,
                  tooltipY: this.tooltipY,
                  component: this.categoryMap[prop.category],
                    // component: this.categoryMap[4],
                  title: this.titleMap[prop.category],
                  extData: {
                    ...prop,
                    editMode: (prop.propertyValueId || []).filter(item => !!item).length > 0,
                    propertyValue: prop.value,
                    propertyValueId: prop.propertyValueId,
                    relationId: prop.relationId,
                    propertyId: prop.propertyId,
                    propertyName: prop.propertyName,
                    category: prop.category,
                    entityId: prop.entityId,
                    entityName: prop.entityName,
                    unit: prop.unit,
                    slotInfo: prop.slotInfo,
                    customWidth: 640,
                  },
                    // extDataId: Math.random(),
                    // disable_ok: true,
                  validate: true,
                  callback: {
                    ok: (newProperty) => {
                      console.log(JSON.stringify(newProperty, null, 2), `callback${22222222}`);
                      if (newProperty.category.toString() === '9') {
                        if (newProperty.implementInterface) {
                          if (prop.propertyValueId.length === 0) {
                            this.addPropertyValue(newProperty);
                          } else {
                            this.updatePropertyValue(newProperty);
                          }
                        } else {
                          this.deletePropertyValue(newProperty);
                        }
                      } else if (prop.propertyValueId.length === 0) {
                        this.addPropertyValue(newProperty);
                      } else {
                        this.updatePropertyValue(newProperty);
                      }
                    },
                  },
                },
              };
              if (this.canEdit) {
                option.onclick = this.popupValueEdit;
              }

              result[prop.id] = [
                option,
              ];
            });
          }
          return result;
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
      'setWordbank',
      'setCurrentCategory',
      'toggleEditMode',
      'resetActiveCategory',
      'appendToRootCategory',
      'appendSubCategory',
      'removeCurrentCategory',
      'setFilterMode',
      'filterCategory',
    ]),
    // 删除实体确认回调
    onDeleteConfirm(data) {
      this.deleteAllPropertyValues(data);
    },
    refreshCurrentEntities() {
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
        const result = [];
        this.loading = true;
        this.$api.GetDataOverviewPropertyValues(this.robotID, this.displayEntities.id, param)
          .then((res) => {
            console.log('GetDataOverviewPropertyValues:', res.data.data);
            this.loading = false;
            this.curTotal = res.data.data.total;
            res.data.data.data.forEach((pv) => {
              const entityInfo = pv.propertyValue.entityInfo[pv.entityId];
              const newRecord = {
                id: entityInfo.id,
                name: entityInfo.name,
                properties: [],
              };
              const entityPropertyValueTable =
                pv.propertyValue.entityPropertyValueTable[newRecord.id];
              // entity.properties = [];
              const propertyInfo = pv.propertyValue.propertyInfo;
              Object.keys(entityPropertyValueTable)
                .forEach((prop) => {
                  if (entityPropertyValueTable[prop] &&
                  this.propertyInfo.filter(i => `${i.id}` === entityPropertyValueTable[prop]
                    .propertyId.toString()).length > 0) {
                    if (!entityPropertyValueTable[prop].category) {
                      entityPropertyValueTable[prop].category = '3';
                    }
                    newRecord.properties.push({
                      id: prop,
                      value: parseInt(entityPropertyValueTable[prop].category, 10)
                        === this.CATEGORY_MAP_VAL.INTERFACE
                        ? this.$t('knowledge_graph.data_manage.implemented')
                        : entityPropertyValueTable[prop].value,
                      unit: entityPropertyValueTable[prop].unit,
                      category: entityPropertyValueTable[prop].category,
                      subCategory: entityPropertyValueTable[prop].subCategory,
                      relationId: entityPropertyValueTable[prop].id,
                      propertyId: entityPropertyValueTable[prop].propertyId,
                      propertyName: this.propertyInfo
                        .find(item => `${item.id}` === entityPropertyValueTable[prop]
                          .propertyId.toString()).name,
                      propertyValueId: entityPropertyValueTable[prop].idTo,
                      entityId: newRecord.id,
                      entityName: newRecord.name,
                      slotInfo: this.propertyInfo
                        .find(item => `${item.id}` === entityPropertyValueTable[prop]
                          .propertyId.toString()).slotInfo,
                      showColumnTooltip: false,
                    });
                    console.log('2222222----newRecord', newRecord);
                  }
                  console.log('333333----newRecord', newRecord);
                });
              console.log('aaaaaaa----newRecord', newRecord);
              const emptyValueProperties = this.tableHeader.filter(item => newRecord
                .properties.filter(prop => `${prop.id}` === `${item.key}`).length === 0)
                .filter(item => item.key !== 'entityName');
              if (emptyValueProperties.length > 0) {
                emptyValueProperties.forEach((item) => {
                  newRecord.properties.push(
                    {
                      id: item.key,
                      value: [],
                      unit: propertyInfo[item.key].unit,
                      category: propertyInfo[item.key].category,
                      relationId: '',
                      propertyId: item.key,
                      propertyName: item.text,
                      propertyValueId: [],
                      entityId: newRecord.id,
                      entityName: newRecord.name,
                      showColumnTooltip: false,
                      slotInfo: this.propertyInfo
                        .find(i => i.id === item.key).slotInfo,
                    },
                  );
                });
              }
              console.log('newRecord', newRecord);
              result.push(newRecord);
            });
            this.currentEntities = result;
          }).catch(() => {
            this.loading = false;
          });
      }
    },

    addPropertyValue(param) {
      const updatedEntity = this.currentEntities
        .filter(entity => entity.id === param.fromEntityId)[0];
      const updateIndex = this.currentEntities.indexOf(updatedEntity);
      if (updatedEntity !== undefined) {
        const selectedProperty = updatedEntity
          .properties.filter(item => item.propertyId === param.propertyId)[0];
        const propertyIndex = updatedEntity.properties.indexOf(selectedProperty);
        selectedProperty.value = (param.toEntityName || []).map(item => (item || '').toString().trim());
        if (parseInt(selectedProperty.category, 10) === this.CATEGORY_MAP_VAL.INTERFACE) {
          selectedProperty.value = [this.$t('knowledge_graph.data_manage.implemented')];
        }
        selectedProperty.propertyValueId = param.toEntityId;
        selectedProperty.slotInfo = param.slotInfo;
        updatedEntity.properties.splice(propertyIndex, 1, selectedProperty);
        this.currentEntities.splice(updateIndex, 1, updatedEntity);
      }
    },

    updatePropertyValue(param) {
      const updatedEntity = this.currentEntities
        .filter(entity => entity.id === param.fromEntityId)[0];
      const updateIndex = this.currentEntities.indexOf(updatedEntity);
      // eslint-disable-next-line prefer-const
      let selectedProperty = updatedEntity
        .properties.filter(item => item.propertyId === param.propertyId)[0];
      const propertyIndex = updatedEntity.properties.indexOf(selectedProperty);
      selectedProperty.value = (param.toEntityName || []).map(item => item.trim());
      if (parseInt(selectedProperty.category, 10) === this.CATEGORY_MAP_VAL.INTERFACE) {
        selectedProperty.value = [this.$t('knowledge_graph.data_manage.implemented')];
      }
      selectedProperty.propertyValueId = param.toEntityId;
      selectedProperty.slotInfo = param.slotInfo;
      selectedProperty.subCategory = param.subCategory;
      console.log('selectedProperty::', JSON.stringify(selectedProperty, null, 2), 3333333333);
      updatedEntity.properties.splice(propertyIndex, 1, selectedProperty);
      this.currentEntities.splice(updateIndex, 1, updatedEntity);
    },

    allImportKG() {
      // this.$refs.batchUpload.click();
      const propertyProp = {
      };
      const options = {
        component: BatchUpload,
        title: this.$t('knowledge_graph.data_manage.pop_title'),
        extData: {
          editMode: false,
          property: propertyProp,
        },
        // disable_ok: true,
        validate: true,
        callback: {
          ok: () => {
            this.initialTableHeader();
            this.loadTableActionByPrivilege();
            this.$emit('refreshTable');
          },
        },
      };
      this.$pop(options);
    },

    fileTypeInvalid(file) {
      const validType = ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
      const suffix = file.name.split('.');
      const ExcelSuffix = 'xlsx';
      const isExecl = suffix && suffix.length > 0 && suffix[suffix.length - 1] === ExcelSuffix;
      return validType.indexOf(file.type) === -1 && !isExecl;
    },

    // validFile() {
    //   let msg = '';
    //   const fileSizeLimit = 15 * 1024 * 1024;
    //   const theFile = this.$refs.batchUpload.files[0];

    //   if (!theFile) {
    //     this.fileValid = false;
    //     msg = this.$t('knowledge_graph.error.upload_file_undefined');
    //   } else if (theFile.size <= 0 || theFile.size > fileSizeLimit) {
    //     this.fileValid = false;
    //     msg = this.$t('knowledge_graph.error.upload_file_size_error');
    //   } else if (this.fileTypeInvalid(theFile)) {
    //     this.fileValid = false;
    //     msg = this.$t('knowledge_graph.error.upload_file_type_invalid');
    //   } else {
    //     this.fileValid = true;
    //     this.file = theFile;
    //     this.$api.initBuildKG(this.file, this.robotID, this.userID)
    //       .then((data) => {
    //         const res = data.data;
    //         if (res.status === 'success') {
    //           this.$notify(
      // { text: this.$t('knowledge_graph.material_manage.batch_upload_success') });
    //         }
    //       })
    //       .catch((err) => {
    //         const message = this.$t('knowledge_graph.material_manage.err_msg_batch_upload_fail',
    //           { name: err.response.data.message });
    //         this.$notifyWarn(message);
    //       });
    //   }
    //   if (!this.fileValid) {
    //     this.$notifyWarn(msg);
    //   }
    // },

    allExportKG() {
      // window.open(`/xeonKgDal/${this.robotID}/exportData`, '_blank');

      // const that = this;
      this.$api.ExportKGFile(this.robotID)
          .then((res) => {
            console.log(res);
            const exportFile = new Blob([res.data], { type: 'application/vnd.ms-excel;charset=UTF-8' });

            window.URL = window.URL || window.webkitURL;
            this.$refs.allExportLink.href = URL.createObjectURL(exportFile);
            this.$refs.allExportLink.download = `${this.$t('knowledge_graph.export_file_name')}.xlsx`;
            // window.open(URL.createObjectURL(errFile), '_blank');

            this.$refs.allExportLink.click();
          });
    },

    // 显示删除实体的弹窗
    showDeletePop(data) {
      console.log('showDeletePop:data:', data);
      const entityName = ((data[Object.keys(data)[0]][0].options || {}).extData || {}).entityName || '';
      const mainTitle = this.$t('knowledge_graph.data_manage.delete_all_property', { name: misc.getEllipsisStr(entityName, 6) });
      const subTitle = this.$t('knowledge_graph.data_manage.delete_unrecoverable');
      this.curDeleteData = { ...data, mainTitle, subTitle };
      this.isShowDeleteDialog = true;
    },

    deletePropertyValue(param) {
      const temp = {
        relations: [{
          fromEntityId: param.fromEntityId.toString(),
          propertyId: param.propertyId.toString(),
        }],
      };

      this.$api.deletePropertyValue(this.robotID, temp).then(() => {
        const updatedEntity = this.currentEntities
          .filter(entity => entity.id === param.fromEntityId)[0];
        const updateIndex = this.currentEntities.indexOf(updatedEntity);
        const selectedProperty = updatedEntity
          .properties.filter(item => item.propertyId === param.propertyId)[0];
        const propertyIndex = updatedEntity.properties.indexOf(selectedProperty);
        selectedProperty.value = [];
        selectedProperty.propertyValueId = [];
        selectedProperty.slotInfo = param.slotInfo;
        console.log('selectedProperty:', JSON.stringify(selectedProperty, null, 2), 3333333333);
        updatedEntity.properties.splice(propertyIndex, 1, selectedProperty);
        this.currentEntities.splice(updateIndex, 1, updatedEntity);
        console.log(this.currentEntities);
      });
    },

    deleteAllPropertyValues(param) {
      const selectedEntity = this.currentEntities.filter(item => item.id === param.id)[0];
      const entityIndex = this.currentEntities.indexOf(selectedEntity);
      const deletePromiseList = [];
      Object.keys(param).map((key) => {
        if (Array.isArray(param[key])) {
          param[key].map((inner) => {
            const extData = (((inner || {}).options || {}).extData || {});
            if (Array.isArray(extData.propertyValueId) && extData.propertyValueId.length
              && extData.propertyValueId.filter(item => !!item).length > 0) {
              const temp = {
                relations: [{
                  fromEntityId: extData.entityId.toString(),
                  propertyId: `${extData.propertyId}`,
                }],
              };
              deletePromiseList.push(this.$api.deletePropertyValue(this.robotID, temp));
            }
            return inner;
          });
        }
        return key;
      });
      Promise.all(deletePromiseList).then(() => {
        selectedEntity.properties = selectedEntity.properties.map((item) => {
          item.relationId = '';
          item.value = [''];
          item.propertyValueId = [''];
          return item;
        });
        this.currentEntities.splice(entityIndex, 1, selectedEntity);
        this.curDeleteData = {};
        this.isShowDeleteDialog = false;
      }).catch(err => console.error('deletePromiseList:err:', err));
    },

    handlePageChange(page) {
      if (page <= 0) {
        this.toFirstPage();
      } else {
        this.toCurPage(page);
      }
    },

    loadTableActionByPrivilege() {
      this.tableAction = [];
      if (this.canEdit) {
        this.tableAction.push({
          text: this.$t('general.delete'),
          type: 'error',
          onclick: this.showDeletePop,
        });
      }
    },
    // actions when click table column
    // set property's showColumnTooltip as true
    popupValueEdit(event, data, key) {
      if (this.canEdit) {
        this.tooltipX = event.clientX;
        this.tooltipY = event.clientY;
        const selectedEntity = this.currentEntities
        .filter(entity => entity.id === data.id)[0];
        const entityIdx = this.currentEntities
        .indexOf(selectedEntity);
        const selectedProperty = selectedEntity.properties.filter(prop => prop.id === key)[0];
        const selectedPropertyIdx = selectedEntity.properties.indexOf(selectedProperty);

        selectedProperty.showColumnTooltip = !selectedProperty.showColumnTooltip;
        selectedEntity.properties.splice(selectedPropertyIdx, 1, selectedProperty);
        this.currentEntities.splice(entityIdx, 1, selectedEntity);
      }
    },

    closeValueEdit(data) {
      this.popupValueEdit('', data[0], data[1]);
    },

    initialTableHeader() {
      let tableHeaderList = [];
      this.$api.getAllCommonProperties(this.robotID)
        .then((result) => {
          tableHeaderList.push({
            key: 'entityName',
            text: this.$t('knowledge_graph.entity_edit.entity'),
            width: '140px',
            lockedLeft: true,
          });

          this.propertyInfo = result.data.data;

          tableHeaderList = [...tableHeaderList, ...result.data.data
          .filter(item => item.category !== undefined)
          .map((data, idx) => ({
            key: data.id,
            text: data.name,
            unit: data.unit,
            category: data.category,
            default: idx < 10,
            type: 'tooltip',
            width: '200px',
          }))];
          this.tableHeader = tableHeaderList;
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
    this.initialTableHeader();
    this.loadTableActionByPrivilege();
  },
};
</script>

<style lang="scss" scoped>
.table-container {
  width: 100%;
  flex: 1 1 58vh;
  display: flex;
  flex-direction: column;
  @include auto-overflow();
}

#content-table {
  overflow: hidden;
}

.entity_list {
  width: calc(100% - 200px);
  background: #ffffff;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  border-radius: 4px;
  .operation {
    padding: 11px 0px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    .title {
      font-size: 18px;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
      line-height: 24px;
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

      .title-count-info {
        font-size: 14px;
        color: #999999;
        margin-left: 10px;
      }
    }
    .entity_operation {
      display: flex;
      flex-direction: row;
      padding: 0px 20px;
      #import_all_btn,
      #export_all_btn {
        width: 120px;
        height: 32px;
        background: rgba(255, 255, 255, 1);
        border-radius: 2px;
        border: 1px solid rgba(233, 233, 233, 1);
        font-size: 14px;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: rgba(102, 102, 102, 1);
        line-height: 16px;
      }
       #import_all_btn {
         margin-left: 20px;
       }
       #export_all_btn {
         margin-left: 10px;
       }
      /deep/ .emotibot {
        &.el-input {
          width: 200px;
          height: 32px;
          .el-input__inner {
            width: 100%;
            height: 32px;
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
    padding: 15px 20px;
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

