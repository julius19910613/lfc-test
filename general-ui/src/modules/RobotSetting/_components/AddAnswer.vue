<template>
  <div id="add-answer">
    <div class="title">
      <h3>{{$t('pages.robot_setting.edit_answer')}}</h3>
    </div>
    <div class="content">
      <div class="con-tit">
        <p class="con-tit-text">{{value.main_question}}</p>
      </div>
      <div class="ans-item">
        <em-answer-editor
          ref="emAnswerEditor"
          :editorTabs="editorTabs"
          :materialList="fileData"
          :treeList="treeList"
          :total="total"
          :active="activeTab"
          :curData="curData"
          @handleGetAnswer="handleGetAnswer"
          :dimensionList="dimensionList">
        </em-answer-editor>
      </div>
    </div>
  </div>

</template>

<script>
	import api from './../_api/robotV3';

export default {
  name: 'AddAnswer',
  props: {
    value: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    const { content, answers, id } = this.value;
    return {
      editorTabs: [{
        id: 0,
        type: 'text',
      }],
      treeList: [],
      fileData: [],
      activeTab: 'text',
      materialList: [],
      total: 0,
      dimensionList: [],
      active: 'text',
      curData: content,
      answers: answers.filter(v => v.id !== id),
    };
  },
  api,
  // components: {},
  created() {
    this.getRobotDimension();
  },
  mounted() {
    this.$on('validate', this.validate);
  },
  watch: {
  },
  methods: {
    getRobotDimension() {
      this.$api.getRobotDimension()
        .then((d) => {
          if (d.status === 0) {
            this.dimensionList = d.result;
          } else {
            this.$message.error(d.message);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    handleGetAnswer() {
      return this.$refs.emAnswerEditor.handleGetAnswer();
    },
    parseContent(info) {
      let answer;
      let property;
      try {
        const content = JSON.parse(info);
        answer = content.answer;
        property = content.property;
      } catch (err) {
        console.log(err);
      }
      return ({
        answer,
        property,
      });
    },
    validate() {
      const info = this.handleGetAnswer();
      const { answer } = this.parseContent(info);
      if (answer.trim() === '') {
        this.$message.error(this.$t('pages.robot_setting.err_empty_robot'));
        return;
      }
      if (answer.trim().length > 255) {
        this.$message.error(this.$t('robot_setting.answer_maximum'));
        return;
      }
      if (this.answers.findIndex(v => v.content === info) !== -1) {
        this.$message.error(this.$t('answer_editor.duplicate_answer_err'));
        return;
      }
      this.$emit('validateSuccess', info);
    },
  },
};
</script>

<style lang="scss" scoped>
  #add-answer {
    width: 650px;
    // height: 344px;
    
    .title {
      display: flex;
      height: 58px;
      border-bottom: 1px #E9E9E9 solid;
      padding: 20px;
      
      h3 {
        height: 18px;
        line-height: 18px;
        color: #333333;
        font-size: 16px;
        margin-right: 10px;
      }
      
      p {
        height: 18px;
        color: #666666;
        line-height: 18px;
        font-size: 14px;
        
      }
    }
    .content {
      padding: 20px;
      border-bottom: 1px #E9E9E9 solid;
      
      .con-tit {
        padding-bottom: 20px;
        // margin: 0 20px 20px;
        line-height: 20px;
        border-bottom: 1px #E9E9E9 solid;
        font-size: 14px;
        font-weight: 500;

        .con-tit-text {
          max-height: 54px;
          @include customScrollbar();
          @include auto-overflow-Y();
        }
      }
    }
    /deep/ .el-tabs__header{
      display: none;
    }
    /deep/ .ans-title{
      min-width: 56px;
      text-align: right;
      margin-right: 20px;
    }
    /deep/ .el-tabs__content{
      width: 100%;
      padding: 0;
      border: none;
      padding-right: 10px;
      max-height: 300px;
      @include customScrollbar();
      @include auto-overflow-Y();
    }
    /deep/ .multi-selector {
      padding-right: 10px;
    }
  }
  
</style>
