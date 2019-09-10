


//Promise/A+规范

const State = {
    pending: "pengding",
    resolving: "fulfilled",
    rejecting: "rejected"
}

const nextTick = (fn) => {

}

class Promise {
    constructor (resolver) {
        this._promiseStatus = "pending";
        this._rejectReason = "";
        this._resoleValue = "";
        if(typeof resolver !== 'function' && resolver !== undefined) {
            throw new Error();
        }
        const promise = this;
        const { resolve, reject } = this;
        this.resolve = function boundResolve (value) {
            return resolve.call(promise, value);
        }
        this.reject = function BoundReject (reason) {
            return reject.call(promise, reason);
        }
        try {
            resolver(this.resolve, this.reject)
        } catch (err) {
            this.reject(err);
        }
        
    }
    resolve (value) {
        if (this._promiseStatus === State.pending) {
            this._value = value;
            this._promiseStatus = State.resolving;
            nextTick(this._nextTickHandler.bind(this))
        }
        return this
    }
    reject (reason) {
        if (this._promiseStatus === State.pending) {
            this._rejectReason = value;
            this._promiseStatus = State.resolving;
            nextTick(this._nextTickHandler.bind(this))
        }
        return this
    }
    then (fn, err?) {
        const promise = new Promise();
        promise.fn = fn;
        promise.err = err;
        if(this._promiseStatus === State.resolving) {
            promise.resolve(this._resoleValue);
        } else if (this._promiseStatus === State.rejecting) {
            promise.reject(this._rejectReason);
        } else {
            this._next.push(promise);
        }
        return promise;
    }
    catch (err) {
        return this.then(null, err);
    }
    _nextTickHandler() {

    }
}

var p = new Promise((resolve, reject) => {

})

// promise/A+规范
//https://cloud.tencent.com/developer/article/1351114?from=10680

//实现一个promise
// https://cloud.tencent.com/developer/article/1402581