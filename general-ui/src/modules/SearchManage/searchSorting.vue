<template>
  <div class="content card h-fill w-fill" style="padding-bottom: 10px;padding-top: 10px;">
    <div class="datasort-page-content">
       <div class="page-header">
        <div class="title">
          <div class="title-text">
            搜索项排序
          </div>
        </div>
        <div class="search-line">
          <div style="display: flex; flex-direction: row; ">
            <el-button style="margin-right: 10px" @click="addNewData">新建</el-button >
            <el-button  style="margin-right: 10px" @click="bulkDelete">删除</el-button >
          </div>

          <div>
            <!-- <el-input
              size="mini"
              placeholder="请输入内容"
              v-model="searchValue"  @keyup.enter.native="searchkeyword" @blur="blurChange">
              <i slot="prefix" class="el-input__icon el-icon-search"></i>
            </el-input> -->
          </div>
        </div>
      </div>

       <div class="data-content">
        <div style="flex:1;overflow-y: auto;">
          <el-table
            ref="multipleTable"
            :data="tableData"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChange">
            <el-table-column
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column
              prop="fieldName"
              label="字段名"
              >
            </el-table-column>
            <el-table-column
              prop="fieldId"
              label="字段ID"
              >
            </el-table-column>
            <el-table-column
              prop="fieldWeight"
              label="权重"
              sortable
             >
            </el-table-column>
            <el-table-column
              prop="updateTimeMate"
              label="更新日期"
              sortable
             >
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <span
                  style="color: #1875f0; margin-right: 10px;"
                  @click="handleEdit(scope.$index, scope.row)">编辑</span>
                <span
                  style="color: #1875f0; margin-right: 10px;"
                  @click="handleDelete(scope.$index, scope.row)">删除</span>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <div style="display: flex; justify-content: flex-end;padding: 10px 0;">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage4"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalData">
          </el-pagination>
        </div>
      </div>
    </div>

    <el-dialog
      title="新建"
      :visible.sync="dialogVisible"
      width="40%"
      >
      <el-form  :rules="rules"  ref="addNewCls" :model="addNewClsForm" label-width="100px" >
         <el-form-item label="字段名" prop="fieldName">
          <el-input v-model="addNewClsForm.fieldName" placeholder="输入字段名" size="small" style="width: 75%"></el-input>
        </el-form-item>
         <el-form-item label="权重值" prop="fieldWeight">
          <el-input v-model="addNewClsForm.fieldWeight" placeholder="输入权重值" size="small" style="width: 75%"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="canclePop">取 消</el-button>
        <el-button type="primary" @click="confirmAdd">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from './searchApi';

export default {
  privCode: 'optimised_search',
  api,
  data() {
    return {
      pagesize: 10,
      currentPage4: 1,
      totalData: 100,
      searchValue: '',
      tableData: [],
      multipleSelection: [],
      dialogVisible: false,
      addNewClsForm: {
        fieldName: '',
        fieldWeight: '',
      },
      rules: {
        fieldName: [
          { required: true, message: '请输入字段名', trigger: 'change' },
        ],
        fieldWeight: [
          { required: true, message: '请输入权重值', trigger: 'change' },
        ],
      },
    };
  },
  methods: {
    bulkDelete() {
      const idList = [];
      this.multipleSelection.forEach((el) => {
        idList.push(el.id);
      });
      this.$api.SearchDataBulkDelete(idList).then((res) => {
        if (res.status === 200) {
          this.$message({
            type: 'success',
            message: '删除成功!',
          });
        } else {
          this.$message({
            type: 'error',
            message: '删除失败!',
          });
        }
        this.getAllTableData();
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      console.log(val);
    },
    searchkeyword() {
      console.log(this.searchValue);
      this.$api.filterSearch(this.currentPage4 - 1, this.pagesize, this.searchValue).then((res) => {
        this.currentPage4 = res.pageNumber + 1;
        this.totalData = res.totalElements;
        this.tableData = res.content;
        this.tableData.forEach((el) => {
          const d = el.createTime;
          el.createTimeMate = this.formatDate(new Date(d * 1000));
        });
      });
    },
    blurChange() {
      if (this.searchValue === '') {
        console.log('alldata');
        this.getAllTableData();
      }
    },
    handleEdit(index, row) {
      console.log(index, row);
      this.addFlag = false;
      this.dialogVisible = true;
      this.addNewClsForm.id = row.id;
      this.addNewClsForm.fieldName = row.fieldName;
      this.addNewClsForm.fieldWeight = row.fieldWeight;
    },
   // 删除
    handleDelete(index, row) {
      const id = row.id;
      this.$confirm('此操作将删除该条数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.$api.deleteSearchOneData(id).then((res) => {
          if (res.status === 200) {
            this.$message({
              type: 'success',
              message: '删除成功!',
            });
          } else {
            this.$message({
              type: 'error',
              message: '删除失败!',
            });
          }
          this.getAllTableData();
        });
      });
    },
    // 取消
    canclePop() {
      this.dialogVisible = false;
      this.$refs.addNewCls.resetFields();
      console.log(this.addNewClsForm);
    },
    // 新增按钮
    addNewData() {
      this.dialogVisible = true;
      this.addFlag = true;
    },
    // 弹窗确认键
    confirmAdd() {
      this.$refs.addNewCls.validate((valid) => {
        if (valid) {
          this.dialogVisible = false;
          if (this.addFlag) {
            this.addClass();
          } else {
            this.editclass();
          }
        } else {
          return false;
        }
        return valid;
      });
      this.$refs.addNewCls.resetFields();
    },
    // 编辑接口
    editclass() {
      const addItem = {};
      addItem.id = this.addNewClsForm.id;
      addItem.fieldName = this.addNewClsForm.fieldName;
      addItem.fieldWeight = this.addNewClsForm.fieldWeight;
      this.$api.editSearchSortItem(addItem, addItem.id).then((res) => {
        this.$refs.addNewCls.resetFields();
        if (res.status === 200) {
          this.$message({
            type: 'success',
            message: '操作成功!',
          });
          this.getAllTableData();
        } else {
          this.$message({
            type: 'error',
            message: '操作失败!',
          });
        }
      });
    },
    // 新增接口
    addClass() {
      const addItem = {};
      if (!this.addFlag) {
        addItem.id = this.addNewClsForm.id;
      }
      addItem.fieldName = this.addNewClsForm.fieldName;
      addItem.fieldWeight = this.addNewClsForm.fieldWeight;
      // 添加接口
      this.$api.addSearchSortItem(addItem).then((res) => {
        if (res.status === 200) {
          this.$message({
            type: 'success',
            message: '操作成功!',
          });
          this.getAllTableData();
        } else {
          this.$message({
            type: 'error',
            message: '操作失败!',
          });
        }
      });
    },
    handleSizeChange(val) {
      this.pagesize = val;
      this.getAllTableData();
    },
    handleCurrentChange(val) {
      this.currentPage4 = val;
      this.getAllTableData();
    },
    formatDate(now) {
      const year = now.getFullYear();
      const month = now.getMonth() + 1;
      const date = now.getDate();
      const hour = now.getHours();
      const minute = now.getMinutes();
      const second = now.getSeconds();
      return `${year}-${month}-${date} ${hour}:${minute}:${second}`;
    },
    getAllTableData() {
      this.$api.getSearchSortingList(this.currentPage4 - 1, this.pagesize).then((res) => {
        this.currentPage4 = res.pageNumber + 1;
        this.totalData = res.totalElements;
        this.tableData = res.content;
        this.tableData.forEach((el) => {
          const d = el.updateTime;
          el.updateTimeMate = this.formatDate(new Date(d * 1000));
        });
      });
    },
  },
  created() {
    this.getAllTableData();
  },
};
</script>

<style lang="scss" scoped>
/deep/.el-dialog__wrapper{
  /deep/.el-dialog{
    /deep/.el-dialog__body{
      /deep/ .el-form {
       /deep/ .el-form-item {
          /deep/.el-form-item__content {
           /deep/ .el-input__inner{
              width: 310px!important;
            }
          }
        }
      }
    }
  }
}
.datasort-page-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #fff;
  box-sizing: border-box;
  .page-header {
    flex: 0 0 60px;
    padding: 0 20px;
    @include font-16px();
    color: $color-font-active;
    .title {
        display: flex;
        flex-direction: row;
        align-items: center;
        margin: 10px 0;
        .title-text {
          height:28px;
          font-size:16px;
          font-family:PingFangSC-Regular,PingFang SC;
          font-weight:400;
          color:rgba(51,51,51,1);
          line-height:28px;
        }
    }
    .icon {
      margin-left: 6px;
    }
  }
  .search-line{
    flex: 0 0 38px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 10px;
    border-bottom: 1px solid #f7f7f7;
  }
  .data-content{
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow: auto;
  }
}

</style>