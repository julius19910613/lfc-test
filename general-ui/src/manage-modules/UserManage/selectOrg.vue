<template>
  <div class="select-organ">
    <div class="select-body">
      <div class="div1">{{ $t('statistics.placeholder') }}</div>
      <div class="div3">
        <!-- :class="{ 'span-active': item.isActive }" -->
        <div
          :class="{ 'div2':true,'span-active': item.isActive }"
          v-for="(item,index) in list"
          :key="index"
          @click="radioCheck(item)"
        >
          <el-radio v-model="radio" :label="index">{{item.orgname}}</el-radio>
        </div>
      </div>
      <el-button type="primary" class="emotibot" @click="handlerpush">{{ $t('general.enter') }}</el-button>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex';
import api from '../../api/system';

export default {
  name: 'select-org',
  path: 'select-org',
  api,
  data() {
    return {
      radio: '',
      list: [],
      isActive: false,
    };
  },
  computed: {
    ...mapGetters(['userID']),
    ...mapMutations(['setEnterprise', 'setProduct', 'setorgId']),
  },
  methods: {
    radioCheck(item) {
      console.log(item);
      this.list.map((li) => {
        li.isActive = false;
        return li;
      });
      item.isActive = true;
    },
    selectOrg() {
      const that = this;
      that.$api.getSelectOrg(this.userID).then((res) => {
        console.log(res);
        res.map((item) => {
          item.isActive = false;
          return item;
        });
        that.list = res;
      });
    },
    handlerpush() {
      console.log(this.$store);
      const that = this;
      console.log(that.list[this.radio].orgid);
      const data = [];
      if (Array.isArray(that.list[this.radio].productInfos)) {
        that.list[this.radio].productInfos.map((item) => {
          data.push(item.productid);
          return item;
        });
      }
      console.log(data);
      that.$store.commit('setProduct', data);
      that.$store.commit('setorgId', that.list[this.radio].orgid);
      console.log(that.$store.state.orgiId);
      localStorage.setItem('orgId', that.list[this.radio].orgid);
      that.$router.push('/manage/robot-manage');
    },
  },
  created() {
    this.selectOrg();
  },
};
</script>

<style lang="scss" scoped>
.select-organ {
  padding: 0px !important;
  .select-body {
    text-align: center;
    padding: 10px;
    position: absolute;
    height: calc(100vh - 66px);
    width: calc(100vw - 60px);
    background: #fff;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    overflow: hidden;
    .div1 {
      margin-bottom: 40px;
      margin-top: 20px;
      text-align: center;
      font-size: 24px;
      font-family: PingFangSC-Light, PingFang SC;
      font-weight: 300;
      color: rgba(51, 51, 51, 1);
    }
    .div3 {
      width: 100%;
      text-align: center;
      .div2 {
        position: relative;
        margin-left: auto;
        margin-right: auto;
        // display: inline-block;
        margin-bottom: 20px;
        width: 450px;
        height: 80px;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.08);
        border-radius: 4px;
        border: 1px solid rgba(233, 233, 233, 1);
        font-size: 20px;
        line-height: 80px;
        ::v-deep .el-radio {
          width: 450px;
          height: 80px;
          line-height: 80px;
        }
        ::v-deep .el-radio__input {
          float: left;
          line-height: 80px;
          margin-left: 20px;
        }
         ::v-deep .el-radio__label{
           position: absolute;
           left: 40%;
          }
        ::v-deep .el-radio__input.is-checked .el-radio__inner {
          border-color: #1875f0;
          background: #1875f0;
        }
        ::v-deep .el-radio__input.is-checked + .el-radio__label {
          color: #1875f0;
        }
        ::v-deep .el-radio__label {
          font-size: 20px;
          padding-left: 0px;
        }
      }
      .span-active {
        border: 2px solid rgba(24, 117, 240, 1);
      }
    }
    ::v-deep .el-button--primary {
      background-color: #3d4b63;
      border-color: #3d4b63;
    }
    .el-button {
      padding: 9px 20px;
      width: 160px;
    }
  }
}
</style>