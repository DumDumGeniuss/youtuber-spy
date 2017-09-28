import YoutuberChannelCard from './YoutuberChannelCard';
import { mount } from 'enzyme';

const setup = (propOverrides) => {
  const props = Object.assign({
    channelInfo: {
      subscriberCount: 100,
      viewCount: 100,
      videoCount: 100,
      commentCount: 100,
      publishedAt: '2017-01-01',
    },
  }, propOverrides);

  const wrapper = mount(<YoutuberChannelCard {...props} />);

  return {
    props,
    wrapper,
    // clear: wrapper.find('.clear-completed'),
  };
};

describe('YoutuberChannelCard component', () => {
  it('render', () => {
    const { wrapper } = setup({});
    const parentNode = wrapper.find('.YoutuberChannelCard-zone');
    expect(parentNode.length).toBe(1);
  });
});
