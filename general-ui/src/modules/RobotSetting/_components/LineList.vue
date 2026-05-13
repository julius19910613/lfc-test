<template>
  <div class="bind-wechat-wrapper">
    <general-table
      :table-data="enterpriseList"
      :table-header="tableHeader"
      :action="action"
      auto-height
      show-empty>
    </general-table>
  </div>
</template>

<script>
import robotAPI from '../_api/robot';

export default {
  api: robotAPI,
  data() {
    return {
      tableHeader: [
        {
          key: 'secret',
          text: 'secret',
          width: '200px',
        },
        {
          key: 'token',
          text: 'token',
          width: '400px',
        },
      ],
      enterpriseList: [],
      action: [
        {
          key: 'delete',
          text: this.$t('robot_setting.unbind'),
          type: 'error',
          onclick: this.handleUnbindWechat,
        },
      ],
    };
  },
  created() {
    this.getLineList();
  },
  methods: {
    getLineList() {
      this.$api.getPlatformList('line').then((res) => {
        this.enterpriseList = res;
        this.enterpriseList.forEach((item) => {
          item.action_enable = {
            delete: true,
          };
        });
      });
    },
    handleUnbindWechat() {
      this.$api.unBindPlatform('line').then(() => {
        this.getLineList();
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.bind-wechat-wrapper{
  width: 834px;
  height: 480px;
  min-height: 200px;
}
</style>