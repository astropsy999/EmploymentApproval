export function deepSearchObject(obj: { [x: string]: any; }, searchString: string, approved: string | undefined) {
  for (const key in obj) {
    if (
      typeof obj[key] === 'string' &&
      obj[key].includes(searchString) &&
      !obj[key].includes(approved!)
    ) {
      return true;
    } else if (typeof obj[key] === 'object') {
      if (deepSearchObject(obj[key], searchString, approved)) {
        return true;
      }
    }
  }
  return false;
}
