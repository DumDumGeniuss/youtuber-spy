import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import stylesheet from './ArticleCard.scss';

const ArticleCard = (props) => {
  const articleInfo = props.article;
  return (
    <div className={'ArticleCard-zone'}>
      <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
      <div className={'ArticleCard-commentCountZone'}>
        <span className={'ArticleCard-commentCount'}>
          {articleInfo.commentCount}
        </span>
      </div>
      <div className={'ArticleCard-imageZone'}>
        <img alt={`youtuberspy user ${articleInfo.userName}`} className={'ArticleCard-image'} src={articleInfo.userPicture} />
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
};

ArticleCard.propTypes = {
  article: PropTypes.object.isRequired,
};

export default ArticleCard;
