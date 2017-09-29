import React from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';

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

    this.scrollHandler = this.scrollHandler.bind(this);
    this.addScrollHandler = this.addScrollHandler.bind(this);
    this.onLoginClick = this.onLoginClick.bind(this);
    this.onLogoutClick = this.onLogoutClick.bind(this);
    this.changeMoibleZoneShow = this.changeMoibleZoneShow.bind(this);
  }

  componentDidMount() {
    this.addScrollHandler();
  }

  componentWillUnmount() {
    if (this.scrollListener) {
      window.removeEventListener('scroll', this.scrollListener);
    }
  }

  onLoginClick() {
    this.props.doLogin();
  }

  onLogoutClick() {
    this.props.doLogout();
  }

  scrollHandler(scrollTop, windowHeight, realHeight) {
    /* If not touch bottom, return */
    if (scrollTop + windowHeight !== realHeight) {
      return;
    }
    if (this.props.doTouchBottom) {
      this.props.doTouchBottom();
    }
  }

  addScrollHandler() {
    this.scrollListener = window.addEventListener('scroll', () => {
      this.scrollHandler(
        window.pageYOffset,
        window.innerHeight,
        Math.max(
          window.innerHeight,
          document.body.offsetHeight,
          document.documentElement.clientHeight,
        ),
      );
    });
  }

  changeMoibleZoneShow() {
    this.setState({
      showMobileZone: !this.state.showMobileZone,
    });
  }

              // <div className={'MainLayout-link'}>
              //   <Link href='/articles/allArticles'><a>新聞</a></Link>
              // </div>
          //     <Link href='/articles/allArticles'><a>
          //       <span className={'MainLayout-link'}>討論區</span>
          //     </a></Link>
          // <Link href='/articles/allArticles'><a>
          //   <span className={'MainLayout-mobileLink'}>討論區</span>
          // </a></Link>
  render() {
    const words = this.props.words;
    return (
      <div className={'MainLayout-zone'}>
        <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
        <nav className={'MainLayout-navbar'}>
          <div className={'MainLayout-content'}>
            <div className={'MainLayout-logo'}>
              <Link href='/'><a>
                <img alt={'youtuberspy logo'} className={'MainLayout-logoImg'} src={'/static/logo.png'} />
                <h1 className={'MainLayout-logoTitle'}>{words.youtuberspy}</h1>
              </a></Link>
            </div>
            <div className={'MainLayout-linksZone'}>
              <Link href={'/'}><a>
                <span className={'MainLayout-link'}>{words.channel}</span>
              </a></Link>
              <Link href={'/videos/allVideos'}><a>
                <span className={'MainLayout-link'}>{words.video}</span>
              </a></Link>
              <Link href={'/articles/allArticles'}><a>
                <span className={'MainLayout-link'}>{words.forum}</span>
              </a></Link>
            </div>
            <div className={'MainLayout-functionZone'}>
              {
                this.props.userInfo ? <img alt={'youtuber user'} src={this.props.userInfo.picture} className={'MainLayout-image'} /> : null
              }
              {
                this.props.userInfo ?
                  <span onClick={this.onLogoutClick} className={'MainLayout-item'} role={'button'} tabIndex={0}>{words.logout}</span>
                  :
                  <span onClick={this.onLoginClick} className={'MainLayout-item'} role={'button'} tabIndex={0}>
                    <GooglePlus />
                    {words.login}
                  </span>
              }
            </div>
            <div className={'MainLayout-mobileFunctionZone'}>
              {
                this.props.userInfo ? <img alt={'youtuber user'} src={this.props.userInfo.picture} className={'MainLayout-image'} /> : null
              }
              <Bars onClick={this.changeMoibleZoneShow} className={'MainLayout-bars'} />
            </div>
          </div>
        </nav>
        <div className={this.state.showMobileZone ? 'MainLayout-mobileZone' : 'MainLayout-invisible'}>
          <Link href='/'><a>
            <span className={'MainLayout-mobileLink'}>{words.channel}</span>
          </a></Link>
          <Link href='/videos/allVideos'><a>
            <span className={'MainLayout-mobileLink'}>{words.video}</span>
          </a></Link>
          <Link href='/articles/allArticles'><a>
            <span className={'MainLayout-mobileLink'}>{words.forum}</span>
          </a></Link>
          {
            this.props.userInfo ?
              <span onClick={this.onLogoutClick} className={'MainLayout-mobileLink'} role={'button'} tabIndex={0}>{words.logout}</span>
              :

              <span onClick={this.onLoginClick} className={'MainLayout-mobileLink'} role={'button'} tabIndex={0}>
                <GooglePlus />
                {words.login}
              </span>
          }
        </div>
        { this.props.isRouterChanging ? <div className={'MainLayout-loadingZone'} /> : null }
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
        <div className={'MainLayout-rightSideZone'}>
          <div className={'MainLayout-fbLikeZone'}>
            <div
              className={'fb-page'}
              data-height={600}
              data-href={'https://www.facebook.com/U2berSpy/'}
              data-small-header={false}
              data-hide-cover={false}
              data-show-facepile
              data-adapt-container-width
              data-tabs={''}
            />
          </div>
          <Link href={'/campaigns/pickYoutuber'}><a>
            <div className={'MainLayout-campaignBox'}>
              <h1 className={'MainLayout-campaignTitle'}>Youtuber抽抽樂</h1>
              <p className={'MainLayout-campaignSubTitle'}>
                看看您的本命Youtuber之誰吧～
              </p>
            </div>
          </a></Link>
          <Link href={'/campaigns/guessYoutuber'}><a>
            <div className={'MainLayout-campaignBox'}>
              <h1 className={'MainLayout-campaignTitle'}>Youtuber超級認識王</h1>
              <p className={'MainLayout-campaignSubTitle'}>
                挑戰看看你知道多少Youtuber吧！
              </p>
            </div>
          </a></Link>
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

MainLayout.propTypes = {
  userInfo: PropTypes.object,
  children: PropTypes.object.isRequired,
  isRouterChanging: PropTypes.bool.isRequired,
  doLogin: PropTypes.func.isRequired,
  doLogout: PropTypes.func.isRequired,
  doTouchBottom: PropTypes.func,
  words: PropTypes.object.isRequired,
};

MainLayout.defaultProps = {
  userInfo: null,
  doTouchBottom: null,
};

export default MainLayout;
