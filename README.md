
> 函数组件的 state:useState

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
    setCount(x=>x+100) // x+=(1+10+100)
  }
```
#### 在 useEffect 中，你无法在 setState 之后立即读取 state
```
useEffect(()=>{
    const [state,setState]=useState(0)
    setState(0)
    console.log(state) // 0
})
```

#### [我们无法在 mousemove 的回调函数中获取到 barScrollTop](https://stackoverflow.com/questions/55126487/function-not-correctly-reading-updated-state-from-react-hook-state) 
---
#### [getState() hook proposal](https://github.com/facebook/react/issues/14092)
> useState 的局限性：在 useEffect 的异步函数中，无法读取到 setState 后的 state 值。
```
const HooksComponent = () => {
    const [value, setValue] = useState({ val: 0 });

    useEffect(() => {
        setTimeout(() => setValue({ val: 10 }), 100)
        setTimeout(() => console.log('value: ', value.val), 200)
    }, []);
}
//console.log output: 0 instead of 10
```
> 有人提出可以用useRef来随时读取最新的state
```
// useUserList is a custom hook
function useUserList(initialUsers = []) {
  const [users, setUsers] = useState(initialUsers)
  const usersRef = useRef(users)

  return {
    users: usersRef,
    setUsers: function(mapper) {
      usersRef.current = mapper(usersRef.current)
      setUsers(mapper)
    },
  }
}

const UserList = () => {
  const { users, setUsers } = useUserList()
  // ...
}
```
---
#### [setCount会导致count每次都被重新声明](https://zhuanlan.zhihu.com/p/82589347)
* [codesandbox](https://codesandbox.io/s/105x531vkq)
* 例1
```
import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";

function Counter() {
  const [count, setCount] = useState(0);
  let num = 0;
  console.log(`render-num:${num}`);
  useEffect(() => {
    const id = setInterval(() => {
      // 通过 num 来给 count 提供值
      console.log(num);
      setCount(++num);
    }, 1000);
  }, []);

  return <h1>{count}</h1>;
}

const rootElement = document.getElementById("root");
ReactDOM.render(<Counter />, rootElement);

/**
 * const count=0
 * let num=0 // A1
 * id=setInterval(()=>{...},1000)
 * 
 * 1s到了，运行()=>{console.log(num);setCount(++num)} // 这里访问A1处的变量num
 * num=1 // A1处的变量num值变为1
 * const count=1
 * let num=0
 * 
 * 2s到了，运行()=>{console.log(num);setCount(++num)} // 这里访问A1处的变量num
 * num=2 // A1处的变量num值变为2
 * const count=2
 * let num=0
 * 
 * 3s到了，运行()=>{console.log(num);setCount(++num)} // 这里访问A1处的变量num
 * num=3 // A1处的变量num值变为3
 * const count=3
 * let num=0
 * ...
 */
```
---
* 例2
```
import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";

function Counter() {
  const [count, setCount] = useState(0);

  console.log(`${count} is count`);
  const [delay, setDelay] = useState(1000);

  useInterval(() => {
    // Your custom logic here
    console.log(`in callback, count is ${count}`);
    setCount(count + 1);
  }, delay);

  function handleDelayChange(e) {
    setDelay(Number(e.target.value));
  }

  return (
    <>
      <h1>{count}</h1>
      <input value={delay} onChange={handleDelayChange} />
    </>
  );
}

function useInterval(callback, delay) {
  // const savedCallback = useRef();

  // savedCallback.current = callback;

  // Remember the latest function.
  // useEffect(() => {
  //   savedCallback.current = callback;
  // }, [callback]);

  // Set up the interval.
  useEffect(() => {
    console.log("delay change");
    function tick() {
      callback();
    }
    if (delay !== null) {
      console.log("setId");
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

const rootElement = document.getElementById("root");
ReactDOM.render(<Counter />, rootElement);

/**
 * const count=0,callback 始终只能访问这个 count
 * 执行 useInterval
 * let callback=()=>{...};let delay=1000
 * function tick(){...}
 * id=setInterval(tick, delay);
 *
 * 1s到了，执行 tick
 * 执行 callback
 * 执行 setCount
 * const count=1
 * 执行 useInterval
 * let callback=()=>{...};let delay=1000
 * 
 * 2s到了，执行tick
 * 执行 callback
 * 执行 setCount
 * const count=1
 * 
 * 3s到了，执行tick
 * 执行 callback
 * 执行 setCount
 * const count=1
 * 
 * ...
 *
 */
```
---
* 例3
```
import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";

function Counter() {
  const [count, setCount] = useState(0);
  const [delay, setDelay] = useState(1000);

  useInterval(() => {
    // Your custom logic here
    setCount(count + 1);
  }, delay);

  function handleDelayChange(e) {
    setDelay(Number(e.target.value));
  }

  return (
    <>
      <h1>{count}</h1>
      <input value={delay} onChange={handleDelayChange} />
    </>
  );
}

function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest function.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

const rootElement = document.getElementById("root");
ReactDOM.render(<Counter />, rootElement);

/**
 * const count=0 // A1
 * 执行 useInterval
 * let callback=()=>{...};let delay=1000
 * savedCallback.current = callback; // 这里的 savedCallback.current 能接触到 A1 处的变量 count
 * function tick(){...}
 * id=setInterval(tick, delay);
 *
 * 1s到了，执行 tick
 * 执行 savedCallback.current
 * 执行 setCount
 * const count=1 // A2
 * 执行 useInterval
 * let callback=()=>{...};let delay=1000
 * savedCallback.current = callback;// 这里的 savedCallback.current 能接触到 A2 处的变量 count
 *
 * 2s到了，执行tick
 * 执行 savedCallback.current // 
 * 执行 setCount
 * const count=2 // A3
 * 执行 useInterval
 * let callback=()=>{...};let delay=1000
 * savedCallback.current = callback;// 这里的 savedCallback.current 能接触到 A3 处的变量 count
 * ...
 * 
 */

```
#### [setCount(c => c + 1) can always read fresh state for that variable](https://overreacted.io/making-setinterval-declarative-with-react-hooks/)
> But this doesn’t help you read the fresh props, for example.
* [bug：count总是1](https://codesandbox.io/s/jj0mk6y683?file=/src/index.js) 
```
import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";

function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let id = setInterval(() => {
      setCount(count + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return <h1>{count}</h1>;
}

const rootElement = document.getElementById("root");
ReactDOM.render(<Counter />, rootElement);

/**
 * const count=0 // A1
 * 执行 useEffect
 * id=setInterval(()=>{...},1000) // 假设 ()=>{...} 是F1
 * 执行 setInterval(()=>{...},1000) // 执行 F1
 *
 * 1s到了，执行()=>{setCOunt(count+1)}
 * 执行 setCount // 这里访问的是A1处的count
 * const count=1
 *
 * 2s到了，执行()=>{setCOunt(count+1)} // 执行 F1
 * 执行 setCount // 这里访问的是A1处的count
 * const count=1
 *
 * ...
 */

```
解决方法就是把 setCount(count + 1) 改成 setCount(count=>count + 1)
> Another fix is to useReducer(). This approach gives you more flexibility. Inside the reducer, you have the access both to current state and fresh props. The dispatch function itself never changes so you can pump data into it from any closure. One limitation of useReducer() is that you can’t yet emit side effects in it. (However, you could return new state — triggering some effect.)
---
#### useState 接受函数的好处
* [参考](https://reactjs.org/docs/hooks-faq.html#how-to-create-expensive-objects-lazily)
> 若 useState 的第二个参数为函数，则该函数只在第一次 render 时执行

#### 每次 render,都会执行5次createId
```
const useTags = () => {

    const [tags, setTags] = useState<Tag []>([
            {id: createId(), name: '衣'},
            {id: createId(), name: '食'},
            {id: createId(), name: '住'},
            {id: createId(), name: '行'},
        ])
}
```
* 解决方法1. 改用函数
```
const useTags = () => {

    const getInitialValue=()=>{
        console.log('getInitialValue execute');
        return [
            {id: createId(), name: '衣'},
            {id: createId(), name: '食'},
            {id: createId(), name: '住'},
            {id: createId(), name: '行'},
        ]
    }

    const [tags, setTags] = useState<Tag []>(getInitialValue)
```
等效于
```
const useTags = () => {
    const [tags, setTags] = useState<Tag []>(()=>{
        console.log('getInitialValue execute');
        return [
            {id: createId(), name: '衣'},
            {id: createId(), name: '食'},
            {id: createId(), name: '住'},
            {id: createId(), name: '行'},
        ]
    })
}
```
> 但是当我们有两个页面（组件）都用到 useTags 的话，由于两个组件都会在第一次render时执行useState的第二个参数，所以createdId还是会被重复执行。详见[]()，此时唯一的解决方法就是下面那样，把初始值用一个变量保存，放在hooks外。ES6的模块机制会保证被引用方法所在文件只执行一次（[详见这里](https://github.com/Hanqing1996/JavaScript-advance/blob/master/%E5%85%B6%E5%AE%831/README.md#export)），从而保证了hook外的变量赋值不会重复进行。
* 解决方法2. 改用hooks外的变量
```
const initialValue= [
    {id: createId(), name: '衣'},
    {id: createId(), name: '食'},
    {id: createId(), name: '住'},
    {id: createId(), name: '行'},
]
const useTags = () => {
    const [tags, setTags] = useState<Tag []>(initialValue)
}
```
---
#### 糟糕的写法
```
// EditTag.tsx，根据用户对tagList的选择(Id)渲染页面

const EditTag = () => {

    const [tagId] = useState(Number(useParams<{ tagId: string }>().tagId))
}
```

这种写法的糟糕之处在于，tagId其实是不变的，不需要 EditTag 组件进行任何维护，这有悖于useState的意义（用 useMemo 也不对，因为tagId 重新 render 时的计算代价并不高；EditTag 既不是引用类型，也没有子组件）。应该直接写成下面这样
```
const EditTag = () => {

    const [tagId] = Number(useParams<{ tagId: string }>().tagId)
}
```
---
#### 组件维护的 state 应该越少越好，其余变量用作根据 state 渲染视图
* 糟糕的写法：组件需要维护 value 这个 state
> 在 value 这个 state 变化后，tag.name 随之变化
```
const EditTag = () => {

    const tagId = Number(useParams<{ tagId: string }>().tagId)
    const {updateTag} = useTags()
    const tag = findTag(tagId)
    const {value, onUpdateValue} = useValue(tag.name)

    useEffect(() => {
        updateTag(tagId, {...tag, name: value})
    }, [value])

    return (
        <Layout>
            <Edit className='edit' value={value} fieldName="标签名" placeholder="请在这里输入标签名" onUpdateValue={onUpdateValue}/>
        </Layout>
       )
    )
}
```
* 改进的写法：组件不需要维护 value
> 改变 value 时，直接更新 tag.name。value 始终只用于 tag.name 的渲染
```

const EditTag = () => {

    const tagId = Number(useParams<{ tagId: string }>().tagId)
    const {updateTag} = useTags()
    const tag = findTag(tagId)

    return (
            <Layout>
                <Edit className='edit' value={tag.name} fieldName="标签名" placeholder="请在这里输入标签名" onUpdateValue={
                    (value) => {
                        updateTag(tagId, {...tag, name: value})
                    }
                }/>
            </Layout>
        )
    )
}
```
---
#### setState 的参数如果是数组或对象
* bug
以下的 setTags 不奏效，即 tags 不会更新。因为 copy 是 tags 的浅拷贝，setTags 察觉到参数的引用与之前的tags相同，则不会去改动 tags
```
const deleteTag = (targetId: number) => {

    const copy = tags
    const idList = copy.map((tag: Tag) => tag.id)
    const targetIndex = idList.indexOf(targetId)
    copy.splice(targetIndex, 1)
    setTags(copy)
}
```
* 解决方法：改用深拷贝
```
const deleteTag = (targetId: number) => {

    const copy = JSON.parse(JSON.stringify(tags))
    const idList = copy.map((tag: Tag) => tag.id)
    const targetIndex = idList.indexOf(targetId)
    copy.splice(targetIndex, 1)
    setTags(copy)
}
```
---
#### useState 的 initialValue 为什么要放在 useEffect(()=>{},[]) 的回调函数内
* 不放在 useEffect 回调函数里面
```
const initialValue = JSON.parse(window.localStorage.getItem('tags') || '[]')

const useTags = () => {
    const [tags, setTags] = useState<Tag []>(initialValue)
}
```
> 假如有A,B两个组件都用到了 useTags 这个自定义hook。当A更新了 tags,然后我们由A所在页面切换到B,我们将发现B所在页面没有更新，因为 tags 的依然会被初始为 initialValue
* 解决方法：放在 useEffect 回调函数里面
```

const useTags = () => {
    const [tags, setTags] = useState<Tag []>([])

    useEffect(() => {
        setTags(JSON.parse(window.localStorage.getItem('tags') || '[]'))
    }, [])
}
```
> 这样做的意义在于，当A更新了 tags,然后我们由A所在页面切换到B,useEffect会被触发，tags 的初始值




