export const getQueryString = (query, noEncodeParams) => {
  const theNoEncodeParams = noEncodeParams || [];
  return '?' + Object.keys(query)
    .map((key) => {
      if (theNoEncodeParams.indexOf(key) >= 0) {
        return encodeURIComponent(key) + "=" + query[key];
      } else {
        return encodeURIComponent(key) + "=" + encodeURIComponent(query[key]);
      }
    })
    .join("&")
    .replace(/%20/g, "+");
};

export const removeDuplicated = (array) => {
  const checkMap = {};
  const newArray = [];
  array.forEach((item) => {
    if (!checkMap[item._id]) {
      checkMap[item._id] = true;
      newArray.push(item);
    }
  });
  return newArray;
};
