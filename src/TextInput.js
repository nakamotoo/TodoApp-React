import React from "react";

//入力欄を返す
const TextInput = (props) => {
  return(
    <input
      type="text"
      value={props.inputText}
      onChange={props.handleInput}
      onKeyPress={props.enterPressed}
      id="textInput"
    />
  );
}

export default TextInput;
