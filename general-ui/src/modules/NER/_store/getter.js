// eslint-disable-next-line
export const currentTestStatus = (s) => {
  if (!s.currentParserId) {
    return false;
  }
  return s.testingStatus[s.currentParserId] || false;
};

export const testingStatus = s => s.testingStatus;

export const currentParserId = s => s.currentParserId;
