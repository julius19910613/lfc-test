import Vue from 'vue';
import Router from 'vue-router';
import modules from '@/modules';
import manageModules from '@/manage-modules';
// import ErrorPage from '@/components/layout/ErrorPage';
// import InDevelopment from '@/components/layout/InDevelopment';
// import Manage from '@/manage-modules/Manage';
const ErrorPage = () => import(
  /* webpackChunkName: "ErrorPage" */
  '@/components/layout/ErrorPage');
const InDevelopment = () => import(
  /* webpackChunkName: "InDevelopment" */
  '@/components/layout/InDevelopment');
const Manage = () => import(
  /* webpackChunkName: "Manage" */
  '@/manage-modules/Manage');

Vue.use(Router);

const inDevModules = [
  // 'new_tde',
  // 'parser_library',
  // 'skill_develop',
  'chat_qa',
  'chat_dictionary',
  // 'chat_story',
];
const routes = [
  {
    path: '/error',
    name: 'error',
    component: ErrorPage,
  },
];
inDevModules.forEach((module) => {
  routes.push({
    path: `/${module}`,
    name: module,
    component: InDevelopment,
  });
});
Object.keys(modules).forEach((moduleName) => {
  const pageModule = modules[moduleName];
  if (pageModule.path && pageModule.component) {
    routes.push({
      path: `/${pageModule.path}`,
      name: `${pageModule.displayNameKey}.module_name`,
      component: pageModule.component,
    });
  }

  if (!pageModule.pages) {
    return;
  }
  pageModule.pages.forEach((page) => {
    routes.push({
      path: `/${page.path}`,
      component: page.component,
      children: page.childrenPath || [],
    });
  });
});
console.log(modules);

let pages = [];
console.log(manageModules);
Object.keys(manageModules).forEach((moduleName) => {
  const mod = manageModules[moduleName];
  Object.keys(mod).forEach((pageKey) => {
    const childPages = mod[pageKey];
    // pages.push({
    //   path: `${page.path}`,
    //   name: `manage.${page.name}`,
    //   component: page,
    // });
    pages = pages.concat(childPages);
  });
});
routes.push({
  path: '/manage',
  name: 'manage',
  component: Manage,
  children: pages,
});

const router = new Router({
  routes,
});
export default router;
