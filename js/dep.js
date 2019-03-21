class Dep {
  static target = null;
  subs = [];
  // 添加订阅
  addSub(sub){
    this.subs.push(sub);
  }
  // 发布消息
  // 这里规定，每个订阅对象都有一个 update  方法
  notify(){
    this.subs.forEach(sub => sub.update());
  }
}