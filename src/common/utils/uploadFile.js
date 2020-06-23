import axios from 'axios'
const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV);

//获取文件上传权限
export function getAuthorization(params) {
	const url = '/supplyChain/file/Authorization'
	return axios({
		method: 'post',
		url: url,
		data: params
	}).then((res) => {
		return Promise.resolve(res.data)
	}).catch(function (error) {

	});
}

//上传文件
export function upLoadImg(options, callback) {
	let file = options.file
	//this.createAjax = function(argument) {
	var ajax = (function (argument) {
		var xmlhttp = {};
		if (window.XMLHttpRequest) {
			xmlhttp = new XMLHttpRequest();
		} else {
			xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
		}

		// 发送二进制数据
		if (!XMLHttpRequest.prototype.sendAsBinary) {
			XMLHttpRequest.prototype.sendAsBinary = function (datastr) {
				function byteValue(x) {
					return x.charCodeAt(0) & 0xff;
				}
				var ords = Array.prototype.map.call(datastr, byteValue);
				var ui8a = new Uint8Array(ords);
				xmlhttp.send(ui8a.buffer);
			}
		}
		return xmlhttp;
	})();

	var url = options.fileUrl;
	if (!IS_PROD) {
		url = options.folderName + '/' + options.fileName;
	}
	callback && (ajax.onreadystatechange = function(){
	    if (ajax.readyState === 4 && ajax.status === 200) {
	        callback(url);
        }
    })
	ajax.open('PUT', url, true);
	ajax.setRequestHeader("Content-MD5", options.contentMd5);
	ajax.setRequestHeader("Authorization", options.authorization);
	ajax.setRequestHeader("Content-Type", file.type);
	ajax.send(file);

}



