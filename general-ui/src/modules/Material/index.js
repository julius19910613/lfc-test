const Material = () => import(
  /* webpackChunkName: "Material" */
  './Material.vue');

export default {
  displayNameKey: 'material',
  icon: 'menu_material',
  hidden: false,
  pages: [
    {
      path: 'material',
      displayNameKey: 'material',
      name: 'material',
      component: Material,
    },
  ],
};
