import React, { Component, useState } from 'react'

function App(){
  const [count,setCount]=useState(0)
  const [user,setUser]=useState({name:'libai',age:10})
  const add=()=>{
    setCount(count+1)
  }
  const minus=()=>{
    setCount(count-1)
  }
  const beOlder=()=>{
    setUser(
      {
        ...user,
        age:user.age+10
      }
    )
  }

  return(
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

export default App