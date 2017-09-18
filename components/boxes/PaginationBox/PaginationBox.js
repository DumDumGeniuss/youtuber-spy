import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

import stylesheet from './PaginationBox.scss';

import ChevronLeft from 'react-icons/lib/fa/chevron-left';
import ChevronRight from 'react-icons/lib/fa/chevron-right';

class PaginationBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pageClicked: parseInt(this.props.initPage, 10) || 1,
    };

    this.onPageClick = this.onPageClick.bind(this);
  }

  componentWillReceiveProps(newProps) {
    const newRefreshToken = newProps.refreshToken;
    const oldRefreshToken = this.props.refreshToken;
    /* If loading successfully, set isLoading to false */
    if (newRefreshToken !== oldRefreshToken) {
      this.setState({
        pageClicked: 1,
      });
    }
  }

  onPageClick(page) {
    return () => {
      this.setState({
        pageClicked: page,
      });
    };
  }

  render() {
    const pageNumber = this.props.pageNumber;
    const pageClicked = this.state.pageClicked;
    const pageStart = pageClicked - 3 < 1 ? 1 : pageClicked - 3;
    const pageEnd = pageStart + 6 > pageNumber ? pageNumber : pageStart + 6;
    const pageList = [];
    for (let i = pageStart; i <= pageEnd; i += 1) {
      pageList.push(i);
    }
    const url = this.props.url;

    return (
      <div className={'PaginationBox-zone'}>
        <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
        <div className={'PaginationBox-contentZone'}>
          <Link href={url.replace('$1', pageClicked - 1 || 1)}><a>
            <button className={'PaginationBox-button'} onClick={this.onPageClick(pageClicked - 1 || 1)}>
              <ChevronLeft />
            </button>
          </a></Link>
          {pageList.map(
            item =>
              (
                <Link key={item} href={url.replace('$1', item)}><a>
                  <button
                    className={item === pageClicked ? 'PaginationBox-buttonClicked' : 'PaginationBox-button'}
                    onClick={this.onPageClick(item)}
                  >
                    {item}
                  </button>
                </a></Link>
              ))}
          <Link href={url.replace('$1', pageClicked + 1 > pageNumber ? pageNumber : pageClicked + 1)}><a>
            <button className={'PaginationBox-button'} onClick={this.onPageClick(pageClicked + 1 > pageNumber ? pageNumber : pageClicked + 1)}>
              <ChevronRight />
            </button>
          </a></Link>
        </div>
      </div>
    );
  }
}

PaginationBox.propTypes = {
  initPage: PropTypes.number.isRequired,
  pageNumber: PropTypes.number.isRequired,
  refreshToken: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
};

export default PaginationBox;
