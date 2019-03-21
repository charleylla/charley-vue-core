class Batcher  {
  // 是否存在当前 id 的 watcher 待更新
  has = {};
  // 当前待更新的队列
  queue = [];
  // 是否处于等待状态
  waiting = false;
  // 重置队列等信息
  reset(){
    this.has = {};
    this.queue = [];
    this.waiting = false;
  }
  push(job){
    const { id } = job;
    // 如果队列中不存在当前更新任务，就加入到队列中
    if(!this.has[id]){
      this.queue.push(job);
      // 将标志位设置为 true
      this.has[id] = true;
      // 如果处于空闲状态，就更新
      if(!this.waiting){
        this.waiting = true;
        // 如果支持 Promise，就使用 Promise 微任务更新
        if(window.Promise){
          Promise.resolve().then(() => {
            this.flush()
          })
        }else{
          // 如果不存在，就用 setTimeout 红任务进行更新
          setTimeout(() => {
            this.flush()
          },0)
        }
      }
    }
  }
  // 执行更新的方法
  flush(){
    this.queue.forEach(job =>  {
      // 首页调用 10000 次，这里只会不会一直调用
      // 也就不会一直更新 DOM
      // 提升了性能
      // 采用批量更新后，对于多次设置属性值：vm.a = i
      // 每次设置会调用 notify
      // 每次 notify 会调用所有 watcher 的 update
      // watcher 的 update 中，将更新任务放到了 Batcher 中
      // batcher 在下一次事件循环中再进行更新
      // 这是同步的任务已经执行完了
      // 然后再执行真正的更新
      // 真正的更新，会在 data 中获取 a 的值，然后再调用
      // Watcher 的 fn（cb），这时候 DOM 的更新只会执行一次～
      // 提高了性能！
      console.log("🍎")
      // 这个 cb 就是之前的 update
      // 用来执行 DOM 的更新
      job.cb()
    })
    this.reset()
  }
}