export function deepSearchObject(obj, searchString, approved) {
  for (const key in obj) {
    if (
      typeof obj[key] === 'string' &&
      obj[key].includes(searchString) &&
      !obj[key].includes(approved)
    ) {
      return true;
    } else if (typeof obj[key] === 'object') {
      if (deepSearchObject(obj[key], searchString)) {
        return true;
      }
    }
  }
  return false;
}
