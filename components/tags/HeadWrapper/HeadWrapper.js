import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';

const HeadWrapper = (props) => {
  const { title, description, type, image, url, site_name, fb_app_id } = props;
  return (
    <Head>
      <title>{title}</title>
      <meta property={'og:title'} content={title} />
      <meta property={'og:description'} content={description} />
      <meta property={'og:type'} content={type} />
      <meta property={'og:image'} content={image} />
      <meta property={'og:url'} content={url} />
      <meta property={'og:site_name'} content={site_name} />
      <meta property={'fb:app_id'} content={fb_app_id} />
      <meta name={'twitter:title'} content={title} />
      <meta name={'twitter:description'} content={description} />
      <meta name={'twitter:image'} content={image} />
      <meta name={'twitter:url'} content={url} />
    </Head>
  );
};

HeadWrapper.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  type: PropTypes.string,
  image: PropTypes.string,
  url: PropTypes.string,
  site_name: PropTypes.string,
  fb_app_id: PropTypes.string,
};

HeadWrapper.defaultProps = {
  title: '',
  description: '',
  type: '',
  image: '',
  url: '',
  site_name: '',
  fb_app_id: '',
};

export default HeadWrapper;
