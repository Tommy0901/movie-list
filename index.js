const BASE_URL = "https://webdev.alphacamp.io";
const INDEX_URL = BASE_URL + "/api/movies/";
const POSTER_URL = BASE_URL + "/posters/";
const MOVIES_PER_PAGE = 16;

const dataPanel = document.querySelector("#data-panel");
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const paginator = document.querySelector("#paginator");
const changeMode = document.querySelector("#change-mode");

const modalTitle = document.querySelector("#movie-modal-title");
const modalImage = document.querySelector("#movie-modal-image");
const modalDate = document.querySelector("#movie-modal-date");
const modalDescription = document.querySelector("#movie-modal-description");

const movies = [];
let filteredMovies = [];
let viewMode = 0

axios
  .get(INDEX_URL)
  .then((response) => {
    movies.push(...response.data.results);
    renderPaginator(movies.length);
    renderMovieList(getMoviesByPage(1));
  })
  .catch((error) => console.log(error));

dataPanel.addEventListener("click", (event) => {
  modalTitle.innerText = "";
  modalDate.innerText = "";
  modalDescription.innerText = "";
  modalImage.innerHTML = "";

  if (event.target.matches(".btn-show-movie")) {
    showMovieModal(Number(event.target.dataset.id));
  } else if (event.target.matches(".btn-add-favorite")) {
    addToFavorite(Number(event.target.dataset.id));
  }
});

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const keyword = searchInput.value.trim().toLowerCase();

  filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(keyword)
  );

  renderPaginator(filteredMovies.length);
  filteredMovies.length
    ? renderMovieList(getMoviesByPage(1))
    : renderMovieList(filteredMovies);
});

changeMode.addEventListener("click", (event) => {
  if (event.target.matches('.list-mode-button')) {
    viewMode = 1
  } else if (event.target.matches('.card-mode-button')) {
    viewMode = 0
  }
  renderMovieList(getMoviesByPage(1))
});

paginator.addEventListener("click", (event) => {
  if (!event.target.tagName === "A") return;

  const selectedPage = Number(event.target.dataset.page);
  renderMovieList(getMoviesByPage(selectedPage));
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
          <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
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
              <button class="btn btn-info btn-add-favorite" data-id="${
                item.id
              }">+</button>
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

function addToFavorite(id) {
  const list = JSON.parse(localStorage.getItem("favoriteMovies")) || [];
  const movie = movies.find((item) => item.id === id);

  if (list.some((item) => item.id === id)) {
    return alert("此電影已在收藏清單");
  }

  list.unshift(movie);

  localStorage.setItem("favoriteMovies", JSON.stringify(list));
}

function getMoviesByPage(page) {
  const startIndex = (page - 1) * MOVIES_PER_PAGE;
  let list = filteredMovies.length ? filteredMovies : movies;
  return list.slice(startIndex, startIndex + MOVIES_PER_PAGE);
}

function renderPaginator(amount) {
  const numberOfPage = Math.ceil(amount / MOVIES_PER_PAGE);
  let rawHTML = "";

  for (let page = 1; page < numberOfPage + 1; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`;
  }

  paginator.innerHTML = rawHTML;
}
