export const stringifyReplacer = (key, value) => {
    if (typeof value === 'string') {
      return value.replace(/'/g, '"');
    }

    return value
}