const parseUri = (rawUri) => {
  const queryParams = {};
  const [uri, queryString] = rawUri.split('?');
  if (queryString) {
    const params = queryString.split('&');
    params.forEach(param => {
      const [name, value] = param.split('=');
      queryParams[name] = value;
    });
  }

  return { uri, queryParams };
};

const parseRequestLine = (line) => {
  const [method, rawUri, httpVersion] = line.split(' ');
  return { method, ...parseUri(rawUri), httpVersion };
};

const splitHeader = (line) => {
  const valueIndex = line.indexOf(':');
  const header = line.substring(0, valueIndex).trim();
  const value = line.substring(valueIndex + 1, line.length).trim();
  return [header, value];
};

const parseHeaders = (lines) => {
  let index = 0;
  const headers = {};
  while (lines.length > index && lines[index].length > 0) {
    const [key, value] = splitHeader(lines[index]);
    headers[key] = value;
    index++;
  }
  return headers;
};

const parseRequest = (chunk) => {
  const lines = chunk.split('\r\n');
  const requestLine = parseRequestLine(lines[0]);
  const headers = parseHeaders(lines.splice(1));
  return { ...requestLine, headers };
};

module.exports = { parseHeaders, parseRequest, splitHeader };
