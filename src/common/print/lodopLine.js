import lodopStyle from "./lodopStyle";

const lodopLine = {
    props:[],
    command:function(lodop,props = {},itemName) {
        if (lodop && lodop.VERSION) {
            let x1= 0, y1 = 0
            if (props.lineType === 'base') {
                x1 = (props.x || 0) + (props.width || 0)
                y1 = props.y || 0
            }
            if (props.lineType === 'cross') {
                y1 = (props.y || 0) + (props.height || 0)
                x1 = props.x || 0
            }
            let lineStyle = 0
            if (props.style.borderStyle === 'solid') {
                lineStyle = 0
            } else if (props.style.borderStyle === 'dashed') {
                lineStyle = 1
            } else if (props.style.borderStyle === 'dotted') {
                lineStyle = 2
            }
            let lineWidth = 1
            if (props.style.borderWidth) {
                lineWidth = parseInt(props.style.borderWidth)
            }
            lodop.ADD_PRINT_LINE(props.y||0, props.x||0, y1,x1, lineStyle, lineWidth)
            if (props.isHeader) {
                lodopStyle.command(lodop,{'ItemType':1})
            }
            if (itemName) {
                lodopStyle.command(lodop,{'LinkedItem':itemName})
            }
        }
    }
}

export default lodopLine