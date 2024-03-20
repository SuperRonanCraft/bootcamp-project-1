//Depends
const apiKey = "b0cdfcde";
const searchResultsEl = document.querySelector("#search-results");
const searchButton = document.querySelector("#submitButton");

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
      else if (data.Response === "False") {
        window.location.assign("error.html");
      } else {
        window.location.assign("error.html");
      }
    });
}

//Decompile OMDB fetch request to digestible object keys (title, year, imdb, poster)
function processResults(data) {
  // delete previous search results
  searchResultsEl.textContent = "";
  let movies = [];
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
    movies.push(movie);
  }
  displaySearchResults(movies);
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
    /* DEBUG CODE */
    setYoutubeIFrame("modal", trailer.youtube_video_id);
    /**/
  } else {
  }
  console.log(data);
}

function displaySearchResults(data) {
  let imageCardContent = "";

  for (const result of data) {
    imageCardContent += `<div class="img-card-wrapper">
          <!-- Image card box -->
          <div class="card">
            <!-- Card content -->
            <div class="card-image">
              <!-- Movie img -->
              <img src="${result.poster}" />
              <!-- Model button -->
              <a
                class="btn-floating halfway-fab waves-effect waves-light red modal-trigger"
                href="#modal1"
              >
                <i class="tiny material-icons">play_arrow</i>
              </a>
              <!-- Modal Structure -->
              <div id="modal1" class="modal">
                <div class="modal-content">
                </div>
              </div>
            </div>
            <!-- Movie about card -->
            <div class="card-content" id="card-content">
              <!-- Movie title wrapper -->
              <div class="title-wrapper" id="title-wrapper">
                <!-- Movie title -->
                <h2 id="movie-title">${result.title}</h2>
                <!-- Genre Container -->
                <div class="genre-container" id="genre-container">
                  <!-- Genre titles -->
                  <p id="year">${result.year}</p>
                </div>
              </div>
            </div>
          </div>
        </div>`;
  }
  searchResultsEl.innerHTML = imageCardContent;
}

function handleFormSubmit(event) {
  event.preventDefault();
  const searchInput = textInput.value;
  // insert searchinput as a parameter
  fetchSearch(searchInput);
  // Set user input value to local storage
  localStorage.setItem("Movies", textInput.value);
  // reset input field
  textInput.value = "";
}

//Youtube IFrame Video
function setYoutubeIFrame(elementID, videoID) {
  new YT.Player(elementID, {
    height: "390",
    width: "640",
    videoId: videoID,
    playerVars: {
      playsinline: 1,
    },
    events: {
      onReady: (event) => {
        console.log(event);
      },
    },
  });
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
searchButton.addEventListener("click", handleFormSubmit);

// INITIALIZATIONS
