import { useEffect, useState } from "react";
import { db } from './firebase';
import { set, ref, push, onValue, remove, update } from 'firebase/database';

function App() {
  const [todo, setTodo] = useState('')
  const [todos, setTodos] = useState([])
  const [todo2, setTodo2] = useState('')
  const [edit, setEdit] = useState(false)
  const [tempId, setTempId] = useState('');

  const handleChange = (e) => {
    setTodo(e.target.value)
  }

  //read
  useEffect(() => {
    const todoRef = ref(db, 'Todos');
    onValue(todoRef, (snapshot) => {
      setTodos([]) // ilk başta boşaltmazsak arrayi hep peşpeşe aynı şeyleri ekliyor
      const data = snapshot.val(); // data Todos objesini döndürür.
      // console.log(data);
      // console.log(Object.entries(data));

      if (data !== null) {
        Object.entries(data).map((todo) => setTodos((prev) => [
          ...prev,
          { id: todo[0], ...todo[1] }
        ]))
        // console.log(todos);
      }
    })
  }, [])


  //write
  const writeToDatabase = () => {
    const todoRef = ref(db, 'Todos');
    // console.log(todoRef);
    const newTodoRef = push(todoRef)
    // console.log(newTodoRef);
    set(newTodoRef, {
      todo: todo,
      completed: false
    })
    // console.log(db);
    setTodo('');
  }
  const handleChange2 = (e) => {
    setTodo2(e.target.value)
  }

  const writeToDatabase2 = () => {
    const todoRef = ref(db, 'Todos2');
    console.log(todoRef);
    const newTodoRef = push(todoRef)
    console.log(newTodoRef);
    set(newTodoRef, {
      todo: todo2,
      completed: false
    })
    console.log(db);
    setTodo2('');
  }

  //update
  const updateTodo = (todo) => {
    console.log(todo);
    setEdit(true);
    setTempId(todo.id)
    setTodo(todo.todo)
  }

const editTodo = () =>{
  update(ref(db,'Todos/' + tempId),{
    id:tempId,
    todo
  })
  setTodo('');
  setEdit(false)
}

  //delete
  const deleteTodo = (todo) => {
    remove(ref(db, 'Todos/' + todo.id))
  }

  return (
    <div className="App">
      <input type="text" value={todo} onChange={handleChange} />
      {
        edit ?  <button onClick={editTodo}>submit edit</button>
        : 
      <button onClick={writeToDatabase}>submit</button>
      }
      <input type="text" value={todo2} onChange={handleChange2} />
      <button onClick={writeToDatabase2}>submit2</button>
      {
        todos?.map((todo, i) => {
          return <div key={i}> <h1 >{todo.todo}</h1>
            <button onClick={() => updateTodo(todo)}>update</button>
            <button onClick={() => deleteTodo(todo)}>delete</button>
          </div>
        })
      }


    </div>
  );
}

export default App;
