import HeadWrapper from './HeadWrapper';
import { mount } from 'enzyme';

const setup = (propOverrides) => {
  const props = Object.assign({
    title: 'We are the same',
    description: 'We are the same',
    type: 'We are the same',
    image: 'We are the same',
    url: 'We are the same',
    siteName: 'We are the same',
    fbAppId: 'We are the same',
  }, propOverrides);

  const wrapper = mount(<HeadWrapper {...props} />);

  return {
    props,
    wrapper,
    // clear: wrapper.find('.clear-completed'),
  };
};

describe('HeadWrapper component', () => {
  it('render', () => {
    const { wrapper } = setup({});
    expect(wrapper.props().title).toBe('We are the same');
  });
});
