const Adapter = () => import(
  /* webpackChunkName: "Adapter" */
  './Adapter.vue');
const APIAdapter = () => import(
  /* webpackChunkName: "APIAdapter" */
  './APIAdapter.vue');
const APIPrivate = () => import(
  /* webpackChunkName: "APIPrivate" */
  './APIPrivate.vue');

export default {
  displayNameKey: 'api_adapter',
  icon: '',
  hidden: false,
  pages: [
    {
      path: 'api-adapter',
      privCode: 'api_adapter',
      displayNameKey: 'api_adapter',
      icon: 'white_folder',
      component: Adapter,
    },
    {
      path: 'api-adapter',
      privCode: 'api_adapter',
      displayNameKey: 'APIAdapter',
      name: 'api-adapter',
      component: APIAdapter,
    },
    {
      path: 'api-private',
      privCode: 'api_private',
      displayNameKey: 'APIAdapter',
      name: 'api-private',
      component: APIPrivate,
    },
  ],
};
