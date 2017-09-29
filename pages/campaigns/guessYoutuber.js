import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import withRedux from 'next-redux-wrapper';

import HeadWrapper from '../../components/tags/HeadWrapper/HeadWrapper';
import MainLayoutContainer from '../../containers/layouts/MainLayout/MainLayoutContainer';
import { initStore } from '../../store/initStore';
import * as userAction from '../../actions/user';
import * as i18nAction from '../../actions/i18n';
import * as channelAction from '../../actions/channel';
import * as channelApi from '../../apis/channel';

import stylesheet from './guessYoutuber.scss';

const setMessage = (score, questionCount) => {
  if (questionCount < 10) {
    return '您將會在十題之後得到我們對您的評價';
  }
  if (score <= 10) {
    return '我家養的哈士奇都比你會認Youtuber，加油好嗎？';
  }
  if (score <= 20) {
    return '今天我隨便去廟會拉一個阿公來都可以拿到這成績。';
  }
  if (score <= 30) {
    return '我用Windows95來做辨識，得到的成績都比你好...。';
  }
  if (score <= 40) {
    return '昨天我找一個非洲小朋友來玩，成績跟你差不多。';
  }
  if (score <= 50) {
    return '拜託你去補足一下你的知識再來玩，別來沾邊。';
  }
  if (score <= 60) {
    return '每答錯一題，你就會釋放0.1公克的二氧化碳，你都不愧疚？';
  }
  if (score <= 70) {
    return '他是我認為，唯一可以取代我家垃圾桶的選手。';
  }
  if (score <= 80) {
    return '痾...我覺得可以。';
  }
  if (score <= 90) {
    return '如果MIT有Youtuber這個Subject，你肯定能拿到phD';
  }
  return '神的境界，你在Youtuber辨識界的地位就跟賈伯斯一樣高。';
};


const defaultQuery = {
  sort: 'publishedAt',
  order: 'desc',
  keyword: '',
  category: '',
  country: '',
  page: 1,
  count: 1000,
  dataSet: 'basic',
};
// localStorage.setItem('state', 'off');
class GuessYoutuber extends React.Component {
  static async getInitialProps({ store, req }) {
    if (req) {
      store.dispatch(i18nAction.changeLanguage(req.headers['accept-language']));
    }

    const result = await channelApi.getAllChannels(defaultQuery);
    store.dispatch(
      channelAction.getChannels(
        result.datas,
        result.totalCount,
        result.channelCategories,
        result.countryCategories,
        result.token,
      ),
    );
  }

  constructor(props) {
    super(props);

    this.channels = this.props.channel.channels;
    this.channelsSize = this.channels.length;
    this.pickNumber = 4;

    const initChannelIndex =
      parseInt(Math.random() * ((this.channelsSize - this.pickNumber) + 1), 10);

    this.state = {
      questionCount: 0,
      correctCount: 0,
      startChannelIndex: initChannelIndex,
      rightChannelIndex: initChannelIndex + parseInt(Math.random() * 4, 10),
    };

    this.seletcAnswer = this.seletcAnswer.bind(this);
  }

  componentWillUnmount() {}

  seletcAnswer(index) {
    return () => {
      const newStartChannelIndex =
        parseInt(Math.random() * ((this.channelsSize - this.pickNumber) + 1), 10);

      this.setState((state) => {
        const newState = {};
        if (index === this.state.rightChannelIndex) {
          newState.correctCount = state.correctCount + 1;
        } else {
          newState.correctCount = state.correctCount;
        }

        newState.questionCount = state.questionCount + 1;
        newState.startChannelIndex = newStartChannelIndex;
        newState.rightChannelIndex = newStartChannelIndex + parseInt(Math.random() * 4, 10);

        return newState;
      });
    };
  }

  render() {
    const i18nWords = this.props.i18n.words;
    const rightChannel = this.channels[this.state.rightChannelIndex];
    const selectedChannels =
      this.channels.slice(
        this.state.startChannelIndex,
        this.state.startChannelIndex + this.pickNumber,
      );
    const correctRate =
      parseInt((this.state.correctCount * 100) / (this.state.questionCount || 1), 10);
    const message = setMessage(correctRate, this.state.questionCount);

    return (
      <div>
        <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
        <HeadWrapper
          title={'Youtuber看門狗-超級認識王'}
          description={`
              來看看你認識多少Youtuber吧？
            `}
          type={'website'}
          image={'https://www.youtuberspy.com/static/youtuber-select.jpg'}
          url={'https://www.youtuberspy.com/campaigns/guessYoutuber'}
          siteName={'Youtuber看門狗-在這裡發掘您喜歡的Youtubers！'}
          fbAppId={'158925374651334'}
        />
        <MainLayoutContainer i18nWords={i18nWords}>
          <div className={'GuessYoutuber-zone'}>
            <h1 className={'GuessYoutuber-zoneTitle'}>這是哪一位Youtuber？</h1>
            <div className={'GuessYoutuber-channelPictureZone'}>
              <img alt={`channel ${rightChannel.title}`}src={rightChannel.highThumbnails} />
            </div>
            <span className={'GuessYoutuber-message'}>
              {message}
            </span>
            <h3 className={'GuessYoutuber-zoneSubTitle'}>
              {`答對數: ${this.state.correctCount} - 總題數: ${this.state.questionCount}`}
            </h3>
            <h3 className={'GuessYoutuber-zoneSubTitle'}>
              {`正確率: ${correctRate}%`}
            </h3>
            {
              selectedChannels.map((selectedChannel, index) => (
                <div
                  key={selectedChannel._id}
                  className={'GuessYoutuber-selectButtonZone'}
                >
                  <span
                    role={'button'}
                    tabIndex={0}
                    className={'GuessYoutuber-selectButton'}
                    onClick={this.seletcAnswer(this.state.startChannelIndex + index)}
                  >
                    {selectedChannel.title}
                  </span>
                </div>
              ))
            }
          </div>
        </MainLayoutContainer>
      </div>
    );
  }
}

GuessYoutuber.propTypes = {
  channel: PropTypes.object.isRequired,
  i18n: PropTypes.object.isRequired,
};

const mapStateToProps = state => (
  {
    user: state.user,
    channel: state.channel,
    i18n: state.i18n,
  }
);

const mapDispatchToProps = dispatch => (
  {
    getUser: bindActionCreators(userAction.getUser, dispatch),
  }
);

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(GuessYoutuber);
