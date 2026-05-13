const dataSorting = () => import('./dataSorting');
const searchSorting = () => import('./searchSorting');
const dataManage = () => import('./dataManage');

export default {
  displayNameKey: 'task_engine',
  icon: 'menu_te',
  pages: [
    {
      name: 'searchitem_sorting',
      path: 'search-sort',
      displayNameKey: 'searchitem_sorting',
      icon: 'white_task_engine',
      component: searchSorting,
    },
    {
      name: 'data_sorting',
      path: 'data-sort',
      displayNameKey: 'data_sorting',
      icon: 'white_task_engine',
      component: dataSorting,
    },
    {
      name: 'data_manage',
      path: 'search-manage',
      displayNameKey: 'data_manage',
      icon: 'white_task_engine',
      component: dataManage,
    },
  ],
};
