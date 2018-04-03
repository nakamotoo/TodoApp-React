import React from "react";
import ReactDOM from "react-dom";
import './styles.css';
import { BrowserRouter, Route, Link } from 'react-router-dom';

//入力欄を返す
function TextInput(props){
  return(
      <input
        type="text"
        value={props.inputText}
        onChange={props.handleInput}
        onKeyPress={props.enterPressed}
        id="textInput"
      />);
    }

// 1つのtodoTexts配列のtext要素をliにする
function List(props){
  return(
    <li>
      <input
        type="checkbox"
        checked={props.list.checked}
        onChange={props.todoChecked}
        id={props.list.id}
      />
      {props.list.text}
      <a id={props.list.id} onClick={props.deleteList}>✖︎</a>
    </li>
  );
}
//上のliにする作業をmapによって、全ての要素で繰り返し、さらに<ul></ul>の中に返す
function TodoLists(props){
  const todoLists=props.todoTexts.map(array=>
    {return(
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

function Links(props){
    return(
      <footer>
        <span>{props.itemCount} items left</span>
        <ul id="links">
          <li><Link to={"/"}>すべて</Link></li>
          <li><Link to={"/active"}>未完了</Link></li>
          <li><Link to={"/completed"}>完了</Link></li>
        </ul>
      </footer>
    );
  }


function Active(props){
  const todoLists=props.todoTexts.map(array=>
    {return(
      <List
        list={array}
        key={array.id}
        todoChecked={props.todoChecked}
      />
    );
    });
    return(
      <ul id="lists">
        {todoLists}
      </ul>
    );
  }

function Completed(props){
  const todoLists=props.todoTexts.map(array=>
    {return(
      <List
        list={array}
        key={array.id}
        todoChecked={props.todoChecked}
      />
    );
    });
    return(
      <ul id="lists">
        {todoLists}
      </ul>
    );
}

class MyApp extends React.Component {
  constructor(){
    super();
    this.state={
      inputText:"",
      //todoのテキストを配列で管理,今は何もないが、後からpushされていく
      todoTexts:[],
      itemCount:[{count:0}]
    }
    this.handleInput=this.handleInput.bind(this);
    this.enterPressed=this.enterPressed.bind(this);
    this.todoChecked=this.todoChecked.bind(this);
    this.deleteList=this.deleteList.bind(this);
    this.getRealNumber=this.getRealNumber.bind(this);
    this.itemCountPost=this.itemCountPost.bind(this);
  }
  //はじめにdb.jsonのデータをGETする
  componentDidMount(){
      fetch('http://localhost:3000/db').
      then((Response)=>Response.json()).
      then((json)=>{
        this.setState(prevState=>prevState.todoTexts=json.todoTexts)
      }
    )
      fetch('http://localhost:3000/db').
      then((Response)=>Response.json()).
      then((json)=>{
        this.setState(prevState=>prevState.itemCount=json.itemCount)
      }
  )}
  //TextInputに入力した文をステートに保存する
  handleInput(event){
      this.setState({inputText:event.target.value});
  }

  itemCountPost(){
    fetch('http://localhost:3000/itemCount/1',{
      headers: {'Accept': 'application/json','Content-Type': 'application/json'},
      method:'PUT',
      body:JSON.stringify({count:this.state.itemCount[0].count})
    })
    .catch('FAILED...');
  }
  //ステートがアップデートされてから呼び出す。
  componentDidUpdate(){
    this.itemCountPost();
  }
  //TextInputでenterを押した時の処理
  enterPressed(event){
      const inputText=this.state.inputText;
      const todoTexts=this.state.todoTexts;
      let id;
      if(todoTexts[todoTexts.length-1]){
        id=todoTexts[todoTexts.length-1].id
      }else{
        id=0;
      }
      if(event.key==='Enter'){
        if(this.state.inputText!==""){
        this.setState(prevState=>prevState.todoTexts.push({text:inputText,id:id+1,checked:false}))
        this.setState(prevState=>(prevState.inputText="")) //enter押したら入力欄クリアする
        this.setState(prevState=>prevState.itemCount[0].count++)
        fetch('http://localhost:3000/todoTexts',{
          headers: {'Accept': 'application/json','Content-Type': 'application/json'},
          method:'POST',
          body:JSON.stringify({text:inputText,id:id+1,checked:false})
        })
        .catch('POST FAILED...');
      }
    }
  }
  //削除によってidが飛び飛びの数になるので、そいつが本当は配列の中で何番目なのか返す
  getRealNumber(array,key,data){
      var num;
      for(var i=0;i<array.length;i++){
        for(key in array[i]){
          if(array[i][key]==data){
             num=i   ;
             return num;
          }
        }
      }
    }

  //Listでcheckboxをcheckした時
  todoChecked(event){
      const checkedId=event.target.id;
      const realNumber=this.getRealNumber(this.state.todoTexts,id,checkedId);
      const id = this.state.todoTexts[realNumber].id;
      const checked = this.state.todoTexts[realNumber].checked;
      const url = 'http://localhost:3000/todoTexts/'+id
      console.log(realNumber,checkedId,id);
      event.persist();
      if(event.target.checked){
          this.setState(prevState=>prevState.todoTexts[realNumber].checked=true)
          this.setState(prevState=>prevState.itemCount[0].count--)
      }else{
          this.setState(prevState=>prevState.todoTexts[realNumber].checked=false)
          this.setState(prevState=>prevState.itemCount[0].count++)
      }
      fetch(url,{
          headers: {'Accept': 'application/json','Content-Type': 'application/json'},
          method:'PATCH',
          body:JSON.stringify({checked:!checked}) //stateが保存される前にputされるから!checked
      })
        .catch('PATCH FAILED...');
    }
    //削除
  deleteList(event){
      const clickedId=event.target.id;
      const realNumber=this.getRealNumber(this.state.todoTexts,id,clickedId);
      const inputText=this.state.todoTexts[realNumber].text;
      const id = this.state.todoTexts[realNumber].id;
      const checked = this.state.todoTexts[realNumber].checked;
      const url = 'http://localhost:3000/todoTexts/'+id
      event.persist();
      this.setState(prevState => {
          return({
            todoTexts: prevState.todoTexts.filter((element)=>{
              return element.id != clickedId;
            })
          })
        }
      )
      if(this.state.todoTexts[realNumber].checked===false){
        this.setState(prevState=>prevState.itemCount[0].count--);
      }
      fetch(url,{
        headers: {'Accept': 'application/json','Content-Type': 'application/json'},
        method:'DELETE',
      })
      .catch('DELETE FAILED...');
    }

  render() {
    return(
      <BrowserRouter>
        <div className="container">
          <h1>ToDo</h1>
          <TextInput handleInput={this.handleInput} inputText={this.state.inputText} enterPressed={this.enterPressed}/>
          <Route exact path="/" render={props => <TodoLists todoTexts={this.state.todoTexts} todoChecked={this.todoChecked} deleteList={this.deleteList}/>} />
          <Route path="/active"
            render={props => <Active todoTexts={this.state.todoTexts.filter((element) => {
                return !element.checked
              })}
              todoChecked={this.todoChecked}/>
            }
          />
          <Route path="/completed"
          render={props => <Completed todoTexts={this.state.todoTexts.filter((element) => {
              return element.checked
            })}
            todoChecked={this.todoChecked}/>
          }
        />
          <Links itemCount={this.state.itemCount[0].count}/>
        </div>
      </BrowserRouter>
    );
  }
}

ReactDOM.render(<MyApp />, document.getElementById("root"));
