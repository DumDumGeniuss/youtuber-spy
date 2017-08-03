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
        <figure className={'ArticleCard-titleImage'}>
          <img src={articleInfo.titleImage}/>
        </figure>
        <section className={'ArticleCard-contentZone'}>
          <Link href={'/articles/singleArticle?articleId=' + articleInfo._id}><a>
            <h2 className={'ArticleCard-title'}>{articleInfo.title}</h2>
          </a></Link>
          <h6 className={'ArticleCard-content'}>{timeString}</h6>
          <p className={'ArticleCard-content'}>{articleInfo.content}</p>
        </section>
      </div>
    );
  }
}

export default ArticleCard;
