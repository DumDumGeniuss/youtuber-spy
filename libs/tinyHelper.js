export const getQueryString = (query, noEncodeParams, noWrapParams) => {
  const theNoEncodeParams = noEncodeParams || [];
  const theNoWrapParams = noWrapParams || [];
  const keys = Object.keys(query);
  const keySize = keys.length;
  for(let i = 0; i < keySize; i++) {
    if (theNoWrapParams.indexOf(keys[i]) >=0) {
      keys.splice(i, 1);
    }
  }
  return '?' + keys.map((key) => {
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
