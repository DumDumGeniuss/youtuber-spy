import locales from '../locales/index';

const initState = {
  language: 'zh-TW',
  words: locales['zh-TW'],
};

const i18n = (state = initState, action) => {
  switch (action.type) {
    case 'CHANGE_LANGUAGE':
      return { ...state, language: action.language, words: locales[action.language] };
    default:
      return state;
  }
};

export default i18n;
