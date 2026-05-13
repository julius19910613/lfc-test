<template>
  <div class="root">
    <tag
      class="tags"
      v-for="(tag, tagIdx) in tagsData"
      :key="`${tagIdx}-${tag}`"
      :fontClass="fontClass"
    >{{ tag }}</tag>
  </div>
</template>
<script>

export default {
  name: 'customComponent',
  computed: {
    tagsData() {
      return ['a', 'b', 'cc'];
    },
  },
};
</script>
<style lang="scss" scoped>
.root {
}
</style>
