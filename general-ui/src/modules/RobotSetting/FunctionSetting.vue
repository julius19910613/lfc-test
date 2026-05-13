<template>
<div id="robot-skill">
  <div class="tab-box">
    <el-tabs v-model="activeName" class="emotibot function-setting-tab">
      <el-tab-pane :label="$t('robot_setting.inner_skill')" name="first"></el-tab-pane>
      <el-tab-pane :label="$t('robot_setting.find_skill')" name="second"></el-tab-pane>
    </el-tabs>
  </div>
  <div class="skill-box">
    <div class="card h-fill w-fill" v-show="activeName === 'first'">
      <div class="header">
        <div class="header-text">{{ $t('pages.robot_setting.robot_function') }}</div>
        <icon iconType="info" :size="16" enableHover v-tooltip="pageInfoTooltip"></icon>
        <div class="row top-right-icon">
          <text-button v-if="canEdit" v-on:click="setAll(true)" :button-type="allActive ? 'disable': 'default'">{{ $t("robot_setting.all_active") }}</text-button>
          <text-button v-if="canEdit" v-on:click="setAll(false)" :button-type="allDeactive ? 'disable': 'default'">{{ $t("robot_setting.all_deactive") }}</text-button>
        </div>
      </div>
      <div class="local-skill-list">
        <div class="list-body">
          <emoti-card
            v-for="(item, idx) in moduleList" :key="item.id"
            v-model="item.active"
            :title="item.name"
            :text="item.remark"
            withIcon
            :iconStyle="`background-image:url('/static/images/${item.code}.svg')`"
            @statusChange="updateSkill(item, idx)">
          </emoti-card>
        </div>
      </div>
      <!-- <div class="page">
        <div class="skill-card-container">
          <div v-for="skill in moduleList" :key="skill.id" class="skill-card" :class="{checked: skill.active}">
            <div class="skill-switch" v-if="canEdit">
              <toggle v-model="skill.active" @change="updateSkill(skill)"/>
            </div>
            <div class="skill-switch" v-else style="cursor: default;"></div>
            <div class="skill-text">
              <div class="skill-name">{{ skill.name }}</div>
              <div class="skill-remark">{{ skill.remark }}</div>
            </div>
          </div>
        </div>
      </div> -->
    </div>
    <div class="card h-fill w-fill" v-show="activeName === 'second'">
      <find-function></find-function>
    </div>
  </div>
</div>
</template>

<script>
import api from './_api/robot';
import FindFunction from './_components/FindFunction';

export default {
  path: 'robot-function',
  privCode: 'robot_function',
  displayNameKey: 'robot_function',
  icon: 'white_setting2',
  api,
  methods: {
    reloadSkill() {
      const that = this;
      return that.$api.getFunctionsStatusV2()
      .then((data) => {
        that.moduleList = data;
        that.moduleList.forEach((mod) => {
          mod.image = `/static/function_${mod.code.toLowerCase()}.png`;
        });
      }, () => {});
    },
    toggleSkill(skill) {
      skill.checked = !skill.checked;
      this.updateSkill(skill);
    },
    updateSkill(skill, idx) {
      const active = !skill.active;
      const that = this;
      this.$api.setFunctionStatusV2(skill.code, active).then((data) => {
        const res = data.data;
        if (res.status === 0) {
          this.$message({
            message: this.$t('error_msg.success'),
            type: 'success',
            showClose: true,
          });
        } else {
          this.$set(this.moduleList[idx], 'active', !skill.active);
          this.$message({
            message: res.message,
            type: 'error',
            showClose: true,
          });
          this.$message.error(res.message);
        }
      })
      .then(() => {
        that.$emit('endLoading');
      });
    },
    setAll(val) {
      const that = this;
      if ((val && this.allActive) || (!val && this.allDeactive)) return;
      that.moduleList.forEach((skill) => {
        skill.checked = val;
      });

      that.$startPageLoading();
      this.$api.setFunctionInfosV2(that.moduleList, val)
      .then((rsp) => {
        if (rsp.data.status !== 0) {
          that.$notifyFail('error_msg.request_fail');
        } else {
          this.$notify({ text: that.$t('error_msg.success') });
        }
      }, () => {
        that.$notifyFail('error_msg.request_fail');
      })
      .then(() => that.reloadSkill())
      .then(() => {
        that.$emit('endLoading');
      });
    },
    setUpModuleList() {
      this.moduleList = [
      ];
    },
    initPage() {
      const that = this;

      that.$startPageLoading();
      that.reloadSkill().then(() => {
        that.$emit('endLoading');
      });
    },
  },
  components: {
    FindFunction,
  },
  data() {
    return {
      showLoading: false,
      moduleList: [],
      i18n: undefined,
      pageInfoTooltip: {
        msg: this.$t('robot_setting.tooltip'),
      },
      activeName: 'first',
    };
  },
  activated() {
    this.initPage();
  },
  mounted() {
    this.setUpModuleList();
    this.initPage();
  },
  computed: {
    canEdit() {
      return this.$hasRight('edit');
    },
    allActive() {
      return this.moduleList.reduce((ret, mod) => ret && mod.active, true);
    },
    allDeactive() {
      return this.moduleList.reduce((ret, mod) => ret && !mod.active, true);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "styles/variable";

$function-header-height: 60px;
$function-header-font-size: 16px;
$function-header-bg: #fcfcfc;

$card-name-font-size: 14px;
$card-name-color: $color-font-active;
$card-remark-font-size: 12px;
$card-remark-color: #999999;
.local-skill-list {
  padding-left: 20px;
  @include box-sizing(border-box);
  flex: 1;
  overflow: auto;
  .list-body {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }
  .emoti-card {
    // width: calc(33.33% - 20px);
    margin: 0 20px 20px 0;
    width: calc(25% - 20px);
    max-width: 600px;
    min-width: 360px;
  }
}
#robot-skill {
  .card {
    display: flex;
    flex-direction: column;
  }
  .header {
    padding: 20px 20px 10px 20px;
    font-size: $function-header-font-size;
    display: flex;
    flex-direction: row;
    align-items: center;
    .header-text {
      color: $color-font-active;
    }
    .icon {
       margin-left: 6px;
     }
    .text-button {
      margin-left: 10px;
    }
  }
  .tab-box{
    background: #ffffff;
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    height: 40px;
  }
}
#app-page{
  & > .app-body{
    padding: 0!important;
  }
}
.skill-box{
  padding: 0 10px;
  height: calc(100% - 40px);
  .top-right-icon {
    float: right;
    flex: 1;
    text-align: right;
  }
}
// .function-setting-tab {
//   /deep/ .el-tabs__nav {
//     height: 40px;
//     line-height: 40px;
//   }
// }
</style>
