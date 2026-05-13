import CommonModules from 'common-modules-zj';
import zhcn from './zh-cn';
import zhcnte from './zh-cn-te';
import zhcnadapter from './zh-cn-adapter';
import zhtwadapter from './zh-tw-adapter';
import zhtw from './zh-tw';
import zhtwte from './zh-tw-te';
import zhcnlicense from './zh-cn-license';
import zhtwlicense from './zh-tw-license';
import zhcnparser from './zh-cn-parser';
import zhtwparser from './zh-tw-parser';

export default {
  'zh-cn': { ...CommonModules.lang.zhcn, ...zhcnadapter, ...zhcnlicense, ...zhcnparser, ...zhcnte, ...zhcn },
  'zh-tw': { ...CommonModules.lang.zhtw, ...zhtwadapter, ...zhtwlicense, ...zhtwparser, ...zhtwte, ...zhtw },
};

