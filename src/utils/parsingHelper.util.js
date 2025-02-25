export const stringifyReplacer = (key, value) => {
    if (typeof value === 'string') {
      return value.replace(/'/g, '"');
    }

    return value
}

export const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function splitAndKeepDelimiter(str, delimiter) {
  const parts = str.split(new RegExp(`(${delimiter})`, 'g'));
  return parts;
}