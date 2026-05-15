<template>
  <div class="api-adapter-public">
    <div class="api-adapter card h-fill w-fill">
      <div class="card-header">
        <div class="title">{{ $t('api_adapter.outer_api.config_list') }}</div>
        <text-button button-type="primary" @click="handlePopup('create')">{{ $t('api_adapter.outer_api.btn_add_api_config') }}</text-button>
      </div>
      <div class="table-container" ref="tableContainer">
        <el-table :data="apiTableData" :height="tableHeight">
          <el-table-column prop="apiName" :label="$t('api_adapter.outer_api.table.name')" min-width="240px"></el-table-column>
          <el-table-column prop="method" :label="$t('api_adapter.outer_api.table.method')" min-width="120px"></el-table-column>
          <el-table-column :label="$t('api_adapter.outer_api.table.opt')" min-width="120px" width="200px">
            <template slot-scope="scope">
              <emoti-icon name="icon-edit-pen" :size="16" @click="handlePopup('edit', scope.row)"></emoti-icon>
              <emoti-icon name="icon-copy" :size="16" @click="handleCopyAPI(scope.row)"></emoti-icon>
              <emoti-icon name="icon-delete" :size="16" @click="handleDelAPI(scope.row)"></emoti-icon>
              <!-- <el-button @click="handlePopup('edit', scope.row)" class="emotibot primary" type="text" size="small">{{ $t('general.edit') }}</el-button>
              <el-button @click="handleCopyAPI(scope.row)" type="text" class="emotibot primary" size="small">{{ $t('general.copy') }}</el-button>
              <el-button @click="handleDelAPI(scope.row)" type="text" class="emotibot error" size="small">{{ $t('general.delete') }}</el-button> -->
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-pagination
        background
        v-show="tableCount > 0"
        :current-page="curPage"
        :total="tableCount"
        :page-size="pageSize"
        :page-sizes="pageLimits"
        @size-change="handlePageSizeChange"
        @current-change="handlePageIndexChange"
        :pager-count="5"
        layout="prev, pager, next, sizes">
      </el-pagination>
    </div>
    <!-- start edit popup -->
    <public-api-popup
      :visible="visible"
      :type="type"
      :apiDetail="apiDetail"
      @cancel="visible = false">
    </public-api-popup>
    <!-- end edit popup -->
  </div>
</template>

<script>
import api from './_api/publicadapter';
import PublicAPIPopup from './_components/PublicAPIPopup';

export default {
  privCode: 'api_adapter',
  api,
  components: {
    'public-api-popup': PublicAPIPopup,
  },
  data() {
    return {
      curPage: 1,
      pageSize: 10,
      tableCount: 0,
      pageLimits: [10, 50, 100],
      apiTableData: [],
      visible: false,
      type: 'edit',
      apiDetail: {},
      tableHeight: 200,
    };
  },
  methods: {
    handleGetPublishAPI() {
      this.$api.getPublicAPI(this.curPage, this.pageSize)
      .then((data) => {
        if (data.status === 0) {
          this.tableCount = data.result.total_size;
          this.apiTableData = data.result.data;
        }
      });
    },
    handlePageIndexChange(page) {
      this.curPage = page;
      this.handleGetPublishAPI();
    },
    handlePageSizeChange(pagesize) {
      this.pageSize = pagesize;
      this.curPage = 1;
      this.handleGetPublishAPI();
    },
    handleCopyAPI(row) {
      this.$api.copyAPI(row.id)
      .then((data) => {
        if (data.status === 0) {
          this.$message.success(this.$t('api_adapter.outer_api.copy_success'));
          this.handleGetPublishAPI();
        } else {
          this.$message.error(data.message);
        }
      }).catch(() => {
        this.$message.error(this.$t('api_adapter.outer_api.copy_fail'));
      });
    },
    handleDelAPI(row) {
      this.$confirm(this.$t('api_adapter.outer_api.del_confirm'), this.$t('general.description'), {
        confirmButtonText: this.$t('general.ok'),
        cancelButtonText: this.$t('general.cancel'),
        type: 'warning',
      }).then(() => {
        this.$api.deleteAPI(row.id)
        .then((data) => {
          if (data.status === 0) {
            this.$message.success(this.$t('api_adapter.outer_api.del_success'));
            this.handleGetPublishAPI();
          } else {
            this.$message.error(data.message);
          }
        }).catch(() => {
          this.$message.error(this.$t('api_adapter.outer_api.del_fail'));
        });
      }).catch(() => {});
    },
    handlePopup(type, row) {
      this.type = type;
      if (type === 'edit') {
        this.$api.getPublicAPIDetail(row.id)
        .then((data) => {
          if (data.status === 0) {
            this.visible = true;
            this.apiDetail = data.result;
          } else {
            this.$message.error(data.message);
          }
        });
        return;
      }
      this.apiDetail = {};
      this.visible = true;
    },
  },
  created() {
    this.handleGetPublishAPI();
  },
  mounted() {
    this.$nextTick(() => {
      this.tableHeight = this.$refs.tableContainer.offsetHeight - 48;
    });
  },
};
</script>

<style lang="scss" scoped>
@import 'styles/variable.scss';

.api-adapter-public {
  height: 100%;
}
.table-container {
  flex: 1;
}
.api-adapter {
  display: flex;
  flex-direction: column;
  .card-header {
    padding: 0 20px;
    height: 72px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-shrink: 0;
    .title {
      @include font-16px();
    }
  }
  ::v-deep .emotibot.el-table {
    display: flex;
    flex-direction: column;
    .el-table__header-wrapper {
      flex-shrink: 0;
    }
    .el-table__body-wrapper {
      flex: 1;
      height: auto;
      overflow-y: auto;
    }
  }
  ::v-deep .emotibot.el-pagination {
    text-align: right;
    padding-top: 10px;
    padding-bottom: 10px;
  }
}

</style>

