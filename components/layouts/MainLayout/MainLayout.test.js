import MainLayout from './MainLayout';
import { mount } from 'enzyme';

const setup = (propOverrides) => {
  const props = Object.assign({
    userInfo: null,
    children: <div />,
    isRouterChanging: false,
    doLogin: jest.fn(),
    doLogout: jest.fn(),
    doTouchBottom: jest.fn(),
    words: {},
  }, propOverrides);

  const wrapper = mount(<MainLayout {...props} />);

  return {
    props,
    wrapper,
    // clear: wrapper.find('.clear-completed'),
  };
};

describe('MainLayout component', () => {
  it('render', () => {
    const { wrapper } = setup({});
    const parentNode = wrapper.find('.MainLayout-zone');
    expect(parentNode.length).toBe(1);
  });
});
