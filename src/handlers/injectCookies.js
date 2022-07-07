const parseCookies = (cookieString) => {
  const cookies = {};

  if (!cookieString) {
    return cookies;
  }

  cookieString.split(';').forEach(cookie => {
    const [name, value] = cookie.split('=');
    cookies[name] = value;
  });

  return cookies;
};

const injectCookies = (request, response, next) => {
  const { cookie } = request.headers;
  request.cookies = parseCookies(cookie);
  next();
};

module.exports = { injectCookies };
