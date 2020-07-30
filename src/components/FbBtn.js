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
          appId="ff5789a0-f1eb-4221-b16c-3d348f1c0e53"
          autoLoad={true}
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
