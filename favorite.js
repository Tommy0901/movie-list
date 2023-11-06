const BASE_URL = "https://webdev.alphacamp.io";
const INDEX_URL = BASE_URL + "/api/movies/";
const POSTER_URL = BASE_URL + "/posters/";

const dataPanel = document.querySelector("#data-panel");
const changeMode = document.querySelector("#change-mode");

const modalTitle = document.querySelector("#movie-modal-title");
const modalImage = document.querySelector("#movie-modal-image");
const modalDate = document.querySelector("#movie-modal-date");
const modalDescription = document.querySelector("#movie-modal-description");

const movies = JSON.parse(localStorage.getItem('favoriteMovies')) || [];

let viewMode = 0

renderMovieList(movies);

dataPanel.addEventListener("click", (event) => {
  modalTitle.innerText = "";
  modalDate.innerText = "";
  modalDescription.innerText = "";
  modalImage.innerHTML = "";

  if (event.target.matches(".btn-show-movie")) {
    showMovieModal(Number(event.target.dataset.id));
  } else if (event.target.matches(".btn-remove-favorite")) {
    removeFavorite(Number(event.target.dataset.id));
  }
});

changeMode.addEventListener("click", (event) => {
  if (event.target.matches('.list-mode-button')) {
    viewMode = 1
  } else if (event.target.matches('.card-mode-button')) {
    viewMode = 0
  }
  renderMovieList(movies)
});

function renderMovieList(data) {
  let rawHTML = "";

  if (viewMode) {
    console.log(dataPanel.classList)
    rawHTML = `<ul class="list-group col-sm-12 mb-2">`;
    data.forEach((item) => {
      rawHTML += `
      <li class="list-group-item d-flex justify-content-between">
        <h5 class="card-title">${item.title}</h5>
        <div>
          <button class="btn btn-primary btn-show-movie" data-bs-toggle="modal" data-bs-target="#movie-modal"
            data-id="${item.id}">More</button>
          <button class="btn btn-danger btn-remove-favorite" data-id="${item.id}">x</button>
        </div>
      </li>`;
    });
    rawHTML += "</ul>";
  } else {
    data.forEach((item) => {
      rawHTML += `
      <div class="col-sm-3">
        <div class="mb-2">
          <div class="card">
            <img src="${
              POSTER_URL + item.image
            }" class="card-img-top" alt="Movie Poster">
            <div class="card-body">
              <h5 class="card-title">${item.title}</h5>
            </div>
            <div class="card-footer">
              <button class="btn btn-primary btn-show-movie" data-bs-toggle="modal" data-bs-target="#movie-modal" data-id="${
                item.id
              }" >More</button>
              <button class="btn btn-danger btn-remove-favorite" data-id="${
                item.id
              }">x</button>
            </div>
          </div>
        </div>
      </div>`;
    });
  }
  
  dataPanel.innerHTML = rawHTML;
}

function showMovieModal(id) {
  axios.get(INDEX_URL + id).then((response) => {
    console.log(response.data);
    const data = response.data.results;
    modalTitle.innerText = data.title;
    modalDate.innerText = data.release_date;
    modalDescription.innerText = data.description;
    modalImage.innerHTML = `<img src="${
      POSTER_URL + data.image
    }" alt="movie-poster" class="img-fuid">`;
  });
}
// localStorage.setItem('default_language', 'ZH_TW')
console.log(localStorage.getItem("default_language"));

function removeFavorite (id) {
  const movieIndex = movies.findIndex(item => item.id === id)

  movies.splice(movieIndex, 1)

  localStorage.setItem('favoriteMovies', JSON.stringify(movies))
  renderMovieList(movies);
}