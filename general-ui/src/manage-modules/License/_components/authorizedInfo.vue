<template>
  <div class="license-authorized-info card h-fill w-fill">
    <div class="authorized-title">
      {{ $t('license.authorized_status.title') }}
      <span>{{ $t('license.authorized_status.robot_used_status', {total: licenseInfo.license_data && licenseInfo.license_data.products &&  licenseInfo.license_data.products.bf.robot_num, num: userdNum}) }}</span>
      <span class="btn-return" @click="handleReturn">返回</span>
    </div>
    <el-table
    v-loading="isLoading"
    :element-loading-text="$t('general.table_loading')"
    class="emotibot"
    :data="currentlicenseDetails">
      <el-table-column prop="robot_name" :label="$t('license.authorized_status.robot_name')" min-width="240px"></el-table-column>
      <el-table-column prop="enterprise_name" :label="$t('license.authorized_status.user_name')" min-width="120px"></el-table-column>
      <el-table-column prop="faq_used_num" :label="`FAQ${$t('license.authorized_status.amount')}`" min-width="120px">
        <template slot-scope="scope">
          <span :class="{'beyond-num': scope.row.faq_used_num > licenseInfo.license_data.products.bf.faq_num}">{{scope.row.faq_used_num}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="kg_used_num" :label="`${$t('license.client.kg_entity')}${$t('license.authorized_status.amount')}`" min-width="120px">
        <template slot-scope="scope">
          <span :class="{'beyond-num': scope.row.kg_used_num > licenseInfo.license_data.products.bf.kg_num}">{{scope.row.kg_used_num}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="te_used_num" :label="`${$t('license.client.te_scenerio')}${$t('license.authorized_status.amount')}`" min-width="120px">
        <template slot-scope="scope">
          <span :class="{'beyond-num': scope.row.te_used_num > licenseInfo.license_data.products.bf.te_num}">{{scope.row.te_used_num}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('license.client.chat_function')" min-width="120px">
        <template slot-scope="scope">
          <span :class="{'beyond-num': licenseInfo.license_data.products.bf.chat_switch !== scope.row.chat_switch }">
            {{ scope.row.chat_switch ? $t('license.authorized_status.opened') : $t('license.authorized_status.not_open') }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="ner_switch" :label="$t('license.client.ner_function')" min-width="120px">
        <template slot-scope="scope">
          <span :class="{'beyond-num': licenseInfo.license_data.products.bf.ner_switch !== scope.row.ner_switch }">
            {{ scope.row.ner_switch ? $t('license.authorized_status.used') : $t('license.authorized_status.not_use') }}
          </span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('license.client.function')" min-width="120px">
        <template slot-scope="scope">
          <span :class="{'beyond-num': licenseInfo.license_data.products.bf.skill_discovery_switch !== scope.row.skill_discovery_switch }">
            {{ scope.row.skill_discovery_switch ? $t('license.authorized_status.used') : $t('license.authorized_status.not_use') }}
          </span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination class="emotibot page-control"
      v-show="licenseDetails.length > 0"
      small
      :page-sizes="pageLimits"
      :current-page.sync="pageIndex" 
      :page-size="pageSize"  
      @size-change="handlePageSizeChange" 
      @current-change="handleChangePageIndex"
      layout="prev, pager, next, sizes"
      :total="licenseDetails.length">
    </el-pagination>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex';
import api from '../_api/license';

export default {
  name: 'authorized-info',
  api,
  data() {
    return {
      pageLimits: [10, 20, 50, 100],
      pageIndex: 1,
      pageSize: 10,
      isLoading: false,
      licenseDetails: [],
      userdNum: 0,
    };
  },
  props: {
    licenseInfo: {
      type: Object,
      default: () => {},
    },
  },
  created() {
    this.handleGetLicenseDetail();
  },
  computed: {
    ...mapGetters([
      'licenseInfo',
    ]),
    currentlicenseDetails() {
      return this.licenseDetails.slice((this.pageIndex - 1) * this.pageSize,
      this.pageIndex * this.pageSize);
    },
  },
  methods: {
    ...mapMutations([
      'setLicenseInfo',
    ]),
    handleGetLicenseDetail() {
      this.isLoading = true;
      this.$api.getLicenseDetail()
      .then((res) => {
        if (res.status >= 0) {
          // this.setLicenseInfo(res.result);
          this.userdNum = res.result.license_robot_used;
          this.licenseDetails = res.result.license_param_used;
        }
      }).finally(() => {
        this.isLoading = false;
      });
    },
    handleChangePageIndex(page) {
      this.pageIndex = page;
    },
    handlePageSizeChange(pageSize) {
      this.pageSize = pageSize;
    },
    handleReturn() {
      this.$emit('handleReturnTo');
    },
  },
  mounted() {
    console.log(this.licenseInfo);
  },
};
</script>
<style lang="scss" scoped>
.beyond-num {
  color: red;
}
.license-authorized-info {
  background: #ffffff;
  box-shadow:0px 0px 5px 0px rgba(102,102,102,0.08);
  border-radius:4px;
  border:1px solid rgba(233,233,233,1);
  margin-top: 10px;
  overflow: hidden;
  .authorized-title {
    margin: 20px;
    color: $color-font-active;
    @include font-16px();
    span {
      color: $color-font-normal;
      @include font-12px();
      &.btn-return {
        float: right;
        width: 80px;
        height: 28px;
        line-height: 28px;
        text-align: center;
        font-size:12px;
        color:rgba(102,102,102,1);
        border-radius:3px;
        border:1px solid rgba(219,219,219,1);
        cursor: pointer;
      }
    }
  }
}
.el-pagination {
  padding: 10px 0;
  text-align: right;
}
</style>