//Depends
const apiKey = "b0cdfcde";

//Functions
//Call OMDB and return a list of movie results
function fetchSearch(movieTitle) {
  console.log(`Fetching OMDB for movies related to ${movieTitle}`);
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
        window.location.assign("error.html");
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
    if (movieData === data.Search[0]) fetchTrailer(movie.imdb);
  }
}

function fetchTrailer(imdbID) {
  const url = `https://api.kinocheck.de/movies?imdb_id=${imdbID}&language=en`;
  fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      processTrailer(data);
    });
}

function processTrailer(data) {
  const trailerInfo = data.trailer;
  const trailer = {
    exist: false,
  };
  if (trailerInfo) {
    const trailer = {
      exist: true,
      thumbnail: trailerInfo.thumbnail,
      videoID: trailerInfo.youtube_video_id,
    };
    console.log(trailer);
  } else {
  }
  console.log(data);
}

// Model
$(document).ready(function () {
  $(".modal").modal();
});

//Inits
window.onload = () => {
  //Generate a URL object
  const url = new URL(location.href);
  //Get the search parameter
  const movieTitle = url.searchParams.get("s");
  //Call fetch
  if (movieTitle !== null) fetchSearch(movieTitle);
  else {
    //Error message/popup
  }
};

//User Interactions
