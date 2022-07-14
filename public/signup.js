const createBody = () => {
  const signupForm = document.querySelector('#signup');
  return new URLSearchParams(new FormData(signupForm));
};

const validateUser = () => {
  const body = createBody();

  const xhr = new XMLHttpRequest();
  xhr.open('POST', '/signup');
  console.log('Posted');
  xhr.send(body);

  const messageElement = document.querySelector('#message');
  xhr.onload = () => {
    console.log(xhr);
    if (xhr.status === 409) {
      messageElement.innerText = 'User already exist';
      messageElement.style.color = 'red';
    }
    if (xhr.status === 200) {
      messageElement.innerText = 'Register Succeccfully';
      messageElement.style.color = 'green';
    }
  };
};

const main = () => {
  const submitBtn = document.querySelector('#signupBtn');
  submitBtn.addEventListener('click', (event) => {
    validateUser();
    event.preventDefault();
  });
};

window.onload = main;