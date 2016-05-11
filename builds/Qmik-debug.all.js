/**
 * @author:leo
 * @email:cwq0312@163.com
 * @version:1.2.33
 */
(function() {
	var win = this,
		doc = win.document || {},
		nav = win.navigator || {}, //
		con = win.console,
		UA = nav.appVersion || nav.userAgent,
		loc = win.location;
	var encode = encodeURIComponent,
		decode = decodeURIComponent,
		slice = [].slice, //
		//baseURL = loc.protocol + "//" + loc.host, //
		config = {
			base: "" //工程上下文目录
		};
	//var readyRE = /complete|loaded|interactive/i;
	// define qmik object
	function Q(selector, context) {
		return Q.init(selector, context)
	}
	Q.extend = function() {
		var args = arguments,
			ret = args[0] || {},
			i = 1;
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
	var strtype = String.prototype;
	Q.extend(strtype, {
		trim: function() {
			return this.replace(/^(\s|\u00A0)+|(\s|\u00A0)+$/g, "")
		},
		toLower: strtype.toLowerCase,
		toUpper: strtype.toUpperCase
	});
	/*Array.prototype.each = function(callback){
		callback && each(this, callback);
	};*/
	function grep(array, callback) {
		var ret = [];
		each(array, function(i, v) {
			(callback ? callback(i, v) : !isNull(v)) && ret.push(v)
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
			//return v == "[object Arguments]" || v == "[object NodeList]" || v == "[object HTMLCollection]" || v == "[object StaticNodeList]" || v == "[object NamedNodeMap]"
                return v == "[object Arguments]" || /^\[object \w*((List)|(Collection)|(Map))\]$/.test(v)
		})())
	}
	// isFunction
	function isFun(v) {
		return typeof(v) == 'function';
	}

	function isError(v) {
		return v instanceof Error
	}

	function isObject(v) {
		//return v instanceof Object
        return v+"" == "[object Object]"
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
		return obj;
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
		var args = arguments,
			array = args[0],
			isA = isArray(array);
		for(var i=1;i<args.length;i++){
			each(args[i], function(k, v){
				isA ? array.push(v) : array[k] = v
			})
		}
		return array
	}

	/*	function isGrandfather(grandfather, child) {
			return isDom(child) && (grandfather === child.parentNode ? !0 : isGrandfather(grandfather, child.parentNode))
		}*/

	function loadResource(type, url, success, error) {
		url = Q.url(url);
		var isCss = type == "css",
			isScript = type == "js", //
			tagName = isCss ? "link" : isScript ? "script" : "iframe",
			node = doc.createElement(tagName),
			qnode = Q(node).attr({
				_src: url,
				async: "async"
			});
		isCss ? qnode.attr("rel", "stylesheet") : isScript && qnode.attr("type", "text/javascript");
		/*node.ready(function(e) {
			success && success(node)
		}).on("error", function(e) {
			node.remove();
			error && error(node)
		});*/
		qnode.on({
			load: function() {
				success && success(node)
			},
			error: function() {
				qnode.remove();
				error && error(node)
			}
		});
		if (isCss) node.href = url;
		else node.src = url;
		Q("head").append(node);
		return node
	}
	/**
		字符串变量${name}替换
	*/
	/*function replaceVar(str, data){
		data = data || {};
		return isNull(str) ? null : (str+"").replace(/(\$[!]?\{[\.\w_ -]*\})|(\{\{[\.\w_ -]*\}\})/g, function(name) {
			var keys = name.replace(/(^\$?[!]?\{\{?)|(\}\}?$)/g, "").trim();
			keys = keys.split(".");
			var val = data[keys[0]];
			for (var i = 1; i < keys.length; i++) {
				try {
					val = val[keys[i]]
				} catch (e) {
					Q.log(e, str);
					return ""
				}
			}
			return val || "";
		})
	}*/
	function _delete(object, name){
		try{delete object[name]}catch(e){object[name]=null}
	}
	function log(type, args){
		var vs = slice.call(args);
		if(con){
			con[type].apply ? con[type].apply(con, vs) : con[type](type+":", vs);
		}			
	}
	//////////Delay class, function 实现setTimeout的功能
	function Delay(fun, time, params) {
		var me = this;
		me.pid = setTimeout(function() {
			fun.apply(fun, params)
		}, time)
	}
	Q.extend(Delay.prototype, {
		stop: function() {
			clearTimeout(this.pid)
		}
	});
	///////////////
	///////////////////Cycle class
	function Cycle(fun, cycleTime, ttl, params) {
		var me = this,
			chisu = 1;

		function _exec() {
			if ((isNull(ttl) || (chisu * cycleTime) < ttl)) {
				fun.apply(fun, params);
				me._p = new Delay(_exec, cycleTime, params);
			}
			chisu++;
		}
		me._p = new Delay(_exec, cycleTime, params);
	}
	Q.extend(Cycle.prototype, {
		stop: function() {
			this._p && this._p.stop()
		}
	});
	//////////////////////
	
	Q.extend({
		encode: encode,
		decode: decode,
		isDom: isDom,
		isBool: isBool,
		isString: isString,
		isFun: isFun,
		isFunction: isFun,
		isNum: isNum,
		isNumber: isNum,
		isArray: isArray,
		isNull: isNull,
		isError: isError,
		each: each,
		stringify: toString,
		parseJSON: toJSON,
		isEvent: isEvent,
		likeArray: likeArray,
		isDate: function(v) {
			return v instanceof Date
		},
		isObject: isObject,
		isPlainObject: function(v) { // isPlainObject
			if (isNull(v) || v + '' != '[object Object]' || v.nodeType || v == win) return !1;
			var k;
			for (k in v) {}
			return isNull(k) || Object.prototype.hasOwnProperty.call(v, k)
		},
		likeNull: likeNull,
		/**
		 * 继承类 子类subClass继承父类superClass的属性方法, 注:子类有父类的属性及方法时,不会被父类替换
		 */
		inherit: function(subClass, superClass) {
			function F() {}
			var subPrototype = subClass.prototype;
			F.prototype = superClass.prototype;
			subClass.prototype = new F();
			subClass.prototype.constructor = subClass;
			if (superClass.prototype.constructor == Object.prototype.constructor) {
				superClass.prototype.constructor = superClass;
			}
			for (var name in subPrototype) {
				subClass.prototype[name] = subPrototype[name];
			}
			for (var name in superClass) {
				subClass[name] = superClass[name];
			}
		},
		trim: function(v) {
			return isNull(v) ? "" : isString(v) ? v.trim() : v.toString().trim()
		},
		toLower: function(v) {
			return v ? v.toLower() : v
		},
		toUpper: function(v) {
			return v ? v.toUpper() : v
		},
		// 合并数组或对象
		merge: merge,
		inArray: function(value, array) {
			if (Q.likeArray(array))
				for (var i = 0; i < array.length; i++)
					if (array[i] === value) return i;
			return -1
		},
		unique: function(array) {
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
		map: function(array, callback) {
			var r = [],
				i = 0;
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
		getScript: function(url, success, error) {
			return loadResource("js", url, success, error)
		},
		/**
		 * 取得css
		 */
		getCss: function(url, success, error) {
			return loadResource("css", url, success, error)
		},
		grep: grep,
		/**
		 * 抽取数组里面每个元素的name和value属性,转换成一个url形式(a=b&name=g)的字符串
		 */
		param: function(array) {
			var h = [];
			each(array, function(i, v) {
				isString(i) ? h.push(encode(i) + '=' + encode(execObject(v))) : v.name && h.push(encode(v.name) + '=' + encode(execObject(v.value)))
			});
			return h.join('&')
		},
		/** 是否是父或祖父节点 */
		contains: function(parent, child){
			return isDom(child) &&( parent == doc || (parent.contains(child)) )
			/*function contains(grandfather, child) {
				//return isDom(child) && (grandfather === child.parentNode ? !0 : contains(grandfather, child.parentNode))
				return isDom(child) &&( grandfather===doc || (grandfather.contains(child)))
			}*/
		},
		/**
		 * 当前时间
		 */
		now: function(d) {
			return (d || 0) + new Date().getTime()
		},
		// 延迟执行,==setTimeout
		/**
		 * target:apply,call的指向对象
		 */
		delay: function(fun, time) {
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
		cycle: function(fun, cycleTime, ttl) {
			//var params = slice.call(arguments, 3);
			return new Cycle(fun, cycleTime, ttl, slice.call(arguments, 3));
		},
		log: function() {
			//con.log("log:", arguments)
			log("log", arguments);
		},
		warn: function(){
			//con.warn("warn:", arguments)
			log("warn", arguments);
		},
		error: function(){
			//con.error("error:", arguments)
			log("error", arguments);
		},
		isIphone: function() {
			return /iPhone OS/.test(UA)
		},
		isAndroid: function() {
			return /Android/.test(UA)
		},
		isWP: function() {
			return /Windows Phone/.test(UA)
		},
		isIE: function() {
			return /MSIE/.test(UA) || /Trident/.test(UA)
		},
		/**
		 * is Firefox
		 */
		isFF: function() {
			return /Firefox/.test(UA)
		},
		/**
		 * is Webkit
		 */
		isWK: function() {
			return /WebKit/.test(UA)
		},
		isOpera: function() {
			return /Opera/.test(UA)
		},
		isRetinal: function() { //判断是否是视网膜高清屏,默认是高清屏
			return (win.devicePixelRatio || 2) >= 1.5;
		},
		config: function(opts, _config) {
			_config = arguments.length <= 1 ? config : (_config || {});
			var ret = _config;
			if (arguments.length < 1 || isNull(opts)) {} else if (!isObject(opts)) {
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
		 * 取当前url,if 参数 _url为空,则
		 */
		url: function(_url) {
			_url = Q.trim(_url);
            return _url ? _url : loc.pathname;
		},
		cssPrefix: function(style) {
			var ret = {};
			if (isString(style)) {
				ret = (Q.isWK() ? "-webkit-" : Q.isIE() ? "-ms-" : Q.isFF() ? "-moz-" : Q.isOpera() ? "-o-" : "") + style;
			} else {
				each(Q.extend({}, style), function(key, val) {
					ret[Q.cssPrefix(key)] = val;
					ret[key] = val;
				})
			}
			return ret
		},
        /**
         * 执行方法并捕获异常,不向外抛出异常
         * @param fun 执行方法
         * @param args 数组,参数[]
         * @param error 抛出异常回调,无异常不回调
         * @returns {*}
         */
		execCatch: function (fun, args, error) {
			try {
				return isFun(fun) && fun.apply(fun, args||[]);
			} catch (e) {
				console.error(e.stack||e, '\r\n', fun, args );
				return error && error(e);
			} 
		}
	});
	each([
		Q.url, Q.now
	], function(i, val) {
		val.toString = val
	});
	//不对外部开放,不保持此对象api不变动,
	Q._in = {
		createEvent: function(type) {
			return doc.createEvent ? doc.createEvent(type) : doc.createEventObject(type)
		},
		isSE: function() {
			return !isNull(doc.addEventListener)
		},
		_delete: _delete
	};
	//////////////////////////////////////////////////////
	Q.version = "2.3.00";
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
	var win = Q.global,
		doc = win.document,
		_in = Q._in;
	var SE = _in.isSE,
		isNull = Q.isNull,
		isDom = Q.isDom,
		each = Q.each, //
		likeArray = Q.likeArray,
		isArray = Q.isArray,
		likeNull = Q.likeNull, //
		isString = Q.isString,
		isFun = Q.isFun,
		isPlainObject = Q.isPlainObject,
		trim = Q.trim, //
		toLower = Q.toLower,
		toUpper = Q.toUpper,
		replace = function(value, str1, str2) {
			return value.replace(str1, str2)
		};
	/* 节点查询编译 */
	var rNode = /^\s*(<.+>.*<\/.+>)+|(<.+\/\s*>)+\s*$/,
		addUints = "height width top right bottom left".split(" ");
	/** Qmik查询 */
	function Query(selector, context) {
		var me = this,
			r;
		me.context = context = context || doc;
		//me.selector = selector = render(selector, context);
		me.selector = selector;
		me.length = 0;
		me.__lives = {};
		if (isString(selector)) {
			if (rNode.test(selector.replace(/\n+/g, ""))) {
				var t = doc.createElement('div');
				t.innerHTML = selector;
				r = t.children;
                compileScript(t);
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
		for (var i = 0; i < r.length; i++) {
			me._push(r[i])
		}
		return me
	}
	Q.extend(Query.prototype, {
		_push: function(v) {
			v && (this[this.length++] = v)
		}
	});
	// Q.inherit(Query, Array);
	function init(selector, context) {
		context = context || doc;
		if (isFun(selector)) {
			return Q(doc).ready(selector)
		}
		return isQmik(selector) ? selector : new Query(selector, context)
	}

	function isQmik(v) {
			return v instanceof Query
		}
		//查找元素节点
	function find(selector, context) {
		var result = [];
		if (!likeNull(selector)) {
			context = isString(context) ? Q(context) : context;
			if (isQmik(context)) {
				each(context, function(i, v) {
					isDom(v) && (result = arrayConcat(result, v.querySelectorAll(selector)))
				});
			} else {
				result = context.querySelectorAll(selector) || []
			}
		}
		return result
	}

	function muchValue2Qmik(c) {
		c = execObject(c);
		return isString(c) && rNode.test(c.replace(/\n+/g, "")) ? Q(c) : c
	}

	function execObject(v) {
		//return isFun(v) ? v() : render(v)
		return isFun(v) ? v() : v
	}

	/*function render(val, context) {
		return (Q.isPlainObject(val) && (isString(val.tag) || isString(val.text))) ? Q.render(val, context || {}) : val
	}*/
		// As much as possible to Array
	function arrayConcat(sarray, tarray) {
		if (isArray(tarray)) {
			sarray = sarray.concat(tarray)
		} else {
			for (var i = 0; i < tarray.length; i++) {
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
		var cs = dom.className.split(" "),
			i = 0;
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

	function createTextNode(val) {
		return doc.createTextNode(val)
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
			}) : o.appendChild(isDom(child) ? child : createTextNode(child))
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
			}) : o.parentNode.insertBefore(isDom(child) ? child : createTextNode(child), o)
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
		for (var i in addUints) {
			if (name.indexOf(addUints[i]) >= 0) {
				if (!/[^\d\.-]/.test(value)) {
					value += "px"
				}
				break
			}
		}
		return value
	}

	function getStyle(dom, name) {
		return dom.currentStyle ? dom.currentStyle[name] : doc.defaultView.getComputedStyle(dom, false)[name]
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
			if (isString(k)) return getStyle(o, formateClassName(k));
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
					(isSetValue || !SE()) ? target[name] = val: target.setAttribute(name, val);
				}
			}
		}
	}

	function clone(o, isDeep) {
		if (isDom(o)) {
			return Q(o.cloneNode(isDeep == !0))
		}
		var r = [];
		each(o, function(k, v) {
			isDom(v) && r.push(clone(v, isDeep))
		})
		return Q(r)
	}
	var dn = "Qmikdata:";

	function data(o, k, v) {
		if (likeArray(o)) {
			if (isString(k) && isNull(v)) return data(o[0], k, v);
			each(o, function(i, j) {
				data(j, k, v)
			});
			return o;
		} else if (!isNull(o)) {
			if (isNull(o[dn])) o[dn] = {};
			if (isNull(v) && isString(k)) return o[dn][k];
			isString(k) ? o[dn][k] = v : each(k, function(i, j) {
				o[dn][i] = j
			})
		}
	}

	function GN(dom, type) {
		if (dom) {
			dom = type == "prev" ? dom.previousSibling : dom.nextSibling;
			return isDom(dom) ? dom : GN(dom, type)
		}
	}

	function uponSelector(dom, selector, type, ret) {
		var list = Q(dom.parentNode).children(selector),
			i, zdom;
		if (type == "prev") {
			for (i = list.length - 1; i >= 0; i--) {
				for (zdom = dom;
					(zdom = GN(zdom, type)) && zdom == list[i];) {
					ret.push(zdom);
					break
				}
			}
		} else {
			for (i = 0; i < list.length; i++) {
				for (zdom = dom;
					(zdom = GN(zdom, type)) && zdom == list[i];) {
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
			if (dom) {
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
		selector = selector ? trim(selector) : selector;
		var array = [],
			isPush = 0;
		isAllP = isAllP != !1;
		isOnlyParent = isOnlyParent == !0;
		var isSelector = !isNull(selector);
		each(qmik, function(i, dom) {
			var p = dom.parentNode,
				tp;
			while (isDom(p)) {
				isPush = 0;
				if (isSelector) {
					tp = p.parentNode;
					if (tp && Q.inArray(p, Q(tp).children(selector)) > -1) {
						isPush = 1
					}
				} else {
					isPush = 1
				}
				if (isPush) {
					array.push(p);
					if (!isAllP) break
				}
				if (isOnlyParent) break;
				p && (p = p.parentNode)
			}
		});
		return Q(array)
	}

    function compileScript(context){
        Q("script", context).each(function(i, dom) {
            Q.execCatch(function(){eval(dom.text||"")});
        });
    }

	/* */
	//高度
	function getHeight() {
		return win.innerHeight || screen.availHeight;
	}
    function getMaxX() {
        return win.pageXOffset + win.innerWidth + 120;
    }
	function getMaxY() {
		return win.pageYOffset + getHeight() + 120;
	}	
	/**/

	Q.init = init;
	var fn = Q.fn = Query.prototype;
	fn.extend = function(o) {
		each(o, function(k, v) {
			Query.prototype[k] = v
		})
	}
	fn.extend({
		last: function() {
			return Q(this[this.length - 1])
		},
		eq: function(i) {
			return Q(this[i])
		},
		first: function() {
			return Q(this[0])
		},
		filter: function(f) {
			var r = new Query();
			each(this, function(i, v) {
				if (f(i, v)) r._push(v)
			});
			return r
		},
		even: function() {
			return this.filter(function(i, v) {
				return i % 2 == 0
			})
		},
		odd: function() {
			return this.filter(function(i, v) {
				return i % 2 != 0
			})
		},
		gt: function(i) { // 大于
			var r = new Query(),
				j = i + 1;
			for (; j < this.length && j >= 0; j++) {
				r._push(this[j])
			}
			return r
		},
		lt: function(i) { // 小于
			var r = new Query(),
				j = 0;
			for (; j < i && j < this.length; j++) {
				r._push(this[j])
			}
			return r
		},
		find: function(s) {
			return new Query(s, this)
		},
		each: function(f) {
			each(this, f);
			return this
		},
		append: function(c) {
			append(this, c);
			return this
		},
		appendTo: function(c) {
			Q(c).append(this);
			return this;
		},
		remove: function() {
			each(this, function(i, v) {
				isDom(v.parentNode) && v.parentNode.removeChild(v)
			});
			return this
		},
		before: function(c) {
			before(this, c);
			return this
		},
		after: function(c) {
			after(this, c);
			return this
		},
		beforeTo: function(c) {
			before(c, this);
			return this
		},
		afterTo: function(c) {
			after(c, this);
			return this
		},
		html: function(v) {
			var me = this;
			if (arguments.length < 1) return attr(me, "innerHTML");
			else {
				attr(me, "innerHTML", isQmik(v) ? v.html() : v, !0);
                compileScript(me);
			}
			return this
		},
		empty: function() {
			return this.html("")
		},
		text: function(v) {
			var r = attr(this, "innerText", isQmik(v) ? v.text() : v, !0);
			return isNull(v) ? r : this
		},
		addClass: function(n) {
			each(this, function(i, v) {
				if (isDom(v) && !hasClass(v, n)) v.className += ' ' + trim(execObject(n))
			});
			return this
		},
		rmClass: function(n) {
			var r = new RegExp(replace(execObject(n), /\s+/g, "|"), 'g');
			each(this, function(i, v) {
				v.className = replace(trim(replace(v.className, r, '')), /[\s]+/g, ' ')
			});
			return this
		},
		show: function() {
			css(this, 'display', 'block');
			return this
		},
		hide: function() {
			css(this, 'display', 'none');
			return this
		},
		inViewport: function(){
			var qdom = this,
				offset = qdom.offset(),
				bool = false;
			if (offset) {
				var elTop = offset.top,
                    elLeft = offset.left,
					elDown = elTop + qdom.height(),
                    elRight = elLeft + qdom.width(),
                    minX = win.pageXOffset,
                    maxX = getMaxX(),
					minY = win.pageYOffset,
					maxY = getMaxY();
                minY = minY < 0 ? 0 : minY;
				//return elTop >= 0 && elTop >= min && elTop <= max;
				bool = elTop <= maxY && elDown >= minY;
                bool = bool && elLeft <= maxX && elRight >= minX
			}
			return bool;
		},
        /**
         *
         * @param style
         * @param time
         * @param easing  可以的值,默认 ease-in-out
                     linear	规定以相同速度开始至结束的过渡效果（等于 cubic-bezier(0,0,1,1)）。
                     ease	规定慢速开始，然后变快，然后慢速结束的过渡效果（cubic-bezier(0.25,0.1,0.25,1)）。
                     ease-in	规定以慢速开始的过渡效果（等于 cubic-bezier(0.42,0,1,1)）。
                     ease-out	规定以慢速结束的过渡效果（等于 cubic-bezier(0,0,0.58,1)）。
                     ease-in-out	规定以慢速开始和结束的过渡效果（等于 cubic-bezier(0.42,0,0.58,1)）。
                     cubic-bezier(n,n,n,n)	在 cubic-bezier 函数中定义自己的值。可能的值是 0 至 1 之间的数值。

         * @param callback
         * @returns {*}
         */
		animate: function(style, time, easing, callback){
			var me = this;
            if(isFun(easing)){
                callback = easing;
                easing = " ";
            }
			var initStyle = {transition: 0}, startStype = Q.extend({}, initStyle);
			each(style, function(key, val){
				startStype[key] = parseFloat(css(me, key))||0;
			});
			css(me, startStype);
			Q.delay(function(){
                var isNotEnd = true;
				style.transition = (easing||" ease-in-out ") +" " + (time || 1) + "ms";
				css(me, Q.cssPrefix(style));
				function transitionEnd(e) {
                    if(isNotEnd){
                        css(me, initStyle);
                        callback && callback(e);
                        isNotEnd = false;
                    }
				}
				me.once({
					webkitTransitionEnd: transitionEnd,
					msTransitionEnd: transitionEnd,
					oTransitionEnd: transitionEnd,
					transitionend: transitionEnd
				});
			}, 10);
			return me;
		},
		toggle: function() {
			each(this, function(i, v) {
				css(v, 'display') == 'none' ? Q(v).show() : Q(v).hide()
			});
			return this
		},
		map: function(callback) {
			return Q.map(this, callback)
		},
		css: function(k, v) {
			var r = css(this, k, v);
			return isPlainObject(k) || (isString(k) && !isNull(v)) ? this : r
		},
		attr: function(k, v) {
			var r = attr(this, k, v);
			return (arguments.length > 1 || isPlainObject(k)) ? this : r
		},
		rmAttr: function(k) {
			each(this, function(i, v) {
				isDom(v) && v.removeAttribute(k)
			});
            return this;
		},
		data: function(k, v) {
			return data(this, k, v)
		},
		rmData: function(k) {
			each(this, function(i, v) {
				if (v.$Qmikdata) delete v.$Qmikdata[k]
			});
            return this;
		},
		val: function(v) {
			var me = this;
			if (isNull(v)) return me.attr("value") || "";
			each(me, function(i, u) {
				u.value = execObject(v)
			});
			me.emit("change");
			return me
		},
		next: function(s) {
			return upon(this, s, "next")
		},
		prev: function(s) {
			return upon(this, s, "prev")
		},
		clone: function(t) {
			return clone(this, t)
		},
		/*hover : function(fin, fout) {
			this.bind("mouseover", fin).bind("mouseout", fout).bind("touchstart", function() {
				fin();
				Q.delay(fout, 500)
			})
		},*/
		hasClass: function(c) {
			return hasClass(this[0], c)
		},
		closest: function(selector) { // 查找最近的匹配的父(祖父)节点
			var me = this,
				q = new Query();
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
		parents: function(selector) { // 查找所有的匹配的父(祖父)节点
			return parents(selector, this, !0)
		},
		parent: function(selector) { // 查找匹配的父节点
			return parents(selector, this, !0, !0)
		},
		children: function(selector) { //查找直接子节点
			var r = new Query();
			var me = this;
			var isNullSelector = isNull(selector);
			me.each(function(i, dom) {
				//var childs = dom.childNodes;
				var childs = dom.children || dom.childNodes,
					j = 0,
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
		removeClass: fn.rmClass,
		removeData: fn.rmData,
		removeAttr: fn.rmAttr
	});
	Q.isQmik = isQmik;
})(Qmik);
/**
 * @author:leo
 * @email:cwq0312@163.com
 * @version:1.00.000
 */
(function(Q) { /* event */
	var win = Q.global,
		doc = win.document,
		fn = Q.fn,
		_in = Q._in;
	var SE = _in.isSE,
		readyRE = /complete|loaded|interactive|loading/i, // /complete|loaded|interactive/
		ek = "QEvents",
		liveFuns = {};
	var isNull = Q.isNull,
		isFun = Q.isFun,
		each = Q.each,
		isPlainObject = Q.isPlainObject,
		_delete = _in._delete;
	/** 设置节点的加载成功方法 */
	function setLoad(node, fun) {
		node.onreadystatechange = node.onload = node.onDOMContentLoaded = fun
	}

	Q.ready = fn.ready = function(fun, context) {
		var node = context || this[0] || doc,
			state;

		function ready(e) {
			state = node.readyState;
			if (state != "loading" && !isNull(node.$$handls) && (readyRE.test(state) || (isNull(state) && "load" == e.type))) {
				setLoad(node, null);
				each(node.$$handls, function(i, val) {
					//val(Q);
                    Q.delay(function() {
                        val.call(node, Q)
                    }, 5);
				});
				_delete(node, "$$handls");
				//delete node.$$handls
			}
		}
		if (readyRE.test(node.readyState)) {
			Q.delay(function() {
				fun.call(node, Q)
			}, 10);
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
		var t = Q(dom),
			d = t.data(ek) || {},
			h = d[name];
		t.data(ek, d);
		if (!h) {
			d[name] = h = [];
			//isFun(dom['on' + name]) ? (h[0] = dom['on' + name]) : SE() ? dom.addEventListener(name, handle, !1) : dom["on" + name] = handle
			if (isFun(dom['on' + name])) {
				h.push({
					fun: dom['on' + name],
					param: []
				});
				_delete(dom, 'on'+name)
				//delete dom['on' + name];
			}
			SE() ? dom.addEventListener(name, handle, !1) : dom["on" + name] = handle
		}
		isFun(fun) && h.push({
			fun: fun,
			param: paramArray || []
		})
	}

	function Erm(dom, name, fun) {
		var s = Q(dom).data(ek) || {},
			h = s[name] || [],
			i = h.length - 1;
		if (fun) {
			for (; i >= 0; i--)
				h[i].fun == fun && h.splice(i, 1)
		} else {
			//SE() ? dom.removeEventListener(name, handle, !1) : delete dom["on" + name];
			//delete s[name]
			SE() ? dom.removeEventListener(name, handle, !1) : _delete(dom, "on" + name);
			_delete(s, name)
		}
	}

	function Etrig(dom, name) {
		var e;
		if (SE()) {
			e = _in.createEvent("MouseEvents");
			e.initEvent(name, !0, !0);
			dom.dispatchEvent(e)
		} else dom.fireEvent('on' + name)
	}

	function handle(_event) {
		_event = fixEvent(_event || win.event);
		var retVal, m = this,
			fun, param, events = Q(m).data(ek) || {};
		each(events[_event.type], function(i, v) {
			Q.execCatch(function() {
                fun = v.fun;
                param = v.param || [];
                if (isFun(fun)) {
                    retVal = fun.apply(m, [
                        _event
                    ].concat(param));
                    //if (!isNull(retVal)) e.returnValue = retVal
                    //兼容ie处理
                    if (!isNull(retVal)) {
                        _event.returnValue = retVal;
                        if (win.event) win.event.returnValue = retVal;
                    }
                }
			});
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

	function getLiveName(type, callback) {
		return type  + (callback || "").toString()
	}

	function mapEvent(name, fun, dealFun) {
		var ents = {};
		if(isPlainObject(name))
			ents = name;
		else
			ents[name] = fun;
		dealFun && each(ents, dealFun);
		return ents;
	}
	/** 是否是父或祖父节点 */
	/*function contains(grandfather, child) {
		return Q.isDom(child) && (grandfather === child || grandfather === child.parentNode ? !0 : contains(grandfather, child.parentNode))
	}*/
	fn.extend({
		on: function(name, callback) {
			each(this, function(k, v) {
				mapEvent(name, callback, function(key, fun){
					Eadd(v, key, fun)
				})
			});
			return this
		},
		off: function(name, callback) {
			each(this, function(k, v) {
				Erm(v, name, callback)
			});
			return this
		},
		once: function(name, callback) { // 只执行一次触发事件,执行后删除
			var me = this, ents={};
			mapEvent(name, callback, function(key, fun){
				ents[key] = function(e){
					me.off(key, ents[key]);
					fun(e);
				}
			});
			return me.on(ents);
		},
		emit: function(name) {//手动触发事件
			each(this, function(k, v) {
				Etrig(v, name)
			});
			return this
		},
		live: function(name, callback) {
			var me = this;
			mapEvent(name, callback, function(key, callback) {
				var fun = me.__lives[getLiveName(key, callback)] = function(e) {
					var target = e.target,
						qtar = Q(target),
						sel = Q.isString(me.selector) ? Q(me.selector, me.context) : me;
					each(sel, function(i, dom) {
                        Q.contains(dom, target) && callback.call(target, e)
					});
				}
				Q("body").on(key, fun)
			});
			return me
		},
		die: function(name, callback) {
			var me = this,
				fun = me.__lives[getLiveName(name, callback)];
			(arguments.length < 2 || fun) && Erm(doc.body, name, fun);
			return me
		}
	});
	fn.extend({
		bind: fn.on,
		unbind: fn.off,
		trigger: fn.emit
	});
	/**
	 * event orientationchange:重力感应,0：与页面首次加载时的方向一致 -90：相对原始方向顺时针转了90° 180：转了180°
	 * 90：逆时针转了 Android2.1尚未支持重力感应 click blur focus scroll resize
	 */
	each("click blur focus scroll resize".split(" "), function(i, value) {
		fn[value] = function(f) {
            var me = this, dom;
            if(f){
                me.on(value, f)
            }else{
                if(["focus", "blur"].indexOf(value)>=0){
                    dom = me.last()[0];
                    dom && isFun(dom[value]) && dom[value]();
                }
                me.emit(value);
            }
			//return f ? this.on(v, f) : this.emit(v)
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

/**
	任务执行模块,

	串行执行任务列队,如果有输出参数,则前一个任务输出参数给下一个任务
	$.series([
		function(callback){//callback:function(err, value){}
			var m = {};
			callback(null, m);
		},
		function(callback, val){
			callback(null, {name:"leo"});
		},
		function(callback, val){
			callback(null, {name:"leo"});
		}
	],function(err, exports){
		//全部执行完,回调
	});

	并行执行任务列队,当中有任务执行出错,不影响其它任务的执行
	$.parallel([
		function(callback){//callback: function(){}
			callback();
		},
		function(callback){
			callback();
		}
	],function(){
		//全部执行完,回调
	});
*/
;
(function(Q) {
	var execCatch = Q.execCatch;
	//串行执行任务列队,报错不继续执行,各任务间有依赖关系
	function execSeriesTasksWithParam(tasks, callback) {
		var length = tasks.length;
		length == 0 ? callback() : (function bload(idx, param) {
			execTask(tasks[idx], function(err, exports) {
				if (err) {
					callback(err);
				} else {
					idx == length - 1 ? callback(err, exports) : bload(idx + 1, exports)
				}
			}, param);
		})(0, null);
	}
	//串行执行任务列队,报错继续执行,各任务之间没有依赖关系
	function execSeriesTasksWithParallel(tasks, callback) {
		var length = tasks.length;
		length == 0 ? callback() : (function bload(idx) {
			execTaskNoArgs(tasks[idx], function() {
				idx == length - 1 ? callback() : bload(idx + 1);
			})
		})(0);
	}
	var dealTasks = 3; //多少个处理核心在处理同时任务
	//并行执行任务列队
	function execParallelTasks(tasks, callback) {
		var length = tasks.length,
			params = new Array(length);
		var pageSize = parseInt((length - 1) / dealTasks) + 1; //每组要处理的长度
		var groups = new Array(dealTasks < length ? dealTasks : length); //几组

		/*for (i = 0; i < groups.length; i++) {
			groups[i] = tasks.slice(i * pageSize, (i + 1) * pageSize);
		}
		for (i = 0; i < groups.length; i++) {
			(function(idx, group) {
				execSeriesTasksWithParallel(group, function() {
					dealGroup++;
					if (dealGroup == groups.length) { //处理完毕
						callback();
					}
				});
			})(i, groups[i]);
		}*/
		Q.each(groups, function(i) {
			groups[i] = tasks.slice(i * pageSize, (i + 1) * pageSize);;
		});
		var dealGroup = 0;
		Q.each(groups, function(i, group) {
			execSeriesTasksWithParallel(group, function() {
				dealGroup++;
				dealGroup == groups.length && callback();
			});
		});
	}


	function execTask(task, callback, param) {
		execCatch(task, [callback, param], callback);
	}

	function execTaskNoArgs(task, callback) {
		execCatch(task, [callback], callback);
	}
	//function Task() {};
	var Task = {};

	//串行执行任务列队,如果有输出参数,则前一个任务输出参数给下一个任务
	/*
		Task.series([
			function(callback){//callback:function(err, value){}
				var m = {};
				callback(null, m);
			},
			function(callback, val){
				callback(null, {name:"leo"});
			},
			function(callback, val){
				callback(null, {name:"leo"});
			}
		],function(err, exports){

		});
	*/
	Task.series = function(tasks, callback) {
		execSeriesTasksWithParam(tasks, function(err, exports) {
			err && Q.log(err, err.stack);
            execCatch(callback, [err, exports]);
		});
	};

	//并行执行任务列队
	//task:[function(callback(fun){}){}; callback:function(){};
	/*
		Task.parallel([
			function(callback){//callback: function(){}
				callback();
			},
			function(callback){
				callback();
			}
		],function(){

		});
	*/
	Task.parallel = function(tasks, callback) {
		execParallelTasks(tasks, function() {
			execCatch(callback);
		});
	};
	Q.task = Task;
	Q.series = Task.series;
	Q.parallel = Task.parallel;
})(Qmik); //
/**
 * @author:leo
 * @email:cwq0312@163.com
 * @version:1.00.000
 */
;
(function(Q) {
	var isFun = Q.isFun,
		win = Q.global,
		NULL = null;
	var config = {
		alias: {}, //别名系统
		vars: {}, //路径变量系统
		preload: [] //预加载
	};
	var cacheModule = {}, //模块池
		currentScript, //当前脚本
		ispreload = !1; //是否加载过预加载
	var sun = {};

	function Module(url, dependencies, factory) {
		Q.extend(this, {
			id: url,
			url: url,
			dependencies: dependencies, // 依赖模块
			factory: factory,
			// module is ready ,if no, request src from service
			state: 3, // is ready ,default false, 1=ok,2=准备中,3=寻找模块
			type: Q.inArray(url, config.preload) >= 0 ? 2 : 1, //2:预加载的类型,1:普通类型
			exports: {}
		})
	}
	/** 清除注释 */
	function clearNode(word) {
		/*return word.replace(/(\/\/[^\n]*)|(\/\*[^\n]*\*\/)|(["'][^"'\n]*["'])/g, function(val){
			return /[\(\)]/.test(val) ? "" : val;
		}).replace(/(\/\*.*\*\/)|(\/\*[\S\s]*\*\/)/g, "")*/
		var list = [];
		Q.each(word.replace(/(\/\/[^\n]*)|(\/\*[^\n]*\*\/)|(["'][^"'\n]*["'])/g, function(val) {
			return /[\(\)\*]/.test(val) ? "" : val; //.replace(/\*/g,"");
		}).replace(/\/\*.*\*\//g, "").split(/\*\//), function(i, val) {
			list.push(val.replace(/\/\*[\s\S]+/, ""))
		});
		return list.join("");

	}
	// get depends from function.toString()
	function parseDepents(code) {
		code = clearNode(code.toString());
		var params = code.replace(/^\s*function\s*\w*\s*/, "").match(/^\([\w ,]*\)/)[0].replace("\(", "").replace("\)", "");
		var match = [],
			idx = params.indexOf(",");
		var require = params.substring(0, idx>0 ? idx : params.length),
			pattern = new RegExp(require + "\s*[(]\s*[\"']([^\"'\)]+)[\"']\s*[)]", "g");
		if(require)
			match = Q.map(code.match(pattern), function(i, v) {
				return v.replace(new RegExp("^" + require + "\s*[(]\s*[\"']"), "").replace(/\s*[\"']\s*[)]$/, "")
			});
		
		return match
	}

	function QueueSync(fun) {
		var me = this;
		me._deal = fun;
		me.l = me.p = 0;
		me.state = 1;
		me.deal();
	}
	Q.extend(QueueSync.prototype, {
		pause: function() {
			this.state = 2;
			return this
		},
		size: function() {
			return this.l - this.p
		},
		push: function(val) {
			this[this.l++] = val
		},
		pop: function() {
			var me = this,
				val = me[me.p];
			delete me[me.p++];
			return val
		},
		deal: function() {
			var me = this;
			if (me.state == 1 && me.size() > 0) {
				me._deal(me.pause().pop(), function() {
					me.state = 1;
					me.deal();
				})
			}
			return me
		}
	});

	var queue = new QueueSync(function(item, chain) {
		var callback = item.callback;
		batload(callback, item.ids, NULL, chain)
	});

	// require module
	function require(id) {
		var module = requireModule(id);
		return module ? module.exports : NULL
	}

	function requireModule(id) {
		//如果已定义了模块,就返回,否则转换名称系统,取映射的名称,再取模块
		return cacheModule[id] || cacheModule[getDemainPath(id2url(id))];
	}
	// bat sequence load module
	function batload(callback, deps, refer, chain) {
		var tasks = [];
		var params = [];
		Q.each(deps, function(i, id) {
			tasks.push(function(cb) {
				load(id, function(exports, err) {
                    err && console.error(err);
					params.push(exports);
					cb();
				}, refer);
			});
		});
		Q.series(tasks, function(err) {
            try{
                err || (callback && callback.apply(callback, params))
            }catch(e){
                console.error(e.stack||e);
            }
			chain && chain();
		});
	}

	function load(id, callback, refer) {
		var module = requireModule(id);
		module ? useModule(module, require, callback, refer) : request(id, function() {
			module = requireModule(id);
			module ? useModule(module, require, callback, refer) : loadModuleError(id, callback)
		}, function() {
			loadModuleError(id, callback)
		})
	}
	function loadModuleError(id,callback){
		callback(NULL, new Error("load module is error " + id))
	}
	//取得url的域名+路径,去掉参数及hash(frament)
	function getDemainPath(url) {
		return url.replace(/[\?#].*$/g, "");
	}

	function makeFactory(module) {
		if (!module.isMake) {
			module.isMake = !0;
			exports = module.factory(require, module.exports, module);
			Q.isNull(exports) || (module.exports = exports);
		}
		return module.exports;
	}

	function useModule(module, require, callback, refer) {
		switch (module.state) {
			case 1:
				callback(module.exports)
				break;
			case 2:
				refer && callback(makeFactory(module));
				break;
			case 3:
				module.state = 2;
				batload(function() {
					module.state = 1; //ok
					callback(makeFactory(module));
				}, module.dependencies, module);
				break;
		}
	}

	function request(url, success, error) {
		currentScript = id2url(url);
		/\/.+\.css(\?.*)?$/i.test(url) ? Q.getCss(url, error, error) : Q.getScript(currentScript, success, error)
	}

	// //////////////// id to url start ///////////////////////////////
	function id2url(id) {
		var url = alias2url(id);
		if (url == id) return id;
		url = vars2url(url);
		return normalize(url)
	}

	function normalize(url) {
		//return Q.url(!/\?/.test(url) && !/\.(css|js)$/.test(url) ? url + ".js" : url)
        return !/\?/.test(url) && !/\.(css|js)\s*$/.test(url) ? url + ".js" : url;
	}
	/** 别名转url */
	function alias2url(id) {
		return config.alias[id] || id
	}
	//变量转url
	function vars2url(id) {
		/*Q.each(id.match(/\$\{[0-9a-zA-Z._-]+\}/g) || [], function(i, val) {
			var tmp = config.vars[val.substring(2, val.length - 1).trim()] || val;
			id = id.replace(new RegExp("\\" + val, "g"), isFun(tmp) ? tmp() : tmp)
		});
		return id*/
		return id.replace(/\$\{[0-9a-zA-Z._-]+\}/g, function(val) {
			var tmp = config.vars[val.substring(2, val.length - 1).trim()] || val;
			return isFun(tmp) ? tmp() : tmp;
		});
	}

	function checkLegalId(id) {
		if (/[\)\(\*]/.test(id)) throw new Error("define id:" + id + " is Illegal,not contain )(*");
	}
	// ////////////////id to url end ///////////////////////////////
	function define(id, url, dependencies, factory) {
		checkLegalId(id);
		checkLegalId(url);
		return cacheModule[id] = cacheModule[url] = new Module(id, dependencies, factory);
	}
	Q.extend(sun, {
		use: function(ids, callback) {
			Q.delay(function() {
				ids = Q.isArray(ids) ? ids : [
					ids
				];
				if (!ispreload) {
					queue.push({
						ids: config.preload
					});
					ispreload = !0
				}
				//下面检测使用的模块是否已被全部加载过
				var ret = [];
				Q.each(ids, function(i, val) {
					var module = requireModule(val) || {};
					module.state == 1 && ret.push(require(val));
				});
				ret.length == ids.length ? callback && callback.apply(callback, ret) : queue.push({
					ids: ids,
					callback: callback
				});
				queue.deal()
			}, 1);
		},
		// factory:function(require, exports, module)
		define: function(uid, dependencies, factory) {
			var url, module;
			if (currentScript) url = currentScript;
			if (isFun(uid) || Q.isArray(uid)) {
				factory = dependencies;
				dependencies = uid;
				uid = "";
			}
			if (isFun(dependencies)) {
				factory = dependencies;
				dependencies = []
			}
			dependencies = dependencies.concat(parseDepents(factory));
			dependencies = Q.unique(dependencies);
			define(uid, getDemainPath(url || uid), dependencies, factory);
			currentScript = NULL;
		},
		config: function(opts) { //参数配置
			return Q.config(opts, config)
		},
		modules: function() {
			return Q.extend({}, cacheModule)
		}
	});
    sun.define.cmd = {};
	Q.sun = sun;
	Q.define = sun.define;
	win.define = win.define || Q.define;//如果外面没有引入其它cmd框架,设置全局变量define
	Q.use = sun.use;
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
		}
	});

})(Qmik);


/**
 * mvc 模块
 * @author leochen
 */
(function(Q) {
	var win = Q.global,
		isNull = Q.isNull,
		isPlainObject = Q.isPlainObject,
        execCatch = Q.execCatch,
		extend = Q.extend,
		each = Q.each,
		delay = Q.delay,
		con = console;

	var ctrls = {}, //控制器存储
		scopes = {},
		g_config = {
			section: 24//q-for分隔大小
		},
		keywords = "scopes context parent get set on off once app watch apply $";//关键词,用户不能定义到scope上的变量名
	var nameParentScope ="parent",
		namespace = "qmik-mvc-space",
		namespaceScope = "qmik-mvc-space-scope",
		fieldWatchs = "__watchs",
		nameRoot = "html",
		nameContext = "context",
		nameInput = "__input",
		nameMap = "__map",
		execInterval = 10;//scroll触发间隔
	/********* 当节点在显示视口时触发 start *******/
	var g_viewports = {};

	var prevTime = Q.now();
	function handle(){
		var curTime = Q.now();
		if (curTime - prevTime < execInterval) {//触发频率
            delay(handle, execInterval+2);
			return;
		}
		prevTime = curTime;
		var map = extend({}, g_viewports);
		each(map, function(key, map){
			var node = map.scope ? map.scope.context : map.context ,
				qdom = Q(node);
			if (qdom.inViewport()) {
				delete g_viewports[key];
                Q.delay(function(){
                    execCatch(map.callback);
                    qdom.emit("viewport");
                }, 11);
			}
		});
	}
	Q(win).on({
		scroll: handle,
		touchstart: handle,
		touchmove: handle
	});
	function trigger(){
		Q(win).emit("scroll");
	}
	/********* 当节点在显示视口时触发 end *******/
	//监听器的触发实现
	function watch(e, scope, emit) {
		var target = e.target,
			name = emit ? e.name : target.name||"",
			scope = getCtrlNode(target)[namespaceScope] || scope;
        scope = getUseSpaceScope(scope, name);
		if (name && (isInput(target) || emit) ) {
			fieldValue(scope, name, emit ? e.value : getInputValue(target));
			var value = getVarValue(scope, name);

            if(!isMulInput(target)){
                //检测新老值的变化
                if(target.__oldValue == value) return;
                target.__oldValue = value;
            }

            /* 如果是根scope,那么 把值赋值到 Scope.prototype 上面, 采用原型模式来读取内容 */
            setScopePrototype(scope, name);

			each(getBatList(scope[fieldWatchs], name), function(i, watch) {
				execCatch(watch,[{name:name, value:value, source:scope[split(name)[0]], target:target}]);
			});
			compileVarName(name, scope);
		}
	}
    var globalScope;//全局scope
	/** 应用 */
	function App(config) {
		this.config(config);
		this._rootCtrls = [];
	}
	extend(App.prototype, {
		__init: function(fun) {
			var me = this,
				scope = new Scope(),
				root = Q(nameRoot)[0];
            globalScope = me.scope = scope;
			root[namespace] = getSpace(root);
			Q.each(me._rootCtrls, function(i, fuun){
				fuun.call(scope, scope);
			});
			me._rootCtrls = [];
			Q.isFun(fun) && fun.call(scope, scope);

			function remove(e){
				var target = e.target,
					name = target.name,
					isInputDom = isInput(target),
					space = getSpace(target);
				if(space){
					var scope = space.scope;
					each(space.vars, function(i, _name) {
						var newmaps = [];
						if (isInputDom && name == _name) {
							return;
						}
						each(scope[nameMap][_name], function(i, dom) {
							dom != target && newmaps.push(dom);
						});
						scope[nameMap][_name] = newmaps;
					});
					if(isInputDom){
						/^\s*$/.test(target.value||'') || updateInputDomValue(scope, name);
						//delay(updateInputDomsLevelValue,10, scope,name)
					}
				}
			}
			function _change(e){
				watch(e, scope);
			}
			Q("body").on({
				change: _change,
				keyup: _change
			});
			Q(win).on({
				//DOMSubtreeModified: function(e){},
				DOMNodeInserted: function(e){//节点增加
					var target = e.target,
						space = getSpace(target),
                        scope = space.scope;
					if(space){
						if(isInput(target) && /^\s*$/.test(target.value||'')){
							return;
						}
						delay(function(){
						    var ctrl = Q(target).closest('[q-ctrl]')[0];
						    addScopeInput(target, ctrl ? scope : globalScope);
						    queryInputs(target, function(dom){
						        if(isInput(dom)){
						            addScopeInput(dom, ctrl ? scope : globalScope);
						            ctrl || globalScope.apply(dom.name);
						        }
						    });
						    compile(target, scope, true);
						}, 30)
					}
				},
				DOMNodeRemoved: remove //删除节点
			});

            scope.apply("");
            compile(root, scope, true);//编译页面
            trigger();
		},
		config: function(map){
			extend(g_config, map);
			return g_config;
		},
		//控制器
		ctrl: function(name, callback) {
            if(arguments.length < 1){
                return ctrls;
            }
			if (isPlainObject(name)) {
				extend(ctrls, name)
			} else {
				ctrls[name] = callback;
			}
			return this;
		}
	});

/** 会话 */
	function Scope(context, rootScope) {
		var me = this;
		me[fieldWatchs] = {}; //监听器集合
		me[nameContext] = context = context || Q(nameRoot)[0]; //上文dom节点
		me.scopes = scopes;
		me.__name = Q(context).attr("q-ctrl") || "root"; //控制器名
		me[nameMap] = {}; //变量映射节点集合
		me.__cmd = {}; //预留
		me[nameInput] = {}; //input映射节点
		scopes[me.__name] = me;
		context[namespaceScope] = me;
		me[nameParentScope] = rootScope; //父scope
        addScopeInputs(me[nameContext], me);
	}
    var ScopePrototype = Scope.prototype;
	extend(ScopePrototype, {
		// 监控器,监控变量
		watch: function(name, callback) {
			var me = this, map = {};
			if (isPlainObject(name)) {
				map = name;
			}else{
				map[name] = callback;
			}
			each(map, function(name, value){
				me[fieldWatchs][name] = me[fieldWatchs][name] || [];
				me[fieldWatchs][name].push(value);
			});
			return me;
		},
		/**
			查询节点,在控制器下的范围内查询
		*/
		'$': function(selector) {
			return isNull(selector) ? Q(this[nameContext]) : Q(selector, this[nameContext]);
		},
		on: function(name, handle){
			Q(this[nameContext]).on(name, handle)
		},
		off: function(name, handle){
			Q(this[nameContext]).off(name, handle)
		},
		once: function(name, handle){
			Q(this[nameContext]).once(name, handle)
		},
		set: function(name, value, callback){
			var nameList = [];
			var me = this;
			if(Q.isPlainObject(name)){
				callback = value;
				Q.each(name, function(key, val){
					nameList.push(key);
					fieldValue(me, key, val);
				})
			}else{
				nameList = [name];
				fieldValue(me, name, value);
			}
			me.apply(nameList, callback);
			return me;
		},
		get: function(name){
			return fieldValue(this, name)
		},
		apply: function(names, callback) { //应用会话信息的变更,同时刷新局部页面
			var me = this;
			if(Q.isFun(names)){
				callback = names;
				names = [];
			}else{
				names = Q.isArray(names) ? names : Q.isString(names) ? [names] : [];
			}
			//合并之前的更新 名册
			names = uniqueArray(names, (g_viewports[me.__name]||{}).names);
            updateGlobalScope(me);
            var tasks = (g_viewports[me.__name]||{}).tasks ||[];
            tasks.push(function(cb){
                Q.execCatch(callback);
                cb && cb();
            });
			g_viewports[me.__name] = {
				scope: me,
				names: names,
                tasks: tasks,
				callback: function(){
					function emitChange(names, callback){
						var isArray = Q.likeArray(names), name;
						each(names, function(i, list){
							name = isArray ? list : i;
                            updateInputDomsLevelValue(me, name);
							watch({
								target: me[nameContext],
								name: name,
								value: me[name]
							}, me, true);
							callback && callback(name, me);
						});
					}
                    if(names.length < 1){
                        names = [];
                        each(me[nameMap], function(key, value){
                            names.push(key);
                        });
                    }

                    emitChange(names, compileVarName);
					//Q.isFun(callback) && callback();
                    Q.series(tasks);
				}
			};
			delay(handle, execInterval + 2);
		}
	});
    /** 更新全局 */
    function updateGlobalScope(scope){
        if(scope == globalScope){
            for(var name in scope){
                if( ScopePrototype[name] != scope[name] && !isIllegalName(name) ){
                    ScopePrototype[name] = scope[name];
                }
            }
        }
    }
    /** 是否是非法的变量名(往scope赋值) */
    function isIllegalName(name){
        return /^__/.test(name) || new RegExp(name).test(keywords)
    }
    function queryInputs(context, callback){
        context.nodeType==1 && $('input,select,textarea',context).each(function(i, dom){
            callback && callback(dom);
        });
    }
    function addScopeInputs(context, scope){
        /*context.nodeType==1 && $("input,select,textarea", context).each(function(i, dom) {
            var pctrl = Q(dom).closest("[q-ctrl]")[0];
            (isNull(pctrl)||pctrl==context) && addScopeInput(dom, scope);
        });*/
        queryInputs(context, function(dom){
            var pctrl = Q(dom).closest("[q-ctrl]")[0];
            (isNull(pctrl)||pctrl==context) && addScopeInput(dom, scope);
        })
    }
	function addScopeInput(dom, scope){
		var name = dom.name;
		if(isInput(dom) && name){
			if(isIllegalName(name)){
				return Q.error("set scope["+scope.__name+"] name["+name+"] is illegal");
			}
			scope = getUseSpaceScope(scope, name);
            var val = getInputValue(dom);
            if( isMulInput(dom) ){
                val = val || fieldValue(scope, name);
            }
            fieldValue(scope, name, val);
            //scope[nameInput][name] = dom;
            scope[nameInput][name] = scope[nameInput][name] || [];
            scope[nameInput][name].push(dom);

            /* 如果是根scope,那么 把值赋值到 ScopePrototype 上面, 采用原型模式来读取内容 */
            setScopePrototype(scope, name);

		}
	}
    /* 如果是根scope,那么 把值赋值到 ScopePrototype 上面, 采用原型模式来读取内容 */
    function setScopePrototype(scope, name){
        if(scope.__name == "root"){//如果是根scope
            var field = split(name)[0];
            ScopePrototype[field] = scope[field];
        }
    }
	function uniqueArray(list1, list2){
		if(list1.length<1)return [];
		var list = list1.concat(list2 || []).sort(),
			result = [];
		for(var i=0,j;i<list.length;i++){
			for(j=i+1;j<list.length;j++){
				if(new RegExp("^"+list[i]).test(list[j])){
					list.splice(j,1);
					j--;
				}
			}
			result[i] = list[i];
		}
		return result;
	}
	function getBatList(map, name){
		if(name=="")return;
		var retWatchs = [];
		for(var i=0,end=split(name).length;i<end;i++){
			var watch = map[name];
			if(watch){
				retWatchs = watch.concat(retWatchs);
			}
			name = name.replace(/\.?[^\.]*$/,"");
		}
 		return retWatchs;
	}
	function isInput(dom){
		var name = dom ? dom.tagName : "";
		return name == "INPUT" || name == "SELECT" || name == "TEXTAREA"
	}

    function isMulInput(dom){
        var type = dom.type;
        return type == "checkbox" || type =="radio" || type == "select-multiple"
    }
	/** 取界面上input输入标签的初始化值 */
	function getInputValue(node) {
		var name = node.name,
			type = node.type,
			vals = [];
		if(type == "radio"){
			vals[0] = node.checked ? node.value : ""
		}else if(type == "checkbox"){
			Q("input[name='"+node.name+"']", getCtrlNode(node)).each(function(i, dom){
				dom.checked && vals.push(dom.value)
			})
		}else if(type == "select-multiple"){
            Q(node).children("option").each(function(i, option) {
                option && option.selected && vals.push(option.value)
            });
		}else {
			vals.push(node.value)
		}
		return vals.join("&")
	}
	var REG_VAR_NAME = /(\$\{\s*[\w\._-]*\s*\})|(\{\{\s*[\w\._-]*\s*\}\})/g;
	var REG_VAR_NAME_REP=/\s*((^(\$|\{)\{)|(\}?\}$))\s*/g;
	var REG_SCRIPT = /<\s*script/g;

	REG_VAR_NAME.compile(REG_VAR_NAME);
	REG_VAR_NAME_REP.compile(REG_VAR_NAME_REP);
	REG_SCRIPT.compile(REG_SCRIPT);

	/** 解析页面 */
	function compile(node, scope, isAdd) {
		replaceNodeVar(node, scope, isAdd, compileChilds);
	}
	function compileChilds(node, scope, isAdd){
		if(node && node != win){
			each(node.childNodes, function(i, node) {
				replaceNodeVar(node, scope, isAdd, compileChilds);
			})
		}
	}
	//取得变量名
	function getVarName(name) {
		return (name || "").replace(REG_VAR_NAME_REP, "");
	}
	function split(name){
		return name.split(".")
	}
	function fieldValue(object, names, val){
		var ns = Q.isArray(names) ? names : split(names),
			field = ns[0];
		if(ns.length < 2){
			if(!isNull(val)){
				object[field] = !isNull(val) ? val:  !isNull(object[field]) ? object[field] : "";
			}
			return object[field];
		}
		object[field] = object[field] || {};
		ns.shift();
		return fieldValue(object[field], ns, val);
	}
	//取变量对应的值
	function getVarValue(scope, name) {
		var val = fieldValue(getUseSpaceScope(scope, name), name);
		return isNull(val) ? "" : val;
	}
	function getUseSpaceScope(scope, name){
		var field = split(name)[0];
		//return isNull(scope[field]) && scope[nameParentScope] && !isNull(scope[nameParentScope][field]) ? scope[nameParentScope] : scope
        var val1 = scope[field];
        var val2 = ScopePrototype[field];
        if( !isNull(val2) ){//全局不为空
            if(Q.isObject(val1) || Q.isArray(val1)){
                if(val1 == val2){
                    return scope[nameParentScope] ? scope[nameParentScope] : scope;
                }
            }
        }
        return scope;
    }
	/** 取控制器节点 */
	function getCtrlNode(node) {
		return Q(node).closest("[q-ctrl],"+nameRoot)[0]
	}

	//添加变量映射节点
	function addMapNode(scope, name, node) {
		scope = getUseSpaceScope(scope, name);
		if (scope) {
			addMapPush(scope, name, node)
		}
	}
	function addMapPush(scope, name, node){
		var retWatchs = [];
		for(var i=0,end=split(name).length;i<end;i++){
			var list = scope[nameMap][name] = scope[nameMap][name] || [];
			list.indexOf(node)<0 && list.push(node);
			name = name.replace(/\.?[^\.]*$/,"");
		}
 		return retWatchs;
	}
	function compileVarName(key, scope) {
        var list = [];
		each(scope[nameMap][key], function(i, dom) {
            if(Q(dom).parents("html").length > 0 ){
                list.push(dom);
            }
			replaceNodeVar(dom, scope);
		});
        scope[nameMap][key] = list;
	}
	/** 取存放到节点上的对象空间 */
	function getSpace(node){
		var ctrl = getCtrlNode(node);
		if(ctrl){
			return node[namespace] || {
				attr: {},
				vars: [],
				ctrl: ctrl,
				event: {},
				fors: {},
				scope: ctrl[namespaceScope] || globalScope
			}
		}
	}
    /** 更新级联的输入节点 ,依赖于updateInputDomValue */
    function updateInputDomsLevelValue(scope, name){
        each(scope[nameInput], function(key){
            if(key == name || key.indexOf(name+".")==0){
                updateInputDomValue(scope, key);
            }
        });
    }
    function updateInputDomValue(scope, name){
        var newValue = getVarValue(scope, name)+"";
        var list = scope[nameInput][name];
        scope[nameInput][name] = [];
        each(list, function(i, dom){
            if(Q.contains(scope.context, dom)){
                var type = dom.type;
                if(type=='radio'){
                    dom.checked = dom.value == newValue;
                }else if(type=='checkbox'){
                    dom.checked = false;
                    newValue.replace(/[^&]+/g, function (val) {
                        if (dom.value == val) {
                            dom.checked = true;
                        }
                    });
                }else if(type=='select-multiple'){
                    each(dom.options, function(j, ele){
                        ele.selected = false;
                        newValue.replace(/[^&]+/g, function (val) {
                            if(ele.value == val){
                                ele.selected = true;
                            }
                        });
                    });
                }else{
                    dom.value = newValue;
                }
                scope[nameInput][name].push(dom);
            }
        });
    }
	function replaceNodeVar(node, scope, isAdd, callback) {
		var space = getSpace(node), qnode = Q(node);
		if(!space)return;
		switch (node.nodeType) {
			case 1://正常节点
				node.tagName !="SCRIPT" && each(node.attributes, function(i, attr){
					var attrName = attr.name,//属性名
						value = space.attr[attrName] = space.attr[attrName] || (attr.value || "").trim();
					if ("q-ctrl" == attrName) {//控制器
						if (value != "") {
							if(scopes[value]){
								scope = scopes[value];
							}else{
								scope = new Scope(node, scope.parent || scope);
								execCatch(function() {
									Q.isFun(ctrls[value]) ? ctrls[value].call(scope, scope) : Q.warn("q-ctrl:[" + value + "]is not define");
								});
                                scope.apply("");
							}
						}
					} else if("q-include" == attrName){
                        var vpkey = "q-include-"+value+Math.random(), vphandle={
                            context: node,
                            callback: function(){
                                if(Q(node).css('display')!='none'){
                                    Q.get(value, function(html){
                                        qnode.rmClass('loading').html('<div>'+html+'</div>');
                                    })
                                }else{
                                    g_viewports[vpkey] = vphandle;
                                    Q('body').once({
                                        click:handle,
                                        touchstart: handle
                                    })
                                }
                            }
                        };
                        g_viewports[vpkey] = vphandle;
                        qnode.rmAttr("q-include");
                    } else if ("q-for" == attrName) { //for
						var vs = value.replace(/(\s){2,}/g, " ").split(" "),
							template = space.html = space.html || node.innerHTML.replace(REG_SCRIPT, "&lt;script"),
							htmls = [],
							list = getVarValue(scope, vs[2]) || [];
						if(vs.length == 3 && vs[1]=="in"){
                            each(list, function(i, item) {
                                var html = template.replace(REG_VAR_NAME, function(varName) {
                                    var reg = new RegExp("^" + vs[0] + "\."),
                                        name = getVarName(varName).replace(reg, ""),
                                        val = fieldValue(item, name);
                                    val = isNull(val) ? "" : val+"";
                                    return val.replace(REG_SCRIPT, "&lt;script");
                                });
                                htmls.push(html);
                            });
                            qnode.html(htmls.join(""));
                            compileChilds(node, scope, isAdd);//编译
                            show(node);
							node[namespace] = space;
							isAdd && addMapNode(scope, vs[2], node);
						}else{
							Q.warn("q-for[",value,"] is error");
						}
					} else if(/^q-on/.test(attrName)){//事件绑定
						var name = attrName.replace(/^q-on/,""),
							funName = value.replace(/\(.*\)$/,""),
                            context = scope[nameContext];
						if(!space.event[name]){
                            node[namespace] = space;
                            if( ["focus", "blur"].indexOf(name) >= 0 ){
                                context = node;
                            }else{
                                space.event[name] = true;
                            }
							var innerhandle = function(e){
								if(!Q.contains(context, node)){
									return Q(context).off(name, innerhandle);
								}
								if( Q.contains(node, e.target) ){//判断是否是当前节点的子节点触发的事件
									scope[funName] && scope[funName].call(node, e);
								}
							};
							Q(context).on(name, innerhandle);
						}
					} else if (REG_VAR_NAME.test(value)) {//变量
						attr.value = value.replace(REG_VAR_NAME, function(name) {
							node[namespace] = space;
							name = getVarName(name);
							space.vars.push(name);
							var val = getVarValue(scope, name);
							isAdd && addMapNode(scope, name, node);
							return val;
						});
					}
				});
				break;
			case 3://文本节点
				var textValue = space.text;
				textValue = isNull(textValue) ? node.textContent : textValue;
				if (REG_VAR_NAME.test(textValue)) {
					node[namespace] = space;
					space.text = textValue;
					node.textContent = textValue.replace(REG_VAR_NAME, function(name) {
						name = getVarName(name);
						space.vars.push(name);
						var val = getVarValue(scope, name);
						isAdd && addMapNode(scope, name, node);
                        //updateInputDomValue(scope,name);
						return val;
					});
                    show(node.parentNode);
				}
				break;
		}
		space.scope = scope;
        callback && callback(node, scope, isAdd);
	}
    function show(node){
        var qnode = Q(node);
        qnode.css("visibility","visible");
        if(qnode.css('display')=='none'){
            if(Q.isIE()){
                qnode.css('display', qnode.attr('q-for')?'inline-block':'inline');
            }else{
                qnode.css('display','initial');
            }
        }
    }
	var app;
	Q.app = function(rootCtrlFun, config){
		config = Q.isFun(rootCtrlFun) ? config : rootCtrlFun;
		config = Q.isObject(config) ? config : {};

		app = app || new App(config);
		if(config.compile != false && !app.compile){
			app.compile = true;
			Q(function(){
				app.__init(rootCtrlFun);
			})
		}else if(Q.isFun(rootCtrlFun)){
			if(app.scope){
				execCatch(rootCtrlFun, [app.scope]);
			}else{
				app._rootCtrls.push(rootCtrlFun);
			}
		}
		return app;
	};
	//
})(Qmik);