import React from 'react';
import { useState } from 'react';
import { set, getOrSet, get } from '@ah7255703/localstoragemanager';

const getTimeNow = () => {
  const date = Date.now()
  return date
}

function Todo({ complete, text, index, markDone, deleteTodo }) {
  const [checked, setChecked] = useState(complete)
  return <div className="todo">

    <input type="checkbox" defaultChecked={checked} onChange={e => { markDone(index) }} />
    <p style={{ textDecoration: checked ? 'line-through' : 'none' }}>{text}</p>
    <div>
      <button className="remove" onClick={() => { deleteTodo(index) }}>
        REMOVE
      </button>
    </div>
  </div>
}




// add todo 
// delete todo
// 

function useMyState(initialValue, lsName) {
  const [val, setVal] = useState(initialValue);
  function update(val) {
    setVal(val)
    set(lsName, JSON.stringify(val))
  }
  return [val, update]
}


function App() {
  const [input, setInput] = useState('')
  function useTodo(initialValue = JSON.parse(get('Todos')) ? JSON.parse(get('Todos')) : []) {
    const [todos, setTodo] = useMyState(initialValue, 'Todos');
    function addTodo(todo) {
      setTodo([...todos, todo])
    }

    function markDone(todoIndex) {
      setTodo(
        [...todos, { ...todos[todoIndex], complete: !todos[todoIndex].complete }]
      )
      console.log(todos)
    }
    function deleteTodo(todoIndex) {
      const Todos = [...todos]
      Todos.splice(todoIndex, 1)
      setTodo([...Todos])
    }
    const sortedTodos = todos.sort((objA, objB) => Number(objA.date) - Number(objB.date))
    return [sortedTodos, addTodo, markDone, deleteTodo]
  }
  const [todos, addTodo, markDone, deleteTodo] = useTodo()
  return (
    <main>
      <div className='container'>
        <div className='input'>
          <input type="text" value={input} onChange={(e) => { setInput(e.target.value) }} />
          <button className="add" onClick={() => {
            addTodo({ text: input, date: getTimeNow(), complete: false })
          }}>ADD</button>
        </div>
        <div className="todos">
          <div className="body">
            {
              todos.length >= 1 ? todos.map(
                ({ complete, text }, index) => {
                  return <Todo complete={complete} index={index} markDone={markDone} deleteTodo={deleteTodo} key={index} text={text} />
                }
              ) : <p style={{ margin: '1rem auto' }}>There is no Todos</p>
            }
          </div>
          <div className="footer"></div>
        </div>
      </div>
    </main>
  )
}

export default App
