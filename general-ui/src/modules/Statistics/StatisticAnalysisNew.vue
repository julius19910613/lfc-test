<template>
  <div class="statistic-analysis">
      <div class="tab-box">
          <div class='nav'>
            <nav-bar :options="pageMap" v-model="currentPage"/>
        </div>
      </div>
    <div class="card h-fill w-fill">
      <div class='content-title'>
            <div class="title-text">{{ pageMap[currentPage] }}</div>
        </div>
      <div class="filter" v-if="showDimension">
        <div class="title">{{$t('statistics.selection')}}</div>
        <label-switch class="switch"
          :options="tagTypes"
          v-model="selectTag" @change="setUpDimensionAndReload"></label-switch>
      </div>
      <div class="filter">
        <div class="title">{{$t('statistics.time')}}</div>
        <label-switch class="switch" :options="timeOption" v-model="dayRange" @change="setUpTimeAndReload"></label-switch>
        <template @click="chartInfo.param.days = -1">
            <el-date-picker
                size="mini"
                v-model="rangeDate"
                type="daterange"
                range-separator="-"
                :start-placeholder="$t('general.start_date')"
                :end-placeholder="$t('general.end_date')"
            >
        </el-date-picker>
        </template>
        <!-- <text-button v-if="canExport" class="export-button"
        @click="doExport">{{ $t('general.export') }}</text-button> -->
      </div>
      <div class="chart-container" v-if="hasChart">
        <chart
          :type="currentChartType"
          :height=200
          :handler="chartHandler"
          :keyMap="currentKeyMap"
          :name-key="currentNameKey"
          :dayRangeType="dayRange"></chart>
      </div>
      <div class="table-container">
        <!-- <general-table
          class="statistic-table"
          auto-height show-empty
          :table-data="tableData" :table-header="tableHeader" /> -->
          <el-table
            :key="dataTableKey"
            ref="staticTable"
            class="emotibot"
            :data="tableData"
            height="20vh"
            style="width: 100%"
            :emptyText="$t('general.no_data')"
          >
            <template v-if="currentPage === 'visitTime'">
              <el-table-column
                prop="time_txt"
                label="统计项"
                show-overflow-tooltip
              >
              </el-table-column>
              <el-table-column
                prop="total_asks"
                label="搜索量"
                show-overflow-tooltip
              >
              </el-table-column>
              <el-table-column
                prop="unique_users"
                label="独立用户数"
                show-overflow-tooltip
              >
              </el-table-column>
            </template>
            <template v-if="currentPage === 'topHot'">
              <el-table-column
                prop="question"
                label="搜索内容"
                show-overflow-tooltip
              >
              </el-table-column>
              <el-table-column
                prop="q"
                label="搜索量"
                show-overflow-tooltip
              >
              </el-table-column>
            </template>
            <template v-if="currentPage === 'topUnused'">
              <el-table-column
                prop="question"
                label="搜索无结果内容"
                show-overflow-tooltip
              >
              </el-table-column>
              <el-table-column
                prop="q"
                label="搜索量"
                show-overflow-tooltip
              >
              </el-table-column>
            </template>

            <!-- <el-table-column
                v-for="(item, index) in tableHeader"
                :fixed="index === 0"
                :key="index"
                :prop="item.key"
                :label="item.text"
                show-overflow-tooltip
                min-width="150"
            >
            </el-table-column> -->

          </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import { mapGetters } from 'vuex';
import moment from 'moment';
import DatePicker from '@/components/DateTimePicker/DatePicker';
import tagAPI from '@/api/tagType';
import auditAPI from '@/api/audit';
import misc from '@/utils/js/misc';
import api from './_api/statistic';

let chartLoaded = false;

export default {
  privCode: 'statistic_analysis',
  components: {
    chart: () => import('./_components/Charts').then((data) => {
      chartLoaded = true;
      return data;
    }),
    DatePicker,
  },
  api: [api, tagAPI, auditAPI],
  data() {
    const latestDate = new Date();
    const earliestDate = new Date();
    latestDate.setDate(latestDate.getDate());
    earliestDate.setDate(earliestDate.getDate() - 365);
    return {
      dataTableKey: '',
      pageMap: {
        visitTime: `${this.$t('statistics.visit_record')}(${this.$t('statistics.time')})`,
        topHot: `${this.$t('statistics.hot_question')} Top 100`,
        topUnused: `${this.$t('statistics.failed_question')} Top 100`,
        // topUnresolved: `${this.$t('statistics.unresolve_question')} Top 20`,
      },
      pageSetting: {
      },
      currentPage: 'visitTime',
      currentChartType: 'line',
      tableHeader: [],
      tableData: [],

      chartData: [],
      chartHandler: new Vue(),

      startDate: new Date(latestDate),
      endDate: new Date(latestDate),
      rangeDate: [new Date(latestDate), new Date(latestDate)],
      latestDate,
      earliestDate,
      timeOption: [
        {
          text: `1${this.$t('statistics.day')}`,
          val: 1,
        },
        {
          text: `7${this.$t('statistics.day')}`,
          val: 7,
        },
        {
          text: `30${this.$t('statistics.day')}`,
          val: 30,
        },
        {
          text: `${this.$t('general.custom')}`,
          val: -1,
        },
      ],
      tagTypes: [],
      selectTag: '',
      dayRange: -1,
    };
  },
  computed: {
    ...mapGetters([
      'robotID',
    ]),
    canExport() {
      return this.$hasRight('export');
    },
    hasChart() {
      return this.pageSetting[this.currentPage] ?
        this.pageSetting[this.currentPage].hasChart : false;
    },
    currentKeyMap() {
      return this.pageSetting[this.currentPage] && this.pageSetting[this.currentPage].chartKeyMap ?
        this.pageSetting[this.currentPage].chartKeyMap : {};
    },
    currentNameKey() {
      return this.pageSetting[this.currentPage] && this.pageSetting[this.currentPage].chartNameKey ?
        this.pageSetting[this.currentPage].chartNameKey : '';
    },
    showDimension() {
      return this.pageSetting[this.currentPage] && this.pageSetting[this.currentPage].hasDimension ?
        this.pageSetting[this.currentPage].hasDimension : false;
    },
  },
  methods: {
    doExport() {
      const that = this;

      const tableData = that.tableData;
      const tableHeader = that.tableHeader;

      let csvData = '';
      csvData += `${tableHeader.map(header => header.text.replace('"', '""')).join(',')}\n`;
      csvData += tableData.map(data => tableHeader.map((header) => {
        if (data[header.key] !== undefined) {
          return `"${data[header.key].toString().replace('"', '""')}"`;
        }
        return '';
      }).join(',')).join('\n');

      const param = that.pageSetting[that.currentPage].param;
      const name = that.pageMap[that.currentPage];
      const blobData = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvData], { type: 'text/csv' });
      const module = 'statistic-analysis';
      let filename = `${name}-${param.t1}-${param.t2}.csv`;

      if (that.showDimension) {
        const idx = that.tagTypes.findIndex(t => t.val === that.selectTag);
        if (idx >= 0) {
          filename = `${name}-${param.t1}-${param.t2}-${that.tagTypes[idx].text}.csv`;
        }
      }

      this.$api.auditExportLog({
        module,
        filename,
      }).then(() => {
        misc.downloadRawFile(blobData, filename);
      }, () => {
        // that.$popErrorWindow(that.$t('error_msg.export_fail'), err);
        that.$message({
          message: that.$t('error_msg.export_fail'),
          type: 'error',
          showClose: true,
        });
      });
    },
    setUpDimensionAndReload(tagType) {
      const that = this;
      const currentPageConfig = that.pageSetting[that.currentPage];
      currentPageConfig.param.category = tagType;
      that.reload();
    },
    setUpTimeAndReload(day) {
      const that = this;
      if (day === -1) {
        return;
      }
      const now = new Date();
      const endDate = new Date();
      const startDate = new Date();
      endDate.setDate(now.getDate() - 1);
      startDate.setDate(now.getDate() - day);
      that.rangeDate = [startDate, endDate];
    //   that.$refs.start.$emit('setDate', startDate);
    //   that.$refs.end.$emit('setDate', endDate);
      that.reload();
    },
    setCustomTimeAndReload(changeType) {
      this.fixTimeRange(changeType);
      this.reload();
    },
    reload() {
      const that = this;

      const currentPageConfig = that.pageSetting[that.currentPage];
      currentPageConfig.param.t1 = moment(that.startDate).format('YYYYMMDD');
      currentPageConfig.param.t2 = moment(that.endDate).format('YYYYMMDD');
      that.switchToPage(that.currentPage);
      this.dataTableKey = new Date().getTime().toString();
      this.$refs.staticTable.doLayout();
      this.$nextTick(() => {
        console.log('do layout');
        this.dataTableKey = new Date().getTime().toString();
        this.$refs.staticTable.doLayout();
      });
    },
    fixTimeRange(changeType) {
      const that = this;
      if (that.startDate > that.endDate) {
        if (changeType === 'start') {
          that.$refs.end.$emit('setDate', that.startDate);
        } else {
          that.$refs.start.$emit('setDate', that.endDate);
        }
      }
      const diffDay = ((that.endDate - that.startDate) / 86400000) + 1;
      const today = new Date();
      if ([1, 7, 30].indexOf(diffDay) < 0) {
        that.dayRange = -1;
      } else if (diffDay === 1 && that.endDate.getDate() === today.getDate()) {
        that.dayRange = -1;
      } else {
        that.dayRange = diffDay;
      }
    },
    setUpPage() {
      const that = this;
      that.pageSetting = {
        visitTime: {
          hasChart: true,
          chartKeyMap: {
            total_asks: '搜索量',
            // conversations: that.$t('statistics.session_num'),
            unique_users: that.$t('statistics.unique_user'),
          },
          chartNameKey: 'time_txt',
          chartType: 'line',
          api: this.$api.getVisitStats2,
          param: {
            days: 1,
            type: 'time',
          },
        },
        visitDimension: {
          hasChart: true,
          hasDimension: true,
          chartKeyMap: {
            total_asks: that.$t('statistics.total_asks_num'),
          },
          chartNameKey: 'name',
          chartType: 'bar',
          api: this.$api.getVisitStats2,
          param: {
            days: 1,
            type: 'barchart',
            filter: 'category',
            category: '',
          },
        },
        topHot: {
          api: this.$api.getTopQuestions2,
          param: {
            days: 1,
            type: 'top',
            top: 100,
          },
          tableHeader: [
            {
              key: 'question',
              text: that.$t('statistics.standard_question'),
              width: '80%',
            },
            {
              key: 'q',
              text: that.$t('statistics.count'),
              width: '20%',
            },
          ],
        },
        topUnused: {
          hasChart: false,
          api: this.$api.getTopQuestions2,
          param: {
            days: 1,
            type: 'unused',
            top: 100,
          },
          tableHeader: [
            {
              key: 'question',
              text: that.$t('statistics.user_question'),
              width: '55%',
            },
            {
              key: 'q',
              text: that.$t('statistics.count'),
              width: '15%',
            },
            {
              key: 'first_time_txt',
              text: that.$t('statistics.question_first_time'),
              width: '15%',
            },
            {
              key: 'last_time_txt',
              text: that.$t('statistics.question_last_time'),
              width: '15%',
            },
          ],
        },
        // topUnresolved: {
        //   hasChart: false,
        //   api: this.$api.getTopQuestions2,
        //   param: {
        //     days: 1,
        //     type: 'unsolved',
        //   },
        //   tableHeader: [
        //     {
        //       key: 'question',
        //       text: that.$t('statistics.user_question'),
        //       width: '25%',
        //     },
        //     {
        //       key: 'count',
        //       text: that.$t('statistics.count'),
        //       width: '10%',
        //     },
        //     {
        //       key: 'std_q',
        //       text: that.$t('statistics.standard_question'),
        //       width: '25%',
        //     },
        //     {
        //       key: 'score',
        //       text: that.$t('statistics.score'),
        //       width: '10%',
        //     },
        //     {
        //       key: 'answer',
        //       text: that.$t('statistics.answer'),
        //       width: '25%',
        //     },
        //   ],
        // },
      };
      that.chartHandler = new Vue();
      this.switchToPage(this.currentPage);
    },
    switchToPage(pageName) {
      const that = this;
      const setting = this.pageSetting[pageName];
      if (setting === undefined) {
        return;
      }
      that.tableData = [];
      that.currentChartType = setting.chartType;

      that.$startPageLoading();
      // that.$api.fetchDimensionList(this.robotID).then((data) => {
      //   that.tagTypes = data.map(d => ({
      //     val: d.type,
      //     text: d.text,
      //   }));
      // })

      setting.param.t1 = setting.param.t1 ? setting.param.t1 : moment(that.startDate).format('YYYYMMDD');
      setting.param.t2 = setting.param.t2 ? setting.param.t2 : moment(that.endDate).format('YYYYMMDD');

      setting.api.call(this, setting.param)
      // .then(() => setting.api.call(this, setting.param))
      .then((rsp) => {
        console.log(rsp);
        that.dataTableKey = new Date().getTime().toString();
        // if (!Array.isArray(rsp.data)) {
        //   rsp.data = [];
        // }
        if (rsp.table_header) {
          let columnNum = rsp.table_header.length;
          if (Array.isArray(rsp.data)) {
            columnNum += 1;
          }
          const width = `${100 / columnNum}%`;
          that.tableHeader = rsp.table_header.map(header => ({
            key: header.id,
            text: header.text,
            width,
          }));
          if (Array.isArray(rsp.data)) {
            that.tableHeader.unshift({
              key: 'name',
              text: '',
              width,
            });
            that.tableData = [];
            rsp.data.forEach((data) => {
              data.q.name = data.name;
              that.tableData.push(data.q);
            });
          } else {
            that.tableData = rsp.data.quantities;
          }
        } else {
          that.tableHeader = setting.tableHeader;
          that.tableData = rsp.data;
        }
      })
      .then(() => {
        that.emitRedraw();
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        that.$emit('endLoading');
      });
    },
    emitRedraw() {
      const that = this;
      if (chartLoaded) {
        that.chartHandler.$emit('redraw', that.tableData);
      } else {
        setTimeout(() => {
          that.emitRedraw();
        }, 200);
      }
    },
  },
  watch: {
    rangeDate() {
      if (this.rangeDate && this.rangeDate.length && this.rangeDate.length > 0) {
        this.startDate = this.rangeDate[0];
        this.endDate = this.rangeDate[1];
        this.reload();
      }
    },

    currentPage() {
      if (this.currentPage === 'visitDimension' && this.tagTypes.length > 0) {
        this.pageSetting.visitDimension.param.category = this.tagTypes[0].val;
        this.selectTag = this.tagTypes[0].val;
      }
      this.reload();
    },
  },
  mounted() {
    this.setUpPage();
  },
  created() {
    const that = this;
    this.$api.fetchDimensionList(this.robotID).then((data) => {
      that.tagTypes = data.map(d => ({
        val: d.type,
        text: d.text,
      }));
    }).then(() => {
      if (that.tagTypes.length > 0) {
        that.pageMap = {
          visitTime: '搜索数据统计',
          topHot: '热门搜索统计',
          topUnused: '搜索无结果统计',
        };
      }
      // that.setUpPage();
    });
  },
};
</script>

<style lang="scss" scoped>
@import 'styles/variable.scss';

$function-header-font-size: 16px;

#app-page {
    .app-body {
        padding: 0px;
        .card.w-fill {
            width: calc(100% - 20px);
            margin: 10px;
        }
        .card.h-fill {
            height: calc(100% - 60px);
        }
    }
}

.content-title {
    height: 60px;
    padding: 0px 20px;
    display: flex;
    flex-direction: row;
    .title-text {
        margin-top: 20px;
        height:28px;
        font-size:16px;
        font-family:PingFangSC-Regular,PingFang SC;
        font-weight:400;
        color:rgba(51,51,51,1);
        line-height:28px;

    }
}


.statistic-analysis {
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

.card {
  display: flex;
  flex-direction: column;
  .nav {
    flex: 0 0 auto;
    margin-bottom: 20px;
  }
  .filter {
    flex: 0 0 auto;
    padding: 0px 20px 10px 20px;

    display: flex;
    align-items: center;

    .title {
      @include font-14px();
      margin-right: 10px;
    }
    .switch {
      margin-right: 10px;
    }
    .export-button {
      margin-left: 20px;
    }
  }
  .chart-container {
    flex: 0 0 200px;
    height: 200px;
    margin-top: 10px;
  }
  .table-container {
    flex: 1;
    display: flex;
    margin-top: 10px;
    flex-direction: column;
    @include auto-overflow();
  }
}

</style>
