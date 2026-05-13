<template lang="html">
<div class="node-block" :style="style"
  @mouseover="mouseOverNode = true"
  @mouseout="mouseOverNode = false">
  <!--入口节点-->
  <div v-if="isEntry" class="entry-node">
    <div class="entry-righticon" @click="editNode()"><emoti-icon name="icon-entrance" :size="18"/></div>
    <div class="entry-text">
      <span class="entry-start">{{$t('task_engine_v2.node_type.start')}}</span>
      <span>{{$t('task_engine_v2.node_type.trigger')}}</span>
    </div>
  </div>
  <!--普通node内容部分-->
  <div class="node-block-content" v-if="!isEntry">
    <div class="label-node-name">
      <div class="node-name-right">
        <div style="margin-right:10px;">
          <!-- <img src="../../../_icon/images/block_img.png" style="width:18px;height:18px"/> -->
          <emoti-icon :name="initialNode.nodeType === 'sub_scenario'? 'icon-child-scene': 'icon-normal-node'" :size="16" ></emoti-icon>
        </div>
        <div @click="editNode()" style="cursor: pointer;">{{node.nodeName}}</div>
      </div>
      <div
        class="warning-icon"
        ref="warningIcon"
        v-if="warningTooltipValue.msgs && warningTooltipValue.msgs.length > 0"
        @mouseover="tooltipMouseover($event, 'warningIconStyle')"
        @mouseleave="warningIconStyle.visibility = 'hidden'">
        <img src="../../../_icon/images/info-warn.png"/>
        <div class="tooltip" :style="warningIconStyle">
          <div class="text">
            <p v-for="(m, i) in warningTooltipValue.msgs" :key="i">
              {{ m }}
            </p>
          </div>
        </div>
      </div>
    </div>
    <!--debufInfo显示-->
    <div class='showcontent'>
      <div class='showpopmsg' v-show="msgfalg">
        <div v-for="(item, index) in msgInfo" :key="index">
          <div class="detailmsg">type: {{item.type}}</div>
          <div class="detailmsg">name:{{item.name}}</div>
          <div class="detailmsg detailicon" v-show="item.message" @click="showoffDetail(index)">详情</div>
          <div class="detailmsg" v-show="currentIndex === index && detailflag">{{item.message}}</div>
        </div>
      </div>
      <div class="showid" v-show='showFlag' v-for='(item, index) in showNumber' :key='index' @click="msgfalg=!msgfalg">
        {{item}}
      </div>
    </div>
    <!-- info部分-->
    <div class="info-row">
      <div class="rounded">
        . {{nodeTypeName}}
      </div>

      <div
        class="rounded relative"
        ref="exitIcon"
        v-if="hasExitConnection"
        @mouseover="tooltipMouseover($event, 'endStyle')"
        @mouseleave="endStyle.visibility = 'hidden'">
        . END
        <div class="tooltip" :style="endStyle">
          <div class="text">
           {{ endTooltip.msg }}
          </div>
        </div>
      </div>
    </div>
    <div v-if="mouseOverNode" class="button-row">
      <div class="button-center"    @click="editNode()">
        <emoti-icon name="icon-edit-pen" :size="16"></emoti-icon>
      </div>
      <div  class="button-center"  @click="copyNode()">
        <emoti-icon name="icon-copy" :size="16"></emoti-icon>
      </div>
      <div class="button-center" @click="deleteNode()">
        <emoti-icon name="icon-delete" :size="16"></emoti-icon>
      </div>
    </div>
  </div>
   <!--转换图案部分-->
   <div class="line-to" v-if="initialNode.nodeType === 'sub_scenario'">
     <div class="small-line"></div>
     <div style="text-align:center">
        <div style="position:relative;" >
          <img src="../../../_icon/images/change-btn.png" class="change-btn"/>
        </div>
     </div>
   </div>
      <!-- @mousedown.stop.prevent="srcSlotMouseDown"  :class="{'is-src-node': isSrcNode, 'mouse-over-node': mouseOverNode}"-->
    <!--  <div class="edge-slot edge-slot-from"-->
    <!--    id="edgeSlotFrom"-->
    <!--    ref="edgeSlotFrom"-->
    <!--    v-if="linking === false || isSrcNode === true"-->
    <!--    >-->
    <!--  </div>-->
    <!--  <div class="edge-slot edge-slot-to"-->
    <!--    id="edgeSlotTo"-->
    <!--    ref="edgeSlotTo"-->
    <!--    v-if="linking === true && isSrcNode === false && node.nodeType !== 'entry'"-->
    <!--    @mouseup.stop.prevent="dstSlotMouseUp($event)"-->
    <!--    @mouseenter.stop="dstSlotMouseEnter()"-->
    <!--    @mouseleave.stop="dstSlotMouseLeave()">-->
    <!--  </div>-->
</div>
</template>

<script>
import { mapGetters } from 'vuex';
import taskEngineApi from '@/modules/TaskEngine/_api/taskEngine';
import NodeEditPage from './NodeEditPage';
import optionConfig from '../_utils/optionConfig';
import scenverContor from '../_utils/scenarioConvertor';
import subScenarioEditPop from './SubScenarioEditPop';

export default {
  name: 'node-block',
  api: [taskEngineApi],
  components: { subScenarioEditPop },
  props: {
    scenarioId: {
      type: String,
      default: '',
    },
    x: {
      type: Number,
      default: 0,
      validator(val) {
        return typeof val === 'number';
      },
    },
    y: {
      type: Number,
      default: 0,
      validator(val) {
        return typeof val === 'number';
      },
    },
    nodeTypeName: {
      type: String,
      required: true,
    },
    initialNode: {
      type: Object,
      required: true,
      default: undefined,
    },
    initialGlobalEdges: {
      type: Array,
      required: true,
      default: undefined,
    },
    toNodeOptions: {
      type: Array,
      required: true,
      default: undefined,
    },
    globalVarOptionsMap: {
      type: Object,
      required: true,
      default: undefined,
    },
    linking: {
      type: Boolean,
      default: false,
    },
    nodeBlockWidth: {
      type: Number,
      default: 230,
    },
    nodeBlockHeight: {
      type: Number,
      default: 120,
    },
    version: {
      type: String,
      required: true,
    },
    jsCodeAlias: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      node: {},
      lastMouseX: 0,
      lastMouseY: 0,
      canMove: false,
      hasMoved: false,
      hasExitConnection: false,
      warningTooltipValue: {},
      endTooltip: {
        msg: this.$t('task_engine_v2.warnings.has_exit_connection'),
      },
      warningMsgMap: {},
      isSrcNode: false,
      mouseOverNode: false,
      mouseOverBtn: false,
      warningIconStyle: {
        visibility: 'hidden',
      },
      endStyle: {
        visibility: 'hidden',
      },
      showFlag: false,
      showNumber: [],
      msgfalg: false,
      msgInfo: [],
      detailflag: false,
      detailtagglo: false,
      currentIndex: '',
      subScenarioId: '',
      dialogVisible: false,
      subedges: [],
      isEntry: false,
    };
  },
  watch: {
    showNodescenrioId: {
      handler(val) {
        this.showNumber = [];
        val.forEach((item) => {
          if (item.NodeId === this.node.nodeId) {
            this.showFlag = true;
            this.showNumber.push(item.num);
          }
        });
      },
      immediate: true,
    },
  },
  computed: {
    ...mapGetters([
      'showNodescenrioId',
    ]),
    style() {
      return {
        top: `${this.y}px`,
        left: `${this.x}px`,
        width: `${this.nodeBlockWidth}px`,
        height: `${this.nodeBlockHeight}px`,
        'min-width': `${this.nodeBlockWidth}px`,
        'min-height': `${this.nodeBlockHeight}px`,
      };
    },
    deleteText() {
      return this.$t('general.delete').split('').join(' ');
    },
    copyText() {
      return this.$t('general.copy').split('').join(' ');
    },
  },
  methods: {
    showpopmsg(num) {
      this.msgfalg = !this.msgfalg;
      this.showNodescenrioId.forEach((item) => {
        if (item.num === num) {
          this.msgInfo = item.info;
        }
      });
    },
    showoffDetail(index) {
      this.currentIndex = index;
      this.detailflag = !this.detailflag;
    },
    tooltipMouseover(e, key) {
      // const rect = e.target.getBoundingClientRect();
      const rect = e.target;
      this[key] = {
        left: `${rect.width}px`,
        top: `-2*${rect.height}px`,
        visibility: 'visible',
      };
    },
    onMouseDown(e) {
      const target = e.target || e.srcElement;
      if (target.id === 'edgeSlotFrom' || target.id === 'edgeSlotTo') {
        return;
      }
      const mouseX = e.pageX;
      const mouseY = e.pageY;
      this.lastMouseX = mouseX;
      this.lastMouseY = mouseY;

      if (this.$el.contains(target) && e.which === 1) {
        this.canMove = true;
        if (e.preventDefault) e.preventDefault();
      }
    },
    onMouseMove(e) {
      if (!this.canMove) {
        return;
      }
      const mouseX = e.pageX;
      const mouseY = e.pageY;

      const diffX = mouseX - this.lastMouseX;
      const diffY = mouseY - this.lastMouseY;

      this.lastMouseX = mouseX;
      this.lastMouseY = mouseY;

      let left = this.x + diffX;
      let top = this.y + diffY;
      this.hasMoved = true;

      // 进行边界处理,这就是拖拽的left 和 top 值
      if (top < 44) {
        top = 44;
      } else if (left < 0) {
        left = 0;
      }

      // console.log(left, top);
      this.$emit('updatePosition', { left, top });
    },
    onMouseUp() {
      if (this.canMove && this.hasMoved) {
        this.$emit('savePosition');
      }
      this.canMove = false;
      this.hasMoved = false;
      this.isSrcNode = false;
    },
    srcSlotMouseDown() {
      this.isSrcNode = true;
      const edgeSlotFrom = this.$refs.edgeSlotFrom;
      const halfElementHeight = edgeSlotFrom.offsetHeight / 2;
      const x = edgeSlotFrom.offsetLeft + edgeSlotFrom.offsetParent.offsetLeft + halfElementHeight;
      const y = edgeSlotFrom.offsetTop + edgeSlotFrom.offsetParent.offsetTop + halfElementHeight;
      const slot = { x, y };
      this.$emit('linkingStart', slot);
    },
    dstSlotMouseUp(e) {
      this.$emit('linkingStop', e);
    },
    dstSlotMouseEnter() {
      const edgeSlotTo = this.$refs.edgeSlotTo;
      const halfElementHeight = edgeSlotTo.offsetHeight / 2;
      const x = edgeSlotTo.offsetLeft + edgeSlotTo.offsetParent.offsetLeft + halfElementHeight;
      const y = edgeSlotTo.offsetTop + edgeSlotTo.offsetParent.offsetTop + halfElementHeight;
      const slot = { x, y };
      this.$emit('mouseEnterDstSlot', slot);
    },
    dstSlotMouseLeave(e) {
      this.$emit('mouseLeaveDstSlot', e);
    },
    deleteNode() {
      this.$emit('deleteNode');
    },
    editNode(tabType) {
      const that = this;
      that.$pop({
        title: '',
        component: NodeEditPage,
        validate: true,
        cancelValidate: true,
        extData: {
          nodeName: that.node.nodeName,
          nodeId: that.node.nodeId,
          currentTab: tabType,
          jsCodeAlias: this.jsCodeAlias,
          node: that.node,
          globalEdges: that.initialGlobalEdges,
          toNodeOptions: that.toNodeOptions,
          globalVarOptionsMap: that.globalVarOptionsMap,
          version: this.version,
          scenarioId: this.scenarioId,
          subedges: this.subedges, // 功能场景的edge选项
        },
        callback: {
          ok: (resultObj) => {
            this.node = resultObj.nodeResult;
            this.$emit('addTempNodes', resultObj.newNodeOptions);
            this.$emit('saveNode', resultObj.nodeResult);
          },
        },
      });
    },
    copyNode() {
      this.$emit('copyNode');
    },
    renderData() {
      this.node = JSON.parse(JSON.stringify(this.initialNode));
      this.renderWarnings();
    },
    propNode(newNode) {
      this.node = JSON.parse(JSON.stringify(newNode));
      this.renderWarnings();
    },
    renderWarnings() {
      if (!this.node.warnings || !(this.node.warnings instanceof Array)) return;
      const warningMsgs = [];
      this.hasExitConnection = false;
      this.node.warnings.forEach((w) => {
        if (w.type === 'has_exit_connection') {
          this.hasExitConnection = true;
        } else {
          const msg = this.warningMsgMap[w.type];
          warningMsgs.push(msg);
        }
      });
      this.warningTooltipValue.msgs = warningMsgs;

      // reload
      if (this.$refs.warningIcon) {
        this.$refs.warningIcon.dispatchEvent(new Event('tooltip-reload'));
      }
    },
    addListeners() {
      document.documentElement.addEventListener('mousemove', this.onMouseMove, false);
      document.documentElement.addEventListener('mousedown', this.onMouseDown, false);
      document.documentElement.addEventListener('mouseup', this.onMouseUp, false);
    },
    removeListeners() {
      document.documentElement.removeEventListener('mousemove', this.onMouseMove, false);
      document.documentElement.removeEventListener('mousedown', this.onMouseDown, false);
      document.documentElement.removeEventListener('mouseup', this.onMouseUp, false);
    },
  },
  beforeMount() {
    this.warningMsgMap = optionConfig.getWarningMsgMap(this);
    this.renderData();
    if (this.initialNode.nodeType === 'entry') {
      this.isEntry = true;
    }
  },
  mounted() {
    if (this.initialNode.nodeType === 'sub_scenario') {
      this.subScenarioId = this.initialNode.subScenarioTab.normalEdges[0]
        .actions[0].function.content.scenario.id;
      // 功能场景的edges；
      this.$api.loadScenario(this.subScenarioId).then((data) => {
        const moduleData = JSON.parse(data.result.editingContent);
        const nodes = moduleData.nodes;
        this.subedges = scenverContor.getExitEdges(nodes);
      });
    }
    this.$on('propNode', this.propNode);
    this.addListeners();
    this.showNodescenrioId.forEach((item) => {
      if (item.NodeId === this.node.nodeId) {
        this.showFlag = true;
        this.showNumber.push(item.num);
        this.msgInfo = item.info;
      }
    });
  },
  beforeDestroy() {
    this.removeListeners();
  },
};
</script>

<style lang="scss" scoped>
.node-block {
  position: absolute;
  display: flex;
  flex-direction: column;
  border-radius: 4px;
  justify-content: space-between;
  cursor: move;
  .entry-node{
    width:156px;
    display: flex;
    flex-direction: row;
    color: #666;
    .entry-righticon{
      width: 42px;
      height:40px;
      background:#FCDD83;
      border-radius:20px 0px 0px 20px;
      text-align: center;
      line-height: 40px;
    }
    .entry-text{
      flex: 1;
      background: #F5E9B2;
      border-radius:0px 20px 20px 0px;
      text-align: center;
      line-height: 40px;
      font-size: 12px;
      .entry-start{
        font-size: 14px;
        margin-right: 5px;
        color: #333;
      }
    }
  }
  .pop{
    .el-dialog{
      z-index: 5000!important;
    }
  }
  .node-block-content{
    position:relative;
    height:100px;
    background: white;
    padding:10px 10px;
    box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.2);
  }
  .tooltip {
    width: 300px;
    position: absolute;
    word-break: break-all;
    white-space: normal;
    font-size: 12px;
    line-height: 18px;
    border-radius: 2px;
    color: #FFFFFF;
    z-index: 1;
    .text {
      background-color: rgba(0, 0, 0, 0.85);
      padding: 5px 8px;
      display: inline-block;
    }
  }
  .label-node-name {
    @include font-14px();
    color: $color-font-active;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: flex;
    justify-content: space-between;
    .node-name-right{
      vertical-align:middle;
      display:flex;
      flex-direction:row;
    }
  }
  .showcontent{
    position: absolute;
    left: 200px;
    top: 15px;
    width: 50px;
    .showpopmsg{
      position: absolute;
      padding: 10px;
      top: -75px;
      left: 20px;
      font-size: 12px;
      border-radius: 4px;
      background: #FFFFFF;
      overflow: auto;
      z-index: 10;
      .detailmsg{
        line-height: 20px;
        z-index: 100;
      }
      .detailicon{
        border: 1px solid rgb(173, 170, 173);
        width: 28px;
        margin-top: 5px;
        line-height: 14px;
        text-align: center;
      }
    }
    .showid{
      float: left;
      margin-right: 5px;
      border-radius: 50%;
      height: 20px;
      width:20px;
      margin-top: 10px;
      background: rgba(190, 186, 186, 0.5);
      color: rgb(28, 42, 240);
      font-weight: 600;
      line-height: 20px;
      text-align: center;
    }
  }

  .info-row {
    padding: 5px 10px;
    color: #ccc;
    @include font-12px();
    height:56px;
    border-radius: 3px;
    border: 1px solid rgb(219,219,219);
    .rounded {
      // background-color: #eeeeee;
      border-radius: 10px;
      padding: 2px 10px;
      margin-right: 10px;
      &.relative {
        position: relative;
      }
    }
    .warning-icon {
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
    }
  }
  .button-row {
    position:absolute;
    right:-26px;
    top:10px;
    background:rgb(252,252,252);
    width:26px;
    height: 80px;
    display:flex;
    flex-direction:column;
    justify-content:space-around;
    box-shadow:0px 0px 5px 0px rgba(0,0,0,0.1);
    border-radius:0px 4px 4px 0px;
    .button-center{
      text-align: center;
      .btn-size{
        width:14px;
        height: 14px;
      }
    }
    .button {
      width: 80px;
      height: 32px;
    }
    .transparent-button {
      height: 32px;
      display: flex;
      align-items: center;
      padding: 0 10px;
    }
  }
  .edge-slot{
    width: 16px;
    height: 16px;
    cursor: pointer;
  }
  .edge-slot-from{
    position: absolute;
    bottom: 4px;
    left: 132px;
  }
  .mouse-over-node{
    border: 2px solid #AAAAAA;
    border-radius: 100%;
  }
  .is-src-node {
    background: #AAAAAA;
    border: 2px solid #AAAAAA;
    border-radius: 100%;
  }
  .edge-slot-to{
    z-index: 100;
    position: absolute;
    top: -8px;
    left: 132px;
    border: 2px solid #AAAAAA;
    border-radius: 100%;
    &:hover{
      background: $color-primary;
      border: 2px solid $color-primary;
    }
  }
  .line-to{
    flex:1;
    .small-line{
      width: 50%;
      height:20px;
      border-right: 4px solid #9BA6B1;
    }
    .change-btn{
      position:absolute;
      left:50%;
      margin-left: -10px;
      top: -2px;
      background: #9BA6B1;border-radius: 50%;
    }
  }
  #subScenario{
    .gray_block{
      width: 502px;
      height: 32px;
      background: rgba(216,216,216,1);
    }
  }
}
</style>
