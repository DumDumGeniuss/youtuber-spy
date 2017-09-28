import ConfirmModal from './ConfirmModal';
import { mount } from 'enzyme';

const setup = (propOverrides) => {
  const props = Object.assign({
    show: true,
    isLoading: false,
    message: 'Hello',
    clickYes: jest.fn(),
    clickNo: jest.fn(),
  }, propOverrides);

  const wrapper = mount(<ConfirmModal {...props} />);

  return {
    props,
    wrapper,
    // clear: wrapper.find('.clear-completed'),
  };
};

describe('ConfirmModal component', () => {
  it('render', () => {
    const { wrapper } = setup({});
    const parentNode = wrapper.find('.ConfirmModal-zone');
    expect(parentNode.length).toBe(1);
  });
});
