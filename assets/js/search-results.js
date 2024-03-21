//Depends
const apiKey = "b0cdfcde";
const searchResultsEl = document.querySelector("#search-results");
const searchButton = document.querySelector("#submitButton");
const textInput = document.querySelector("#text-input");
const modalTitle = document.querySelector("#movie-video-title");
const modalYear = document.querySelector("#movie-video-year");
const modalCloseButton = document.querySelector("#modal-close-button");
const modalBox = document.getElementById("modal1");

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
    // console.log(movie);
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
  if (trailerInfo !== null) {
    const trailer = {
      exist: true,
      thumbnail: trailerInfo.thumbnail,
      videoID: trailerInfo.youtube_video_id,
    };
    /* DEBUG CODE */
    setYoutubeIFrame(trailer.videoID);
    /**/
  } else {
      const errorText = document.createElement("h2");
    errorText.textContent = "No Trailer Found";
    
    }
  }
  console.log(data);
}

function displaySearchResults(data) {
  let imageCardContent = "";

  for (const result of data) {
    imageCardContent += `<div class="img-card-wrapper" id="${result.imdb}">
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
                <i class="tiny material-icons" data-imdb="${result.imdb}">play_arrow</i>
              </a>
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

let player = null;
//Youtube IFrame Video
function setYoutubeIFrame(videoID) {
  console.log(videoID);
  player = new YT.Player("trailer-video", {
    height: "390",
    width: "640",
    videoId: videoID,
    playerVars: {
      playsinline: 1,
    },
    events: {
      onReady: (event) => {
        event.target.playVideo();
      },
    },
  });

  
}

function openModalEvent(event) {
  /*Kadirs modal stuff*/
  /* */
}
function closeModalEvent(event) {
  if (player !== null) player.stopVideo();
}

// Modal Open Event
document.addEventListener("DOMContentLoaded", function () {
  $(".modal").modal();
  const elems = document.querySelectorAll(".modal");
  const options = {
    onOpenStart: openModalEvent,
    onCloseStart: closeModalEvent,
  };
  M.Modal.init(elems, options);
});

searchResultsEl.addEventListener("click", (event) => {
  const imdbID = event.target.dataset.imdb;
  fetchTrailer(imdbID);
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
