import * as tinyHelper from './tinyHelper';

test('Get query string normally', () => {
  const queryParams = {
    param1: 'hey',
    toEncrypt: '#',
  };
  const queryString = tinyHelper.getQueryString(queryParams);
  expect(queryString).toBe('?param1=hey&toEncrypt=%23');
});

test('Get query string normally without encryption', () => {
  const queryParams = {
    param1: 'hey',
    toEncrypt: '#',
  };
  const queryString = tinyHelper.getQueryString(queryParams, ['toEncrypt']);
  expect(queryString).toBe('?param1=hey&toEncrypt=#');
});

test('Get query string normally with some params excluded', () => {
  const queryParams = {
    param1: 'hey',
    toEncrypt: '#',
  };
  const queryString = tinyHelper.getQueryString(queryParams, [], ['toEncrypt']);
  expect(queryString).toBe('?param1=hey');
});
