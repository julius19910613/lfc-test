<template>
  <el-table-column :label="colConfig.label" :width="120">
    <div slot-scope="{ row }" class="operations">
      <!-- <text-button button-type="primary" @click="handleBrowse(row)" >
        {{$t('general.browse')}}
      </text-button> -->
      <el-button v-if="canTest" type="text" @click.stop="triggerKGTest(row)">
        {{$t('knowledge_graph.material_manage.test')}}
      </el-button>
      <el-button class="error-btn" v-if="canEdit" type="text" @click.stop="handleDelete(row)">
        {{$t('general.delete')}}
      </el-button>
    </div>
  </el-table-column>
</template>

<script>
  import TestResultPop from './popups/TestResultPop';
  import api from '../_api/knowledgeGraph';

  export default {
    name: 'OperationColumn',
    props: ['colConfig', 'canEdit', 'canTest', 'canImport'],
    api,

    methods: {
      handleBrowse(row) {
        console.log(row);
        this.$api.getTestDetailInfo(row.task_id).then((res) => {
          const resultList = res.data.checkresults;

          const options = {
            component: TestResultPop,
            title: this.$t('knowledge_graph.material_manage.test_report'),
            extData: {
              resultList,
              // KGEntityDropList: this.KGEntityDropList,
              // KGPropertyDropList: this.KGPropertyDropList,
              // KGFuncPropertyDropList: this.KGFuncPropertyDropList,
            },
            validate: false,
            callback: {
              ok: () => {
              },
            },
          };

          this.$pop(options);
        });
      },

      triggerKGTest(row) {
        this.$emit('triggerKGTest', row);
      },
      handleDelete(row) {
        this.$emit('deleteRecord', row);
      },
    },

  };
</script>

<style scoped>
.error-btn {
  color: #F25C62;
}

.operations {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

</style>
