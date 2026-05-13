// 生成uuid
function S4() {
  return (((1 + Math.random()) * 0x10000)).toString(16).substring(1);
}

// function getUUID() {
//   return `${S4()}${S4()}-${S4()}-${S4()}-${S4()}-${S4()}${S4()}${S4()}`;
// }

// 获取一个条件组的模板
function getConditionGroupTemplate(type) {
  const criteriaSet = {
    operator: 'OR',
    items: [
      {
        operator: 'AND',
        items: [
          {
            left: '',
            operator: type === 'trigger' ? 'N_EXIST' : 'EXIST',
          },
        ],
      },
    ],
  };
  return criteriaSet;
}

// 获取一个触发或一个结束的模板
function getTriggerExitTemplate(type) {
  const newCond = {
    criteriaSet: getConditionGroupTemplate(type),
    nlTemplates: {
      options: [''],
    },
  };
  return newCond;
}

// 获取当前节点确认信息模板
function getRightNowConfirmTemplate() {
  const confirm = {
    options: [
      {
        targets: [],
        nlTemplates: {
          options: [''],
        },
        fNlTemplates: {
          options: [''],
        },
      },
    ],
  };
  return confirm;
}

// 新增一组高级确认
function getAdvanceConfirmNodeTemplate(targetsArr) {
  const newConfirm = {
    criteriaSet: {
      operator: 'AND',
      items: [{
        operator: 'OR',
        items: [{ left: '', operator: '' }],
      }],
    },
    nlTemplates: {
      options: [''],
    },
    targets: Array.concat(targetsArr),
  };
  return newConfirm;
}

// 获取问题节点模板
function getTaskNodeTemplate(title) {
  const newNodeData = {
    id: `node-${title}`,
    title,
    slotFinder: {
      id: '',
      slots: [],
    },
    triggers: [
      getTriggerExitTemplate('trigger'),
    ],
    terminations: [
      getTriggerExitTemplate('exit'),
    ],
    failure: {
      nlTemplates: {
        options: [''],
      },
      maxTimes: 3,
      exceedMaxTimes: {
        action: '',
        nlTemplates: {
          enabled: true,
          options: [''],
        },
      },
    },
  };
  return newNodeData;
}

// 确认节点Template
function getConfirmTemplate(title, targets) {
  const confirmNode = {
    id: Math.random(),
    title,
    type: confirm,
    targets,
    // 确认话术
    nlTemplates: {
      options: [''],
    },
    // 确认节点 - 失败话术
    fNlTemplates: {
      options: [''],
    },
  };
  return confirmNode;
}

// 动作模板
function getActionTemplate(actionName) {
  const action = {
    id: `action-${S4()}`,
    name: actionName,
    type: '', // 'WEB_API_POST' 'WEB_API_GET'
    url: '',
    result: [
      // { name: 'province', type: 'STRING' }
    ],
  };
  return action;
}

// 空场景模板
function getEmptyScenarioTemplate(taskName) {
  const scenario = {
    taskId: '', // S4(), // getUUID(),
    taskName,
    published: false,
    entry: {
      id: 'entry',
      title: '开始触发',
      criteria: {
        operator: 'OR',
        items: [],
      },
      nlTemplates: {
        options: [''],
      },
    },
    nodeGroups: [],
    standardNodes: [],
    generalNodes: [
      {
        id: 'human-service',
        title: '转人工',
        entry: {
          criteriaSet: {
            operator: 'OR',
            items: [],
          },
        },
        standardNodes: [],
      },
      {
        id: 'task-finish',
        title: '退出',
        entry: {
          criteriaSet: {
            operator: 'OR',
            items: [],
          },
        },
        standardNodes: [],
      },
    ],
  };
  return scenario;
}

export default {
  getConditionGroupTemplate,
  getTriggerExitTemplate,
  getRightNowConfirmTemplate,
  getTaskNodeTemplate,
  getAdvanceConfirmNodeTemplate,
  getConfirmTemplate,
  getEmptyScenarioTemplate,
  getActionTemplate,
};
