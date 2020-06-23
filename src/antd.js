import Vue from 'vue'
import CreateAPI from 'vue-create-api'
import {
    message,
    LocaleProvider,
    Form,
    Button,
    Input,
    InputNumber,
    Select,
    Icon,
    Row,
    Col,
    Layout,
    Upload,
    Modal,
    Table,
    Collapse,
    Cascader,
    Tooltip,
    Popconfirm,
    Progress,
    Tabs,
    Divider,
    Radio,
    Card,
    Tag,
    AutoComplete,
    Checkbox,
    DatePicker,
    Breadcrumb,
    Timeline,
    Switch,
    Steps,
    Badge,
    List,
    Drawer,
    TimePicker,
    Dropdown,
    Menu,
    Popover,
    Tree,
    Spin,
    TreeSelect,
    Mentions,
    FormModel,
    descriptions,
    result,
    Calendar
} from 'ant-design-vue'

Vue.use(LocaleProvider)
Vue.use(Form)
Vue.use(Button)
Vue.use(Input)
Vue.use(InputNumber)
Vue.use(Select)
Vue.use(Icon)
Vue.use(Row)
Vue.use(Col)
Vue.use(Layout)
Vue.use(Upload)
Vue.use(Modal)
Vue.use(Table)
Vue.use(Collapse)
Vue.use(Cascader)
Vue.use(Tooltip)
Vue.use(Popconfirm)
Vue.use(Progress)
Vue.use(Tabs)
Vue.use(Divider)
Vue.use(Radio)
Vue.use(Card)
Vue.use(Tag)
Vue.use(AutoComplete)
Vue.use(Checkbox)
Vue.use(DatePicker)
Vue.use(Breadcrumb)
Vue.use(Timeline)
Vue.use(Switch)
Vue.use(Steps)
Vue.use(Badge)
Vue.use(List)
Vue.use(Drawer)
Vue.use(TimePicker)
Vue.use(Dropdown)
Vue.use(Menu)
Vue.use(Popover)
Vue.use(Tree)
Vue.use(Spin)
Vue.use(TreeSelect)
Vue.use(Mentions)
Vue.use(descriptions)
Vue.use(result)
Vue.use(FormModel)
Vue.use(Calendar)
// 使用createAPI将antd组件变成可函数式调用
Vue.use(CreateAPI, {
    componentPrefix: 'a-'
})

Vue.prototype.$message = message
message.config({
    top: `100px`,
    duration: 3,
    maxCount: 3
});