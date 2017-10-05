import React, { Component } from 'react';
import SvgIcon from 'material-ui/SvgIcon';
import IconButton from 'material-ui/IconButton';
import TextField from 'material-ui/TextField'
import PubSub from 'pubsub-js';
import $ from 'jquery';
import {reactLocalStorage} from 'reactjs-localstorage';

let URL_API = process.env.REACT_APP_URL_API;

const SendIcon = (props) => (
  <SvgIcon {...props}>
    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
  </SvgIcon>
)

export default class SendComponent extends Component{

  constructor(props){
    super(props);
    this.state = {lista: [], message:'', context: null, isHuman: this.props.isHuman};
    this.getLastConversation();
  }
    
  setMessage(evento){
    this.setState({message:evento.target.value});  
  }

  render(){
    return(
      <div className="sendComponent">
        <TextField className="textField" 
          disabled={!this.state.isHuman} 
          value={this.state.message}
          onKeyUp={this._handleKeyPress.bind(this)}
          onChange={this.setMessage.bind(this)}/>
        <IconButton disabled={!this.state.isHuman} className="sendButton" onClick={this.submit.bind(this)}>
          <SendIcon />
        </IconButton>
      </div>
    );
  }

  submit = () => {
    var message = this.state.message;
    if(message !== ""){
      this.createMessage('you', message);
      this.request = this.createRequest(message, this.state.context);
      $.ajax({
        url: URL_API,
        contentType:'application/json', 
        dataType:'json',
        type:'post',
        data: JSON.stringify(this.request),
        success: function(response){
          this.state.context = response.context;
          reactLocalStorage.setObject('conversation', {
            'context': response.context,
            'botMessages': response.botMessages,
            'userMessage': message});
          response.botMessages.forEach(function(newMessage) {
            this.createMessage('other', newMessage);
          }, this);
        }.bind(this),
        error: function(){
          this.createMessage('other', 'Desculpe, estamos fora do ar :(');
        }.bind(this)
      });
      this.setState({message:''});
    }
  }

  _handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      this.submit();
    }
  }

  createMessage = (type, message) => {
    var userMessage = {
      message:message,
      id:Math.random(),
      type:type
    };
    this.state.lista.push(userMessage);
    PubSub.publish('atualiza-chat',this.state.lista);
  }
  
  createRequest = (message, context) => {
    var request = {
      userMessage:message,
      context:context
    };
    return request;
  }

  getLastConversation = () => {
    var response = reactLocalStorage.getObject('conversation');
    var userMessage = response.userMessage;
    var botMessages = response.botMessages;
    var context = response.context;
    
    if(Object.keys(response).length > 0 && this.checkValuesNotBlank(userMessage, botMessages, context)){
      this.state.context = context;
      this.createMessage('other', 
        "Identifiquei que o senhor já esteve por aqui. Vamos continuar de onde paramos...");
      this.createMessage('you', userMessage);
      botMessages.forEach(function(botMessage) {
        this.createMessage('other', botMessage);
      }, this);
    } else {
      reactLocalStorage.clear();
    }
  }

  checkValuesNotBlank = (userMessage, botMessages, context) => {
    return (userMessage != null || userMessage !== '')
        && (botMessages != null || botMessages !== '')
        && (context != null || context !== '');
  }
    
  componentDidMount(){
    PubSub.subscribe('check-isHuman',function(topico,value){
      this.setState({isHuman:value});
    }.bind(this));
  }

  componentWillReceiveProps (nextProps) {
    if(this.props.isHuman !== nextProps.isHuman){
      this.setState({isHuman:nextProps.isHuman});
    }
  }
}