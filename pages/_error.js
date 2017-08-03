import React from 'react'
import ErrorBox from '../components/boxes/ErrorBox/ErrorBox';
import MainLayoutContainer from '../containers/layouts/MainLayout/MainLayoutContainer';

export default class Error extends React.Component {
  static getInitialProps ({ res, jsonPageRes }) {
    const statusCode = res ? res.statusCode : (jsonPageRes ? jsonPageRes.status : null)
    return { statusCode }
  }

  render () {
    return (
      <MainLayoutContainer>
        <ErrorBox
          status={this.props.statusCode}
          message={'An error occurred on client'}
        />
      </MainLayoutContainer>
    )
  }
}
