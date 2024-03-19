//Depends
const apiKey = "b0cdfcde";

//Data

//Functions
function fetchSearch(movieTitle) {
  const url = `https://www.omdbapi.com/?apikey=${apiKey}&s=${movieTitle}&type=movie`;
  fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      if (data.Response === "True") processResults(data);
      else {
        //Error page redirect
      }
    });
}

function processResults(data) {
  console.log(data);
}

window.onload = (event) => {
  fetchSearch("ave4234234ngers");
};

//User Interactions
