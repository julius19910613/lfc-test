const License = () => import(
  /* webpackChunkName: "License" */
  './License.vue');
export default {
  pages: [
    {
      path: 'license',
      name: 'license',
      component: License,
    },
  ],
};
