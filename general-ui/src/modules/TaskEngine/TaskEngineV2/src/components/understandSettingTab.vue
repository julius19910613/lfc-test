<template>
<div id="understand-set">
  <div class="grey-block">
    {{$t('task_engine_v2.understanding_tab.instruction')}}
  </div>
  <div class="grey-block">
    <div class="title-set">{{$t('task_engine_v2.understanding_tab.title_set')}}</div>
    <div class="add-btn" @click="isAct=true" :class="isAct? 'add-btned':''">
       {{$t('task_engine_v2.understanding_tab.add_act_clissify')}} </div>
    <!-- <div class="add-btn" @click="isParse=true" :class="isParse? 'add-btned':''"> + 解析器 </div> -->
    <!-- <div class="add-btn" @click="isIntent=true" :class="isIntent? 'add-btned':''"> 
      {{$t('task_engine_v2.understanding_tab.add_intent')}}
    </div> -->
  </div>
  <!--行为分类选择-->
  <div class="select-block" v-if="isAct">
    <div class="select-header">
      <div class="select-title"> {{$t('task_engine_v2.understanding_tab.act_select')}}</div>
      <div class="delete" @click="clearAct">{{$t('task_engine_v2.understanding_tab.delete')}}</div>
    </div>
      <el-table
      :data="acttableData"
      style="width: 100%;overflow:visible;"
      class="eltabSel"
      >
      <el-table-column
        :label="$t('task_engine_v2.understanding_tab.act_clissify')"
        align="center">
        <template slot-scope="scope">
              <el-select :ref="'elselect'+ scope.$index" v-model="actTypeValue[scope.$index]"
               placeholder="请选择" @change="actselect(scope.$index)" v-tooltip="inputTooltip">
                <el-option
                  v-for="item in actOption"
                  :key="item.classifierId"
                  :label="item.classifierName"
                  :value="item.classifierId">
                </el-option>
              </el-select>
        </template>
      </el-table-column>
      <el-table-column
        prop="description"
        :label="$t('task_engine_v2.understanding_tab.act_explain')"
        align="center">
      </el-table-column>
      <el-table-column
        prop="predictSlotName"
        :label="$t('task_engine_v2.understanding_tab.return_value')"
        align="center">
      </el-table-column>
      <el-table-column
        prop="predictSlotDesc"
        :label="$t('task_engine_v2.understanding_tab.classify')"
        align="center">
      </el-table-column>
      <el-table-column
        prop="operation"
        :label="$t('task_engine_v2.understanding_tab.operation')"
        align="center">
        <template slot-scope="scope">
          <span @click="actDel(scope.$index)">{{$t('task_engine_v2.understanding_tab.delete')}}</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="add-new-btn">
      <span @click="addact">{{$t('task_engine_v2.understanding_tab.new_add_act_clissify')}}</span>
    </div>
    

  </div> 
  <!--解析器选择-->
  <div class="select-block" v-if="isParse">
     <div class="select-header">
      <div class="select-title">
        {{$t('task_engine_v2.understanding_tab.parse_select')}}
      </div>
      <div class="delete" @click="isParse=false">
        {{$t('task_engine_v2.understanding_tab.delete')}}
      </div>
    </div>
    <el-table
      :data="parseTableData"
      style="width: 100%"
      >
      <el-table-column
        :label="$t('task_engine_v2.understanding_tab.parse_type')"
        align="center">
        <template slot-scope="scope">
          <el-select v-model="parsetypeValue[scope.$index]" placeholder="请选择" @change="select(scope.$index)">
            <el-option
              v-for="item in parseTypeOption"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('task_engine_v2.understanding_tab.parse_name')"
        align="center">
        <template slot-scope="scope">
          <el-select v-model="parsenameValue[scope.$index]" placeholder="请选择" @change="parseselect(scope.$index)">
            <el-option
              v-for="item in parseNameOption"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column
        prop="location"
        :label="$t('task_engine_v2.understanding_tab.slot_name')"
        align="center">
      </el-table-column>
      <el-table-column
        prop="desc"
        :label="$t('task_engine_v2.understanding_tab.declare')"
        align="center">
      </el-table-column>
      <el-table-column
        prop="operation"
        :label="$t('task_engine_v2.understanding_tab.operation')"
        align="center">
        <template slot-scope="scope">
          <span @click="parserDel(scope.$index)">{{$t('task_engine_v2.understanding_tab.delete')}}</span>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-top: 20px">
     <el-button @click="addparser">
       {{$t('task_engine_v2.understanding_tab.new_add_parser')}}
     </el-button>
    </div>
  </div>
  <!--意图选择-->
  <div class="select-block" v-if="isIntent">
    <div class="select-header">
      <div class="select-title"> {{$t('task_engine_v2.understanding_tab.intent_select')}}</div>
      <div class="delete" @click="clearIntent">{{$t('task_engine_v2.understanding_tab.delete')}}</div>
    </div>
    <el-table
      :data="intentTableData"
      style="width: 100%"
      >
      <el-table-column
        :label="$t('task_engine_v2.understanding_tab.intent_model')"
        align="center">
        <template slot-scope="scope">
          <el-select v-model="intentmodel[scope.$index]" placeholder="请选择" @change="modelselect(scope.$index)">
            <el-option
              v-for="item in intentmodelOption"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('task_engine_v2.understanding_tab.intnet')"
        align="center">
        <template slot-scope="scope">
          <el-select v-model="intent[scope.$index]" placeholder="请选择">
            <el-option
              v-for="item in intentOption[scope.$index]"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </template>
      </el-table-column>
       <el-table-column
        :label="$t('task_engine_v2.understanding_tab.return_value')"
        align="center">
        <template slot-scope="scope">
          <el-input v-model="returnvalue[scope.$index]" placeholder="请输入内容"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        prop="operation"
        :label="$t('task_engine_v2.understanding_tab.operation')"
        align="center">
        <template slot-scope="scope">
          <span @click="intentDel(scope.$index)">{{$t('task_engine_v2.understanding_tab.delete')}}</span>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-top: 10px;color: #3D73FF;" @click="addIntent">
      {{$t('task_engine_v2.understanding_tab.new_add_intent')}}
    </div>
  </div>
</div>
</template>

<script>
import { mapGetters } from 'vuex';
import nerFactoryDalApi from '@/modules/TaskEngine/_api/nerFactoryDal';
import event from '@/utils/js/event';

export default {
  api: [nerFactoryDalApi],
  props: {
    understandTab: {
      type: Object,
    },
  },
  data() {
    const understandTab = this.understandTab || {};
    const acttableData = understandTab.acttableData || [];
    const actTypeValue = understandTab.actTypeValue || [];
    const intentTableData = understandTab.intentTableData || [1];
    const intentmodel = understandTab.intentmodel || [];
    const intent = understandTab.intent || [];
    const returnvalue = understandTab.returnvalue || [];
    const isIntent = understandTab.isIntent;
    const isAct = understandTab.isAct;
    const intentOption = understandTab.intentOption || [[]];
    return {
      acttableData,
      actTypeValue,
      actOption: [],
      parseTableData: [{
        location: '-',
        desc: '-',
      }],
      parsetypeValue: [''],
      parsenameValue: [''],
      parseNameOption: [{ value: 'mingcheng1', label: '名称1' }, { value: 'mingcheng2', label: '名称2' }, { value: 'mingcheng3', label: '名称3' }],
      parseTypeOption: [{ value: 'leixing1', label: '类型1' }, { value: 'leixing2', label: '类型2' }, { value: 'leixing3', label: '类型3' }],
      intentTableData,
      intentmodel,
      intent,
      returnvalue,
      intentmodelOption: [],
      intentOption,
      isIntent,
      isAct,
      isParse: false,
      inputTooltip: {
        msg: this.$t('task_engine_v2.err_empty'),
        eventOnly: true,
        errorType: true,
        alignLeft: true,
        absolute: true,
      },
    };
  },
  computed: {
    ...mapGetters([
      'robotID',
      'modelDAta',
      'enterpriseID',
      'voiceSet',
      'copyACblock',
    ]),
  },
  watch: {
    isAct() {
      this.emitUpdate();
    },
    isIntent() {
      this.emitUpdate();
    },
    returnvalue() {
      this.emitUpdate();
    },
    intent() {
      this.emitUpdate();
    },
  },
  methods: {
    clearIntent() {
      this.isIntent = false;
      this.intentTableData = [1];
      this.intentmodel = [];
      this.intent = [];
      this.returnvalue = [];
      this.emitUpdate();
    },
    clearAct() {
      this.isAct = false;
      this.acttableData = [];
      this.actTypeValue = [];
      this.emitUpdate();
    },
    actDel(index) {
      this.acttableData.splice(index, 1);
      this.actTypeValue.splice(index, 1);
      this.emitUpdate();
    },
    parserDel(index) {
      this.parseTableData.splice(index, 1);
      this.emitUpdate();
    },
    intentDel(index) {
      this.intentTableData.splice(index, 1);
      this.returnvalue.splice(index, 1);
      this.intentmodel.splice(index, 1);
      this.intent.splice(index, 1);
      this.emitUpdate();
    },
    addparser() {
      this.parseTableData.push({
        location: '-',
        desc: '-',
      });
    },
    addact() {
      this.acttableData.push({
        description: '-',
        predictSlotName: '-',
        predictSlotDesc: '-',
      });
      this.actTypeValue.push('');
      this.emitUpdate();
    },
    addIntent() {
      this.intentTableData.push(1);
      this.intentOption.push([]);
      this.returnvalue.push('');
      this.emitUpdate();
    },
    parseselect(index) {
      if (this.parsetypeValue[index] && this.parsenameValue[index]) {
        this.parseTableData[index].location = this.parsetypeValue[index]
          + this.parsenameValue[index];
        this.parseTableData[index].desc = `${this.parsetypeValue[index]
          + this.parsenameValue[index]}说明`;
      }
    },
    actselect(index) {
      this.acttableData[index] = this.actOption
        .filter(el => el.classifierId === this.actTypeValue[index])[0];
      if (!this.isValid()) {
        this.selectbox[index].$el.dispatchEvent(event.createEvent('tooltip-hide'));
      }
      this.emitUpdate();
    },
    modelselect(index) {
      const id = this.intentmodel[index];
      this.intentOption[index] = this.intentAllList.filter(el => el.groupId === id)[0].intentList;
      this.intent[index] = '';
      this.emitUpdate();
    },
    emitUpdate() {
      // intentTableData: this.intentTableData,
      // intentOption: this.intentOption,
      // intentmodel: this.intentmodel,
      // intent: this.intent,
      // returnvalue: this.returnvalue,
      // isIntent: this.isIntent,
      const understandTab = {
        acttableData: this.acttableData,
        actTypeValue: this.actTypeValue,
        isAct: this.isAct,
      };
      this.$emit('update', understandTab);
      this.$emit('update:valid', this.isValid());
    },
    isValid() {
      let flag = true;
      this.actTypeValue.forEach((item) => {
        if (!item) {
          flag = false;
        }
      });
      return flag;
    },
    showToolTip() {
      this.$nextTick(() => {
        this.selectbox = [];
        this.acttableData.forEach((el, index) => {
          this.selectbox.push(this.$refs[`elselect${index}`]);
        });
        this.actTypeValue.forEach((item, index) => {
          if (!item) {
            this.selectbox[index].$el.dispatchEvent(event.createEvent('tooltip-show'));
          }
        });
      });
    },
    getIntent() {
      this.$api.getIntentList(this.robotID).then((res) => {
        this.intentAllList = res.data.result;
        this.intentmodelOption = this.intentAllList.map(el => ({
          label: el.name,
          value: el.groupId,
        }));
      }).catch((err) => {
        this.$message({
          message: `getIntentList error: ${err.message}`,
          type: 'error',
          showClose: true,
        });
      });
    },
  },
  mounted() {
    this.$on('showToolTip', this.showToolTip);
    this.appId = this.robotID;
    this.$api.getDialogActParserList(this.appId).then((data) => {
      this.actOption = data.data;
    }).catch((err) => {
      this.$message({
        message: `getDialogActparserList error: ${err.message}`,
        type: 'error',
        showClose: true,
      });
    });
    // intent 3.0 接口
    // this.getIntent();
  },
};
</script>

<style lang="scss" scoped>
#understand-set{
  padding: 0 20px;
  @include font-14px();
  color: $color-font-active;
  /deep/ .eltabSel .cell {
    overflow: visible !important;
  }
  .grey-block{
    height: 44px;
    line-height: 44px;
    background:rgba(240,240,240,1);
    border-radius:1px;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0 10px;
    margin-bottom: 10px;
    .title-set{
      color: #22242D;
      font-size: 12px;
      font-weight: 500;
    }
    .add-btn{
      background:rgba(233,233,233,1);
      border-radius:1px;
      height:25px;
      line-height: 25px;
      padding: 0 5px;
      margin-left: 12px;
      cursor: pointer;
    }
    .add-btned{
      color: #B8B8B8;
    }
  }
  .add-new-btn{
    color: #3D73FF;
    background: white;
    padding-top: 10px;
     span{
       cursor: pointer;
     }
  }
  .select-block{
    margin-top: 16px;
    .select-header{
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      line-height: 30px;
    }
    .content{
      background:rgba(240,240,240,1);
      border-radius:1px;
      .row{
        display: flex;
        flex-direction: row;
        padding: 5px 20px;
        .select-scope {
          width: 200px;
        }
        .text-scope{
          flex: 1;
        }
      }
    }
  }
}
</style>
