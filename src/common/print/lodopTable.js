import lodopStyle from './lodopStyle'

const lodopTable = {
    props:[],
    command:function(lodop, props = {},itemName) {
        if (lodop && lodop.VERSION) {
            lodop.ADD_PRINT_TABLE(props.y||0, props.x||0, props.width||0,  props.height||0, props.htmlTxt || '')
            if (props.style) {
                lodopStyle.command(lodop,props.style)
            }
            if (itemName) {
                lodopStyle.command(lodop,{'LinkedItem':itemName})
            }
        }
    }
}

export default lodopTable