const robotModule = {
  data() {
    return {
      robotModuleList: [
        {
          id: 'all',
          name: this.$t('general.all'),
          privCode: [],
          operation: ['all', 'add', 'edit', 'delete', 'import', 'export', 'mark', 'ignore', 'publish', 'active', 'deactive', 'cluster'],
        },
        {
          id: 'ssm',
          name: this.$t('pages.ssm.module_name'),
          privCode: ['ssm', 'qa_label'],
          operation: ['all', 'add', 'edit', 'delete', 'import', 'export'],
        },
        {
          id: 'task_engine',
          name: this.$t('pages.task_engine.module_name'),
          privCode: ['task_engine'],
          operation: ['all', 'add', 'edit', 'delete', 'import', 'export', 'publish', 'active', 'deactive'],
        },
        {
          id: 'intent_engine',
          name: this.$t('pages.intent_engine.module_name'),
          privCode: ['intent_manage'],
          operation: ['all', 'add', 'edit', 'delete', 'import', 'export'],
        },
        {
          id: 'wordbank',
          name: this.$t('pages.wordbank.module_name'),
          privCode: ['wordbank'],
          operation: ['all', 'add', 'edit', 'delete', 'import', 'export'],
        },
        {
          id: 'statistics',
          name: this.$t('pages.statistics.module_name'),
          privCode: ['statistic_analysis', 'statistic_daily'],
          operation: ['all', 'export', 'mark', 'ignore', 'cluster'],
        },
        {
          id: 'robot_setting',
          name: this.$t('pages.robot_setting.module_name'),
          privCode: ['robot_profile', 'robot_function', 'robot_chat_skill', 'robot_command', 'integration', 'robot_config', 'robot_custom_chat'],
          operation: ['all', 'add', 'edit', 'delete', 'active', 'deactive'],
        },
        {
          id: 'material',
          name: this.$t('pages.material.module_name'),
          privCode: ['material_library'],
          operation: ['all', 'add', 'edit', 'delete'],
        },
        {
          id: 'ner',
          name: this.$t('pages.ner.module_name'),
          privCode: ['ner_factory'],
          operation: ['all', 'add', 'edit', 'import', 'export', 'delete', 'publish'],
        },
        {
          id: 'ssm3',
          name: this.$t('pages.ssm.module_name'),
          privCode: ['ssm3'],
          operation: [
            'all',
            'sq_add', 'sq_edit', 'sq_delete', 'sq_import', 'sq_publish',
            'lq_add', 'lq_edit', 'lq_delete', 'lq_import',
            'ans_add', 'ans_edit',
            'test_import',
          ],
        },
        // {
        //   id: 'dkg',
        //   name: this.$t('pages.knowledge_graph.module_name'),
        //   privCode: ['kg_audit_manage', 'kg_test_report', 'kg_data_manage'],
        //   operation: ['all', 'add', 'edit', 'delete'],
        // },
      ],
    };
  },
};

export default robotModule;
