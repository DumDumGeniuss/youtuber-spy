import React from 'react';
import { bindActionCreators } from 'redux';
import withRedux from 'next-redux-wrapper';
import { initStore } from '../../../store/initStore';

import MainLayout from '../../../components/layouts/MainLayout/MainLayout';

import * as userAction from '../../../actions/user';
import * as youtubeApi from '../../../apis/youtube';

class MainLayoutContainer extends React.Component {
  static getInitialProps({ query }) {
    return {
      query,
    };
  }
  constructor(props) {
    super(props);
    this.state = {
      isLogining: false,
    };
  }

  componentDidMount() {
    /* Handle the callback from addChannel */
    const callbackParams = youtubeApi.getParamsFromCallback(window.location.href);
    if (callbackParams.access_token) {
      localStorage.setItem('youtubeToken', callbackParams.access_token);
    }
    this.props.getUserAsync(localStorage.getItem('youtubeToken'));
  }

  componentWillUnmount() {
  }

  login() {
    const currentToken = localStorage.getItem('youtubeToken');
    /* Get full site url */
    youtubeApi.getUserInfo(currentToken)
      .then((result) => {
        if (!result) {
          const fullSiteUrl = location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '') + '/';
          const oauthUrl = youtubeApi.generateOauthUrl(fullSiteUrl);
          window.open(oauthUrl, "_self");
          return;
        }
      });
  }

  logout() {
    localStorage.setItem('youtubeToken', null);
    window.open('/', "_self");
  }

  render() {
    // console.log(this.props.user);
    return (
      <MainLayout
        userInfo={this.props.user.userInfo}
        children={this.props.children}
        doLogin={this.login.bind(this)}
        doLogout={this.logout.bind(this)}
      />
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getUserAsync: bindActionCreators(userAction.getUserAsync, dispatch),
    getUser: bindActionCreators(userAction.getUser, dispatch),
  }
}

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(MainLayoutContainer);
