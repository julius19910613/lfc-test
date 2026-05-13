const state = {
  /*
  * General Data
  */
  // 登录用户信息：用户ID, 用户名，电话，企业类型（1=B端客户，2=C端客户），邮件
  userId: '',
  appId: '',
  // 解析器列表
  parsersList: [],
  // 意图列表
  intentsList: [],
  // 场景触发节点 - 触发条件类型
  optionsEntryTypes: [
    { label: '意图', value: 'INTENT' },
    { label: '正则表达式', value: 'REG_EXP' },
    // { label: 'Speech Act', value: 'SPEECH_ACT' },
  ],
  optionsSubEntryTypes: [
    { label: '意图', value: 'INTENT' },
    { label: '正则表达式', value: 'REG_EXP' },
    // { label: 'Speech Act', value: 'SPEECH_ACT' },
    { label: '条件', value: 'NORMAL' },
  ],
  optionsOperators: [
    { label: '无值', value: 'N_EXIST', single: true },
    { label: '有值', value: 'EXIST', single: true },
    { label: '值无效', value: 'INVALID', single: true },
    { label: '是肯定', value: 'YES', single: true },
    { label: '是否定', value: 'NO', single: true },
    { label: '结束', value: 'DONE', single: true },
    { label: '用户不知道', value: 'UNKNOWN', single: true },
    { label: '等于', value: 'EQ', single: false },
    { label: '不等于', value: 'NE', single: false },
    { label: '大于', value: 'GT', single: false },
    { label: '小于', value: 'LT', single: false },
    { label: '值来自上下文', value: 'FROM_CTX', single: true },
    { label: '值来自用户', value: 'FROM_USER', single: true },
  ],
  optionsRightTypes: [
    { label: '值', value: 'VAL' },
    { label: '变量', value: 'VAR' },
  ],
  optionsVariantTypes: ['STRING', 'BOOL', 'NUMBER'],
  /*
  * Detail Page
  */
  // Task Json Data store in database.
  taskJson: {},
  commonSlotsInNodes: ['触发次数', '解析失败次数', '核对失败次数', '无效输入次数'],
};

export default state;
