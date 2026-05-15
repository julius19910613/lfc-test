import { addParameters } from '@storybook/vue';
import Vue from 'vue';
import Vuex from 'vuex';

// Import custom components
import Icon from '../src/components/basic/Icon';
import Tag from '../src/components/basic/Tag';
import Textbutton from '../src/components/basic/TextButton';
import SearchInput from '../src/components/basic/SearchInput';

// Import plugins
import tooltip from '../src/plugins/tooltip';
import dropdown from '../src/plugins/dropdown';
import CustomNotification from '../src/plugins/CustomNotification';
import PopWindow from '../src/plugins/PopWindow';

// Install Vue plugins
Vue.use(Vuex);
Vue.use(tooltip);
Vue.use(dropdown);
Vue.use(PopWindow);
Vue.use(CustomNotification, { delay: 4000 });

// Register global components
Vue.component('icon', Icon);
Vue.component('tag', Tag);
Vue.component('text-button', Textbutton);
Vue.component('search-input', SearchInput);

// Import styles
import '../src/assets/styles/reset.scss';
import '../src/assets/styles/main.scss';

addParameters({
  options: {
    name: 'BFOP General Components',
    url: '#',
    showPanel: true,
    panelPosition: 'right',
  },
});
