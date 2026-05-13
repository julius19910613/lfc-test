<template>
  <div id='white-list'>
  	<div class="card h-fill w-fill emoti-panel">
  	  <div class="header-wrapper">
	      <div class='title'>白名单管理</div>
	      <div class="operation-left">
	        <emoti-icon v-if='selectUserIds.length > 0' clickable name="icon-delete" popPlacement="bottom" hoverColor="#f25c62" iconClass="icon" :size="18" :popContent="$t('general.delete')" @click='remove()'></emoti-icon>
	      </div>
	      <div class="operation-right">
	    	  <el-input v-model='keyword' type="text" size="mini" maxlength="30" suffix-icon="emoti-icon icon-search" placeholder="请输入关键字回车搜索"></el-input>
	    	  <el-button class='add' size="mini" @click='openAdd = true'>{{$t('general.add')}}</el-button>
	      </div>
	    </div>

	  <div class="content-wrapper">
  		<el-table :data='whiteList' size="mini" height='100%' stripe empty-text='暂无数据' @selection-change="selectRow">
  			<el-table-column type="selection" width="55"></el-table-column>
  			<el-table-column label='用户名' prop='username'></el-table-column>
  			<el-table-column label='违禁词'>
  				<template slot-scope='scope'>
  					<template v-if='scope.row.whiteWords && scope.row.whiteWords.length > 0'>
  						{{scope.row.whiteWords[0]}}等{{scope.row.whiteWords.length}}个词
  					</template>
  				</template>
  			</el-table-column>
  			<el-table-column label='创建日期' prop='createTime'></el-table-column>
  			<el-table-column label='操作'>
  				<template slot-scope='scope'>
  					<emoti-icon clickable name="icon-edit-pen"
  					  popPlacement="bottom" hoverColor="#1875F0" 
  					  iconClass="icon" :size="18" :popContent="$t('general.edit')" @click='edit(scope.row)'></emoti-icon>
            <emoti-icon clickable name="icon-delete"
              popPlacement="bottom" hoverColor="#f25c62"
              iconClass="icon" :size="18" :popContent="$t('general.delete')" @click='remove(scope.row.userId)'></emoti-icon>
  				</template>
  			</el-table-column>
  		</el-table>
	  </div>
  	</div>
  	<add-dialog :visible.sync='openAdd' :title='"新建白名单"' :user-list='userList' :word-list='wordList' @notice='getWhiteList' @close='closeAdd'></add-dialog>
  	<edit-dialog :visible.sync='openEdit' :title='"编辑白名单"' 
  		:current-user-id='currentUserId'
  		:current-white-words='currentWhiteWords'
  		:user-list='userList'
  		:word-list='wordList'
  		@notice='getWhiteList'
  		@close='closeEdit'></edit-dialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import api from './_api/whitelist';
import AddDialog from './_components/AddDialog';
import EditDialog from './_components/EditDialog';

export default {
  privCode: 'white_list',
  api,
  components: {
    AddDialog,
    EditDialog,
  },
  data() {
    return {
      copyWhiteList: [],
      whiteList: [],
      wordList: [],
      userList: [],
      currentUserId: '',
      currentWhiteWords: [],
      selectUserIds: [],
      keyword: '',
      openAdd: false,
      openEdit: false,
    };
  },
  computed: {
    ...mapGetters(['robotID']),
  },
  watch: {
    keyword(val) {
      const list = this.copyWhiteList.filter((v) => {
        const includeA = v.whiteWords.some(vv => vv.indexOf(val) > -1);
        const includeB = v.username.indexOf(val) > -1;
        return includeA || includeB;
      });
      this.whiteList = list;
    },
  },
  methods: {
    getWhiteList() {
      this.$api.ApiGetWhiteList().then((res) => {
        if (res.errorCode === 0) {
          this.whiteList = res.data || [];
          this.copyWhiteList = res.data || [];
        } else {
          this.$message.error(res.errorMessage);
        }
      });
    },
    getUserList() {
      this.$api.ApiGetUserList().then((res) => {
        if (res.errorCode === 0) {
          this.userList = res.data || [];
        } else {
          this.$message.error(res.errorMessage);
        }
      });
    },
    getWordList() {
      this.$api.ApiGetBannedWordList(this.robotID).then((res) => {
        if (res.status === 0) {
          this.wordList = res.result.wordbank.filter(item => item.catalogPath === '敏感词库');
        } else {
          this.$message.error(res.message);
        }
      });
    },
    edit(row) {
      this.currentUserId = row.userId;
      this.currentWhiteWords = row.whiteWords;
      this.openEdit = true;
    },
    selectRow(rows) {
      this.selectUserIds = [];
      rows.forEach((v) => {
        this.selectUserIds.push(v.userId);
      });
    },
    remove(userId) {
      const des = userId ? '确定要删除此白名单吗？' : '确定要删除选中的白名单吗？';
      this.$confirm(des, this.$t('general.description'), {
        confirmButtonText: this.$t('general.ok'),
        cancelButtonText: this.$t('general.cancel'),
        type: 'warning',
      }).then(() => {
        const ids = userId ? [userId] : this.selectUserIds;
        this.$api.ApiRemoveWhite(ids).then((res) => {
          if (res.errorCode === 0) {
            this.getWhiteList();
            this.$message.success(res.errorMessage);
          } else {
            this.$message.error(res.errorMessage);
          }
        });
      }).catch(() => {});
    },
    closeAdd() {
      this.openAdd = false;
    },
    closeEdit() {
      this.openEdit = false;
    },
  },
  created() {
    this.getWhiteList();
    this.getUserList();
    this.getWordList();
  },
};
</script>
<style lang="scss" scoped>
@import 'styles/variable';

#white-list {
  .emoti-panel{
    display: flex;
    flex-direction: column;
    background-color: $color-white;
    border: 1px solid $table-border-color-e9;
    box-shadow: 0 0 5px hsla(0,0%,40%,.08);
    border-radius: 4px;
  }
  .header-wrapper{
    height: 48px;
    min-height: 48px;
    display: flex;
    align-items: center;
    padding: 0px 20px;
    border-bottom: 1px dashed $table-border-color;
    .title{
      font-size:16px;
      color: $color-font-active;
      margin-right: 10px;
    }
    .sub-title{
      font-size: 12px;
      color: $color-font-normal;
      margin-right: 10px;
    }
    .operation-left {
      display: inline-block;
      margin-right: 10px;
    }
    .operation-right{
      flex: 1;
      text-align: right;
      display: inline-block;
      .el-input{
        max-width: 190px;
      }
    }
  }

  .content-wrapper{
    box-sizing: border-box;
    padding: 0px;
    width: 100%;
    overflow: hidden;
    flex: 1;
    display: flex;
    flex-direction: column;
  }
}
</style>
