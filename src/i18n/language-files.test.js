import 'jest';
import messages_es from './es.json';
import messages_en from './en.json';
import { flattenMessages } from './utils';

const flattenEs = flattenMessages(messages_es);
const flattenEn = flattenMessages(messages_en);
const unsortedKeysEn = Object.keys(flattenEn);
const unsortedKeysEs = Object.keys(flattenEs);
const sortedKeysEn = Object.keys(flattenEn).sort();
const sortedKeysEs = Object.keys(flattenEs).sort();

describe('language files', () => {
  it('should have the same number of keys', () => {
    expect(flattenEn.length).toEqual(flattenEs.length);
  });

  it('should have the same keys in any order', () => {
    expect(sortedKeysEn).toEqual(sortedKeysEs);
  });

  describe('en', () => {
    it('should sort the keys alphabetically', () => {
      expect(unsortedKeysEn).toEqual(sortedKeysEn);
    });
  });

  describe('es', () => {
    it('should sort the keys alphabetically', () => {
      expect(unsortedKeysEs).toEqual(sortedKeysEs);
    });
  });
});
