import TitleSection from './TitleSection';
import { mount } from 'enzyme';

const setup = (propOverrides) => {
  const props = Object.assign({
    titleFonts: 'Weeee',
    contentFonts: 'Yo',
  }, propOverrides);

  const wrapper = mount(<TitleSection {...props} />);

  return {
    props,
    wrapper,
    // clear: wrapper.find('.clear-completed'),
  };
};

describe('TitleSection component', () => {
  it('render', () => {
    const { wrapper } = setup({});
    const parentNode = wrapper.find('.TitleSection-zone');
    expect(parentNode.length).toBe(1);
  });
});
