export default {
  data() {
    return {
      /**
       * lt：less than 小于
        le：less than or equal to 小于等于
        eq：equal to 等于
        ne：not equal to 不等于
        ge：greater than or equal to 大于等于
        gt：greater than 大于
       */
      MIXIN_OP_TYPE: { // 操作符
        GT: 'gt',
        GE: 'ge',
        NE: 'ne',
        EQ: 'eq',
        LE: 'le',
        LT: 'lt',
      },
      MIXIN_REGEXP_TYPE: { // 正则类型
        SPACE: /\s+/g, // 空格
        ENTER_AND_BREAK: /\r\n/g, // 回车+ 换行符
        BREAK: /\n/g, // 换行符
      },
      MIXIN_EMPTY_STRING: '', // 空字符串
      MIXIN_ENTITY_MAX_LENGTH: 50, // 实体名称最大长度
      checkEntityNameDataBase: {}, // 实体名称校验数据参数
      MIXIN_PROPERTY_MAX_LENGTH: 50, // 属性名称最大长度
      checkPropertyNameDataBase: {}, // 属性名称校验数据参数
      MIXIN_UNIT_MAX_LENGTH: 50, // 单位字符最大长度
      checkUnitNameDataBase: {}, // 单位字符校验数据参数
      debug: true,
    };
  },
  mounted() {
    this.checkEntityNameDataBase = {
      len: this.MIXIN_ENTITY_MAX_LENGTH,
      debug: this.debug,
    };
    this.checkPropertyNameDataBase = {
      len: this.MIXIN_PROPERTY_MAX_LENGTH,
      debug: this.debug,
    };
    this.checkUnitNameDataBase = {
      len: this.MIXIN_UNIT_MAX_LENGTH,
      debug: this.debug,
    };
  },
  methods: {
    /**
     * 字符串长度校验 默认小于等于
     * @param {*} str 😳检查字符串
     * @param {*} len 长度
     * @param {*} op 操作符 link: MIXIN_OP_TYPE
     */
    onStrLengthCheck({ str = '', len = 1, op = 'le', errMsg, debug, enableEmpty = false, isShowEmptyTip, emptyErrMsg }) {
      if (debug) {
        console.log('onStrLengthCheck: str', str);
        console.log('onStrLengthCheck: len', len);
        console.log('onStrLengthCheck: op', op);
        console.log('onStrLengthCheck: errMsg', errMsg);
      }
      let result = true;
      if (typeof str !== 'string') {
        console.error('onStrLengthCheck:type:error:', typeof str, JSON.stringify(str, null, 2));
        return false;
      }
      if (!str) {
        console.error(`onStrLengthCheck:error:${str}`);
        if (isShowEmptyTip && !enableEmpty) {
          this.$message({
            message: emptyErrMsg || '参数不能为空, 请检查！',
            type: 'error',
          });
        }
        return false || enableEmpty;
      }
      const strLen = str.length;
      if (op === this.MIXIN_OP_TYPE.GT) {
        result = strLen > len;
      } else if (op === this.MIXIN_OP_TYPE.GE) {
        result = strLen >= len;
      } else if (op === this.MIXIN_OP_TYPE.NE) {
        result = strLen >= len;
      } else if (op === this.MIXIN_OP_TYPE.EQ) {
        result = strLen === len;
      } else if (op === this.MIXIN_OP_TYPE.LE) {
        result = strLen <= len;
      } else if (op === this.MIXIN_OP_TYPE.LT) {
        result = strLen < len;
      } else {
        console.error(`onStrLengthCheck:error: op not in: ${JSON.stringify(this.MIXIN_OP_TYPE)}`);
        result = false;
      }
      if (!result && !!errMsg) {
        this.$message({
          message: errMsg,
          type: 'error',
        });
      }
      if (debug) {
        console.error(`onStrLengthCheck:result: ${result}`);
      }
      return result;
    },
    /**
     * 替换字符串内容
     * @param {Object} obj 参数
     * @param {String} str 需要替换的字符串
     * @param {String|Array} search 搜索值
     * @param {String} replace 替换值
     * @return 返回替换过的字符串
     */
    onReplaceStr({ str = '', search, replace, debug = false }) {
      if (debug) {
        console.log('onReplaceStr:str:', str);
        console.log('onReplaceStr:search:', search);
        console.log('onReplaceStr:replace:', replace);
      }
      if (typeof str !== 'string' || !str) {
        console.error('onReplaceStr:error:', JSON.stringify(str, null, 2));
        return str;
      }
      let result = str;
      if (search && typeof search === 'string') {
        result = str.replace(search, replace);
      } else if (search && Array.isArray(search)) {
        result = search.reduce((pre, next) => pre.replace(next, replace), str);
      }
      if (debug) {
        console.log('onReplaceStr:result:', result);
      }
      return result;
    },
    /**
     * 统一处理实体名称
     * @param {String} name 实体名称
     * 替换空格和换行符
     * @modify 20191211 取消对名称的各种限制,仅留下移除前后空格
     */
    onFormatName(name = '') {
      return name.trim();
      // return this.onReplaceStr({
      //   str: name,
      //   search: [this.MIXIN_REGEXP_TYPE.SPACE,
      //     this.MIXIN_REGEXP_TYPE.ENTER_AND_BREAK,
      //     this.MIXIN_REGEXP_TYPE.BREAK],
      //   replace: this.MIXIN_EMPTY_STRING,
      //   debug: true });
    },
  },
};
