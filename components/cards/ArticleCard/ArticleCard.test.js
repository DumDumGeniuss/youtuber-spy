import ArticleCard from './ArticleCard';
import { mount } from 'enzyme';

const setup = (propOverrides) => {
  const props = Object.assign({
    article: {},
  }, propOverrides);

  const wrapper = mount(<ArticleCard {...props} />);

  return {
    props,
    wrapper,
    // clear: wrapper.find('.clear-completed'),
  };
};

describe('ArticleCard component', () => {
  it('render', () => {
    const { wrapper } = setup({});
    const parentNode = wrapper.find('.ArticleCard-zone');
    expect(parentNode.length).toBe(1);
  });
});
