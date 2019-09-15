---
layout: post
title:  "记一次面试题"
date:   2019-09-12
categories: 

---

## 一面

1. 算法题区间重叠和区间合并（动态规划法和非动态规划法的实现）
 - 简单题目引入，给定两个时间区间，实现一个check函数，判断两个时间区间是否相交。
 
 ```js

    const firstTimeInterval = {
        start: 1,
        end: 4
    }

    const secondTimeInterval =  {
        start: 2,
        end: 6
    }

    const check = (list) {

    }

    check([firstTimeInterval, secondTimeInterval])

 ```
这个题其实很简单，因为当时给的测试用例是时间线顺序的，就想的比较简单了，只要找出第一个时间区间的end和第二个时间区间的start求最大值，如果最大值是是第一个end就相交。事实上这两个时间区间是非顺序的，就遗忘一种情况。所以这个比较简单的实现就有两种实现了，简单来说第一种要相对好点。

```js
// 方法1 
check(list) {
    list = list.sort((a, b) => a.start - b.start);
    const end = list[0]['end'];
    const start = list[1]['start'];
    const max = Math.max.call(null, end, start)
    if(max === end) {
        return true;
    } else {
        return false;
    }
}

// 方法二
check(list) {
    list = list.sort((a, b) => a.start - b.start);
    const end1 = list[0]['end'],
        start1 = list[0]['start'],
        start2 = list[1]['start'],
        end2 = list[1]['start'];
    const max1 = Math.max.call(null, end1, start2);
    const max2 = Math.max.call(null, end2, start1);
    if(max1 === end1 || max2 === start2) {
        return true;
    } else {
        return false;
    }
}

```

- 接下来题目是，我这有很多个这个时间区间，然后需要把重叠的时间区间进行合并。
看到这个题目的时候我觉得可以用动态规划法去解决这个问题。只要找到最大的，相交即合并。
我给出的答案是如下写法：

```js

const merge = (list) => {
    const result = [], len = list.length;
    // 得到一个顺序的时间区间
    list = list.sort((a, b) => a.start - b.start);
    for(let i = len -1 ; i > 0; i--) {
        for (let j = 0; j < i; j++) {
            if(check([list[i], list[j]])) {
                result.push([list[i]['start'], list[j]['end']]);
                i = j;
            }
        }
    }
    return result;
}

```

面试官给的提示是可以通过在第一种的基础上比较相邻两个时间节点，其实这样写也是可以的，但是时间复杂度相对来说要高一些，不是很理想，我按照面试后的提示还是写了一个实现。这就不贴代码了。

```js
const check = (list) => {
    const result = [], len = list.length;
    // 得到一个顺序的时间区间
    list = list.sort((a, b) => a.start - b.start);
    for(let i = 0 ; i < len - 1; i++) {
        let tmp = []
        if (check(list[i], list[i+1])) {
            tmp = [{
                start: list[i].start,
                end: list[i].emd
            }]
            list[j] = tmp
        } else {
            result.push(list[i])
        }
    }
    return result;
}

```

2. 从m*n的方格中到最右下共有多少中走法（动态规划法）
这个面试题

3. webpack 每个loader的作用
 - style-loader和css-loader的用法和区别
 - url-loader
 - file-loader

4. css 样式优先级排序, 以及权重计算
  

5. var let const 的区别

6. null 和 undefined 的区别

7. 箭头函数和普通函数的区别

8. 高阶函数的输入和输出，以及用法, 高阶组件的使用。

## 二面

1. 节流函数
    - 在指定时间内只能允许调用一次
    ```js

    ```
    - 在指定时间内最多能执行n次
    - 衍生出的场景问题：降低查询频次， 在200毫秒内只能执行一次请求。控制渲染时序，后请求的必须在后渲染。

2. http 、https 和 http2的了解

3. 浏览器渲染原理及执行过程，以及一些性能优化方案。

4. vue双向绑定原理

5. 项目介绍，自己主导哪些项目。项目中遇到的难点有哪些？怎么解决的？

6. 夸夸自己，在项目中做的比较好的地方。

7. 为什么会从有出来找工作的想法？

8. 你有什么想问的？

后续面试等待更新。
