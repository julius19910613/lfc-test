/**
 * Created by emotibot on 2019/3/29.
 */
import zhTW from 'common-modules-zj/src/i18n/zh-tw';
import twLocale from 'element-ui/lib/locale/lang/zh-TW';

const zhtw = {
  general: {
    reset: '重置',
    cancel: '取消',
    ok: '確認',
    error: '錯誤',
  },
  error_msg: {
    server_error: '伺服器錯誤',
  },
  menu: {
    sq_answer: '標準問答',
    data_train: '數據訓練',
    test_report: '測試及報告',
    post_online: '發布上線',
    corpus_change: '語料變更',
    question_change: '標準問變更',
    answer_change: '回答變更',
    have_to_train: '已有數據變動，必須重新訓練後才能發布！',
  },
  ...zhTW,
  ...twLocale,
};

export default zhtw;
