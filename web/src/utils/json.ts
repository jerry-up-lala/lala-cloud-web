export const stringEmpty = (jsonStr?: string, empty = false) => {
  return empty ? '' : jsonStr;
};

export const jsonParse = (jsonStr?: string, empty = false): any => {
  try {
    if (jsonStr) {
      return JSON.parse(jsonStr);
    }
    return stringEmpty(jsonStr, empty);
  } catch (err) {
    return stringEmpty(jsonStr, empty);
  }
};
