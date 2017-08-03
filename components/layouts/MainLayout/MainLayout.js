import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

import Facebook from 'react-icons/lib/fa/facebook';
import GooglePlus from 'react-icons/lib/fa/google-plus';
import Bars from 'react-icons/lib/fa/bars';
import stylesheet from './MainLayout.scss';

class MainLayout extends React.Component {
  static getInitialProps({ query }) {
    return {
      query,
    };
  }
  constructor(props) {
    super(props);
    this.state = {
      showMobileZone: false,
    };
  }

  componentDidMount() {
    // if (typeof FB !== undefined) {
    //   FB.XFBML.parse();
    // }
  }

  componentWillUnmount() {
  }

  onLoginClick() {
    this.props.doLogin();
  }

  onLogoutClick() {
    this.props.doLogout();
  }

  changeMoibleZoneShow() {
    this.setState({
      showMobileZone: !this.state.showMobileZone,
    });
  }

              // <div className={'MainLayout-link'}>
              //   <Link href='/articles/allArticles'><a>新聞</a></Link>
              // </div>
  render() {
    return (
      <div className={'MainLayout-zone'}>
        <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
        <Head>
        </Head>
        <nav className={'MainLayout-navbar'}>
          <div className={'MainLayout-content'}>
            <div className={'MainLayout-logo'}>
              <Link href='/'><a>
                <img className={'MainLayout-logoImg'} src={'/static/logo.png'}/>
                <h1 className={'MainLayout-logoTitle'}>Youtuber看門狗</h1>
              </a></Link>
            </div>
            <div className={'MainLayout-linksZone'}>
              <Link href='/'><a>
                <span className={'MainLayout-link'}>頻道</span>
              </a></Link>
              <Link href='/videos/allVideos'><a>
                <span className={'MainLayout-link'}>影片</span>
              </a></Link>
              <Link href='/articles/allArticles'><a>
                <span className={'MainLayout-link'}>討論區</span>
              </a></Link>
            </div>
            <div className={'MainLayout-functionZone'}>
              {
                this.props.userInfo ? <img src={this.props.userInfo.picture} className={'MainLayout-image'}/> : null
              }
              {
                this.props.userInfo ? 
                  <span onClick={this.onLogoutClick.bind(this)} className={'MainLayout-item'}>登出</span>
                  :
                  <span onClick={this.onLoginClick.bind(this)}  className={'MainLayout-item'}>
                    <GooglePlus/>
                    登入
                  </span>
              }
            </div>
            <div className={'MainLayout-mobileFunctionZone'}>
              {
                this.props.userInfo ? <img src={this.props.userInfo.picture} className={'MainLayout-image'}/>  : null
              }
              <Bars onClick={this.changeMoibleZoneShow.bind(this)} className={'MainLayout-bars'}/>
            </div>
          </div>
        </nav>
        <div className={this.state.showMobileZone ? 'MainLayout-mobileZone' : 'MainLayout-invisible'}>
          <Link href='/'><a>
            <span className={'MainLayout-mobileLink'}>頻道</span>
          </a></Link>
          <Link href='/videos/allVideos'><a>
            <span className={'MainLayout-mobileLink'}>影片</span>
          </a></Link>
          <Link href='/articles/allArticles'><a>
            <span className={'MainLayout-mobileLink'}>討論區</span>
          </a></Link>
          {
            this.props.userInfo ? 
              <span onClick={this.onLogoutClick.bind(this)} className={'MainLayout-mobileLink'}>登出</span>
              :

              <span onClick={this.onLoginClick.bind(this)}  className={'MainLayout-mobileLink'}>
                <GooglePlus/>
                登入
              </span>
          }
        </div>
        { this.props.isRouterChanging ? <div className={'MainLayout-loadingZone'}></div> : null }
        <div className={'MainLayout-socialZone'}>
          <a target={'_blank'} href={'https://www.facebook.com/Youtuber-Spy-%E5%B0%8F%E9%A0%BB%E9%81%93%E5%A4%A7%E4%B8%96%E7%95%8C-1929847743924108/'}>
            <div className={'MainLayout-socialIcon'}>
             <Facebook />
            </div>
          </a>
        </div>
        <div className={'MainLayout-fbLikeZone'}>
            <div className='fb-page'
              data-href='https://www.facebook.com/U2berSpy/'
              data-small-header={false}
              data-adapt-container-width={false}
              data-hide-cover={false}
              data-show-facepile={true}
              data-adapt-container-width={true}
            >
            </div>
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
