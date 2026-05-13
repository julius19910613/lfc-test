/**
 * Created by emotibot on 2019/3/29.
 */
import zhCN from 'common-modules-zj/src/i18n/zh-cn';
import zhLocale from 'element-ui/lib/locale/lang/zh-CN';

const zh = {
  general: {
    reset: '重置',
    cancel: '取消',
    ok: '确认',
    error: '错误',
  },
  error_msg: {
    server_error: '服务器错误',
  },
  menu: {
    sq_answer: '标准问答',
    data_train: '数据训练',
    test_report: '测试及报告',
    post_online: '发布上线',
    corpus_change: '语料变更',
    question_change: '标准问变更',
    answer_change: '回答变更',
    have_to_train: '已有数据变动，必须重新训练后才能发布！',
  },
  ...zhCN,
  ...zhLocale,
};

export default zh;

