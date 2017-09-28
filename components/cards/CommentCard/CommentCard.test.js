import CommentCard from './CommentCard';
import { mount } from 'enzyme';

const setup = (propOverrides) => {
  const props = Object.assign({
    comment: {
      createdAt: '2017-01-01',
    },
  }, propOverrides);

  const wrapper = mount(<CommentCard {...props} />);

  return {
    props,
    wrapper,
    // clear: wrapper.find('.clear-completed'),
  };
};

describe('CommentCard component', () => {
  it('render', () => {
    const { wrapper } = setup({});
    const parentNode = wrapper.find('.CommentCard-zone');
    expect(parentNode.length).toBe(1);
  });
});
