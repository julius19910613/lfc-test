 <template>
  <el-table :data="data"
            :height = height
            :default-sort = sort
            :row-class-name="tableRowClassName"
            @row-click="handleClick"
            :empty-text="$t('general.no_data')"
            >
    <template slot="empty">
      <div>{{ $t('general.no_data') }}</div>
    </template>
    <template v-for="colConfig in colConfigs">
      <slot v-if="colConfig.slot" :name="colConfig.slot"/>
      <component
        :key="colConfig.id"
        v-else-if="colConfig.component"
        :is="colConfig.component"
        :col-config="colConfig"
        :canEdit = 'canEdit'
        :canTest = 'canTest'
        :canImport = 'canImport'
        @triggerKGTest = "triggerKGTest"
        @deleteRecord = "deleteRecord"
      >
      </component>
        <el-table-column v-else
          v-bind="colConfig"
          :sortable= "colConfig.sortable"
        ></el-table-column>
    </template>
  </el-table>

</template>
<script>
  import { mapGetters } from 'vuex';
  import api from '../_api/knowledgeGraph';

  export default {
    name: 'OperationTable',
    props: ['colConfigs', 'data', 'height', 'sort', 'canEdit', 'canTest', 'canImport'],
    api,
    computed: {
      ...mapGetters([
        'robotID',
      ]),
    },

    data() {
      return {
        timer: null,
      };
    },

    methods: {
      handleClick(row) {
        console.log(row);
        this.$emit('selectRow', row);
      },

      tableRowClassName({ row }) {
        // console.log(row);
        if (row.check_result !== undefined && row.check_result === 'False') {
          return 'warning-row';
        } else if (row.check_result !== undefined && row.check_result === 'True') {
          return 'success-row';
        }
        return '';
      },

      deleteRecord(row) {
        this.$emit('deleteRecord', row);
      },

      triggerKGTest(row) {
        this.$emit('triggerKGTest', row);
      },

    //   triggerKGTest(row) {
    //     console.log(row);
    //     const rowIndex = row.id;
    //     this.changeTestStatus(rowIndex);
    //     if (row.datasetId && this.robotID) {
    //       this.$api.triggerKGTesting(this.robotID, row.datasetId).then((res) => {
    //       // this.intervalStartTesting(res.data.taskId);
    //         const id = this.robotID;
    //         this.timer = setInterval(
    //         () => this.intervalStartTesting(id, res.data.data.taskId, rowIndex), 1000);
    //       });
    //     }
    //   },

    //   intervalStartTesting(robotId, taskId, rowIndex) {
    //     console.log(this.robotID);
    //     return this.$api.getLastTestResultStatus(robotId, taskId).then((res) => {
    //       if (res.data.data.result !== '-1') {
    //         this.displayFinishStatus(res.data, rowIndex, taskId);
    //         clearInterval(this.timer);
    //       }
    //       return new Promise((resolve) => { resolve(); });
    //     });
    //   },

    //   displayFinishStatus(result, rowIndex, taskId) {
    //     const selectedRow = this.data[rowIndex];
    //     // const newData = {
    //     //   dataset: result.dataset,
    //     //   task_id: result.task_id,
    //     //   status: this.$t('knowledge_graph.material_manage.finished'),
    //     //   result: parseFloat(result.result),
    //     // };
    //     selectedRow.status = this.$t('knowledge_graph.material_manage.finished');
    //     selectedRow.taskId = taskId;
    //     selectedRow.result = result.data.result;
    //     this.data.splice(rowIndex, 1, selectedRow);
    //   },

    //   changeTestStatus(rowIndex) {
    //     const selectedRow = this.data[rowIndex];
    //     // const selectIndex = this.data.indexOf(selectedRow);
    //     selectedRow.status = this.$t('knowledge_graph.material_manage.processing');
    //     selectedRow.result = '0.0';
    //     this.data.splice(rowIndex, 1, selectedRow);
    //   },
    },

    beforeDestroy() {
      clearInterval(this.timer);
      this.timer = null;
    },
  };
</script>

<style lang="scss" scoped>
  @import '../../assets/styles/variable';

  /deep/ .warning-row {
    background-color: oldlace;
  }

  /deep/ .success-row {
    background-color: #f0f9eb;
  }
</style>
