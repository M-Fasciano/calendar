const form = () => {
  // Get elements
  const txtEmail = document.getElementById('txtEmail');
  const txtPassword = document.getElementById('txtPassword');
  const btnLogIn = document.getElementById('logIn');
  const btnRegister = document.getElementById('register');
  const btnLogOut = document.getElementById('logOut');
  const calendar = document.querySelector('.wrapper');
  const errors = document.getElementById('errors');
  const wrapper = document.querySelector('.form__wrapper');

  // Add login event
  btnLogIn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Get email and password
    const email = txtEmail.value;
    const password = txtPassword.value;
    const auth = firebase.auth();
    // Sign in
    auth.signInWithEmailAndPassword(email, password).catch((error) => {
      const errorMessage = error.message;

      errors.textContent = errorMessage;
    });
  });

  // Add register event
  btnRegister.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Get email and password
    const email = txtEmail.value;
    const password = txtPassword.value;
    const auth = firebase.auth();
    // Register
    auth.createUserWithEmailAndPassword(email, password).catch((error) => {
      const errorMessage = error.message;

      errors.textContent = errorMessage;
    });
  });

  // Add log out event
  btnLogOut.addEventListener('click', () => {
    firebase.auth().signOut();
  });

  // Add a realtime listener
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      // User is signed in
      console.log(user);
      btnLogOut.classList.remove('btn--hide');
      calendar.classList.remove('wrapper--hide');
      btnLogIn.classList.add('btn--hide');
      btnRegister.classList.add('btn--hide');
      errors.classList.add('form__error--hide');
      wrapper.classList.add('form__wrapper--hide');
    } else {
      // No user is signed in
      console.log('not logged in');
      btnLogOut.classList.add('btn--hide');
      calendar.classList.add('wrapper--hide');
    }
  });
};

export default form;
