export default {
  getTagList(modelDAta) {
    const tonodeList = ['成功', '失败'];
    const origToNodeLabelsList = [];
    modelDAta.forEach((item) => {
      if (item.edgeTab2) {
        if (item.edgeTab2.exceedThenGotoLabels) {
          item.edgeTab2.exceedThenGotoLabels.forEach((el) => {
            tonodeList.push(el);
          });
        }
        if (item.edgeTab2.normalEdges) {
          item.edgeTab2.normalEdges.forEach((el) => {
            if (el.to_node_labels) {
              el.to_node_labels.forEach((elitem) => {
                tonodeList.push(elitem);
              });
            }
          });
        }
        if (item.edgeTab2.elseIntoNodeLabels) {
          item.edgeTab2.elseIntoNodeLabels.forEach((el) => {
            tonodeList.push(el);
          });
        }
      }
      if (item.edgeTab) {
        if (item.edgeTab.normalEdges) {
          item.edgeTab.normalEdges.forEach((el) => {
            if (el.to_node_labels && el.to_node_labels.length > 0) {
              el.to_node_labels.forEach((elitem) => {
                tonodeList.push(elitem);
              });
            }
          });
        }
        if (item.edgeTab.exceedThenGotoLabels) {
          item.edgeTab.exceedThenGotoLabels.forEach((el) => {
            tonodeList.push(el);
          });
        }
        if (item.edgeTab.elseIntoNodeLabels) {
          item.edgeTab.elseIntoNodeLabels.forEach((el) => {
            tonodeList.push(el);
          });
        }
      }
    });
    tonodeList.forEach((exitem) => {
      if (origToNodeLabelsList.indexOf(exitem) === -1) {
        origToNodeLabelsList.push(exitem);
      }
    });
    return origToNodeLabelsList;
  },
};

