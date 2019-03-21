class Observer {
  // 用来定义 Observer 的入口方法
  // 数据劫持的入口
  static observe(data){
    if(typeof data !== "object") return;
    Observer.defineReactive(data);
  }

  // 执行定义的方法
  static defineReactive(data){
    // 每处理一组属性
    // 就创建一个发布对象（Dep）
    const dep = new Dep();
    Object.keys(data).forEach(attr => {
      // 这里就是一个闭包，有多少个层次的属性，就会创建多少闭包
      let value = data[attr];
      // 初始化进行递归监听
      // 处理初始化 data  的时候，嵌套属性的问题
      // 如果不进行这一步处理，初始化数据不会被更新
      Observer.observe(value);
      Object.defineProperty(data,attr,{
        get(){
          // 获取的时候，添加订阅
          // 订阅对象放在 Dep 的 target 上，每个指令对应着一个 Watcher
          // 订阅对象也就是  Watcher
          Dep.target && dep.addSub(Dep.target);
          return value;
        },
        set(newValue){
          // 如果两个 value 相同，则不做处理
          if(value === newValue) return;
          value = newValue;
          // 递归对新的属性进行绑定监听
          // 对于嵌套的属性，如 { a:{ b:{ c:1 }}}
          // 在设置嵌套属性的时候，也需要进行监听
          Observer.observe(newValue)
          // 发生变化之后，发布消息
          dep.notify();
        }
      })
    })
  }
}