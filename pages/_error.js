import React from 'react';
import PropTypes from 'prop-types';
import ErrorBox from '../components/boxes/ErrorBox/ErrorBox';
import MainLayoutContainer from '../containers/layouts/MainLayout/MainLayoutContainer';

export default class Error extends React.Component {
  static getInitialProps({ res, jsonPageRes }) {
    const statusFromJsonPage = jsonPageRes ? jsonPageRes.status : null;
    const statusCode = res ? res.statusCode : statusFromJsonPage;
    return { statusCode };
  }

  render() {
    return (
      <MainLayoutContainer>
        <ErrorBox
          status={this.props.statusCode}
          message={'An error occurred on client'}
        />
      </MainLayoutContainer>
    );
  }
}

Error.propTypes = {
  statusCode: PropTypes.number.isRequired,
};
