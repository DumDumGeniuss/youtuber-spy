import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

import stylesheet from './MainLayout.scss';

class MainLayout extends React.Component {
  static getInitialProps({ query }) {
    return {
      query,
    };
  }

  componentDidMount() {
    // console.log(this.props.query);
  }

  componentWillUnmount() {
  }

  onLoginClick() {
    this.props.doLogin();
  }

  onLogoutClick() {
    this.props.doLogout();
  }

  render() {
    return (
      <div className={'MainLayout-zone'}>
        <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
        <Head />
        <nav className={'MainLayout-navbar'}>
          <div className={'MainLayout-content'}>
            <div className={'MainLayout-logo'}>
              <Link href='/'><a>
                <img src={'/static/logo.png'}/>
                <h1>小頻道大世界</h1>
              </a></Link>
            </div>
            <div className={'MainLayout-itemsZone'}>
              <div className={'MainLayout-link'}>
                <Link href='/'><a>頻道</a></Link>
              </div>
              <div className={'MainLayout-link'}>
                <Link href='/videos'><a>影片</a></Link>
              </div>
              {this.props.userInfo ? 
                <div onClick={this.onLogoutClick.bind(this)} className={'MainLayout-login'}>
                  <span>登出</span>
                </div>
                :
                <div onClick={this.onLoginClick.bind(this)}  className={'MainLayout-login'}>
                  <span>登入</span>
                </div>
              }
              {this.props.userInfo ? <div><img src={this.props.userInfo.picture}/></div> : null}
            </div>
          </div>
        </nav>
        <div className={'MainLayout-pageContent'}>
          {this.props.children}
        </div>
        <footer className={'MainLayout-footer'}>
          <span className={'MainLayout-center'}>
            copyright©YoutuberSpy
          </span>
        </footer>
      </div>
    );
  }
}

export default MainLayout;
