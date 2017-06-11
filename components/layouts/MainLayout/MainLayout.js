import React from 'react';
import Head from 'next/head';
import Link from 'next/link'

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
        <navbar className={'MainLayout-navbar'}>
          <Link href='/'><a>Home</a></Link>
          <Link href='/videos'><a>Videos</a></Link>
        </navbar>
        <div>
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default MainLayout;
