import lodopStyle from './lodopStyle'
const lodopCode = {
    props:[],
    command:function(lodop,props = {},itemName) {
        if (lodop && lodop.VERSION) {
            const {htmlTxt,value,text,y,x,width,height} = props
            const str = htmlTxt ? htmlTxt : (value ? value:text)
            // const mmWidth = width ? Math.round(width/3.78) + 'mm' : 0
            // const mmHeight = height ? Math.round(height/3.78) + 'mm' : 0
            lodop.ADD_PRINT_BARCODE(y||0, x||0, width, height, props.codeType, str)
            if (props.isHeader) {
                lodopStyle.command(lodop,{'ItemType':1})
            }
            if (itemName) {
                lodopStyle.command(lodop,{'LinkedItem':itemName})
            }
        }
    }
}

export default lodopCode