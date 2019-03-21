let uid = 0;
class Watcher {
  constructor(vm,reg,fn){
    // 注册 Watcher 对象
    // 和 Vue 的实例以及相应属性和更新方法进行绑定
    this.vm = vm;
    this.reg = reg;
    this.fn = fn;
    // 为每个 watcher 设置一个 uid
    // 这个  id 在批量更新的时候有用
    this.id = uid++;
    // 将当前的实例设置为 Dep 的 target 静态属性
    Dep.target = this;
    // 获取属性值
    // 在获取值的时候，会出发 data 上的 getter 方法
    // 在 getter 会进行当前 Watcher  的订阅
    // 利用了  JavaScript 的单线程特性
    this.value =  getValue(this.vm,this.reg);
    // 重置 target
    Dep.target = null;
  }
  update(){
    // // 有更新的时候（调用 setter），会触发 notify
    // // notify 会调用所有  watcher 的 update 方法
    // // 此时就将最新的 data 值，传给 fn
    // 这个调用移动到 cb 中去
    // this.value =  getValue(this.vm,this.reg);
    // this.fn(this.value);
    // 批量更新
    // 看是否有 batcher 实例
    if(!window._vue_batcher){
      window._vue_batcher = new Batcher();
    }
    // 将当前的订阅对象，推入 batcher 实例中
    // window._vue_batcher.push(this);

    // 这里我自己加的判断，看是否已经有这个id了，有的话就不推
    // 减少内存的耗用
    if(!window._vue_batcher.has[this.id]){
      window._vue_batcher.push(this);
    }
  }
  cb(){
    this.value =  getValue(this.vm,this.reg);
    this.fn(this.value)
  }
}