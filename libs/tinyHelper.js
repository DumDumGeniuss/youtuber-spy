export const getQueryString = (query) => {
  return '?' + Object.keys(query)
    .map((key) => encodeURIComponent(key) + "=" + encodeURIComponent(query[key]))
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
