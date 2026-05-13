import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters([
      'screenHeight',
    ]),
  },
  methods: {
    tableHeight(ratio) {
      // console.log(this, 'tableHeight: ratio', ratio);
      return this.screenHeight * ratio;
    },
    // 指定table的唯一rowkey
    getRowKey() {
      return `Row-key:${Math.random()}`;
    },
    // 表格Header样式设置
    tableHeaderCellStyle(data, borderRight = false) {
      return `padding-left:${data.columnIndex === 0 ? '10px' : '0px'};
      background: #F7F7F7;
      color: #666666;
      border-right: ${borderRight ? '1px solid #EBEEF5' : 'none'};
      font-size:14px;`;
    },
    // 表格行样式设置
    tableCellStyle(data, borderRight = false) {
      return `border-right:${borderRight ? '1px solid #EBEEF5' : 'none'};
      font-size:14px;
      padding-left:${data.columnIndex === 0 ? '10px' : '0px'};`;
    },
  },
};
