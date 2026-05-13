// 获取某个场景（主场景&子场景）所有问题节点的槽位
function getSlotsInNodes(standardNodes, resSlots, subScenarioName, commonSlotsInNodes) {
  if (standardNodes && standardNodes.length) {
    standardNodes.forEach((node) => {
      // 主场景或子场景的问题节点，描述 = 节点 -（子场景名+节点名字|节点名字）- slot的中文描述
      const nodeName = subScenarioName ? `${subScenarioName}-${node.title}` : `${node.title}`;
      if (node.slotFinder && node.slotFinder.slots && node.slotFinder.slots.length) {
        const nodeSlots = node.slotFinder.slots;
        nodeSlots.forEach((slot) => {
          // resSlots.push(`${node.id}.${slot.name}`);
          let desc = nodeName;
          if (slot.label) {
            desc = `节点${nodeName}.${slot.label}`;
          }
          resSlots.push({
            value: `${node.id}.${slot.name}`,
            label: desc,
          });
        });
      }
      // 每个解析器都有默认槽位可选择：'触发次数', '解析失败次数', '核对失败次数', '无效输入次数'
      if (commonSlotsInNodes instanceof Array) {
        commonSlotsInNodes.forEach((slot) => {
          resSlots.push({
            value: `${node.id}.${slot}`,
            label: `节点${nodeName}.${slot}`,
          });
        });
      }
    });
  }
}

export const commonSlotsInNodes = state => state.commonSlotsInNodes;
// 登录用户的userId
export const userId = state => state.userId;

export const currenTasksList = state => state.tasksList;

export const appId = state => state.appId;

export const test = state => state.userId;

export const optionsEntryTypes = state => state.optionsEntryTypes;

export const optionsSubEntryTypes = state => state.optionsSubEntryTypes;

export const optionsOperators = state => state.optionsOperators;

export const optionsRightTypes = state => state.optionsRightTypes;

export const parsersList = (state) => {
  const parsers = state.parsersList;
  const nullParser = [{ id: 'empty', name: '无解析器' }];
  return nullParser.concat(parsers);
};

export const intentsList = state => state.intentsList;

export const taskJson = state => state.taskJson;

export const currentTaskName = state => state.taskJson.taskName;

export const currentTaskId = state => state.taskJson.taskId;

export const optionsVariantTypes = state => state.optionsVariantTypes;


// 全局动作
export const globalActions = (state) => {
  let actions = [];
  if (state.taskJson && state.taskJson.actions) {
    actions = state.taskJson.actions;
  }
  return actions;
};

// 全局变量 + 动作中的变量
export const allVariantsInScenario = (state) => {
  const res = [];
  if (state.taskJson.actions && state.taskJson.actions.length) {
    state.taskJson.actions.forEach((action) => {
      if (action.result && action.result.length) {
        action.result.forEach((variant) => {
          if (variant.name) {
            res.push({
              title: variant.name,
              description: '动作返回类型',
            });
          }
        });
      }
    });
  }
  if (state.taskJson.vars && state.taskJson.vars.length) {
    state.taskJson.vars.forEach((variant) => {
      if (variant.name) {
        res.push({
          title: variant.name,
          description: '全局变量',
        });
      }
    });
  }
  return res;
};

// 主场景和自场景中，每个节点所选择的解析器和槽位，返回【节点名称.槽位】
export const slotsInAllStandardNodes = (state) => {
  const resSlots = [];
  getSlotsInNodes(state.taskJson.standardNodes, resSlots, '', state.commonSlotsInNodes);
  if (state.taskJson.generalNodes && state.taskJson.generalNodes.length) {
    state.taskJson.generalNodes.forEach((genNodes) => {
      getSlotsInNodes(genNodes.standardNodes, resSlots, genNodes.title, state.commonSlotsInNodes);
    });
  }
  return resSlots;
};

export const selectionsWithDollar = (state) => {
  // 节点中的槽位
  const resSlots = [];
  getSlotsInNodes(state.taskJson.standardNodes, resSlots, '', state.commonSlotsInNodes);
  if (state.taskJson.generalNodes && state.taskJson.generalNodes.length) {
    state.taskJson.generalNodes.forEach((genNodes) => {
      getSlotsInNodes(genNodes.standardNodes, resSlots, genNodes.title, state.commonSlotsInNodes);
    });
  }
  // 动作列表中的变量
  const resVariants = [];
  if (state.taskJson.actions && state.taskJson.actions.length) {
    state.taskJson.actions.forEach((action) => {
      if (action.result && action.result.length) {
        action.result.forEach((variant) => {
          if (variant.name) {
            resVariants.push({
              value: variant.name,
              label: `动作返回类值.${variant.name}`,
            });
          }
        });
      }
    });
  }
  // 全局变量中的变量
  if (state.taskJson.vars && state.taskJson.vars.length) {
    state.taskJson.vars.forEach((variant) => {
      if (variant.name) {
        resVariants.push({
          value: variant.name,
          label: `全局变量.${variant.name}`,
        });
      }
    });
  }
  const globalParserSlots = [];
  // 全局解析器中的槽位
  if (state.taskJson.taskFinders && state.taskJson.taskFinders.length) {
    state.taskJson.taskFinders.forEach((parser) => {
      if (parser.slots && parser.slots.length) {
        parser.slots.forEach((slot) => {
          globalParserSlots.push({
            value: `gParser-${parser.name}-${slot.name}`,
            label: '场景解析器槽位',
          });
        });
      }
    });
  }
  return Array.concat(resSlots, resVariants, globalParserSlots);
};
