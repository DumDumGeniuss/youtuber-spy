import React from 'react';
import FaCircleONotch from 'react-icons/lib/fa/circle-o-notch';
import stylesheet from './ArticleInputModal.scss';

class ArticleInputModal extends React.Component {
  static getInitialProps({ query }) {
    return {
      query,
    };
  }

  constructor(props) {
    super(props);
    this.title = '';
    this.titleImage = '';
    this.content = '';
  }

  componentDidMount() {
    // console.log(this.props.query);
  }

  componentWillUnmount() {
  }

  handleTitleChange(event) {
    this.title = event.target.value;
  }

  handleTitleImageChange(event) {
    this.titleImage = event.target.value;
  }

  handleContentChange(event) {
    this.content = event.target.value;
  }


  _onClickYes() {
    if (this.props.isLoading) {
      return;
    }
    this.props.clickYes(this.title, this.titleImage, this.content);
  }

  _onClickNo() {
    if (this.props.isLoading) {
      return;
    }
    this.props.clickNo();
  }

  render() {
    return (
      <div className={'ArticleInputModal-zone'}>
        <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
        <div className={'ArticleInputModal-contentZone'}>
          <div className={'ArticleInputModal-info'}>
            <span>{this.props.message}</span>
          </div>
          <div className={'ArticleInputModal-inputZone'}>
            {this.props.errorMessage ? 
              <div className={'ArticleInputModal-errorMessage'}>{this.props.errorMessage}</div> : null}
            <div className={'ArticleInputModal-itemTitle'}>標題</div>
            <div className={'ArticleInputModal-itemInput'}>
              <input onChange={this.handleTitleChange.bind(this)}/>
            </div>
            <div className={'ArticleInputModal-itemTitle'}>標題圖片</div>
            <div className={'ArticleInputModal-itemInput'}>
              <input onChange={this.handleTitleImageChange.bind(this)}/>
            </div>
            <div className={'ArticleInputModal-itemTitle'}>描述</div>
            <div className={'ArticleInputModal-itemInput'}>
              <textarea onChange={this.handleContentChange.bind(this)} rows={'10'}/>
            </div>
          </div>
          <div className={'ArticleInputModal-func'}>
            <span onClick={this._onClickYes.bind(this)}>{this.props.isLoading ? <FaCircleONotch/> : '繼續'}</span>
            <span onClick={this._onClickNo.bind(this)}>{this.props.isLoading ? <FaCircleONotch/> : '取消'}</span>
          </div>
        </div>
      </div>
    );
  }
}

export default ArticleInputModal;
