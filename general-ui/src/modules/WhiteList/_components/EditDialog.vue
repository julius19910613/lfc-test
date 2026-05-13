<template>
<el-dialog id='edit-dialog' :title='title' width="500px" :visible="visible" :append-to-body='true' @close='close'>
    <div class="row">
        <div class="label">用户</div>
        <div class="value">
            <el-select v-model="userId" :placeholder='$t("general.select")' size='mini' disabled>
                <el-option v-for='(v, k) in userList' :key='k' :label='v.username' :value='v.uuid'></el-option>
            </el-select>
        </div>
    </div>

    <div class="row">
        <div class="label">添加违禁词</div>
        <div class="value">
            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckedAll">全选</el-checkbox>
            <el-checkbox-group v-model="whiteWords" @change="handleChecked">
                <el-checkbox v-for="v in wordList" :label="v.name" :key="v.id">{{v.name}}</el-checkbox>
            </el-checkbox-group>
        </div>
    </div>
    <div slot="footer">
        <el-button size='small' @click='close'>{{$t('general.cancel')}}</el-button>
        <el-button type="primary" size='small' :disabled='!userId || whiteWords.length === 0' :loading='btnLoading' @click='submit'>{{$t('general.ok')}}</el-button>
    </div>
</el-dialog>
</template>

<script>
import { mapGetters } from 'vuex';
import api from '../_api/whitelist';

export default {
  api,
  computed: {
    ...mapGetters(['robotID']),
  },
  props: {
    visible: [Boolean],
    title: [String],
    wordList: [Array],
    userList: [Array],
    currentUserId: [String],
    currentWhiteWords: [Array],
  },
  data() {
    return {
      userId: '',
      checkAll: false,
      whiteWords: [],
      isIndeterminate: false,
      btnLoading: false,
    };
  },
  watch: {
    currentUserId(val) {
      this.userId = val;
    },
    currentWhiteWords(val) {
      this.whiteWords = val;
      this.handleChecked(val);
    },
  },
  methods: {
    submit() {
      this.btnLoading = true;
      this.$api.ApiEditWhite({
        userId: this.userId,
        whiteWords: this.whiteWords,
      }).then((res) => {
        this.btnLoading = false;
        if (res.errorCode === 0) {
          this.notice();
          this.close();
          this.$message.success(res.errorMessage);
        } else {
          this.$message.error(res.errorMessage);
        }
      });
    },
    handleCheckedAll(val) {
      this.whiteWords = val ? this.wordList.map(item => item.name) : [];
      this.isIndeterminate = false;
      // test
    },
    handleChecked(value) {
      const checkedCount = value.length;
      this.checkAll = checkedCount === this.wordList.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.wordList.length;
    },
    notice() {
      this.$emit('notice');
    },
    close() {
      this.$emit('close');
    },
  },
};
</script>

<style lang="scss" scoped>
#edit-dialog {
  .row {
    display: flex;
    align-items: baseline;
    .label {
      width: 90px;
      padding-right: 20px;
      text-align: right;
    }
    .value {
        flex: 1;
    }
  }
  .row + .row {
    margin-top: 20px;
  }
}
</style>