/**
 * @author:leo
 * @email:cwq0312@163.com
 * @version:1.2.22
 */
(function() {
	var win = this, doc = win.document || {}, nav = win.navigator || {}, //
	UA = nav.userAgent, loc = win.location;
	var encode = encodeURIComponent, decode = decodeURIComponent, slice = [].slice, //
	baseURL = loc.protocol + "//" + loc.hostname + (loc.port ? ":" + loc.port : ""), //
	config = {
		context : "/"//工程上下文目录
	};
	//var readyRE = /complete|loaded|interactive/i;
	// define qmik object
	function Q(selector, context) {
		return Q.init(selector, context)
	}
	Q.extend = function() {
		var args = arguments, ret = args[0] || {}, i = 1;
		switch (args.length) {
		case 0:
			return;
		case 1:
			ret = this;
			i = 0;
			break
		}
		each(slice.call(args, i), function(j, v) {
			v && each(v, function(key, val) {
				isNull(val) || (ret[key] = val)
			})
		});
		return ret
	}
	Q.extend(String.prototype, {
		trim : function() {
			return this.replace(/^(\s|\u00A0)+|(\s|\u00A0)+$/g, "")
		},
		toLower : function() {
			return this.toLowerCase()
		},
		toUpper : function() {
			return this.toUpperCase()
		}
	});
	function grep(array, callback) {
		var ret = [];
		each(array, function(i, v) {
			(callback ? callback(i,v) : !isNull(v)) && ret.push(v)
		});
		return ret
	}
	// public function
	// ///////////////////////////////////////////////////////////////////
	// isNull
	function isNull(v) {
		return v === undefined || v === null
	}
	function likeNull(v) {
		return isNull(v) || (isString(v) && (v == "undefined" || v == "null" || v.trim() == ""))
	}
	// isString
	function isString(v) {
		return typeof v == 'string'
	}
	// isDom
	function isDom(v) {
		return v && v.nodeType == 1
	}
	// isArray
	function isArray(v) {
		return v instanceof Array
	}
	function likeArray(v) { // like Array
		return !isString(v) && (isArray(v) || (Q.isQmik && Q.isQmik(v)) || (function() {
			v += "";
                return v == "[object Arguments]" || v == "[object NodeList]" || v == "[object HTMLCollection]" || v == "[object StaticNodeList]"
		})())
	}
	// isFunction
	function isFun(v) {
		return v instanceof Function
	}
	function isError(v) {
		return v instanceof Error
	}
	function isObject(v) {
		return v instanceof Object
	}
	function each(obj, callback) { // each fun(k,v)
		var i;
		if (likeArray(obj)) {
			for (i = 0; i < obj.length; i++) {
				callback.call(obj[i], i, obj[i])
			}
		} else if (isObject(obj)) {
			for (i in obj) {
				callback.call(obj[i], i, obj[i])
			}
		}
	}
	// isNumber
	function isNum(v) {
		return typeof v == 'number'
	}
	function isBool(v) {
		return typeof v == 'boolean'
	}
	/*	function isBaseType(v) {
			return isBool(v) || isString(v) || isNum(v)
		}*/
	function toString(v) {
		return (isBool(v) || isString(v) || isNum(v)) ? v + "" : isFun(v) ? v.toString() : JSON.stringify(v)
	}
	// to json
	function toJSON(v) {
		return likeNull(v) ? "" : JSON.parse(v)
	}
	function isEvent(e) {
		return win.Event && e instanceof win.Event || e == win.event
	}
	function execObject(v) {
		return isFun(v) ? v() : v
	}
	function merge() { // merge array or object
		var args = arguments, array = args[0], isA = isArray(array), i = 1;
		for (; i < args.length; i++) {
			each(args[i], function(k, v) {
				isA ? array.push(v) : array[k] = v
			})
		}
		return array
	}
	/*	function isGrandfather(grandfather, child) {
			return isDom(child) && (grandfather === child.parentNode ? !0 : isGrandfather(grandfather, child.parentNode))
		}*/
	// 合并url,参数个数不限
	function concactUrl() {
		return Q.map(arguments, function(i, url) {
			return isArray(url) ? url.join("") : url
		}).join("/").replace(/(^\w+:\/\/)|([\/]{2,})/g, function(v) {
			return !/^\w+:\/\//.test(v) ? "/" : v
		})
	}
	function loadResource(type, url, success, error) {
        url = Q.url(url);
		var isCss = type == "css", isScript = type == "js", //
		tagName = isCss ? "link" : isScript ? "script" : "iframe", //
		node = Q(doc.createElement(tagName)).attr({
			_src : url,
			async : "async"
		});
		isCss ? node.attr("rel", "stylesheet") : isScript && node.attr("type", "text/javascript");
		node.ready(function(e) {
			success && success(e || {target:node})
		}).on("error", function(e) {
			node.remove();
			error && error(e || {target:node})
		});
		Q.delay(function() {
			if (isCss) node[0].href = url;
			else node[0].src = url;
			Q("head").append(node);
		}, 1);
		return node[0]
	}
	//////////Delay class, function 实现setTimeout的功能
	function Delay(fun, time, params) {
		var me = this;
		me.pid = setTimeout(function() {
			fun.apply(null, params)
		}, time)
	}
	Q.extend(Delay.prototype, {
		stop : function() {
			clearTimeout(this.pid)
		}
	});
	///////////////
	///////////////////Cycle class
	function Cycle(fun, cycleTime, ttl, params) {
		var me = this, start = Q.now(), chisu = 1;
		function _exec() {
			if ((isNull(ttl) || (chisu * cycleTime - start) <= ttl)) {
				fun.apply(null, params);
				me._p = new Delay(_exec, cycleTime, params);
			}
			chisu++;
		}
		me._p = new Delay(_exec, cycleTime, params);
	}
	Q.extend(Cycle.prototype, {
		stop : function() {
			this._p && this._p.stop()
		}
	});
	//////////////////////
	Q
		.extend({
			encode : encode,
			decode : decode,
			isDom : isDom,
			isBool : isBool,
			isString : isString,
			isFun : isFun,
			isFunction : isFun,
			isNum : isNum,
			isNumber : isNum,
			isArray : isArray,
			isNull : isNull,
			isError : isError,
			each : each,
			stringify : toString,
			parseJSON : toJSON,
			isEvent : isEvent,
			likeArray : likeArray,
			isDate : function(v) {
				return v instanceof Date
			},
			isObject : isObject,
			isPlainObject : function(v) { // isPlainObject
				if (isNull(v) || v + '' != '[object Object]' || v.nodeType || v == win) return !1;
				var k;
				for (k in v) {
				}
				return isNull(k) || Object.prototype.hasOwnProperty.call(v, k)
			},
			likeNull : likeNull,
			/**
			 * 继承类 子类subClass继承父类superClass的属性方法, 注:子类有父类的属性及方法时,不会被父类替换
			 */
			inherit : function(subClass, superClass) {
				function F() {
				}
				var subPrototype = subClass.prototype;
				F.prototype = superClass.prototype;
				subClass.prototype = new F();
				subClass.prototype.constructor = subClass;
				if (superClass.prototype.constructor == Object.prototype.constructor) {
					superClass.prototype.constructor = superClass;
				}
				for ( var name in subPrototype) {
					subClass.prototype[name] = subPrototype[name];
				}
				for ( var name in superClass) {
					subClass[name] = superClass[name];
				}
			},
			trim : function(v) {
				return isNull(v) ? "" : isString(v) ? v.trim() : v.toString().trim()
			},
			toLower : function(v) {
				return v ? v.toLower() : v
			},
			toUpper : function(v) {
				return v ? v.toUpper() : v
			},
			// 合并数组或对象
			merge : merge,
			array : function(array) {
				return merge([], array)
			},
			inArray : function(value, array) {
				if (Q.likeArray(array)) for ( var i = 0; i < array.length; i++)
					if (array[i] === value) return i;
				return -1
			},
			unique : function(array) {
				var ret = [];
				each(array, function(i, value) {
					Q.inArray(value, ret) < 0 && ret.push(value)
				});
				return ret
			},
			//contains : isGrandfather,
			/**
			 * 对数组里的内容,做部做一次数据映射转换,
			 * 例:
			 * var array=[1,2,3];
			 * array = Qmik.map(array,function(index,val){
			 * 	return index*val
			 * });
			 * console.log(array);//>>0,2,6
			 */
			map : function(array, callback) {
				var r = [], i = 0;
				for (; array && i < array.length; i++)
					isNull(array[i]) || r.push(callback(i, array[i]));
				/*each(array, function(i, val) {
					isNull(val) || r.push(callback(i, val));
				})*/
				return r
			},
			/**
			 * 取得脚本
			 */
			getScript : function(url, success, error) {
				return loadResource("js", url, success, error)
			},
			/**
			 * 取得css
			 */
			getCss : function(url, success, error) {
				return loadResource("css", url, success, error)
			},
			grep : grep,
			/**
			 * 抽取数组里面每个元素的name和value属性,转换成一个url形式(a=b&name=g)的字符串
			 */
			param : function(array) {
				var h = [];
				each(array, function(i, v) {
					isString(i) ? h.push(encode(i) + '=' + encode(execObject(v))) : v.name && h.push(encode(v.name) + '='
																																+ encode(execObject(v.value)))
				});
				return h.join('&')
			},
			/**
			 * 当前时间
			 */
			now : function(d) {
				return (d || 0) + new Date().getTime()
			},
			// 延迟执行,==setTimeout
			/**
			 * target:apply,call的指向对象
			 */
			delay : function(fun, time) {
				//var params = slice.call(arguments, 2);
				return new Delay(fun, time, slice.call(arguments, 2))
			},
			// 周期执行
			/**
			 * fun:执行的方法
			 * cycleTime:执行的周期时间
			 * ttl:过期时间,执行时间>ttl时,停止执行,单位 ms(毫秒)
			 * target:apply,call的指向对象
			 */
			cycle : function(fun, cycleTime, ttl) {
				//var params = slice.call(arguments, 3);
				return new Cycle(fun, cycleTime, ttl, slice.call(arguments, 3));
			},
			log : function(msg, e) {
				if (config.debug || isError(msg) || isError(e)) {
					msg = isError(msg) ? msg.stack : msg;
					msg += isError(e) ? e.stack : "";
					try {
						console.log(msg)
					} catch (e) {
					}
				}
			},
			isIphone : function() {
				return /iPhone OS/.test(UA)
			},
			isAndroid : function() {
				return /Android/.test(UA)
			},
			isWP : function() {
				return /Windows Phone/.test(UA)
			},
			isIE : function() {
				return /MSIE/.test(UA)
			},
			/**
			 * is Firefox
			 */
			isFF : function() {
				return /Firefox/.test(UA)
			},
			/**
			 * is Webkit
			 */
			isWK : function() {
				return /WebKit/.test(UA)
			},
			isOpera : function() {
				return /Opera/.test(UA)
			},
			isRetinal : function(){//判断是否是视网膜高清屏,默认是高清屏
				return (win.devicePixelRatio || 2) >= 1.5;
			},
			config : function(opts, _config) {
				_config = arguments.length <= 1 ? config : (_config || {});
				var ret = _config;
				if (arguments.length < 1 || isNull(opts)) {
				} else if (!isObject(opts)) {
					ret = _config[opts]
				} else {
					each(opts, function(key, val) {
						isObject(val) && _config[key] ? Q.extend(_config[key], val) : (_config[key] = val)
					})
				}
				return ret
				//return (arguments.length < 1 || isNull(opts)) ? _config : isObject(opts) ? Q.extend(_config, opts) : _config[opts]
			},
			/**
			 * 合并url,if 参数 _url为空,则
			 */
			url : function(_url) {
				return arguments.length < 1 ? baseURL
													: !/^[a-zA-Z0-9]+:\/\//.test(_url)	? concactUrl(baseURL, (/^\//.test(_url) ? ""
																																						: config.context || "/") + "/"
																																	+ _url)
																									: _url
			},
			cssPrefix : function(style) {
				var ret = {};
				if (isString(style)) {
                    ret = (Q.isWK() ? "-webkit-" : Q.isIE() ? "-ms-" : Q.isFF() ? "-moz-" : Q.isOpera() ? "-o-" : "") + style;
				} else {
					each(Q.extend({}, style), function(key, val) {
						ret[Q.cssPrefix(key)] = val
					})
				}
				return ret
			}
		});
	each([
		Q.url, Q.now
	], function(i, val) {
		val.toString = val
	});
	Q._in = {};//不对外部开放,不保持此对象api不变动,
	Q.extend(Q._in, {
		createEvent : function(type) {
			return doc.createEvent ? doc.createEvent(type) : doc.createEventObject(type)
		},
		isSE : function() {
			return !isNull(doc.addEventListener)
		}
	});
	///////////////////////////////////////////////////////
	Q.version = "1.2.23";
	Q.global = win;
	win.Qmik = Q;
	win.$ = win.$ || Q;
})();

/**
 * @author:leo
 * @email:cwq0312@163.com
 * @version:1.00.100
 */
(function(Q) {
	var win = Q.global, doc = win.document, _in = Q._in;
	var SE = _in.isSE, isNull = Q.isNull, isDom = Q.isDom, each = Q.each, //
	likeArray = Q.likeArray, isArray = Q.isArray,likeNull = Q.likeNull, //
	isString = Q.isString, isFun = Q.isFun, isPlainObject = Q.isPlainObject, trim = Q.trim, //
	toLower = Q.toLower, toUpper = Q.toUpper, replace = function(value, str1, str2) {
		return value.replace(str1, str2)
	};
	/* 节点查询编译 */
	var rNode = /^\s*(<.+>.*<\/.+>)+|(<.+\/\s*>)+\s*$//*, match = {
		ID : /^#[\w-_\u00c0-\uFFFF]+/,
		ATTR : /^([\w-_]+)?\[\s*[\w-_]+\s*!?=\s*('|")?(.*)('|")?\s*\]/,
		CT : /^([\w-_]+)?\.[\w-_]+/,
		TAG : /^[\w-_]+/
	}*/, addUints = "height width top right bottom left".split(" ");
	/** Qmik查询 */
	function Query(selector, context) {
		var me = this, r;
		me.context = context = context || doc;
		me.selector = selector = clearLine(selector);
		me.length = 0;
		if (isString(selector)) {
			if (rNode.test(selector)) {
				var t = doc.createElement('div');
				t.innerHTML = selector;
				r = t.children;
			} else {
				each(find(selector, context), function(j, dom) {
					me._push(dom)
				})
				return me
			}
		} else {
			r = likeArray(selector) ? selector : [
				selector
			]
		}
		for(var i=0;i<r.length ;i++){
			me._push(r[i])
		}
		return me
	}
	Q.extend(Query.prototype, {
		_push : function(v) {
			v && ( this[this.length++] = v )
		}
	});
	// Q.inherit(Query, Array);
	function init(selector, context) {
		context = context || doc;
		if (isFun(selector)) { return Q(doc).ready(selector) }
		return isQmik(selector) ? selector : new Query(selector, context)
	}
	function isQmik(v) {
		return v instanceof Query
	}
	//查找元素节点
	function find(selector, context) {
		var result=[];
		if(!likeNull(selector)){
			context = isString(context) ? Q(context) : context;
			if(isQmik(context)){
				each(context, function(i, v) {
					isDom(v) && (result = arrayConcat(result,v.querySelectorAll(selector)))
				});
			}else{
				result=context.querySelectorAll(selector) || []
			}
		}
		return result
	}
	function clearLine(str){
		return isString(str) ? str.replace(/\r|\n/g,"") : str
	}

	function execObject(v, target) {
		return isFun(v) ? v() : v
	}
	// As much as possible to Array
	function arrayConcat(sarray,tarray) {
		if(isArray(tarray)){
			sarray =sarray.concat(tarray)
		}else{
			for(var i=0;i<tarray.length;i++){
				sarray.push(tarray[i])
			}
		}
		return sarray
	}
	function at(target, name) {
		return !SE() ? target[name] : target.getAttribute(name) || target[name]
	}
		
	// /////////////////////////////////////////////////
	function hasClass(dom, className) {
		if (!isDom(dom)) return !1;
		var cs = dom.className.split(" "), i = 0;
		className = trim(className);
		for (; i < cs.length; i++)
			if (cs[i] == className) return !0;
		return !1
	}
	function formateClassName(v) {
		return replace(v, /[A-Z]/g, function(v) {
			return "-" + toLower(v)
		})
	}
	function muchValue2Qmik(c) {
		c = execObject(c);
		c = clearLine(c);
		return isString(c) && rNode.test(c) ? Q(c) : c
	}
	function append(o, child) {
		child = muchValue2Qmik(child);
		if (likeArray(o)) {
			each(o, function(k, v) {
				append(v, child)
			})
		} else if (isDom(o)) {
			likeArray(child) ? each(child, function(k, v) {
				append(o, v)
			}) : o.appendChild(isDom(child) ? child : doc.createTextNode(child))
		}
	}
	function before(o, child) {
		child = muchValue2Qmik(child);
		if (likeArray(o)) {
			each(o, function(k, v) {
				before(v, child)
			})
		} else if (isDom(o)) {
			likeArray(child) ? each(child, function(k, v) {
				before(o, v)
			}) : o.parentNode.insertBefore(isDom(child) ? child.cloneNode(!0) : doc.createTextNode(child), o)
		}
	}
	function after(o, child) {
		if (isDom(o)) {
			var n = GN(o);
			n ? before(n, child) : append(o.parentNode, child)
		} else if (likeArray(o)) {
			each(o, function(i, v) {
				after(v, child)
			})
		}
	}
	function setValue(obj, key, val) {
		obj[key] = val;
		return obj
	}
	function formateClassNameValue(name, value) {
		for ( var i in addUints) {
			if (name.indexOf(addUints[i]) >= 0) {
				if(!/[^\d\.-]/.test(value)){
					value += "px"				
				}
				break
			}
		}
		return value
	}
	function getStyle(dom,name){
		return dom.currentStyle ? dom.currentStyle[name] : doc.defaultView.getComputedStyle(dom,false)[name]
	}
	function css(o, k, v) {
		//k = isString(k) && !isNull(v) ? Q.parseJSON('{"' + k + '":"' + execObject(v) + '"}') : k;
		k = isString(k) && !isNull(v) ? setValue({}, k, execObject(v)) : k;
		if (likeArray(o)) {
			if (isString(k)) return css(o[0], k);
			each(o, function(i, j) {
				css(j, k)
			})
		} else if (isDom(o)) {
			//if (isString(k)) return o.style[formateClassName(k)];
			if (isString(k)) return getStyle(o,formateClassName(k));
			v = "";
			each(k, function(i, j) {
				v += formateClassName(i) + ':' + formateClassNameValue(i, j) + ';'
			});
			o.style.cssText += ';' + v
		}
	}
	function attr(target, name, val, isSetValue) {
		if (likeArray(target)) {
			if (isString(name) && isNull(val)) return attr(target[0], name, val, isSetValue) || "";
			each(target, function(i, j) {
				attr(j, name, val, isSetValue)
			})
		} else if (!isNull(target)) {
			//if (isString(name) && isNull(val)) return target[name] ? target[name] : target.getAttribute(name);
			//if (isString(name) && isNull(val)) return (isSetValue || !SE()) ? target[name] : target.getAttribute(name) || target[name];
			if (isString(name) && isNull(val)) return at(target, name);
			if (isPlainObject(name)) {
				each(name, function(i, j) {
					attr(target, i, j, isSetValue)
				})
			} else {
				if (isDom(val)) {
					attr(target, name, "", isSetValue);
					Q(target).append(val)
				} else {
					var val = execObject(val);
					(isSetValue || !SE()) ? target[name] = val : target.setAttribute(name, val);
				}
			}
		}
	}
	function clone(o, isDeep) {
		if (isDom(o)) { return Q(o.cloneNode(isDeep == !0)) }
		var r = [];
		each(o, function(k, v) {
			isDom(v) && r.push(clone(v, isDeep))
		})
		return Q(r)
	}
	var dn = "$Qmikdata:";
	function data(o, k, v) {
		if (likeArray(o)) {
			if (isString(k) && isNull(v)) return data(o[0], k, v);
			each(o, function(i, j) {
				data(j, k, v)
			})
		} else if (!isNull(o)) {
			if (isNull(o[dn])) o[dn] = {};
			if (isNull(v) && isString(k)) return o[dn][k];
			isString(k) ? o[dn][k] = v : each(k, function(i, j) {
				o[dn][i] = j
			})
		}
	}
	
	/** 是否是父或祖父节点 */
	function contains(grandfather, child) {
		//return isDom(child) && (grandfather === child.parentNode ? !0 : contains(grandfather, child.parentNode))
		return isDom(child) &&( grandfather===doc || (grandfather.contains(child)))
	}
	
	function GN(dom, type) {
		if (dom) {
			dom = type == "prev" ? dom.previousSibling : dom.nextSibling;
			return isDom(dom) ? dom : GN(dom, type)
		}
	}
	function uponSelector(dom, selector, type, ret) {
		var list = Q(dom.parentNode).children(selector), i, zdom;
		if (type == "prev") {
			for (i = list.length - 1; i >= 0; i--) {
				for (zdom = dom; (zdom = GN(zdom, type)) && zdom == list[i];) {
					ret.push(zdom);
					break
				}
			}
		} else {
			for (i = 0; i < list.length; i++) {
				for (zdom = dom; (zdom = GN(zdom, type)) && zdom == list[i];) {
					ret.push(zdom);
					break
				}
			}
		}
	}
	function upon(qmik, selector, type) {
		var ret = [];
		each(qmik, function(i, dom) {
			isNull(selector) ? ret.push(GN(dom, type)) : uponSelector(dom, selector, type, ret)
		});
		return new Query(ret, qmik)
	}
	function matchesSelector(dom, selector) {
		if(dom){
			dom._matchesSelector = dom.matchesSelector || dom.msMatchesSelector || dom.mozMatchesSelector || dom.webkitMatchesSelector;
			return dom._matchesSelector && dom._matchesSelector(selector)
		}
	}
	/**
	 * 	selector:选择器 
	 	qmik:qmik查询对象 
	 	isAllP:是否包含所有父及祖父节点 默认true
	 * 	isOnlyParent:往上查找的层级是否只到直接父节点 默认false
	 */
	function parents(selector, qmik, isAllP, isOnlyParent) {
		selector = selector ? trim( selector ) : selector;
		var array = [],isPush=0;
		isAllP = isAllP != !1;
		isOnlyParent = isOnlyParent == !0;
		var isSelector = !isNull(selector);
		each(qmik,function(i, dom){
			var p = dom.parentNode,tp;
			while(isDom(p) && p != doc.body){
				isPush = 0;
				if(isSelector){
					tp = p.parentNode;
					if(tp && Q.inArray(p ,Q(tp).children(selector))>-1){
						isPush = 1
					}
				}else{
					isPush = 1
				}
				if(isPush){
					array.push(p);
					if (!isAllP) break
				}
				if (isOnlyParent) break;	
				p && ( p = p.parentNode )
			}
		});
		return Q(array)
	}
	Q.init = init;
	var fn = Q.fn = Query.prototype;
	fn.extend = function(o) {
		each(o, function(k, v) {
			Query.prototype[k] = v
		})
	}
	fn.extend({
		last : function() {
			return Q(this[this.length - 1])
		},
		eq : function(i) {
			return Q(this[i])
		},
		first : function() {
			return Q(this[0])
		},
		filter : function(f) {
			var r = new Query();
			each(this, function(i, v) {
				if (f(i, v)) r._push(v)
			});
			return r
		},
		even : function() {
			return this.filter(function(i, v) {
				return i % 2 == 0
			})
		},
		odd : function() {
			return this.filter(function(i, v) {
				return i % 2 != 0
			})
		},
		gt : function(i) {// 大于
			var r = new Query(), j = i + 1;
			for (; j < this.length && j >= 0; j++) {
				r._push(this[j])
			}
			return r
		},
		lt : function(i) {// 小于
			var r = new Query(), j = 0;
			for (; j < i && j < this.length; j++) {
				r._push(this[j])
			}
			return r
		},
		find : function(s) {
			return new Query(s, this)
		},
		each : function(f) {
			each(this, f);
			return this
		},
		append : function(c) {
			append(this, c);
			return this
		},
		remove : function() {
			each(this, function(i, v) {
				isDom(v.parentNode) && v.parentNode.removeChild(v)
			});
			return this
		},
		before : function(c) {
			before(this, c);
			return this
		},
		after : function(c) {
			after(this, c);
			return this
		},
		html : function(v) {
			var me = this;
			if (arguments.length < 1) return attr(me, "innerHTML");
			else {
				attr(me, "innerHTML", isQmik(v) ? v.html() : v, !0);
				Q("script", me).each(function(i, dom) {
					likeNull(dom.text) || eval(dom.text)
				})
			}
			return this
		},
		empty : function() {
			this.html("");
			return this
		},
		text : function(v) {
			var r = attr(this, "innerText", isQmik(v) ? v.text() : v, !0);
			return isNull(v) ? r : this
		},
		addClass : function(n) {
			each(this, function(i, v) {
				if (isDom(v) && !hasClass(v, n)) v.className += ' ' + trim(execObject(n))
			});
			return this
		},
		rmClass : function(n) {
			var r = new RegExp(replace(execObject(n), /\s+/g, "|"), 'g');
			each(this, function(i, v) {
				v.className = replace(trim(replace(v.className, r, '')), /[\s]+/g, ' ')
			});
			return this
		},
		show : function() {
			css(this, 'display', 'block');
			return this
		},
		hide : function() {
			css(this, 'display', 'none');
			return this
		},
		toggle : function() {
			each(this, function(i, v) {
				css(v, 'display') == 'none' ? Q(v).show() : Q(v).hide()
			});
			return this
		},
		toggleClass : function(className) {
			this.each(function(i, dom) {
				hasClass(dom, className) ? Q(dom).rmClass(className) : Q(dom).addClass(className)
			})
		},
		map : function(callback) {
			return Q.map(this, callback)
		},
		css : function(k, v) {
			var r = css(this, k, v);
			return isPlainObject(k) || (isString(k) && !isNull(v)) ? this : r
		},
		attr : function(k, v) {
			var r = attr(this, k, v);
			return (arguments.length > 1 || isPlainObject(k)) ? this : r
		},
		rmAttr : function(k) {
			each(this, function(i, v) {
				isDom(v) && v.removeAttribute(k)
			})
		},
		data : function(k, v) {
			return data(this, k, v)
		},
		rmData : function(k) {
			each(this, function(i, v) {
				if (v.$Qmikdata) delete v.$Qmikdata[k]
			})
		},
		val : function(v) {
			if (isNull(v)) return this.attr("value") || "";
			each(this, function(i, u) {
				u.value = execObject(v)
			})
		},
		next : function(s) {
			return upon(this, s, "next")
		},
		prev : function(s) {
			return upon(this, s, "prev")
		},
		clone : function(t) {
			return clone(this, t)
		},
		hover : function(fin, fout) {
			this.bind("mouseover", fin).bind("mouseout", fout).bind("touchstart", function() {
				fin();
				Q.delay(fout, 500)
			})
		},
		hasClass : function(c) {
			return hasClass(this[0], c)
		},
		closest : function(selector) {// 查找最近的匹配的父(祖父)节点
			var me = this, q = new Query();
			me.each(function(i, dom) {
				Q(selector, dom.parentNode).each(function(j, dom1) {
					dom === dom1 && q._push(dom)
				})
			});
			/**
			* selector:选择器 
			qmik:qmik查询对象 
			isAllP:是否包含所有父及祖父节点 默认true
			* isOnlyParent:往上查找的层级是否只到直接父节点 默认false
			*/
			return q.length > 0 ? q : parents(selector, me, !1)
		},
		parents : function(selector) {// 查找所有的匹配的父(祖父)节点
			return parents(selector, this, !0)
		},
		parent : function(selector) {// 查找匹配的父节点
			return parents(selector, this, !0, !0)
		},
		children : function(selector) {//查找直接子节点
			var r = new Query();
			var me = this;
			var isNullSelector = isNull(selector);
			me.each(function(i, dom) {
				//var childs = dom.childNodes;
				var childs = dom.children;
				var j = 0,
					tdom;
				while (j < childs.length) {
					tdom = childs[j++];
					isDom(tdom) && (isNullSelector || matchesSelector(tdom, selector)) && r._push(tdom)
				}
			});			
			return r
		}
	});
	fn.extend({
		removeClass : fn.rmClass,
		removeData : fn.rmData,
		removeAttr : fn.rmAttr
	});
	Q.isQmik = isQmik;
})(Qmik);

/**
 * @author:leo
 * @email:cwq0312@163.com
 * @version:1.00.000
 */
(function(Q) { /* event */
	var win = Q.global, doc = win.document, fn = Q.fn, _in = Q._in;
	var SE = _in.isSE, readyRE = /complete|loaded|interactive|loading/i, // /complete|loaded|interactive/
	ek = "$QEvents", liveFuns = {};
	var isNull = Q.isNull, isFun = Q.isFun, each = Q.each;
	/** 设置节点的加载成功方法 */
	function setLoad(node, fun) {
		node.onreadystatechange = node.onload = node.onDOMContentLoaded = fun
	}
	Q.ready = fn.ready = function(fun, context) {
		var node = context || this[0] || doc, state;
		function ready(e) {
			state = node.readyState;
			if (state != "loading" && !isNull(node.$$handls) && (readyRE.test(state) || (isNull(state) && "load" == e.type))) {
				setLoad(node, null);
				each(node.$$handls, function(i, val) {
					val(e);
				});
				delete node.$$handls
			}
		}
		if (readyRE.test(node.readyState)) {
			Q.delay(function() {
				fun.call(node, _in.createEvent("MouseEvents"))
			}, 1);
		} else {
			var hs = node.$$handls = node.$$handls || [];
			hs.push(fun);
			/*Q(node).on({
				"DOMContentLoaded" : ready,
				"readystatechange" : ready,
				"load" : ready
			});*/
			setLoad(node, ready)
		}
		return this
	}
	function Eadd(dom, name, fun, paramArray) {
		var t = Q(dom), d = t.data(ek) || {}, h = d[name];
		t.data(ek, d);
		if (!h) {
			d[name] = h = [];
			//isFun(dom['on' + name]) ? (h[0] = dom['on' + name]) : SE() ? dom.addEventListener(name, handle, !1) : dom["on" + name] = handle
			if (isFun(dom['on' + name])) {
				h.push({
					fun : dom['on' + name],
					param : []
				});
				delete dom['on' + name];
			}
			SE() ? dom.addEventListener(name, handle, !1) : dom["on" + name] = handle
		}
		isFun(fun) && h.push({
			fun : fun,
			param : paramArray || []
		})
	}
	function Erm(dom, name, fun) {
		var s = Q(dom).data(ek) || {}, h = s[name] || [], i = h.length - 1;
		if (fun) {
			for (; i >= 0; i--)
				h[i].fun == fun && h.splice(i, 1)
		} else {
			SE() ? dom.removeEventListener(name, handle, !1) : delete dom["on" + name];
			delete s[name]
		}
	}
	function Etrig(dom, name) {
		var e;
		if (SE()) {
			switch (name) {
			case "hashchange":
				e = _in.createEvent("HashChangeEvent");
				break
			default:
				e = _in.createEvent("MouseEvents");
			}
			e.initEvent(name, !0, !0);
			dom.dispatchEvent(e)
		} else dom.fireEvent('on' + name)
	}
	function handle(e) {
		e = fixEvent(e || win.event);
		var retVal, m = this, fun, param, events = Q(m).data(ek) || {};
		each(events[e.type], function(i, v) {
			try{
				fun = v.fun;
				param = v.param || [];
				if (isFun(fun)) {
					retVal = fun.apply(m, [
						e
					].concat(param));
					//if (!isNull(retVal)) e.returnValue = retVal
					//兼容ie处理
					if (!isNull(retVal)) {
						e.returnValue = retVal;
						if (win.event) win.event.returnValue = retVal;
					}
				}
			}catch(e1){Q.log(e1.message,e1)}
		})
	}
	function fixEvent(e) {
		e.preventDefault || (e.preventDefault = function() {
			this.returnValue = !1;
			if (win.event) win.event.returnValue = !1;
		});
		e.stopPropagation || (e.stopPropagation = function() {
			this.cancelBubble = !0
		});
		e.target || (e.target = e.srcElement);
		return e
	}
	function getLiveName(selector, type, callback) {
		return selector + ":live:" + type + ":" + (callback || "").toString()
	}
	fn.extend({
		on : function(name, callback) {
			var p = [].slice.call(arguments, 2);
			each(this, function(k, v) {
				Q.isPlainObject(name) ? each(name, function(k, j) {
					Eadd(v, k, j, callback)
				}) : Eadd(v, name, callback, p)
			});
			return this
		},
		un : function(name, callback) {
			each(this, function(k, v) {
				Erm(v, name, callback)
			});
			return this
		},
		once : function(name, callback) {// 只执行一次触发事件,执行后删除
			var me = this;
			function oneexec(e) {
				callback(e);
				me.un(name, oneexec)
			}
			me.on(name, oneexec)
		},
		trigger : function(name) {
			each(this, function(k, v) {
				Etrig(v, name)
			});
			return this
		},
		live : function(name, callback) {
			var select = this.selector;
			var names = name;
			if(!Q.isPlainObject(name)){
				names={};
				names[name]=callback
			}
			each(names,function(key,callback){
				var fun = liveFuns[getLiveName(select, key, callback)] = function(e) {
					var me = e.target,_me=Q(me);
					if ( Q.isString(select) ? _me.closest(select).length > 0 : 
							Q.isDom(select) ? Q.inArray(select, _me.parents()) >= 0 : 0) {
						callback.apply(me, [
							e
						])
					}
				};
				Q("body").on(key, fun)
			});
			return this
		},
		die : function(name, callback) {
			var fun = liveFuns[getLiveName(this.selector, name, callback)];
			each(Q(document.body), function(k, dom) {
				Erm(dom, name, fun)
			});
			return this
		}
	});
	fn.extend({
		bind : fn.on,
		unbind : fn.un,
		off : fn.un
	});
	/**
	 * event orientationchange:重力感应,0：与页面首次加载时的方向一致 -90：相对原始方向顺时针转了90° 180：转了180°
	 * 90：逆时针转了 Android2.1尚未支持重力感应
	 */
	var qwc = "click blur focus scroll resize".split(" ");
	each(qwc, function(i, v) {
		fn[v] = function(f) {
			return f ? this.on(v, f) : this.trigger(v)
		}
	})
})(Qmik);

/**
 * @author:leo
 * @email:cwq0312@163.com
 * @version:1.00.000
 */
(function(Q) { /* ajax */
	var win = Q.global, toObject = Q.parseJSON, isFun = Q.isFun, //
	regUrl = /[\w\d_$-]+\s*=\s*\?/, jsonp = 1, prefex = "jsonp", //
	ac = {
		type : 'GET',
		async : !0,
		dataType : 'text'
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
		if (url.indexOf("?") < 0) url += "?";
		if (cb) {
			cb = cb[0].split("=")[0];
			url = url.replace(regUrl, cb + "=" + callbackName)
		} else {
			url += "&callback=" + callbackName
		}
		url += gdata;
		function err() {
			if (isExe == 1) {
				isExe = 0;
				Q("script[jsonp='" + callbackName + "']").remove();
				error && error()
			}
		}
		win[callbackName] = function(data) {
			win[callbackName] = null;
			Q("script[jsonp='" + callbackName + "']").remove();
			thread && thread.stop();
			success && success(data)
		}
		Q(Q.getScript(url, null, err)).attr("jsonp", callbackName);
		if (ttl > 0) thread = Q.delay(err, ttl)
	}
	function ajax(conf) {
		var _config = Q.extend({}, ac, conf), dataType = _config.dataType, ttl = _config.timeout, //
		xhr = request(), url = Q.url(_config.url), data = _config.data, isGet = _config.type == "GET", //
		success = _config.success, error = _config.error, //
		thread;
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
		if (isGet) {
			url += (url.indexOf("?") < 1 ? "?" : "&") + Q.param(data);
		}
		xhr.open(_config.type, url, _config.async);
		xhr.setRequestHeader("Cache-Control", "no-cache");
		xhr.send(isGet ? {} : data)
		if (ttl > 0) thread = Q.delay(function() {
			xhr.abort();
			error && error(xhr.xhr, xhr.type)
		}, ttl)
	}
	function get(url, data, success, dataType, method) {
		if (isFun(data)) {
			dataType = success;
			success = data;
			data = null
		}
		ajax({
			url : url,
			data : data,
			success : success,
			dataType : dataType,
			type : method
		})
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

/**
 * @author:leo
 * @email:cwq0312@163.com
 * @version:1.00.000
 */
(function(Q) {
	var isFun = Q.isFun, isNull = Q.isNull, now = Q.now;
	var config = {
		alias : {},//别名系统
		vars : {},//路径变量系统
		gap : 60, //单位秒,间隔多少秒回收模块,释放空间
		preload : []
	//预加载
	};
	var cacheModule = {}, //模块池
	currentScript, //当前脚本
	pres, //预加载的全路径url
	ispreload = !1;//是否加载过预加载
	var sun = {};
	function Module(url, dependencies, factory) {
		Q.extend(this, {
			id : url,
			url : url,
			dir : url.replace(/\?.*/, "").replace(/[^\/]*$/i, ""),//当前目录
			dependencies : dependencies,// 依赖模块
			factory : factory,
			// module is ready ,if no, request src from service
			isReady : !1,// is ready ,default false,
			type : Q.inArray(url, pres) >= 0 ? 2 : 1,//2:预加载的类型,1:普通类型
			exports : {},
			last : now()
		})
	}
	/** 清除注释 */
	function clearNode(word) {
		return word.replace(/(\/\/)\S*[^\n]*/g, "").replace(/\/\*[\S\s]*\*\//g, "")
	}
	// get depends from function.toString()
	function parseDepents(code) {
		code = clearNode(code.toString());
		var params = code.replace(/^\s*function\s*\w*\s*/, "").match(/^\([\w ,]*\)/)[0].replace("\(", "").replace("\)", "");
		var match = [], idx = params.indexOf(",");
		if (idx >= 0) {
			var require = params.substring(0, idx), pattern = new RegExp(require + "\s*[(]\s*[\"']([^\"'\)]+)[\"']\s*[)]", "g");
			match = Q.map(code.match(pattern), function(i, v) {
				return v.replace(new RegExp("^" + require + "\s*[(]\s*[\"']"), "").replace(/\s*[\"']\s*[)]$/, "")
			})
		}
		return match
	}
	function QueueSync(fun) {
		var me = this;
		me._deal = fun;
		me.l = me.p = 0;
		me.notify();
	}
	{
		Q.extend(QueueSync.prototype, {
			notify : function() {
				var me = this;
				me.state = 1;
				me.deal();
				return me
			},
			pause : function() {
				this.state = 2;
				return this
			},
			size : function() {
				return this.l - this.p
			},
			push : function(val) {
				this[this.l++] = val
			},
			pop : function() {
				//return this.splice(0, 1)[0]
				var me = this, val = me[me.p];
				delete me[me.p++];
				return val
			},
			deal : function() {
				var me = this;
				if (me.state == 1 && me.size() > 0) {
					me._deal(me.pause().pop(), function() {
						me.notify()
					})
				}
				return me
			}
		});
	}
	var queue = new QueueSync(function(item, chain) {
		var callback = item.callback;
		batload(function() {
			callback && callback.apply(callback, arguments);
			chain()
		}, item.ids)
	});
	function loadError() {
		queue.notify()
	}
	// require module
	function require(id) {
		var module = getModule(id2url(id));
		return module ? module.exports : null
	}
	// bat sequence load module
	function batload(callback, deps) {
		var dependencies = deps || config.preload, length = dependencies.length, params = [];
		length == 0 ? callback() : (function bload(idx) {
			load(dependencies[idx], function(exports) {
				params.push(exports);
				idx == length - 1 ? callback.apply(callback, params) : bload(idx + 1)
			})
		})(0)
	}
	function load(id, callback) {
		var url = id2url(id), module = getModule(url);
		if (module) {
			module.isReady ? useModule(module, require, callback) : batload(function() {
				useModule(module, require, callback)
			}, module.dependencies)
		} else {
			request(url, function() {
				try {
					batload(function() {
						useModule(getModule(url), require, callback)
					}, getModule(url).dependencies)
				} catch (e) {
					Q.log("get module error:" + url);
					loadError(e);
					throw e
				}
			}, loadError)
		}
	}
	function getModule(alia) {
		return cacheModule[id2url(alia)]
	}
	function useModule(module, require, callback) {
		if (module.isReady != !0) {
			var nm = module.factory(require, module.exports, module);
			module.exports = module.exports || nm
		}
		module.isReady = !0;
		module.last = now();
		callback(module.exports)
	}
	function request(url, success, error) {
		/\/.+\.css(\?.*)?$/i.test(url) ? Q.getCss(url) : currentScript = Q.getScript(url, success, error)
	}
	function getCurrentScript() {
		return currentScript
	}
	// //////////////// id to url start ///////////////////////////////
	function id2url(id) {
		id = alias2url(id);
		id = vars2url(id);
		return normalize(id)
	}
	function normalize(url) {
		return Q.url(!/\?/.test(url) && !/\.(css|js)$/.test(url) ? url + ".js" : url)
	}
	/** 别名转url */
	function alias2url(id) {
		return config.alias[id] || id
	}
	//变量转url
	function vars2url(id) {
		Q.each(id.match(/\$\{[0-9a-zA-Z._]+\}/g) || [], function(i, val) {
			var tmp = config.vars[val.substring(2, val.length - 1)] || val;
			id = id.replace(new RegExp("\\" + val, "g"), Q.isFun(tmp) ? tmp() : tmp)
		});
		return id
	}
	// ////////////////id to url end ///////////////////////////////
	Q.extend(sun, {
		use : function(ids, callback) {
			ids = Q.isArray(ids) ? ids : [
				ids
			];
			ids = Q.map(ids, function(i, val) {
				return id2url(val)
			});
			if (!ispreload) {
				queue.push({
					ids : config.preload
				});
				pres = Q.map(config.preload, function(i, val) {
					return id2url(val)
				});
				ispreload = !0
			}
			//下面检测使用的模块是否已被全部加载过
			var ret = Q.grep(ids, function(i,val) {
				return !isNull(getModule(val))
			});
			ret.length == ids.length ? batload(callback, ids) : queue.push({
				ids : ids,
				callback : callback
			});
			queue.deal()
		},
		// factory:function(require, exports, module)
		define : function(dependencies, factory) {
			if (isNull(getCurrentScript())) return;
			var url = getCurrentScript().src;
			if (isFun(dependencies)) {
				factory = dependencies;
				dependencies = []
			}
			if (!getModule(url)) {
				dependencies = dependencies.concat(parseDepents(factory));
				cacheModule[url] = new Module(url, Q.unique(dependencies), factory);
				//useModule(cacheModule[url], require)
			}
		},
		config : function(opts) {//参数配置
			return Q.config(opts, config)
		},
		gc : gc
	});
	//内存回收
	function gc() {
		Q.each(cacheModule, function(key, val) {
			if (val.type == 1 && now() - val.last > (config.gap || 60) * 1000) {
				try {
					delete cacheModule[key];
					Q("script[_src='" + key + "']").remove();
					val.gc && val.gc()
				} catch (e) {
				}
			}
		})
	}
	Q.cycle(gc, config.gap);
	Q.sun = sun;
	Q.define = Q.sun.define;
	Q.use = Q.sun.use;
})(Qmik);

/**
 * @author:le0
 * @email:cwq0312@163.com
 * @version:1.00.000
 */
(function(Q) {// location位置+效果
	var win = Q.global, doc = win.document, isNull = Q.isNull, isDom = Q.isDom;
	// 计算元素的X(水平，左)位置
	function pageX(elem) {
		return elem.offsetParent ? elem.offsetLeft + pageX(elem.offsetParent) : elem.offsetLeft
	}
	// 计算元素的Y(垂直，顶)位置
	function pageY(elem) {
		return elem.offsetParent ? elem.offsetTop + pageY(elem.offsetParent) : elem.offsetTop
	}
	// 查找元素在其父元素中的水平位置
	function parentX(elem) {
		return elem.parentNode == elem.offsetParent ? elem.offsetLeft : pageX(elem) - pageX(elem.parentNode)
	}
	// 查找元素在其父元素中的垂直位置
	function parentY(elem) {
		return elem.parentNode == elem.offsetParent ? elem.offsetTop : pageY(elem) - pageY(elem.parentNode)
	}
	Q.fn.extend({
		width : function() {
			var dom = this[0];
			return isDom(dom) ? dom.offsetWidth : screen.availWidth
		},
		height : function() {
			var dom = this[0];
			return isDom(dom) ? dom.offsetHeight : screen.availHeight
		},
		offset : function() {// 获取匹配元素在当前视口的相对偏移
			if (!this[0]) return null;
			var obj = this[0].getBoundingClientRect();
			return {
				left : obj.left + win.pageXOffset,
				top : obj.top + win.pageYOffset
			};
		},
		position : function() {// 获取匹配元素相对父元素的偏移。
			var o = this[0];
			if (!o) return null;
			return {
				left : parentX(o),
				top : parentY(o)
			}
		},
		//要废弃的方法,不建议使用
		animate : function(styles, speed, easing, callback) {
			var me = this, mul = 20, speed = speed || 500, stardStyle = {}, source, target;
			var toDouble = parseFloat;
			Q.each(styles, function(key, val) {
				stardStyle[key] = Math.abs(toDouble(val) - toDouble(me.css(key) || 0))
			});
			function Animate() {
				var me1 = this;
				me1.thread = Q.cycle(function() {
					var mstyle = {}, isDelay = !1;
					Q.each(styles, function(key, val) {
						val = toDouble(val);
						target = val;
						source = toDouble(me.css(key) || 0);
						if (target >= source) {
							mstyle[key] = (source + stardStyle[key] / mul) + "px";
							isDelay = source >= val - 1 ? !1 : !0
						} else {
							mstyle[key] = (source - stardStyle[key] / mul) + "px";
							isDelay = source <= val + 1 ? !1 : !0
						}
					});
					me.css(mstyle);
					!isDelay && me1.stop()
				}, speed / mul)
			}
			Animate.prototype.stop = function() {
				this.thread.stop();
				me.css(styles);
				callback && callback()
			}
			return new Animate()
		}
	});
})(Qmik);
