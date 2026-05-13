<template>
  <div>
    <div class="h-fill w-fill module-wrapper">
      <img :src="currentImagePath"/>
      <!-- <div class="card module-content">
        <div class="title-wrapper">
          <h1 class="title">{{$t(`developing_modules.${currentModule}_title`)}}</h1>
          <span class="description">{{$t(`developing_modules.${currentModule}_description`)}}</span>
        </div>
        <div class="img-box"><img :src="currentImagePath"/></div>
      </div>
      <h1 class="dev-title">{{$t('developing_modules.developing')}}</h1> -->
    </div>
  </div>
</template>

<script>
export default {
  path: 'new-tde',
  privCode: 'management',
  displayNameKey: 'chat',
  name: 'new-tde',
  data() {
    return {
      modules: {
        '/new_tde': 'new_tde',
        '/parser_library': 'parser_library',
        '/skill_develop': 'skill_develop',
        '/chat_qa': 'chat_qa',
        '/chat_dictionary': 'chat_dictionary',
        '/chat_story': 'chat_story',
      },
    };
  },
  computed: {
    currentPath() {
      return this.$route.path;
    },
    currentModule() {
      return this.modules[this.currentPath] || '';
    },
    currentImagePath() {
      return `../../../../static/images/modules/${this.currentModule}.svg`;
    },
  },
};
</script>

<style lang="scss" scoped>
.module-wrapper{
  // display: flex;
  // flex-direction: column;
  // align-items: center;
  // padding-top: 40px !important;
  height: 100%;
  padding: 20px 0px;
  overflow-y: auto;
  img{
    width: 100%;
  }
  // .module-content{
  //   padding: 20px;
  //   width: 80%;
  //   min-height: 496px;
  //   border-radius: 17px !important;
  //   .title-wrapper{
  //   display: flex;
  //   align-items: center;
  //   margin-bottom: 20px;
  //     .title{
  //       display: inline-block;
  //       color: #333333;
  //       font-weight:100;
  //       font-size: 24px;
  //       font-weight:100;
  //     }
  //     .description{
  //       margin-left: 20px;
  //       font-size:14px;
  //       color: #3D4B63;
  //       font-weight:400;
  //     }
  //   }
  //   .img-box{
  //     width: 100%;
  //     min-height: 300px;
  //     display: flex;
  //     align-items: center;
  //     img{
  //       width: 100%;
  //     }
  //   }
  // }
  // .dev-title{
  //   margin-top: 40px;
  //   font-size:30px;
  //   font-weight:300;
  // }
}
</style>