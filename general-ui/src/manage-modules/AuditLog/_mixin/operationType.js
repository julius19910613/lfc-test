const operationType = {
  data() {
    return {
      operationType: {
        all: this.$t('general.all'),
        add: this.$t('privileges.actions.create'),
        edit: this.$t('privileges.actions.edit'),
        delete: this.$t('privileges.actions.delete'),
        import: this.$t('privileges.actions.import'),
        export: this.$t('privileges.actions.export'),
        login: this.$t('privileges.actions.login'),
        logout: this.$t('privileges.actions.logout'),
        publish: this.$t('privileges.actions.publish'),
        active: this.$t('privileges.actions.active'),
        deactive: this.$t('privileges.actions.deactive'),
        mark: this.$t('privileges.actions.mark'),
        ignore: this.$t('privileges.actions.ignore'),
        cluster: this.$t('privileges.actions.cluster'),
        sq_add: this.$t('privileges.actions.sq_add'),
        sq_edit: this.$t('privileges.actions.sq_edit'),
        sq_delete: this.$t('privileges.actions.sq_delete'),
        sq_import: this.$t('privileges.actions.sq_import'),
        sq_publish: this.$t('privileges.actions.sq_publish'),
        lq_add: this.$t('privileges.actions.lq_add'),
        lq_edit: this.$t('privileges.actions.lq_edit'),
        lq_delete: this.$t('privileges.actions.lq_delete'),
        lq_import: this.$t('privileges.actions.lq_import'),
        ans_add: this.$t('privileges.actions.ans_add'),
        ans_edit: this.$t('privileges.actions.ans_edit'),
        test_import: this.$t('privileges.actions.test_import'),
      },
    };
  },
};

export default operationType;
