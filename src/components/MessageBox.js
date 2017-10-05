import React, { Component } from 'react';
import Moment from 'react-moment';
import botImage from "../images/other.png"
import userImage from "../images/you.png"

export default class MessageBox extends Component{

  render() {
		const date = new Date();
    return(
      <div>
        {
          this.props.lista.map(function(chatMessage){
            return(
              <li key={chatMessage.id} className={chatMessage.type}>
                <a className="user" >
                  { 
                    (chatMessage.type === "you") ?
                    (<img src={userImage} alt="userImage"/>) :
                    (<img src={botImage} alt="botImage"/>)
                  }
                </a>
                <div className="date">
                  <time><Moment format="HH:mm DD/MM/YY">{date}</Moment></time>
                </div>
                <div className="message">
                  <div>
                    <p className="messagep">{chatMessage.message}</p>
                  </div>
                </div>
              </li>
            );
          }
        )}
      </div>
    );
  }
}