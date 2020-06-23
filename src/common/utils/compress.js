/** 图片压缩，最大1M，超过1M按照1M压缩，小于1M不压缩
  *  @param {Object} fileObj
  *  图片对象
  *  回调函数有一个参数，base64的字符串数据
  */
 function compress(fileObj, callback) {
    try {
        const image = new Image()
        image.src = URL.createObjectURL(fileObj)
        image.onload = function() {
            const that = this
            // 默认按比例压缩
            let w = that.width
            let h = that.height
            const scale = w / h
            w = fileObj.width || w
            h = fileObj.height || (w / scale)
            let quality = parseFloat((1 * 1024 * 1024) / fileObj.size) // 默认图片质量为0.7
            if (quality >= 1) {
                quality = 1
            } else {
                quality =  Math.round(quality*100)/100
            }
            // 生成canvas
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')
            // 创建属性节点
            const anw = document.createAttribute('width')
            anw.nodeValue = w
            const anh = document.createAttribute('height')
            anh.nodeValue = h
            canvas.setAttributeNode(anw)
            canvas.setAttributeNode(anh)
            ctx.drawImage(that, 0, 0, w, h)
            // 图像质量
/*            if (fileObj.quality && fileObj.quality <= 1 && fileObj.quality > 0) {
                quality = fileObj.quality
            }*/
            // quality值越小，所绘制出的图像越模糊
            let data = canvas.toDataURL(fileObj.type, quality);
            // 压缩完成执行回调
            const newFile = convertBase64UrlToBlob(data)
            callback(newFile)
        }
    } catch (e) {
        console.log('压缩失败!')
    }
}

function convertBase64UrlToBlob(urlData) {
    const bytes = window.atob(urlData.split(',')[1]) // 去掉url的头，并转换为byte
    var mimeString = urlData.split(',')[0].split(':')[1].split(';')[0];
    // 处理异常,将ascii码小于0的转换为大于0
    const ab = new ArrayBuffer(bytes.length)
    const ia = new Uint8Array(ab)
    for (let i = 0; i < bytes.length; i++) {
        ia[i] = bytes.charCodeAt(i)
    }
    return new Blob([ab], {type: mimeString})
}

export {
    compress
}