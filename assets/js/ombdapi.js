//Depends
const apiKey = "b0cdfcde";

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

//Decompile OMDB fetch request to digestible object keys (title, year, imdb, poster)
function processResults(data) {
  //   console.log(data);
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
  }
}

//User Interactions
