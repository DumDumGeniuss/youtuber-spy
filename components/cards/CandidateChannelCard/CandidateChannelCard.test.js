import CandidateChannelCard from './CandidateChannelCard';
import { mount } from 'enzyme';

const setup = (propOverrides) => {
  const props = Object.assign({
    candidateChannelInfo: {
      subscriberCount: 100,
      viewCount: 100,
      videoCount: 100,
      commentCount: 100,
    },
    i18nWords: {},
    isSuperUser: false,
    clickVerify: jest.fn(),
    clickDelete: jest.fn(),
  }, propOverrides);

  const wrapper = mount(<CandidateChannelCard {...props} />);

  return {
    props,
    wrapper,
    // clear: wrapper.find('.clear-completed'),
  };
};

describe('CandidateChannelCard component', () => {
  it('render', () => {
    const { wrapper } = setup({});
    const parentNode = wrapper.find('.CandidateChannelCard-zone');
    expect(parentNode.length).toBe(1);
  });
});
