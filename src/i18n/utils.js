export function flattenMessages(nestedMessages, prefix = '') {
  return Object.keys(nestedMessages).reduce((messages, key) => {
    let value = nestedMessages[key];
    let prefixedKey = prefix ? `${prefix}.${key}` : key;

    if (typeof value === 'string') {
      messages[prefixedKey] = value;
    } else {
      Object.assign(messages, flattenMessages(value, prefixedKey));
    }

    return messages;
  }, {});
}

export const defaultLanguage = 'es';

export const availableLanguageOrNull = (lang) =>
  (lang && ['es', 'en'].includes(lang) && lang) || null;

export const availableLanguageOrDefault = (lang) =>
  availableLanguageOrNull(lang) || defaultLanguage;
