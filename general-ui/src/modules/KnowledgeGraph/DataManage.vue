<template>
  <div class="data_manage">
    <div class="nav">
      <el-tabs v-model="currentType" class="emotibot function-setting-tab">
            <el-tab-pane
                v-for="(item, index) in dataTypeMap"
                :key="index"
                :label="item.label"
                :name="item.name"
            >
            </el-tab-pane>
    </el-tabs>
    </div>
    <div class="content">
      <template v-if="currentType === 'general'">
        <template v-if="isInitialStatus">
          <div class="empty_words">
            <div class="word_content">
              <h4>{{ $t('knowledge_graph.data_manage.overview_title') }}</h4>
              <h3>{{ $t('knowledge_graph.data_manage.msg_no_data') }}</h3>
              <!-- <h2>{{ $t('knowledge_graph.data_manage.msg_road_map') }}</h2> -->
              <div style="margin-top:10px">
                <el-button
                    type="primary"
                    size="medium"
                  v-if="canImport"
                  id="data_input"
                  @click.stop="popBatchUpload"
                >{{ $t('knowledge_graph.data_manage.btn_data_input') }}</el-button>
              </div>
              <div class="template_download" @click.stop="downloadKGTemplate">
                <img src="../../../static/images/kg_download.png">
                <h1>{{ $t('knowledge_graph.data_manage.btn_kg_template_download') }}</h1>
              </div>
              <a ref="templateDownloadMain"/>
            </div>
          </div>
          <div class="empty_pic">
            <img class="background" src="../../../static/images/kg_no_data.png">
          </div>
        </template>
        <template v-else>
          <data-overview
          @changeInitStatus="onChangeInitStatus"
          :canEdit = canEdit
          :canImport = canImport
          :canExport = canExport
          >
          </data-overview>
        </template>
      </template>
      <template
        v-else-if="currentType === 'entity'">
        <entity-manage
          :canEdit = canEdit
          :canImport = canImport
          :canExport = canExport
        ></entity-manage>
      </template>
      <template v-else-if="currentType === 'property'">
        <property-manage
          :canEdit = canEdit
          :canImport = canImport
          :canExport = canExport
        ></property-manage>
      </template>
      <template v-else-if="currentType === 'synonym'">
        <synonym-manage
          :canEdit = canEdit
          :canImport = canImport
          :canExport = canExport
        ></synonym-manage>
      </template>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import NavTitle from './_components/NavigationTitle';
import BatchUploadPop from './_components/popups/BatchUploadPop';
import DataOverview from './_components/pages/DataOverview';
import PropertyManage from './_components/pages/PropertyManage';
import SynonymManage from './_components/pages/SynonymManage';
import EntityManage from './_components/pages/EntityManage';
import api from './_api/knowledgeGraph';
// import general from '../IntentEngine/_utils/general';

export default {
  privCode: 'kg_data_manage',
  api,

  components: {
    NavTitle,
    DataOverview,
    PropertyManage,
    EntityManage,
    SynonymManage,
  },

  watch: {
    currentType() {
      if (this.isInitialStatus) {
        this.onChangeInitStatus();
      }
    },
  },

  computed: {

    ...mapGetters([
      'robotID',
      'userID',
    ]),

    canEdit() {
      return this.$hasRight('edit');
    },
    canExport() {
      return this.$hasRight('export');
    },
    canImport() {
      return this.$hasRight('import');
    },
  },

  data() {
    return {
      currentType: 'general',
      isInitialStatus: false,
    //   dataTypeMap: {
    //     general: `${this.$t('knowledge_graph.data_manage.general')}`,
    //     entity: `${this.$t('knowledge_graph.data_manage.entity')}`,
    //     property: `${this.$t('knowledge_graph.data_manage.property')}`,
    //     synonym: `${this.$t('knowledge_graph.data_manage.synonym')}`,
    //   },
      dataTypeMap: [
        {
          name: 'general',
          label: this.$t('knowledge_graph.data_manage.general'),
        },
        {
          name: 'entity',
          label: this.$t('knowledge_graph.data_manage.entity'),
        },
        {
          name: 'property',
          label: this.$t('knowledge_graph.data_manage.property'),
        },
        {
          name: 'synonym',
          label: this.$t('knowledge_graph.data_manage.synonym'),
        },
      ],

    };
  },
  methods: {

    downloadKGTemplate() {
      this.$api.batchUploadTemplate()
        .then((res) => {
          console.log(res);
          const errFile = new Blob([res.data], { type: 'application/vnd.ms-excel;charset=UTF-8' });
          window.URL = window.URL || window.webkitURL;
          this.$refs.templateDownloadMain.href = URL.createObjectURL(errFile);
          this.$refs.templateDownloadMain.download = `${this.$t('knowledge_graph.material_manage.batch_upload_filename')}.xlsx`;
          this.$refs.templateDownloadMain.click();
        });
    },

    popBatchUpload() {
      const propertyProp = {
      };
      const options = {
        component: BatchUploadPop,
        title: this.$t('knowledge_graph.data_manage.pop_title'),
        extData: {
          editMode: false,
          property: propertyProp,
        },
        // disable_ok: true,
        validate: true,
        callback: {
          ok: () => {
            this.isInitialStatus = false;
          },
        },
      };
      this.$pop(options);
    },
    // data-overview中发现所有的属性都为空的时候，显示初始化的导入界面
    onChangeInitStatus() {
      this.initData();
    },
    initData() {
      this.$api.checkKGDataChangeReview(this.robotID).then((res) => {
        this.isInitialStatus = !res.data.result;
      });
    },
  },

  mounted() {
    this.initData();
  },

};
</script>

<style lang="scss" scoped>
@import '../../assets/styles/variable';
#app-page {
  .app-body {
    padding: 0px;
  }
}

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
}

.data_manage {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;

  .nav {
    background: #ffffff;
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    height: 40px;
  }

  .content {
    height: calc(100% - 60px);
    flex: 1;
    margin: 10px;
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

        h3 {
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
  }
}
</style>
