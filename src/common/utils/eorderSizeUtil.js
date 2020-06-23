const templateSizes = {
    "HTKY": {
        'default':{width:'100mm',height:'180mm'},
        '180':{width:'100mm',height:'180mm'},
        '130':{width:'76mm',height:'130mm'},
    },
    "EMS":{
        'default':{width:'100mm',height:'150mm'},
        '180':{width:'100mm',height:'180mm'},
    },
    "SF":{
        'default':{width:'100mm',height:'150mm'},
        '210':{width:'100mm',height:'210mm'},
        '15001':{width:'100mm',height:'150mm'},
        "180":{width:'100mm',height:'180mm'},
        "21001":{width:'100mm',height:'210mm'},
    },
    "STO":{
        'default':{width:'100mm',height:'180mm'},
        '150':{width:'100mm',height:'150mm'},
        '18003':{width:'100mm',height:'180mm'},
        "180":{width:'100mm',height:'180mm'},
        "130":{width:'76mm',height:'130mm'},
    },
    "ZTO":{
        'default':{width:'100mm',height:'180mm'},
        "180":{width:'100mm',height:'180mm'},
        "130":{width:'76mm',height:'130mm'},
    },
    "YTO":{
        'default':{width:'100mm',height:'180mm'},
        '18001':{width:'100mm',height:'180mm'},
        "180":{width:'100mm',height:'180mm'},
        "130":{width:'76mm',height:'130mm'},
    },
    "YD":{
        'default':{width:'100mm',height:'203mm'},
        "180":{width:'100mm',height:'180mm'},
        "130":{width:'76mm',height:'130mm'},
    },
    "YZBK":{
        'default':{width:'100mm',height:'150mm'},
    },
    "YZPY":{
        'default':{width:'100mm',height:'180mm'},
        "180":{width:'100mm',height:'180mm'},
    },
    //极兔速递
    "JTSD":{
        'default':{width:'100mm',height:'180mm'},
        "130":{width:'76mm',height:'130mm'},
    },
}

export function getTemplateSize(shipperCode='',sizeCode='') {
    if (!shipperCode) {
        return null
    }
    const sizeObj = templateSizes[shipperCode][sizeCode]
    if (!sizeObj) {
        return templateSizes[shipperCode]['default']
    }
    return sizeObj
}