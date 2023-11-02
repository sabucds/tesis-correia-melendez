/**
 * Converts a string to camel case
 *
 * @param    {string} str  the string to be converted
 * @returns  {string}      the camel case string
 *
 * @example getCamelCase('Lorem Ipsum') -> 'loremIpsum'
 * @example getCamelCase('lorem ipsum') -> 'loremIpsum'
 * @example getCamelCase('lorem-ipsum') -> 'loremIpsum'
 * @example getCamelCase('loremipsum') -> 'loremipsum'
 */
export function getCamelCase(str: string): string {
  // Get words from white spaces or dashes
  const words = str.split(/[\s-]/);

  // Construct camel case string
  const camelCase = words.reduce((acc, word) => {
    // If it's the first word, make it lowercase on the first letter
    // Otherwise, make it uppercase on the first letter
    const first = acc === '' ? word[0].toLowerCase() : word[0].toUpperCase();
    // If it's not the first word, make it uppercase on the first letter
    return `${acc}${first}${word.slice(1)}`;
  }, '');

  // Return camel case string
  return camelCase;
}

/**
 * Converts a string to its plural form
 *
 * @param    {string} word  the string to be converted
 * @returns  {string}       the plural form of the string
 *
 * @example pluralize('currency') -> 'currencies'
 */
export function pluralize(word: string): string {
  const plural: { [key: string]: string } = {
    '(quiz)$': '$1zes',
    '^(ox)$': '$1en',
    '([m|l])ouse$': '$1ice',
    '(matr|vert|ind)ix|ex$': '$1ices',
    '(x|ch|ss|sh)$': '$1es',
    '([^aeiouy]|qu)y$': '$1ies',
    '(hive)$': '$1s',
    '(?:([^f])fe|([lr])f)$': '$1$2ves',
    '(shea|lea|loa|thie)f$': '$1ves',
    sis$: 'ses',
    '([ti])um$': '$1a',
    '(tomat|potat|ech|her|vet)o$': '$1oes',
    '(bu)s$': '$1ses',
    '(alias)$': '$1es',
    '(octop)us$': '$1i',
    '(ax|test)is$': '$1es',
    '(us)$': '$1es',
    '([^s]+)$': '$1s',
  };
  const irregular: { [key: string]: string } = {
    move: 'moves',
    foot: 'feet',
    goose: 'geese',
    sex: 'sexes',
    child: 'children',
    man: 'men',
    tooth: 'teeth',
    person: 'people',
  };
  const uncountable: string[] = [
    'sheep',
    'fish',
    'deer',
    'moose',
    'series',
    'species',
    'money',
    'rice',
    'information',
    'equipment',
    'bison',
    'cod',
    'offspring',
    'pike',
    'salmon',
    'shrimp',
    'swine',
    'trout',
    'aircraft',
    'hovercraft',
    'spacecraft',
    'sugar',
    'tuna',
    'you',
    'wood',
  ];

  // save some time in the case that singular and plural are the same
  if (uncountable.indexOf(word.toLowerCase()) >= 0) return word;

  // Check for irregular forms
  const result = Object.getOwnPropertyNames(irregular).reduce((acc, curr) => {
    if (acc) return acc;
    const _pattern = new RegExp(`${curr}$`, 'i');
    const replace = irregular[curr];
    if (_pattern.test(word)) return word.replace(_pattern, replace);
    return acc;
  }, null);
  if (result) return result;

  // Check for matches using regular expressions
  const result2 = Object.getOwnPropertyNames(plural).reduce((acc, curr) => {
    if (acc) return acc;
    const _pattern = new RegExp(curr, 'i');
    if (_pattern.test(word)) return word.replace(_pattern, plural[curr]);
    return acc;
  }, null);
  if (result2) return result2;

  return word;
}
