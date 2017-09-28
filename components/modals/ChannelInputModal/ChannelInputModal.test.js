import ChannelInputModal from './ChannelInputModal';
import { mount } from 'enzyme';

const setup = (propOverrides) => {
  const props = Object.assign({
    message: 'aaaaaa',
    errorMessage: 'bbbbbb',
    isLoading: false,
    clickYes: jest.fn(),
    clickNo: jest.fn(),
  }, propOverrides);

  const wrapper = mount(<ChannelInputModal {...props} />);

  return {
    props,
    wrapper,
    // clear: wrapper.find('.clear-completed'),
  };
};

describe('ChannelInputModal component', () => {
  it('render', () => {
    const { wrapper } = setup({});
    const parentNode = wrapper.find('.ChannelInputModal-zone');
    expect(parentNode.length).toBe(1);
  });
});
