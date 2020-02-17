import React from 'react'
import ReactDOM from 'react-dom'
const rootElement = document.getElementById("root");

let middles = []

let sum = 0

function myUseState(initialValue) {

  let current=sum // current 是供 setState 访问的,注意 current 声明了多次

  if (sum === middles.length) {
    middles.push({
      data: undefined
    }
    )
  }

  let x = middles[current].data
  let state = x === undefined ? initialValue : x

  // setState 声明了多次，每次声明的 setState 可以访问该次声明的 state
  function setState(newState) {
    middles[current].data = newState // 这里不能用 middles[sum].data = newState,因为 middles 虽然可以访问到 sum,但是已经不是曾经的 sum 了。
    render();
  }
  sum++
  return [state, setState];
}

const render = () => {
  sum = 0 // 下面会重新执行一次 App(),导致 middles 再次增长。所以 sum 的重置必须放在 App() 执行之前
  ReactDOM.render(<App />, rootElement)
};

function App() {
  const [count, setCount] = myUseState(0);
  const [user, setUser] = myUseState({ name: 'libai', age: 10 })

  const add = () => {
    setCount(count + 1)
  }
  const minus = () => {
    setCount(count - 1)
  }
  const beOlder = () => {
    setUser(
      {
        ...user,
        age: user.age + 10
      }
    )
  }

  return (
    <div>
      <div>{count}</div>
      <div>
        <button onClick={add}>+1</button>
        <button onClick={minus}>-1</button>
      </div>
      <div>
        {user.name}-{user.age}
        <button onClick={beOlder}>
          be older
        </button>
      </div>
    </div>
  )
}

ReactDOM.render(<App />, rootElement);
