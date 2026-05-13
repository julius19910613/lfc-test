<template>
    <div class="upload-progress-wrapper" v-if="visible">
       <!--  <div class="circle">
            <img src="./circle.png" alt="">
            <section>
                {{importPercent}} %
            </section>
        </div>
        <p>{{text}}</p> -->
        <el-progress class="progress" type="circle" :percentage="importPercent" :stroke-width="8"></el-progress>
        <p>{{text}}</p>
    </div>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: '数据导入中，请稍后...',
    },
    importPercent: {
      type: Number,
      default: 0,
    },
    visible: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="scss">
// @-webkit-keyframes circle{
//     0%{ transform:rotate(0deg); }
//     100%{ transform:rotate(360deg); }
// }
.upload-progress-wrapper{
    background: white;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    min-height: 306px;
    z-index: 0;
    // .circle{
    //     position: relative;
    //     img{
    //         display: inline-block;
    //         width: 190px;
    //         height: 190px;
    //         -webkit-animation: circle 1s infinite 0.5s;
    //     }
    //     section{
    //         position: absolute;
    //         width: 100%;
    //         top: 78px;
    //         font-size: 30px;
    //         text-align: center;
    //     }
    // }
    .progress{
        width: 132px;
        height: 132px;
        .el-progress__text{
            font-size: 20px !important;
        }
    }
    p{
        margin-top: 30px;
        font-size: 20px;
    }
}
</style>
