// 获取某个场景（主场景&子场景）所有问题节点的槽位
function getSlotsInNodes(standardNodes, resSlots, subScenarioName, commonSlotsInNodes) {
  if (standardNodes && standardNodes.length) {
    standardNodes.forEach((node) => {
      const desc = subScenarioName ? `${subScenarioName}-${node.title}` : node.title;
      if (node.slotFinder && node.slotFinder.slots && node.slotFinder.slots.length) {
        const nodeSlots = node.slotFinder.slots;
        nodeSlots.forEach((slot) => {
          // resSlots.push(`${node.id}.${slot.name}`);
          resSlots.push({
            title: `${node.id}.${slot.name}`,
            description: desc,
          });
        });
      }
      // 每个解析器都有默认槽位可选择：'触发次数', '解析失败次数', '核对失败次数', '无效输入次数'
      if (commonSlotsInNodes instanceof Array) {
        commonSlotsInNodes.forEach((slot) => {
          resSlots.push({
            title: `${node.id}.${slot}`,
            description: desc,
          });
        });
      }
    });
  }
}

export const commonSlotsInNodes = state => state.commonSlotsInNodes;
// 登录用户的userId
export const userId = state => state.userId;

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
              title: variant.name,
              description: '动作返回类型',
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
          title: variant.name,
          description: '全局变量',
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
            title: `gParser-${parser.name}-${slot.name}`,
            description: '场景解析器槽位',
          });
        });
      }
    });
  }
  return Array.concat(resSlots, resVariants, globalParserSlots);
};
