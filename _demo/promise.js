


//Promise/A+规范

const State = {
    pending: "pengding",
    resolving: "resolving",
    rejecting: "rejecting",
    resolved: "fulfilled",
    rejected: "rejected",
}

function nextTick (func) {
    setTimeout(func)
}

class Promise {
    constructor (resolver) {
        this._promiseStatus = State.pending;
        this._rejectReason = ""; 
        this._resolveValue = "";
        this._fn = undefined;
        this._err = undefined;
        this._next = [];
        const promise = this;
        if (typeof resolver === 'function' && resolver !== undefined) {
            try {
                resolver(this.resolve.bind(promise), this.reject.bind(promise))
            } catch (err) {
                this.reject(err);
            }
        }
        
    }
    resolve (value) {
        if (this._promiseStatus === State.pending) {
            this._resolveValue = value;
            this._promiseStatus = State.resolving;
            nextTick(this._handleNextTick.bind(this))
        }
        return this
    }
    reject (reason) {
        if (this._promiseStatus === State.pending) {
            this._rejectReason = reason;
            this._promiseStatus = State.resolving;
            nextTick(this._handleNextTick.bind(this))
        }
        return this
    }
    then (fn, err) {
        const nextPromise = new Promise();
        nextPromise._fn = fn;
        nextPromise._err = err;
        if(this._promiseStatus === State.resolved) {
            nextPromise.resolve(this._resolveValue);
        } else if (this._promiseStatus === State.rejected) {
            nextPromise.reject(this._rejectReason);
        } else {
            this._next.push(nextPromise);
        }
        return nextPromise;
    }
    catch (err) {
        return this.then(null, err);
    }
    _handleNextTick() {
        try {
             // 赋值很重要，存储上一个promise的结果
            if (this._promiseStatus === State.resolving && typeof this._fn === 'function') {
                this._resolveValue = this._fn.call(this, this._resolveValue);
            } else if (this._promiseStatus === State.rejecting && typeof this._err === 'function') {
                this._resolveValue = this._fn.call(this, this._rejectReason);
            }
        } catch (e) {
            this._promiseStatus = State.rejecting;
        }
        if (this._resolveValue === this) {
            this.state = State.rejecting;
            this._rejectReason = new Error('next promise 指向 current promise');
            this._promiseStatus = ""
        }
        this._finishThisPromise()
    }
    // 结束当前promise，并且调用下个Promise
    _finishThisPromise() {
        if (this._promiseStatus === State.resolving) {
            this._promiseStatus = State.resolved;
            this._next.map((nextPromise) => {
                nextPromise.resolve(this._resolveValue);
            });
        } else if(this._promiseStatus === State.rejecting) {
            this._promiseStatus = State.rejected;
            this._next.map((nextPromise) => {
                nextPromise.reject(this._rejectReason);
            });
        }
    }
}

var p = new Promise((resolve, reject) => {
    resolve('hello promise')
})
p.then(data => {
    console.log(data);
    return "sssss"
}).then((s) => {
    console.log(s)
})




const curry = (fn, arg) => {
    let len = fn.length;
    arg = arg || [];
    return (...rest) => {
        arg = arg.concat(rest);
        if(arg.length > len) {
        return fn(...arg);
        } else {
        return curry(fn, arg)
        }
    }
}

Promise.prototype.all = function (all) {
    return new Promise((resolve, reject) => {
      if(!Array.isArray(all)) {
        throw "must array";
      }
      let len = all.length, count = 1, result = [];
      var curryResolve = curry(function resolveDone(result, allPromiseCount, donePromiseCount, index) {
        return function(value) {
          result[index] = value
          if(++count === len) {
            resolve(result);
          }
        }
      })
      var allresolve = curryResolve(result, len, count);
      for(let index = 0; index < len; index++) {
        if(all[index] instanceof Promise === false) {
            Promise.resolve(all[index]).then(allresolve(index), reject)
        } else{
            all[index].then(allresolve(index), reject);
        }
      }
    })
  }

// promise/A+规范
//https://cloud.tencent.com/developer/article/1351114?from=10680

//实现一个promise
// https://cloud.tencent.com/developer/article/1402581