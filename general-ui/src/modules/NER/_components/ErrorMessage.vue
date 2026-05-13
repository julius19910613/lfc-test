<template>
  <div class="error-message-wrapper">
    <p class="error-message-line" v-for="(msg, index) in errorMessages" :key="index">
      {{msg}}
    </p>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Object,
    },
  },
  computed: {
    errorMessages() {
      let errMsgArr = [];
      if (this.value.errorMessage) {
        errMsgArr = this.value.errorMessage.split(';');
      }
      return errMsgArr;
    },
  },
};
</script>

<style lang="scss" scoped>
.error-message-wrapper{
  width: 600px;
  padding: 0px 20px;
  .error-message-line{
    @include font-14px();
    margin-bottom: 5px;
  }
}
</style>