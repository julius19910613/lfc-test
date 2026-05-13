<template>
  <div id="task-engine-v3">
    <wizard-mode></wizard-mode>
  </div>
</template>

<script>
import Vue from 'vue';
import VueSelect from 'vue-select';
import VueCookie from 'vue-cookie';
import VueUUID from 'vue-uuid';
import ToggleButton from 'vue-js-toggle-button';
import VueOnToast from 'vue-on-toast';

Vue.component('v-select', VueSelect);
Vue.use(VueCookie);
Vue.use(VueUUID);
Vue.use(ToggleButton);
Vue.use(VueOnToast);

export default {
  privCode: 'task_engine',
  components: {
    'wizard-mode': () => import('./TaskEngineV3/src/components/WizardMode'),
  },
  data() {
    return {
    };
  },
  computed: {},
  watch: {},
  methods: {},
};
</script>
