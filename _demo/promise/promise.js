
// 视频教程 https://www.bilibili.com/video/av55799629/?p=8
// 规范地址 https://www.ituring.com.cn/article/66566

class Promise {
  constructor (executor) {
    if ( typeof executor !== 'function') {
      return new TypeError(`${executor} is not function`);
    }
    // 初始化值
    this.init();
    const promise = this;
    try {
      executor(this.resolve.bind(promise), this.reject.bind(promise));
    } catch (error) {
      this.reject(error);
    }
  }
  init () {
    // 初始化值
    this.value = null;
    this.reason = null;
    this.onfulfilledCallbacks = [];
    this.onRejectedCallbacks = [];
    this.state = Promise.PENDDING;
  }
  resolve(value) {
    //成功之后的执行的操作，状态修改执行回调，只能执行一次，状态不可逆转
    if (this.state === Promise.PENDDING) {
      this.state = Promise.ONFULFILLED;
      this.value = value;
      this.onfulfilledCallbacks.forEach(fn => fn(this.value))
    }
  }
  reject (reason) {
    // 失败之后执行的操作，状态修改执行回调，只能执行一次，状态不可逆转
    if (this.state === Promise.PENDDING) {
      this.state = Promise.ONREJECTED;
      this.reason = reason;
      this.onRejectedCallbacks.forEach(fn => fn(this.reason));
    }
  }
  then(onFulfilled, onRejected) {
    // 实现链式调用必须返回新的promise实例
    // 如果 onFulfilled 不是函数，复写穿透数据
    if (typeof onFulfilled !== "function") {
      onFulfilled = (value) => {
        return value;
      }
    }
    if (typeof onRejected !== 'function') {
      onRejected = (reason) => {
        throw reason;
      }
    }

    const nextPromise = new Promise((resolve, reject) => {
      if (this.state === Promise.ONFULFILLED) {
        setTimeout(() => {
          try {
            const nextvalue = onFulfilled(this.value);
            resolve(nextvalue);
          } catch (error) {
            reject(error);
          }
        })
      }
      if (this.state === Promise.ONREJECTED) {
        setTimeout(() => {
          try {
            const nextvalue = onRejected(this.reason);
            resolve(nextvalue);
          } catch (error) {
            reject(error);
          }
        })
      }
      if (this.state === Promise.PENDDING) {
        this.onfulfilledCallbacks.push((value) => {
          setTimeout(() => {
            try {
              const nextvalue = onFulfilled(value);
              resolve(nextvalue)
            } catch (error) {
              reject(error);
            }
          })
        })
        this.onRejectedCallbacks.push((reason) => {
          setTimeout(() => {
            try {
              const nextValue = onFulfilled(reason)
              resolve()
            } catch (error) {
              
            }
            onFulfilled(reason)
          })
        })
      }
    })
  }
}

Promise.PENDDING = "pendding";
Promise.ONFULFILLED = "onfulfilled";
Promise.ONREJECTED = "onrejected";

Promise.resovlePromise = (nextPromise, x, resolve, reject) => {
  if (nextPromise === x) {
    reject(new TypeError('chaining cycle detected fro promise'))
  }
  let called = false;
  if (called) return ;
  if (x instanceof Promise) {
    // 判断x是否为Promise对象
    const then = x.then;
    try {
      then(value => {
        Promise.resovlePromise(nextPromise, x, resolve, reject);
      },
      reason => {
        reject(reason)
      })
      called = true;
    } catch (error) {
      reject(error)
      called = true;
    }
  }
  if(x !== null && (typeof x === 'object' || typeof x === 'function')) {
    try {
      const then = x.then;
      if (then === 'function') {
        try {
          called = true;
          then(value => {
            Promise.resovlePromise(nextPromise, x, resolve, reject);
          },
          reason => {
            reject(reason)
          })
        } catch (error) {
          called = true;
          reject(error)
        }
      } else {
        called = true;
        resolve(x);
      }
    } catch (error) {
      called = true;
      reject(error);
    }
  } else {
    called = true;
    resolve(x);
  }
}


module.exports = Promise

