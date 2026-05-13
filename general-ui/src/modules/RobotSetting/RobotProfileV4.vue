<template>
<div id="robot-profile-new">
  <div class="card w-fill h-fill">
    <div class="header">
      <p>{{$t('pages.robot_setting.module_name')}}</p>
      <el-popover class="desc-popover" placement="top-start" width="350" trigger="hover">
<!--        <span style="font-size: 12px;"></span>-->
         <span style="font-size: 12px;" v-html="$t('pages.robot_setting.message')"></span>
        <i class="el-icon-info" slot="reference"></i>
      </el-popover>
    </div>
    <div class="content">
      <div v-for="(item,key) in robotQAsList" :key="key" class="content-one">
        <div class="con-header">
          <div class="con-left">
            <p class="question">{{item.main_question}}</p>
            <p class="more-btn" @click="checkQuestion(item)">{{$t('pages.robot_setting.check_other_question')}}</p>
          </div>
          <div class="con-right">
            <el-button
              :disabled="item.answers.length >= 100"
              class="add-btn" size="small"
              @click="importAddAnswer(item, item, true)">
              {{$t('pages.robot_setting.add_answer')}}
            </el-button>
          </div>
        </div>
        <div class="answer" v-if="item.answers.length!==0">
          <div class="answer-one" v-for="(subItem,subKey) in item.answers" :key="subKey">
            <div class="answer-con">
              <p class="answer-tit">{{subItem.answer}}</p>
            <div class="answer-btn">
              <span class="answer-edit" @click="importAddAnswer(item, subItem)"></span>
              <span class="answer-delete" @click="deleteAnswer(item, subItem)"></span>
            </div>
            </div>
            <div class="answer-info">
              <template v-if="subItem.property.showTags && subItem.property.showTags.length > 0">
                <div class="info-one" v-for="(list,idx) in subItem.property.showTags" :key="idx">{{list}}</div>
              </template>
              <template v-else>
                <div class="info-one" v-for="(val, idx) in dimensionList" :key="idx">
                  {{ `${val.name}: ${$t('answer_editor.dimension_selector.all')}` }}
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
      
    </div>
    
  </div>
</div>
</template>

<script>
import api from './_api/robotV3';
import AddAnswer from './_components/AddAnswer';
import AddQuestion from './_components/AddQuestion';

export default {
  path: 'robot-profile',
  privCode: 'robot_profile', // 权限
  displayNameKey: 'robot_profile', // 中文显示
  icon: 'white_robot',
  components: {
  },
  data() {
    return {
      // robotQAsList: [],
      id: '',
      robotOriginInfo: [],
      dimensionList: [],
      robotQAsList: [],
      questionList: [],
    };
  },
  api,
  watch: {
    robotOriginInfo(val) {
      if (!val || val.length === 0) {
        this.robotQAsList = [];
        this.questionList = [];
        return;
      }
      this.robotQAsList = val.map(item => ({
        ...item,
        answers: item.answers.map((v) => {
          const { answer, property } = this.parseContent(v);
          return ({
            ...v,
            answer,
            property: this.analyzeDimension(property, this.dimensionList),
          });
        }),
      }));
      this.questionList = val.reduce((arr, item) => {
        arr.push(item.main_question, ...item.relate_questions.map(v => v.content));
        return arr;
      }, []);
    },
  },
  created() {
    this.getRobotDimension();
    this.loadQAs();
  },
  methods: {
    analyzeDimension(info, dimensionList) {
      const dimensionIdList = (info && info.dimension_id_list) || [];
      if (dimensionIdList.length === 0
        || !dimensionList || dimensionList.length === 0) {
        info.showTags = [];
        // info.showTags = [this.$t('answer_editor.dimension_selector.all_dimension')];
        return info;
      }
      const lists = dimensionList.map((v) => {
        const txt = v.name;
        const msg = v.list.reduce((arr, val) => {
          const i = dimensionIdList.indexOf(val.id);
          if (i !== -1) {
            arr.push(val.name);
          }
          return arr;
        }, []);
        if (msg.length === 0) {
          return `${txt}: ${this.$t('answer_editor.dimension_selector.all')}`;
        }
        return `${txt}: ${msg.join('/')}`;
      });
      info.showTags = lists;
      return info;
    },
    loadQAs() {
      this.$api.getRobotQAs()
      .then((data) => {
        this.robotOriginInfo = data.map(item => ({
          ...item,
          answers: item.answers.reduce((answers, v) => {
            const info = this.parseContent(v);
            if (info.answer !== undefined && info.property !== undefined) {
              answers.push({ ...v, ...info });
            }
            return answers;
          }, []),
        }));
      })
      .catch((err) => {
        console.log(err);
      });
    },
    parseContent(v) {
      let answer;
      let property;
      try {
        const content = JSON.parse(v.content);
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
    addAnswer(id, info) {
      this.$api.addRobotQAAnswer(id, info)
        .then(() => {
        })
        .catch((err) => {
          console.log(err);
          const res = err.response;
          const defaultMsg = this.$t('answer_editor.add_answer_err');
          if (res) {
            this.$message.error(res.data.message || res.data.result || defaultMsg);
          } else {
            this.$message.error(defaultMsg);
          }
        })
        .finally(() => {
          this.loadQAs();
        });
    },
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
    deleteAnswer(robotQA, answer) {
      const option = {
        data: {
          msg: this.$t('answer_editor.delete_answer'),
        },
        ok_msg: this.$t('answer_editor.commit_del'),
        callback: {
          ok: () => {
            this.executeDeleteAnswer(robotQA, answer);
          },
        },
      };
      this.$popWarn(option);
    },
    executeDeleteAnswer(robotQA, answer) {
      this.$api.deleteRobotQAAnswer(robotQA.id, answer.id).then(() => {
        const idx = robotQA.answers.indexOf(answer);
        if (idx >= 0) {
          robotQA.answers.splice(idx, 1);
        }
      })
      .catch((err) => {
        console.log(err);
        const res = err.response;
        const defaultMsg = this.$t('answer_editor.del_answer_err');
        if (res) {
          this.$message.error(res.data.message || res.data.result || defaultMsg);
        } else {
          this.$message.error(defaultMsg);
        }
      })
      .finally(() => {
        this.loadQAs();
      });
    },
    editAnswer(robotQA, answer, content) {
      this.$api.updateRobotQAAnswer(robotQA, answer, content)
        .then(() => {
        })
        .catch((err) => {
          console.log(err);
          const res = err.response;
          const defaultMsg = this.$t('answer_editor.update_answer_err');
          if (res) {
            this.$message.error(res.data.message || res.data.result || defaultMsg);
          } else {
            this.$message.error(defaultMsg);
          }
        })
        .finally(() => {
          this.loadQAs();
        });
    },


    importAddAnswer(item, subItem, add = false) {
      this.$pop({
        // title: '回答编辑 你希望这个问题有什么其他的问法？',
        component: AddAnswer,
        validate: true,
        ok_msg: this.$t('pages.robot_setting.save'),
        data: {
          ...item,
          ...subItem,
        },
        callback: {
          ok: (info) => {
            if (!add) {
              this.editAnswer(item.id, subItem.id, info);
            } else {
              this.addAnswer(item.id, info);
            }
          },
          cancel: () => {
          },

        },

      });
    },
    checkQuestion(item) {
      this.$pop({
        // title: '问法编辑',
        component: AddQuestion,
        validate: true,
        ok_msg: this.$t('pages.robot_setting.confirm_modification'),
        cancel_msg: this.$t('general.close'),
        buttons: ['cancel'],
        data: {
          ...item,
          questionList: this.questionList,
        },
        callback: {
          ok: () => {
            this.loadQAs();
          },
          cancel: () => {
            this.loadQAs();
          },
        },
      });
    },


  },
};
</script>

<style lang="scss" scoped>

$header-height: 60px;
$header-font-size: 16px;
$header-color: #333333;

$table-header-bg: #f7f7f7;
$table-row-height: 40px;
$edit-color: #1875f0;

.card {
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
  line-height: $default-line-height;
  color: $header-color;

  display: flex;
  flex-direction: column;
}
#robot-profile-new{
  .header{
    padding: 20px 20px 16px 20px;
    display: flex;
    /*margin-bottom: 10px;*/
    border-bottom: 1px solid #dbdbdb;
    p{
      height: 24px;
      font-size: 18px;
      line-height: 24px;
    }
  }
  
  .content{
    overflow:scroll;
    max-height:calc(100% - 70px) ;
    padding:0 20px 10px 20px;
    width: calc(100%);
    font-size: 14px;
    margin: 10px 0;
    @include customScrollbar();
    .content-one{
      min-width: 700px;
      background-color: $table-header-bg;
      padding: 10px;
      margin-bottom: 20px;
    }
    .con-header{
      display: flex;
      justify-content:space-between;
      align-items: center;
    }
    .con-left{
      display: flex;
      justify-content:space-between;
      align-items: center;
  
      .question{
        font-size: 16px;
        line-height: 32px;
        margin-right: 20px;
      }
      .more-btn{
        color: $edit-color;
        line-height: 32px;
        cursor: pointer;
      }
    }
    .add-btn{
      width:100px;
      height:32px;
    }
    
    .answer{
      padding-top:10px ;
      width:100%;
      display: flex;
      justify-content:space-between;
      flex-wrap:wrap;
      .answer-one{
        width: calc(50% - 5px);
        margin-bottom: 8px;
        
        .answer-con{
          display: flex;
          height: 40px;
          justify-content:space-between;
          background-color:#E9E9E9;
          padding:0 10px;
          margin-bottom: 3px;
        }
        .answer-tit{
          line-height: 40px;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
        }
      }
      .answer:nth-child(2n+1){
        margin-right: 10px;
      }
      .answer-info{
        // display: flex;
        font-size: 12px;
        line-height: 22px;
        height: 22px;
        overflow: hidden;
        .info-one{
          display: inline-block;
          background-color: #D9DBE4;
          margin-right: 2px;
          line-height: 22px;
          padding:0 7px ;
          
        }
      }
    }
    .answer-btn{
      display: flex;
      align-items: center;
    }
    .answer-edit,.answer-delete{
      display: inline-block;
      height: 18px;
      width: 18px;
      cursor: pointer;
    }
    .answer-edit{
      margin-right: 5px;
      background: url("../../assets/icons/robot_edit.svg") no-repeat center center;
    }
    .answer-delete{
      background: url("../../assets/icons/robot_delete.svg") no-repeat center center;
    }
    
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


</style>
