<template>
  <div class="app-body">
    <div class="material" v-if="!checkJson">
      <div class="container-left">
        <sidebar-tree
          :treeList="treeList"
          @addNode="handleAddTreeNode"
          @updateNode="handleUpdateTreeNode"
          @deleteNode="handleDeleteTreeNode"
          @selectNode="fetchMaterialList"
          @initSort="initSort"
          :canEdit="canEdit"
          :canDelete="canDelete"
          :defaultSelectFirstLine="defaultSelectFirstLine"
        >
      </sidebar-tree>
      </div>
      <div class="container-right">
        <div class="header-top">
          <div>
            <span class="title">{{ mapList[fileType] }}</span>
            &nbsp;&nbsp;&nbsp;
            <span class="total">
              {{$t('material_library.total_count', {name: total})}}
              </span>
          </div>
          <span v-if="canEdit" class="btn-white-gray btn-normal" @click="handleCheckJson">{{$t('material_library.edit_image_text')}}</span>
        </div>
        <div class="btn-group">
          <!-- 上传图片 -->
          <upload-file v-if="canCreate" class="upload-button" @handleUpload="handleUpload" :fileType="fileType" :btnTxt="btnTxt"></upload-file>
          <el-popover
            v-if="canEdit"
            popper-class="emotibot popover-white-theme"
            placement="top"
            width="270"
            v-model="visible"
            @show="handleShow"
            trigger="click">
            <div class="trigger-content">
              <el-input size="mini"
                class="emotibot tree-popover-input"
                v-model.trim="searchKey" 
                :placeholder="$t('material_library.tips.search_key')"
                suffix-icon="el-icon-search">
              </el-input>
              <el-tree
                ref="searchTree"
                class="material-tree emotibot"
                accordion
                node-key="id"
                :expand-on-click-node="false"
                :indent="18"
                :highlight-current="true"
                id="searchTree"
                :data="searchTreeList"
                :filter-node-method="filterNode"
                @node-click="handleNodeClick">
                  <span class="custom-tree-node" slot-scope="{node, data}">
                    <span :title="data.name">{{ data.name }}</span>
                  </span>
              </el-tree>
              <div class="operater-footer">
                <span class="btn-dark-blue btn-normal" @click="confirmMove">{{ $t('material_library.material_pop.sure_edit') }}</span>
                <span class="btn-white-gray btn-normal" @click="cancelMove">{{ $t('general.cancel') }}</span>
              </div>
            </div>
            <span slot="reference" class="btn-white-gray btn-normal slot-btn">{{ $t('material_library.btn_move') }}</span>
          </el-popover>
          <span v-if="canDelete" class="btn-white-gray btn-normal" @click="handleBatchDelete">{{ $t('general.delete') }}</span>
          <span v-if="canCreate">{{ $t(`material_library.tips.upload_limit_${fileType}`) }}</span>
        </div>
        <div class="material-list">
          <el-table
            :data="materialList"
            height="200"
            ref="multipleTable"
            tooltip-effect="dark"
            @selection-change="handleSelectionChange"
            style="width: 100%">
            <el-table-column
              type="selection"
              width="60">
            </el-table-column>
            <el-table-column
              :label="$t('material_library.file_name')"
              min-width="180">
              <template slot-scope="scope">
                <div class="icon-box">
                  <img v-if="fileType === 'picture'" class="file-type-icon" :src="`/adm${scope.row.thumbnail_link}`" />
                  <page-icon
                    v-if="fileType === 'document' || fileType === 'audio'"
                    :size=26 class="button"
                    :icon-type="fileType === 'document' ? scope.row.fileType : 'audio'">
                  </page-icon>
                  &nbsp;&nbsp;<span class="file-name">{{scope.row.name}}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="file_size_format"
              :label="$t('material_library.file_size')"
              width="120">
            </el-table-column>
            <el-table-column
              prop="upload_date_format"
              min-width="100"
              :label="$t('material_library.upload_date')">
            </el-table-column>
            <el-table-column
              prop="upload_user"
              :label="$t('material_library.upload_account')">
            </el-table-column>
            <el-table-column
              width="180"
              :label="$t('general.operation')">
              <template slot-scope="scope">
                <div class="btn-operate">
                  <!-- <emoti-icon name="icon-preview-page" :size="16" @click="handlePreview(scope.row)" v-if="fileType === 'picture' && canView"></emoti-icon>
                  <emoti-icon name="icon-down-page" :size="16" @click="handleDown(scope.row)" v-if="canView"></emoti-icon>
                  <emoti-icon name="icon-delete-page" :size="16" v-if="canDelete" @click="handleSingleDelete(scope.row.id)"></emoti-icon> -->
                  <span class="icon-preview-page" @click="handlePreview(scope.row)" v-if="fileType === 'picture' && canView"></span>
                  <span class="icon-down-page" @click="handleDown(scope.row)" v-if="canView"></span>
                  <span class="icon-delete-page" v-if="canDelete" @click="handleSingleDelete(scope.row.id)"></span>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            v-show="total > 0"
            background
            :page-sizes="pageLimits"
            :current-page.sync="pageIndex" 
            :page-size="pageSize"  
            @size-change="handlePageSizeChange" 
            @current-change="handlePageChangeList"
            layout="prev, pager, next, sizes"
            :total="total">
          </el-pagination>
        </div>
      </div>
    </div>
    <div class="material material-image-txt" v-else>
      <edit-json @goBack="goBack" :canCreate="canCreate"></edit-json>
    </div>
    <!-- 图片预览 -->
    <file-preview :previewStatus="previewStatus" @closePreview="closePreview" :fileUrl="fileUrl"></file-preview>
    <!-- 删除文档提示框 -->
    <el-dialog
      class="emotibot dialog-wraning"
      :title="$t('general.description')"
      :visible.sync="deleteStatus"
      width="30%"
      :before-close="handleCancel">
      <div class="tips-content">
        <i class="el-icon-warning"></i>
        <div>
          <p>{{$t('material_library.tips_del_confirm')}}</p>
          <span>{{$t('material_library.tips_del')}}</span>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <span class="btn-white-gray btn-normal" @click="handleCancel">{{$t('general.cancel')}}</span>
        <span class="btn-dark-blue btn-normal" @click="handleConfirm">{{$t('general.ok')}}</span>
      </span>
    </el-dialog>
    <!-- 图片大小限制弹窗 -->
    <el-dialog
      class="emotibot dialog-wraning"
      :title="$t('general.description')"
      :visible.sync="fileSizeStatus"
      width="30%">
      <div class="tips-content">
        <i class="el-icon-warning"></i>
        <div>
          <p>{{$t('material_library.select_limit')}}</p>
          <span>{{$t('material_library.select_size_limit')}}</span>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <span class="btn-dark-blue btn-normal" @click="handleFileSizeConfirm">{{$t('general.ok')}}</span>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import moment from 'moment';
import SidebarTree from '@/components/SidebarTree';
import misc from '@/utils/js/misc';
import PageIcon from '@/components/basic/Icon';
import api from './_api/material';
import EditJson from './_components/EditJson';
import FilePreview from './_components/FilePreview';
import UploadFile from './_components/UploadFile';

export default {
  privCode: 'material_library',
  api: [api],
  components: {
    EditJson,
    FilePreview,
    UploadFile,
    SidebarTree,
    PageIcon,
  },
  computed: {
    ...mapGetters([
      'userInfo',
    ]),
    canView() {
      return this.$hasRight('view');
    },
    canEdit() {
      return this.$hasRight('edit');
    },
    canDelete() {
      return this.$hasRight('delete');
    },
    canCreate() {
      return this.$hasRight('create');
    },
  },
  data() {
    return {
      value1: '',
      checkAll: false,
      isIndeterminate: false,
      materialList: [],
      checkedMaterial: [],
      pageLimits: [20, 50, 100],
      pageIndex: 1,
      pageSize: 20,
      total: 0,
      deleteStatus: false,
      searchKey: '',
      visible: false,
      searchTreeList: [],
      checkJson: false,
      previewStatus: false,
      fileUrl: '',
      fileSizeStatus: false,
      currentNode: {}, // 侧边栏树节点的当前选中节点
      catalogToId: '',
      deleteId: '',
      batchStatus: false,
      fileType: 'picture',
      sort: 'upload_date',
      ascList: {
        file_size: true,
        upload_date: false,
        upload_user: true,
        name: true,
      },
      asc: false,
      countByte: 1024,
      treeList: [],
      btnTxt: this.$t('material_library.upload_picture'),
      mapList: {
        picture: this.$t('material_library.tree.picture'),
        document: this.$t('material_library.tree.document'),
        audio: this.$t('material_library.tree.audio'),
        video: this.$t('material_library.tree.video'),
      },
      defaultSelectFirstLine: true,
    };
  },
  watch: {
    visible() {
      if (!this.visible) {
        this.searchKey = '';
      }
    },
    searchKey(val) {
      this.$refs.searchTree.filter(val);
    },
    fileType() {
      this.btnTxt = this.$t(`material_library.upload_${this.fileType}`);
    },
  },
  created() {
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.indexOf('win') > -1) {
      this.countByte = 1024;
    } else {
      this.countByte = 1000;
    }
    this.fetchTreeList();
  },
  methods: {
    // 树状列表
    fetchTreeList() {
      this.$api.fetchTree()
        .then((res) => {
          const list = res.result.filter(item => item.type !== 'video');
          this.treeList = JSON.parse(JSON.stringify(list));
        })
        .catch(() => {
          this.$message.error(this.$t('material_library.tips.library_fetch_error'));
        });
    },
    handleSelectionChange(val) {
      this.checkedMaterial = val.map(item => item.id);
    },
    handleAddTreeNode(newChildNode, fnCallBack) {
      this.$api.addNode(newChildNode)
        .then((res) => {
          let resMessage = '';
          if (res.status !== 0) {
            this.$message.warning(res.message);
          } else {
            resMessage = 'success';
          }
          fnCallBack(resMessage, res.status === 0 ? res.result : '');
        })
        .catch(() => {
          fnCallBack('error');
        });
    },
    handleUpdateTreeNode(params, fnCallBack) {
      this.$api.updateNode(params)
      .then((res) => {
        if (res.result.success) {
          fnCallBack('success');
        } else {
          fnCallBack('fail');
          this.$message.warning(res.message);
        }
      })
      .catch(() => {
        fnCallBack('error');
      });
    },
    handleDeleteTreeNode(params, fnCallBack) {
      this.$api.deleteNode(params)
        .then((res) => {
          if (res.result.success) {
            fnCallBack('success');
          }
        })
        .catch(() => {
          fnCallBack('error');
        });
    },
    caculateType(name) {
      let fileType = '';
      if (name.indexOf('.doc') !== -1 || name.indexOf('.docx') !== -1) {
        fileType = 'doc';
      } else if (name.indexOf('.pdf') !== -1) {
        fileType = 'pdf';
      } else if (name.indexOf('.ppt') !== -1 || name.indexOf('.pptx') !== -1) {
        fileType = 'ppt';
      } else if (name.indexOf('.xls') !== -1 || name.indexOf('.xlsx') !== -1) {
        fileType = 'exl';
      } else {
        fileType = 'doc';
      }
      return fileType;
    },
    updateTreeList(data) {
      const temp = data.filter(item => item.type === this.fileType);
      this.searchTreeList = JSON.parse(JSON.stringify(temp));
    },
    fetchMaterialList(data = this.currentNode, list = this.searchTreeList) {
      this.initChecbox();
      this.currentNode = data;
      this.fileType = data.type;
      const temp = list.filter(item => item.type === this.fileType);
      this.searchTreeList = JSON.parse(JSON.stringify(temp));
      const params = {
        catalog_id: data.id,
        page: this.pageIndex,
        page_size: this.pageSize,
        sort_method: this.sort,
        asc: this.asc,
      };
      this.$api.quertMaterialList(params)
        .then((res) => {
          res.result.data.forEach((item) => {
            item.upload_date_format = moment(item.upload_date).format('YYYY/MM/DD HH:mm');
            if (item.file_size / this.countByte < 500) {
              item.file_size_format = `${Math.round((item.file_size / this.countByte) * 10) / 10} KB`;
            } else {
              item.file_size_format =
              `${Math.round((item.file_size / this.countByte / this.countByte) * 10) / 10} M`;
            }
            item.fileType = this.caculateType(item.name);
          });
          this.$set(this, 'materialList', res.result.data);
          this.total = res.result.total_size;
        })
        .catch(() => {});
    },
    // 上传文件
    handleUpload(file) {
      this.$api.uploadFile(file, this.userInfo.user_name, this.currentNode.id)
        .then((res) => {
          this.initSort();
          if (res.result && res.result.success) {
            this.fetchMaterialList(this.currentNode);
            this.$message.success(this.$t('material_library.tips.upload_success'));
          } else {
            this.$message.error(res.message);
          }
        })
        .catch(() => {});
    },
    handleCheckAll(val) {
      this.checkedMaterial = val ? this.materialList.map(item => item.id) : [];
      this.isIndeterminate = false;
    },
    handleSort(item) {
      this.sort = item;
      this.asc = !this.ascList[item];
      this.ascList[item] = !this.ascList[item];
      this.fetchMaterialList(this.currentNode);
    },
    initSort() {
      this.pageIndex = 1;
      this.pageSize = 20;
      this.asc = false;
      this.sort = 'upload_date';
      this.ascList = {
        file_size: true,
        upload_date: false,
        upload_user: true,
        name: true,
      };
    },
    handleCheckedMaterial(value) {
      const checkedCount = value.length;
      this.checkAll = checkedCount === this.materialList.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.materialList.length;
    },
    handlePageChangeList(pageIndex) {
      this.pageIndex = pageIndex;
      this.fetchMaterialList(this.currentNode);
    },
    handlePageSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.fetchMaterialList(this.currentNode);
    },
    initChecbox() {
      this.checkedMaterial = [];
      this.checkAll = false;
      this.isIndeterminate = false;
    },
    // 单条删除
    handleSingleDelete(id) {
      this.deleteId = id;
      this.deleteStatus = true;
      this.fetchMaterialList(this.currentNode);
    },
    // 批量删除
    handleBatchDelete() {
      if (this.checkedMaterial.length === 0) {
        this.$message.warning(this.$t('material_library.tips.select_data'));
        return;
      }
      this.batchStatus = true;
      this.deleteId = this.checkedMaterial.reduce((sum, item) => `${sum},${item}`);
      this.deleteStatus = true;
    },
    deleteMaterial(data) {
      this.$api.deleteMaterial(data)
        .then((res) => {
          if (res.result.success) {
            this.deleteStatus = false;
            this.$message.success(this.$t('material_library.tips.delete_success'));
            if (this.batchStatus &&
            this.checkedMaterial.length === this.materialList.length &&
            this.pageIndex !== 1) {
              this.pageIndex -= 1;
            }
            this.fetchMaterialList(this.currentNode);
            this.initChecbox();
          }
        })
        .catch(() => {});
    },
    handleConfirm() {
      const params = {
        id: this.deleteId,
      };
      this.deleteMaterial(params);
    },
    handleDown(item) {
      this.$api.previewImage(item.preview_link)
        .then((res) => {
          const fileName = decodeURIComponent(res.headers.filename);
          const blob = new Blob([res.data], { type: 'applicatoin/vnd.ms-excel' });
          misc.downloadRawFile(blob, fileName);
        })
        .catch(() => {});
    },
    handleCancel() {
      this.deleteStatus = false;
    },
    handleNodeClick(data) {
      this.catalogToId = data.id;
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    cancelMove() {
      this.visible = false;
      this.$refs.searchTree.setCurrentNode([]);
    },
    confirmMove() {
      if (this.catalogToId === '') {
        this.$message.warning(this.$t('material_library.tips.move_empty_tips'));
        return;
      }
      this.deleteId = this.checkedMaterial.reduce((sum, item) => `${sum},${item}`);
      const params = {
        catalog_id: this.catalogToId,
        id: this.deleteId,
      };
      this.$api.removeMaterial(params)
        .then((res) => {
          this.visible = false;
          this.fetchMaterialList(this.currentNode);
          this.initChecbox();
          this.catalogToId = '';
          if (res.result.length === 0) {
            if (this.checkedMaterial.length === this.materialList.length && this.pageIndex !== 1) {
              this.pageIndex -= 1;
            }
            this.$message.success(this.$t('material_library.tips.remove_success'));
          } else {
            const errorArr = res.result.reduce((sum, item) => `${sum},${item}`);
            this.$message.error(`${this.$t('material_library.tips.remove_error')}${errorArr}`);
          }
        })
        .catch(() => {});
    },
    handleCheckJson() {
      this.checkJson = true;
    },
    goBack() {
      this.checkJson = false;
    },
    handlePreview(item) {
      this.previewStatus = true;
      this.$api.previewImage(item.preview_link)
        .then((res) => {
          this.fileUrl = window.URL.createObjectURL(res.data);
        })
        .catch(() => {});
    },
    handleFileSizeConfirm() {
      this.fileSizeStatus = false;
    },
    closePreview() {
      this.fileUrl = '';
      this.previewStatus = false;
    },
    handleShow() {
      if (this.checkedMaterial.length === 0) {
        this.$message.warning(this.$t('material_library.tips.move_data_empty_tips'));
        this.visible = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
  @import 'styles/variable.scss';
  #app-page{
    .app-body{
      padding: 10px;
    }
  }
  /deep/ .el-checkbox__label{
    display: none;
  }
  .icon-box {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .material{
    .btn-operate {
      display: flex;
      flex-direction: row;
      align-items: center;
      span {
        width: 18px;
        height: 18px;
        margin-right: 10px;
        cursor: pointer;
      }
    }
    .icon-preview-page {
      background: url('../../assets/icons/com-icon-preview.svg') no-repeat center;
      &:hover {
        background: url('../../assets/icons/com-icon-preview-hover.svg') no-repeat center;
      }
    }
    .icon-down-page {
      background: url('../../assets/icons/com-icon-down.svg') no-repeat center;
      &:hover {
        background: url('../../assets/icons/com-icon-down-hover.svg') no-repeat center;
      }
    }
    .icon-delete-page {
      background: url('../../assets/icons/com-icon-delete.svg') no-repeat center;
      &:hover {
        background: url('../../assets/icons/com-icon-delete-hover.svg') no-repeat center;
      }
    }
    &.material-image-txt{
      background: #ffffff;
      padding: 20px;
      box-sizing: border-box;
      -moz-box-sizing: border-box;
      -webkit-box-sizing: border-box;
      width: 100%;
    }
    display: flex;
    flex-direction: row;
    height: 100%;
    font-family:PingFangSC-Regular;
    .container-left{
      width: 200px;
      margin-right: 10px;
      background: #ffffff;
      box-shadow:0px 0px 5px 0px rgba(102,102,102,0.08);
      border-radius:4px;
      height: 100%;
      padding-bottom: 20px;
      box-sizing: border-box;
      -moz-box-sizing: border-box;
      -webkit-box-sizing: border-box;
    }
    .container-right{
      flex: 1;
      background: #ffffff;
      box-shadow:0px 0px 5px 0px rgba(102,102,102,0.08);
      border-radius:4px;
      height: 100%;
      box-sizing: border-box;
      -moz-box-sizing: border-box;
      -webkit-box-sizing: border-box;
      display: flex;
      flex-direction: column;
      .data-empty{
        width: 100%;
        text-align: center;
        font-size: 14px;
        color: #666666;
        margin-top: 150px;
      }
    }
  }
  .header-top{
    padding: 20px;
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    display: flex;
    flex-direction: row;
    height: 70px;
    align-items: center;
    justify-content: space-between;
    .title{
      font-size:18px;
      color: #333333;
    }
    .total{
      font-size: 12px;
      color: #999999;
      line-height: 24px;
    }
  }
  .btn-group{
    padding: 0 20px;
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    display: flex;
    flex-direction: row;
    align-items: center;
    span{
      margin-right: 10px;
    }
  }
  .material-list{
    flex: 1;
    width: 100%;
    margin-top: 10px;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    .file-name {
      max-width: 240px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .file-type-icon {
      vertical-align: -3px;
    }
  }
  .tips-content{
    display: flex;
    flex-direction: row;
    i{
      font-size: 30px;
      color: #F25C62;
      margin-right: 20px;
    }
    div{
      flex: 1;
      p{
        font-size: 16px;
        margin-bottom: 6px;
        color: #3A4049;
      }
      span{
        color: #6F7378;
        line-height: 20px;
        font-size: 14px;
        display: inline-block;
        &:last-child{
          margin-top: 10px;
        }
      }
    }
  }
  .page-control{
    text-align: right;
    box-shadow:0px -1px 0px 0px rgba(233,233,233,1);
    padding-top: 15px;
  }
  // common button
  .el-checkbox{
    margin-right: 15px;
  }
  .dialog-wraning {
    .el-dialog{
      border-radius: 4px;
    }
    .el-dialog__footer{
      span{
        display: inline-block;
        &:last-child{
          margin-left: 20px;
        }
      }
    }
    /deep/ .el-dialog__header{
      box-shadow: none;
    }
    /deep/ .el-dialog__footer{
       box-shadow: none;
    }
    /deep/ .el-dialog__body{
      padding: 10px 30px;
    }
  }
  .upload-button{
    margin-right: 10px;
  }
  // 深蓝色底 白色字体
  .btn-dark-blue{
    border-radius: 2px;
    border: 1px solid #4B4B64;
    font-weight: 400;
    background: #4B4B64;
    color: #FFFFFF;
    padding: 0 21px;
    cursor: pointer;
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    &:hover {
        background: #5D5D74;
    }
  }
  // 白色底 灰色边框 灰色字体
  .btn-white-gray{
    border-radius:2px;
    border: 1px solid #dbdbdb;
    font-weight:400;
    background: #FFFFFF;
    color: #666666;
    cursor: pointer;
    &:hover {
        background: #E9E9E9;
    }
  }
  .btn-big{
    font-size: 14px;
    height: 46px;
    line-height: 46px;
    padding: 0px 32px;
    text-align: center;
  }
  .btn-medium{
    font-size: 12px;
    height: 40px;
    padding: 0px 20px;
    min-width: 80px;
    line-height: 40px;
    text-align: center;
  }
  .btn-normal{
    display: inline-block;
    font-size: 12px;
    height: 28px;
    padding: 0px 20px;
    min-width: 80px;
    text-align: center;
    line-height: 28px;
  }
  .slot-btn{
    margin-right: 0!important;
  }
  .tree-popover-input{
    margin-bottom: 10px;
    /deep/ input{
      width: 250px;
      background:rgba(247,247,247,.5);
      border-radius:14px;
      color: #3A4049;
      border: 1px solid rgba(247,247,247,.5);
      &:focus{
        border: 1px solid #3A4049;
      }
      &:hover{
        border: 1px solid #3A4049;
      }
    }
  }
  .material-tree{
    flex: 1;
    overflow-y: auto;
    /deep/ .el-tree-node__content{
      box-shadow:inset 0px -1px 0px 0px rgba(233,233,233,1);
    }
  }
  .operater-footer{
    display: flex;
    flex-direction: row-reverse;
    padding: 18px 0 8px;
    span{
      margin-left: 20px;
    }
  }
  .trigger-content{
    display: flex;
    flex-direction: column;
    max-height: 320px;
  }
</style>
