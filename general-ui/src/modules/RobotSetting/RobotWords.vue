<template>
  <div class="">
    <div class="card w-fill h-fill">
      <nav-bar :options=pageMap v-model="currentPage"></nav-bar>
      <div class="words-list">
        <h1 class="title">{{pageMap[currentPage] || ''}}</h1>
        <template v-for="words in wordsList">
        <div class="word-wrapper" :key="words.type"
          v-if="words.page === currentPage">
          <div class="title-box">
            <span class="word-title">{{ words.name }}</span>
            <el-popover popper-class="emotibot desc-popover" placement="top-start" width="350" trigger="hover">
              <span style="font-size: 12px;" v-html="words.tooltip.msg"></span>
              <i class="el-icon-info" slot="reference"></i>
            </el-popover>
          </div>
          <div class="content-box">
            <div class="content-wrapper" v-for="content in words.contents" :key="content.id">
              <div class="display-mode" v-if="currentEditWordId !== content.id">
                <div class="text-box" :ref="'textBox'+content.id">
                  <el-popover placement="top-start" width="500" trigger="hover"
                    ref="'refPopover'+content.id" :popper-class="hidePopover"
                    v-model="showDetailPopover[content.id]">
                    <p style="font-size: 12px;max-height:100px;overflow-y:auto;">{{ content.content }}</p>
                    <span slot="reference" :ref="'textSpan'+content.id"
                    @mouseenter="handleHoverSpeech('textBox'+content.id, 'textSpan'+content.id, content.id)"
                    >
                    {{ content.content }}</span>
                  </el-popover>
                </div>
                <i class="edit-icon" v-if="canEdit" @click="handleEditWord(content)"></i>
                <i class="delete-icon" v-if="canEdit && getCanDelete(words)"
                @click="handleDeleteWord(words, content)"></i>
              </div>
              <div class="edit-mode" v-else>
                <el-input class="emotibot" :ref="'editInput'+content.id" v-model="currentEditWordText"
                :maxlength="words.maxLength" :minlength="1"
                @keyup.enter.native="confirmEditWord(words, content)"></el-input>
                <span class="cancel-btn" @click="cancalEditWord(words, content)">{{ $t('general.cancel') }}</span>
                <span class="confirm-btn" @click="confirmEditWord(words, content)">{{ $t('general.ok') }}</span>
              </div>
            </div>
            <div class="content-wrapper" v-if="canEdit && !currentEditWordId && getCanAdd(words)">
              <div class="add-word-btn"
              @click="handleAddWord(words)">{{ $t('robot_setting.words.add_word') }}</div>
            </div>
          </div>
        </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import misc from '@/utils/js/misc';
import NavBar from '@/components/NavigationBar';
import api from './_api/chatskill';

const pageGroup = {
  basic: [1, 2, 3, 4, 5, 6, 12],
  emotion: [9, 10, 11],
  timeout: [7, 8],
  human: [13, 14, 15, 16, 17, 18, 19, 20],
};

const basicWordsMap = {
  1: { sort: 10, maxLength: 1000 },
  3: { sort: 9, maxLength: 1000 },
  5: { sort: 8, maxLength: 500 },
  4: { sort: 7, maxLength: 500 },
  2: { sort: 6, maxLength: 500 },
  12: { sort: 5, maxLength: 1000 },
};

export default {
  path: 'robot-chat-skill',
  privCode: 'robot_chat_skill',
  displayNameKey: 'robot_chat_skill',
  icon: 'white_chat',
  name: 'robot-chat-skill',
  components: {
    NavBar,
  },
  api,
  data() {
    return {
      currentPage: '',
      pageMap: {
        basic: this.$t('chat_skill.group_basic'),
        emotion: this.$t('chat_skill.group_emotion'),
        timeout: this.$t('chat_skill.group_timeout'),
        human: this.$t('chat_skill.group_human'),
      },
      showDetailPopover: {},
      wordsList: [],
      currentEditWordId: '',
      currentEditWordText: '',
      showCurrentPopover: true,
    };
  },
  computed: {
    ...mapGetters([
      'userRole',
    ]),
    popperClass() {
      let className = '';
      if (!this.showCurrentPopover) {
        className = 'hide-popover';
      }
      return className;
    },
    canEdit() {
      return this.$hasRight('edit');
    },
    hidePopover() {
      if (!this.showCurrentPopover) {
        return 'emotibot hide-popover';
      }
      return 'emotibot';
    },
  },
  methods: {
    handleHoverSpeech(refBox, refText) {
      if (this.$refs[refBox] && this.$refs[refBox][0] && this.$refs[refBox][0].clientWidth
      && this.$refs[refText] && this.$refs[refText][0] && this.$refs[refText][0].clientWidth
      && this.$refs[refText][0].clientWidth >= this.$refs[refBox][0].clientWidth) {
        // this.showDetailPopover[id] = true;
        this.showCurrentPopover = true;
      } else {
        this.showCurrentPopover = false;
      }
    },
    getCanDelete(words) {
      if (!words.minCount) {
        return true;
      }
      const existWords = words.contents.filter(word => word.id.toString().indexOf('add-') === -1);
      return words.minCount < existWords.length;
    },
    getCanAdd(words) {
      if (!words.maxCount) {
        return true;
      }
      const existWords = words.contents.filter(word => word.id.toString().indexOf('add-') === -1);
      return words.maxCount > existWords.length;
    },
    handleAddWord(words) {
      const newObj = {
        id: `add-${Math.random()}`,
      };
      words.contents.push(newObj);
      this.handleEditWord(newObj);
    },
    handleEditWord(content) {
      this.currentEditWordId = content.id;
      this.currentEditWordText = content.content;
      this.$nextTick(() => {
        if (this.$refs[`editInput${content.id}`] && this.$refs[`editInput${content.id}`][0]) {
          this.$refs[`editInput${content.id}`][0].focus();
        }
      });
    },
    confirmEditWord(words, content) {
      this.currentEditWordText = this.currentEditWordText.trim();
      if (!this.currentEditWordText || !this.currentEditWordText.length) {
        return;
      }
      if (content.id.toString().indexOf('add-') !== -1) {
        // 新增
        this.addWordsContent(words, this.currentEditWordText);
      } else if (this.currentEditWordText !== content.content) {
        // 编辑
        this.updateWordsContent(words, content.id, this.currentEditWordText);
      }
      this.clearEditWord();
    },
    cancalEditWord(words, content) {
      if (content.id.toString().indexOf('add-') !== -1) {
        words.contents.splice(words.contents.indexOf(content), 1);
      }
      this.clearEditWord();
    },
    clearEditWord() {
      this.currentEditWordId = '';
      this.currentEditWordText = '';
    },
    handleDeleteWord(words, contentObj) {
      this.$confirm(this.$t('chat_skill.delete_check_msg') + contentObj.content, '', {
        // dangerouslyUseHTMLString: true,
        confirmButtonText: this.$t('general.ok'),
        cancelButtonText: this.$t('general.cancel'),
        type: 'warning',
        showClose: false,
      }).then(() => {
        this.deleteWordsContent(words, contentObj.id);
      }).catch(() => {
        this.$message({ type: 'info', message: this.$t('general.already_cancel') });
      });
    },
    addWordsContent(words, content) {
      this.$api.addRobotChatContentV2(words.type, content).then(() => {
        this.$message({ message: this.$t('robot_setting.words.add_success'), type: 'success' });
      }).catch(() => {
        this.$message({ message: this.$t('robot_setting.words.add_fail'), type: 'error' });
      }).finally(() => {
        this.loadRobotWords();
      });
    },
    updateWordsContent(words, contentID, content) {
      this.$api.updateRobotChatContentV2(words.type, contentID, content).then(() => {
        this.$message({ message: this.$t('robot_setting.words.update_success'), type: 'success' });
      }).catch(() => {
        this.$message({ message: this.$t('robot_setting.words.update_fail'), type: 'error' });
      }).finally(() => {
        this.loadRobotWords();
      });
    },
    deleteWordsContent(words, contentID) {
      this.$api.deleteRobotChatContentV2(words.type, contentID).then(() => {
        this.$message({ message: this.$t('robot_setting.words.delete_success'), type: 'success' });
      }).catch(() => {
        this.$message({ message: this.$t('robot_setting.words.delete_fail'), type: 'error' });
      }).finally(() => {
        this.loadRobotWords();
      });
    },
    loadRobotWords(showLoading) {
      const that = this;
      if (showLoading) {
        that.$startPageLoading();
      }
      that.$api.getRobotChatListV2()
      .then((data) => {
        that.wordsList = data;
        that.wordsList.forEach((words) => {
          Object.keys(pageGroup).forEach((page) => {
            if (pageGroup[page].indexOf(words.type) >= 0) {
              words.page = page;
              // 基础话术设置最大值和最小值
              if (page === 'basic') {
                words.maxCount = 5;
                words.minCount = 1;
                if (basicWordsMap[words.type]) {
                  words.maxLength = basicWordsMap[words.type].maxLength;
                }
              }
            }
          });
          words.tooltip = {
            msg: words.comment,
          };
        });
        that.wordsList.sort((w1, w2) => {
          if (basicWordsMap[w1.type] && basicWordsMap[w2.type]
          && basicWordsMap[w1.type].sort < basicWordsMap[w2.type].sort) {
            return 1;
          }
          return -1;
        });
      })
      .finally(() => {
        that.$emit('endLoading');
      });
    },
    setupPage() {
      const target = misc.getParameterByName('page');
      if (target in pageGroup) {
        this.currentPage = target;
      } else {
        this.currentPage = 'basic';
      }
    },
  },
  beforeMount() {
    this.setupPage();
  },
  mounted() {
    this.loadRobotWords(true);
  },
};
</script>

<style lang="scss" scoped>
@import 'styles/variable.scss';
.words-list {
  display: flex;
  flex-direction: column;
  @include auto-overflow();
  @include customScrollbar();
  max-height: calc(100% - 60px);
  padding: 28px 20px;
  .title{
    color: #333333;
    font-size: 18px;
    line-height: 24px;
    padding-bottom: 8px;
  }
  .word-wrapper{
    margin-top: 1px;
    padding: 20px 0px;
    box-shadow: 0px 1px 0px 0px rgba(233,233,233,1);
    .title-box{
      .word-title{
        font-size: 16px;
        line-height: 20px;
        color: #666666;
      }
      .el-icon-info{
        font-size: 18px;
        margin-left: 10px;
        cursor: pointer;
        color: #BABABA;
        &:hover{
          color: #1875F0;
        }
      }
    }
    &:hover{
      background-color: #FCFCFC;
      .add-word-btn{
        display: block !important;
      }
    } 
    .content-box{
      .content-wrapper{
        float: left;
        width: calc(50% - 20px);
        &:nth-child(2n+2){
          margin-left: 10px;
        }
        .display-mode{
          width: 100%;
          height: 40px;
          background-color: #E9E9E9;
          border-radius: 2px;
          padding: 0px 15px 0px 10px;
          display: flex;
          align-items: center;
          margin-top: 10px;
          >span{
            overflow: hidden;
          }
          .text-box{
            flex: 1;
            overflow: hidden;
            span{
              max-width: 100%;
              display: inline-block;
              white-space: nowrap; 
              overflow: hidden;
              text-overflow: ellipsis;
              color: #000000;
              font-size: 14px;
              height: 40px;
              line-height: 40px;
            }
          }
          .edit-icon{
            display: none !important;
            cursor: pointer;
            margin-left: 5px;
            @include icon('../../assets/icons/edit_pen_icon2.svg', 14px, 12px);
          }
          .delete-icon{
            display: none !important;
            cursor: pointer;
            margin-left: 8px;
            @include icon('../../assets/icons/delete_icon2.svg', 14px, 12px);
          }
          &:hover{
            .edit-icon, .delete-icon{
              display: inline-block !important;
            }
          }
        }
        .edit-mode{
          position: relative;
          margin-top: 10px;
          ::v-deep .el-input{
            width: 100%;
            input{
              width: 100%;
              padding: 0px 110px 0px 10px !important;
            }
          }
          .confirm-btn, .cancel-btn {
            position: absolute;
            top: 13px;
            right: 20px;
            color: #666666;
            cursor: pointer;
            margin-left: 20px;
            font-size: 14px;
          }
          .cancel-btn{
            right: 65px;
          }
        }
        .add-word-btn{
          height: 40px;
          display: none;
          border: 1px dashed #BABABA;
          background-color: #F7F7F7;
          color: #666666;
          font-size: 14px;
          border-radius: 2px;
          margin-top: 10px;
          padding: 12px 10px;
          cursor: pointer;
          &:hover{
            border-color: #3389EE;
            color: #3389EE;
          }
        }
      }
    }
  }
}
</style>
