import React from 'react';
import Head from 'next/head';
import MainLayout from '../components/layouts/MainLayout/MainLayout';

class Index extends React.Component {
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
      <MainLayout>
        <style jsx>{`
          .zone {
            background-color: white;
            width: 100%;
            max-width: 800px;
            min-height: 100vh;
            margin-left: 50%;
            transform: translate(-50%, 0%);
          }
        `}</style>
        <Head>
          <meta name="og:title" content="youtuber spy" />
        </Head>
        <div className={'zone'} />
      </MainLayout>
    );
  }
}

export default Index;
