<template>
    <div class="find-function">
      <div class="function-header">
        <p>{{$t('robot_setting.find_skill_title')}}</p>
        <div class="filter-box">
          <el-select v-model="category" size="mini" @change="handleCateoryChange" class="emotibot-select-single">
            <el-option
              class="emotibot"
              v-for="item in categoryList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
          <el-input
            class="find-function-skill"
            size="mini" 
            v-model.trim="filterCategory"
            :placeholder="$t('robot_setting.skill_name')"
            suffix-icon="el-icon-search"
            @keyup.enter.native="handleSearch"></el-input>
        </div>
      </div>
      <div class="function-body">
        <div class="list-body">
          <emoti-card
            v-for="(item, idx) in functionList" :key="idx"
            v-model="item.status"
            :subTitle="item.category"
            :title="item.name"
            :text="item.desc"
            withIcon
            :iconStyle="`background-image:url(${item.icon})`"
            @statusChange="handleSwitch(item, idx)">
            <div slot="after" class="user-define-operate">
              <el-popover
                popper-class="no-body-padding"
                placement="bottom"
                width="250"
                trigger="click">
                <div class="function-popover-content">
                  <p class="top">{{item.name}}{{$t('robot_setting.demo_question')}}</p>
                  <div class="demo-item" v-for="(card, cardx) in item.demo" :key="cardx">
                    <p>{{card.title}}</p>
                    <span v-for="(qa, qax) in card.question" :key="qax">{{qa}}</span>
                  </div>
                </div>
                <span slot="reference">
                  <el-tooltip class="item" effect="dark" :content="$t('robot_setting.demo_question')" placement="bottom">
                    <i class="el-icon-view view-more-detail"></i>
                  </el-tooltip>
                </span>
              </el-popover>
            </div>
          </emoti-card>
        </div>
      </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import api from '../_api/findskill';

export default {
  api,
  data() {
    return {
      category: 0,
      categoryList: [],
      filterCategory: '',
      functionList: [],
    };
  },
  created() {
    this.fetchMapList();
    this.fetchList(this.filterCategory);
  },
  computed: {
    ...mapGetters([
      'robotID',
    ]),
  },
  methods: {
    fetchMapList() {
      this.$api.fetchMapList()
        .then((res) => {
          if (res.result instanceof Array) {
            this.categoryList = res.result;
            this.categoryList.unshift({ id: 0, name: '全部' });
          } else {
            this.$message.error(res.message);
          }
        })
        .catch(() => {});
    },
    fetchList(query = '') {
      this.$api.fetchList(this.robotID, this.category, query)
        .then((res) => {
          if (res.result instanceof Array) {
            this.functionList = res.result;
            for (let i = 0; i < this.functionList.length; i += 1) {
              this.$api.fetchIocn(this.functionList[i].skillId)
                .then((response) => {
                  if (response.result !== '') {
                    this.$set(this.functionList[i], 'icon', `data:image/jpeg;base64,${response.result}`);
                  } else {
                    this.$set(this.functionList[i], 'icon', '/static/default-skill-icon.svg');
                  }
                });
            }
          } else {
            this.$message.error(res.message);
          }
        })
        .catch(() => {});
    },
    handleSwitch(item, i) {
      this.$api.setStatus(this.robotID, item.skillId, !item.status)
        .then((res) => {
          if (res.result === true) {
            this.$message({
              message: this.$t('robot_setting.operate_success'),
              type: 'success',
              showClose: true,
            });
          } else {
            this.$set(this.functionList[i], 'status', !item.status);
            this.$message({
              message: this.$t('robot_setting.operate_error'),
              type: 'error',
              showClose: true,
            });
          }
        })
        .catch((err) => {
          this.$set(this.functionList[i], 'status', !item.status);
          this.$message.error(err);
        });
    },
    handleCateoryChange() {
      this.fetchList();
    },
    handleSearch() {
      this.fetchList(this.filterCategory);
    },
  },
};
</script>

<style lang="scss" scoped>
  @import "styles/variable";
  .find-function{
    height: 100%;
    padding: 20px 0 20px 20px;
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    display: flex;
    flex-direction: column;
  }
  .function-header{
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
    .filter-box{
      display: flex;
      flex-direction: row;
      .el-select{
        margin-right: 20px;
      }
      .find-function-skill {
        flex: 1;
        margin-right: 20px;
      }
    }
    p{
      font-size: 16px;
      color: #333333;
    }
  }
  .function-body{
    flex: 1;
    overflow-y: auto;
    .list-body{
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      .emoti-card {
        margin: 0 20px 20px 0;
        width: calc(25% - 20px);
        max-width: 600px;
        // margin: 0 20px 20px 0;
        // width: calc(33.33% - 20px);
      }
      .user-define-operate{
        text-align: right;
        .view-more-detail{
          display: inline-block;
          width: 30px;
          height: 30px;
          line-height: 30px;
          text-align: center;
          background: #eeeff8 no-repeat 50%/contain;
          border-radius: 7px;
          margin-left: 10px;
          font-size: 18px;
          color: #65748d;
          outline: none;
          vertical-align: top;
          border: none;
          cursor: pointer;
        }
      }
    }
  }
  .function-popover-content{
    color: #333333;
    .top {
      // height: 40px;
      // line-height: 40px;
      border-bottom: 1px solid rgba(233,233,233,1);
      padding: 0 20px 10px;
      box-sizing: border-box;
      -moz-box-sizing: border-box;
      -webkit-box-sizing: border-box;
      margin-bottom: 10px;
    }
    .demo-item{
      font-size: 12px;
      padding: 0 20px;
      box-sizing: border-box;
      -moz-box-sizing: border-box;
      -webkit-box-sizing: border-box;
      margin-bottom: 10px;
      p{
        margin-bottom: 6px;
        color: #333333;
      }
      span{
        display: block;
        line-height: 20px;
        color: #666666;
      }
    }
  }
</style>