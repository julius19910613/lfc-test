<template lang="html">
  <div id="trigger-page" class="page trigger-page">
    <div id="card-content">
      <div id="card-content-content">
        <div class="nav">
          <div>
            <nav-bar :options="propertyMap" v-model="propertyType"/>
          </div>
          <div class="operation">
            <!-- <search-input id="prop_search" v-model="propertyKeyword"></search-input> -->
             <el-input
                ref='searchRef'
                size='mini'
                :autofocus='true'
                class="emotibot"
                :placeholder="$t('knowledge_graph.data_manage.search_placeholder_02')"
                v-model="propertyKeyword"
                suffix-icon="emoti-icon icon-search"
                >
            </el-input>
            <el-button
                id='create_prop_button'
                v-if="canEdit"
                @click="popAddProperty">
                <i class="emoti-icon icon-edit" style="font-size: 12px" />
                    {{$t('knowledge_graph.add_property')}}
            </el-button>
          </div>
        </div>
        <div class='table_wrap' ref='tableWrap' v-if="isCommonList">
          <el-table
            :data="tableData"
            :header-cell-style="tableHeaderCellStyle"
            :cell-style ='tableCellStyle'
            :empty-text="$t('general.no_data')"
          >
            <template v-for="(item, index) in tableHeader">
              <template v-if="item.type === 'tag'">
                <el-table-column 
                :label="item.text"
                show-overflow-tooltip
                min-width="150">
                  <template slot-scope="scope">
                    <div class="column-tag" 
                    @click='onSynonymCellClick(scope.row)'
                    >
                      {{ scope.row.synonym.join("  ") }}
                    </div>
                  </template>
                </el-table-column>
              </template>
              <template v-else-if="item.type === 'click'">
                <el-table-column
                show-overflow-tooltip 
                :label="item.text" 
                min-width="70">
                  <template slot-scope="scope">
                    <span class="edit" v-if="scope.row.corpus > 0" @click="showCorrespondingCorpus(scope.row)">
                      {{$t('knowledge_graph.property_edit.text_total')}}
                      <span class="btn-detail">{{ scope.row.corpus }}</span>
                      {{$t('knowledge_graph.property_edit.text_unit_tiao')}}
                    </span>
                  </template>
                </el-table-column>
              </template>
              <template v-else>
                <el-table-column
                  :key="index"
                  :prop="item.key"
                  :label="item.text"
                  show-overflow-tooltip
                >
                  <template slot-scope="scope">
                    <span :title='scope.row[item.key]'>{{ scope.row[item.key] }}</span>
                  </template>
                </el-table-column>
              </template>
            </template>
            <el-table-column
                v-if="tableAction.length > 0" 
                :label="$t('general.actions')"
                width="100"
                >
              <template slot-scope="scope">
                <div>
                    <emoti-icon
                        v-if="showEditBtn()"
                        iconClass="operation-icon" 
                        name="icon-edit-pen" 
                        hover
                        hoverColor="#1875f0"
                        :popContent="$t('general.edit')"
                        :size="16" @click="editProperty(scope.row)">
                    </emoti-icon>
                    <emoti-icon name="icon-delete"
                        v-if="showDeleteBtn(scope.row)" 
                        iconClass="operation-icon" 
                        :size="16" 
                        hover
                        :popContent="$t('general.delete')"
                        hoverColor="#f67270"
                        @click="deleteProperty(scope.row)">
                    </emoti-icon>
                  <!-- <span class="btn-edit" v-if="showEditBtn()" @click="editProperty(scope.row)">{{ $t('general.edit') }}</span>
                  <span class="delete" v-if="showDeleteBtn(scope.row)" @click="deleteProperty(scope.row)">{{ $t('general.delete') }}</span> -->
                </div>
              </template>
            </el-table-column>
          </el-table>
            <!-- <div class="table-container">
                <general-table id="content-table"
                         :tableHeader="tableHeader" :tableData="tableData" :action="tableAction"
                         showEmpty></general-table>
          </div> -->
        </div>
        <div class='table_wrap' v-else>
          <el-table
            :data="tableData"
            :header-cell-style="tableHeaderCellStyle"
            :cell-style="tableCellStyle"
            :row-key="getRowKey"
            :span-method="objectSpanMethod"
            border
          >
            <el-table-column
              v-for="(item, index) in tableHeader"
              :key="index"
              :prop="item.key"
              :label="item.text"
            ></el-table-column>
            <el-table-column :label="$t('general.actions')">
              <template slot-scope="scope">
                  <div>
                    <emoti-icon
                        v-if="canEdit"
                        iconClass="operation-icon" 
                        name="icon-edit-pen" 
                        hover
                        hoverColor="#1875f0"
                        :popContent="$t('general.edit')"
                        :size="16" @click="editProperty(scope.row)">
                    </emoti-icon>
                    <emoti-icon name="icon-delete"
                        v-if="canEdit" 
                        iconClass="operation-icon" 
                        :size="16" 
                        hover
                        :popContent="$t('general.delete')"
                        hoverColor="#f67270"
                        @click="deleteProperty(scope.row)">
                    </emoti-icon>
                  <!-- <span class="btn-edit" v-if="showEditBtn()" @click="editProperty(scope.row)">{{ $t('general.edit') }}</span>
                  <span class="delete" v-if="showDeleteBtn(scope.row)" @click="deleteProperty(scope.row)">{{ $t('general.delete') }}</span> -->
                </div>
                <!-- <div>
                  <span class="btn-edit" v-if="canEdit" @click="editProperty(scope.row)">{{ $t('general.edit') }}</span>
                  <span class="delete" v-if="canEdit" @click="deleteProperty(scope.row)">{{ $t('general.delete') }}</span>
                </div> -->
              </template>
            </el-table-column>
          </el-table>
        </div>
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
        <!-- <v-pagination class="emotibot" size="small" :total="curTotal" :pageIndex="curPageIdx" :pageSize="pageLimit"
                      :layout="['prev', 'pager', 'next', 'jumper']" @page-change="handlePageChange"></v-pagination> -->
        <!-- <el-pagination
        small
        @current-change="handlePageChange"
        :current-page.sync="curPageIdx"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="curPageSize"
        layout="prev, pager, next, sizes"
        :total="curTotal"
        :hide-on-single-page="true"
      ></el-pagination> -->
      </div>
    </div>

  </div>
</template>

<script>
import Tag from '@/components/basic/Tag';
import NavBar from '@/components/NavigationBar';
import { mapGetters } from 'vuex';
import PropertyEditPop from '../popups/AddPropertyPop';
import ExtPropertyEditPop from '../popups/AddExtPropertyPop';
import CorpusDisplay from '../popups/DisplayCorpusPop';
import api from '../../_api/knowledgeGraph';


export default {
  // name: 'property-manage',
  // privCode: 'wordbank',
  api,
  props: ['canEdit', 'canExport', 'canImport'],
  components: {
    NavBar,
    Tag,
  },
  data() {
    return {
      propertyMap: {
        common: `${this.$t('knowledge_graph.property_edit.standard')}`,
        special: `${this.$t('knowledge_graph.property_edit.custom')}`,
      },
      propertyType: 'common',
      PROPERTY_TYPE: { COMMON: 'common', EXTRA: 'special' },
      properties: [],
      filteredProperties: [],
      currentProperties: [],
      commonPropertyList: [], // 缓存通用属性，使用在新增补充属性时选择属性名称
      propertyKeyword: '',
      tableHeader: [],

      commonHeader: [
        {
          key: 'property',
          text: this.$t('knowledge_graph.property_edit.property'),
          width: '180px',
        },
        {
          key: 'synonym',
          text: this.$t('knowledge_graph.property_edit.synonyms'),
          type: 'tag',
        },
        {
          key: 'corpus',
          text: this.$t('knowledge_graph.property_edit.corpus'),
          width: '120px',
          type: 'click',
        },
        {
          key: 'displayCategory',
          text: this.$t('knowledge_graph.property_edit.category'),
        },
        {
          key: 'unit',
          text: this.$t('knowledge_graph.property_edit.unit'),
        },
        {
          key: 'speech',
          text: this.$t('knowledge_graph.property_edit.speech'),
        },
      ],

      extraHeader: [
        {
          key: 'propertyName',
          text: this.$t('knowledge_graph.property_edit.property'),
          width: '180px',
        },
        {
          key: 'entityName',
          text: this.$t('knowledge_graph.property_edit.entity'),
          type: 'tag',
        },
        {
          key: 'displayCategory',
          text: this.$t('knowledge_graph.property_edit.category'),
        },
        {
          key: 'speech',
          text: this.$t('knowledge_graph.property_edit.speech'),
        },
      ],


      categories: {
        // 1: this.$t('knowledge_graph.entity_edit.type_e'),
        // 2: this.$t('knowledge_graph.entity_edit.type_s'),
        // 3: this.$t('knowledge_graph.entity_edit.type_f'),
        // 6: this.$t('knowledge_graph.entity_edit.type_n'),
      },

      categoryList: [],

      tableAction: [],
      curPageIdx: 1,
      curTotal: 0,
      curPageSize: 10,
      pageLimit: 10,
      entityList: [], // 应用实体option
      originExtraPropertyData: [],
    };
  },
  computed: {
    ...mapGetters([
      'wordbank',
      // 'currentCategory',
      'isEditMode',
      'robotID',
      'userID',
      'screenHeight',
    ]),
    tableHeight() {
      return (this.screenHeight * 0.68) || 0;
    },
    tableMinHeight() {
      const count = ((this.tableData || []).length || 0) + 1;
      return `${(count * 40) + 2}px`;
    },
    tableData() { // This is curPage
      // Handle empty data cause curPageIdx to zero;
      if (this.curPageIdx <= 0) {
        this.toFirstPage();
      }

      if (this.propertyType === this.PROPERTY_TYPE.COMMON) {
        if (this.currentProperties && this.currentProperties.length > 0) {
          const temp = [];
          return this.currentProperties
            .map((data) => {
              let spanCount = ((this.currentProperties
                .filter(item => data.propertyId === item.propertyId) || []).length || 0);
              if (temp.includes(data.propertyId)) {
                spanCount = 0;
              } else {
                temp.push(data.propertyId);
              }
              let tempS = '';
              try {
                tempS = JSON.parse(data.speech).answer;
              } catch (error) {
                console.log('error', error, data.name, data, data.speech, data.speechType);
              }
              data.speech = tempS;
              const tableRow = {
                ...data,
                spanCount,
                id: data.id,
                property: data.name,
                entity: data.entity,
                corpus: ((data.corpus) || [])[0] === null ? 0 : ((data.corpus) || []).length,
                // {
                //   val: ((data.corpus) || [])[0] === null ? 0 : ((data.corpus) || []).length,
                //   typeClass: 'primary',
                //   onclick: this.showCorrespondingCorpus,
                // },
                synonym: data.synonym,
                category: data.category,
                displayCategory: isNaN(data.category) ? data.category
                  : this.categories[data.category],
                unit: data.unit,
                speech: data.speech || '-',
                speechType: data.speechType,
              };
              return tableRow;
            });
        }
        return [];
      }
      if (this.currentProperties && this.currentProperties.length > 0) {
        const temp = [];
        return this.currentProperties.map((item) => {
          let spanCount = ((this.currentProperties
            .filter(item2 => item.propertyId === item2.propertyId) || []).length || 0);
          if (temp.includes(item.propertyId)) {
            spanCount = 0;
          } else {
            temp.push(item.propertyId);
          }
          let tempS = '';
          try {
            tempS = JSON.parse(item.speech).answer;
          } catch (error) {
            console.log('error', error, item.name, item, item.speech, item.speechType);
          }
          item.speech = tempS;
          item.displayCategory = isNaN(item.category) ? item.category
            : this.categories[item.category];
          item.spanCount = spanCount;
          return item;
        });
      }
      return [];
    },

    isCommonList() {
      return this.propertyType === this.PROPERTY_TYPE.COMMON;
    },
    // canCreate() {
    //   return this.$hasRight('create');
    // },
    // canExport() {
    //   return this.$hasRight('delete');
    // },
    // canEdit() {
    //   return this.$hasRight('edit');
    // },
    // canExport() {
    //   return this.$hasRight('export');
    // },
    calcTableHeight() {
      console.log('calcTableHeight', this.$refs, this.$refs.tableWrap);
    },
  },
  watch: {
    propertyType() {
      this.propertyKeyword = '';
      this.curPageIdx = 1;
      this.initialPropertyList(this.propertyKeyword);
      this.loadTableActionByPrivilege();
    },

    properties() {
      this.propertyKeyword = '';
      this.currentProperties = this.properties;
      this.filteredProperties = [];
    },
    propertyKeyword(newVal) {
      if (!newVal && this.curPageIdx !== 1) {
        this.toFirstPage();
      } else {
        this.initialPropertyList(newVal);
      }
    },
    curPageIdx() {
      this.initialPropertyList(this.propertyKeyword);
    },
  },
  methods: {
    onSynonymCellClick(data) {
      if (data.synonym.length > 0) {
        this.editProperty(data);
      }
    },
    showEditBtn() {
      return this.canEdit;
    },

    showDeleteBtn(row) {
      return this.canEdit && row.modifiable;
    },

    tableHeaderCellStyle({ columnIndex }) {
      return `padding-left:${columnIndex === 0 ? '10px' : '0px'};
      background: #F7F7F7;
      color: #666666;
      border-right: none;
      font-size:14px`;
    },
    tableCellStyle({ columnIndex }) {
      return `border-right:${(columnIndex === 0 || columnIndex === 3) && !this.isCommonList ? '1px solid #EBEEF5' : 'none'};
      padding-left:${columnIndex === 0 ? '10px' : '0px'};
      font-size:14px`;
    },
    // 指定table的唯一rowkey
    getRowKey() {
      return `${Math.random()}`;
    },
    // 处理合并表格
    objectSpanMethod({ row, columnIndex }) {
      let result = [1, 1];
      if (columnIndex === 0 || columnIndex === 4) {
        result = [row.spanCount || 0, 1];
      }
      return result;
    },
    getCustomPropertyTypes() {
      return this.$api.getPropertyTypes(this.robotID)
        .then((res) => {
          this.categoryList = res.data.type
            .filter(f => f.id !== 4 && f.id !== 6)
            .map(t => ({
              id: t.id.toString(),
              name: this.$t(`knowledge_graph.type_${t.name}`),
            }));
          const typeObj = {};
          this.categoryList.forEach((category) => {
            // const i18nStr = `knowledge_graph.type_${category.name}`
            typeObj[category.id] = category.name;
          });
          this.categories = typeObj;
          return new Promise((resolve) => {
            resolve();
          });
        });
    },

    handlePageChange(page) {
      this.curPageIdx = page;
    },

    loadTableActionByPrivilege() {
      this.tableAction = [];
      if (this.canEdit) {
        this.tableAction.push({
          text: this.$t('general.edit'),
          type: 'primary',
          onclick: this.editProperty,
        });
        this.tableAction.push({
          text: this.$t('general.delete'),
          type: 'error',
          onclick: this.deleteProperty,
        });
      }

      // if (this.canExport) {

      // }
    },
    getPropertyById(id) {
      return this.currentProperties.filter(property => property.Id === id)[0];
    },
    showCorrespondingCorpus(row) {
      if (row.corpus === 0) {
        console.error('corpus 为空');
        return;
      }
      this.$api.getPropertyById(this.robotID, row.id).then((res) => {
        const corpusList = res.data.property.corpus[0] === null ? [] : res.data.property.corpus;
        const options = {
          component: CorpusDisplay,
          title: this.$t('knowledge_graph.property_edit.corpus_display'),
          data: {
            corpusList,
          },
          validate: false,
          callback: {
            ok: () => {
            },
          },
        };
        this.$pop(options);
      });
    },

    editProperty(data) {
      let prop = {
        id: '',
        name: '',
        corpus: [],
        synonym: [],
      };
      // 补充属性
      if (this.propertyType !== this.PROPERTY_TYPE.COMMON) {
        const selectedRecord = this.currentProperties
          .filter(item => item.propertyId === data.propertyId);
        // 根据 category， unit，speech和slotInfo对数据进行分组sß
        const configList = [];
        const configSet = new Set();
        selectedRecord.forEach((record) => {
          const key = record.category +
            record.unit + record.speech + JSON.stringify(record.extraContent);
          const originLength = configSet.size;
          configSet.add(key);
          const newLength = configSet.size;
          if (originLength !== newLength) {
            configList.push({
              key,
              entity: [record.entityId.toString()],
              type: record.category,
              unit: record.unit,
              speech: record.rawSpeech,
              slotInfo: record.extraContent || {},
              speechType: record.speechType,
            });
          } else {
            const selectedConfig = configList.find(item => item.key === key);
            const selectedIndex = configList.indexOf(selectedConfig);
            selectedConfig.entity.push(record.entityId.toString());
            configList.splice(selectedIndex, 1, selectedConfig);
          }
        });

        prop = {
          propertyId: data.propertyId,
          propertyName: data.propertyName,
          configList,
          categorySet: this.categoryList,
        };
        this.popEditProperty(prop);
      } else {
        const selectedProperty = this.currentProperties
          .filter(item => item.id === data.id);
        prop = {
          id: selectedProperty[0].id,
          propertyName: selectedProperty[0].name,
          introduction: selectedProperty[0].introduction,
          introductionEditFlag: selectedProperty[0].introduction !== null,
          corpusSet: selectedProperty[0].corpus,
          synonymSet: selectedProperty[0].synonym,
          category: selectedProperty[0].category,
          unit: selectedProperty[0].unit,
          speech: selectedProperty[0].rawSpeech ? selectedProperty[0].rawSpeech : '',
          categorySet: this.categoryList,
          isCommonProperty: selectedProperty[0].modifiable === 1,
          entityOptions: [],
          propertyOptions: [],
          valueOptions: [],
          slotInfo: selectedProperty[0].slotInfo ?
            selectedProperty[0].slotInfo : {
              url: '',
              slotList: [],
            },
          speechType: data.speechType,
        };
        this.popEditProperty(prop);
      }
    },
    popEditProperty(property) {
      let options = {};
      if (this.propertyType === this.PROPERTY_TYPE.COMMON) {
        options = {
          showConfirmMessage: true,
          confirmMessage: this.$t('knowledge_graph.property_edit.update_confirm_msg'),
          component: PropertyEditPop,
          title: this.$t('knowledge_graph.property_edit.property_edit'),
          extData: {
            propertyType: this.propertyType,
            editMode: true,
            property,
          },
          validate: true,
          callback: {
            ok: (editedProperty) => {
              console.log('updateProperties', JSON.stringify(editedProperty, null, 2));
              this.updateProperties(editedProperty);
            },
          },
        };
      } else {
        options = {
          showConfirmMessage: true,
          confirmMessage: this.$t('knowledge_graph.property_edit.update_confirm_msg'),
          component: ExtPropertyEditPop,
          title: this.$t('knowledge_graph.property_edit.property_edit'),
          extData: {
            propertyType: this.propertyType,
            editMode: true,
            property,
          },
          validate: true,
          callback: {
            ok: (editedProperty) => {
              console.log(JSON.stringify(editedProperty, null, 2));
              this.updateProperties(editedProperty);
            },
          },
        };
      }
      this.$pop(options);
    },

    // 编辑补充属性信息
    updateExtraProperty(editedProperty) {
      this.$api.updateExtraProperty(this.robotID, editedProperty).then((res) => {
        console.log('updateExtraProperty:res:', res);
      }).catch((err) => {
        console.log('updateExtraProperty:err:', err);
      }).finally(() => {
        this.initialPropertyList(this.propertyKeyword);
      });
    },
    updateProperties(editedProperty) {
      if (this.propertyType === this.PROPERTY_TYPE.EXTRA) {
        this.updateExtraProperty(editedProperty);
      } else {
        this.initialPropertyList(this.propertyKeyword);

        // const param = {
        //   name: editedProperty.name,
        //   corpus: editedProperty.corpusSet,
        //   category: editedProperty.category,
        //   unit: editedProperty.unit,
        //   speech: editedProperty.speech,
        //   parentId: -1,
        //   slotInfo: editedProperty.slotInfo,
        // };

        // const updateApiBatch = [
        //   this.$api.updateProperty(this.robotID, editedProperty.id, param),
        //   this.$api.updateSynonyms(this.robotID, 'property', {
        //     id: editedProperty.id,
        //     synonym: editedProperty.synonymSet,
        //   }),

        // ];

        // if (editedProperty.modifiable) {
        //   updateApiBatch.push(this.$api.updatePropertyIntroduction(this.robotID, {
        //     propertyId: editedProperty.id,
        //     introduction: editedProperty.introduction,
        //   }));
        // }

        // Promise.all(updateApiBatch).then(() => {
        //   this.initialPropertyList(this.propertyKeyword);
        // });
      }
    },
    deleteProperty(data) {
      let msg = '';
      if (!data.property) {
        msg = this.$t('knowledge_graph.property_edit.delete_extra_property_msg', { name: data.propertyName });
      } else {
        msg = this.$t('knowledge_graph.property_edit.delete_property_msg', { name: data.property });
      }
      const option = {
        data: {
          msg,
        },
        callback: {
          ok: () => {
            console.log('deleteProperty:callback:', JSON.stringify(data, null, 2));
            this.confirmDeleteProperty(data);
          },
        },
      };
      this.$popCheck(option);
    },
    popAddProperty() {
      if (this.isCommonList) {
        const propertyProp = {
          propertyName: '',
          categorySet: this.categoryList,
          entityList: this.entityList,
          isCommonProperty: true,
          corpusSet: [],
          synonymSet: [],
          category: '',
          unit: '',
          speech: '',
          introduction: null,
          parentId: -1,
          slotInfo: {
            url: '',
            slotList: [],
          },
          commonPropertyList: this.commonPropertyList,
        };
        const options = {
          component: PropertyEditPop,
          title: this.$t('knowledge_graph.add_property'),
          extData: {
            editMode: false,
            property: propertyProp,
            propertyType: this.propertyType,
          },
          // disable_ok: true,
          validate: true,
          callback: {
            ok: (newProperty) => {
              console.log(JSON.stringify(newProperty, null, 2), 1111);
              this.addNewProperty(newProperty);
            },
          },
        };
        this.$pop(options);
      } else {
        this.$api.getAvailableExtraProperties(this.robotID, {}).then((res) => {
          const availablePropertyNameList = res.data.data.result;
          const propertyProp = {
            availablePropertyNameList,
            categorySet: this.categoryList,
            propertyName: '',
            propertyId: '',
            config: [
              {
                entity: [],
                type: '',
                speech: '',
                speechType: '',
                slotInfo: {
                  url: '',
                  slotList: [],
                },
              },
            ],
          };
          const options = {
            component: ExtPropertyEditPop,
            title: this.$t('knowledge_graph.add_ext_property'),
            extData: {
              editMode: false,
              property: propertyProp,
              propertyType: this.propertyType,
            },
            // disable_ok: true,
            validate: true,
            callback: {
              ok: (newProperty) => {
                console.log(JSON.stringify(newProperty, null, 2), 1111);
                this.addNewProperty(newProperty);
              },
            },
          };
          this.$pop(options);
        });
      }
    },

    addNewProperty(newProperty) {
      if (this.propertyType === this.PROPERTY_TYPE.COMMON) {
        this.initialPropertyList(this.propertyKeyword);
        // const param = {
        //   name: newProperty.name,
        //   // introduction: editedProperty.introduction,
        //   corpus: newProperty.corpusSet,
        //   category: newProperty.category,
        //   unit: newProperty.unit,
        //   speech: newProperty.speech,
        //   slotInfo: newProperty.slotInfo,
        //   parentId: -1,
        // };
        // this.$api.createProperty(this.robotID, param)
        //   .then((res) => {
        //     const synonymApi = new Promise((resolve) => {
        //       this.$api.updateSynonyms(this.robotID, 'property', {
        //         id: res.data.data,
        //         synonym: newProperty.synonymSet,
        //       }).then(() => {
        //         resolve();
        //       });
        //     });

        //     const descApi = new Promise((resolve) => {
        //       this.$api.updatePropertyIntroduction(this.robotID, {
        //         propertyId: res.data.data,
        //         introduction: newProperty.introduction,
        //       }).then(() => {
        //         resolve();
        //       });
        //     });

        //     Promise.all([synonymApi, descApi]).then(() => {
        //       this.initialPropertyList(this.propertyKeyword);
        //     });
        //   });
      } else {
        // const category = this.categoryList.filter(item => item.id === newProperty.category[0]);
        // const param = {
        //   entityId: newProperty.entityId,
        //   propertyInfos: [
        //     {
        //       propertyId: newProperty.propertyId,
        //       category: category[0].name,
        //       unit: newProperty.unit,
        //       speech: newProperty.speech,
        //     },
        //   ],
        // };
        this.$api.addExtraProperty(this.robotID, newProperty).then(() => {
          this.initialPropertyList(this.propertyKeyword);
        }).catch((err) => {
          console.log('addExtraProperty:err:', err);
        });
      }
    },

    confirmDeleteProperty(data) {
      if (this.propertyType === this.PROPERTY_TYPE.COMMON) {
        this.$api.deletePropertyUnderRobot(this.robotID, data.id)
          .then(() => {
            this.initialPropertyList(this.propertyKeyword);
          })
          .catch(() => {
            this.$notifyFail(this.$t('error_msg.delete_fail'));
          });
      } else {
        this.$api.deleteExtraProperty(this.robotID, data.propertyId)
          .then(() => {
            this.initialPropertyList(this.propertyKeyword);
          })
          .catch((err) => {
            console.log('deleteExtraProperty:err:', err);
            this.$notifyFail(this.$t('error_msg.delete_fail'));
          });
      }
    },
    // 获全部的通用属性数据
    getAllCommonProperties() {
      this.$api.getAllCommonProperties(this.robotID).then((res) => {
        console.log('getAllCommonProperties:res:', res);
        this.commonPropertyList = res.data.data || [];
      }).catch((err) => {
        console.log('getAllCommonProperties:err:', err);
      });
    },
    // 获取全部的应用实体数据
    getAllEntities() {
      this.$api.getAllEntitiesByRobotId(this.robotID).then((res) => {
        this.entityList = (res.data.entities || []);
      }).catch((err) => {
        console.log('getAllEntitiesByrobotId:err:', err);
      });
    },

    initialPropertyList(keyword = '') {
      if (this.propertyType === 'common') {
        this.tableHeader = this.commonHeader;
        return new Promise((resolve) => {
          this.$api.getRobotCommonProperties(this.robotID, this.curPageIdx, keyword)
            .then((result) => {
              this.currentProperties = result.data.data;
              this.currentProperties.map(item =>
                // eslint-disable-next-line max-len
                ({ entityId: result.data.entity_id, entityName: result.data.entity_name, ...item }));
              this.curTotal = result.data.pageNum * this.pageLimit;
              resolve();
            });
        });
      }
      this.tableHeader = this.extraHeader;
      return new Promise((resolve) => {
        const param = {
          page: this.curPageIdx,
          limit: this.pageLimit,
          keyword,
        };
        console.log(JSON.stringify(param, null, 2));
        this.$api.getExtraPropertyList(this.robotID, param)
          .then((res) => {
            if ((res.data || {}).data) {
              this.currentProperties = res.data.data.result;
              this.curTotal = res.data.data.total;
            } else {
              this.currentProperties = [];
              this.curTotal = 0;
            }
            resolve();
          });
      });
    },

    toFirstPage() {
      this.curPageIdx = 1;
    },
    toCurPage(page) {
      this.curPageIdx = page;
    },
  },
  beforeMount() {

  },
  mounted() {
    console.log('calcTableHeight', this.$refs, this.$refs.tableWrap.style.height);
    console.log('calcTableHeight', this.$refs.tableWrap.height);
    console.log('calcTableHeight', this.$refs.tableWrap.offsetHight);
    this.getCustomPropertyTypes().then(() => {
      this.getAllCommonProperties();
      this.getAllEntities();
      this.initialPropertyList();
      this.loadTableActionByPrivilege();
    });
  },
};
</script>

<style lang="scss" scoped>
@import 'styles/variable';


.operation-icon {
    margin-right: 10px;
}

#trigger-page {
//   height: calc(100% - 40px);
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

.edit {
  .btn-detail {
    display: inline-block;
    padding: 0px 10px;
    color: $color-primary;
    cursor: pointer;
    &：hover {
      text-decoration: underline;
    }
  }
}
.btn-edit {
  color: $color-primary;
  cursor: pointer;
}
.delete {
  color: $color-error;
  cursor: pointer;
  margin-left: 20px;
}

.nav {
  flex: 0 0 auto;
  display: flex;
  // padding-right: 20px;
  justify-content: space-between;
  align-items: center;
  box-shadow: inset 0 -1px 0 0 #e9e9e9;

  .operation {
    padding: 0px 10px;
    display: flex;
    flex-direction: row;
    align-items: center;
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

    #create_prop_button {
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
  /deep/ .emotibot {
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
    flex: 0 0 60px;
    padding: 0 20px;
    border-bottom: 1px solid $color-borderline;
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
    .table_wrap {
      height: calc(100% - 60px);
      background: blue;
      display: flex;
      /deep/ .el-table {
        flex: 1;
      }
    }
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

    #content-table {
        overflow: hidden;
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
}
/deep/ .el-table::before {
  height: 0;
}
/deep/ .el-table__body-wrapper.is-scrolling-none {
         max-height:calc(100% - 48px);
        @include auto-overflow-Y();
        @include customScrollbar();
        }

.table-container {
  width: 100%;
  flex: 1 1 60vh;
  display: flex;
  flex-direction: column;
  @include auto-overflow();
}

.tags {
  &.tag {
    margin: 0 5px;
    &:first-child {
      margin-left: 0px;
    }
  }
}
.column-tag {
  white-space: nowrap;
  overflow: hidden;
  text-overflow:ellipsis;
  cursor: pointer;
}
.bottom-border {
  border-bottom: 1px solid #e6e6e6;
}
</style>
