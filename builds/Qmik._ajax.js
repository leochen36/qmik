/**
 * @author:leo
 * @email:cwq0312@163.com
 * @version:1.00.000
 */
(function(Q) { /* ajax */
	var win = Q.global, toObject = Q.parseJSON, isFun = Q.isFun, //
	_delete = Q._in._delete,
	regUrl = /[\w\d_$-]+\s*=\s*\?/, jsonp = 1, prefex = "qjsonp", //
	defaultConfig = {
		type : 'GET',
		async : !0,
		dataType : 'text',
        xhrFields: {
            //withCredentials:false
        },
		header: {}//http请求头
	};
	function request() {
		return win.XMLHttpRequest && (win.location.protocol !== 'file:' || !win.ActiveXObject)	? new win.XMLHttpRequest()
																															: new win.ActiveXObject('Microsoft.XMLHTTP')
	}
	//jsonp请求
	function ajaxJSONP(_config, success, error) {
		var ttl = _config.timeout, thread, isExe = 1, //
		url = _config.url, gdata = Q.param(_config.data), //
		callbackName = prefex + (jsonp++), //
		cb = url.match(regUrl);
		/\?/.test(url) || (url+="?");
		if (cb) {
			cb = cb[0].split("=")[0];
			url = url.replace(regUrl, cb + "=" + callbackName)
		} else {
			url += "&callback=" + callbackName
		}
		url += "&"+gdata;
		function err() {
			if (isExe == 1) {
				isExe = 0;
				_delete(win, callbackName);
				Q("script[jsonp='" + callbackName + "']").remove();
				error && error()
			}
		}
		win[callbackName] = function(data) {
			_delete(win, callbackName);
			Q("script[jsonp='" + callbackName + "']").remove();
			thread && thread.stop();
			isExe == 1 && success && success(data)
		};
		Q(Q.getScript(url, null, err)).attr("jsonp", callbackName);
		if (ttl > 0) thread = Q.delay(err, ttl)
	}
	function ajax(conf) {
		var _config = Q.extend({},
				defaultConfig, conf),
			dataType = _config.dataType,
			ttl = _config.timeout, //
			xhr = request(),
			url = Q.url(_config.url),
			isGet = Q.toUpper(_config.type) == "GET", //
			success = _config.success, error = _config.error, //
			thread,
			header,
			formData = Q.isString(conf.data) ? conf.data : Q.param(conf.data);
		if (dataType == "jsonp") {
			ajaxJSONP(_config, success, error);
			return;
		}
		//ajax deal
		xhr.onreadystatechange = function() {
			if (4 == xhr.readyState) {
				if (200 == xhr.status) {
					thread && thread.stop();
					success && success(dataType == 'xml' ? xhr.responseXML
																	: (dataType == 'json' ? toObject(xhr.responseText) : xhr.responseText))
				} else {
					error && error()
				}
			}
		};
		xhr.onprogress = conf.progress;
		if (isGet) {
			url += (/\?/.test(url) ? "&" : "?") + formData;
		}
		Q.extend(xhr, _config.xhrFields||{});
		xhr.open(_config.type, url, _config.async);

		header = _config.header || {};

		for(var name in header){//设置header头
			xhr.setRequestHeader(name, header[name]);
		}

		xhr.setRequestHeader("Cache-Control", "no-cache");
		xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
		header['Content-Type'] == null && !isGet && xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

		xhr.send(isGet ? null : formData);
		if (ttl > 0) thread = Q.delay(function() {
			xhr.abort();
			error && error(xhr.status||xhr.responseText)
		}, ttl);
		return xhr;
	}
	function get(url, data, success, dataType, method) {
		if (isFun(data)) {
			dataType = success;
			success = data;
			data = null
		}
		return ajax({
			url : url,
			data : data,
			success : success,
			dataType : dataType,
			type : method
		});
	}
	Q.extend({
		ajax : ajax,
		get : get,
		getJSON : function(url, data, success) {
			if (isFun(data)) {
				success = data;
				data = {}
			}
			get(url, data, success, 'json')
		},
		post : function(url, data, success, dataType) {
			if (isFun(data)) {
				dataType = success;
				success = data;
				data = {};
			}
			get(url, data, success, dataType, "post")
		}
	})
})(Qmik);
