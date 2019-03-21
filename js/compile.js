class Compile {
  constructor($el,vm){
    this.$el = $el;
    this.vm = vm;
    // 构造文档片段，将 $el 上的子节点都添加到文档判断中去
    // 以进行指令的分析
    this.frag = document.createDocumentFragment();
    this.copyNodesToFragment();
  }
  copyNodesToFragment(){
    let child = null;
    while(child = this.$el.firstChild){
      this.frag.appendChild(child);
    }
    // 节点移动后，这里就对 frag 进行处理，然后再将文档判断添加到 $el 上
    this.compile([...this.frag.childNodes]);
    this.$el.appendChild(this.frag);
  }
  compile(nodes){
    nodes.forEach(node => {
      // 这里处理节点
      // 节点的类型：文本节点（应用模板引擎），元素节点：应用指令
      // 针对文本节点
      const reg = /\{\{(.*)\}\}/ig;
      const originTextContent = node.textContent;
      if(node.nodeType === 3 && reg.test(originTextContent)){
        // 根据模板的 key 获取 value
        const value = getValue(this.vm,RegExp.$1);
        // 缓存原始的 textContent
        // 使用新的值替换文本节点
        node.textContent = originTextContent.replace(reg,value);
        // 在编译节点的时候，每个指令都对应着一个 Watcher
        // 将新的 value 值作为参数传入回调
        // 编译完成之后，就添加一个订阅
        // 对于完整版的，有很多功能去做，比如节点销毁后，移除订阅
        // 对于属性的多种处理等
        new Watcher(this.vm,RegExp.$1,(newValue) => {
          // 如果这样处理，节点内容不能更新，因为 node.textContent 已经被替换掉了
          // 所以这里调用 replace  方法，根本无法进行替换，因此需要进行缓存 
          // node.textContent = node.textContent.replace(reg,newValue);
          node.textContent = originTextContent.replace(reg,newValue);
        });
      }
      // 处理元素节点
      if(node.nodeType === 1){
        const attributes = [...node.attributes];
        // 循环属性进行处理
        attributes.forEach(attr => {
          // 取出属性名和属性值
          const attrName = attr.name;
          const attrValue = attr.value;
          const initialValue = this.vm[attrValue];
          // 处理 v-model
          if(attrName === "v-model"){
            // 设置初始值
            node.value = initialValue;
            node.addEventListener("input",(e) => {
              // 取出 input 中的值
              const inputValue = e.target.value;
              // 更新数据源 ，此时还没有对 DOM 进行驱动
              // 只完成了 V-M 方向，但是没有完成 M-V 方向
              this.vm[attrValue] = inputValue;
            });
            // M-V 方向，应该在 Observer 中，调用  setter 的时候调用
            // 每个指令都需要一个 Watcher
            // Watcher 的作用是更新视图，这里的 Watcher 是用来在数据变化后
            // 更新 input 输入框的值
            new Watcher(this.vm,attrValue,(newValue) => {
              node.value = newValue;
            })
          }
        })
      }
      
      // 处理有子节点的情况
      if(node.childNodes){
        this.compile([...node.childNodes]);
      }
    });
  }
}