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

#### demo4
>



#### useState
* useState 接受函数
```
const [user,setUser]=useState(()=>{name:'libai',age:12})
```
这么做的优点是只有在函数被执行时（即initialValue 生效时）才会计算 1+2。本质上是利用了"函数在 js引擎进行 赋值/声明 操作时不会被解析"特点。
```
a={age:1+1}
// 该赋值操作执行多次,每次1+1都被计算
```
```
a=()=>{{age:1+1}}
// 该赋值操作执行多次，但除非 a()，否则1+1永远不会被计算
```

#### setState
* setState 不可局部更新
```
// 只修改 obj 的 name,不起效果
setState({
    name:'libai'
})
```
* setSate(obj) 如果 obj 地址不变，那么 React 认为数据没有变化（即：必须重定向或深拷贝）
```
setState({
    ...user,
    name:'libai'
})
```
* 连续多次 setState，只有最后一次生效
```
  const add=()=>{
    setCount(count+1)
    setCount(count+10)
    setCount(count+100) // 只有这次生效，事实上只 render 一次
  }
``` 
* 如果要多次 setState，应该使用函数作为参数
```
  const add=()=>{
    setCount(x=>x+1)
    setCount(x=>x+10)
    setCount(x=>x+100) // 只有这次生效，事实上只 render 一次
  }
```