import React from 'react'
import ReactDOM from 'react-dom'
const rootElement = document.getElementById("root");

let x=undefined
function myUseState(initialValue) {
  let state=x===undefined?initialValue:x
  function setState(newState) {
    x = newState;
    render();
  }
  return [state, setState];
}

const render = () => ReactDOM.render(<App />, rootElement);

function App() {
  const [n, setN] = myUseState(0);
  return (
    <div className="App">
      <p>{n}</p>
      <p>
        <button onClick={() => setN(n + 1)}>+1</button>
      </p>
    </div>
  );
}

ReactDOM.render(<App />, rootElement);
