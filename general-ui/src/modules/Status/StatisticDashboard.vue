<template>
  <div id="statistic-dash" class="multi-card">
    <div class="content">
      <div class="header">
        <div class="header-div header-border">
          <div>
              {{$t('statistics.top_one')}}
            <span class="header-circle" v-show="tooltipShow">
              <el-tooltip :content="content" placement="top">
                <span class="circle"></span>
              </el-tooltip>
            </span>
          </div>
          <div>
            <span class="num">{{faqNum}}</span>{{$t('statistics.top_each2')}}
          </div>
        </div>
        <div class="header-div header-border">
          <div class="div-padding">
                     {{$t('statistics.top_two')}}
              </div>
          <div>
            <span class="num div-padding">{{tdeNum}}</span> {{$t('statistics.top_each2')}}
          </div>
        </div>
        <div class="header-div header-border">
          <div class="div-padding">  {{$t('statistics.top_three')}}</div>
          <div>
            <span class="num div-padding">{{intentNum}}</span>{{$t('statistics.top_each2')}}
          </div>
        </div>
        <div class="header-div header-border">
          <div class="div-padding">{{$t('statistics.top_four')}}</div>
          <div>
            <span class="num div-padding">{{kgNum}}</span>{{$t('statistics.top_each2')}}
          </div>
        </div>
        <div class="header-div header-border">
          <div class="div-padding">{{$t('statistics.top_five')}}</div>
          <div>
            <span class="num div-padding">{{kgTotalNum}}</span>{{$t('statistics.top_each2')}}
          </div>
        </div>
        <div class="header-div">
          <div class="div-padding">{{$t('statistics.top_six')}}</div>
          <div>
            <span class="num div-padding">{{skillnum}}</span>{{$t('statistics.top_each2')}}
          </div>
        </div>
      </div>
      <div class="middle">
        <span>{{$t('statistics.middle_one')}}</span>
        <div style="float: right;">
          <el-radio-group v-model="radio3" size="small" @change="changeDay">
            <el-radio-button :label="$t('statistics.middle_two')"></el-radio-button>
            <el-radio-button :label="$t('statistics.middle_three')"></el-radio-button>
            <el-radio-button :label="$t('statistics.middle_four')"></el-radio-button>
          </el-radio-group>
          <!-- <el-date-picker
            class="emotibot-datepicker"
            popper-class="emotibot-datepicker-popover"
            v-model="value1"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            size="small"
          ></el-date-picker>-->
        </div>
      </div>
      <div class="bottom">
        <span class="span1">
          <div>{{$t('statistics.bottom_one')}}</div>
          <div>
            <span class="num">{{unique_users}}</span>{{$t('statistics.bottom_each1')}}
          </div>
        </span>
        <span class="span2">
          <div>{{$t('statistics.bottom_two')}}</div>
          <div>
            <span class="num">{{total_asks}}</span>{{$t('statistics.bottom_each2')}}
          </div>
        </span>
        <span class="span3">
          <div>{{$t('statistics.bottom_three')}}</div>
          <div>
            <span class="num">{{success}}</span>
          </div>
        </span>
        <span class="span3">
          <div>{{$t('statistics.bottom_four')}}</div>
          <div>
            <span class="num">{{avg_rating}}</span>{{$t('statistics.bottom_each3')}}
          </div>
        </span>
        <span class="span4">
          <div>{{$t('statistics.bottom_five')}}</div>
          <div>
            <span class="num">{{taskCNum}}/{{taskTNum}}</span>{{$t('statistics.bottom_each4')}}
          </div>
        </span>
        <span class="span2">
          <div>{{$t('statistics.bottom_six')}}</div>
          <div>
            <span class="num">{{avg_tspan}}</span>ms
          </div>
        </span>
        <span class="span2">
          <div>{{$t('statistics.bottom_seven')}}</div>
          <div>
            <span class="num">{{max_qps}}</span>{{$t('statistics.bottom_each4')}}
          </div>
        </span>
      </div>
      <div class="myEcharts">
        <div class="board">
          <div class="title">{{$t('statistics.echarts_one')}}</div>
          <div id="main"></div>
        </div>
        <div class="board">
          <div class="title">
              {{$t('statistics.echarts_two')}}
            <el-select
              v-model="selectValue"
              :placeholder="$t('statistics.placeholder')"
              class="dimesion"
              @change="dimensionChange"
            >
              <el-option
                v-for="item in dimensionList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
          <div id="main1"></div>
        </div>
        <div class="board">
          <div class="title">{{$t('statistics.echarts_three')}}</div>
          <div id="main2"></div>
        </div>
      </div>
      <div class="myEcharts1">
        <div class="board">
          <div class="title">{{$t('statistics.echarts_four')}}</div>
          <div id="main3"></div>
        </div>
        <div class="board">
          <div class="title">{{$t('statistics.echarts_five')}}</div>
          <div id="main4"></div>
        </div>
        <div class="board">
          <div class="title">{{$t('statistics.echarts_six')}}</div>
          <div id="main5"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts';
import { mapGetters } from 'vuex';
import tagAPI from '@/api/tagType';
import moment from 'moment';
import StatsChart from '../Statistics/_components/StatsChart';
import StatsTable from '../Statistics/_components/StatsTable';
import API from '../Statistics/_api/dashboard';

export default {
  privCode: 'statistic_dash',
  api: [tagAPI, API],
  components: {
    StatsChart,
    StatsTable,
  },
  computed: {
    ...mapGetters(['robotID', 'userID']),
  },
  data() {
    return {
      tooltipShow: true,
      nodataShow: true,
      content: '-',
      dimensionList: [],
      t1: '',
      t2: '',
      dataNum: [],
      data_x: [],
      dataNum2: [],
      data_x2: [],
      dataNum1: [],
      data_x1: [],
      dataNum3: [],
      data_y3: [],
      dataNum4: [],
      data_y4: [],
      dataNum5: [],
      avg_rating: '-',
      avg_tspan: '-',
      max_qps: '-',
      unique_users: '-',
      total_asks: '-',
      success: '-',
      days: 1,
      skillnum: '-',
      tdeNum: '-',
      intentNum: '-',
      faqNum: '-',
      kgNum: '-',
      kgTotalNum: '-',
      taskCNum: '-',
      taskTNum: '-',
      selectValue: '',
      myChart: '',
      myChart1: '',
      myChart2: '',
      myChart3: '',
      myChart4: '',
      myChart5: '',
      activeName: 'first',
      value1: [new Date(2000, 10, 10, 10, 10), new Date(2000, 10, 11, 10, 10)],
      radio3: this.$t('statistics.middle_two'),
    };
  },
  methods: {
    getRating() {
      const that = this;
      const time1 = moment()
.subtract(1, 'days')
.startOf('day');
      const time2 = moment()
.subtract(1, 'days')
.endOf('day') + 1;
      console.log(time1, time2);
      const params = {
        startTime: moment(time1).valueOf() / 1000,
        endTime: moment(time2).valueOf() / 1000,
        page: 1,
        limit: 100,
        rating_max: 5,
        rating_min: 1,
        feedback: '',
        platforms: [],
      };
      that.$api
        .getRating(params)
        .then(
          (data) => {
            console.log(data);
            that.avg_rating = data.avg_rating;
          },
          (err) => {
            console.log(err);
          },
        )
        .finally(() => {});
    },
    getTeVisit() {
      const that = this;
      const time1 = moment()
.subtract(1, 'days')
.startOf('day');
      const time2 = moment()
.subtract(1, 'days')
.endOf('day') + 1;
      console.log(time1, time2);
      const params = {
        scenarioID: '',
        startTime: moment(time1).valueOf() / 1000,
        endTime: moment(time2).valueOf() / 1000,
        type: 'time',
        dimension: '',
      };
      that.$api
        .getTeVisit(params)
        .then(
          (data) => {
            that.taskCNum = data.total.triggers - data.total.unfinished;
            that.taskTNum = data.total.triggers;
          },
          (err) => {
            console.log(err);
          },
        )
        .finally(() => {});
    },
    getSsmNum() {
      const that = this;
      const time = new Date().getTime();
      that.$api
        .getSsmNum(that.robotID, that.userID, time)
        .then(
          (data) => {
            console.log(data);
            if (data.changed_sqcnt || data.changed_lqcnt) {
              that.tooltipShow = true;
              that.content = `${this.$t('statistics.titletip1')}${data.changed_sqcnt}${this.$t('statistics.bottom_each2')}，${this.$t('statistics.titletip2')}${data.changed_lqcnt}${this.$t('statistics.bottom_each2')}`;
            } else {
              that.tooltipShow = false;
            }
          },
          (err) => {
            console.log(err);
          },
        )
        .finally(() => {});
    },
    dimensionChange() {
      this.getChart1();
    },
    changeDay() {
      const that = this;
      if (that.radio3 === '1天') {
        that.days = 1;
        that.t1 = moment(new Date())
          .subtract(1, 'days')
          .format('YYYYMMDD');
        that.t2 = that.t1;
      } else if (that.radio3 === '近7天') {
        that.days = 7;
        that.t2 = moment(new Date())
          .subtract(1, 'days')
          .format('YYYYMMDD');
        that.t1 = moment(new Date())
          .subtract(7, 'days')
          .format('YYYYMMDD');
      } else {
        that.days = 30;
        that.t2 = moment(new Date())
          .subtract(1, 'days')
          .format('YYYYMMDD');
        that.t1 = moment(new Date())
          .subtract(30, 'days')
          .format('YYYYMMDD');
      }
      that.fetchDimensionList();
      that.getChart();
      // that.getChart2();
      that.getChart3();
      that.getChart4();
      that.getChart5();
      that.getTeVisit();
    },
    fetchDimensionList() {
      const that = this;
      that.$api
        .fetchDimensionList(that.robotID)
        .then(
          (data) => {
            that.dimensionList = data;
            console.log(that.dimensionList);
            if (that.dimensionList.length > 0) {
              that.selectValue = that.dimensionList[0].value;
              that.getChart1();
            } else {
              that.drawChart1(that.dataNum1, that.data_x1);
            }
            that.getChart1();

            console.log(that.selectValue);
          },
          (err) => {
            console.log(err);
          },
        )
        .finally(() => {});
    },
    getChart() {
      const that = this;
      const params = {
        days: that.days,
        type: 'time',
        t1: that.t1,
        t2: that.t2,
      };
      that.getVisitStats(params, 0);
    },
    getChart1() {
      const that = this;
      let params;
      if (that.selectValue !== '') {
        params = {
          days: that.days,
          type: 'barchart',
          filter: 'category',
          category: that.selectValue,
          t1: that.t1,
          t2: that.t2,
        };
      } else {
        params = {
          days: that.days,
          type: 'barchart',
          filter: 'category',
          category: -1,
          t1: that.t1,
          t2: that.t2,
        };
      }

      that.getVisitStats(params, 1);
    },
    getChart2() {
      // const that = this;
      // const params = {
      //   days: that.days,
      //   type: 'time',
      //   t1: that.t1,
      //   t2: that.t2,
      // };
      // that.getVisitStats(params, 2);
    },
    getChart3() {
      const that = this;
      const params = {
        days: that.days,
        type: 'top',
        top: 10,
        t1: that.t1,
        t2: that.t2,
      };
      that.getTopQuestions(params, 3);
    },
    getChart4() {
      const that = this;
      const params = {
        days: that.days,
        type: 'unused',
        top: 10,
        t1: that.t1,
        t2: that.t2,
      };
      that.getTopQuestions(params, 4);
    },
    getChart5() {
      const that = this;
      const params = {
        days: that.days,
        type: 'barchart',
        filter: 'qtype',
        t1: that.t1,
        t2: that.t2,
      };
      that.getVisitStats(params, 5);
    },
    getTopQuestions(params, index) {
      const that = this;
      that.$api
        .getTopQuestions2(params)
        .then(
          (data) => {
            if (index === 3) {
              that.dataNum3 = [];
              that.data_y3 = [];
              if (Array.isArray(data.data)) {
                data.data.map((quan) => {
                  that.dataNum3.push(quan.q);
                  that.data_y3.push(quan.question);
                  return quan;
                });
              }
              that.drawChart3(that.dataNum3, that.data_y3);
            } else if (index === 4) {
              that.dataNum4 = [];
              that.data_y4 = [];
              if (Array.isArray(data.data)) {
                data.data.map((quan) => {
                  that.dataNum4.push(quan.q);
                  that.data_y4.push(quan.question);
                  return quan;
                });
              }
              that.drawChart4(that.dataNum4, that.data_y4);
            }
          },
          (err) => {
            console.log(err);
          },
        )
        .finally(() => {});
    },
    getVisitStats(params, index) {
      const that = this;
      that.$api
        .getVisitStats(params)
        .then(
          (data) => {
            if (index === 0) {
              that.dataNum = [];
              that.data_x = [];
              that.dataNum2 = [];
              that.data_x2 = [];
              that.unique_users = data.total.unique_users;
              that.total_asks = data.total.total_asks;
              if (data.total.avg_tspan === 'N/A') {
                that.avg_tspan = 0;
              } else if (data.total.avg_tspan.length > 3) {
                that.avg_tspan = data.total.avg_tspan.substring(0, 3);
              } else {
                that.avg_tspan = data.total.avg_tspan;
              }
              that.max_qps = data.total.max_qps;
              const test = data.total.total_asks - data.total.unknown_qna;
              if (data.total.total_asks === 0) {
                that.success = '0%';
              } else {
                that.success = `${Math.round(
                  (test / data.total.total_asks) * 100,
                )}%`;
              }

              if (Array.isArray(data.data.quantities)) {
                data.data.quantities.map((quan) => {
                  that.dataNum.push(quan.conversations);
                  if (quan.conversations === 0) {
                    that.dataNum2.push(0);
                  } else if (quan.interception_rate) {
                    that.dataNum2.push(100);
                  } else {
                    const test1 = quan.interception_rate.substring(
                      0,
                      quan.interception_rate.length - 1,
                    );
                    const test2 = parseFloat(test1);
                    that.dataNum2.push(100 - test2);
                  }
                  that.data_x.push(quan.time_txt);
                  return quan;
                });
              }
              that.data_x2 = that.data_x;
              that.drawChart(that.dataNum, that.data_x);
              that.drawChart2(that.dataNum2, that.data_x2);
            } else if (index === 1) {
              that.dataNum1 = [];
              that.data_x1 = [];
              if (Array.isArray(data.data)) {
                data.data.map((quan) => {
                  that.dataNum1.push(quan.q.total_asks);
                  that.data_x1.push(quan.name);
                  return quan;
                });
              }
              that.drawChart1(that.dataNum1, that.data_x1);
            } else if (index === 5) {
              that.dataNum5 = [];
              if (Array.isArray(data.data)) {
                data.data.map((quan) => {
                  that.dataNum5.push({
                    value: quan.q.total_asks,
                    name: quan.name,
                  });
                  return quan;
                });
              }
              that.drawChart5(that.dataNum5);
            }
          },
          (err) => {
            console.log(err);
          },
        )
        .finally(() => {});
    },
    getKgNum() {
      const that = this;
      that.$api
        .getKgNum(that.robotID)
        .then(
          (data) => {
            if (data.total) {
              that.kgNum = data.total;
            } else {
              that.kgNum = 0;
            }
          },
          (err) => {
            console.log(err);
          },
        )
        .finally(() => {});
    },
    getKgTotalNum() {
      const that = this;
      that.$api
        .getKgTotalNum(that.robotID)
        .then(
          (data) => {
            if (Array.isArray(data)) {
              that.kgTotalNum = data.length;
            }
          },
          (err) => {
            console.log(err);
          },
        )
        .finally(() => {});
    },
    getSkillNum() {
      const that = this;
      const promises = [
        that.$api.getSkillNum(),
        that.$api.getSkillfNum(that.robotID),
      ];
      Promise.all(promises)
        .then(([skill, skillf]) => {
          const skillnum = skill.filter(msg => msg.active === true).length;
          const skillfnum = skillf.filter(msg => msg.status === true).length;
          that.skillnum = skillnum + skillfnum;
        })
        .finally(() => {});
    },
    getTdeNum() {
      const that = this;
      const promises = [
        that.$api.getTdeNum(that.robotID),
        that.$api.getTeNum(that.robotID),
      ];
      Promise.all(promises)
        .then(([tde, te]) => {
          const tdenum = tde.filter(
            msg => msg.version !== '2.0',
          ).length;
          const tenum = te.length;
          that.tdeNum = tdenum + tenum;
        })
        .finally(() => {});
    },
    getIntentNum() {
      const that = this;
      that.$api
        .getIntentNum()
        .then(
          (data) => {
            that.intentNum = data.length;
          },
          (err) => {
            console.log(err);
          },
        )
        .finally(() => {});
    },
    getFaqNum() {
      const that = this;
      const time = new Date().getTime();
      that.$api
        .getFaqNum(that.robotID, that.userID, time)
        .then(
          (data) => {
            that.faqNum = data.sqcnt;
          },
          (err) => {
            console.log(err);
          },
        )
        .finally(() => {});
    },
    resizeHandle() {
      if (this.myChart) {
        this.myChart.resize();
      }
      if (this.myChart1) {
        this.myChart1.resize();
      }
      if (this.myChart2) {
        this.myChart2.resize();
      }
      if (this.myChart3) {
        this.myChart3.resize();
      }
      if (this.myChart4) {
        this.myChart4.resize();
      }
      if (this.myChart5) {
        this.myChart5.resize();
      }
    },
    drawChart(dataNum, datax) {
      this.myChart = echarts.init(document.getElementById('main'));
      let option;
      if (dataNum.length > 0) {
        option = {
          grid: {
            show: false,
            left: 10,
            top: 10,
            right: 10,
            bottom: 10,
            borderColor: '#bfbfbf',
            // borderWidth: 1,
          },
          backgroundColor: '#fff',
          labelLine: {
            normal: {
              show: false,
            },
          },
          tooltip: {
            trigger: 'axis',
            backgroundColor: '#FFFFFF',
            textStyle: {
              color: '#505D6F',
            },
            axisPointer: {
              lineStyle: {
                color: '#2D99FF',
                type: 'dashed',
              },
            },
          },
          triggerOn: 'mousemove',
          showContent: true, // 是否显示提示框浮层
          alwaysShowContent: true, // 是否永远显示提示框内容
          xAxis: [
            {
              type: 'category',
              show: false,
              data: datax,
            },
          ],

          yAxis: {
            type: 'value',
            show: false,
          },
          series: [
            {
              name: this.$t('statistics.series_one'),
              data: dataNum,
              type: 'line',
              showSymbol: false,
              itemStyle: {
                normal: {
                  color: '#72b9fd',
                  // opacity: 0.5,
                  borderWidth: 0.5,
                },
                emphasis: {
                  color: '#2D99FF',
                  // borderColor: '#fff',
                }, //* **这个字段就是控制鼠标悬浮在圆点上面让整个圆填充满背景色，也可以更改边框颜色等！***
              },
              smooth: true,
              areaStyle: {
                normal: {
                  color: '#2D99FF',
                },
              },
            },
          ],
        };
      } else {
        option = {
          title: {
            show: true,
            textStyle: {
              fontSize: 12,
              fontWeight: 'normal',
              color: '#333333',
            },
            text: this.$t('statistics.no_data'),
            left: 'center',
            top: 'center',
          },
          backgroundColor: '#fff',
        };
      }
      this.myChart.clear();
      this.myChart.setOption(option);
    },
    drawChart1(dataNum, datax) {
      this.myChart1 = echarts.init(document.getElementById('main1'));
      let option;
      if (dataNum.length > 0) {
        option = {
          color: ['#826AF9'],
          dataZoom: [
            {
              type: 'slider',
              show: true,
              xAxisIndex: 0,
              left: '2%',
              bottom: -20,
              start: 0, // 数据窗口范围的起始百分比
              end: 50,
              handleSize: 1,
              showDataShadow: false,
              showDetail: false,
            },
          ],
          grid: {
            show: false,
            left: 10,
            top: 30,
            right: 10,
            bottom: 20,
            borderColor: '#bfbfbf',
            // borderWidth: 1,
          },
          tooltip: {
            trigger: 'axis',
            backgroundColor: '#FFFFFF',
            textStyle: {
              color: '#505D6F',
            },
            axisPointer: {
              lineStyle: {
                color: '#2D99FF',
                type: 'dashed',
                width: 0,
              },
            },
          },
          triggerOn: 'mousemove',
          showContent: true, // 是否显示提示框浮层
          alwaysShowContent: true, // 是否永远显示提示框内容
          backgroundColor: '#fff',
          xAxis: [
            {
              type: 'category',
              show: false,
              data: datax,
              axisTick: {
                alignWithLabel: true,
              },
            },
          ],
          yAxis: [
            {
              show: false,
              type: 'value',
            },
          ],
          series: [
            {
              name: this.$t('statistics.series_two'),
              type: 'bar',
              barWidth: '40', // ---柱形宽度
              barCategoryGap: '20%', // ---柱形间距
              data: dataNum,
              label: {
                normal: {
                  show: true,
                  position: 'top',
                  // position: 'inside',
                  formatter(params) {
                    // const str = params.name;
                    // return str;
                    let valueTxt = '';
                    if (params.name.length > 3) {
                      valueTxt = `${params.name.substring(0, 3)}...`;
                    } else {
                      valueTxt = params.name;
                    }
                    return valueTxt;
                  },
                },
              },
            },
          ],
        };
      } else {
        option = {
          title: {
            show: true,
            textStyle: {
              fontSize: 12,
              fontWeight: 'normal',
              color: '#333333',
            },
            text: this.$t('statistics.no_data'),
            left: 'center',
            top: 'center',
          },
          backgroundColor: '#fff',
        };
      }
      this.myChart1.clear();
      this.myChart1.setOption(option);
    },
    drawChart2(dataNum, datax) {
      this.myChart2 = echarts.init(document.getElementById('main2'));
      let option;
      if (dataNum.length > 0) {
        option = {
          backgroundColor: '#fff',
          labelLine: {
            normal: {
              show: false,
            },
          },
          grid: {
            show: false,
            left: 10,
            top: 10,
            right: 10,
            bottom: 10,
            borderColor: '#bfbfbf',
            // borderWidth: 1,
          },
          tooltip: {
            trigger: 'axis',
            backgroundColor: '#FFFFFF',
            textStyle: {
              color: '#505D6F',
            },
            axisPointer: {
              lineStyle: {
                color: '#FF6C40',
                type: 'dashed',
              },
            },
          },
          triggerOn: 'mousemove',
          showContent: true, // 是否显示提示框浮层
          alwaysShowContent: true, // 是否永远显示提示框内容
          xAxis: [
            {
              type: 'category',
              show: false,
              splitLine: {
                show: true,
                lineStyle: {
                  color: ['red'],
                  width: 1,
                  type: 'solid',
                },
              },
              data: datax,
            },
          ],

          yAxis: {
            type: 'value',
            show: false,
            splitLine: {
              show: true,
              lineStyle: {
                color: ['red'],
                width: 1,
                type: 'solid',
              },
            },
          },
          series: [
            {
              data: dataNum,
              name: this.$t('statistics.series_three'),
              type: 'line',
              showSymbol: false,
              itemStyle: {
                normal: {
                  color: '#fd987f',
                  // opacity: 0.5,
                  borderWidth: 0.5,
                },
                emphasis: {
                  color: '#FF6C40',
                  borderColor: '#fff',
                }, //* **这个字段就是控制鼠标悬浮在圆点上面让整个圆填充满背景色，也可以更改边框颜色等！***
              },
              smooth: true,
              areaStyle: {
                normal: {
                  color: '#FF6C40',
                },
              },
            },
          ],
        };
      } else {
        option = {
          title: {
            show: true,
            textStyle: {
              fontSize: 12,
              fontWeight: 'normal',
              color: '#333333',
            },
            text: this.$t('statistics.no_data'),
            left: 'center',
            top: 'center',
          },
          backgroundColor: '#fff',
        };
      }
      this.myChart2.clear();
      this.myChart2.setOption(option);
    },
    drawChart3(datanum, datay) {
      console.log(datanum, datay);
      const datanumb = Array(10).fill('');
      const datayb = Array(10).fill('');
      const dataBg = Array(10).fill({
        name: '',
        value: Math.max(...datanum),
      });
      datanum.map((y, index) => {
        datanumb[index] = y;
        return y;
      });
      datay.map((y, index) => {
        datayb[index] = y;
        return y;
      });
      datanumb.map((y, index) => {
        dataBg[index] = {
          name: y,
          value: Math.max(...datanum),
        };

        return y;
      });

      console.log(dataBg, datanumb, datay);
      let option;
      this.myChart3 = echarts.init(document.getElementById('main3'));
      if (datanum.length > 0) {
        option = {
          backgroundColor: '#fff',
          xAxis: {
            show: false,
          },
          grid: {
            show: false,
            left: 10,
            top: 0,
            right: 10,
            bottom: 10,
            // borderColor: '#bfbfbf',
            // height: '200',
            // borderWidth: 1,
          },
          yAxis: [
            {
              show: false,
              inverse: true,
              data: dataBg,
              axisLabel: {
                // textStyle: {
                //   fontSize: 12,
                //   color: '#666666',
                // },
              },
              axisLine: {
                show: false,
              },
              splitLine: {
                show: false,
              },
              axisTick: {
                show: false,
              },
            },
            {
              show: false,
              data: datayb,
              inverse: true,
              axisLine: {
                show: true,
                lineStyle: {
                  color: '#333',
                },
              },
              splitLine: {
                show: false,
              },
              axisTick: {
                show: false,
              },
              axisLabel: {
                textStyle: {
                  color: '#000',
                },
              },
            },
          ],
          series: [
            {
              silent: true,
              legendHoverLink: false,
              name: '框',
              type: 'bar',
              barGap: '-100%',
              barWidth: 18,
              yAxisIndex: 0,
              data: dataBg,
              // barMaxWidth: 40,
              label: {
                normal: {
                  show: true,
                  position: 'insideRight',
                  textStyle: {
                    color: '#333',
                    opacity: 1,
                  },
                  // position: 'inside',
                  formatter(params) {
                    const str = params.data.name;
                    return str;
                  },
                },
              },
              itemStyle: {
                normal: {
                  color: '#F3F3F3',
                  borderColor: 'none',
                  // borderWidth: 0,
                  barBorderRadius: 15,
                },
                // emphasis: {
                //   itemStyle: {
                //     color: '#F3F3F3',
                //   },
                // },
              },
            },
            {
              name: '条',
              type: 'bar',
              yAxisIndex: 1,
              barWidth: 18,
              barGap: '10',
              data: datanumb,
              // barMaxWidth: 40,
              itemStyle: {
                normal: {
                  barBorderRadius: 30,
                  color: '#2CD9C5',
                  opacity: 0.6,
                },
                emphasis: {
                  color: '#2CD9C5',
                  opacity: 1,
                },
              },
              // label: {
              //   normal: {
              //     show: true, // 开启显示
              //     position: 'insideRight',
              //     textStyle: {
              //       // 数值样式
              //       color: '#333',
              //       opacity: 1,
              //     },
              //   },
              // },
              label: {
                normal: {
                  show: true,
                  position: 'insideLeft',
                  textStyle: {
                    color: '#333',
                    opacity: 1,
                  },
                  // position: 'inside',
                  formatter(params) {
                    // const valueTxt = params.name;
                    let valueTxt = '';
                    if (params.name.length > 20) {
                      valueTxt = `${params.name.substring(0, 21)}...`;
                    } else {
                      valueTxt = params.name;
                    }
                    return valueTxt;
                  },
                },
              },
            },
          ],
        };
      } else {
        option = {
          title: {
            show: true,
            textStyle: {
              fontSize: 12,
              fontWeight: 'normal',
              color: '#333333',
            },
            text: this.$t('statistics.no_data'),
            left: 'center',
            top: 'center',
          },
          backgroundColor: '#fff',
        };
      }
      this.myChart3.clear();
      this.myChart3.setOption(option);
    },
    drawChart4(datanum, datay) {
      console.log(datanum, datay);
      const datanumb = Array(10).fill('');
      const datayb = Array(10).fill('');
      const dataBg = Array(10).fill({
        name: '',
        value: Math.max(...datanum),
      });
      datanum.map((y, index) => {
        datanumb[index] = y;
        return y;
      });
      datay.map((y, index) => {
        datayb[index] = y;
        return y;
      });
      datanumb.map((y, index) => {
        dataBg[index] = {
          name: y,
          value: Math.max(...datanum),
        };

        return y;
      });
      let option;
      this.myChart4 = echarts.init(document.getElementById('main4'));

      if (datanum.length > 0) {
        option = {
          backgroundColor: '#fff',
          xAxis: {
            show: false,
          },
          grid: {
            show: false,
            left: 10,
            top: 0,
            right: 10,
            bottom: 10,
            // borderColor: '#bfbfbf',
            // height: '200',
            // borderWidth: 1,
          },
          yAxis: [
            {
              show: false,
              inverse: true,
              data: dataBg,
              axisLabel: {
                // textStyle: {
                //   fontSize: 12,
                //   color: '#666666',
                // },
              },
              axisLine: {
                show: false,
              },
              splitLine: {
                show: false,
              },
              axisTick: {
                show: false,
              },
            },
            {
              show: false,
              data: datayb,
              inverse: true,
              axisLine: {
                show: true,
                lineStyle: {
                  color: '#333',
                },
              },
              splitLine: {
                show: false,
              },
              axisTick: {
                show: false,
              },
              axisLabel: {
                textStyle: {
                  color: '#000',
                },
              },
            },
          ],
          series: [
            {
              silent: true,
              legendHoverLink: false,
              name: '框',
              type: 'bar',
              barGap: '-100%',
              barWidth: 18,
              yAxisIndex: 0,
              data: dataBg,
              // barMaxWidth: 40,
              label: {
                normal: {
                  show: true,
                  position: 'insideRight',
                  textStyle: {
                    color: '#333',
                    opacity: 1,
                  },
                  // position: 'inside',
                  formatter(params) {
                    const str = params.data.name;
                    return str;
                  },
                },
              },
              itemStyle: {
                normal: {
                  color: '#F3F3F3',
                  borderColor: 'none',
                  // borderWidth: 0,
                  barBorderRadius: 15,
                },
                // emphasis: {
                //   itemStyle: {
                //     color: '#F3F3F3',
                //   },
                // },
              },
            },
            {
              name: '条',
              type: 'bar',
              yAxisIndex: 1,
              barWidth: 18,
              data: datanumb,
              // barMaxWidth: 40,
              itemStyle: {
                normal: {
                  barBorderRadius: 30,
                  color: '#FEE501',
                  opacity: 0.6,
                },
                emphasis: {
                  color: '#FEE501',
                  opacity: 1,
                },
              },
              // label: {
              //   normal: {
              //     show: true, // 开启显示
              //     position: 'insideRight',
              //     textStyle: {
              //       // 数值样式
              //       color: '#333',
              //       opacity: 1,
              //     },
              //   },
              // },
              label: {
                normal: {
                  show: true,
                  position: 'insideLeft',
                  textStyle: {
                    color: '#333',
                    opacity: 1,
                  },
                  // position: 'inside',
                  formatter(params) {
                    // const valueTxt = params.name;
                    let valueTxt = '';
                    if (params.name.length > 20) {
                      valueTxt = `${params.name.substring(0, 21)}...`;
                    } else {
                      valueTxt = params.name;
                    }
                    return valueTxt;
                  },
                },
              },
            },
          ],
        };
      } else {
        option = {
          title: {
            show: true,
            textStyle: {
              fontSize: 12,
              fontWeight: 'normal',
              color: '#333333',
            },
            text: this.$t('statistics.no_data'),
            left: 'center',
            top: 'center',
          },
          backgroundColor: '#fff',
        };
      }
      console.log(option);
      this.myChart4.clear();
      this.myChart4.setOption(option);
    },
    drawChart5(dataNum) {
      this.myChart5 = echarts.init(document.getElementById('main5'));
      let option;
      if (dataNum.length > 0) {
        option = {
          // title: {
          //   text: '回答类别',
          //   textStyle: {
          //     color: '#333333',
          //     fontSize: '12px',
          //   },
          //   left: '10px',
          //   top: '10px',
          // },
          grid: {
            show: false,
            left: 10,
            top: 38,
            right: 10,
            bottom: 10,
            borderColor: '#bfbfbf',
            // borderWidth: 1,
          },
          backgroundColor: '#fff',
          tooltip: {
            trigger: 'item',
            backgroundColor: '#FFFFFF',
            textStyle: {
              color: '#505D6F',
            },
            axisPointer: {
              lineStyle: {
                color: '#2D99FF',
                type: 'dashed',
              },
            },
          },
          legend: {
            orient: 'vertical',
            right: 10,
            top: 50,
            itemWidth: 8,
            icon: 'circle',
            data: [this.$t('statistics.data_one'), this.$t('statistics.data_two'), this.$t('statistics.data_three')],
          },
          series: [
            {
              name: this.$t('statistics.series_two'), // tooltip提示框中显示内容
              type: 'pie', // 图形类型，如饼状图，柱状图等
              radius: ['0', '65%'], // 饼图的半径，数组的第一项是内半径，第二项是外半径。支持百分比，本例设置成环形图。具体可以看文档或改变其值试一试
              // roseType:'area',是否显示成南丁格尔图，默认false
              label: {
                normal: {
                  show: false,
                  position: 'center',
                },
              },
              labelLine: {
                normal: {
                  show: false,
                },
              },
              data: dataNum, // 数据，数据中其他属性，查阅文档
              color: ['#2CD9C5', '#FFE700', '#826AF9'], // 各个区域颜色
            }, // 数组中一个{}元素，一个图，以此可以做出环形图
          ], // 系列列表
        };
      } else {
        option = {
          title: {
            show: true,
            textStyle: {
              fontSize: 12,
              fontWeight: 'normal',
              color: '#333333',
            },
            text: this.$t('statistics.no_data'),
            left: 'center',
            top: 'center',
          },
          backgroundColor: '#fff',
        };
      }
      this.myChart5.clear();
      this.myChart5.setOption(option);
    },
  },
  created() {
    this.t1 = moment(new Date())
      .subtract(1, 'days')
      .format('YYYYMMDD');
    this.t2 = this.t1;
  },
  mounted() {
    const that = this;
    that.fetchDimensionList();
    that.getRating();
    that.getChart();
    that.getChart3();
    that.getChart4();
    that.getChart5();
    that.getSkillNum();
    that.getFaqNum();
    that.getSsmNum();
    that.getIntentNum();
    that.getTdeNum();
    that.getKgTotalNum();
    that.getKgNum();
    that.getTeVisit();
    window.addEventListener('resize', this.resizeHandle);
  },
};
</script>
<style lang="scss" scoped>
@import "styles/variable.scss";
$row-height: $default-line-height;
$stat-card-height: 300px;
#app-page > .app-body {
  padding: 0 10px;
}
#statistic-dash {
  @include auto-overflow();
  @include customScrollbar();
  background: #f6f6f6;
  .header {
    height: 60px;
    min-width: 500px;
    line-height: 60px;
    margin-top: 10px;
    display: flex;
    padding: 10px;
    box-sizing: border-box;
    background: rgba(238, 238, 238, 1);
    .header-div {
      flex: 1;
      .div-padding {
        padding-left: 10px;
      }
      div {
        // padding-left: 10px;
        line-height: 1.8;
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(102, 102, 102, 1);
      }
      .num {
        font-size: 16px;
        font-family: PingFang-SC-Bold, PingFang-SC;
        font-weight: bold;
        color: rgba(51, 51, 51, 1);
        line-height: 20px;
        display: inline-block;
        margin-right: 3px;
      }
      .circle {
        display: inline-block;
        width: 5px;
        height: 5px;
        border-radius: 50%;
        background: #f25c62;
        top: -3px;
        position: relative;
      }
      .header-circle {
        display: inline-block;
        vertical-align: middle;
      }
    }
    .header-border {
      border-right: 1px dashed #c0c4cc;
    }
  }
  .middle {
    height: 60px;
    line-height: 60px;
    ::v-deep .el-radio-button__orig-radio:checked + .el-radio-button__inner {
      color: #606266;
      background-color: #fff;
      border-color: #dcdfe6;
      border-bottom: 1px solid #409eff;
      box-sizing: border-box;
      box-shadow: -1px 0 0 0 #dcdfe6;
    }
    span {
      margin-left: 10px;
      display: inline-block;
      width: 10%;
      min-width: 60px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
    }
  }
  .bottom {
    min-width: 800px;
    margin-bottom: 10px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .num {
      font-size: 18px;
      font-family: PingFang-SC-Bold, PingFang-SC;
      font-weight: bold;
      color: rgba(51, 51, 51, 1);
      line-height: 20px;
      display: inline-block;
      margin-right: 3px;
    }
    .span1 {
      width: 12%;
      height: 60px;
    }
    .span2 {
      width: 14%;
      height: 60px;
    }
    .span3 {
      width: 10%;
      height: 60px;
    }
    .span4 {
      width: 20%;
      height: 60px;
    }
    .span1,
    .span2,
    .span3,
    .span4 {
      display: inline-block;

      background: rgba(252, 252, 252, 1);
      box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.08);
      border-radius: 2px;
      color: rgba(102, 102, 102, 1);
      font-size: 12px;
      div {
        height: 30px;
        line-height: 30px;
        padding-left: 10px;
      }
    }
  }
  .myEcharts {
    // padding-right: 10px;
    // margin: 0 10px;
    min-width: 780px;
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    position: relative;
    .board {
      width: 32.7%;
      // height: 20vh;
      .title {
        height: 40px;
        line-height: 40px;
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
        padding-left: 10px;
        background: #fff;
      }
    }
    .dimesion {
      display: inline-block;
      width: 110px;
      float: right;
      margin-right: 10px;
      ::v-deep .el-input__inner {
        height: 28px;
        line-height: 28px;
        font-size: 12px;
      }
      ::v-deep .el-select-dropdown__item {
        font-size: 12px;
      }
    }
  }
  .myEcharts1 {
    min-width: 780px;
    // padding-right: 10px;
    // margin: 0 10px;
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    position: relative;
    .board {
      width: 32.7%;
      // height: 30vh;
      .title {
        height: 40px;
        line-height: 40px;
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
        padding-left: 10px;
        background: #fff;
      }
    }
  }
  .nodata {
    width: 100%;
    height: 19vh;
    line-height: 19vh;
    text-align: center;
    background: #fff;
  }
  .nodata1 {
    width: 100%;
    height: 29vh;
    line-height: 29vh;
    text-align: center;
    background: #fff;
  }
  #main,
  #main1,
  #main2 {
    width: 100%;
    height: calc((100vh - 344px) * 2 / 5);
  }
  #main3,
  #main4,
  #main5 {
    width: 100%;
    height: calc((100vh - 344px) * 3 / 5);
    min-height: 203px;
  }
  #main,
  #main1,
  #main2,
  #main3,
  #main4,
  #main5 {
    display: inline-block;
    // flex: 1;
    background: rgba(255, 255, 255, 1);
    // box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.08);
    // border-radius: 2px;
  }
  .div1 {
    height: 24px;
    background: #f3f3f3;
    border-radius: 20px;
    margin: 5px;
    line-height: 24px;
    padding-left: 5px;
  }
}
</style>
