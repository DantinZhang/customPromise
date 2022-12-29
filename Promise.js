function Promise(executer) {
    this.PromiseState = 'pending';//默认应该是等待
    this.PromiseResult = undefined;
    //定义一个属性来存放then函数的回调们
    this.callbacks = [];

    //参数executer是一个立即调用的函数
    //且该函数还接收两个参数，分别是两个函数
    const success = (data) => {
        //这是resolve对应的回调
        //状态改变后就不能再变，加个判断
        if (this.PromiseState !== 'pending') return;
        //1.改变对象的状态：pending=>resolved
        this.PromiseState = 'resolved';
        //2.改变对象的结果值
        this.PromiseResult = data;
        //3.如果是异步，要在以上步骤结束后，执行对应的回调
        // if(this.callback.onResolved){
        // this.callback.onResolved(data);
        // }
        if (this.callbacks.length != 0) {
            this.callbacks.forEach(item => {
                item.onResolved();
            })
        }
    }

    const fail = (data) => {
        //这是reject对应的回调
        //状态改变后就不能再变，加个判断
        if (this.PromiseState !== 'pending') return;
        //1.改变对象的状态：pending=>resolved
        this.PromiseState = 'rejected';
        //2.改变对象的结果值
        this.PromiseResult = data;
        //3.如果是异步，要在以上步骤结束后，执行对应的回调
        // if(this.callback.onRejected) {
        // this.callback.onRejected(data);
        // }
        if (this.callbacks.length != 0) {
            this.callbacks.forEach(item => {
                item.onRejected();
            })
        }
    }

    try {
        executer(success, fail);
    } catch (data) {
        //如果抛出错误，那么就执行下面的代码
        fail(data);
    }
}

//1.then方法的封装
Promise.prototype.then = function (onResolved, onRejected) {
    //执行then方法返回的还是Promise
    return new Promise((resolve, reject) => {
        //公共的改变返回Promise状态的方法封装起来
        let changeState = (name) => {
            try {
                const outcome = name(this.PromiseResult);
                //判断回调返回结果是否是Promise类型
                if (outcome instanceof Promise) {
                    //Promise类型的数据，返回状态要和它一致
                    outcome.then(res => {
                        //如果是成功的Promise，那一定会走这个回调
                        resolve(res);
                    }, err => {
                        //如果是失败的Promise，那一定会走这个回调
                        reject(err);
                    })
                } else {
                    //非Promise类型，返回成功的Promise
                    resolve(outcome);
                }
            } catch (e) {
                reject(e);
            }
        }
        //判断同步任务下走哪个回调
        if (this.PromiseState === 'resolved') {
            changeState(onResolved);
            //如果抛出错误,不用再另外写try-catch,封装时写过了
            //所以任何Promise实例执行器函数出现错误，都可以直接捕获
        }
        if (this.PromiseState === 'rejected') {
            changeState(onRejected);
        }
        //如果是异步任务（先指定回调再改变状态再执行回调）
        if (this.PromiseState === 'pending') {
            //把回调存到该实例的属性上
            // this.callback.onResolved = onResolved;
            // this.callback.onRejected = onRejected;
            this.callbacks.push({
                onResolved: () => {
                    changeState(onResolved);
                },
                onRejected: () => {
                    changeState(onRejected);
                }
            })
        }
    })
}