import React, { Component } from 'react';
import './css/App.css';
import SendComponent from "./components/SendComponent"
import MessageBox from "./components/MessageBox"
import Captcha from './components/Captcha';
import PubSub from 'pubsub-js';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {lista : [], isHuman: false};
    this.setIsHuman = this.setIsHuman.bind(this);
  }

  setIsHuman = (value) => {
    this.setState({isHuman: value})
  }

  render() {
    return (
      <div>
        <div className="section">
          <div id="header" className="row">
            <center>Oi Conta</center>
          </div>
          <div className="chat scrollbar" ref="chat" id="style-1">
            <ul>
              {this.state.isHuman && <MessageBox lista={this.state.lista} />}
              {!this.state.isHuman && <Captcha setIsHuman={this.setIsHuman} />}
            </ul>
          </div>
          <div>
            <SendComponent isHuman={this.state.isHuman}/>
          </div>
        </div>
      </div>
    );
  }

  componentWillMount(){
    PubSub.subscribe('atualiza-chat',function(topico,novaLista){
      this.setState({lista:novaLista});
    }.bind(this));
  }
  
  componentDidUpdate () {
    var el = this.refs.chat;
    el.scrollTop = el.scrollHeight;
  }

}

export default App;
