<template>
    <div class="op-result">
        <img v-show="status === 'success'" src="./trainSuccess.png">
        <img v-show="status === 'fail'" src="./trainFail.png">
        <h1>{{title}}</h1>
        <p v-show="subtitle.length > 0">{{subtitle}} </p>
        <span :class="{'red': errortext.length > 0}" v-show="errortext.length > 0">{{errortext}}</span>
        <span class="download" v-show="linktext.length > 0" @click="handleLinkOp" v-html="`<i class='icon-download'></i>${linktext}`"></span>
        <div class="btn-groups">
            <button v-show="btnPrimaryText.length > 0" class="btn-dark-blue btn-big" @click="handlePrimary">{{btnPrimaryText}}</button>
            <button v-show="btnBorderText.length > 0" v-for="(item, i) in btnBorderText" :key="i" class="btn-white-gray btn-big" @click="handleBorder(item)">{{item}}</button>
        </div>
    </div>
</template>

<script>

export default {
  props: {
    status: {
      type: String,
      default: 'success',
    },
    title: {
      type: String,
      default: '',
    },
    subtitle: {
      type: String,
      default: '',
    },
    linktext: {
      type: String,
      default: '',
    },
    errortext: {
      type: String,
      default: '',
    },
    btnPrimaryText: {
      type: String,
      default: '',
    },
    btnBorderText: {
      type: Array,
      default() {
        return [];
      },
    },
    trainTime: {
      type: String,
      default: '',
    },
  },
  methods: {
        // 链接操作
    handleLinkOp() {
      this.$emit('linkOp');
    },
        // 主按钮事件
    handlePrimary() {
      this.$emit('primaryOp');
    },
        // 辅按钮事件
    handleBorder(op) {
      this.$emit('borderOp', op);
    },
  },
};
</script>

<style lang="scss">
.op-result{
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        h1{
            height:20px;
            font-size:20px;
            font-weight:400;
            color: #333333;
            line-height:20px;
            margin-top: 50px;
        }
        p{
            margin-top: 10px;
            height:14px;
            font-size:14px;
            font-weight:400;
            color:#666666;
            line-height:14px;
        }
        span{
            display: inline-block;
            margin-top: 20px;
            color: #1875F0;
            height:14px;
            font-size:14px;
            font-weight:400;
            color:rgba(24,117,240,1);
            line-height:14px;
            &.red{
                color: #F25C62;
            }
            &.download{
                cursor: pointer;
            }
            i.icon-download{
                @include icon('./download_blue.svg', 14px, 14px);
            }
        }
        .btn-groups{
            button{
                margin-top: 50px;
                margin-left: 10px;
                &:first-child{
                    margin-left: 0;
                }
            }
        }

    }
</style>
