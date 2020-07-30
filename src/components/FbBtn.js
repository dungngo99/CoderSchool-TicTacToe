import React, { Component } from 'react'
import FacebookLogin from 'react-facebook-login'
export default class FbBtn extends Component {

  responseFacebook(response) {
    if (response !== 'unknown') this.setState({...this.state, userName: response.name.split(' ').join(''), hasSignIn: "Yes"})
    else this.setState({...this.state, hasSignIn: 'Failed to login'})
  }

  render() {
    return (
      <div>
        <FacebookLogin
          appId="730632477786035"
          autoLoad={true}
          fieds='name, email, picture'
          callback={this.responseFacebook.bind(this.props.parent)}
          cssClass="my-facebook-button-class"
          icon="fa-facebook"
          render={renderProps => (
            <button onClick={renderProps.onClick}>This is my custom FB button</button>
          )}
        />
      </div>
    )
  }
}
