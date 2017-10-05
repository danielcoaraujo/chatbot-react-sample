import React, { Component } from 'react';
import botImage from "../images/other.png"
import ReCAPTCHA from 'react-google-recaptcha';
import Moment from 'react-moment';

class Captcha extends Component{

	render(){
		const date = new Date();
		return(
			<li className="other">
				<a className="user" >
					<img src={botImage} alt="botImage"/>
				</a>
				<div className="date">
					<time><Moment format="HH:mm DD/MM/YY">{date}</Moment></time>
				</div>
				<div className="message">
					<p>Olá! Por favor, precisamos que você se identifique como humano
						 para que possamos continuar nossa conversa!</p>
					<div className="recaptcha">
						{
							<ReCAPTCHA
								ref="recaptcha"
								onExpired={this.onChange.bind(this, false)}
								size="compact"
								sitekey="6Lf7hDEUAAAAACvpySNeengQeC2dSWoAocqH8Yov"
								onChange={this.onChange.bind(this, true)}/> 
						}
					</div>
				</div>
			</li>
		);
	}
	
	onChange = (value) => {
		this.props.setIsHuman(value);
	}
}

export default Captcha;