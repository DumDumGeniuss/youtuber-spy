import YoutubeVideoCard from './YoutubeVideoCard';
import { mount } from 'enzyme';

const setup = (propOverrides) => {
  const props = Object.assign({
    videoInfo: {
      viewCount: 100,
      description: 'aaaaaaaaaaaa',
      publishedAt: '2017-01-01',
    },
  }, propOverrides);

  const wrapper = mount(<YoutubeVideoCard {...props} />);

  return {
    props,
    wrapper,
    // clear: wrapper.find('.clear-completed'),
  };
};

describe('YoutubeVideoCard component', () => {
  it('render', () => {
    const { wrapper } = setup({});
    const parentNode = wrapper.find('.YoutubeVideoCard-zone');
    expect(parentNode.length).toBe(1);
  });
});
