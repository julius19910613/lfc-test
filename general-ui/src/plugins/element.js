import {
  Loading,
  Pagination,
  Dialog,
  Tabs,
  TabPane,
  Input,
  InputNumber,
  Upload,
  Tree,
  Radio,
  RadioButton,
  RadioGroup,
  Checkbox,
  CheckboxGroup,
  Table,
  TableColumn,
  Tag,
  Row,
  Col,
  Message,
  Select,
  Option,
  Popover,
  Tooltip,
  MessageBox,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Button,
  ButtonGroup,
  Drawer,
  Collapse,
  CollapseItem,
  Switch,
  Progress,
  DatePicker,
} from 'element-ui';

const MyPlugin = {
  install(Vue) {
    Vue.use(Loading);
    Vue.use(Pagination);
    Vue.use(Dialog);
    Vue.use(Tabs);
    Vue.use(TabPane);
    Vue.use(Input);
    Vue.use(InputNumber);
    Vue.use(Upload);
    Vue.use(Tree);
    Vue.use(Radio);
    Vue.use(RadioButton);
    Vue.use(RadioGroup);
    Vue.use(Checkbox);
    Vue.use(CheckboxGroup);
    Vue.use(Table);
    Vue.use(TableColumn);
    Vue.use(Tag);
    Vue.use(Row);
    Vue.use(Col);
    Vue.use(Select);
    Vue.use(Option);
    Vue.use(Popover);
    Vue.use(Tooltip);
    Vue.use(Dropdown);
    Vue.use(DropdownMenu);
    Vue.use(DropdownItem);
    Vue.use(Button);
    Vue.use(ButtonGroup);
    Vue.use(Drawer);
    Vue.use(Collapse);
    Vue.use(CollapseItem);
    Vue.use(Switch);
    Vue.use(Progress);
    Vue.use(DatePicker);
    Vue.prototype.$message = Message;
    Vue.prototype.$msgbox = MessageBox;
    Vue.prototype.$alert = MessageBox.alert;
    Vue.prototype.$confirm = MessageBox.confirm;
    Vue.prototype.$prompt = MessageBox.prompt;
  },
};

export default MyPlugin;
