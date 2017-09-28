import ErrorBox from './ErrorBox';
import { mount } from 'enzyme';

const setup = (propOverrides) => {
  const props = Object.assign({
    status: 0,
    message: 'hello',
  }, propOverrides);

  const wrapper = mount(<ErrorBox {...props} />);

  return {
    props,
    wrapper,
    // clear: wrapper.find('.clear-completed'),
  };
};

describe('ErrorBox component', () => {
  it('render', () => {
    const { wrapper } = setup({});
    const parentNode = wrapper.find('.ErrorBox-zone');
    expect(parentNode.length).toBe(1);
  });
});
