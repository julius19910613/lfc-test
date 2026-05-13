<template>
  <div class="map-item">
    <p class="title">{{title}}</p>
    <div class="add-table">
      <p class="map-name">{{this.$t('api_adapter.api_private.key_map')}}</p>
      <el-table
        class="emotibot el-table-input"
        :span-method="objectSpanMethod"
        :data="mapList">
        <el-table-column
          fixed
          width="1">
          <template slot-scope="scope">
            <span 
              v-if="scope.row.id && scope.row.id === -1"
              @click="addItem(tableType)" class="add-item">
              {{$t('api_adapter.btn.add')}}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          fixed
          prop="source"
          :label="$t('api_adapter.api_private.outer_api_key')">
          <template slot-scope="scope">
            <el-input
              :ref="`${tableType}editSource${scope.$index}`"
              class="emotibot"
              v-show="scope.row.editSource"
              v-model="scope.row.source" 
              :placeholder="$t('api_adapter.api_private.tips.input_key')"
              size="mini"
              @blur="handleBlur(scope, tableType, 'editSource')"
            >
            </el-input>
            <div 
              v-show="!scope.row.editSource"
              class="table-edit-item">
              <span @click="handleEdit(scope, tableType, 'editSource')">
                {{scope.row.source || $t('adapter.ext_pattern_msg')}}
                <i class="edit-icon"></i>
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="dest"
          :label="$t('api_adapter.api_private.table.key')">
          <template slot-scope="scope">
            <el-input
              :ref="`${tableType}editDest${scope.$index}`"
              class="emotibot"
              v-show="scope.row.editDest"
              v-model="scope.row.dest" 
              :placeholder="$t('api_adapter.api_private.tips.input_key')"
              size="mini"
              @blur="handleBlur(scope, tableType, 'editDest')"
            >
            </el-input>
            <div 
              v-show="!scope.row.editDest"
              class="table-edit-item">
              <span @click="handleEdit(scope, tableType, 'editDest')">
                {{scope.row.dest || $t('adapter.enter_key_msg')}}
                <i class="edit-icon"></i>
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="type"
          :label="$t('api_adapter.api_private.table.operate')"
          width="120">
          <template slot-scope="scope">
            <span @click="deleteMap(scope, tableType)" class="btn-delete">{{$t('api_adapter.btn.delete')}}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: {
    mapList: {
      type: Array,
      default: () => [],
    },
    title: {
      type: String,
      default: '',
    },
    tableType: {
      type: String,
      default: 'request',
    },
  },
  created() {},
  components: {},
  methods: {
    addItem(type) {
      this.$emit('handleAddItem', type);
    },
    objectSpanMethod({ row }) {
      if (row.id && row.id === -1) {
        return [1, 2, 3, 4];
      }
      return true;
    },
    deleteMap(scope, type) {
      this.$emit('handleDeleteMap', scope, type);
    },
    handleEdit(scope, type, key) {
      this.$emit('handleEditMap', scope, type, key);
    },
    handleBlur(scope, type, key) {
      this.$emit('handle2Blur', scope, type, key);
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'styles/variable.scss';

.add-table {
  background:rgba(247,247,247,1);
  padding: 20px;
  box-sizing: border-box;
  border-radius:2px;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
}
.el-table {
  border:1px solid rgba(233,233,233,1);
  border-bottom: none;
  margin-top: 20px;
  &.emotibot {
    /deep/ .el-table__header {
      th {
        padding: 8px 0;
        font-size: 12px;
      }
    }
  }
  &.el-table-input {
    .cell{
      div{
        height: 32px;
        line-height: 32px;
      }
    }
  }
  .table-edit-item {
    cursor: pointer;
    .edit-icon {
      width: 10px;
      height: 10px;
      background: url('../../../assets/icons/edit_blue_icon.svg') no-repeat center;
      background-size: 10px 10px;
      display: none;
      vertical-align: middle;
    }
    &:hover{
      color: #1875F0;
      .edit-icon {
        display: inline-block;
      }
    }
  }
}
.title{
  margin-bottom: 10px;
}
.map-name{
  color: #666666;
  @include font-14px();
}
.btn-delete{
  cursor: pointer;
  color: $color-error;
}
.add-item {
  cursor: pointer;
}
</style>


