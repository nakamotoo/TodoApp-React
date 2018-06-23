import React from "react";

// 1つのtodos配列のtext要素をliにする
const List = (props) => {
  return(
    <li>
      <input
        type="checkbox"
        checked={props.list.checked}
        onChange={props.todoChecked}
        id={props.list.id}
      />
      {props.list.text}
      <a
        id={props.list.id}
        onClick={props.deleteList}
      >
      ✖︎
      </a>
    </li>
  );
}

//上のliにする作業をmapによって、全ての要素で繰り返し、さらに<ul></ul>の中に返す
const TodoLists = (props) => {
  const todoLists = props.todos.map(array => {
    return(
      <List
        list={array}
        key={array.id}
        todoChecked={props.todoChecked}
        deleteList={props.deleteList}
      />
    );
  });
  return(
    <ul id="lists">
      {todoLists}
    </ul>
  );
}

export default TodoLists;
