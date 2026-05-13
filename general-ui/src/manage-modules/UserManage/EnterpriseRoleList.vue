<template>
  <div>
    <div class="card h-fill w-fill">
      <nav-bar class='nav-bar' :options="pageOption"></nav-bar>
      <div class="back-button">
        <text-button @click="goUserList">{{ $t('management.go_back') }}</text-button>
      </div>
      <div class="page">
        <command-row class="commands">
          <text-button button-type="primary" @click="addRole">{{ $t('management.add_role') }}</text-button>
        </command-row>
        <div class="role-list">
          <div class="role-list-inside">
            <div v-for="role in roles" :key="`${role.uuid}-${role.editMode}`" class="role-card" :class="{'edit-mode': role.editMode}">
              <div class="card-title">
              <template v-if="role.editMode">
                <div class="title-text">
                  <input v-model="editName" v-tooltip="nameTooltip" ref='nameInput' maxlength=50 :placeholder="$t('management.role_name_placeholder')" :class="{'error': isNameTooltipShown}">
                </div>
                <div class="title-action">
                  <div class="action" @click="closeEditRole(role, false)">{{ $t('general.cancel') }}</div>
                  <div class="action" @click="closeEditRole(role, true)"
                    v-if="showSave" >{{ $t('general.save') }}</div>
                </div>
              </template>
              <template v-else>
                <div class="title-text">{{ role.name }}</div>
                <div class="title-action" v-if="!oneInEdit">
                  <div class="action" @click="editRole(role)">{{ $t('general.edit') }}</div>
                  <div class="action delete" @click="deleteRolePop(role)">{{ $t('general.delete') }}</div>
                </div>
              </template>
              </div>
              <div class="card-content">
                <div v-for="(val, index) in showPrivilegeMap" :key="index" class="priv-col">
                  <div class="priv-title">
                    {{ val.name }}
                  </div>
                  <div class="priv-list">
                    <template v-if="role.editMode">
                      <template v-for="cmds in val.sub_cmd">
                        <div :key="cmds.cmd_key" class="priv-item">
                          <input type="checkbox" :id="cmds.cmd_key" v-model="cmds.ischecked" @change="checkCmdDependency(cmds, val.sub_cmd, index, role)">
                          <label class="item-text" :for="cmds.cmd_key">
                            {{ cmds.name }}
                          </label>
                        </div>
                      </template>
                    </template>
                    <template v-else>
                      <template v-for="cmds in val.sub_cmd">
                        <div :key="cmds.cmd_key" class="priv-item"
                        v-if="role.privileges && role.privileges.indexOf(cmds.cmd_key) >= 0">
                          <icon icon-type="check" :size=8 />
                          <label class="item-text">
                            {{ cmds.name }}
                          </label>
                        </div>
                      </template>

                    </template>
                  </div>
                </div>
                <div class="priv-col">
                  <div class="priv-title">
                    {{ $t('robot_setting.product_list')}}
                  </div>
                  <div class="priv-list">
                    <template v-if="role.editMode">
                      <template v-for="prod in role.productPrivileges">
                        <div :key="prod.code" class="priv-item">
                          <input type="checkbox" :id="prod.code" v-model="prod.ischecked" @change="checkSelectAny(role)"/>
                          <label class="item-text" :for="prod.code">
                            {{ prod.name }}
                          </label>
                        </div>
                      </template>
                    </template>
                    <template v-else>
                      <template v-for="prod in role.productPrivileges">
                        <div :key="prod.code" class="priv-item" v-if="prod.ischecked">
                        <!-- v-if="role.products.indexOf(prod.code) !== -1" -->
                          <icon icon-type="check" :size=8 />
                          <label class="item-text">
                            {{ prod.name }}
                          </label>
                        </div>
                      </template>
                    </template>
                  </div>
                </div>
              </div>
            </div> <!-- end of role-card-->
          </div> <!-- end of role-list-inside-->
        </div> <!-- end of role-list-->
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import NavBar from '@/components/NavigationBar';
// import modules from '@/modules';
import event from '@/utils/js/event';
import CommandRow from '../_components/CommandRow';
import roleAPI from '../_api/role';
import systemAPI from '../SystemManage/_api/system';

export default {
  privCode: 'manage_user',
  components: {
    NavBar,
    CommandRow,
  },
  api: [roleAPI, systemAPI],
  computed: {
    ...mapGetters([
      'enterpriseID',
      'privilegeList',
    ]),
    duplicateIdx() {
      const that = this;
      const ret = that.editName === '' ? -1 : that.roles.map(r => r.name).indexOf(that.editName);
      return ret;
    },
    showSave() {
      const idx = this.roles.findIndex(role => role.editMode);
      const role = this.roles[idx];
      const existedRole = role.uuid !== undefined && role.uuid !== '';
      return this.selectAny && this.editName.trim() !== ''
      && ((existedRole && this.duplicateIdx === idx) || this.duplicateIdx < 0);
    },
  },
  watch: {
    duplicateIdx(val) {
      const input = this.$refs.nameInput ? this.$refs.nameInput[0] : undefined;
      if (input) {
        const idx = this.roles.findIndex(role => role.editMode);
        if (val !== -1 && val !== idx) {
          input.dispatchEvent(event.createEvent('tooltip-show'));
          this.isNameTooltipShown = true;
        } else {
          input.dispatchEvent(event.createEvent('tooltip-hide'));
          this.isNameTooltipShown = false;
        }
      }
    },
  },
  data() {
    return {
      pageOption: {
        userList: this.$t('management.privilege_setting'),
      },
      keyword: '',
      roles: [],
      productsList: [],
      showPrivilegeMap: {},
      privilegeMap: {},
      oneInEdit: false,
      editName: '',
      selectAny: false,
      nameTooltip: {
        msg: this.$t('management.err_role_duplicate'),
        eventOnly: true,
        errorType: true,
        alignLeft: true,
      },
      isNameTooltipShown: false,
    };
  },
  methods: {
    checkCmdDependency(cmd, cmds, index, role) {
      const parentCmd = cmd.parent_cmd;
      if (cmd.ischecked) {
        if (parentCmd.length > 0) {
          cmds.forEach((item) => {
            if (parentCmd.indexOf(item.cmd_key) > -1) {
              this.$set(item, 'ischecked', true);
            }
          });
        }
      } else {
        cmds.forEach((item) => {
          if (item.parent_cmd.indexOf(cmd.cmd_key) > -1) {
            this.$set(item, 'ischecked', false);
          }
        });
      }
      const privilegeList = this.showPrivilegeMap.concat();
      this.showPrivilegeMap = [];
      this.$set(privilegeList[index], 'sub_cmd', cmds);
      this.showPrivilegeMap = privilegeList;
      // let selectAny = false;
      // this.showPrivilegeMap.forEach((val) => {
      //   val.sub_cmd.forEach((item) => {
      //     if (item.ischecked) selectAny = true;
      //   });
      // });
      // this.selectAny = selectAny;
      this.checkSelectAny(role);
    },
    checkSelectAny(role) {
      // debugger;
      let selectAny = false;
      this.showPrivilegeMap.forEach((val) => {
        val.sub_cmd.forEach((item) => {
          if (item.ischecked) selectAny = true;
        });
      });
      if (role && role.productPrivileges) {
        role.productPrivileges.forEach((prod) => {
          if (prod.ischecked) selectAny = true;
        });
      }
      this.selectAny = selectAny;
    },
    deleteRolePop(role) {
      const that = this;
      that.$popWarn({
        data: {
          msg: that.$t('privileges.check_delete', { role: role.name }),
        },
        callback: {
          ok() {
            that.deleteRole(role);
          },
        },
      });
    },
    goUserList() {
      this.$router.push('/manage/enterprise-user-list');
    },
    deleteRole(role) {
      const that = this;
      that.$startPageLoading();
      return that.$api.deleteEnterpriseRole(that.enterpriseID, role.uuid)
      .then(() => that.loadRoles())
      .finally(() => {
        that.$emit('endLoading');
      });
    },
    addRole() {
      const that = this;
      // always reset edit role
      that.editName = '';
      that.showPrivilegeMap.forEach((cmds) => {
        cmds.sub_cmd.forEach((cmd) => {
          cmd.ischecked = false;
        });
      });

      const productPrivileges = [];
      this.productsList.forEach((prod) => {
        productPrivileges.push({
          code: prod.code,
          name: prod.name,
          ischecked: false,
        });
      });

      if (that.roles.length > 0 && that.roles[0].uuid === '') {
        return;
      }

      that.roles.unshift({
        uuid: '',
        name: '',
        privileges: [],
        productPrivileges,
        editMode: true,
      });
      that.oneInEdit = true;
    },
    editRole(role) {
      const that = this;
      role.editMode = true;
      that.oneInEdit = true;
      that.editName = role.name;
      let selectAny = false;
      // set checked property depend on the role privileges
      that.showPrivilegeMap.forEach((moduleobj) => {
        moduleobj.sub_cmd.forEach((cmd) => {
          if (role.privileges && role.privileges.length) {
            cmd.ischecked = role.privileges.indexOf(cmd.cmd_key) > -1;
            if (cmd.ischecked) selectAny = true;
          }
        });
      });
      this.selectAny = selectAny;
      that.$forceUpdate();
    },
    closeEditRole(role, save) {
      const that = this;
      if (save) {
        const privilegeData = {};
        that.showPrivilegeMap.forEach((cmds) => {
          cmds.sub_cmd.forEach((cmd) => {
            if (cmd.ischecked) {
              if (privilegeData[cmd.code]) {
                privilegeData[cmd.code].push(cmd.cmd);
              } else {
                privilegeData[cmd.code] = [cmd.cmd];
              }
            }
          });
        });

        const productData = [];
        role.productPrivileges.filter(prod => prod.ischecked).forEach((item) => {
          productData.push(item.code);
        });

        that.$startPageLoading();
        let promise;
        const options = {
          name: that.editName,
          privileges: privilegeData,
          products: productData,
        };
        if (role.uuid && role.uuid !== '') {
          promise = that.$api.updateEnterpriseRole(that.enterpriseID, role.uuid, options);
        } else {
          if (that.roles.map(r => r.name).indexOf(that.editName) >= 0) {
            that.$refs.nameInput[0].dispatchEvent(event.createEvent('tooltip-show'));
            that.$emit('endLoading');
            return;
          }
          promise = that.$api.addEnterpriseRole(that.enterpriseID, options);
        }

        promise
        .finally(() => {
          that.loadRoles();
          that.$emit('endLoading');
        });
      } else if (role.uuid === '') {
        that.roles.shift();
      }
      that.oneInEdit = false;
      role.editMode = false;
      that.$forceUpdate();
    },
    loadRoles() {
      const that = this;
      that.$startPageLoading();
      that.roles = [];
      return that.$api.getEnterpriseRoles(that.enterpriseID)
      .then((roles) => {
        that.roles = roles;
        that.roles.forEach((role) => {
          role.editMode = false;
          // 初始化模块权限
          // const rolePrivileges = [];
          // Object.keys(role.privileges).forEach((key) => {
          //   const hasPrivArr = role.privileges[key];
          //   hasPrivArr.forEach((action) => {
          //     rolePrivileges.push(`${key}_${action}`);
          //   });
          // });
          // role.rolePrivileges = rolePrivileges;
          // 初始化产品权限
          // role.products = ['bf', 'ccbot', 'nlu'];
          const productPrivileges = [];
          this.productsList.forEach((prod) => {
            productPrivileges.push({
              code: prod.code,
              name: prod.name,
              ischecked: role.products && role.products.length ?
              role.products.indexOf(prod.code) !== -1 : false,
            });
          });
          role.productPrivileges = productPrivileges;
        });
      })
      .finally(() => {
        that.$emit('endLoading');
      });
    },
    loadProducts() {
      return this.$api.getProducts().then((res) => {
        this.productsList = res;
      });
    },
    setUpModuleList() {
      const that = this;
      const originList = [...that.privilegeList];
      const tempList = [];
      originList.forEach((item) => {
        if (item.cmd_key !== 'kg_data_manage') {
          tempList.push(item);
        } else {
          // hack，暂时隐藏kg中部分权限
          let tempSubList = JSON.parse(JSON.stringify(item.sub_cmd));
          tempSubList = tempSubList.filter(sub => sub.cmd_key !== 'kg_test_report_delete'
          && sub.cmd_key !== 'kg_audit_manage_delete'
          && sub.cmd_key !== 'kg_audit_manage_import');
          item.sub_cmd = tempSubList;
          tempList.push(item);
        }
      });
      // debugger;
      that.showPrivilegeMap = tempList;
      that.showPrivilegeMap.forEach((cmds) => {
        cmds.sub_cmd.forEach((cmd) => {
          cmd.ischecked = false;
        });
      });
    },
  },
  mounted() {
    this.loadProducts()
    .then(this.loadRoles())
    .then(this.setUpModuleList());
  },
};
</script>

<style lang="scss" scoped>
.card {
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
  .back-button {
    position: absolute;
    right: 20px;
    top: 20px;
  }

  .nav-bar {
    flex: 0 0 60px;
  }

  .page {
    flex: 1;
    display: flex;
    flex-direction: column;
    @include auto-overflow();
    @include customScrollbar();
    .commands {
      flex: 0 0 auto;
    }
    .role-list {
      flex: 1;
      height: calc(100% - 128px);

      display: flex;
      flex-direction: column;
      padding: 0 20px;
      padding-top: 20px;
    }
  }
}

.role-card {
  background-color: #ffffff;
  border: solid 1px $color-borderline;
  border-radius: 4px;
  &.edit-mode {
    box-shadow: 0 0 14px 0 rgba(0, 0, 0, 0.2);
  }
  margin-bottom: 20px;

  display: flex;
  flex-direction: column;
  .card-title {
    flex: 0 0 auto;
    padding: 8px 10px;
    background-color: #f8f8f8;
    border-bottom: solid 1px $color-borderline;
    border-top: 0px;

    display: flex;
    justify-content: space-between;
    align-items: center;
    .title-text {
      @include font-16px();
    }
    .title-action {
      display: flex;
      .action {
        @include click-button();
        color: #1875f0;
        &.delete {
          color: #f76260;
        }
        &:not(:first-child) {
          margin-left: 12px;
        }
      }
    }
  }
  .card-content {
    flex: 1;
    display: flex;
    @include auto-overflow-X();
    @include customXScrollbar();
    @include font-14px();
    color: #666666;
    .priv-col {
      flex: 1 0 120px;
      display: flex;
      flex-direction: column;
      .priv-title {
        flex: 0 0 auto;
        margin: 0 10px;
        padding: 10px 0;
        border-bottom: solid 1px $color-borderline;
        color: #666666;
        @include font-14px();
      }
      .priv-list {
        padding: 10px;
        .priv-item {
          display: flex;
          align-items: center;
          white-space: nowrap;
          .item-text {
            margin-left: 5px;
            @include click-button();
          }
        }
      }
    }
  }
}
</style>
