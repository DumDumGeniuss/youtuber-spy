import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

import stylesheet from './ErrorBox.scss';

const ErrorBox = props =>
  (
    <div className={'ErrorBox-zone'}>
      <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
      <h1 className={'ErrorBox-message'}>喔喔，發現錯誤！ {props.status}</h1>
      <h2 className={'ErrorBox-message'}>{props.message}</h2>
      <Link href={'/'}><a>
        <span className={'ErrorBox-backToHome'}>回到首頁</span>
      </a></Link>
      <div className={'ErrorBox-logoZone'}>
        <img alt={'youtuberspy logo'} className={'ErrorBox-logo'} src={'/static/logo.png'} />
      </div>
    </div>
  );

ErrorBox.propTypes = {
  status: PropTypes.number.isRequired,
  message: PropTypes.string.isRequired,
};

export default ErrorBox;
