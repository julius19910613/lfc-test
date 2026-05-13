<template>
  <div id="license" class="license">
    <template v-if="!showAuthInfo">
      <div class="card h-fill w-fill">
        <div  class="license-header">
          <div class="license-title">{{ $t('license.license_manage_title') }}</div>
          <text-button @click="showApply = true">{{ $t('license.btn_apply') }}</text-button>
          <el-upload
            action="string"
            :multiple="false"
            :show-file-list="false"
            :http-request="handleUpload"
            :before-upload="handleBeforeUpload"
            :file-list="fileList">
            <text-button button-type="primary">{{ $t('license.btn_import') }}</text-button>
          </el-upload>
        </div>
        <!-- start Probation no authority -->
        <div v-if="!licenseInfo.license_exist" class="license-probation">
          <div class="license-body">
            <div class="license-main">{{ licenseInfo && licenseInfo.license_data && licenseInfo.license_data.products &&  licenseInfo.license_Probation ? $t('license.probation_title') : '' }}</div>
            <div>{{ licenseInfo.license_Probation ? $t('license.probation_desc', {date: licenseInfo.probation_expired_date}) : $t('license.probation_over_desc') }}</div>
          </div>
        </div>
        <!-- end Probation no authority -->
        <!-- start with authority -->
        <div v-if="licenseInfo.license_exist" class="license-authorized">
          <div class="license-client-info">
            <div class="client-title">{{ $t('license.client.client_info_title') }}</div>
            <ul class="client-body">
              <li>
                <span class="client-name">{{ $t('license.client.owner') }}</span>
                <div>{{ licenseInfo.license_data.platform.user_name }}</div>
              </li>
              <li>
                <span class="client-name">{{ $t('license.client.status') }}</span>
                <div class="mint" :class="{'red': licenseInfo.license_expired}">{{ licenseInfo.license_expired ? $t('license.client.expired') : $t('license.client.valid') }}</div>
              </li>
              <li>
                <span class="client-name">{{ $t('license.client.id') }}</span>
                <!-- <div>TODO time_stamp</div> -->
                <div>{{ licenseInfo.license_data.platform.time_stamp }}</div>
              </li>
              <li>
                <span class="client-name">{{ $t('license.client.generate_date') }}</span>
                <div>{{ licenseInfo.applied_date }}</div>
              </li>
              <li>
                <span class="client-name">{{ $t('license.client.valid_date') }}</span>
                <div>{{ licenseInfo.expiration_date }}</div>
              </li>
            </ul>
          </div>
          <div class="statistics-robots">
            <div>
              <span class="client-name">机器人平台</span>
              <i class="license-list-link" @click="checkAuthStatus">授权使用状态</i>
              <ul>
                <li>
                  <span class="client-name">{{ $t('license.client.faq_amount') }}</span>
                  <span>{{ licenseInfo && licenseInfo.license_data && licenseInfo.license_data.products && licenseInfo.license_data.products.bf.faq_num }}{{ $t('general.unit1') }}</span>
                </li>
                <li>
                  <span class="client-name">{{ $t('license.client.kg_entity') }}</span>
                  <span>{{ licenseInfo && licenseInfo.license_data && licenseInfo.license_data.products &&  licenseInfo.license_data.products.bf.kg_num }}{{ $t('general.unit2') }}</span>
                </li>
                <li>
                  <span class="client-name">{{ $t('license.client.te_scenerio') }}</span>
                  <span>{{ licenseInfo && licenseInfo.license_data && licenseInfo.license_data.products &&  licenseInfo.license_data.products.bf.te_num }}{{ $t('general.unit2') }}</span>
                </li>
                <li>
                  <span class="client-name">{{ $t('license.client.chat_function') }}</span>
                  <span>{{ licenseInfo && licenseInfo.license_data && licenseInfo.license_data.products &&  licenseInfo.license_data.products.bf.chat_switch ? $t('license.client.open') : $t('license.client.close') }}</span>
                </li>
                <li>
                  <span class="client-name">{{ $t('license.client.ner_function') }}</span>
                  <span>{{ licenseInfo && licenseInfo.license_data && licenseInfo.license_data.products &&  licenseInfo.license_data.products.bf.ner_switch ? $t('license.client.open') : $t('license.client.close') }}</span>
                </li>
                <li>
                  <span class="client-name">{{ $t('license.client.function') }}</span>
                  <span>{{ licenseInfo && licenseInfo.license_data && licenseInfo.license_data.products &&  licenseInfo.license_data.products.bf.skill_discovery_switch ? $t('license.client.open') : $t('license.client.close') }}</span>
                </li>
                <li>
                  <span class="client-name">机器人数量</span>
                  <span>{{ licenseInfo && licenseInfo.license_data && licenseInfo.license_data.products &&  licenseInfo.license_data.products.bf.robot_num }}个</span>
                </li>
              </ul>
            </div>
            <div>
              <span class="client-name">外呼机器人</span>
              <i class="license-list-link" @click="handleCcbotSkip">授权使用状态</i>
              <ul>
                <li>
                  <span class="client-name">并发数量</span>
                  <span>{{ licenseInfo && licenseInfo.license_data && licenseInfo.license_data.products &&  licenseInfo.license_data.products.csa.line_num }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <!-- end with authority -->
      </div>
      <el-dialog
        :title="$t('license.apply.popup_title')"
        :visible.sync="showApply"
        :close-on-click-modal = "false"
        :close-on-press-escape = "false"
        width="650px">
        <apply-popup :visible="showApply"></apply-popup>
        <span slot="footer" class="dialog-footer">
          <text-button class="copyButton" @click="showApply = false">{{$t('general.close')}}</text-button>
        </span>
      </el-dialog>
    </template>
    <authorized-info v-else @handleReturnTo="handleReturnTo" :licenseInfo="licenseInfo"></authorized-info>
  </div>
</template>
<script>
import { mapMutations, mapGetters } from 'vuex';
import api from './_api/license';
import ApplyPopup from './_components/ApplyPopup';
import AuthorizedInfo from './_components/authorizedInfo';

export default {
  api,
  components: {
    ApplyPopup,
    AuthorizedInfo,
  },
  data: () => ({
    isProbation: false,
    showApply: false,
    fileType: 'lic',
    fileList: [],
    licenseDetails: [],
    showAuthInfo: false,
  }),
  computed: {
    ...mapGetters([
      'licenseInfo',
      'userInfo',
    ]),
    currentlicenseDetails() {
      return this.licenseDetails.slice((this.pageIndex - 1) * this.pageSize,
      this.pageIndex * this.pageSize);
    },
  },
  created() {
    // this.handleGetLicenseInfo();
  },
  methods: {
    ...mapMutations([
      'setLicenseInfo',
    ]),
    handleReturnTo() {
      this.showAuthInfo = false;
    },
    checkAuthStatus() {
      this.showAuthInfo = true;
    },
    handleGetLicenseInfo() {
      this.$api.getLicenseInfo()
      .then((res) => {
        if (res.status >= 0) {
          this.setLicenseInfo(res.result);
        }
      });
    },
    handleUpload(item) {
      this.$api.uploadLicense(item.file)
        .then((data) => {
          if (data.status >= 0) {
            this.$message.success(this.$t('license.upload_lic_success'));
            this.handleGetLicenseInfo();
          } else {
            this.$message.error(`${this.$t('license.upload_lic_fail')}${data.message}`);
          }
        }).catch(() => {
          this.$message.error(this.$t('license.upload_lic_fail'));
        });
    },
    handleBeforeUpload(file) {
      const type = file.name.substring(file.name.lastIndexOf('.') + 1);
      if (type.toLowerCase() !== this.fileType) {
        this.$message.warning(this.$t('license.upload_format_error'));
        return false;
      }
      return true;
    },
    handleCcbotSkip() {
      if (this.userInfo.type === 0) {
        window.location = '/ccbot/#/config/license';
      } else if (this.userInfo.type === 1) {
        window.location = '/ccbot/#/manage/license';
      }
    },
  },
  mounted() {
    // this.handleGetLicenseInfo();
  },
};
</script>

<style lang="scss" scoped>
@import 'styles/variable';
.statistics-robots {
  display: flex;
  flex-direction: row;
  .license-list-link {
    float: right;
    height: 32px;
    line-height: 32px;
    font-size:14px;
    border:1px solid rgba(219,219,219,1);
    width: 120px;
    text-align: center;
    border-radius:3px;
    cursor: pointer;
  }
  ul {
    margin-top: 5px;
  }
  div {
    flex: 1;
    margin-right: 20px;
    background:rgba(252,252,252,1);
    border-radius:4px;
    border:1px solid rgba(238,238,238,1);
    padding: 20px;
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    font-size: 14px;
    li {
      span {
        &.client-name {
          display: inline-block;
          width: 100px;
          text-align: right;
          line-height: 22px;
          margin-right: 10px;
        }
      }
    }
    &:last-child {
      margin-right: 0;
    }
  }
}
.license {
  // background-color: #F6F6F6;
  .license-header {
    display: flex;
    padding: 20px;
    .license-title {
      flex: 1;
      color: $color-font-active;
      @include font-18px();
    }
    .text-button {
      margin-left: 20px;
    }
  }

  .license-probation {
    padding: 0 20px 20px 20px;
    .license-body {
      // margin-top: 20px;
      padding: 50px 30px;
      text-align: center;
      background: $color-bg-f7;
      color: $color-font-mark;
      @include font-14px();
      .license-main {
        margin-bottom: 10px;
        @include font-16px();
        color: $color-font-active;
      }
    }
  }
  .license-authorized {
    padding: 0 20px 20px 20px;
    .license-client-info {
      padding: 20px;
      border-radius: 4px;
      background-color: $color-bg-fc;
      border: 1px solid $table-border-color;
      // max-height: 270px;
      line-height: 1.5em;
      margin-bottom: 20px;
      .client-title {
        color: $color-font-active;
        @include font-16px();
      }
      ul.client-body {
        margin-top: 10px;
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        // max-height: 230px;
        line-height: 2em;
        font-size: 14px;
        .client-name {
          margin-right: 10px;
          display: block;
          width: 120px;
        }
        >li {
          display: flex;
          color: $color-font-active;
          >span {
            color: $color-font-normal;
            text-align: right;
          }
          div.mint {
            color: $color-success;
            &.red {
              color: $color-error;
            }
          }
          >ul>li {
            display: flex;
            span.client-name{
              width: 70px;
            }
          }
        }
      }
    }
  }
}
</style>
