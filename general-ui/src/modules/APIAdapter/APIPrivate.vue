<template>
  <div class="app-body">
    <div class="api-adapter">
      <div class="card-header">
        <div class="title">{{ $t('api_adapter.api_private.config_list') }}</div>
        <text-button 
          button-type="primary"
          @click="handleEdit('add')">{{ $t('api_adapter.api_private.add_api_private') }}
        </text-button>
      </div>
      <div class="card-body">
        <div class="table-wrap">
          <el-table :data="innerList"  height="100%">
            <el-table-column
              prop="apiAdapterName"
              :label="$t('api_adapter.api_private.table.name')"
              width="280">
            </el-table-column>
            <el-table-column
              prop="apiType"
              width="280"
              :label="$t('api_adapter.api_private.table.type')">
            </el-table-column>
            <el-table-column
              prop="url"
              :label="$t('api_adapter.api_private.table.url')">
            </el-table-column>
            <el-table-column
              width="200"
              prop="operate"
              :label="$t('api_adapter.api_private.table.operate')">
              <template slot-scope="scope">
                <div class="operate-group">
                  <emoti-icon name="icon-edit-pen" :size="16" @click="handleEdit('edit', scope)"></emoti-icon>
                  <emoti-icon name="icon-delete" :size="16" @click="deleteInnerItem(scope)"></emoti-icon>
                  <!-- <span @click="handleEdit('edit', scope)">{{$t('api_adapter.btn.edit')}}</span> -->
                  <!-- <span class="delete" @click="deleteInnerItem(scope)">{{$t('api_adapter.btn.delete')}}</span> -->
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="page-control">
          <el-pagination
            class="emotibot"
            background
            layout="prev, pager, next, sizes"
            :page-sizes="[10, 20, 500, 100]"
            :total="total"
            @size-change="handleSizeChange" 
            @current-change="handleCurrentChange">
          </el-pagination>
        </div>
      </div>
    </div>
    <el-dialog
      class="emotibot"
      :title="$t('api_adapter.api_private.add_api_private')"
      width="900"
      :visible.sync="showModel"
      :before-close="handleClose">
      <add-private-api :basicData="basicData" ref="private"></add-private-api>
      <div class="map-item-box">
        <map-item
          ref="request"
          :title="mapList.request.title"
          :tableType="mapList.request.type"
          :mapList="mapList.request.list"
          @handleDeleteMap="handleDeleteMap"
          @handleAddItem="handleAddItem"
          @handleEditMap="handleEditMap"
          @handle2Blur="handle2Blur"
        >
        </map-item>
      </div>
      <div class="map-item-box">
        <map-item
          ref="response"
          :title="mapList.response.title"
          :tableType="mapList.response.type"
          :mapList="mapList.response.list"
          @handleDeleteMap="handleDeleteMap"
          @handleAddItem="handleAddItem"
          @handleEditMap="handleEditMap"
          @handle2Blur="handle2Blur"
        >
        </map-item>
      </div>
      <div slot="footer" class="dialog-footer">
        <text-button 
          slot="reference"
          @click="handleClose">{{ $t('general.cancel') }}
        </text-button>
        <text-button 
          class="primary"
          slot="reference"
          @click="handleSave">{{$t('api_adapter.btn.confirm_add')}}
        </text-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import TextButton from '@/components/basic/TextButton';
import AddPrivateApi from './_components/AddPrivateAPI';
import MapItem from './_components/MapItem';
import api from './_api/private';

export default {
  privCode: 'api_private',
  api: [api],
  components: {
    TextButton,
    AddPrivateApi,
    MapItem,
  },
  data() {
    return {
      innerList: [],
      isAdding: false,
      showModel: false,
      current: 1,
      size: 10,
      total: 0,
      basicData: {},
      mapList: {
        request: {
          title: this.$t('api_adapter.api_private.tips.request_map'),
          type: 'request',
        },
        response: {
          title: this.$t('api_adapter.api_private.tips.response_map'),
          type: 'response',
        },
      },
      operateType: '',
    };
  },
  created() {
    this.initData();
    this.fetchInnerList();
  },
  methods: {
    // handle fetch inner list
    fetchInnerList() {
      this.$api.fetchInnerList(this.current, this.size)
        .then((res) => {
          if (res.status === 0) {
            this.innerList = res.result.data;
            this.total = res.result.total_size;
          }
        })
        .catch(() => {});
    },
    // handle change inner list pagesize
    handleSizeChange(size) {
      this.size = size;
      this.fetchInnerList();
    },
    // handle change inner list pageIndex
    handleCurrentChange(current) {
      this.current = current;
      this.fetchInnerList();
    },
    // handle edit inner list row
    handleEdit(type, scope) {
      this.operateType = type;
      if (type === 'edit') {
        this.fetchMapList(scope.row.id);
      } else {
        this.mapList.request.list.push({ id: -1 });
        this.mapList.response.list.push({ id: -1 });
      }
      this.showModel = true;
      this.$refs.private.fetchOuterApiList();
    },
    fetchMapList(id) {
      this.$api.fetchMapList(id)
        .then((res) => {
          if (res.status === 0) {
            this.basicData = res.result;
            this.mapList.request.list = this.basicData.requestMappingDefinition.fieldMapping;
            this.mapList.request.list.forEach((item) => {
              [item.source, item.dest] = [item.dest, item.source];
            });
            this.mapList.response.list = this.basicData.responseMappingDefinition.fieldMapping;
          }
        })
        .finally(() => {
          this.mapList.request.list.push({ id: -1 });
          this.mapList.response.list.push({ id: -1 });
        });
    },
    // init edit model data
    initData() {
      this.mapList.response.list = [];
      this.mapList.request.list = [];
      this.basicData = {
        apiAdapterName: '',
        apiType: '',
        url: this.$t('api_adapter.api_private.tips.add_outer_api'),
        outerApiId: '',
      };
    },
    // handle close edit & add model
    handleClose() {
      this.initData();
      this.showModel = false;
    },
    // handle delete inner list row
    deleteInnerItem(scope) {
      this.$api.deleteInner(scope.row.id)
        .then((res) => {
          if (res.status === 0) {
            this.$message.success(this.$t('api_adapter.api_private.tips.delete_success'));
            this.fetchInnerList();
          } else {
            this.$message.success(res.message);
          }
        });
    },
    // handle delete request map row when edit or add inner list
    handleDeleteMap(scope, type) {
      this.mapList[type].list.splice(scope.$index, 1);
    },
    handleAddItem(type) {
      this.mapList[type].list.splice(this.mapList[type].list.length - 1, 1);
      this.mapList[type].list.push({
        edit: false,
        source: '',
        dest: '',
      });
      this.mapList[type].list.push({ id: -1 });
    },
    checkDuplicate(list) {
      let status = false;
      if (list.length !== [...new Set(list)].length) {
        status = true;
      }
      return status;
    },
    // handle save & edit request
    handleSave() {
      if (this.basicData.apiAdapterName.length === 0 || this.basicData.apiType.length === 0) {
        this.$message.warning(this.$t('api_adapter.api_private.tips.api_type_empty'));
        return;
      }
      if (this.basicData.outerApiId === -1) {
        this.$message.warning(this.$t('api_adapter.api_private.tips.outer_api_empty'));
        return;
      }
      // check empty
      const reqHasEmpty = this.mapList.request.list.some(item => item.source === '' || item.dest === '');
      const resHasEmpty = this.mapList.response.list.some(item => item.source === '' || item.dest === '');
      if (reqHasEmpty || resHasEmpty) {
        this.$message.warning(this.$t('api_adapter.api_private.tips.map_item_empty'));
        return;
      }
      // check request duplicate
      const requestSource = [];
      const requestDest = [];
      this.mapList.request.list.forEach((item) => {
        requestSource.push(item.source);
        requestDest.push(item.source);
      });
      if (this.checkDuplicate(requestSource) || this.checkDuplicate(requestDest)) {
        this.$message.warning(this.$t('adapter.req_pattern_warn_msg'));
        return;
      }
      // check response duplicate
      const responseSource = [];
      const responseDest = [];
      this.mapList.response.list.forEach((item) => {
        responseSource.push(item.source);
        responseDest.push(item.source);
      });
      if (this.checkDuplicate(responseSource) || this.checkDuplicate(responseDest)) {
        this.$message.warning(this.$t('adapter.res_pattern_warn_msg'));
        return;
      }
      this.mapList.response.list.splice(this.mapList.response.list.length - 1, 1);
      this.mapList.request.list.splice(this.mapList.request.list.length - 1, 1);
      this.mapList.request.list.forEach((item) => {
        [item.source, item.dest] = [item.dest, item.source];
      });
      const params = {
        outerApiId: this.basicData.outerApiId,
        apiAdapterName: this.basicData.apiAdapterName,
        apiType: this.basicData.apiType,
        requestMappingDefinition: {
          fieldMappingEnabled: true,
          fieldMapping: this.mapList.request.list,
        },
        responseMappingDefinition: {
          fieldMappingEnabled: true,
          fieldMapping: this.mapList.response.list,
        },
      };
      this.operateType === 'add' ? this.handleAddSuccess(params) : this.handleUpdateSuccess(params);
    },
    handleAddSuccess(params) {
      this.$api.addInnerApi(params)
        .then((res) => {
          this.handleClose();
          if (res.status === 0) {
            this.$message.success(this.$t('api_adapter.api_private.tips.add_inner_api_success'));
            this.fetchInnerList();
          } else {
            this.$message.success(res.message);
          }
        })
        .catch(() => {});
    },
    handleUpdateSuccess(params) {
      this.$api.updateInnerApi(params, this.basicData.id)
        .then((res) => {
          this.handleClose();
          if (res.status === 0) {
            this.$message.success(this.$t('api_adapter.api_private.tips.edit_inner_api_success'));
            this.fetchInnerList();
          } else {
            this.$message.success(res.message);
          }
        })
        .catch(() => {});
    },
    handleEditMap(data, type, key) {
      this.$set(this.mapList[type].list[data.$index], key, true);
      this.$nextTick(() => {
        const ref = `${type}${key}${data.$index}`;
        this.$refs[type].$refs[ref].focus();
      });
    },
    handle2Blur(data, type, key) {
      this.$set(this.mapList[type].list[data.$index], key, false);
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'styles/variable.scss';
.app-body {
  height: calc(100vh - 40px)!important;
}

.api-adapter {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  height: calc(100% - 40px);
  font-family:PingFangSC-Regular;
  border-radius:4px;
  overflow: hidden;
  .card-header {
    background: #ffffff;
    padding: 0 20px;
    height: 72px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .title {
      @include font-16px();
    }
  }
  .card-body {
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    background: #ffffff;
    .table-wrap {
      // flex: 1;
      height: 100%;
    }
  }
  .delete{
    color: $error-color;
  }
  .operate-group{
    span{
      cursor: pointer;
      display: inline-block;
      margin-right: 20px;
    }
  }
}
// .page-control {
//   box-sizing: border-box;
//   -moz-box-sizing: border-box;
//   -webkit-box-sizing: border-box;
//   padding: 10px;
//   text-align: right;
// }

.map-item-box{
  margin-top: 20px;
}
</style>

