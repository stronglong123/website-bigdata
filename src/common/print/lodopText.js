import lodopStyle from './lodopStyle'
const lodopText = {
    props:[],
    command:function(lodop,props = {},itemName) {
        if (lodop && lodop.VERSION) {
            if (props.isPager) {
                const str = props.value ? `${props.text ? props.text+':' : props.text }${props.value}`:props.text
                lodop.ADD_PRINT_TEXT(props.y||0, props.x||0, props.width||0, props.height||0, str)
                lodopStyle.command(lodop,{'ItemType':2,'Horient':2,"Vorient":1})
            } else {
                const str = props.htmlTxt ? props.htmlTxt : (props.value ? `${props.text ?  props.text + "：" : ''}${props.value}`:props.text)
                lodop.ADD_PRINT_HTM(props.y||0, props.x||0, props.width||0, props.height||0, str)
                if (props.style) {
                    lodopStyle.command(lodop,props.style)
                }
                if (props.isHeader) {
                    lodopStyle.command(lodop,{'ItemType':1,'Horient':0})
                }
            }
            if (itemName) {
                lodopStyle.command(lodop,{'LinkedItem':itemName})
            }
        }
    }
}

export default lodopText