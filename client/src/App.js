import React, { Component } from 'react';
import { GoogleLogin } from 'react-google-login-component';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      autorized: false,
      autorizedUser: {
        name: '',
        mail: ''
      },
      questions: '',
      selectedOption: ''
    };

    this.handleOptionChange = this.handleOptionChange.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.responseGoogle = this.responseGoogle.bind(this);
    this.fetchQuestions = this.fetchQuestions.bind(this);
  }
  
  handleOptionChange(changeEvent) {
    this.setState({
      selectedOption: changeEvent.target.value
    });
  }

  handleFormSubmit(formSubmitEvent) {
    formSubmitEvent.preventDefault();
    console.log('You have selected:', this.state.selectedOption);
  }

  responseGoogle (googleUser) {
    this.setState({
      autorized: true,
      autorizedUser: {
        name: googleUser.getBasicProfile().getGivenName(),
        mail: googleUser.getBasicProfile().getEmail()
      }
    });
  }

  fetchQuestions() {
      fetch('http://localhost:4567/question')
      .then(result => {
        return result.json();
      }).then(questionsFromServer => {
        let questions = questionsFromServer.map((question) => {
          let answerOptions = question.answerOptions;
        return(
          <div>
            <div>{question.text}</div>
            <div>
            <form onSubmit={this.handleFormSubmit}>
            <div className="radio">
              <label>
                <input type="radio" value={answerOptions[0].id} checked={this.state.selectedOption === answerOptions[0].id} onChange={this.handleOptionChange} />
                {answerOptions[0].text}
              </label>
            </div>
            <button className="btn btn-default" type="submit">Save</button>
            </form>
            </div>
          </div>
        );
        });
        this.setState({
          questions: questions
        });
      });
  }

  render() {
    if (this.state.autorized) {
      this.fetchQuestions()
      return (
        <div className="App">
          <header className="App-header">
            <h1 className="App-title">Codemotion 2017 Tuenti Challenge</h1>
            <h2>Welcome {this.state.autorizedUser.name} - Good luck!</h2>
          </header>
          <div className="App-intro">
            {this.state.questions}
          </div>
        </div>
      );
    } else {
      return (
        <div className="App">
          <header className="App-header">
            <h1 className="App-title">Codemotion 2017 Tuenti Challenge</h1>
          </header>
          <div>
            <GoogleLogin socialId="971853413864-q95t1lqobg0jeps71mhvd8np80ufgd2i.apps.googleusercontent.com"
                       className="google-login"
                       scope="profile"
                       fetchBasicProfile={true}
                       responseHandler={this.responseGoogle}
                       buttonText="Login With Google"/>
          </div>
        </div>
      );
    }
  }
}

export default App;
