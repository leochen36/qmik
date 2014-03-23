增加1.2.23版本:1.增加高清屏的判断 Qmik.isRetinal, 2.修复部分文本添加会造成的bug

增加1.2.22版本, 1.优化并解决查询(closest)的bug

增加1.2.20版本, 1.优化了查询,大幅提升了查询的性能, 2.减小了核心版本的体积,合并后减小到20.7k了,gzip在8k左右. 3.增强了了fn.live委托事件的功能,ie测试最低从ie9开始 4.增加了一个滚动插件Qmik.fn.scrollBar.js 5.增加了一个前进后退插件Qmik.nav.js,Qmik.nav插件依赖核心sun功能

1.2.16版本 修复: 1.sun模块对部分浏览器加载的bug 2.getJSON 少传data参数造成的bug

Qmik是一个快速和精简的JavaScript库，简化了HTML文档，事件处理，以及Ajax交互。 Qmik.sun 就按需加载模块,轻松实现按需要加载相应的js,css文件 Qmik的语法与jquery是一致的,核心库大小16-23k左右,支持uc,ie>=9,基于webkit内核的浏览器(如chrom,safari等),firefox; 推荐做移动web开发.

API简介:


        encode(value) :等同于encodeURIComponent
        decode(value) :decodeURIComponent ,
        isBool(value) : 布尔判断,
        isString(value) : 字符串判断,
        isFun(value) : 方法判断,
        isFunction(value) : 方法判断,
        isNum(value) :整形判断 ,
        isNumber : 整形判断,
        isArray(value) : 数组判断,
        isNull(value) : 空指针判断,
        isRetinal() : 判断是否是高清屏,默认是高清屏
        likeArray(value) : 像数组,有length字段等一些属性,
        each(value,function(i,val){}) : 循环,
        stringify(value) : json转字符串,
        parseJSON(value) : 字符串转json,
        likeArray(value) : 像数组
        isDate(value) :,
        isObject(value) : ,
        isPlainObject(value) : 
        likeNull(value) : 像空值,如 "","null","undefined",null等会被认为True,
        inherit(subClass, superClass) : 继承类 子类subClass继承父类superClass的属性方法, 注:子类有父类的属性及方法时,不会被父类替换,
        trim(value) :,
        toLower(value) :字符串小写,
        toUpper(value) : 大写,

        merge(arr1,arr2) : merge,   // 合并数组或对象
        array(array) : //合并成一个新数组,
        inArray(value, array) : 在数组里的索引位,
        unique(array) : 数组去重,
        map(array, callback) : //对数组里的内容,全部做一次数据映射转换,
        getScript(url, success, error) :  取得脚本
        getCss(url, success, error) :  取得css
        grep(array,callback):过滤

        param :  抽取数组里面每个元素的name和value属性,转换成一个url形式(a=b&name=g)的字符串,有做encode
        now([date]) :   当前时间
        delay(fun, time,...)  延迟执行,类似setTimeout,返回一个对象,对象有个 stop方法,用于停止执行,...表示要传输的参数,如:$.delay(function(a1,a2){},1000,1,2);//1 对应 a1,2对应 a2
        // 
        /**
         * fun:执行的方法
         * cycleTime:执行的周期时间
         * ttl:过期时间,执行时间>ttl时,停止执行,单位 ms(毫秒)
         * ,...表示要传输的参数 $.cycle(function(a1,a2){},1000,30000,1,2);//1 对应 a1,2对应 a2
         */
        cycle(fun, cycleTime, ttl,...) :  周期执行,类似于setInterval,会返回一个对象,对象有个 stop方法,用于停止执行

        log(msg, event) : 打日志
        isIphone : 
        isAndroid :
        isWP : 
        isIE : 
        isFF : is Firefox
        isWK : is Webkit
        isOpera : 
        config(opts, _config) : 

        url(_url) : 合并url,if 参数 _url为空,则

        ajax:function({
            dataType:'json'|'text'|'jsonp',
            async:bool,
            type: 'get'|'post'
            success,function(data){},
            error:function(){}
        });
2.查询api:支持下面的查询格式


        $("#id") 
        $(".class")
        $("ul")
        $("#id .class")
        $("#id > .class")
        $(".class div[flag=aaa]")   
3.Qmik.fn api(即 $("#id").api)


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
        remove : function()
        before : function(c) 
        after : function(c)
        html : function(v)
        empty : function() 
        text : function(v) 
        addClass : function(n) 
        rmClass : function(n)  == removeClass
        show : function()
        hide : function() 
        toggle : function()
        toggleClass : function(className)
        map : function(callback)
        css : function(k, v) 
        attr : function(k, v) 
        rmAttr : function(k)    == removeAttr
        data : function(k, v) 
        rmData : function(k) == removeData
        val : function(v)

        next : function(selector) //下一个指定元素
        prev : function(selector) //上一个指定元素
        clone : function(bool) 
        hover : function(fin, fout) 
        hasClass : function(c) 
        closest : function(selector) //查找最近的匹配的父(祖父)节点
        parents : function(selector) 
        parent : function(selector) 
        children : function(selector)

        width:function();//宽度
        height:function()//高度
        offset:function() //return {top:xx,left:xx} 获取匹配元素在当前视口的相对偏移
        position:function() //return {top:xx,left:xx}获取匹配元素相对父元素的偏移
3.按需加载例子:

$.sun.use(["module1","module2"],function(module1,module2){}); $.sun.define(function(require, exports, module){}); $.sun.config();

a. Config.js 文件,写如下内容:



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


b.在index.html页面引入js<br/><br/>



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

            Q.sun.define(function(require, exports, module) {
                var nav = require("Nav");//依赖导航模块
                exports=new Home(nav);
            });
        })(Qmik);



 d.使用模块,在index.html使用 Home模块功能.  在index.html的尾部加入如下代码:



        <script type="text/javascript">
            // 界面初始化 
            (function($) {
                //依赖3个模块初始化
                $.sun.use([
                    "Nav", "Home"
                ], function(nav, home) {
                        nav.doxxx();//显示头部导航
                        home.showHome();//显示首页
                });
            })(Qmik);
        </script>
4.下载源码,自定义构建(构建时,只能选择src目录下的文件合并成一个Qmik.js,不能包含plugins等其它目录)

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