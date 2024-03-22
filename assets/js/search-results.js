//Depends
const apiKey = "b0cdfcde";
const searchResultsEl = document.querySelector("#search-results");
// const searchButton = document.querySelector("#submitButton");
// const textInput = document.querySelector("#text-input");
const modalTitle = document.querySelector("#movie-video-title");
const modalYear = document.querySelector("#movie-video-year");
const modalCloseButton = document.querySelector("#modal-close-button");
const modalBox = document.getElementById("modal1");
const goBackButton = document.querySelector("#goBack-button");

//Data
let player = null;

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
    })
    .catch((error) => {
      trailerError(false);
    });
}

function processTrailer(data) {
  const trailerInfo = data.trailer;
  let trailer = {
    exist: false,
  };
  if (trailerInfo !== null) {
    trailer = {
      exist: true,
      thumbnail: trailerInfo.thumbnail,
      videoID: trailerInfo.youtube_video_id,
    };
    setYoutubeIFrame(trailer.videoID);
  }
  trailerError(trailer.exist);

  console.log(data);
}

async function trailerError(exists) {
  //Trailer Error Text
  if (exists) {
    if (document.getElementById("trailerError"))
      document.getElementById("trailerError").remove();
  } else {
    if (player) {
      player.destroy();
      player = null;
    }

    //Async call to get promise of dad joke
    addError(await getDadJoke());

    function addError(joke) {
      let errorText;
      if (document.getElementById("trailerError") === null) {
        errorText = document.createElement("div");
        errorText.setAttribute("style", `style="text-align: center"`);
        errorText.setAttribute("id", "trailerError");
        modalBox.appendChild(errorText);
      } else {
        errorText = document.getElementById("trailerError");
      }

      errorText.innerHTML = `<h2>No Trailer Found</h2><h3>${joke}</h3>`;
    }
  }
}

//Returns a promise
function getDadJoke() {
  const url = `https://icanhazdadjoke.com/search?term=movie`;
  return fetch(url, {
    headers: {
      Accept: "application/json",
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      const jokeArray = data.results;
      console.log(jokeArray);
      const rngjoke =
        jokeArray[Math.floor(Math.random() * jokeArray.length)].joke;
      // console.log(rngjoke);
      return rngjoke;
    });
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
              <a class="btn-floating halfway-fab waves-effect waves-light red modal-trigger"
                href="#modal1">
                <i class="movieButton tiny material-icons" data-movie='${JSON.stringify(
                  result
                )}'>play_arrow</i>
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
  let movies = JSON.parse(localStorage.getItem("Movies")) || [];
  movies.push(textInput.value);
  if (movies.textContent) {
    localStorage.setItem("Movies", JSON.stringify(movies));
  }
  return;

  console.log(movies);
  // reset input field
  textInput.value = "";
}

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

function closeModalEvent(event) {
  try {
    if (player !== null) player.stopVideo();
  } catch (error) {
    //Nothing...
  }
}

// Modal Open Event
document.addEventListener("DOMContentLoaded", function () {
  $(".modal").modal();
  const elems = document.querySelectorAll(".modal");
  const options = {
    // onOpenStart: openModalEvent,
    onCloseStart: closeModalEvent,
  };
  M.Modal.init(elems, options);
});

searchResultsEl.addEventListener("click", (event) => {
  if (event.target.classList.contains("movieButton")) {
    console.log(event.target.dataset);
    const movieData = JSON.parse(event.target.dataset.movie);
    fetchTrailer(movieData.imdb);
    modalTitle.textContent = movieData.title;
    modalYear.textContent = movieData.year;
  }
});

goBackButton.addEventListener("click", () => {
  window.location.href = "/index.html";
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
// searchButton.addEventListener("click", handleFormSubmit);

// INITIALIZATIONS
