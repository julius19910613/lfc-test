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
          key: 'page-id',
          text: `${this.$t('robot_setting.page_id')}`,
          width: '200px',
        },
        {
          key: 'access-token',
          text: `${this.$t('robot_setting.access_token')}`,
          width: '400px',
        },
      ],
      enterpriseList: [],
      action: [
        {
          key: 'delete',
          text: this.$t('robot_setting.unbind'),
          type: 'error',
          onclick: this.handleUnbindPlatform,
        },
      ],
    };
  },
  created() {
    this.getMessengerList();
  },
  methods: {
    getMessengerList() {
      this.$api.getPlatformList('messenger').then((res) => {
        this.enterpriseList = res;
        this.enterpriseList.forEach((item) => {
          item.action_enable = {
            delete: true,
          };
        });
      });
    },
    handleUnbindPlatform() {
      this.$api.unBindPlatform('messenger').then(() => {
        this.getMessengerList();
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