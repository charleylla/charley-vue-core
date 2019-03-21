class Vue {
  // 构造方法
  constructor(options = {}){
    const { el,data,computed } = options;
    this.$el = document.querySelector(el);
    this.$data = data;
    this.$computed = computed;
    Observer.observe(data);
    // 设置代理，访问当前实例的时候，去 $data 上面找
    this.setProxy();
    // 设置计算属性
    this.setComputed();
    // 设置完数据劫持后，就去编译模板
    new Compile(this.$el,this);
  }
  setProxy(){
    Object.keys(this.$data).forEach(attr => {
      // 代理仍然是通过 getter 和 setter 定义
      Object.defineProperty(this,attr,{
        get(){
          return this.$data[attr]
        },
        set(newValue){
          this.$data[attr] = newValue;
        }
      })
    })
  }
  setComputed(){
    Object.keys(this.$computed).forEach(attr => {
      const value = this.$computed[attr];
      let fn = value;
      if(typeof value !== "function"){
        fn = value.get;
        if(!fn){
          throw new Error(`You Must Provide 'get' method of computed attr ${attr}`)
        }
      }
      // const fn = this.$computed[attr];
      // 定义属性
      // 所有的响应式属性定义，都需要使用 Object.defineProperty
      // 这里定义在 $data 上面 ，会导致 undefined，为啥？
      // 但是此时 $data 上面已经有值的
      Object.defineProperty(this,attr,{
        get:fn,
        // 计算属性是方便计算的，这里就不处理 setter 了
        // set(){ }
      })
    })
  }
}