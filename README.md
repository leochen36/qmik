## 关于Qmik [下载压缩](https://raw.githubusercontent.com/leochen36/qmik/master/builds/Qmik.all.js)

## [官网](http://www.qmik.org)  [微博](http://weibo.com/u/5262932432)

## QQ群: 183536985

Qmik是一个面向数据接口编程,代码模块化,mvc式的开发框架,数据双向趋动,入门简单,jquery语法,快速和精简,功能强大的无线端JavaScript库,核心库大小22kb,gzip=8kb,

是在无线端替换jquery,zepto,seajs,angulars,task任务处理,mvc等的理想框架,

[模块开发内核](https://github.com/leochen36/qmik/wiki/sun-%E6%A8%A1%E5%9D%97%E5%BC%90%E5%8F%91)
(支持模块压缩代码)

[mvc开发模式,节约50%开发成本,减少50%维护成本,业务代码与页面dom结构80%解偶,面向数据接口编程](https://github.com/leochen36/qmik/wiki/mvc%E5%BC%80%E5%8F%91)

[插件开发内核](https://github.com/leochen36/qmik/wiki/%E6%8F%92%E4%BB%B6%E5%BC%80%E5%8F%91)
(推荐使用模块开发模式,不推荐使用插件模式,插件模式会破坏框架的代码结构)

简化了dom查询,事件,ajax通讯等的使用,

任务队列处理内核(
[$.series](https://github.com/leochen36/qmik/wiki/$.series-%E4%B8%B2%E8%A1%8C%E4%BB%BB%E5%8A%A1%E5%A4%84%E7%90%86),
[$.parallel](https://github.com/leochen36/qmik/wiki/$.parallel-%E5%B9%B6%E8%A1%8C%E4%BB%BB%E5%8A%A1%E5%A4%84%E7%90%86))

支持uc,ie>=9,基于webkit内核的浏览器(如chrom,safari等),firefox; 推荐做移动web开发,也可以做pc端的开发,

您可以利用这一份框架Qmik来替换掉seajs,jquery,asnyc和模块引擎,,,可以减少框架的维护成本及页面请求大小和数量,提升性能


## 应用场景

微信第三方插件应用, webapp,hybrid app等

[趋梦工厂(3D打印服务平台)](http://www.qudream.cn)

阿里双11

天猫无线大促活动

深圳宜搜科技等互联网公司

## 安装
<pre>
npm安装: npm install qmik
bower安装: bower install qmik
</pre>

## API简介:

        version:      :查看qmik的版本,是个字段
        app(handle)   :把整个文档声明为一应用,应用mvc模式开发,需要执行此方法,会编译解析整个dom文档,返回App对象
        encode(value) :等同于encodeURIComponent
        decode(value) :decodeURIComponent ,
        isBool(value) : 布尔判断,
        isString(value) : 字符串判断,
        isFun(value) : 方法判断,
        isFunction(value) : 方法判断,
        isNum(value) :整形判断 ,
        isNumber(value) : 整形判断,
        isArray(value) : 数组判断,
        isNull(value) : 空指针判断,
        isRetinal() : 判断是否是高清屏,默认是高清屏
        likeArray(value) : 像数组,有length字段等一些属性,
        each(value,function(i,val){}) : 循环,
       
        stringify(value) : json转字符串,
        parseJSON(value) : 字符串转json,
        likeArray(value) : 像数组
        isDate(value) :是否是时间类型
        isObject(value) : 是否是对象
        isPlainObject(value) : 
        likeNull(value) : 像空值,如 "","null","undefined",null等会被认为True,
        inherit(subClass, superClass) : 继承类 子类subClass继承父类superClass的属性方法, 注:子类有父类的属性及方法时,不会被父类替换,
        trim(value) : 过滤前后不可见字符,
        toLower(value) :字符串小写,
        toUpper(value) : 大写,

        merge(map1,map2) : merge,   // 合并对象 var m1={name:'leo'}, m2={age:11}, m= $.merge(m1, m2); //>>>result: {name:'leo', age:11}
        inArray(value, array) : 在数组里的索引位,var array=[1,2,3,4], idx = $.inArray(3,array);console.log(idx);//result:2
        unique(array) : 数组去重,//var array=[1,2,3,4,5,4,3,6];array = $.unique(array);//result:[1, 2, 3, 4, 5, 6]
        map(array, callback) : //对数组里的内容,全部做一次数据映射转换,
        getScript(url, success, error) :  取得脚本
        getCss(url, success, error) :  取得css
        grep(array[,callback]):过滤// var array=[1,2,null,3,6,5];var narray = $.grep(array, function(i, val){return val && val%2==0});console.log(narray);//result:[2, 6]
        param(array) :  抽取数组里面每个元素的name和value属性,转换成一个url形式(a=b&name=g)的字符串,有做encode,//[{name:'',value:''},{name:'',value:''}]
        now([datetime]) :   当前时间

        delay(fun, time [arg1, arg2, arg3,...]) (https://github.com/leochen36/qmik/wiki/$.delay)  \<br>延迟执行,类似setTimeout,返回一个对象,对象有个 stop方法,用于停止执行,...表示要传输的参数,如:$.delay(function(a1,a2){},1000,1,2);//1 对应 a1,2对应 a2
        // 
        /**
         * fun:执行的方法
         * cycleTime:执行的周期时间
         * ttl:过期时间,执行时间>ttl时,停止执行,单位 ms(毫秒)
         * ,...表示要传输的参数 $.cycle(function(a1,a2){},1000,30000,1,2);//1 对应 a1,2对应 a2
         */
        cycle(fun, cycleTime, ttl,...) :  周期执行,类似于setInterval,会返回一个对象,对象有个 stop方法,用于停止执行

        log(msg, event) : 打日志
        isIphone() : 
        isAndroid() :
        isWP() : //is windowsphone
        isIE() : //is ie浏览器
        isFF() : is Firefox
        isWK() : is Webkit
        isOpera() : isOpera
        config(opts, _config) : 
        url() : //返回当前访问地址的url

        ajax:function({
            dataType:'json'|'text'|'jsonp',
            async:bool,(default:true)
            type: 'get'|'post',
            timeout:100000,//超时时间
            success,function(data){},
            error:function(){}
        });

        series:function(tasks, callback)//串行执行任务列队,如果有输出参数,则前一个任务输出参数给下一个任务
                //例子,tasks:任务方法数组,callback:执行完任务后,回调
                $.series([
                    function(callback){//callback:function(err, exports){}
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
        parallel:function(tasks, callback)//并行执行任务列队,当中有任务执行出错,不影响其它任务的执行
                //例子:tasks:任务方法数组, callback:执行完任务后,回调
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

查询api:支持下面的查询格式,api采用h5原生的方法querySelectorAll来检索,性能最高效,但是会存在不同浏览器支持的程度不太一样,下面的写法,所有浏览器都会支持

        $("#id") 
        $(".class")
        $("ul")
        $("#id .class")
        $("#id > .class")
        $(".class div[flag=aaa]")   

Qmik.fn api(即 $("#id").api)

        last : function() :最后一个
        eq : function(i)    :指定位置
        first : function()  :第一个
        filter : function(f) :过滤选择
        even : function()   :偶数个
        odd : function()    :奇数个
        gt : function(i) :
        lt : function(i) :
        find : function(s) 
        each : function(f)
        append : function(c)
        appendTo: function( c ):$('.wrap').appendTo("body"),$('.wrap').appendTo($("body"))
        remove : function()
        before : function(c) 
        beforeTo : function(c) 
        after : function(c)
        afterTo : function(c)
        html : function(v)
        empty : function() 
        text : function(v) 
        addClass : function(n) 
        rmClass : function(n)  == removeClass
        show : function()
        hide : function() 
        toggle : function()
        inViewport: function()//判断节点是否在当前显示视口,
        map : function(callback)
        css : function(k, v) 
        attr : function(k, v) 
        rmAttr : function(k)    == removeAttr
        removeAttr : function(k)
        data : function(k, v) 
        rmData : function(k) == removeData
        val : function(v)

        next : function(selector) //下一个指定元素
        prev : function(selector) //上一个指定元素
        clone : function(bool) 
        hasClass : function(c) 
        closest : function(selector) //查找最近的匹配的父(祖父)节点(从自身开始查找)
        parents : function(selector) //查找所有的匹配的父(祖父)节点
        parent : function(selector) //查找最接近的一个匹配的父(祖父)节点
        children : function(selector)//查找子节点

        width:function();//宽度
        height:function()//高度
        offset:function() //return {top:xx,left:xx} 获取匹配元素在当前视口的相对偏移
        position:function() //return {top:xx,left:xx}获取匹配元素相对父元素的偏移

## 事件使用:
<pre>
    $("#id").on({//绑定事件
        click: function(e){
            console.log(e);
        }
    });
    $("#id").off("clcik");//取消事件,接收两个参数 $("#id").off(name, handle); name:事件名,handle绑定的方法,如果没有传,就取消全部的指定事件

    $("#id").once({//绑定事件,只执行一次
        click: function(e){
            console.log(e);
        }
    });
    $("#id").live({//委托事件
        click: function(e){
            console.log(e);
        }
    });
    $("#id").die("click");//取消委托事件,$("#id").die(name, handle)
</pre>


## mvc api:

    <pre>
        Qmik(function($){
            //每个页面当成一个应用来看待,编译页面并生成一个应用,全局唯一,多次调用只能生成一个
            var app = Qmik.app(function(scope){
                //这个方法可以不定义,这个是定义全局控制器的变量用的
            });
            app.ctrl({//定义控制器
                demo: function(scope){

                }
            });

            scope 会话api:
            scope.watch({"name", function(e){}});监听器
            scope.apply(["name1","name2"]);//应用刷新到界面
            scope.$(selector)  ;//检测器,会在scope作用域下来按css规则来探索节点,如果没有传递参数,就返回 $(scope.context);即声明控制器节点
            scope.once("viewport", function(){
                //这个事件viewport的作用是,当这个控制器处在当前窗口的可视位置时,才会触发,而且只会触发一次,
                //这对于页面数据及代码,做按需加载,非常有意义

            });
            scope.on(name, handle);//事件绑定,绑定到当前声明控制器的节点上,使用$.fn.on来实现,
            scope.off  //删除事件绑定
        });

    </pre>


## mvc 例子:


<!-- 声明控制器 --> 
<pre>
&lt;div q-ctrl="demoCtrl" class="box" &gt;
    &lt;p&gt; 全局: ${gname} &lt;/p&gt;
    倒计时: &lt;input name="time" type="text"/&gt; ${time} 或 {{time}}

    &lt;div&gt;
        &lt;h3&gt;用户信息  //qmik会自动把user.* 转换成 scope.user ={name:"",nick:"" ...} &lt;/h3&gt;
        &lt;p&gt;user.name &lt;input name="user.name" type="text"/&gt;  ${user.name}&lt;/p&gt;
        &lt;p&gt;user.nick &lt;input name="user.nick" type="text"/&gt; ${user.nick}&lt;/p&gt;
        &lt;p&gt;user.email &lt;input name="user.email" type="text"/&gt; ${user.email}&lt;/p&gt;
        &lt;p&gt;user.qq &lt;input name="user.qq" type="text"/&gt; ${user.qq}&lt;/p&gt;

        &lt;h3&gt;//显示列表,ul下面的内容是模板,qmik会根据模板来生成相应的页面, Qmik 循环 &lt;/h3&gt;
        &lt;h3&gt;
            //q-onclick:是定义的单击事件,可以通过q-onxxx来定义事件,如:q-onclick,q-ontouchmove等
        &lt;/h3&gt;
        &lt;ul q-for="item in list" q-onclick="clickList" class="box"&gt;
            &lt;li&gt;${item.title}&lt;/li&gt;
        &lt;/ul&gt;
    &lt;/div&gt;
    &lt;/div&gt;
    &lt;script&gt;


        $.app(function(scope){//全局控制器的写法
            scope.gname="lllleeeeoooo";
        }).ctrl({
          demoCtrl: function(scope){//定义控制器  scope:会话,作用空间在q-ctrl里面,不能超出
            scope.once({//只触发一次,采用 $.fn.once 方法实现
                viewport: function(){//当控制器所在的位置进入可显示的视口位置时,触发这个方法
                    ///$.ajax({});
                    scope.user.name="leo";
                    scope.user.nick="leo";
                    scope.user.email="cwq0312@163.om";
                    scope.user.qq="555";
                    scope.apply("user");
                }
            });

            scope.watch({//监听器
                //监听name值的变化,发现变化,会触发此事件(通过change事件来触发)
                //因此如果想要手动触发这个方法,需要通过scope.apply(["user.name"]);来触发事件
                "user.name": function(map){
                    $.log("watch:", map);
                },
                "user": function(map){//监听所有user(.*)?的变化

                }
            });

            scope.list= [{
                title:'leo1'
            },{
                title:'leo2'
            }];

            scope.clickList = function(e){

                var i = parseInt(Math.random() * 2);
                var color = i%2==1 ? "red": "green"; 
                $(e.target).css("backgroundColor",color);
            }

            scope.time = 999;
            $.cycle(function(){
                scope.time--;
                scope.apply(["time"]);//更新到界面
            }, 1000);
          }
        });

    &lt;/script&gt;
&lt;/div&gt;
</pre>


## 按需加载例子:
<pre>
    //使用模块
    $.use(["module1","module2"],function(module1,module2){

    });
    //定义模块
    $.define(function(require, exports, module){

    });
    //环境配置
    $.sun.config({
        alias: {//定义别名
            "qmik/loadimg": "http://xxx.xxx.com/qmik/loading.js?${version}"
        },
        vars: { //定义变量
            version: function(){
                 return 1;
            },
            version1: 2
        }
    });
</pre>
a. Config.js 文件,写如下内容:
<pre>
        (function($) {

            $.config({
                context : "/",// 配置工程的访问路径,如果没有配置,默认= /
                debug:true//debug模式
            });

            // 定义模块名及请求路径
            $.sun.config({
                //别名系统,把路径抽象成一个key来表示,后续通过这个key来找到对应的url
                alias : {
                    // qmik组件
                    "Qmik.nav" : $.url("/assets/plugins/Qmik.nav.js"),//
                    ///
                    //业务模块
                    "Home" : "module/home/Home.js",
                },
                preload : [//预加载,在加载其它模块前,最优先加载下面定义的模块
                    "Qmik.nav"
                ]
            });
        })(Qmik);

</pre>
b.在index.html页面引入js<br/><br/>


<pre>
        <!-- 加载框架 -->
        <script type="text/javascript" src="/xxxx/Qmik.js"></script>
        <!-- 加载配置文件 -->
        <script type="text/javascript" src="/xxxx/Config.js"></script>
c.实现Home业务模块功能

    (function($) {
        function Home(nav){
            this.nav=nav;
        }
        Home.prototype.showHome=function(){
                var me=this;
                var main = $("#main_module");
                    $.get("module/home/home.html", function(data) {
                        main.html(data);//填充内容
                        me.doxxx();
                    });
        }

            $.define(function(require, exports, module) {
                var nav = require("Nav");//依赖导航模块
                exports=new Home(nav);
            });
        })(Qmik);
</pre>


 d.使用模块,在index.html使用 Home模块功能.  在index.html的尾部加入如下代码:


<pre>
        <script type="text/javascript">
            // 界面初始化 
            (function($) {
                //依赖3个模块初始化
                $.use([
                    "Nav", "Home"
                ], function(nav, home) {
                        nav.doxxx();//显示头部导航
                        home.showHome();//显示首页
                });
            })(Qmik);
        </script>
</pre>



## 版本记录
[增加2.2.22版本:](https://github.com/leochen36/qmik/tree/master/builds)
<pre>
2.2.22版本,
1. scope增加 set方法,自带了scope.apply更新字段,减小写代码量, scope.set(field, value, callback) 或 scope.set(object, callback);
</pre>

[增加2.2.21版本:](https://github.com/leochen36/qmik/tree/master/builds)
<pre>
2.2.21版本,
1. 修复不2.2.20版本的bug(不能执行全局控制器)
2. 解决内容为空时,不能复制的bug
3. 通过 $.app(function(){  }, {compile: false}); //可以不会编译页面,留在后面调用$.app()时编译
</pre>

[增加2.2.13版本:](https://github.com/leochen36/qmik/tree/master/builds)
<pre>
2.2.13版本,
1.修复报控制器不存在的bug
</pre>

[增加2.2.12版本:](https://github.com/leochen36/qmik/tree/master/builds)
<pre>
2.2.12版本,
1.修复scope.apply回调存在不被执行的情况,(更新完数据,立即回调);// scope.apply('name', function(){ console.log('apply ok') })
</pre>

[增加2.2.11版本:](https://github.com/leochen36/qmik/tree/master/builds)
<pre>
2.2.11 版本,
1.无代码修复,调整生成的builds命名,新文件的命名不在带有版本号
</pre>

[增加2.2.10版本:](https://github.com/leochen36/qmik/tree/master/builds)
<pre>
2.2.10 版本,
1.修复scope变量值不能正常更新到部 input,select显示上
</pre>

[增加2.2.02版本:](https://github.com/leochen36/qmik/tree/master/builds)
<pre>
2.2.02 版本,
1.修正$.fn.inViewport()方法,当ofsset.top或offset.left<0是,判断为false的bug
2.修复scope值没有更新到value的bug,场景:当input的值为空,从异步接口取出值后,设置到scope上,执行apply方法,没有更新到对就input的
3.调整sun,对加载模块错误时,修正为会正常回调方法,但是回调时,传递的导出模块变量为空
4.修复 2.2.01版本的压缩包,因grunt-uglify压缩问题造成的bug
</pre>

[增加2.2.00版本:](https://github.com/leochen36/qmik/tree/master/builds)
<pre>
2.2.00 版本,
1.增加mvc q-include 引入webcomponent功能, 如&lt;div q-include="/test.html"&gt;&lt;/div&gt; 就会在这个div元素处于可见视口位置时,才去加载/test.html
2.对sun功能加入define.cmd的标记,标记为cmd标准加载
3.bug修复
4.ajax增加progress进度事件,用于跟踪接口进度
</pre>


[增加2.1.20版本:](https://github.com/leochen36/qmik/tree/master/builds)
<pre>
2.1.20 版本,
1.兼容query $("#id").focus(),及 blur,调用此方法会执行dom.focus();
2.微调mvc(a.调整执行控制器方法的this,b.微调q-onxxx绑定事件,动态append,跟全局控制器变量名一样,不能更新到页面的bug)
3.调整$.fn.append,html,init,使之可以编译scipt标签里脚本, 解决html内容包含\n就变成纯文本添加,不解析的bug
4.清理失效的文本节点
5.调整scope.$()方法,如果scope.$()参数为空,就返回声明对应控制器的dom节点
6.修复触发事件scope.once("viewport", function(e){}); 这个事件是当当前控制器在可视窗口时,才会触发,且只触发一次,对按需要处理非常有用
</pre>

[增加2.1.10版本:](https://github.com/leochen36/qmik/tree/master/builds)
2.1.10 版本,
1.修复全局控制器的引用变量,更新数据时,不能更新到其它控制器上的bug

[增加2.1.02版本:](https://github.com/leochen36/qmik/tree/master/builds)
2.1.02 版本,
1.优化性能
2.修复q-for更新页面内容会闪的体验性问题
3.调整$.url的实现,跟正常的url访问具体相同的能力

[增加2.1.00版本(增强mvc功能,修复bug):](https://github.com/leochen36/qmik/tree/master/builds)
2.1.00 版本,
1.增加mvc功能,允许q-ctrl下包含子q-ctrl,但是没有父子关系,所有的q-ctrl只有一个共同的父控制器
2.修复sun模块没有执行预加载的bug

[增加2.0.00版本(重大功能mvc完善):](https://github.com/leochen36/qmik/tree/master/builds)
2.0.00 版本,
1.增强完善mvc大模块功能
4.增加Qmik.fn.inViewport()方法(节点是否在当前视口)


[增加1.4.00版本(稳定后,升级为2.0版本,重大功能mvc加入):](https://github.com/leochen36/qmik/tree/master/builds)
1.4.00 版本,
1.增加mvc大模块功能
2.修改sun模块define模块时,参数(require, exports, module)必须全传的bug
3.小细节优化
4.去掉render

[增加1.3.80版本:](https://github.com/leochen36/qmik/tree/master/builds)
1.3.80 版本,
1.修复$.merge 对数组合拼操作的bug


[增加1.3.70版本:](https://github.com/leochen36/qmik/tree/master/builds)
1.3.70 版本,
1.优化sun模块的异常调试日志,
2.重构事件模块

[增加1.3.62版本:](https://github.com/leochen36/qmik/tree/master/builds)
1.3.62 版本,
1.增强cycle的功能,增加循环结束时间的支持: $.cycle(function(){}, cycleTime, ttl);
2.修复 jsonp 对一小部分传递对象的参数的拼接url连接参数的bug,$.ajax({url:"https://github.com/leochen36/qmik",data:{name:'leo',haha:20}}) 这种
2.修复 append 对象不是节点型字符串的支持(非<p>xxx</p>这种)


[增加1.3.60版本:](https://github.com/leochen36/qmik/tree/master/builds)
1.3.60 版本,对1.3.50版本修改sun模块造成的严重bug进行修复(请直接跳过1.3.50版本), 调整ready方法,ready里的方法,导出参数Qmik本身 Qmik.ready(function($){}),
修复对ie9的log方法不支持情况


增加1.3.50版本:
    修复sun模块加载远程模块代码可能出现的异常
    添加fn.appendTo,fn.afterTo,fn.beforeTo;


1.增加模块加载定义时对return的支持:如:
```
$.define("demo",function(require, exports, module){
    module.exports = {name:"exports"};
    return {name:"leo"};//等于 module.exports = {name:"leo"}
});

```

增加1.3.10版本,,,此版本对sun模块的加载机制进行了调整,影响:新版本如果页面代码里已定义模块名:如 lib/qmik/Store,
在新版本中,如果定义了别名
$.sun.config({
    alias: {
        "lib/qmik/Store":"http://xxx.com/xxx/store.js"
    }
});
那么新版本开始会认为 别名 "lib/qmik/Store" 就是模块名,会优先以模块名进行加载模块,如果加载不到,再去请求对应的js文件,
老版本认为是不一样,在实际使用中及反馈中,应该把二者统一为一样


增加1.3.01大版本,
    任务进度处理模块$.task,有$.series(串行执行), $.parallel(并行执行),
    废弃不推荐的方法$.fn.animate,$.fn.hover;

增加1.2.36版本,可调试性

增加1.2.35版本,增强sun模块可调试性

增加1.2.33版本,增强稳定性,兼容性

增加1.2.32版本:增强sun模块的稳定性,防止多重依赖时,一个模块异常,造成其它模块不能正常加载

增加1.2.31版本:1优化了模块加载异常的日志信息打印,对节点的after,before调整为直接对本节点操作,不clone节点

增加1.2.30版本:1.优化sun模板,修复并优化getScript的回调策略

增加1.2.23版本:1.增加高清屏的判断 Qmik.isRetinal, 2.修复部分文本添加会造成的bug

增加1.2.22版本, 1.优化并解决查询(closest)的bug

增加1.2.20版本, 1.优化了查询,大幅提升了查询的性能, 2.减小了核心版本的体积,合并后减小到20.7k了,gzip在8k左右. 3.增强了了fn.live委托事件的功能,ie测试最低从ie9开始 4.增加了一个滚动插件Qmik.fn.scrollBar.js 5.增加了一个前进后退插件Qmik.nav.js,Qmik.nav插件依赖核心sun功能

1.2.16版本 修复: 1.sun模块对部分浏览器加载的bug 2.getJSON 少传data参数造成的bug



## 下载源码,自定义构建(构建时,只能选择src目录下的文件合并成一个Qmik.js,不能包含plugins等其它目录)
<pre>
    1.安装github客户端,需要使用到git-shell  (http://windows.github.com/)
    2.下载 nodejs ,安装 ,http://nodejs.org/
    3. 把nodejs的bin配置到path里,(已经自带了npm)
    4.运行Git Shell,进入下载下来的源码地址,如果d:/download/qmik/
            执行命令:
                    npm uninstall -g grunt  卸载 
                npm install -g grunt-cli  (把安装完后的grunt指令添加到 path里 C:\Users\xxx\AppData\Roaming\npm)
                        npm install grunt-contrib-uglify  安装uglify 
                        npm install  grunt-contrib-cssmin  安装cssmin
                        npm install  grunt-contrib-qunit  安装cssmin
                        npm install  grunt-contrib-concat 安装cssmin
                        npm install  grunt-contrib-clean  安装cssmin

         安装完成后,进入目录,执行  grunt命令,开始自动构建,构建代码后的代码放在 assets 目录下
</pre>

## Copyright

© 2012 - 2015 leo(cwq0312@163.com)  版权所有 , 遵从BSD开源协议


