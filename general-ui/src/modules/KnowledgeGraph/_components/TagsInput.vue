<template>
  <div class="muli-tags" @click="focus">
    <button
      class="btn"
      v-for="(tag, index) in tags"
      :key="index"
      @click="delTag(index)"
      :title="tag"
    >
      <div class="span-tag">{{tag||'-'}}</div>
      <i class="el-icon-error close-icon"></i>
    </button>
    <input
      v-if="isShowInput"
      :disabled='tagsCount >= maxTagCount'
      :placeholder="holderText"
      :maxlength="content_max_length"
      style="border-style:none"
      class="tag-input"
      type="text"
      ref="input"
      @keyup.enter="add"
      @keydown.delete="del"
      @keydown.188="split"
      v-model="current"
    />
  </div>
</template>

<script>
import Utils from '@/utils/js/misc';
import MixinValidate from '../_mixin/Validate';

export default {
  name: 'TagsInput',

  props: {
    value: Array,
    required: true,
    default: () => [],

    enableEdit: {
      value: Boolean,
      required: false,
      default: true,
    },
    content_max_length: {
      type: Number,
      default: 10,
    },
    maxTagCount: {
      type: Number,
      default: Infinity,
    },
  },
  mixins: [MixinValidate],
  watch: {
    current() {
      this.$emit('tagInput', ''); // 20190606 必须要确认才可以添加
    },
  },
  methods: {
    focus() {
      if (this.enableEdit) {
        this.$nextTick(() => {
          const el = (this.$refs || {}).input || {};
          if (el.focus) {
            this.$refs.input.focus();
          }
        });
      }
    },
    split(e) {
      e.preventDefault();
      this.add(e);
    },
    add(e) {
      const tempName = this.onFormatName((e.target.value || '').trim());
      const errMsg = this.$t('knowledge_graph.entity_edit.str_length_error',
        { text: Utils.getEllipsisStr(tempName, 6), len: this.content_max_length });
      const check = this.onStrLengthCheck({
        len: this.content_max_length,
        str: tempName,
        errMsg });
      if (!check) {
        return;
      }
      if (this.tags.indexOf(tempName) > -1) {
        const message = `[${tempName}] ${this.$t('knowledge_graph.error.has_exist')}`;
        this.$message({
          message,
          type: 'error',
        });
        return;
      }
      if (this.tagsCount > this.maxTagCount) {
        this.$message({
          message: this.$t('knowledge_graph.error.max_tag_count'),
          type: 'error',
        });
        return;
      }
      this.tags.push(tempName);
      this.current = '';
      this.$emit('input', this.tags);
      this.$emit('addTags', tempName);
    },
    del(e) {
      if (!e.target.value.length) {
        this.tags.pop();
        this.$emit('input', this.tags);
      }
    },
    delTag(index) {
      const value = this.tags[index];
      this.tags.splice(index, 1);
      this.$emit('input', this.tags);
      this.$emit('deleteTags', value);
    },
  },
  computed: {
    isShowInput() {
      return this.enableEdit && this.tagsCount < this.maxTagCount;
    },
    tags() {
      return (this.value || []).slice();
    },
    holderText() {
      return this.$t(`knowledge_graph.${this.tags.length >= 1 ? 'enter_to_add_new' : 'enter_to_add'}`)
       + (this.maxTagCount !== Infinity ? `, ${this.$t('knowledge_graph.max_length_to_add', { count: this.maxTagCount })}` : '');
    },
    tagsCount() {
      return this.tags.length;
    },
  },
  data() {
    return {
      current: '',
    };
  },
};
</script>

<style lang="scss" scoped>
.muli-tags {
  width: 100%;
  /*padding: 5px 10px;*/
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
  border: 1px solid #ccc;
  input {
    // width: 100%;
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    &:focus {
      background: transparent;
      border: none;
      outline: none;
      box-shadow: 0px 0px 0px 0px;
    }
  }
  .btn {
    display: flex;
    margin: 2px;
    padding: 4px 5px;
    background: #D9DBE4;
    border-radius: 2px;
    border: 1px solid #eee;
    font-size: 12px;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    cursor: pointer;
    max-width: 150px;
    align-items: center;
    justify-content: center;
    .span-tag {
      max-width: 150px;
      @include textEllipsis();
    }
    .close-icon {
      margin-left: 5px;
      color: #999;
      margin-top: 2px;
      font-size: 14px;
      &:hover {
        color: #666;
      }
    }
    &:hover {
      box-shadow: 0 4px 9px 0 rgba(115, 115, 115, 0.2), 0 5px 8px 0 rgba(228, 228, 228, 0.5);
    }
  }
}
</style>
