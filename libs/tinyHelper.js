import moment from 'moment';

export const getQueryString = (query, noEncodeParams, noWrapParams) => {
  const theNoEncodeParams = noEncodeParams || [];
  const theNoWrapParams = noWrapParams || [];
  const keys = Object.keys(query);
  const keySize = keys.length;
  for (let i = 0; i < keySize; i += 1) {
    if (theNoWrapParams.indexOf(keys[i]) >= 0) {
      keys.splice(i, 1);
    }
  }
  const paramsString = keys.map((key) => {
    if (theNoEncodeParams.indexOf(key) >= 0) {
      return `${encodeURIComponent(key)}=${query[key]}`;
    }
    return `${encodeURIComponent(key)}=${encodeURIComponent(query[key])}`;
  })
    .join('&')
    .replace(/%20/g, '+');
  return `?${paramsString}`;
};

export const generateDailyChartConfig = (datas, title, xAxisParam, yAxisParam, count) => {
  const targetDatas = datas.slice(0, count + 1);
  const xAxis = [];
  const yAxis = [];
  const neededDatasSize = targetDatas.length - 1;

  for (let i = 0; i < neededDatasSize; i += 1) {
    let xAxisValue = targetDatas[i + 1][xAxisParam];
    if (xAxisParam === 'date') {
      xAxisValue = moment(new Date(xAxisValue)).format('MM-DD');
    }
    xAxis.unshift(xAxisValue);
    yAxis.unshift(targetDatas[i][yAxisParam] - targetDatas[i + 1][yAxisParam]);
  }

  return {
    title: {
      text: title,
    },
    xAxis: {
      categories: xAxis,
    },
    series: [
      {
        name: title,
        data: yAxis,
      },
    ],
  };
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
