<template>
    <div
        @click="$emit('click', $event)"
        @mouseenter="hoverIn"
        @mouseleave="hoverOut"
    >
        <img :src="IconSrc">
    </div>
</template>

<script>
import tableEdit1 from '../../../assets/images/table_edit_1.svg';
import tableEdit1hl from '../../../assets/images/table_edit_1_hl.svg';
import tableEdit2 from '../../../assets/images/table_edit_2.svg';
import tableEdit2hl from '../../../assets/images/table_edit_2_hl.svg';
import tableView from '../../../assets/images/table_view.svg';
import tableViewhl from '../../../assets/images/table_view_hl.svg';


const iconTypes = {
  tableEdit1,
  tableEdit1hl,
  tableEdit2,
  tableEdit2hl,
  tableView,
  tableViewhl,
};

export default {
  name: 'click-icon',
  props: {
    iconType: {
      type: String,
      default: 'tableEdit1',
    },
  },

  data() {
    return {
      IconSrc: '',
      highLightSrc: '',
      normalSrc: '',
    };
  },

  mounted() {
    this.IconSrc = iconTypes[this.iconType];
    this.getIconSrcPair();
  },

  methods: {
    getIconSrcPair() {
      if (this.iconType === 'tableEdit1') {
        this.IconSrc = tableEdit1;
        this.normalSrc = tableEdit1;
        this.highLightSrc = tableEdit1hl;
      } else if (this.iconType === 'tableEdit2') {
        this.IconSrc = tableEdit2;
        this.normalSrc = tableEdit2;
        this.highLightSrc = tableEdit2hl;
      } else if (this.iconType === 'tableView') {
        this.IconSrc = tableView;
        this.normalSrc = tableView;
        this.highLightSrc = tableViewhl;
      }
    },

    hoverIn() {
      this.IconSrc = this.highLightSrc;
    },
    hoverOut() {
      this.IconSrc = this.normalSrc;
    },
  },
};

</script>
<style scoped>

</style>