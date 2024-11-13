export function deepSearchObject(obj: { [x: string]: any; }, searchString: string, approved: string | undefined): { [key: string]: any; }[] | false {
  for (const key in obj) {
    let foundUnApproved = [];
    if (
      typeof obj[key] === 'string' &&
      obj[key].includes(searchString) &&
      !obj[key].includes(approved!) &&
      foundUnApproved.push({ [key]: obj[key] })
    ) {
      return foundUnApproved;
    } else if (typeof obj[key] === 'object') {
      if (deepSearchObject(obj[key], searchString, approved)) {
        return  foundUnApproved;
      }
    }
  }
  return false;
}
