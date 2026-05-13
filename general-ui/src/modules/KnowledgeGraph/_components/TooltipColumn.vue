<template>
  <el-table-column :label="colConfig.label" :width="200">
    <div slot-scope="{ row }" class="operations">
        <el-tooltip placement="bottom">
            <div slot="content">
                <div class="expect_columns">
                    <div>{{ $t('knowledge_graph.material_manage.expectIntent') }}</div>
                    <div>{{ row['expectIntent'] }}</div>
                </div>
                <div class="expect_columns">
                    <div>{{ $t('knowledge_graph.material_manage.expectResult') }}</div>
                    <div>{{ row['expectResult'] }}</div>
                </div>
            </div>
            <div>{{ row[colConfig.prop] }}</div>
        </el-tooltip>
    </div>
  </el-table-column>
</template>

<script>
  import api from '../_api/knowledgeGraph';

  export default {
    name: 'OperationColumn',
    props: ['colConfig', 'canEdit', 'canTest', 'canImport'],
    api,

    methods: {
    },

  };
</script>

<style scoped>
.operations {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
}

.expect_columns {
    display: flex;
    flex-direction: column;
    margin-bottom: 10px;
}

</style>
