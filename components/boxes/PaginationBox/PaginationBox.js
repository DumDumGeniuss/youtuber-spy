import React from 'react';
import PropTypes from 'prop-types';

import stylesheet from './PaginationBox.scss';

import ChevronLeft from 'react-icons/lib/fa/chevron-left';
import ChevronRight from 'react-icons/lib/fa/chevron-right';

class PaginationBox extends React.Component {
  static getInitialProps({ isServer }) {
    return {
      isServer,
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      pageClicked: 1,
    };
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

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  onPageClick(page) {
    if (this.props.lockButton) {
      return;
    }
    let newPage = page;
    if (newPage < 1) {
      newPage = 1;
    } else if (newPage > this.props.pageNumber) {
      newPage = this.props.pageNumber;
    }
    /* If page equals to newPage , means newPage is fine */
    if ( newPage === page) {
      this.setState({
        pageClicked: newPage,
      });
  
      this.props.onChangePage(newPage);
    }
  }

  render() {
    const pageNumber = this.props.pageNumber;
    const pageClicked = this.state.pageClicked;
    const pageStart = pageClicked - 3 < 1 ? 1 : pageClicked - 3;
    const pageEnd = pageStart + 6 > pageNumber ? pageNumber : pageStart + 6;
    const pageList = [];
    for (let i = pageStart; i <= pageEnd; i++) {
      pageList.push(i);
    }

    return (
      <div className={'PaginationBox-zone'}>
        <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
        <div className={'PaginationBox-contentZone'}>
          <button className={'PaginationBox-button'} onClick={this.onPageClick.bind(this, pageClicked - 1)}>
            <ChevronLeft/>
          </button>
          {pageList.map((item) => {
            return (
              <button
                key={item}
                className={item === pageClicked ? 'PaginationBox-buttonClicked' : 'PaginationBox-button'}
                onClick={this.onPageClick.bind(this, item)}
              >
                {item}
              </button>
            );
          })}
          <button className={'PaginationBox-button'} onClick={this.onPageClick.bind(this, pageClicked + 1)}>
            <ChevronRight/>
          </button>
        </div>
      </div>
    );
  }
}

export default PaginationBox;
