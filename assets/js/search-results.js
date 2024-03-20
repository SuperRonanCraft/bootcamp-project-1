//Depends
const apiKey = 'b0cdfcde';
const searchResultsEL = document.querySelector('#search-results');
const movieVideo = document.querySelector('#movie-video');
const movieImage = document.querySelector('#movie-image');
const movieTitle = document.querySelector('#movie-title');
const movieYear = document.querySelector('#genre-1');

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
      if (data.Response === 'True') processResults(data);
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
    movieTitle.textContent = movie.title;
    movieYear.textContent = movie.year;
    movieImage.setAttribute('src', movie.poster);
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
    movieVideo.setAttribute(
      'src',
      `https://youtube.com/watch?v=${trailer.videoID}&ab_channel=KinoCheck.com`
    );
    console.log(trailer);
  } else {
    //Error message/popup
  }
  console.log(data);
}

function displaySearchResults(data) {
  // BUILD
  const divRow = document.createElement('div');
  const divCardBodyEl = document.createElement('div');
  const imgEl = document.createElement('img');
  const divCardBody2El = document.createElement('div');
  const pEl = document.createElement('p');
  const p2El = document.createElement('p');

  // CREATE
  divRow.setAttribute('class', 'row');
  divCardBodyEl.setAttribute('class', 'col-6');
  imgEl.setAttribute('id', 'movie-image-small');
  imgEl.setAttribute('alt', 'movie image');
  imgEl.setAttribute('aria-label', 'small movie image');
  divCardBody2El.setAttribute('class', 'col-6');
  pEl.setAttribute('id', 'movie-name');
  p2El.setAttribute('id', 'movie-year');

  pEl.textContent = `${data.title}`; // add movie name
  p2El.textContent = `${data.year}`; // add movie year

  // PLACE
  searchResultsEl.appendChild(divRow);
  divRow.appendChild(divCardBodyEl);
  // place image to the left of movie information
  divCardBodyEl.appendChild(imgEl);
  divRow.appendChild(divCardBody2El);
  divCardBody2El.appendChild(pEl);
  divCardBody2El.appendChild(p2El);
}

// Model
$(document).ready(function () {
  $('.modal').modal();
});

//Inits
window.onload = () => {
  //Generate a URL object
  const url = new URL(location.href);

  //Get the search parameter
  const movieTitle = url.searchParams.get('s');
  //Call fetch
  if (movieTitle !== null) fetchSearch(movieTitle);
  else {
    //Error message/popup
  }
};

//User Interactions

// INITIALIZATIONS
