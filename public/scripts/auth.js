const loader = `<svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>`,
  // get all input elements
  userNameInput = document.getElementById('Username'),
  passwordInput = document.getElementById('Password'),
  username = userNameInput?.value,
  password = passwordInput?.value,
  submitButton = document.getElementById('submit'),
  signupButton = document.getElementById('signup'),
  feedbackElement = document.getElementById('form-feedback'),
  options = {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({
      username,
      password,
    }),
  };

function login(e) {
  e.preventDefault();

  const url = '/auth/signin';

  beforeReq(submitButton, 'Signing in...');

  fetch(url, options)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      if (data.statusCode === 401) {
        // invalid credentials
        feedbackElement.innerHTML = 'Incorrect username or password';
        submitButton.innerHTML = 'Sign in';
        userNameInput.focus();
        toggleDisabled();
        return;
      }

      onSuccessfulReq(data, submitButton, 'Signed in');
    })
    .catch((error) => {
      console.error('There was a problem with the POST request:', error);
    });
}

function signup(e) {
  e.preventDefault();

  const url = '/auth/signup';

  beforeReq(signupButton, 'Creating account...');

  fetch(url, options)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      if (data.statusCode === 400) {
        // username exists
        feedbackElement.innerHTML =
          'Username already exists. Sign in to continue';
        signupButton.innerHTML = 'Sign up';
        passwordInput.focus();
        toggleDisabled();
        return;
      }

      onSuccessfulReq(data, signupButton, 'Signed up');
    })
    .catch((error) => {
      console.error('There was a problem with the POST request:', error);
    });
}

function onSuccessfulReq(data, button, text) {
  // store data in localStorage for later use
  localStorage.setItem('userData', JSON.stringify(data));
  button.innerHTML = text;

  // enable auth buttons
  toggleDisabled();

  location.pathname = '/';
}

function beforeReq(button, text) {
  // show loading state
  button.innerHTML = loader + text;

  // disable auth buttons
  toggleDisabled(true);
}

function toggleDisabled(state) {
  if (state) {
    submitButton?.setAttribute('disabled', '');
    signupButton?.setAttribute('disabled', '');
  } else {
    submitButton?.removeAttribute('disabled');
    signupButton?.removeAttribute('disabled');
  }
}

document.querySelector('form')?.addEventListener('submit', login);
signupButton?.addEventListener('click', signup);
