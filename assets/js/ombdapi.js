//Depends
const apiKey = "b0cdfcde";

//Data

//Functions
function fetchSearch(movieTitle) {
  const url = `http://www.omdbapi.com/?apikey=${apiKey}&s=${movieTitle}&type=movie`;
  fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((data) => {});
}

//User Interactions
