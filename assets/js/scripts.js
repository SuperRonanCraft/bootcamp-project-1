// DEPENDENCIES (DOM Elements) =======================
const searchButton = document.querySelector('#button-search');
const textInput = document.querySelector('#text-input');

// DATA ==============================================

// FUNCTIONS =========================================
function handleFormSubmit(event) {
  event.preventDefault();
  // insert file source here
  const src = 'results.html';

  // assign value from
  location.assign(`${src}?s=${textInput.value}`);

  // reset input field
  textInput.value = '';
}

// USER INTERACTIONS =================================
searchButton.addEventListener('click', handleFormSubmit);

// INITIALIZATION ====================================
