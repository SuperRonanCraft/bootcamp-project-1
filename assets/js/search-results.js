//Depends
const apiKey = "b0cdfcde";

//Functions
//Call OMDB and return a list of movie results
function fetchSearch(movieTitle) {
  //Api url
  const url = `https://www.omdbapi.com/?apikey=${apiKey}&s=${movieTitle}&type=movie`;
  fetch(url)
    .then((response) => {
      //Convert string to json
      return response.json();
    })
    .then((data) => {
      if (data.Response === "True") processResults(data);
      else {
        //Error page redirect
      }
    });
}

//Decompile OMDB fetch request to digestible object keys (title, year, imdb, poster)
function processResults(data) {
  //Call to delete all previous search results
  for (const movieData of data.Search) {
    const movie = {
      //Movie Title
      title: movieData.Title,
      //Year
      year: movieData.Year,
      //IMDB id
      imdb: movieData.imdbID,
      //Poster URL
      poster: movieData.Poster,
    };
    console.log(movie);
    //Call to create element based off movie results
  }
}

//Inits
window.onload = () => {
  //Generate a URL object
  const url = new URL(location.href);
  //Get the search parameter
  const movieTitle = url.searchParams.get("s");
  //Call fetch
  fetchSearch(movieTitle);
};

//User Interactions
