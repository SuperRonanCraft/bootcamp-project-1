// DEPENDENCIES (DOM Elements) =======================
const searchButton = document.querySelector("#submitButton");
const textInput = document.querySelector("#text-input");
const previousSearchList = document.querySelector("#previousSearchBoxList");
const previousSearchButton = document.querySelector("#previousSearch-button");
const previousSearchBox = document.querySelector("#previousSearchBox");

// DATA ==============================================

// FUNCTIONS =========================================
function handleFormSubmit(event) {
  event.preventDefault();
  // insert file source here
  const src = "results.html";
  // assign value from
  location.assign(`${src}?s=${textInput.value}`);
  // Set user input value to local storage
  let movies = [];
  movies = JSON.parse(localStorage.getItem("Movies")) || [];
  movies.push(textInput.value);
  console.log(movies);
  localStorage.setItem("Movies", JSON.stringify(movies));
  // reset input field
  textInput.value = "";

  console.log(movies);
}

function CreateLocalStorageData() {
  // Check if localStorageData has a value before using it
  let movies = JSON.parse(localStorage.getItem("Movies")) || [];
  previousSearchList.innerHTML = "";
  for (let i = 0; i < 5 && i < movies.length; i++) {
    const movie = movies[i];
    const listEl = document.createElement("li");
    listEl.textContent = movie;
    console.log(listEl.textContent);
    previousSearchList.append(listEl);
    console.log(movie);
  }
}
// CreateLocalStorageData();

previousSearchButton.addEventListener("click", () => {
  previousSearchBox.classList.toggle("display");
  CreateLocalStorageData();
});
// USER INTERACTIONS =================================
searchButton.addEventListener("click", handleFormSubmit);

// INITIALIZATION ====================================
