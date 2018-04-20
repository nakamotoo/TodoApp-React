import React from "react";
import { Link } from 'react-router-dom';

const Links = (props) => {
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

export default Links;
