const lodopStyle = {
    props:['FontName','FontSize','FontColor','Bold','Italic','Underline','Alignment','Angle','ItemType','LinkedItem','HOrient','VOrient','PenWidth','PenStyle','Stretch','PreviewOnly'],
    checkProp: function(propName){
        return this.props.includes(propName)
    },
    transCssToStyle(cssName,cssValue) {
        const styleArr = new Array(2)
        if (upperCase(cssName) === 'FontFamily') {
            styleArr[0] = 'FontName'
            styleArr[1] = cssValue
        }
        if (upperCase(cssName) === 'FontSize') {
            styleArr[0] = 'FontSize'
            styleArr[1] = parseInt(cssValue)
        }
        if (upperCase(cssName) === 'FontWeight') {
            styleArr[0] = 'Bold'
            styleArr[1] = cssValue === 'bold'? 1 : 0
        }
        if (upperCase(cssName) === 'FontStyle') {
            styleArr[0] = 'Italic'
            styleArr[1] = cssValue === 'italic'? 1 : 0
        }
        if (upperCase(cssName) === 'TextAlign') {
            styleArr[0] = 'Alignment'
            if (cssValue === 'left') {
                styleArr[1] = 1
            }
            if (cssValue === 'center') {
                styleArr[1] = 2
            }
            if (cssValue === 'right') {
                styleArr[1] = 3
            }
        }
        if (upperCase(cssName) === 'BorderWidth') {
            styleArr[0] = 'PenWidth'
            styleArr[1] = parseInt(cssValue) || 1
        }
        if (upperCase(cssName) === 'BorderStyle') {
            styleArr[0] = 'PenStyle'
            if (cssValue === 'solid') {
                styleArr[1] = 0
            }
            if (cssValue === 'dashed') {
                styleArr[1] = 1
            }
            if (cssValue === 'dotted') {
                styleArr[1] = 2
            }
        }
        return styleArr[0] ? styleArr : null;
    },
    //必须在输出内容项之后调用
    command : function(lodop,styleProps = {}) {
        if (lodop && lodop.VERSION) {
            const styleKeys = Object.keys(styleProps)
            styleKeys.forEach(key => {
                if (this.checkProp(key)) {
                    lodop.SET_PRINT_STYLEA(0,key,styleProps[key])
                } else {
                    const styleArr = this.transCssToStyle(key,styleProps[key])
                    if (styleArr) {
                        lodop.SET_PRINT_STYLEA(0,styleArr[0],styleArr[1])
                    }
                }

            })
        }
    }
}

function upperCase(str) {
    return str.replace(/( |-|^)[a-z]/g, (L) => L.toUpperCase()).replace(/\W/g,'');
}

export default lodopStyle