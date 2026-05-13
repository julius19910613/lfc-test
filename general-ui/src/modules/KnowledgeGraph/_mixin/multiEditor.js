import moment from 'moment';
import apiMultiEditor from '../_api/multiEditor';

export default {
  data() {
    return {
      fileData: [], // 某种素材（图片，文档，音频）的素材库列表
      treeList: [], // 某种素材（图片，文档，音频）的树形分类
      total: 0, // 某种素材（图片，文档，音频）的素材库列表数据总数
      curData: '', // 编辑时当前答案文本
      activeTab: 'text', // 目前支持 'text', 'richText', 'multiEditor' ：纯文本，富文本，图文消息
      editorTabs: [{
        id: 0,
        type: 'text',
      }, {
        id: 1,
        type: 'multiEditor',
      }, {
        id: 2,
        type: 'richText',
      }], // 可选择答案编辑器内容部分 显示的tab 个数，默认是三个tab： 'text', 'richText', 'multiEditor'
      listBackUp: [],
      fileType: '',
      currentNode: '',
    };
  },
  methods: {
    fetchMaterialList(data, pageIndex = 1, pageSize = 8) {
      const params = {
        catalog_id: data.id,
        page: pageIndex,
        page_size: pageSize,
      };
      console.log('fetchMaterialList', params);
      apiMultiEditor.queryMaterialList.bind(this)(params)
      .then((res) => {
        this.total = res.result.total_size;
        res.result.data.forEach((item) => {
          item.src = `/adm${item.download_link}`;
          item.upload_date_format = moment(item.upload_date).format('YYYY/MM/DD HH:mm');
          if (item.file_size / this.countByte < 500) {
            item.file_size_format = `${Math.round((item.file_size / this.countByte) * 10) / 10} KB`;
          } else {
            item.file_size_format =
          `${Math.round((item.file_size / this.countByte / this.countByte) * 10) / 10} M`;
          }
        });
        this.fileData = res.result.data;
      })
      .catch(err => console.log('queryMaterialList', err));
    },
    fetchTree() {
      console.log('fetchTree:apiMultiEditor:::', apiMultiEditor);
      apiMultiEditor.fetchTree.call(this)
      .then((res) => {
        this.listBackUp = res.result;
        this.treeList = this.listBackUp.filter(item => item.type === this.fileType);
        this.currentNode = this.treeList[0];
        this.fetchMaterialList(this.treeList[0]);
      })
      .catch(() => {
        this.$message.error(this.$t('material_library.tips.library_fetch_error'));
      });
    },
    handleAddMaterial(btn) {
      console.log('apiMultiEditor:::', apiMultiEditor, this, this.apiMultiEditor);
      if (btn === 'text') {
        return;
      }
      if (btn === 'image') {
        this.fileType = 'picture';
      } else if (btn === 'doc') {
        this.fileType = 'document';
      } else if (btn === 'audio') {
        this.fileType = 'audio';
      }
      this.fetchTree();
    },
    handleMaterialChangePage(pageIndex, pageSize) {
      console.log('handleMaterialChangePage', pageIndex, pageSize);
      this.fetchMaterialList(this.currentNode, pageIndex, pageSize);
    },
    handleNodeSelect(node) {
      console.log('handleNodeSelect', node);
      this.currentNode = node;
      this.fetchMaterialList(this.currentNode);
    },
    handleUploadMaterial(file) {
      console.log('handleUploadMaterial', file);
      apiMultiEditor.uploadMaterial.bind(this)(file, JSON.parse(localStorage.getItem('userInfo')).user_name, this.currentNode.id)
      .then((res) => {
        if (res.result && res.result.success) {
          this.fetchMaterialList(this.currentNode);
          this.$message.success(this.$t('tips.upload_success'));
        } else {
          this.$message.error(res.message);
        }
      })
      .catch(err => console.log('handleUploadMaterial', err));
    },
    // 文本类属性值的类型：# subCategory - 201: 纯文本 # subCategory - 202: 富文本# subCategory - 203: 素材库
    getSubCategoryByActiveTabType(type) {
      console.log('getSubCategoryByActiveTabType', type);
      // eslint-disable-next-line no-nested-ternary
      return type === 'text' ? '201' : type === 'richText' ? '203' : '202';
    },
    // 文本类属性值的类型：# subCategory - 201: 纯文本 # subCategory - 202: 富文本# subCategory - 203: 素材库
    getActiveTabTypeBySubCategory(subCategory) {
      console.log('getActiveTabTypeBySubCategory', subCategory);
      // eslint-disable-next-line no-nested-ternary
      return `${subCategory}` === '202' ? 'multiEditor' : `${subCategory}` === '203' ? 'richText' : 'text';
    },
  },
};

