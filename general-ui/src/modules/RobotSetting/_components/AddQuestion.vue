<template>
  <div id="add-question">
    <div class="title">
      <h3>{{$t('pages.robot_setting.edit_question')}}</h3>
      <p>{{$t('pages.robot_setting.other_question')}}</p>
    </div>
    <div class="content">
      <p class="con-tit">{{mainQuestion}}</p>
      <div class="add-question">
        <p v-if="click" class="add-btn" @click="editQuestion">+{{$t('pages.robot_setting.add_question')}}</p>
        <div v-else class="edit-box" :class="{ hoverInput: hoverInput }">
          <input
            ref="textInput"
            class="edit-txt"
            v-model.trim="txtInfo"
            type="text"
            @blur="hoverInput=false;"
            @focus="hoverInput=true;"
            @keyup.enter="addQuestion(questionId, txtInfo, true)">
          <span @click="cancel">{{$t('pages.robot_setting.cancel')}}</span>
          <span @click="addQuestion(questionId, txtInfo)">{{$t('pages.robot_setting.add')}}</span>
        </div>
      </div>
      <div class="qu-list">
        <template v-if="questions.length !== 0">
          <div
            class="qu-info"
            v-for="(item,idx) in questions"
            @mouseenter="hoverIndex=idx;"
            @mouseleave="hoverIndex=-1;"
            :key="idx">
            <p class="qu-text">{{item.content}}</p>
            <span v-if="hoverIndex === idx" class="delete" @click="deleteQuestion(questionId, item.id)">×</span>
          </div>
        </template>
        <template v-else>
          <div class="no-other">
            {{$t('pages.robot_setting.no_question')}}
          </div>
        </template>

      </div>

    </div>
  </div>

</template>

<script>
	import api from './../_api/robotV3';

export default {
  name: 'AddQuestion',
  props: {
    value: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    const { id, main_question, relate_questions: questions, questionList } = this.value;
    return {
      questionId: id,
      questions,
      mainQuestion: main_question,
      questionInfo: this.value,
      click: true,
      txtInfo: '',
      hoverInput: false,
      hoverIndex: -1,
      questionList,
    };
  },
  api,
  created() {

  },
  mounted() {
    this.$on('validate', this.validate);
  },
  computed: {
    info() {
      return this.questionInfo.relate_questions.map(item => ({
        id: item.id,
        content: item.content,
      }));
    },
    curQtList() {
      return [this.mainQuestion, ...this.questions.map(v => v.content)];
    },
  },
  watch: {
    deep: true,
  },

  methods: {
    clearInput() {
      this.$refs.textInput.value = '';
    },
    editQuestion() {
      this.click = false;
      this.$nextTick(() => {
        this.$refs.textInput.focus();
      });
    },
    addQuestion(robotQA, content, cli = false) {
      // this.clearInput();
      this.click = false;
      if (!content.replace(/\s+/g, '')) {
        return;
      }
      if (content.length > 50) {
        this.$message.error(this.$t('robot_setting.question_maximum'));
        return;
      }
      if (this.curQtList.indexOf(content) !== -1) {
        this.$message.error(this.$t('answer_editor.add_qt_cur_err'));
        return;
      }
      if (this.questionList.indexOf(content) !== -1) {
        this.$message.error(this.$t('answer_editor.add_question_err'));
        return;
      }
      this.$api.addRobotQARelateQuestion(robotQA, content)
        .then((data) => {
          this.questions.push(data);
          this.cancel(cli);
        })
        .catch((err) => {
          console.log(err);
          const res = err.response;
          const defaultMsg = this.$t('answer_editor.add_question_err');
          if (res) {
            this.$message.error(res.data.message || res.data.result || defaultMsg);
          } else {
            this.$message.error(defaultMsg);
          }
        })
        .finally(() => {
        });
    },
    cancel(cli) {
      this.clearInput();
      this.click = !cli;
      this.txtInfo = '';
    },
    deleteQuestion(robotQA, question) {
      this.$api.deleteRobotQAQuestion(robotQA, question)
      .then(() => {
        const idx = this.questions.findIndex(v => v.id === question);
        if (idx !== -1) {
          this.questions.splice(idx, 1);
        }
      })
      .catch((err) => {
        console.log(err);
      });
    },
    validate() {
      this.$emit('validateSuccess');
    },
  },
};
</script>

<style lang="scss" scoped>
  #add-question {
    display: flex;
    flex-flow: column;
    overflow-y: hidden;
    input:focus{
      outline: none;
    }
    width: 490px;
    height: 390px;
    
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
      flex: 1;
      padding: 20px;
      display: flex;
      flex-flow: column;
      overflow-y: hidden;
      border-bottom: 1px #E9E9E9 solid;
      
      .con-tit {
        height: 20px;
        line-height: 20px;
        font-size: 14px;
        font-weight: 500;
        margin-bottom: 20px;
      }
    }
    .add-question{
      .add-btn{
        cursor: pointer;
        border: #BABABA 1px dashed;
        background-color: #F7F7F7;
        padding-left: 8px;
        color: #666666;
        font-size: 14px;
        height: 28px;
        line-height: 28px;
      }
    }
    .edit-box{
      border: 1px solid #BABABA;
      width:450px;
      height:28px;
      padding: 0 10px 0 0;

      &.hoverInput {
        box-shadow: 0 0 0 2px rgba(#4B4B64, 0.2);
      }
  
      .edit-txt{
        border: none;
        width: 330px;
        &:focus, &:hover {
          border: none;
          outline: none;
          box-shadow: none;
        }

      }
      span{
        margin: 0 10px;
        color: #666666;
        font-size: 12px;
        cursor: pointer;
      }
  
    }
    .qu-list{
      flex: 1;
      @include auto-overflow-Y();
      @include customScrollbar();
      margin-top: 20px;
      .qu-info{
        display: flex;
        justify-content:space-between;
        background-color: #F7F7F7;
        padding-left: 10px;
        color: #666666;
        font-size: 14px;
        // height: 28px;
        line-height: 20px;
        padding: 5px 10px;
        margin-bottom: 10px;
      }
  
    }
    .delete{
      cursor: pointer;
      font-weight: 500;
      font-size: 18px;
      padding-right: 10px;
    }
  }

  .no-other {
    color: #999;
    text-align: center;
    margin-top: 40px;
  }

</style>
