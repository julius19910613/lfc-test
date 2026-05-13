<template>
  <div class="edit-dimension">
    <div class="edit-btn-box">
      <text-button class="primary" slot="reference" @click="addDimension">{{$t('robot_config.dimension.add_dimension')}}</text-button>
      <span><i class="el-icon-warning"></i>&nbsp;&nbsp;{{$t('robot_config.dimension.delete_tips')}}</span>
    </div>
    <el-table
      class="emotibot el-table-edit"
      :data="localDimensionList"
      height="400"
      style="width: 100%">
      <el-table-column
        :label="$t('robot_config.dimension.dimension_type')"
        width="172">
        <template slot-scope="scope">
          <el-input class="emotibot" maxlength="100" size="mini" v-model.tirm="scope.row.name" :placeholder="$t('robot_config.dimension.input_dimension')"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('robot_config.dimension.dimension_value')">
        <template slot-scope="scope">
          <div class="table-edit-input">
            <template v-for="(tag, num) in scope.row.list">
              <div class="dimension-item" v-show="!tag.isDelete">
                <div v-if="!tag.edit && tag.name.length >= 13" class="dimension-item-inner">
                  <el-popover
                    placement="top-start"
                    width="200"
                    trigger="hover">
                    <span>{{tag.name}}</span>
                    <div slot="reference">
                      <span class="tag-name">{{tag.name}}</span>
                      <span class="com-icon page-icon-edit" @click="editDimensionValue(scope.$index, num)"></span>
                      <span class="com-icon page-icon-delete" @click="deleteDimensionValue(scope.row, num)"></span>
                    </div>
                  </el-popover>
                </div>
                <div v-if="!tag.edit && tag.name.length < 13" class="dimension-item-inner">
                  <span class="tag-name">{{tag.name}}</span>
                  <span class="com-icon page-icon-edit" @click="editDimensionValue(scope.$index, num)"></span>
                  <span class="com-icon page-icon-delete" @click="deleteDimensionValue(scope.row, num)"></span>
                </div>
                <div v-show="tag.edit" class="edit-box">
                  <input maxlength="100" :ref="`edit${scope.$index}${num}`" class="no-border edit-tag-input" v-model.trim="tag.name" @keyup.enter="saveEditDimensionValue(scope.row, scope.$index, num)"/>
                  <span @click="saveEditDimensionValue(scope.row, scope.$index, num)">确定</span>
                </div>
              </div>
            </template>
            <input
              class="no-border"
              maxlength="100" 
              :placeholder="$t('robot_config.dimension.input_enter_add')"
              @keyup.enter="saveAddDimensionValue(scope.row)"
              v-model.trim="scope.row.newTag"
            />
          </div>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('robot_config.dimension.operate')"
        width="100">
        <template slot-scope="scope">
          <span class="btn-delete" @click="deleteDimension(scope)">{{ $t('general.delete') }}</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="operate-group">
      <text-button slot="reference" @click="cancelEdit">{{ $t('general.cancel') }}</text-button>
      <el-popover
        popper-class="emotibot popover-white-theme"
        placement="top"
        width="160"
        v-model="confirmDelete">
        <p>{{$t('robot_config.dimension.delete_tips')}}</p>
        <div style="text-align: right; margin: 0">
          <el-button size="mini" type="text" @click="confirmDelete = false">{{ $t('general.cancel') }}</el-button>
          <el-button type="primary" size="mini" @click="saveEdit">{{ $t('general.ok') }}</el-button>
        </div>
        <span slot="reference" class="btn-dark-blue btn-small btn-save">{{$t('robot_config.dimension.confirm_edit')}}</span>
      </el-popover>
      <!-- <span class="btn-dark-blue btn-small btn-save" @click="saveEdit">确定修改</span> -->
    </div>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex';
import TextButton from '@/components/basic/TextButton';
import configAPI from '../_api/config';

export default {
  name: 'edit-dimension',
  api: [configAPI],
  data() {
    return {
      newTag: '',
      deleteDimensionList: [],
      isAdding: false,
      confirmDelete: false,
      editStatus: false,
      localDimensionList: [],
    };
  },
  components: {
    TextButton,
  },
  computed: {
    ...mapGetters([
      'robotID',
      'dimensionList',
    ]),
  },
  watch: {
    dimensionList: {
      handler() {
        this.resetDimensionList();
      },
      deep: true,
    },
  },
  created() {
    this.resetDimensionList();
  },
  methods: {
    ...mapMutations([
      'setDimensionList',
    ]),
    resetStatus() {
      this.newTag = '';
      this.deleteDimensionList = [];
      this.fetchDimensionList();
    },
    resetDimensionList() {
      this.localDimensionList = JSON.parse(JSON.stringify(this.dimensionList));
      this.localDimensionList.forEach((item) => { item.newTag = ''; });
    },
    fetchDimensionList() {
      this.$api.fetchDimensionList(this.robotID).then((res) => {
        if (res.status === 0 && res.result instanceof Array) {
          this.setDimensionList(res.result);
        } else {
          this.$message.warning(res.message);
        }
      });
    },
    ifDuplicate(tag, editStatus) {
      const tags = [];
      this.localDimensionList.forEach(item => tags.push(...item.list));
      let duplicate;
      if (editStatus) {
        if (tags.filter(item => item.name === tag).length > 1) {
          duplicate = true;
        } else {
          duplicate = false;
        }
      } else {
        duplicate = tags.some(item => item.name === tag);
      }
      return duplicate;
    },
    saveAddDimensionValue(scope) {
      if (scope.newTag === '') {
        this.$message.warning(this.$t('robot_config.dimension.dimension_value_empty'));
        return;
      }
      if (this.ifDuplicate(scope.newTag)) {
        this.$message.warning(this.$t('robot_config.dimension.dimension_value_duplicate'));
        return;
      }
      scope.list.push({ name: scope.newTag, edit: false });
      scope.newTag = '';
    },
    saveEditDimensionValue(scope, index, num) {
      if (scope.list[num].name.length === 0) {
        this.$message.warning(this.$t('robot_config.dimension.dimension_value_empty'));
        return;
      }
      if (this.ifDuplicate(scope.list[num].name, true)) {
        this.$message.warning(this.$t('robot_config.dimension.dimension_value_duplicate'));
        return;
      }
      this.$set(this.localDimensionList[index].list[num], 'edit', false);
      this.editStatus = false;
    },
    editDimensionValue(index, num) {
      this.$set(this.localDimensionList[index].list[num], 'edit', true);
      this.editStatus = true;
      const ref = `edit${index}${num}`;
      this.$nextTick(() => {
        this.$refs[ref][0].focus();
      });
    },
    deleteDimensionValue(scope, num) {
      if (scope.list[num].isDelete !== undefined) {
        scope.list[num].isDelete = true;
      } else {
        scope.list.splice(num, 1);
      }
    },
    deleteDimension(scope) {
      debugger;
      this.$set(this.localDimensionList[scope.$index], 'isDelete', true);
      const item = this.localDimensionList[scope.$index];
      this.deleteDimensionList.push(item);
      this.localDimensionList.splice(scope.$index, 1);
    },
    addDimension() {
      this.localDimensionList.unshift({ name: '', list: [] });
    },
    cancelEdit() {
      this.confirmDelete = false;
      this.editStatus = false;
      this.resetStatus();
      this.$emit('handleCloseModel', 'CANCEL');
    },
    saveEdit() {
      if (this.editStatus) {
        this.$message.warning(this.$t('robot_config.dimension.save_dimension_value_edit'));
        return;
      }
      this.confirmDelete = false;
      if (this.localDimensionList.some(item => (item.newTag !== '' && item.newTag !== undefined))) {
        this.$message.warning(this.$t('robot_config.dimension.enter_save_edit'));
        return;
      }
      if (this.localDimensionList.some(item => item.name === '')) {
        this.$message.warning(this.$t('robot_config.dimension.dimension_type_empty'));
        return;
      }
      const params = [...this.localDimensionList, ...this.deleteDimensionList];
      const nameArray = [];
      params.forEach((item) => {
        if (!item.isDelete) {
          nameArray.push(item.name);
        }
      });
      const temp = Array.from(new Set(nameArray));
      if (temp.length !== nameArray.length) {
        this.$message.warning(this.$t('robot_config.dimension.dimension_type_duplicate'));
        return;
      }
      if (params.length === 0) {
        this.$message.warning(this.$t('robot_config.dimension.save_tips'));
        return;
      }
      if (this.isAdding) {
        return;
      }
      this.isAdding = true;
      this.$api.saveDimensionEdit(params)
        .then((res) => {
          if (res.status === 0) {
            this.$message.success(this.$t('robot_config.dimension.save_success'));
            this.$emit('handleCloseModel', 'SUCCESS');
            this.resetStatus();
          } else {
            this.$message.error(res.message);
          }
        });
      setTimeout(() => {
        this.isAdding = false;
      }, 2000);
    },
  },
};
</script>
<style scoped lang="scss">
  .edit-btn-box {
    padding: 0 20px 10px;
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    span{
      float: right;
      line-height: 28px;
    }
  }
  .btn-delete {
    cursor: pointer;
    color: red;
    @include font-14px;
  }
  .emotibot {
    &.el-table-edit{
      /deep/ tr {
        th:first-child {
          .cell{
            padding: 8px 2px 8px 20px;
          }
        }
      }
      .el-input__inner {
        padding: 0 8px;
      }
    }
  }
  .dimension-item-inner {
    display: flex;
    flex-direction: row;
    align-items: center;
    .el-popover__reference {
      display: flex;
      flex-direction: row;
      align-items: center;
    }
    .com-icon { 
      width: 12px;
      height: 12px;
      margin-left: 6px;
      cursor: pointer;
      &.page-icon-edit {
        background: url('../../../assets/icons/icon_edit.png');
        background-size: cover;
      }
      &.page-icon-delete {
        background: url('../../../assets/icons/icon_delete.png');
        background-size: cover;
      }
    }
  }
  .table-edit-input {
    border-radius:2px;
    border:1px solid rgba(219,219,219,1);
    display: flex;
    flex-direction: row;
    padding: 0 4px 4px;
    flex-wrap: wrap;
    .dimension-item {
      height:24px;
      background:rgba(217,219,228,1);
      border-radius:3px;
      padding: 0 6px;
      line-height: 24px;
      margin-right: 4px;
      margin-top: 4px;
      .tag-name {
        max-width: 150px;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
      }
    }
  }
  .no-border {
    border: none;
    background: transparent;
    font-size: 12px;
    margin-top: 4px;
    &:focus {
      box-shadow: none;
    }
    &::placeholder {
      font-size: 12px;
    }
    &.edit-tag-input {
      height: 24px;
      margin-top: 0;
      width: 150px;
    }
  }
  .edit-box {
    span {
      color: #108ee9;
      cursor: pointer;
    }
  }
  .operate-group {
    text-align: right;
    padding: 20px 20px 0 0;
  }
  .btn-save {
    padding: 5px 10px;
    height: 26px;
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
  }
  .el-popover {
    p {
      font-size: 12px;
    }
  }
</style>