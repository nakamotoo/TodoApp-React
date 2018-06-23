import './styles.css';
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Link } from 'react-router-dom';
import TextInput from './TextInput.js'
import TodoLists from './TodoLists.js'
import Links from './Links.js'

const getUrl = 'http://localhost:3000/db'
const url = 'http://localhost:3000/todos/'

class MyApp extends React.Component {
  constructor(props){
    super(props);
    this.state={
      inputText:"",
      todos:[]
    }
    this.getJsonData();
  }
  //db.jsonのデータをGETする関数
  getJsonData = () => {
        fetch(getUrl).
        then((response)=>response.json()).
        then((json)=>{
          this.setState( {todos:json.todos} )
        }
      )
    }
  // TextInputに入力した文をステートに保存する
  handleInput = (event) => {
    this.setState({inputText:event.target.value});
  }
  //TextInputでenterを押した時の処理
  enterPressed = (event) => {
      const inputText=this.state.inputText;
      const todos=this.state.todos;
      let id;
      if(todos[todos.length-1]){
        id=todos[todos.length-1].id
      }else{
        id=0;
      }
      if(event.key==='Enter'){
        if(this.state.inputText!==""){
        this.setState(prevState=>
          prevState.todos.push({text:inputText,id:id+1,checked:false})
        )
        this.setState({
          inputText:""
        }) //enter押したら入力欄クリアする
        fetch(url,{
          headers: {'Accept': 'application/json','Content-Type': 'application/json'},
          method:'POST',
          body:JSON.stringify({text:inputText,id:id+1,checked:false})
        });
      }
    }
  }
  //削除によってidが飛び飛びの数になるので、そいつが本当は配列の中で何番目なのか返す
  getRealNumber(array,data){
    const realNumber = array.findIndex(e => {
      return e.id == data
    });
    return realNumber
  }

  //Listでcheckboxをcheckした時
  todoChecked = (event) => {
      const checkedId=event.target.id;
      const realNumber=this.getRealNumber(this.state.todos,checkedId);
      const id = this.state.todos[realNumber].id;
      const checked = this.state.todos[realNumber].checked;
      event.persist();
      this.setState((prevState) => {
        prevState.todos[realNumber].checked = event.target.checked;
        return prevState;
        }
      )
      fetch(url+id,{
          headers: {'Accept': 'application/json','Content-Type': 'application/json'},
          method:'PATCH',
          body:JSON.stringify({checked:!checked}) //stateが保存される前にputされるから!checked
      });
    }

  deleteList = (event) => {
      const clickedId=event.target.id;
      const realNumber=this.getRealNumber(this.state.todos,clickedId);
      const id = this.state.todos[realNumber].id;
      event.persist();
      this.setState(prevState => {
          return({
            todos: prevState.todos.filter((element)=>{
              return element.id != clickedId;
            })
          })
        }
      )
      fetch(url+id,{
        headers: {'Accept': 'application/json','Content-Type': 'application/json'},
        method:'DELETE'
      });
    }
  // --items leftの数字を返す
  itemCount = () => {
    return this.state.todos.filter(t => {return !t.checked}).length
  }

  render() {
    return(
      <BrowserRouter>
        <div className="container">
          <h1>ToDo</h1>
          <TextInput
            handleInput={this.handleInput}
            inputText={this.state.inputText}
            enterPressed={this.enterPressed}
          />
          <Route exact
            path="/"
            render={ (props) =>
                <TodoLists
                  todos={this.state.todos}
                  todoChecked={this.todoChecked}
                  deleteList={this.deleteList}
                />
              }
          />
          <Route
            path="/active"
            render={ (props) =>
                <TodoLists
                  todos={this.state.todos.filter(t =>
                    {return !t.checked}
                  )}
                  todoChecked={this.todoChecked}
                  deleteList={this.deleteList}
                />
              }
          />
          <Route
            path="/completed"
            render={ (props) =>
                <TodoLists
                  todos={this.state.todos.filter(t =>
                    {return t.checked}
                  )}
                  todoChecked={this.todoChecked}
                  deleteList={this.deleteList}
                />
              }
          />
          <Links
            itemCount={this.itemCount()}
          />
        </div>
      </BrowserRouter>
    );
  }
}

ReactDOM.render(<MyApp />, document.getElementById("root"));
