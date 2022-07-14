const createBody = () => {
  const commentForm = document.querySelector('#guest-book');
  return new URLSearchParams(new FormData(commentForm));
};

const createRow = (username, date, comment) => {
  const rowElement = document.createElement('tr');

  const dateField = document.createElement('td');
  dateField.innerText = date;
  rowElement.appendChild(dateField);

  const usernameField = document.createElement('td');
  usernameField.innerText = username;
  rowElement.appendChild(usernameField);

  const commentField = document.createElement('td');
  commentField.innerText = comment;
  rowElement.appendChild(commentField);
  return rowElement;
};

const updatePage = (xhr) => {
  const comments = JSON.parse(xhr.response);
  const tableElement = document.querySelector('#comments');
  tableElement.innerHTML = null;

  comments.forEach(({ username, date, comment }) => {
    const rowElement = createRow(username, date, comment);
    console.log(rowElement);
    tableElement.append(rowElement);
  });
};

const getComments = () => {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', '/api');
  xhr.send();
  xhr.onload = () => {
    updatePage(xhr);
  }
};

const postComment = () => {
  const body = createBody();

  const xhr = new XMLHttpRequest();
  xhr.open('POST', '/add-comment');
  xhr.send(body);
  xhr.onload = () => {
    if (xhr.status === 201) {
      getComments();
      return;
    };
  }
};

const main = () => {
  const buttonElement = document.querySelector('#submit');
  buttonElement.addEventListener('click', (event) => {
    event.preventDefault();
    postComment();
  });
};

window.onload = main;
