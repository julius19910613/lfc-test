const DOCOKER_LOG = '/api/v2/stats/dockerLog';

function getDockerLogs(uniqueID) {
  return this.$reqGet(`${DOCOKER_LOG}/${uniqueID}`).then(rsp => rsp.data);
}

export default {
  getDockerLogs,
};

