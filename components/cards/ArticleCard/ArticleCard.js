import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Link from 'next/link';

import stylesheet from './ArticleCard.scss';

import Search from 'react-icons/lib/fa/search';

class ArticleCard extends React.Component {
  static getInitialProps({ isServer }) {
    return {
      isServer,
    };
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  render() {
    const articleInfo = this.props.article;
    const addTime = new Date(articleInfo.addTime);
    const timeString = moment(addTime).format('YYYY/MM/DD HH:mm');

    return (
      <div className={'ArticleCard-zone'}>
        <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
        <div className={'ArticleCard-commentCountZone'}>
          <span className={'ArticleCard-commentCount'}>
            {articleInfo.commentCount}
          </span>
        </div>
        <div className={'ArticleCard-imageZone'}>
          <img className={'ArticleCard-image'} src={articleInfo.userPicture}/>
        </div>
        <div className={'ArticleCard-contentZone'}>
          <span className={'ArticleCard-userName'}>
            {articleInfo.userName}
          </span>
          <h2 className={'ArticleCard-title'}>
            {articleInfo.title}
          </h2>
          <span className={'ArticleCard-date'}>
            {moment(articleInfo.createdAt).format('YYYY-MM-DD HH:mm')}
          </span>
        </div>
      </div>
    );
  }
}

export default ArticleCard;
