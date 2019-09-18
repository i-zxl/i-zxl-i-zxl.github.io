---
layout: post
title:  "记一次面试题"
date:   2019-09-12
categories: 

---

每一次面试都是一次对自我的认识。认真对待每次面试，不断沉淀，提升自我。在每次面试被虐的体无完肤，千疮百孔，但也标志着这次面试最成功。

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

面试官给的提示是可以通过在第一种的基础上比较相邻两个时间节点，其实这样写也是可以的，我按照面试官给的提示写了另外一种实现。

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

2. 从m*n的方格中到最右下共有多少中走法？
这个面试题当时没有写出来，自己回来学习了一下。

3. webpack 每个loader的作用
 - style-loader和css-loader的用法和区别
 - url-loader
 - file-loader

4. css 样式优先级排序, 以及权重计算
  
5. var let const 的区别


6. null 和 undefined 的区别


7. 箭头函数和普通函数的区别


8. 高阶函数的输入和输出，以及用法, 高阶组件的使用。
高阶函数必须满足一种两者条件中的一种： 一是接受函数作为参数。二是返回值是一个函数。
高阶组件的概念是接收一个组件作为参数，并返回一个新的组件。由于自己使用的是vue, vue使用mixin的方式组合组件，写高阶组件就相对来说要少。
但是react中高阶组件还是比较常见的。
函数科里化：接受多个参数的函数变换成接受一个单一参数（最初函数的第一个参数）的函数，并且返回接受余下的参数而且返回结果的新函数的技术

9. 正向代理、反向代理和负载均衡


## 二面

1. 节流函数
    - 在指定时间内只能允许调用一次。这跟一面一样，先来抛砖引玉，后边加点难度再进入正题。

    ```js

    const log = () => {
        console.log('hello world');
    }

    const throttle = (fn, delay) => {
        let status = "pendding", timer = null;
        return (...args) => {
            if(start === "pedding") {
                start = "doing"
                timer = setTimeout(() => {
                    fn(args)
                    status = "pendding"
                    clearTimeout(timer)
                }, delay)
            }
            
        }
    }

    const tr = throttle(log, 1000)
    tr()
    tr()
    tr()
    tr()
    tr()
    tr()
    tr()

    ```
    这个题我当时写的答案是如下，定义一个标记状态，如果是处于这个状态当中，则不予执行。

    ```js
        const throttle = (fn, delay) => {
            let status = "pendding", timer = null;
            return (...args) => {
                if(status === "pedding") {
                    status = "doing"
                    timer = setTimeout(() => {
                        fn(args)
                        status = "pendding"
                        clearTimeout(timer)
                    }, delay)
                }
                
            }
        }
    ```

    通过这个题还可以衍生出另一道题目：我只执行最后一次的执行结果。
    我们把上边的结果改改就行

    ```js

        const throttle = (fn, delay) => {
            let timer = null;
            return (...args) => {
                clearTimeout(timer)
                timer = setTimeout(() => {
                    fn(args)
                }, delay)
            }
        }

    ```

    - 在指定时间内最多能执行n次。这个当时想的是引入时间变量和计数器。但是没想好时间节点怎么控制。
    
    ```js

    const throttle = (fn, delay, max) => {
        let timer = 0, num = 0;
        setTimeout(() => {
            timer = delay;
            num = 1
        }, delay)
        return (...args) => {
            if(num < max && timer < delay) {
                fn(...args)
                num++ 
            }
        }
    }

    ```

    - 衍生出的场景问题：降低查询频次， 在200毫秒内只能执行一次请求。控制渲染时序，后请求的必须在后渲染。

    ```js

    onInputChange((keyworld) => {
        search(keyworld, (list) => {
            render(list)
        })
    })

    ```

    这种场景在我们开发过程当中是十分常见的场景，不仅能够降低我们在查询时候因为input输入造成频繁请求资源浪费的问题，而且能够降低因为网络或者接口原因导致页面渲染错误概率。
    
    ```js
        // 针对题目中的调用方式我们可以简单改改，
        const currentRequestId = 0;
        const throttle = (delay) => {
            let status = "pendding", timer = null;
            return (keyword) => {
                return new Promise((resolve, reject) => {
                    if(status === "pedding") {
                        status = "doing"
                        timer = setTimeout(() => {
                            resolve({
                                requestId: Date.now(),
                                val: keyword
                            })
                            status = "pendding"
                            clearTimeout(timer)
                        }, delay)
                    } else {
                        reject("no effect");
                    }
                })
               
            }
           
        }
        const search = (params) => {
            return axios.post('xxxxxx', {
                data: value.val
            }).then(response => {
                let data = {
                    list: response.list,
                    requestId: value.requestId
                }
                return data;
            })
        }

        const render = (data) => {
            if(data.requestId > currentRequestId) {
                currentRequestId = data.requestId;
                doRender(data);
            }
        }

        onInputChange() {
            const tr = undefined
            if(!tr) {
                tr = throttle(200);
            }
            tr(this.keyworld)
            .then(search)
            .then(render)
            .catch(err => {

            })
        }
        
    ```

    

2. http 、https 和 http2的了解

3. 浏览器渲染原理及执行过程，以及一些性能优化方案。

4. vue双向绑定原理

5. 项目介绍，自己主导哪些项目。项目中遇到的难点有哪些？怎么解决的？

6. 夸夸自己，在项目中做的比较好的地方。

7. 为什么会从有出来找工作的想法？

8. 你有什么想问的？

后续面试等待更新。

