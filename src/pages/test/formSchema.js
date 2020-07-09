// import {checkOwnerCode} from 'api/ownerApi'
import {checkChinese} from '../../common/utils/validates'
import {pinyin} from "../../common/utils/PinYinUtil";

const formSchema = [
    {
        name:'ownerName',
        label:'货主名称',
        type:'text',
        rules:[{required:true,message:'请填写货主名称'}],
        refField:'ownerNo',
        refFn:function(value) {
            if (checkChinese(value)) {
                return pinyin.getCamelChars(value)
            } else {
                return value
            }
        }
    },
    {
        name:'ownerNo',
        label:'货主编码',
        type:'text',
        placeholder:'请输入英文编码',
        helpText:'货主编码是货主的唯一标识，不允许重复',
        rules:[{required:true,message:'请填写货主编码'}],
        remoteValidate:true,
    },
    {
        name:'ownerType',
        label:'类型',
        type:'select',
        rules:[{required:true,message:'请选择类型'}],
        options:[{key:1, value:'合作商'},{key:2,value:'入驻商'}],
        helpText:'合作商:自有商品独立开展业务，公司仅提供商品保管服务的商家; 入驻商:将商品托管给公司，公司负责销售并定期结算账款的商家',
        formatter: function(value) {return this.options.find(option => option.key === value).value},
        defaultValue:1
    },
    {
        name:'userName',
        label:'联系人',
        type:'text',
        rules:[]
    },
    {
        name:'mobileNo',
        label:'电话',
        type:'text',
        rules:[{pattern:/^1[3456789]\d{9}$/,message:'请填写正确的手机号码'}]
    }
]

export default formSchema