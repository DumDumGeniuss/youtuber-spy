import { languageRanking, languageMap } from '../locales/default';
import acceptLanguage from 'accept-language';

acceptLanguage.languages(languageRanking);

export function changeLanguage(headerLanguage) {
  const language = languageMap[acceptLanguage.get(headerLanguage)];
  return {
    type: 'CHANGE_LANGUAGE',
    language,
  };
}
