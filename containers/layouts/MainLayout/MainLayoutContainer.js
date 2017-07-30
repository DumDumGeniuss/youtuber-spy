import React from 'react';
import { bindActionCreators } from 'redux';
import withRedux from 'next-redux-wrapper';
import Router from 'next/router';
import { initStore } from '../../../store/initStore';

import MainLayout from '../../../components/layouts/MainLayout/MainLayout';

import * as userAction from '../../../actions/user';
import * as browserAttributeAction from '../../../actions/browserAttribute';
import * as youtubeApi from '../../../apis/youtube';

class MainLayoutContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLogining: false,
    };
    this.doSetBrowserSize = this.doSetBrowserSize.bind(this);
  }

  componentDidMount() {
    /* Handle the callback from addChannel */
    const callbackParams = youtubeApi.getParamsFromCallback(window.location.href);
    if (callbackParams.access_token) {
      localStorage.setItem('youtubeToken', callbackParams.access_token);
    }
    this.props.getUserAsync(localStorage.getItem('youtubeToken'));

    /* Get the current window size */
    this.doSetBrowserSize();
    this.windowSizeChangeListener = window.addEventListener('resize', this.doSetBrowserSize);

    Router.onRouteChangeStart = (url) => {
      this.props.setRouterChangingStatus(true);
    }; 
    Router.onRouteChangeComplete = (url) => {
      this.props.setRouterChangingStatus(false);
    }; 

  }

  doSetBrowserSize() {
    const w = window;
    const d = document;
    const e = d.documentElement;
    const g = d.getElementsByTagName('body')[0];
    const x = w.innerWidth || e.clientWidth || g.clientWidth;
    const y = w.innerHeight|| e.clientHeight|| g.clientHeight;
    this.props.setBrowserSize(x, y);
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

  componentWillUnmount() {
    if (this.windowSizeChangeListener) {
      window.removeEventListener(this.doSetBrowserSize);
    }
  }

  render() {
    return (
      <MainLayout
        userInfo={this.props.user.userInfo}
        children={this.props.children}
        doLogin={this.login.bind(this)}
        doLogout={this.logout.bind(this)}
        isRouterChanging={this.props.browserAttribute.isRouterChanging}
      />
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    browserAttribute: state.browserAttribute,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getUserAsync: bindActionCreators(userAction.getUserAsync, dispatch),
    getUser: bindActionCreators(userAction.getUser, dispatch),
    setBrowserSize: bindActionCreators(browserAttributeAction.setBrowserSize, dispatch),
    setRouterChangingStatus: bindActionCreators(browserAttributeAction.setRouterChangingStatus, dispatch),
  }
}

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(MainLayoutContainer);
