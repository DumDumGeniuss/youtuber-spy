import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import stylesheet from './CommentCard.scss';

const CommentCard = (props) => {
  const commentInfo = props.comment;
  return (
    <div className={'CommentCard-zone'}>
      <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
      <div className={'CommentCard-pictureZone'}>
        <img alt={`youtuberspy comment ${commentInfo.userName}`} className={'CommentCard-picture'} src={commentInfo.userPicture} />
      </div>
      <span className={'CommentCard-userName'}>{commentInfo.userName}</span>
      <span className={'CommentCard-date'}>{moment(new Date(commentInfo.createdAt)).format('YYYY-MM-DD HH:mm')}</span>
      <div className={'CommentCard-contentZone'}>
        <p className={'CommentCard-content'}>{commentInfo.content}</p>
      </div>
    </div>
  );
};

CommentCard.propTypes = {
  comment: PropTypes.object.isRequired,
};

export default CommentCard;
