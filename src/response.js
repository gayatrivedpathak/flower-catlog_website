const EOL = '\r\n';
const statusMessages = {
  200: 'OK',
  404: 'File Not Found',
  302: 'Moved permenantly'
};

class Response {
  #socket;
  #statusCode;
  #headers;
  constructor(socket) {
    this.#socket = socket;
    this.#statusCode = 200;
    this.#headers = {};
  }

  set statusCode(code) {
    this.#statusCode = code;
  }

  addHeader(field, value) {
    this.#headers[field.toLowerCase()] = value;
  }

  write(content) {
    this.#socket.write(content);
  }

  #statusLine() {
    const httpVersion = 'HTTP/1.1';
    const statusMessage = statusMessages[this.#statusCode];
    return [httpVersion, this.#statusCode, statusMessage].join(' ') + EOL;
  }

  #writeHeaders() {
    Object.entries(this.#headers).forEach(([field, value]) =>
      this.write(`${field}: ${value}${EOL}`)
    );
  }

  send(body) {
    this.addHeader('content-length:', body.length);
    this.write(this.#statusLine());
    this.#writeHeaders();
    this.write(EOL);
    this.write(body);
    this.#socket.end();
  }
};

exports.Response = Response;
