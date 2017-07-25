import locales from '../locales/index';

const initState = {
  language: 'zh_TW',
  words: locales['zh_TW'],
};

const i18n = (state = initState, action) => {
  switch (action.type) {
    case 'CHANGE_LANGUAGE':
      return;
    default:
      return state;
  }
};

export default i18n;
