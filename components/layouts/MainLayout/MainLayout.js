import React from 'react';
import Head from 'next/head';

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
      <div className={'zone'}>
        <style jsx>{`
          .zone {
            background-color: #e9ebee;
            width: 100%;
          }
          .navbar {
            display: block;
            width: 100%;
            height: 50px;
            background-color: #e62117;
          }
        `}</style>
        <Head />
        <navbar className={'navbar'} />
        <div>
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default MainLayout;
