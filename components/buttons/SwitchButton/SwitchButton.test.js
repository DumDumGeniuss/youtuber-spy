import SwitchButton from './SwitchButton';
import { mount } from 'enzyme';

const setup = (propOverrides) => {
  const props = Object.assign({
    isOn: false,
    text: 'Hey',
    onClick: jest.fn(),
  }, propOverrides);

  const wrapper = mount(<SwitchButton {...props} />);

  return {
    props,
    wrapper,
    // clear: wrapper.find('.clear-completed'),
  };
};

describe('SwitchButton component', () => {
  it('render', () => {
    const { wrapper } = setup({});
    const parentNode = wrapper.find('.SwitchButton-zone');
    expect(parentNode.length).toBe(1);
  });
});
