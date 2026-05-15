<template>
  <div>
    <div class="robot-list-header">
      <el-tabs v-model="activeName"  class="emotibot function-setting-tab">
        <el-tab-pane name="robotList" :label="$t('management.table_robot_list')"></el-tab-pane>
        <el-tab-pane name="robotGroup" :label="$t('management.group_manage')"></el-tab-pane>
        <!-- <el-tab-pane name="enterpriseSetting" :label="$t('management.enterprise_setting')"></el-tab-pane> -->
      </el-tabs>
    </div>
    <div class="card h-fill w-fill">
      <!-- <nav-bar class='nav-bar' v-model="currentPage" :options="getNavbarOption()" @search="doSearch" showSearch></nav-bar> -->
      <div class="page" v-show="activeName === 'robotList'">
        <div class="top-btn-groups" v-if="isAdmin">
          <!-- <span>hi, {{userInfo.display_name}}，您已创建{{filteredRobots.length}} 个机器人</span> -->
          <span>{{ $t('management.total_robot_message', {name: userInfo.display_name,
            num: filteredRobots.length }) }}</span>
          <div class="top-right-operate">
            <el-input v-show="!showTemplate" 
              v-model="keyword" 
              :placeholder="$t('management.robot_list_placeholder')" 
              size="mini" 
              suffix-icon="el-icon-search" 
              @keyup.enter="handleFilterRobot">
            </el-input>
            <upload-file v-show="!showTemplate" @handleUpload="handleUpload" :fileType="fileType" :btnTxt="btnTxt"></upload-file>
            <el-button size="mini" @click="showTemplate = true" v-if="!showTemplate"><i class="icon-import-template"></i>&nbsp;&nbsp;{{$t('management.robot_template')}}</el-button>
            <el-button size="mini" @click="showTemplate = false" v-else>{{$t('management.return_to_robot_list')}}</el-button>
          </div>
        </div>
        <div class="local-skill-list" v-show="!showTemplate">
          <div class="list-body">
            <emoti-card :clickCard="true" :title="$t('management.create_robot')" type="new" @click="createRobot"/>
            <div class="is-upload-ing" v-if="importStatus && !showTemplate">
              <p class="current-status">{{$t('management.import_robot_running')}}</p>
              <p class="need-time">{{$t('management.import_robot_time')}}</p>
            </div>
            <emoti-card
              :clickCard="true"
              v-for="robot in filteredRobots" :key="robot.id"
              @click="goRobot(robot)"
              :showStatus="false"
              :title="robot.name"
              :subTitle="robot.languageName?robot.languageName:$t('robot_config.language')"
              :text="robot.description || '-'"
              :cardData="robot"
              :actions="btnGroup">
            </emoti-card>
          </div>
        </div>
        <div class="local-skill-list" v-show="showTemplate">
          <div class="list-body">
            <div class="is-upload-ing" v-if="importStatus && showTemplate">
              <p class="current-status">{{$t('management.import_robot_running')}}</p>
              <p class="need-time">{{$t('management.import_robot_time')}}</p>
            </div>
            <emoti-card
              v-for="(robot, idx) in templateList" :key="idx"
              :showStatus="false"
              :title="robot.template_name"
              withIcon
              iconStyle="background-image:url('/static/with_icon_template.svg');background-size: 30px;"
              :tags="robot.tagsList"
              :text="robot.description"
              :cardData="robot">
                <div slot="after" class="create-from-template">
                  <el-button @click="handleTemplateCreate(robot)" size="mini"><span class="icon-import-template"></span> {{$t('management.create_from_template')}}</el-button>
                </div>
            </emoti-card>
          </div>
        </div>
        <!-- <ul class="robot-card-box">
          <li class="add-robot-card">
            <img src="../../assets/images/add-bot-icon.svg" @click="createRobot">
            <span>{{ $t('management.create_robot') }}</span>
          </li>
          <li v-if="importStatus">
            <div class="is-upload-ing">
              <p class="current-bot-name">小竹子对话机器人</p>
              <p class="current-status">机器人正在导入中...</p>
              <p class="need-time">预计需要10分钟</p>
            </div>
          </li>
          <li v-for="robot in filteredRobots" :key="robot.id">
            <div class="show-bot-message" @click="goRobot(robot)">
              <div class="bot-message-top">
                <i class="language-type">{{robot.languageName?robot.languageName:$t('robot_config.language')}}</i>
                <span class="name">{{ robot.name }}</span>
                <el-dropdown>
                  <span class="el-dropdown-link">
                    <img src="../../assets/images/operate-select.svg">
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item  v-if="isAdmin"><p @click="editName(robot)"><span class="icon-edit-robot"></span>&nbsp;&nbsp;名称编辑</p></el-dropdown-item>
                    <el-dropdown-item><p @click="handleExport(robot)"><span class="icon-export-robot"></span>&nbsp;&nbsp;机器人导出</p></el-dropdown-item>
                    <el-dropdown-item><p @click="popDelete(robot)"><span class="icon-delete-robot"></span>&nbsp;&nbsp;删除</p></el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
              <p class="bot-description">{{ robot.description || $t('management.no_description') }}</p>
            </div>
          </li>
        </ul> -->
      </div>
      <div class="page" v-show="activeName === 'robotGroup'">
        <div class="top-btn-groups">
          <div class="top-right-operate">
            <!-- <el-button size="mini" @click="popGroupEditor()">{{ $t('management.create_group') }}</el-button> -->
            <el-input v-model="keyword" 
              :placeholder="$t('management.robot_group_placeholder')" 
              size="mini" 
              suffix-icon="el-icon-search" 
              @keyup.enter="handleFilterRobot">
            </el-input>
          </div>
        </div>
        <div class="group-list">
             <emoti-card
                type="new"
                :title="this.$t('management.create_group')"
                @click="popGroupEditor()"
             >
             </emoti-card>
             <emoti-card
              withIcon
              iconStyle="background-image:url('/static/images/robot_group.svg');background-size: 30px;"
              v-for="(group, index) in filteredGroup" :key="index"
              :showStatus="false"
              :title="group.name"
              :tags="generateGroupTags(group.apps)"
              :cardData="group"
              :actions="groupBtnGroup">
            </emoti-card>
          <!-- <el-table
            :data="filteredGroup"
            style="width: 100%">
            <el-table-column
              prop="name"
              :label="$t('management.table_group_name')">
            </el-table-column>
            <el-table-column
              :label="$t('management.list_robot_name')">
              <template slot-scope="scope">
                <span v-for="app in scope.row.apps" :key="app.id">{{ app.name }}</span>/
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('management.operate')"
              width="120">
              <template slot-scope="scope">
                <emoti-icon name="icon-edit-pen" :size="16" @click="popGroupEditor(scope.row)"></emoti-icon>
              </template>
            </el-table-column>
          </el-table> -->
          <!-- <div v-for="group in filteredGroup" :key="group.id" class="group-card">
            <div class="card-title">
              <div class="card-title-text">
                {{ group.name }}
              </div>
              <div class="card-title-edit" @click="popGroupEditor(group)">
                <icon :size=12 icon-type="edit_blue"></icon>
              </div>
            </div>
            <div class="card-content">
              <tag class="tags" v-for="app in group.apps" :key="app.id">{{ app.name }}</tag>
            </div>
          </div> -->
        </div>
      </div>
      <div class="page" v-show="activeName === 'enterpriseSetting'">
        <div class="content">
          <div class="title-row">
            {{ $t('management.enterprise_icon_setting') }}
          </div>
          <icon-setting
            class="icon-enterprise-setting"
            :name="$t('management.enterprise_lu_icon')"
            icon-path="/static/enterprise_icon_ex.png"
            :upload-info="$t('management.enterprise_lu_icon_info')"
            @upload="handleIconUpload('app', $event, 'appLogoSetting')"
            @remove="handleIconRemove('app')"
            ref="appLogoSetting">
            <template slot="current" v-if="appLogoPath !== ''">
              <div class="app-logo" ref="appLogo"></div>
            </template>
          </icon-setting>
          <icon-setting
            class="icon-enterprise-setting"
            :name="$t('management.browser_page_icon')"
            icon-path="/static/browser_icon_ex.png"
            :upload-info="$t('management.browser_page_icon_info')"
            current-name="123"
            @upload="handleIconUpload('favicon', $event, 'faviconSetting')"
            @remove="handleIconRemove('favicon')"
            @updateName="handleNameUpdate"
            ref="faviconSetting">
            <template slot="current" v-if="faviconLogoPath !== ''">
              <div class="favicon-bg">
                <div class="favicon-content">
                  <div class="favicon-logo" ref="faviconLogo"></div>
                  <div>
                    {{ $t('general.system_name_default') }}
                  </div>
                </div>
              </div>
            </template>
          </icon-setting>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex';
import event from '@/utils/js/event';
import misc from '@/utils/js/misc';
import NavBar from '@/components/NavigationBar';
import IconSetting from '@/manage-modules/_components/IconSettingRow';
import systemAPI from '@/api/system';
import RobotForm from './_components/RobotAddForm';
import CommandRow from '../_components/CommandRow';
import robotAPI from './../_api/robot';
import roleAPI from '../_api/role';
import userAPI from '../_api/user';
import GroupAPI from '../_api/group';
import kgAPI from '../../modules/KnowledgeGraph/_api/knowledgeGraph';
import RobotDeleteForm from './_components/RobotDeleteForm';
import mixin from './_store/mixin';
import UploadFile from '../../modules/Material/_components/UploadFile';
import GroupAddForm from './_components/GroupAddForm';
import GroupDeleteForm from './_components/GroupDeleteForm';

const defaultPath = '/statistic-dash';
export default {
  privCode: 'manage_robot',
  components: {
    NavBar,
    CommandRow,
    UploadFile,
    IconSetting,
  },
  api: [robotAPI, roleAPI, userAPI, kgAPI, GroupAPI, systemAPI],
  mixins: [mixin],
  computed: {
    ...mapGetters([
      'userInfo',
      'enterpriseID',
      'robotList',
      'userRoleMap',
      'licenseInfo',
    ]),
    isAdmin() {
      return this.userInfo.type < 2;
    },
    filteredRobots() {
      if (this.keyword === '') {
        return this.robotList;
      }
      return this.robotList.filter(robot =>
        robot.name.indexOf(this.keyword) >= 0 ||
        (robot.description && robot.description.indexOf(this.keyword) >= 0));
    },
    isLicenseExpired() {
      if (!this.licenseInfo.license_exist && !this.licenseInfo.license_Probation) {
        /* eslint-disable */
        this.$alert(this.$t('license.license_probation_expired'), this.$t('license.license_popup_title'),{
          callback: action => {},
        });
        /* eslint-disable */
        return true;
      }
      return false;
    },
    filteredGroup() {
      if (this.keyword === '') {
        return this.robotGroups;
         console.log(thisl.robotGroups);
      }
      return this.robotGroups.filter(group => group.name.indexOf(this.keyword) >= 0);
    },
  },
  data() {
    return {
      appLogoPath: '',
      faviconLogoPath: '',
      templateList: [],
      showTemplate: false,
      currentPage: 'robotList',
      keyword: '',
      robots: [],
      robotNameTooltip: {
        msg: '',
        eventOnly: true,
        alignLeft: true,
        top: -10,
        left: 80,
      },
      btnTxt: this.$t('management.import_robot'),
      fileType: 'zip',
      importStatus: false,
      exportStatus: false,
      importId: null,
      groupBtnGroup: [
          {
          icon:'icon-delete',
          className:'hover-red',
          label: this.$t('general.delete'),
          onClick:(data)=>{
            this.popDeleteGroup(data);
          }
        },
          {
          icon:'icon-edit-pen',
          label: this.$t('general.edit'),
          onClick:(data)=>{
            this.popGroupEditor(data)
          }
        },
      ],
      btnGroup: [
        {
          icon:'icon-edit-pen',
          className:'danger',
          label: this.$t('general.edit'),
          onClick:(data)=>{
            this.editName(data);
          }
        },
        {
          icon:'icon-export',
          label: this.$t('general.export'),
          onClick:(data)=>{
            this.handleExport(data);
          }
        },
        {
          icon:'icon-delete',
          className:'danger',
          label: this.$t('general.delete'),
          onClick:(data)=>{
            this.popDelete(data);
          }
        },
        {
          icon:'icon-view',
          label: this.$t('general.view'),
          onClick:(data)=>{
            this.goRobot(data);
          }
        },
      ],
      activeName: 'robotList',
      robotGroups: [],
      keyword: '',
    };
  },
  created() {
    this.importId  = localStorage.getItem('robotImportId');
    if (this.importId) {
      this.importStatus = true;
      this.checkImportStatus(this.importId);
    }
  },
  watch: {
    currentPage(val) {
      if (val === 'enterpriseSetting') {
        this.$router.push('enterprise-setting');
      }
    },
  },
  methods: {
    ...mapMutations([
      'setRobot',
      'setRobotList',
      'setUserRole',
      'setCurrentRoute',
    ]),

    generateGroupTags(apps) {
        return apps.map((item) => {
            return item.name;
        })
    },

    handleFilterRobot() {
      if (this.keyword === '') {
        return this.robotList;
      }
      this.filteredRobots =  this.robotList.filter(robot =>
        robot.name.indexOf(this.keyword) >= 0 ||
        (robot.description && robot.description.indexOf(this.keyword) >= 0));
    },
    handleTemplateCreate(robot) {
      if (this.importId) {
        this.$message({
          showClose: true,
          message: this.$t('management.upload_wating'),
          type: 'warning',
        });
        return false;
      }
      const params = {
        templateId: robot.template_id,
      };
      this.$api.createFromTemplate(params)
        .then((res) => {
          localStorage.setItem('robotImportId', res);
          this.importId = res;
          this.importStatus = true;
          this.checkImportStatus(this.importId);
        });
    },
    handleFetchTemplateList() {
      this.$api.fetchTemplateList()
        .then((res) => {
          if (res && res instanceof Array) {
            this.templateList = res;
            this.templateList.map((item) => {
              item.tagsList = [`${this.$t('management.faq_count')}${item.faq_count}`, `${this.$t('management.te_count')}${item.te_count}`];
              return item;
            });
          }
        });
    },
    handleUpload(file) {
      if (this.isLicenseExpired) {
        return;
      }
      if (this.importId) {
        this.$message({
          showClose: true,
          message: this.$t('management.upload_wating'),
          type: 'warning'
        });
        return false;
      }
      this.$api.importRobotFile(file)
        .then((res) => {
          if (res) {
            localStorage.setItem('robotImportId', res);
            this.importId = res;
            this.importStatus = true;
            this.checkImportStatus(this.importId);
          }
        })
        .catch((err) => {});
    },
    checkImportStatus(taskNumber, type) {
      const params = {
        taskNumber,
      };
      this.$api.checkImportStatus(params)
        .then((res) => {
          if (res.status === 'running') {
            this.importStatus = true;
            setTimeout(() => {
              this.checkImportStatus(this.importId);
            }, 1000);
          } else if (res.status === 'success') {
            this.$message({
              showClose: true,
              type: 'success',
              message: this.$t('management.upload_success'),
            });
            this.importStatus = false;
            localStorage.removeItem('robotImportId');
            this.importId = null;
            this.updateRobots();
          } else {
            this.importStatus = false;
            this.importId = null;
            localStorage.removeItem('robotImportId');
            let mgs = '';
            if (res.record && res.record.failed && res.record.failed.length > 0) {
              // mgs = `因${res.record.failed.join(',')}模块导入失败`;
              mgs = this.$t('management.import_moudule_err_msg'
              , { messaeg: es.record.failed.join(',') });
            }
            this.$message({
              message: this.$t('management.import_err_msg', { message: mgs }),
              type: 'warning',
              showClose: true,
            });
          }
        })
        .catch(() => {
          this.importStatus = false;
          this.importId = null;
          localStorage.removeItem('robotImportId');
        });
    },
    handleExport(robot) {
      this.$startPageLoading(this.$t('management.exporting_msg'));
      if (this.exportStatus) {
        // 当前有机器人正在导出请稍等
        this.$message({
          message: this.$t('management.export_wating'),
          type: 'warning',
          showClose: true,
        });
        return false;
      }
      this.exportStatus = true;
      const params = {
        appId: robot.id,
        modules: ['faq', 'te', 'ccs', 'conf', 'intent', 'wordbank', 'kg', 'chat'],
        version: '1.5.0',
        appName: robot.name,
        description: robot.description,
        language: robot.languageId,
      };
      this.$api.exportRobot(params)
        .then((res) => {
          const blob = new Blob([res.data], { type: 'application/zip' });
          const filename = decodeURIComponent(res.headers.filename);
          misc.downloadRawFile(blob, filename);
        })
        .finally(() => {
          this.exportStatus = false;
          this.$emit('endLoading');
        });
    },
    showFullRobotName(e, name, robotId) {
      const that = this;
      if (!misc.isEllipsisActive(e.target)) return;
      that.robotNameTooltip.msg = name;
      that.$refs[robotId][0].dispatchEvent(event.createEvent('tooltip-reload'));
      that.$refs[robotId][0].dispatchEvent(event.createEvent('tooltip-show'));
    },
    hideFullRobotName(e, robotId) {
      const that = this;
      if (!misc.isEllipsisActive(e.target)) return;
      that.$refs[robotId][0].dispatchEvent(event.createEvent('tooltip-hide'));
    },
    doSearch(word) {
      this.keyword = word;
    },
    editName(robot) {
      const that = this;
      if (that.isLicenseExpired) {
        return;
      }
      that.$api.getRobots(that.enterpriseID).then((data) => {
        that.$pop({
          title: that.$t('management.edit_robot'),
          component: RobotForm,
          validate: true,
          extData: {
            name: robot.name,
            description: robot.description,
            existedRobots: data.map(robots => robots.name),
            language: [robot.languageId || '1'],
            edit: true,
          },
          // left_button: {
          //   msg: that.$t('general.delete'),
          //   type: 'error',
          //   closeAfterClick: true,
          //   callback: () => {
          //     that.popDelete(robot);
          //   },
          // },
          callback: {
            ok(retData) {
              that.$api.updateRobot(that.enterpriseID, robot.id, retData)
              .then(() => that.updateRobots())
              .finally(() => {
                that.$emit('endLoading');
              });
            },
          },
        });
      });
    },
    popDelete(robot) {
      const that = this;
      that.$pop({
        title: that.$t('management.delete_robot'),
        component: RobotDeleteForm,
        validate: true,
        extData: {
          name: robot.name,
          description: robot.description,
        },
        callback: {
          ok(reason) {
            that.$api.deleteRobot(that.enterpriseID, robot.id, reason)
              .then(() => that.updateRobots());
            that.$api.deleteKGDataByAppId(robot.id)
          },
        },
      });
    },
    goRobot(robot) {
      const that = this;
      if (that.isLicenseExpired) {
        return;
      }
      const promise = new Promise(r => r());
      promise.then(() => {
        that.setRobot(robot.id);
        localStorage.setItem('currentRoute', 'statistic-dash');
        this.setCurrentRoute('statistic-dash');
      }).then(() => {
        that.$api.initialProperties(robot.id);
        that.$router.push(defaultPath);
        localStorage.setItem('currentRoute', 'statistic-dash');
        this.setCurrentRoute('statistic-dash');
      });
    },
    goGroupList() {
      if (this.isLicenseExpired) {
        return;
      }
      this.$router.push('/manage/robot-group');
    },
    createRobot() {
      const that = this;
      if (that.isLicenseExpired) {
        return;
      }
      that.$api.getRobots(that.enterpriseID).then((data) => {
        that.$pop({
          title: that.$t('management.create_robot'),
          component: RobotForm,
          extData: {
            existedRobots: data.map(robot => robot.name),
            language: [1],
          },
          validate: true,
          callback: {
            ok(retData) {
              that.$startPageLoading();
              that.$api.addRobot(that.enterpriseID, retData, that.userInfo.id)
              .then(() => that.updateRobots())
              .catch((err) => {
                let status = err.response.status;
                let errMsg = err.response.data.ret_msg;
                if (status === 403) {
                  errMsg = that.$t('management.err_add_robot_fail_license');
                }
                that.$notifyFail(`${that.$t('management.err_add_robot_fail')}: ${errMsg}`);
              })
              .finally(() => {
                that.$emit('endLoading');
              });
            },
          },
        });
      });
    },
    updateRobots() {
      const that = this;
      that.$startPageLoading();
      return that.$loadRobotOfUser(that.userInfo).then((robots) => {
        const robotMap = {};
        robots.forEach((robot) => {
          if (robot.app_type === 0 || robot.app_type === undefined) {
            robotMap[robot.id] = robot;
          }
        });
        const generalRobots = robots.filter(s => s.app_type === 0 || s.app_type === undefined);
        that.setRobotList(generalRobots);
      })
      .finally(() => {
        that.$emit('endLoading');
      });
    },
    keywordChange(word) {
      this.keyword = word;
    },
    goRobotList() {
      this.$router.push('/manage/robot-manage');
    },
    getRobotsAndGroups() {
      const that = this;

      let robots = [];
      let groups = [];
      return that.$api.getRobots(that.enterpriseID)
      .then((data) => {
        robots = data;
      })
      .then(() => that.$api.getRobotGroups(that.enterpriseID))
      .then((data) => {
        groups = data;
      })
      .then(() => ({
        groups,
        robots,
      }));
    },
    popGroupEditor(group) {
      // when group is undefined, create new robot group
      const that = this;
      // that.$startPageLoading();
      that.getRobotsAndGroups()
      .then((data) => {
        const option = {
          title: that.$t('management.create_group'),
          component: GroupAddForm,
          validate: true,
          extData: {
            robots: data.robots,
            groups: data.groups.map(g => g.name),
            group,
          },
          callback: {
            ok(retData) {
              that.$startPageLoading();
              let promise;
              if (group === undefined) {
                promise = that.$api.addRobotGroup(that.enterpriseID, retData);
              } else {
                promise = that.$api.updateRobotGroup(that.enterpriseID, group.id, retData);
              }
              promise.finally(() => {
                that.loadGroup();
                that.$emit('endLoading');
              });
            },
          },
        };
        if (group !== undefined) {
          option.title = that.$t('management.edit_group');
        //   option.left_button = {
        //     msg: that.$t('general.delete'),
        //     type: 'error',
        //     closeAfterClick: true,
        //     callback: () => {
        //       that.popDeleteGroup(group);
        //     },
        //   };
        }
        that.$pop(option);
      })
      .finally(() => {
        that.$emit('endLoading');
      });
    },
    popDeleteGroup(group) {
      const that = this;
      that.$pop({
        title: that.$t('management.delete_group'),
        component: GroupDeleteForm,
        validate: true,
        extData: {
          name: group.name,
          description: group.description,
        },
        callback: {
          ok() {
            that.$api.deleteRobotGroup(that.enterpriseID, group.id)
              .then(() => that.loadGroup());
          },
        },
      });
    },
    loadGroup() {
      const that = this;
      that.$startPageLoading();
      that.$api.getRobotGroups(that.enterpriseID).then((groups) => {
        that.robotGroups = groups;
      })
      .finally(() => {
        that.$emit('endLoading');
      });
    },
    handleIconUpload(type, file, refName) {
      this.$api.uploadIcon(type, this.enterpriseID, file).finally(() => {
        this.loadLogos();
        this.$refs[refName].$emit('clearFile');
      });
    },
    handleIconRemove(type) {
      this.$api.deleteIcon(type, this.enterpriseID).finally(() => {
        this.loadLogos();
      });
    },
    handleNameUpdate(name) {
      console.log(name);
    },
    loadLogos() {
      // const that = this;
      // this.$api.getIcon('app', that.enterpriseID).then(() => {
      //   that.appLogoPath = that.$api.getIconURL('app');
      //   that.$refs.appLogoSetting.$emit('showCurrent');
      //   that.$nextTick(() => {
      //     that.$refs.appLogo.style.backgroundImage = `url("${that.appLogoPath}")`;
      //   });
      // }, () => {
      //   that.$refs.appLogoSetting.$emit('hideCurrent');
      // })
      // .finally(() => {
      //   that.$root.$emit('reload-logo');
      // });
      // this.$api.getIcon('favicon', that.enterpriseID).then(() => {
      //   that.faviconLogoPath = that.$api.getIconURL('favicon');
      //   that.$refs.faviconSetting.$emit('showCurrent');
      //   that.$nextTick(() => {
      //     that.$refs.faviconLogo.style.backgroundImage = `url("${that.faviconLogoPath}")`;
      //   });
      // }, () => {
      //   that.$refs.faviconSetting.$emit('hideCurrent');
      // })
      // .finally(() => {
      //   that.$root.$emit('reload-logo');
      // });
    },
  },
  mounted() {
    this.updateRobots();
    this.setRobot('');
    this.loadGroup();
    this.handleFetchTemplateList();
    this.loadLogos();
  },
};
</script>


<style lang="scss">
.hover-red {
    &:hover {
        color: #f67270
    }
}

</style>>

<style lang="scss" scoped>

.group-list {
    padding-left: 20px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    .emoti-card {
        margin: 0 20px 20px 0;
        width: calc(25% - 20px);
        max-width: 600px;
        min-width: 260px;
    }
}
.card {
  display: flex;
  flex-direction: column;

  .nav-bar {
    flex: 0 0 60px;
  }
  .page {
    flex: 1;
  }
}
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
    margin: 0 20px 20px 0;
    width: calc(25% - 20px);
    max-width: 600px;
    min-width: 260px;
  }
}
.icon-import-template {
  display: inline-block;
  width: 15px;
  height: 15px;
  background: url('../../assets/icons/icon-import-template.svg') no-repeat center;
  background-size: contain;
  vertical-align: -3px;
}
.is-upload-ing {
  margin: 0 20px 20px 0;
  width: calc(25% - 20px);
  max-width: 600px;
  min-width: 260px;
  background-color: #fff;
  border-radius: 2px;
  border: 1px solid #e9e9e9;
  padding: 15px;
  text-align: center;
  padding-top: 40px;
  box-sizing: border-box;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  .current-bot-name {
    font-size:14px;
    line-height:26px;
    color:rgba(51,51,51,1);
  }
  .current-status {
    font-size:12px;
    line-height:20px;
    color: #666666;
  }
  .need-time {
    font-size:12px;
    line-height:20px;
    color: #999999;
  }
}
.robot-list-header {
  height: 41px;
  border-bottom: 1px solid #E9E9E9;
  .el-tabs__content {
    display: none;
  }
}
.create-from-template {
  text-align: right;
  font-size: 12px;
}
.page {
  display: flex;
  flex-direction: column;
  @include auto-overflow();
  @include customScrollbar();

  .robot-list {
    flex: 1;
    padding: 20px;
    padding-bottom: 0px;

    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    .robot-card {
      flex: 0 0 380px;
      max-width: 380px;
      height: 135px;
      border-radius: 4px;
      border: 1px solid $color-borderline;
      margin-right: 30px;
      margin-bottom: 20px;
      padding: 20px;
      @include click-button();
      transition: all .2s ease-in-out;
      &:hover {
        box-shadow: 0 4px 9px 0 rgba(115, 115, 115, 0.2), 0 5px 8px 0 rgba(228, 228, 228, 0.5);
        .card-title {
          .card-title-edit {
            visibility: visible;
          }
        }
      }

      display: flex;
      flex-direction: column;
      .card-title {
        flex: 0 0 auto;
        padding-bottom: 10px;
        margin-bottom: 20px;
        box-shadow: inset 0 -1px 0 0 $color-borderline;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;

        display: flex;
        align-items: center;
        .language-content {
          padding: 6px;
          border-radius: 2px;
          background-color:rgba(247,247,247,1);
          color: #666666;
        }
        .card-title-image {
          flex: 0 0 40px;
          height: 40px;
          border-radius: 100px;
          background-color: #ffca43;

          display: flex;
          align-items: center;
          justify-content: center;
        }
        .card-title-text {
          flex: 1;
          font-size: 20px;
          line-height: 24px;
          color: #333333;
          margin: 0 20px;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }
        .card-title-edit {
          flex: 0 0 24px;
          height: 24px;
          visibility: hidden;
          @include click-button();

          display: flex;
          align-items: center;
          justify-content: center;

          &:hover {
            background-color: #f7f7f7;
            border-radius: 12px;
          }
        }
      }
      .card-description {
        @include font-12px();
        color: #666666;
        word-break: break-all;
      }
    }
  }
}
.top-btn-groups {
  padding: 20px 20px 10px;
  box-sizing: border-box;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  display: flex;
  flex-direction: row;
  align-items: center;
  .el-input {
    max-width: 160px;
  }
  .import-robot-btn {
    height: 28px;
    width: 110px;
    line-height: 28px;
  }
}
::v-deep .text-button.primary{
  border-radius:3px!important;
  border:1px solid rgba(219,219,219,1)!important;
  color: #666666!important;
  padding-left: 35px;
  background: #ffffff url('../../assets/icons/data_import.svg') no-repeat 10px center!important;
  margin: 0 10px;
}
.top-right-operate {
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  .icon-import-template {
    display: inline-block;
    width: 16px;
    height: 16px;
    background: url('../../assets/icons/icon-import-template.svg') no-repeat center;
    background-size: contain;
  }
}
.content {
  padding: 20px;
  .title-row {
    @include font-16px();
    margin-bottom: 20px;
    color: #333333;
  }
  .icon-enterprise-setting:not(:last-child) {
    margin-bottom: 80px;
  }
  .app-logo {
    height: 50px;
    width: 150px;
    background-color: $page-menu-color;
    background-size: 150px 50px;
    border: 1px solid #dbdbdb;
  }
  .favicon-bg {
    width: 290px;
    height: 76px;
    background-color: transparent;
    background-size: 290px 76px;
    background-image: url("/static/favicon_bg.png");
    position: relative;

    .favicon-content {
      position: absolute;
      top: 16px;
      left: 19px;

      display: flex;
      align-items: center;
      .favicon-logo {
        height: 20px;
        width: 20px;
        margin-right: 5px;
        background-color: transparent;
        background-size: 20px 20px;
      }
    }
  }
}
</style>
