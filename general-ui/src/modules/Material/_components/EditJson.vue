<template>
<div class="em-multi-editor">
  <div class="top-header">
    <p>{{$t('material_library.image_tool')}}</p>
    <div>
      <span><i class="el-icon-warning"></i>&nbsp;{{$t('material_library.tips.leave_page')}}</span>
      <text-button @click="handleGoBack">{{$t('general.go_back')}}</text-button>
    </div>
  </div>
  <section class="add-type-wrapper">
    <text-button @click="handleAddItem(item.type)" v-for="(item, idx) in btnGroup" :key="idx">+{{$t(`material_library.${item.txt}`)}}</text-button>
    <span class="tips">{{ $t('material_library.edit_tips') }}</span>
    <text-button @click="bringJson" :button-type="multiData.length === 0 ? 'disable' : 'primary'">{{ $t(`material_library.btn_check_json`) }}</text-button>
  </section>
  <section class="multi-wrapper">
    <template v-for="(item, i) in multiData">
      <div class="content-box text-box" v-if="item.subType === 'text'" :key="i">
        <el-input
          type="textarea"
          class="emotibot"
          :rows="2"
          autosize
          :placeholder="$t('material_library.tips.input_answer')"
          v-model.trim="item.value">
        </el-input>
        <page-icon :size=14 class="button" icon-type="material_del" @click="handleDelMaterial(i)" style="margin-left: 20px;"></page-icon>
      </div>
      <div class="content-box img-box" v-if="item.subType === 'image'" :key="i">
        <div class="img-box-inner">
          <img :src="item.value" />
        </div>
        <page-icon :size=14 class="button" icon-type="material_del" @click="handleDelMaterial(i)" style="margin-left: 20px;"></page-icon>
      </div>
      <div class="content-box doc-box" v-if="item.subType === 'docs'" :key="i">
        <page-icon :size=26 class="button" :icon-type="caculateType(item.data[0].name)"></page-icon>
        <span>{{ item.data[0].name }}</span>
        <page-icon :size=14 class="button" icon-type="material_del" @click="handleDelMaterial(i)" style="margin-left: 20px;"></page-icon>
      </div>
      <div class="content-box doc-box" v-if="item.subType === 'voice'" :key="i">
        <page-icon 
          :size=26 
          class="button"
          icon-type="audio">
        </page-icon>
        <span>{{ item.data[0].name }}</span>
        <page-icon 
          :size=14 
          class="button" 
          icon-type="material_del"
          @click="handleDelMaterial(i)">
        </page-icon>
      </div>
    </template>
    <template>
      <div class="date-empty" v-show="multiData.length === 0">{{$t('material_library.tips.data_empty')}}</div>
    </template>
  </section>
  <el-dialog
    class="emotibot dialog-wraning"
    title="JSON"
    :visible.sync="showJson"
    width="550px"
    :before-close="handleClose">
    <div class="json-text">
      {{jsonText}}
    </div>
    <span slot="footer" class="dialog-footer">
      <text-button button-type="primary" class="copyButton" :data-clipboard-text="jsonText" @click="initClipboard">{{$t('material_library.btn_copy')}}</text-button>
    </span>
  </el-dialog>
  <!-- 上传弹窗 -->
  <el-dialog
    class="emotibot"
    custom-class="dialog-upload"
    width="920px"
    :title="$t(`material_library.material_pop.pop_titles.${type}`)"
    :visible.sync="visible"
    :close-on-click-modal = "false"
    :lock-scroll="false"
    :show-close = "false">
    <div class="material-wrapper">
      <!-- 公共树组件 -->
      <section class="sidebar-tree">
        <el-tree
        class="emotibot"
        accordion
        ref="selectTree"
        node-key="id"
        :expand-on-click-node="false"
        :indent="7"
        id="treeList"
        :data="treeList"
        @node-click="handleNodeClick">
          <span class="custom-tree-node" slot-scope="{node, data}">
            <span :title="data.name">{{ data.name }}</span>
          </span>
        </el-tree>
      </section>
      <!-- 右侧列表 -->
      <section class="main-content">
        <div class="upload-box">
          <upload-file v-if="canCreate" @handleUpload="handleUpload" :fileType="fileType" :btnTxt="$t('material_library.btn_local_upload')" :primary="false"></upload-file>
          <span>{{ $t(`material_library.tips.upload_limit_${fileType}`) }}</span>
        </div>
        <!-- 图片dome 结构 -->
        <img-manage 
          ref="imgManage"
          v-show="fileType === 'picture'" 
          :fileType="fileType" 
          :imageData="imageData" 
          :total="total"
          :len="multiData.length"
          @handleChangePageIndex="handleChangePageIndex"
          @handleChoose="handleChoose">
        </img-manage>
        <!-- 文档 -->
        <doc-manage 
          ref="docManage"
          v-show="fileType === 'document' || fileType === 'audio'" 
          :materialList="imageData" 
          :fileType="fileType" 
          :total="total"
          :len="multiData.length"
          @handleChangePageIndex="handleChangePageIndex"
          @handleChoose="handleChoose">
        </doc-manage>
      </section>
    </div>
    <div slot="footer" class="dialog-footer">
      <text-button slot="reference" @click="handleCancelSelect">{{ $t('general.cancel') }}</text-button>
      <text-button class="primary" slot="reference" @click="confirmChoose">{{ $t('material_library.material_pop.sure_select') }}</text-button>
    </div>
  </el-dialog>
</div>
</template>

<script>
import { mapGetters } from 'vuex';
import moment from 'moment';
import Clipboard from 'clipboard';
import PageIcon from '@/components/basic/Icon';
import TextButton from '@/components/basic/TextButton';
import UploadFile from '../_components/UploadFile';
import DocManage from './DocManage';
import ImgManage from './ImgManage';
import api from '../_api/material';

export default {
  name: 'em-multi-editor',
  api: [api],
  data: () => ({
    type: 'image',
    visible: false,
    multiData: [],
    showJson: false,
    jsonText: '',
    clipboard: '',
    fileType: 'text',
    treeList: [],
    imageData: [],
    listBackUp: [],
    currentNode: '',
    pageIndex: 1,
    pageSize: 8,
    materialList: [],
    total: 0,
    chooseSrc: [],
    countByte: '',
    btnGroup: [
      { type: 'text', txt: 'btn_text' },
      { type: 'image', txt: 'btn_image' },
      { type: 'docs', txt: 'btn_doc' },
      { type: 'audio', txt: 'btn_audio' },
    ],
  }),
  components: {
    PageIcon,
    TextButton,
    UploadFile,
    DocManage,
    ImgManage,
  },
  props: {
    max: {
      type: Number,
      default: 5,
    },
    canCreate: {
      type: Boolean,
      default: false,
    },
  },
  created() {
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.indexOf('win') > -1) {
      this.countByte = 1024;
    } else {
      this.countByte = 1000;
    }
  },
  watch: {},
  computed: {
    ...mapGetters([
      'userInfo',
    ]),
    tips() {
      const tips = this.$t('answer_editor.tips');
      return tips.replace('%NUM', this.max);
    },
  },
  methods: {
    handleClose() {
      this.showJson = false;
    },
    handleReset() {
      this.visible = true;
      this.pageIndex = 1;
      this.pageSize = 8;
      this.fetchTree();
    },
    handleAddItem(type) {
      if (this.multiData.length >= 5) {
        this.$message.warning(this.$t('material_library.tips.max_res_item'));
        return;
      }
      this.type = type;
      if (type === 'text') {
        this.multiData.push({
          type: 'text',
          subType: 'text',
          value: '',
          data: [],
        });
      } else {
        if (type === 'image') {
          this.fileType = 'picture';
        } else if (type === 'docs') {
          this.fileType = 'document';
        } else if (type === 'audio') {
          this.fileType = 'audio';
        }
        this.handleReset();
      }
    },
    handleDelMaterial(index) {
      this.multiData.splice(index, 1);
    },
    handleGoBack() {
      this.$emit('goBack');
    },
    initClipboard() {
      this.clipboard.on('success', (e) => {
        this.$message.success(this.$t('material_library.tips.copy_success'));
        e.clearSelection();
        this.clipboard.destroy();
        this.showJson = false;
      });
    },
    handleCancelSelect() {
      this.visible = false;
      this.chooseSrc = [];
      this.initModelStatus();
    },
    initModelStatus() {
      if (this.fileType === 'picture') {
        this.$refs.imgManage.initStatus();
      } else if (this.fileType === 'document' || this.fileType === 'audio') {
        this.$refs.docManage.initStatus();
      }
    },
    handleNodeClick(data) {
      this.currentNode = data;
      this.fetchImageList(data, this.pageIndex, this.pageSize);
      this.$refs.imgManage.initStatus();
      this.$refs.docManage.initStatus();
    },
    handleUpload(file) {
      this.$api.uploadFile(file, this.userInfo.user_name, this.currentNode.id)
        .then((res) => {
          this.initModelStatus();
          if (res.result && res.result.success) {
            this.fetchImageList(this.currentNode);
            this.$message.success(this.$t('material_library.tips.upload_success'));
          } else {
            this.$message.error(res.message);
          }
        })
        .catch(() => {});
    },
    fetchTree() {
      this.$api.fetchTree()
        .then((res) => {
          this.listBackUp = res.result;
          this.treeList = this.listBackUp.filter(item => item.type === this.fileType);
          this.currentNode = this.treeList[0];
          this.fetchImageList(this.treeList[0], this.pageIndex, this.pageSize);
          setTimeout(() => {
            this.$refs.selectTree.setCurrentNode(this.treeList[0]);
          }, 50);
        })
        .catch(() => {
          this.$message.error(this.$t('material_library.tips.library_fetch_error'));
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
    fetchImageList(data, pageIndex = 1, pageSize = 8) {
      const params = {
        catalog_id: data.id,
        page: pageIndex,
        page_size: pageSize,
      };
      this.$api.quertMaterialList(params)
        .then((res) => {
          this.total = res.result.total_size;
          res.result.data.forEach((item) => {
            item.icon = `/adm${item.download_link}`;
            item.upload_date_format = moment(item.upload_date).format('YYYY/MM/DD HH:mm');
            if (item.file_size / this.countByte < 500) {
              item.file_size_format = `${Math.round((item.file_size / this.countByte) * 10) / 10} KB`;
            } else {
              item.file_size_format =
              `${Math.round((item.file_size / this.countByte / this.countByte) * 10) / 10} M`;
            }
            item.fileType = this.caculateType(item.name);
          });
          this.$set(this, 'imageData', res.result.data);
        })
        .catch(() => {});
    },
    handleChangePageIndex(pageIndex, pageSize) {
      this.pageIndex = pageIndex;
      this.pageSize = pageSize;
      this.fetchImageList(this.currentNode, pageIndex, pageSize);
    },
    handleChoose(src) {
      this.chooseSrc = src;
    },
    confirmChoose() {
      this.initModelStatus();
      if (this.chooseSrc.length === 0) {
        this.visible = false;
        return;
      }
      this.visible = false;
      if (this.fileType === 'picture') {
        this.chooseSrc.forEach((item) => {
          this.multiData.push({
            type: 'url',
            subType: 'image',
            value: item,
            data: [],
          });
        });
      } else if (this.fileType === 'document' || this.fileType === 'audio') {
        this.chooseSrc.forEach((item) => {
          this.imageData.forEach((val) => {
            if (val.name === item) {
              this.multiData.push({
                type: 'url',
                subType: this.fileType === 'document' ? 'docs' : 'voice',
                value: `/adm${val.download_link}`,
                data: [{ name: item }],
              });
            }
          });
        });
      }
      this.chooseSrc = [];
    },
    bringJson() {
      if (this.multiData.length === 0) {
        this.$message.warning(this.$t('material_library.tips.check_tips'));
        return;
      }
      if (this.multiData.length > 5) {
        this.$message.warning(this.$t('material_library.tips.max_res_item'));
        return;
      }
      const vals = this.multiData.filter(item => item.value === '');
      if (vals.length > 0) {
        this.$message.warning(this.$t('material_library.tips.check_empty_item'));
        return;
      }
      this.jsonText = JSON.stringify(this.multiData);
      this.clipboard = new Clipboard('.copyButton');
      this.showJson = true;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../../assets/styles/variable.scss";
.top-header{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  .text-button{
    display: inline-block;
    margin-left: 20px;
  }
  p{
    font-size: 18px;
    color: #333333;
  }
  i{
    &.el-icon-warning{
      color: #F68C6D;
    }
  }
}
.em-multi-editor{
  width: 100%;
  display: flex;
  flex-direction: column;
  .add-type-wrapper{
    display: flex;
    align-items: center;
    padding-bottom: 10px;
    .text-button{
      margin-right: 20px;
      min-width: 90px;
      &:last-child{
        margin-right: 0;
      }
    }
    .tips{
      @include font-14px();
      flex: 1;
      color: $color-font-mark;
    }
  }
  .multi-wrapper{
    .date-empty{
      text-align: center;
      margin-top: 200px;
    }
    flex: 1;
    overflow-y: auto;
    .content-box {
      margin-bottom: 10px;
      padding: 10px;
      border-radius: 2px;
      background: #F7F7F7;
    }
    .text-box{
      display: flex;
    }
    .img-box{
      display: inline-flex;
      margin: 0 10px 10px 0;
      .img-box-inner{
        display: flex;
        overflow: hidden;
        width: 130px;
        height: 80px;
        position: relative;
        align-items: center;
        justify-content: center;
        img {
          position: absolute;
          max-width: 130px;
          overflow: hidden;
          height: auto;
          width: auto;
        }
      }
    }
    .doc-box{
      display: flex;
      align-items: center;
      padding: 7px 10px;
      width: 375px;
      span{
        margin-left: 10px;
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
  ::v-deep .el-dialog__body{
    padding: 0;
  }
  .json-text{
    word-break:break-all;
    line-height:24px;
    font-size:14px;
    padding: 0 20px;
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
  }
}
.material-wrapper{
  display: flex;
  flex: 1;
  padding: 0;
  max-height: 450px;
  .sidebar-tree{
    height: 450px;
    overflow-y: auto;
    box-shadow: 1px 0 0 0 #e9e9e9;
    flex-shrink: 0;
    width: 200px;
    border-top: 1px solid#e9e9e9;
    border-bottom: 1px solid#e9e9e9;
    ::v-deep .el-tree-node{
      &.is-current{
        background-color: #f5f7fa;
      }
    }
  }
  .upload-box{
    padding: 20px;
    font-size: 12px;
    .tips{
      @include font-12px();
    }
  }
  .main-content{
    flex: 1;
  }
}
</style>
