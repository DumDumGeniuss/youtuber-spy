import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

import Facebook from 'react-icons/lib/fa/facebook';
import GooglePlus from 'react-icons/lib/fa/google-plus';
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

        // <div className={'MainLayout-fbLikeZone'}>
        //   <div className={'fb-page'}
        //     data-href={'https://www.facebook.com/U2berSpy/'}
        //     data-small-header={false}
        //     data-adapt-container-width={false}
        //     data-hide-cover={false}
        //     data-show-facepile={true}
        //   >
        //   </div>
        // </div>
              // <div className={'MainLayout-link'}>
              //   <Link href='/articles/allArticles'><a>新聞</a></Link>
              // </div>
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
                <h1>Youtuber看門狗</h1>
              </a></Link>
            </div>
            <div className={'MainLayout-itemsZone'}>
              <div className={'MainLayout-link'}>
                <Link href='/'><a>頻道</a></Link>
              </div>
              <div className={'MainLayout-link'}>
                <Link href='/videos/allVideos'><a>影片</a></Link>
              </div>
              {this.props.userInfo ? 
                <div onClick={this.onLogoutClick.bind(this)} className={'MainLayout-login'}>
                  <span>登出</span>
                </div>
                :
                <div onClick={this.onLoginClick.bind(this)}  className={'MainLayout-login'}>
                  <GooglePlus />
                </div>
              }
              {this.props.userInfo ? <div><img src={this.props.userInfo.picture}/></div> : <div></div>}
            </div>
          </div>
        </nav>
        <div className={'MainLayout-socialZone'}>
          <a target={'_blank'} href={'https://www.facebook.com/Youtuber-Spy-%E5%B0%8F%E9%A0%BB%E9%81%93%E5%A4%A7%E4%B8%96%E7%95%8C-1929847743924108/'}>
            <div className={'MainLayout-socialIcon'}>
             <Facebook />
            </div>
          </a>
        </div>
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
