import PaginationBox from './PaginationBox';
import { mount } from 'enzyme';

const setup = (propOverrides) => {
  const props = Object.assign({
    initPage: 1,
    pageNumber: 5,
    refreshToken: 'aaaa',
    url: 'bbbbb',
  }, propOverrides);

  const wrapper = mount(<PaginationBox {...props} />);

  return {
    props,
    wrapper,
    // clear: wrapper.find('.clear-completed'),
  };
};

describe('PaginationBox component', () => {
  it('render', () => {
    const { wrapper } = setup({});
    const parentNode = wrapper.find('.PaginationBox-zone');
    expect(parentNode.length).toBe(1);
  });
});
