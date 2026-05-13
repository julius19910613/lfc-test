import Vue from 'vue';
import Router from 'vue-router';
import SSM from '../components/bf/SSM';
import TaskEngine from '../components/bf/TaskEngine';
import Skill from '../components/bf/Skill';
import Chat from '../components/bf/Chat';
import NER from '../components/bf/NER';
import DKG from '../components/bf/DKG';
import Wordbank from '../components/bf/Wordbank';
import Intent from '../components/bf/Intent';

import ASR from '../components/ASR/asr';

import TaskManage from '../components/ccbot/TaskManage';
import DashBoard from '../components/ccbot/DashBoard';
import ReportCenter from '../components/ccbot/ReportCenter';
import MaintainManage from '../components/ccbot/MaintainManage';

import ReportManage from '../components/qabot/ReportManage';

import CallList from '../components/qabot/CallList';

import aqLong from '../components/aq/AqLong';
import custom from '../components/sa/custom';
import history from '../components/sa/history';
import manage from '../components/sa/manage';
import csaChat from '../components/csa/csaChat';
import csaDialog from '../components/csa/csaDialog';
import helper from '../components/csa/helper';
import map from '../components/csa/map';
import system from '../components/csa/system';

import deploy2020 from '../components/maintenance/deploy2020';
import errorhandle from '../components/maintenance/errorhandle';
import initmachine from '../components/maintenance/initmachine';
import viewlog from '../components/maintenance/viewlog';
import viewwatch from '../components/maintenance/viewwatch';


import login from '../components/api/login';
import chat from '../components/api/chat';
import dac from '../components/api/dac';
import deleteEntity from '../components/api/deleteEntity';
import dialog from '../components/api/dialog';
import dictionary from '../components/api/dictionary';
import feedback from '../components/api/feedback';
import property from '../components/api/property';
import question from '../components/api/question';
import records from '../components/api/records';
import robotAdd from '../components/api/robotAdd';
import robotData from '../components/api/robotData';
import similar from '../components/api/similar';
import upload from '../components/api/upload';
import uploadIncrement from '../components/api/uploadIncrement';
import wordbank from '../components/api/wordbank';
import answer from '../components/api/answer';
import lq from '../components/api/lq';
import testset from '../components/api/testset';
import deletelq from '../components/api/deletelq';
import dacupload from '../components/api/dacupload';
import status from '../components/api/status';
import addanswer from '../components/api/addanswer';
import sq from '../components/api/sq';
import addlq from '../components/api/addlq';
import train from '../components/api/train';
import trainstatus from '../components/api/trainstatus';
import deletesimilar from '../components/api/deletesimilar';
import addv2 from '../components/api/addv2';
import move from '../components/api/move';
import updatev2 from '../components/api/updatev2';
import deletev2 from '../components/api/deletev2';
import trainTrigger from '../components/api/trainTrigger';
import trainResult from '../components/api/trainResult';
import synchronize from '../components/api/synchronize';

Vue.use(Router);

const routes = [
  {
    path: '/api/trainTrigger',
    component: trainTrigger,
  },
  {
    path: '/api/trainResult',
    component: trainResult,
  },
  {
    path: '/api/synchronize',
    component: synchronize,
  },
  {
    path: '/api/deletev2',
    component: deletev2,
  },
  {
    path: '/api/updatev2',
    component: updatev2,
  },
  {
    path: '/api/move',
    component: move,
  },
  {
    path: '/api/addv2',
    component: addv2,
  },
  {
    path: '/api/deletesimilar',
    component: deletesimilar,
  },
  {
    path: '/api/trainstatus',
    component: trainstatus,
  },
  {
    path: '/api/train',
    component: train,
  },
  {
    path: '/api/addlq',
    component: addlq,
  },
  {
    path: '/api/sq',
    component: sq,
  },
  {
    path: '/api/addanswer',
    component: addanswer,
  },
  {
    path: '/api/status',
    component: status,
  },
  {
    path: '/api/dacupload',
    component: dacupload,
  },
  {
    path: '/api/deletelq',
    component: deletelq,
  },
  {
    path: '/api/testset',
    component: testset,
  },
  {
    path: '/api/answer',
    component: answer,
  },
  {
    path: '/api/lq',
    component: lq,
  },
  {
    path: '/apiwiki',
    redirect: '/api/login',
  },
  {
    path: '/wiki/api_wiki',
    redirect: '/api/login',
  },
  {
    path: '/api/login',
    component: login,
  },
  {
    path: '/api/chat',
    component: chat,
  },
  {
    path: '/api/dac',
    component: dac,
  },
  {
    path: '/api/deleteEntity',
    component: deleteEntity,
  },
  {
    path: '/api/dialog',
    component: dialog,
  },
  {
    path: '/api/dictionary',
    component: dictionary,
  },
  {
    path: '/api/feedback',
    component: feedback,
  },
  {
    path: '/api/property',
    component: property,
  },
  {
    path: '/api/question',
    component: question,
  },
  {
    path: '/api/records',
    component: records,
  },
  {
    path: '/api/robotAdd',
    component: robotAdd,
  },
  {
    path: '/api/robotData',
    component: robotData,
  },
  {
    path: '/api/similar',
    component: similar,
  },
  {
    path: '/api/robotData',
    component: robotData,
  },
  {
    path: '/api/upload',
    component: upload,
  },
  {
    path: '/api/uploadIncrement',
    component: uploadIncrement,
  },
  {
    path: '/api/wordbank',
    component: wordbank,
  },
  {
    path: '/',
    redirect: '/bf/ssm',
  },
  {
    path: '/wiki/online_wiki',
    redirect: '/bf/ssm',
  },
  {
    path: '/onlinewiki',
    redirect: '/bf/ssm',
  },
  {
    path: '/bf/ssm',
    component: SSM,
  },
  {
    path: '/bf/te',
    component: TaskEngine,
  },
  {
    path: '/bf/skill',
    component: Skill,
  },
  {
    path: '/bf/intent',
    component: Intent,
  },
  {
    path: '/bf/dkg',
    component: DKG,
  },
  {
    path: '/bf/chat',
    component: Chat,
  },
  {
    path: '/bf/ner',
    component: NER,
  },
  {
    path: '/bf/wordbank',
    component: Wordbank,
  },
  {
    path: '/asr/asr',
    component: ASR,
  },
  {
    path: '/ccbot/TaskManage',
    component: TaskManage,
  },
  {
    path: '/ccbot/DashBoard',
    component: DashBoard,
  },
  {
    path: '/ccbot/ReportCenter',
    component: ReportCenter,
  },
  {
    path: '/qabot/ReportManage',
    component: ReportManage,
  },
  {
    path: '/qabot/CallList',
    component: CallList,
  },
  {
    path: '/aq/AqLong',
    component: aqLong,
  },
  {
    path: '/ccbot/MaintainManage',
    component: MaintainManage,
  },
  {
    path: '/sa/custom',
    component: custom,
  },
  {
    path: '/sa/history',
    component: history,
  },
  {
    path: '/sa/manage',
    component: manage,
  },
  {
    path: '/csa/csaChat',
    component: csaChat,
  },
  {
    path: '/csa/helper',
    component: helper,
  },
  {
    path: '/csa/csaDialog',
    component: csaDialog,
  },
  {
    path: '/csa/map',
    component: map,
  },
  {
    path: '/csa/system',
    component: system,
  },
  {
    path: '/maintenance/viewwatch',
    component: viewwatch,
  },
  {
    path: '/maintenance/deploy2020',
    component: deploy2020,
  },
  {
    path: '/maintenance/errorhandle',
    component: errorhandle,
  },
  {
    path: '/maintenance/initmachine',
    component: initmachine,
  },
  {
    path: '/maintenance/viewlog',
    component: viewlog,
  },
];

const router = new Router({
  routes,
});
export default router;
