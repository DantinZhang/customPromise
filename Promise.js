function Promise(executer) {
    this.PromiseState = 'pending';
    this.PromiseResult = undefined;
    //参数executer是一个立即调用的函数
    //且该函数还接收两个参数，分别是两个函数
    const success = (data) => {
        //这是resolve对应的回调
        //1.改变对象的状态：pending=>resolved
        this.PromiseState = 'resolved';
        //2.改变对象的结果值
        this.PromiseResult = data;
    }

    const fail = (data) => {
        //这是reject对应的回调
        //1.改变对象的状态：pending=>resolved
        this.PromiseState = 'rejected';
        //2.改变对象的结果值
        this.PromiseResult = data;
    }

    executer(success, fail);
}

//1.then方法的封装
Promise.prototype.then = function (onResolved, onRejected) {

}