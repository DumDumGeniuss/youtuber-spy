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
              <div>
                <Link href='/'><a>頻道</a></Link>
              </div>
              <div>
                <Link href='/videos'><a>影片</a></Link>
              </div>
            </div>
          </div>
        </nav>
        <div className={'MainLayout-pageContent'}>
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default MainLayout;
