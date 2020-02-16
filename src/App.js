import React, { Component, useState } from 'react'

function App(){
  const [count,setCount]=useState(0)
  const add=()=>{
    setCount(count+1)
  }

  return(
    <div>
      <div>{count}</div>
      <div>
        <button onClick={add}>+1</button>
      </div>
    </div>
  )
}

export default App