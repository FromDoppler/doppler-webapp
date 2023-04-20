# i18n tools

In this Doppler Web-App, we decided using
[Yahoo React Intl library](https://github.com/yahoo/react-intl), but in some scenarios, the
provided tools in the library are not enough.

## Country names

For example, we need to translate country names for our phone input component, in that case
we choose for using three different JSON files:

- [Country names in Spanish](./countries-es.json)
- [Country names in English](./countries-en.json)
- [Local name of the country](./countries-localized.json)

All of JSONs are indexed by ISO country code, and we merged them using this format:
`{name in current lang: es/en} ({local name})`, with the exception when the total length
is greater than 50, in that case we only use the name in local language.

## Standard localization files

At the beginning we used a hierarchical JSON file for each language and then flatten the resulting
objects as it is explained in [React Inlt Guid](https://github.com/yahoo/react-intl/wiki/Upgrade-Guide#flatten-messages-object).

The problem with that approach, is that JSON files are really limited: we cannot use line breaks.

An alternative could be using better file format, for example [JSON5](https://json5.org/) or
[YAML](https://es.wikipedia.org/wiki/YAML), but since we are using
[Create React App](https://facebook.github.io/create-react-app/) and we do not want to _eject_ it
yet, we cannot configure other loaders easily.

Better yet could be using files for some entries, for example:

```
i18n
 |
 +-- files
 |    |
 |    +-- legal-note.es.md
 |    |
 |    +-- legal-note.en.md
 |    |
 . . .
```

But, in order to use the filesystem to organize the values, we also need a custom loader o any
kind of pre-processing, so, by the moment is not an option.

Finally, as a compromise solution, we choose simply using JavaScript files, with some conventions.

## .js language files

Using standard JavaScript .js files for defining content, is not the perfect solution, mainly
because of they have too much flexibility.

For that reason we decided to following some conventions:

- Avoid complex imperative code.

- Limit the usage of variables and conscientiously consider each variable added.

- Limit the dependencies in the same way.

- Export only one default object defined in a JSON like way.

- In the result object, define all string properties using [ES6 Template Strings](https://developers.google.com/web/updates/2015/01/ES6-Template-Strings), in order to support line breaks.

- When some variable or property has HTML formatted content use the `_HTML` suffix.

- When some variable or property has Markdown formatted content use the `_MD` suffix.

- Try to keep lines shortner than 100 characters in HTML and Markdown content.

- When the content takes more than a line, start the value with a line ending and finalize in the
  same way.

      For Markdown do not use indentation inside the value, in HTML make honor to current

  indentation level inside the value.

      Markdown example:

      ```js
      export default {
        common: {
          copyright_MD: `
      © ${year} Doppler LLC. All rights reserved. [Privacy Policy & Legals](${urlPrivacy}).
      `,
          // . . .
      ```

      HTML example:

      ```js
      export default {
        common: {
          copyright_MD: `
            <p>
              © ${year} Doppler LLC. All rights reserved.
              <a href="${urlPrivacy}">Privacy Policy & Legals</a>.
            </p>
          `,
          // . . .
      ```
