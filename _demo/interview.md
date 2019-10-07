1、判断一个变量是数组的方法，判断数据类型的方法有哪些

- typeof: 检查常用数据类型, 无法检查是不是数组
  typeof null === 'object'
  typeof '' === 'string'
  typeof () => {}  === 'function'
  typeof 1 === number
  typeof undefined === undefined
  typeof [] === 'object'

- instanceof： 检查左边对象与右边对象是否在同一条原型链上。
了解几个概念：
继承原则：js继承的机制是原型继承，继承的起点是对象的原型（Object.prototype）；
protorype: 原型对象。
__proto__: 原型链指针，指向原型对象的原型： o.__proto__ === O.prototype。

constructor: 每个构造函数都包涵一个指向构造函数的指针。即constructor

```js

  function Foo() {};
  var foo = new Foo();
  foo.__proto__ === Foo.prototype; // true
  foo.__proto__.constructor === Foo; //true

  // 实现instanceof方法, instanceof 比较两个对象的原型链是不是在一条原型链上
  function instance_of(c, o) {
    let oPrototype = o.prototype，
        cProto = c.__proto__;
    while(true) {
      // 原型链顶端
      if(cProto === null) {
        return false;
      }
      if(cProto === oPrototype) {
        return true
      } else {
        cProto = cProto.__proto__;
      }
    }  
  }

  // 判断数组
  [].__proto__.constructor === Array

```
instanceof 和 constructor 局限性在于 iframe 中执行环境的上下文对象是不共用的，存在判断漏洞。

- Object.prototype.toString.call([]) === "[object Array]"

2、数组操作哪些方法会返回新数组哪些会改变原来

会改变原数组的函数：
push: 在原数组末尾添加数据，并返回最后一位push值。
pop: 取出原数组中的最后一位数值，并返回数值。
shift: 取出数据数组中首位元素的值，并返回该值。
unshift: 在数组首插入元素， 并返回数组的长度。
reverse: 数组元素翻转，会改变原数组。
sort: 在原数组中进行排序。
splice(start,删除的个数，插入的元素): 在指定位置删除指定个数量的个数，并添加指定数据。

不会更改数组：
concat: 拼接多个数组，返回新的数组
map: 将数组内的每一项都给函数，返回函数调用加工后的结果，并组成新的数组。
join: 将数组每个元素按照字符进行指定规则拼接，默认按照逗号拼接。
slice(start, end): 切取指定区间内的数组元素，并返回新的数组。
indexOf: 找到对应值的在数组中的索引
every: 每一项都返回true，则返回true。
some: 存在一项为true, 则返回true。
forEach: 对数组的每一项运行给定函数，该方法没有返回值。
filter: 对数组中的每一项运行指定函数，返回满足函数的元素，并将返回的结果组成新的数组。
reduce: 将数组内的每一项都给函数，返回函数调用加工后的结果。
includes: 判断数组中是否包含某个元素， 返回boolean。

3、求两个数组的并集，差集，补集（提示，使用集合）

4、正则表达式

请从2019-03-06T21:01:13 Tencent/Beijing提取出结果["2019","03","06","21","01","13"]

```js

var str = "2019-03-06T21:01:13 Tencent/Beijing"
str.match(/\d+/g) //["2019","03","06","21","01","13"]

```

\d: 匹配数字
[a-zA-Z]: 匹配字符
+: 重复一次或者多次
?: 重复0次或1次
*：重复匹配0，多次

前瞻、后顾、负前瞻、负后顾

```js

// 前瞻：
exp1(?=exp2)  // 查找exp2前面的exp1
// 后顾：
(?<=exp2)exp1 // 查找exp2后面的exp1
// 负前瞻：
exp1(?!exp2)  // 查找后面不是exp2的exp1
// 负后顾：
(?<!exp2)exp1 // 查找前面不是exp2的exp1

```

写一个函数实现千位分隔符

```js

const thousandBit = value => value.replace(/(\d)(?=\d{3}+\.)/g, '$1,')

```

5、打平多维数组arr并实现去重，var arr = [ [ 1, '2', 3], [4, 2, 12], [0, 3, 8] ]

```js

function toArray(order, result = []) {
  order.forEach(o => {
    if(Array.isArray(o)) {
      result = toArray(o, result);
    } else {
      if(result.includes(o) === false) {
        result.push(o)
      }
    }
  })
  return result;
}

var list = toArray([ [ 1, '2', 3], [4, 2, [1,2,55, [66,77,99]]], [0, 3, 8] ])

```

6、函数节流应用场景和原理，为onresize事件实现节流
应用场景：
onscoll
onresize

window.onresize = function(){

throttle(); //参数自行添加

}

7、深浅复制有什么区别？ 如何实现Object的深复制（无需考虑JSON对象合法性）？ ES6中的扩展运算符和Object.assign分别属于深复制还是浅复制

8、目前 JS 对于异步的解决方案有哪些， 如何实现依赖多个异步返回（实现一个函数获取由多个数据源组成的表格数据，要求其中即使有一次或多次失败并不会阻塞其它请求）

9、下面这个段代码执行会有问题吗？如果没有问题控制台打印出的结果是什么？

let CarBuild=()=>{

console.log('生成一个小汽车')

}

console.log(new CarBuild())

10、call, apply, bind的区别，实现bind的方法

11、重排和重绘的触发时机，有哪些css属性能触发GPU


前端工程化构建
git fetch和git pull的区别；git add 过程中误操作添加了不想提交的文件，怎么回退

更多有关git面试题：http://blog.jobbole.com/114297/

2、如何在 webpack 中引入未模块化的库，如 Zepto

3、对AMD和Commonjs的理解

4、模版解析思路和常见方法，vue怎么做template编译

5、webpack解析过程，从命令行运行npm run xxx 之后都发生了什么

6、前端Mock的常见解决方案

7、对require的理解，require.resolve() 方法是用来做什么的

前端架构，常见框架使用及理解
React
1、实现组件ListOfTenThings，提示使用children callback

2、函数式声明与class声明使用场景， 使用pureComponent的好处是什么

3、什么是高阶组件

4、适合使用refs的场景有哪些

5、将以下jsx代码部分改成js实现

ReactDOM.render (

 <SmartButton color="red" shadowSize={2}>Click Me </SmartButton>

)

6、下面代码有问题吗，如果有问题指出问题所在

import React from "react";

import ReactDOM from "react-dom";

const image =  <img src='http://img1.gtimg.com/13/1390/139050/13905006_980x1200_281.jpg' />

const Wrap = (props) => {

return  <p>{props.children} </p>

}

const imageRender = (needWrap) => {

return (

needWrap ?  <Wrap>{image} </Wrap> : { image }

)

}

//ReactDOM.render(imageRender(true), document.getElementById('root')); //会报错吗

ReactDOM.render(imageRender(), document.getElementById('root')); //会报错吗

7、性能优化常见方法

https://juejin.im/post/5ac34810f265da23870f0748

Vue
1、vue-router导航钩子有哪些及其使用场景

2、改变状态（数据源）的方式有哪些

3、页面首次加载会触发哪几个钩子？ 哪些钩子在服务器端渲染期间会出现？ loading事件，发送请求分别应该在哪个周期实现

4、设计一个前端实现登录拦截的方案

vue-router router.beforeEach((to, from, next)

axios的http拦截器

axios.interceptors.request.use

axios.interceptors.response.use

https://github.com/superman66/vue-axios-github

组件设计
1、如何实现代码或组件复用，如何实现继承

2、编码实现组件可伸缩菜单ToggleMenu，支持两级展开，菜单项配置json结构可自行设计，可以用React，vue或原生js，样式部分不需要考虑

￼

3、编码实现发布者-订阅者模式

var PubSub = function(){

//请补全代码

}

var event = new PubSub;

event.subscribe('Message', function(msg) { console.log(msg); });

event.publish('Message', {data: ['foo,', 'bar']});

中后台Node，后端服务开发涉猎
1、能大概讲一下nginx的一些常规配置么

2、linux常用命令：查看内存／硬盘使用情况，解压压缩等

3、内存溢出一般是哪些原因导致，有哪些分析方法，如何获取内存快照

4、相比 Express 谈谈 Koa 中间件模型的优势, context对象

5、node进程管理，开启一个子进程来执行其他的程序使用什么方法，有什么区别和使用场景

https://juejin.im/entry/595dc35b51882568d00a97ab

6、node服务关注哪些性能指标，压测的常用方法或工具，结合实践经验谈谈你是如何分析找出性能瓶颈及优化措施

https://juejin.im/post/5b827cbbe51d4538c021f2da

7、单进程，单线程解决方案－－－提升服务可扩展性：

Ngnix反向代理，负载均衡，开多个进程，绑定多个端口；（多台机器的水平扩展）

http://marklin-blog.logdown.com/posts/2050778

开多个进程监听同一个端口，使用cluster模块；（同一台机器的垂直扩展）

http://marklin-blog.logdown.com/posts/2046547-scalability-of-node-using-cluster

二者结合，单服务器使用cluster，再使用nginx反向代理做多台服务器上的负载均衡

8、其他node知识参考资料

https://github.com/ElemeFE/node-interview/tree/master/sections/zh-cn

移动端开发
1、hybrid和h5区别，与客户端如何交互，发版管理，性能优化

2、jsbridge常用方法，安卓和iOS的区别
