import qs from 'qs';

const V3_PREFIX = '/auth/v3';
const V4_PREFIX = '/auth/v4';

// function getRolesURL(enterpriseID) {
//   return `${V3_PREFIX}/enterprise/${enterpriseID}/roles`;
// }

function getRolesURLV4(enterpriseID) {
  return `${V4_PREFIX}/enterprise/${enterpriseID}/roles`;
}

function getRoleURL(enterpriseID) {
  return `${V3_PREFIX}/enterprise/${enterpriseID}/role`;
}

function getEnterpriseRoles(enterprise) {
  const rolesURL = getRolesURLV4(enterprise);
  return this.$reqGet(rolesURL).then(rsp => rsp.data.result);
}
function getEnterpriseRole(enterprise, id) {
  const roleURL = getRolesURLV4(enterprise);
  return this.$reqGet(`${roleURL}/${id}`).then(rsp => rsp.data.result);
}
function updateEnterpriseRole(enterprise, id, role) {
  const roleURL = getRoleURL(enterprise);
  const options = {
    name: role.name,
    privilege: JSON.stringify(role.privileges),
    products: JSON.stringify(role.products),
  };

  return this.$reqPut(`${roleURL}/${id}`, qs.stringify(options), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  }).then(rsp => rsp.data);
}
function addEnterpriseRole(enterprise, role) {
  const roleURL = getRoleURL(enterprise);
  const options = {
    name: role.name,
    privilege: JSON.stringify(role.privileges),
    products: JSON.stringify(role.products),
  };

  return this.$reqPost(`${roleURL}`, qs.stringify(options), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  }).then(rsp => rsp.data);
}
function deleteEnterpriseRole(enterprise, id) {
  const roleURL = getRoleURL(enterprise);
  return this.$reqDelete(`${roleURL}/${id}`, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  }).then(rsp => rsp.data);
}

function getMenuPages(enterprise) {
  return this.$reqGet(`${V4_PREFIX}/menus/${enterprise}`).then(rsp => rsp.data.result);
}

export default {
  getEnterpriseRoles,
  getEnterpriseRole,
  updateEnterpriseRole,
  addEnterpriseRole,
  deleteEnterpriseRole,
  getMenuPages,
};
