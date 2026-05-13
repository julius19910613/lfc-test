import Vue from 'vue';
import Router from 'vue-router';
import TaskEngineList from '../components/TaskEngineList';
import TaskEngineDetail from '../components/TaskEngineDetail';

Vue.use(Router);

const routes = [
  {
    path: '/',
    redirect: '/tde-list',
  },
  {
    path: '/tde-list',
    component: TaskEngineList,
  },
  {
    path: '/tde-detail/:taskId/:lastModified',
    component: TaskEngineDetail,
  },
];

const router = new Router({
  routes,
});
export default router;
