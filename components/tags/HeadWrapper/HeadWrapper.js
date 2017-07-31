import React from 'react';
import Head from 'next/head';

class HeadWrapper extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { title, description, type, image, url, site_name, fb_app_id } = this.props;
    return (
      <Head>
        <title>{title}</title>
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description}/>
        <meta property="og:type" content={type} />
        <meta property="og:image" content={image} />
        <meta property="og:url" content={url} />
        <meta property="og:site_name" content={site_name}/>
        <meta property="fb:app_id" content={fb_app_id} />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={image} />
        <meta name="twitter:url" content={url} />
      </Head>
    );
  }
}

export default HeadWrapper;
