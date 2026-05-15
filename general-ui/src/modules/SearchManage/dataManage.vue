<template>
  <div class="content card h-fill w-fill" style="padding-bottom: 10px;padding-top: 10px;">
    <div class="datasort-page-content">
       <div class="page-header">
        <div class="title">
          <div class="title-text">
            数据管理
          </div>
        </div>
        <div class="search-line">
          <div class="right-wrap">

              <div class="header-search">
              <span style="margin-right: 4px;">类别</span>
              <el-select v-model="category" placeholder="请选择" size="mini" style="margin-right: 10px;">
                <el-option
                  v-for="item in sourceList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
            <div class="header-search">
              <span style="margin-right: 4px;">格式</span>
              <el-select v-model="format" placeholder="请选择" size="mini" style="margin-right: 10px;">
                <el-option
                  v-for="item in formatList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
                <div class="header-search">
              <span style="margin-right: 4px;">标签</span>
              <el-select v-model="tag" placeholder="请选择" size="mini" style="margin-right: 10px;">
                <el-option
                  v-for="item in tagList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
             <div class="header-search">
              <span style="margin-right: 4px;">展示顺序</span>
              <el-select v-model="sortType" placeholder="请选择" size="mini" style="margin-right: 10px;">
                <el-option
                  v-for="item in sortTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>

            <div class="header-search">
              <span style="margin-right: 4px;">关键词</span>
               <el-input v-model="keyword" placeholder="请输入内容" size="mini" style="display: inline;margin-right:10px;"></el-input>
            </div>
            <div class="header-search">
              <span style="margin-right: 4px;">数据Id</span>
              <el-input v-model="itemId" placeholder="请输入内容" size="mini" style="display: inline;"></el-input>
            </div>

          </div>


          <div class="btn-groups" style="display: flex;">
            <div @click="getAllTableData" class="search-btn" style="background: #3D4B63; color: #fff;">
             确定
            </div>
            <div @click="reset" class="search-btn">
              重置
            </div>
            <!-- <div  class="search-btn" style="width: 100px" @click="bulkDelete">
              批量删除
            </div> -->
          </div>
      </div>
      </div> 
      
      <!-- <div style="padding:0 0 10px 20px;">
        <el-button>批量删除</el-button>
      </div> -->
       <div class="data-content">
        <div style="flex:1;overflow-y: auto;">
          <el-table
            :data="tableData"
            tooltip-effect="dark"
            style="width: 100%"
            >
            <!-- <el-table-column
              type="selection"
              width="55">
            </el-table-column> -->
            <el-table-column
              label="名称"
              width="200"
              align="center"
              show-overflow-tooltip
              >
              <template slot-scope="scope">
                 <span style="margin-left: 10px" v-html="scope.row.title"></span>
              </template>
            </el-table-column>
            <el-table-column
              prop="category"
              label="类别"
              width="80"
              align="center"
              >
            </el-table-column>
            <el-table-column
              label="摘要"
              align="center"
              show-overflow-tooltip
              >
              <template slot-scope="scope">
                 <span style="margin-left: 10px" v-html="scope.row.summary"></span>
              </template>
            </el-table-column>
            <el-table-column
              prop="clickNum"
              label="点击次数"
              align="center"
              width="100"
             >
            </el-table-column>
            <el-table-column
              prop="format"
              label="格式"
              align="center"
             >
            </el-table-column>
            <el-table-column
              prop="tag"
              label="标签"
              align="center"
             >
            </el-table-column>
            <el-table-column
              prop="updateTimeMate"
              label="更新日期"
              align="center"
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
      <el-form  :rules="rules" size="small" ref="addNewCls" :model="addNewClsForm" label-width="100px" >
         <el-form-item label="名称" prop="fieldName">
          <el-input v-model="addNewClsForm.title" placeholder="输入名称" size="small" style="width: 75%"></el-input>
        </el-form-item>
         <el-form-item label="类别" prop="fieldWeight">
          <el-input v-model="addNewClsForm.category" placeholder="输入类别" size="small" style="width: 75%"></el-input>
        </el-form-item>
        <el-form-item label="格式" prop="fieldWeight">
          <el-input v-model="addNewClsForm.format" placeholder="输入格式" size="small" style="width: 75%"></el-input>
        </el-form-item>
        <el-form-item label="标签" prop="fieldWeight">
          <el-input v-model="addNewClsForm.tag" placeholder="输入标签" size="small" style="width: 75%"></el-input>
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
      sourceList: [
        {
          label: '所有来源',
          value: '',
        },
        {
          label: '电商',
          value: '电商',
        },
        {
          label: '小说',
          value: '小说',
        },
        {
          label: '咨询',
          value: '咨询',
        },
        {
          label: '视频',
          value: '视频',
        },
        {
          label: '金融数据',
          value: '金融数据',
        },
      ],
      formatList: [
        {
          label: '全部格式',
          value: '',
        },
        {
          label: 'pdf',
          value: 'pdf',
        },
        {
          label: '文本',
          value: '文本',
        },
        {
          label: '短视频',
          value: '短视频',
        },
      ],
      tagList: [
        {
          label: '所有标签',
          value: '',
        },
      ],
      sortTypeOptions: [
        {
          label: '相关性',
          value: '相关性',
        },
        {
          label: '更新时间',
          value: '更新时间',
        },
        {
          label: '点击量',
          value: '点击量',
        },
      ],
      pagesize: 10,
      currentPage4: 1,
      totalData: 100,
      searchValue: '',
      tableData: [],
      multipleSelection: [],
      dialogVisible: false,
      addNewClsForm: {
        category: '',
        format: '',
        tag: '',
        title: '',
      },
      rules: {
        category: [
          { required: true, message: '请输入类别', trigger: 'change' },
        ],
        format: [
          { required: true, message: '请输入格式', trigger: 'change' },
        ],
        tag: [
          { required: true, message: '请输入标签', trigger: 'change' },
        ],
        title: [
          { required: true, message: '请输入名称', trigger: 'change' },
        ],
      },
      keyword: '',
      category: '',
      format: '',
      tag: '',
      sortType: '',
      itemId: '',
    };
  },
  methods: {
    reset() {
      this.keyword = '';
      this.category = '';
      this.format = '';
      this.tag = '';
      this.sortType = '';
      this.itemId = '';
    },
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
    handleEdit(index, row) {
      this.dialogVisible = true;
      this.addNewClsForm.itemId = row.itemId;
      this.addNewClsForm.category = row.category;
      this.addNewClsForm.format = row.format;
      this.addNewClsForm.tag = row.tag;
      this.addNewClsForm.title = row.title;
    },
   // 删除
    handleDelete(index, row) {
      const id = row.itemId;
      this.$confirm('此操作将删除该条数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.$api.deleteSearcManageData(id).then((res) => {
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
    // 弹窗确认键
    confirmAdd() {
      this.$refs.addNewCls.validate((valid) => {
        if (valid) {
          this.dialogVisible = false;
          this.editclass();
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
      addItem.itemId = this.addNewClsForm.itemId;
      addItem.category = this.addNewClsForm.category;
      addItem.format = this.addNewClsForm.format;
      addItem.tag = this.addNewClsForm.tag;
      addItem.title = this.addNewClsForm.title;
      this.$api.editSearchManage(addItem).then((res) => {
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
      const params = {
        keyword: this.keyword,
        pageSize: this.pagesize,
        pageNumber: this.currentPage4 - 1,
        category: this.category,
        format: this.format,
        sortType: this.sortType,
        tag: this.tag,
        itemId: this.itemId,
      };
      const tagList = [
        {
          label: '所有标签',
          value: '',
        },
      ];
      this.$api.getAllDataList(params).then((res) => {
        this.currentPage4 = res.data.pageNumber + 1;
        this.totalData = res.data.totalElements;
        this.tableData = res.data.content;
        res.data.tags.forEach((el) => {
          if (el !== '') {
            tagList.push({
              label: el,
              value: el,
            });
          }
        });
        this.tagList = tagList;
        this.tableData.forEach((el) => {
          const d = el.lastUpdateTime;
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
::v-deep.el-dialog__wrapper{
  ::v-deep.el-dialog{
    ::v-deep.el-dialog__body{
      ::v-deep .el-form {
       ::v-deep .el-form-item {
          ::v-deep.el-form-item__content {
           ::v-deep .el-input__inner{
              width: 310px!important;
            }
          }
        }
      }
    }
  }
}
.datasort-page-content {
  .header-search span{
    width:80px;
    display: inline-block;
    text-align: right;
  }
  ::v-deep .header-search input{
    width:174px;
  }
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
  .search-btn{
      height: 28px;
      width: 50px;
      border-radius: 4px;
      text-align: center;
      border: 1px solid #e7e7ee;
      cursor: pointer;
      line-height: 28px;
      padding-left: 4px;
      margin: 0 10px;
      background: white;
    }
  .search-line{
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    height: 107px;
    font-size: 14px;
    line-height: 58px;
    margin-bottom: 10px;
    background: rgba(246, 246,246,1.0);
    border:1px solid rgba(238,238,238,1);
    border-radius: 3px;
    padding: 0 10px;
    .right-wrap{
      width: 100%;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      align-content: flex-start;
      justify-content: flex-start;
      align-items: center;
    }
    }
  // .search-line{
    
  //   display: flex;
  //   flex-direction: row;
  //   align-items: center;
  //   justify-content: space-between;
  //   padding-bottom: 10px;
  //   border-bottom: 1px solid #f7f7f7;
  // }
  .data-content{
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow: auto;
  }
}

</style>