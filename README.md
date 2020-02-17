#### counter-demo
useState 的简单示例

#### demo2
> 自己尝试实现 useState
* 关键点
1. state 不是在 setState 被调用后立即被改变的；
2. setState 会把 newState 放入 全局变量（相对于 myUseState）中，当 myUseState 再次执行时，才对 state 赋值

#### demo3
> 实现多个 useState
* 关键点
1. 每次 render 时，useState 的顺序必须是固定的
2. 每个组件都有自己的 muUseState,放在组件对应的 virtual DOM 上
* 整体过程
1. 每个函数组件对应一个 React 节点
2. 每个节点保存着 state 和 index 
3. useState:读取 state[index]
4. setState:修改 state[index],并触发 render