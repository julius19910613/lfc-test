<template>
  <div class="debugger-tool-wrapper">
    <div class="title-bar"> 
      <h1 class="title">{{$t('debugger_tool.troubleshooting')}}</h1>
      <el-button @click="toPreviousPage">
        {{ $t('general.go_back') }}
      </el-button>
    </div>
    <div class="filter-bar">
      <label class="search-label">Unique ID</label>
      <el-input ref="uniqueIDSearchBox" 
        class="search-input" v-model="searchUniqueID"
        size="mini" 
        :placeholder="$t('debugger_tool.unique_id_input_placeholder')"
      ></el-input>
      <el-button type="primary" @click="handleSearchDockerLogs">{{$t('debugger_tool.search')}}</el-button>
      <el-button @click="handleResetDockerLogs">{{$t('debugger_tool.reset')}}</el-button>
    </div>
    <div class="content-wrapper">
      <!-- <div class="result-list-wrapper">
        <h1 class="result-title">{{$t('debugger_tool.search_result')}}</h1>
        <div class="result-list">
          <div v-for="(item, index) in dockerList" :key="index" @click="handleSelectModule(item, index)">
            <div v-if="item.type !== 'Error'"
            class="result-item correct-item" :class="{'selected': selectedIndex === index}">
              <span>{{item.container}}</span>
              <i class="correct-icon"></i>
            </div>
            <div v-else
            class="result-item error-item"  :class="{'selected': selectedIndex === index}">
              <span>{{item.container}}</span>
              <i class="error-icon"></i>
            </div>
          </div>
          <div class="loading-box" v-if="isLoading">
            <loading-dot class="loading-line"></loading-dot>
          </div>
        </div>
      </div> -->
      <div class="result-detail-wrapper">
        <!-- 请选择一个模块来查看日志详情 -->
        <div id="jsoneditor" style="margin: 10px"></div>
      </div>
    </div>
  </div>
</template>

<script>
// import JSONEditor from 'jsoneditor';
import JSONFormatter from 'json-formatter-js';
import api from './_api/debuggertool';

export default {
  privCode: 'management',
  api,
  data() {
    return {
      searchUniqueID: '',
      isLoading: false,
      dockerList: [],
      selectedIndex: -1,
    };
  },
  mounted() {
    if (this.$route.query.unique_id) {
      this.searchUniqueID = this.$route.query.unique_id;
      this.handleSearchDockerLogs();
    }
  },
  methods: {
    toPreviousPage() {
      this.$router.go(-1);
    },
    clearLogs() {
      const resBlock = document.getElementById('jsoneditor');
      if (resBlock.childNodes && resBlock.childNodes.length > 0) {
        resBlock.removeChild(resBlock.childNodes[0]);
      }
      return resBlock;
    },
    updateLogs(logs) {
      this.formatter = new JSONFormatter(logs, Infinity, {
        theme: 'dark',
      });
      this.clearLogs();
      const resBlock = document.getElementById('jsoneditor');
      resBlock.appendChild(this.formatter.render());
    },
    handleSelectModule(item, index) {
      this.selectedIndex = index;
      this.updateLogs(item.logs || []);
    },
    handleSearchDockerLogs() {
      if (this.searchUniqueID === '') {
        this.$refs.uniqueIDSearchBox.focus();
        return;
      }
      this.isLoading = true;
      this.$api.getDockerLogs(this.searchUniqueID).then((res) => {
        this.dockerList = res.result || [];
        if (this.dockerList.length > 0) {
          this.handleSelectModule(this.dockerList[0], 0);
        }
      }).catch(() => {
        this.$message({
          message: this.$t('debugger_tool.fetch_fail'),
          type: 'error',
        });
      }).finally(() => {
        this.isLoading = false;
      });
    },
    handleResetDockerLogs() {
      this.searchUniqueID = '';
      this.dockerList = [];
      this.clearLogs();
    },
  },
};
</script>

<style lang="scss" scoped>
.debugger-tool-wrapper{
  background-color: #F7F7F7;
  padding: 10px 10px 10px 10px !important;
  display: flex;
  flex-direction: column;
  .title-bar {
    background-color: #ffffff;
    height: 60px;
    padding: 28px 20px 12px 20px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    .title{
      color: #333333;
      font-size: 18px;
      line-height: 24px;
    }

  }
  
  .filter-bar{
    // margin-top: 20px;
    padding: 20px;
    display: flex;
    align-items: center;
    background-color: #FFFFFF;
    box-shadow: 0px 0px 5px 0px rgba(102,102,102,0.08);;
    border-radius: 1px;
    .search-label{
      width: 100px;
      font-size: 14px;
      color: #666666;
    }
    .search-input{
      margin-left: 10px;
      /deep/ input{
        font-size: 14px;
        width: 230px;
      }
    }
    .btn-operate{
      margin-left: 10px;
    }
  }
  .content-wrapper{
    flex: 1;
    // margin-top: 20px;
    display: flex;
    overflow: hidden;
    .result-list-wrapper{
      flex: 1;
      background-color: #FFFFFF;
      display: flex;
      flex-direction: column;
      border-radius: 2px;
      .result-title{
        line-height: 24px;
        padding: 20px;
        font-size: 16px;
        color: #333333;
        box-shadow: 0px 1px 0px 0px #E9E9E9;
        border-radius: 2px 2px 0px 0px;
      }
      .result-list{
        flex: 1;
        overflow-y: auto;
        padding: 10px;
        position: relative;
        .loading-box{
          position: absolute;
          top: 0;
          left: 0;
          z-index: 1;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #FFFFFF3C;
        }
        .result-item{
          height: 40px;
          line-height: 40px;
          font-size: 12px;
          border-radius: 2px;
          padding: 0 10px;
          position: relative;
          span{
            display: inline-block;
            width: calc(100% - 50px);
            height: 40px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: normal;
            word-break: break-all;
          }
          &:hover{
            background-color: #F7F7F7;
          }
          &.correct-item{
            .correct-icon{
              position: absolute;
              right: 0px;
              top: 12px;
              @include icon('../../assets/icons/correct.svg', 14px, 14px);
            }
            &.selected{
              background-color: #21C695;
              color: #FFFFFF;
              .correct-icon{
                @include icon('../../assets/icons/correct_select.svg', 14px, 14px);
              }
            }
          }
          &.error-item{
            .error-icon{
              position: absolute;
              right: 0px;
              top: 12px;
              @include icon('../../assets/icons/error.svg', 14px, 14px);
            }
            &.selected{
              background-color: #F25C62;
              color: #FFFFFF;
              .error-icon{
                @include icon('../../assets/icons/error_select.svg', 14px, 14px);
              }
            }
          }
        }
      }
    }
    .result-detail-wrapper{
      flex: 1;
      overflow-y: auto;
      background-color: #252B3C;
      // margin-left: 20px;
      border-radius: 2px;
      padding: 20px;
      color: #FFFFFF;
      font-size: 14px;
      line-height: 21px;
    }
  }
}
.json-formatter-key, .json-formatter-string, .json-formatter-number, .json-formatter-bracket{
  color: #FFFFFF;
}
</style>
