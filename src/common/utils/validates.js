//验证手机号
function verifyPhone(val) {
    if(!val) return false
    let reg = !!val.match(/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/);
    return reg
}

//验证身份证号
function verifyIdCard(val) {
    if(!val) return false
    let reg =/(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}$)/;
    return reg.test(val)
}


//验证是否是中文
function checkChinese(val) {
    let reg = /^[\u4e00-\u9fa5]+$/;
    return reg.test(val)
}

//验证是否是英文
function checkEnglish(val) {
    let reg = /^[a-zA-Z]+$/;
    return reg.test(val)
}

//验证是否是数字
function checkNumber (val) {
    let reg = /^[0-9]+.?[0-9]*$/
    return reg.test(val)
}

function isNotEmptyObj (val) {
    if (!val) {
        return false
    }
    if (Object.keys(val).length === 0) {
        return false
    }
    return true
}

export {
    verifyPhone,
    verifyIdCard,
    checkNumber,
    checkChinese,
    checkEnglish,
    isNotEmptyObj
}