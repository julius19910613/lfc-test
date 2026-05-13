<template>
  <div class="popover-root">
    <el-popover
      ref="popover-comp-{{extData.entityId}}-{{extData.propertyId}}"
      placement="bottom-start"
      v-model="isShowSelf"
      @show="onShow"
      @hide="onClose"
      :trigger="trigger || 'click'"
      popper-class='popover-write-theme'
      :width='customWidth'
    >
    <!-- trigger:{{trigger}} --- category-{{extData.category}} {{  typeof extData.category}} -->
      <div class="title-wrap">{{title}}</div>
      <div class="content-wrap" v-if="contentView && isShowSelf">
        <component
          :is="contentView"
          ref="contentView"
          :extData="extData"
          @validateSuccess="validatePass"
        ></component>
      </div>
      <div class="action-wrap">
        <text-button
          v-on:click.stop="btnClick(false)"
          v-if="buttons.indexOf('cancel') != -1"
        >{{cancelText}}</text-button>
        <text-button
          :button-type="'fill'"
          v-on:click.stop="btnClick(true)"
          v-if="buttons.indexOf('confirm') != -1"
        >{{confirmText}}</text-button>
      </div>
      <div slot="reference" class="tags-wrap"  @click="onClick">
        <div v-if='subtype === "html"' :title="getHtml(tagsData[0])">
          <!-- <span v-html='getHtml(tagsData[0])'></span> -->
          <!-- <span>{{getHtml(tagsData[0]) || '-'}}</span> -->
          <tag class="tags">{{ getHtml(tagsData[0]) || '-'}}</tag>
        </div>
        <div v-else>
            <tag class="tags" v-if="typeof tagsData ==='string'">{{ tagsData }}</tag>
            <tag
              class="tags"
              v-else
              v-for="(tag, tagIdx) in tagsData"
              :key="`${tagIdx}-${tag}`"
            >{{ getEllipsisStr(tag, 8) || '-'}}</tag>
        </div>
        <!-- <component :is="referenceView" ref="referenceView"></component> -->
      </div>
    </el-popover>
  </div>
</template>

<script>
import TextButton from '@/components/basic/TextButton';
import Misc from '@/utils/js/misc';

export default {
  name: 'PopoverComp',
  props: {
    extDatas: {
      type: Object,
      default() {
        return {};
      },
    },
    tagsData: {
      type: [String, Array],
      default() {
        return [];
      },
    },
    subtype: {
      type: String,
    },
  },
  watch: {
    isShowSelf(val) {
      if (val) {
        this.$emit('opened', { instance: this, extData: this.extDatas });
      }
    },
  },
  components: {
    TextButton,
  },
  data() {
    return {
      isShowSelf: false,
      cbOk: (this.extDatas.callback || {}).ok,
      contentView: this.extDatas.component,
    };
  },
  computed: {

    extData() {
      return this.extDatas.extData || {};
    },
    // extDataId() {
    //   return this.extDatas.extDataId || Math.random();
    // },
    trigger() {
      return `${this.extData.category}` === '2' ? 'manual' : 'click';
    },
    buttons() {
      return this.extData.btns || ['cancel', 'confirm'];
    },
    cancelText() {
      return this.extData.cancelText || this.$t('general.cancel');
    },
    confirmText() {
      return this.extData.confirmText || this.$t('general.confirm');
    },
    title() {
      return this.extDatas.title || this.$t('knowledge_graph.type_string');
    },
    content() {
      return this.extData.content;
    },
    referenceView() {
      return this.extData.ReferenceView;
    },
    customWidth() {
      return `${this.extData.category}` === '2' ? this.extData.customWidth : '';
    },
  },
  methods: {
    getHtml(str) {
      try {
        return (JSON.parse(str) || {}).answer || '';
      } catch (error) {
        return str;
      }
    },
    onClick() {
      console.log('this.isShowSelf', this.isShowSelf);
      if (this.trigger === 'click') {
        this.isShowSelf = true;
      } else {
        this.isShowSelf = !this.isShowSelf;
      }
    },
    getEllipsisStr(str, num) {
      return Misc.getEllipsisStr(str, num);
    },
    onClose() {
      this.contentView = null;
    },
    onShow() {
      console.log('--popover:onshow:--', this.extDatas);
      this.contentView = this.extDatas.component;
    },
    closeSelf() {
      this.isShowSelf = false;
    },
    btnClick(flag = true) {
      if (!flag) {
        this.closeSelf();
      } else {
        this.$refs.contentView.$emit('validate');
      }
    },
    validatePass(param) {
      // console.log(1111, JSON.stringify(param, null, 2));
      this.closeSelf();
      if (this.cbOk) {
        this.cbOk.call(this, param || this.extData);
      }
    },
  },

  beforeMount() {
    // console.log('--popover:beforeMount:--', this.extDatas);
  },
};
</script>

<style lang="scss" scoped>
.title-wrap {
  @include font-14px;
  @include auto-overflow();
  display: flex;
  justify-content: start;
  align-items: center;
  height: 40px;
  color: #333;
}
.action-wrap {
  min-width: 280px;
  flex: 0 0 48px;
  max-height: 48px;
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .text-button {
    width: 48%;
  }
}
.tags-wrap {
  @include textEllipsis();
  cursor: pointer;
  .tags:hover {
    font-weight: bold;
  }
}
.tags {
  &.tag {
    margin: 0 2px;
    &:first-child {
      margin-left: 0px;
    }
  }
}
</style>

