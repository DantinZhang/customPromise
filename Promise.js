function Promise(executer) {
    this.PromiseState = 'pending';//默认应该是等待
    this.PromiseResult = undefined;
    //定义一个属性来存放then函数的回调
    this.callback = {};

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
        if(this.callback.onResolved){
            this.callback.onResolved(data);
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
        if(this.callback.onRejected) {
            this.callback.onRejected(data);
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
    //判断同步任务下走哪个回调
    if (this.PromiseState === 'resolved') {
        onResolved(this.PromiseResult);
    }
    if (this.PromiseState === 'rejected') {
        onRejected(this.PromiseResult);
    }
    //如果是异步任务（先指定回调再改变状态再执行回调）
    if (this.PromiseState === 'pending') {
        //把回调存到该实例的属性上
        this.callback.onResolved = onResolved;
        this.callback.onRejected = onRejected;
    }
}