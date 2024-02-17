import Notiflix from "notiflix";
import Axios from "axios";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const form = document.querySelector(".search-form");
const gallery = document.querySelector(".gallery");
const searchInput = document.querySelector("input[name='searchQuery']");
const loadMoreBtn = document.querySelector(".load-more");
loadMoreBtn.style.display = "none";
let page = 1;
let searchQuery = "";

const API_KEY = "18917858-f119964571c0b49666c3b77dc";

form.addEventListener("submit", (e) => {
  e.preventDefault();
  searchQuery = searchInput.value;
  page = 1;
  gallery.innerHTML = "";
  fetchImages(searchQuery, page);
});

loadMoreBtn.addEventListener("click", () => {
  fetchImages(searchQuery, page);
});

function fetchImages(searchQuery, page) {
  loadMoreBtn.style.display = "none";
  Axios.get(
    `https://pixabay.com/api/?key=${API_KEY}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`
  )
    .then((response) => {
      if (response.data.hits.length === 0) {
        Notiflix.Notify.failure(
          "Sorry, there are no images matching your search query. Please try again."
        );
        return;
      }
      Notiflix.Notify.success(`Hooray! We found ${response.data.totalHits} images.`);
      gallery.insertAdjacentHTML("beforeend", createGalleryMarkup(response.data.hits));
      page += 1;
      loadMoreBtn.style.display = "block";
      const { height: cardHeight } = document
        .querySelector(".gallery")
        .firstElementChild.getBoundingClientRect();
      window.scrollBy({
        top: cardHeight * 2,
        behavior: "smooth",
      });
      const lightbox = new SimpleLightbox(".gallery a");
      lightbox.refresh();
    })
    .catch((error) => {
      console.log(error);
    });
}

function createGalleryMarkup(images) {
  return images
    .map(
      (image) =>
        `<div class="photo-card">
          <a href="${image.largeImageURL}">
            <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" height="300" />
          </a>
          <div class="info">
            <p class="info-item">
              <b>Likes</b> ${image.likes}
            </p>
            <p class="info-item">
              <b>Views</b> ${image.views}
            </p>
            <p class="info-item">
              <b>Comments</b> ${image.comments}
            </p>
            <p class="info-item">
              <b>Downloads</b> ${image.downloads}
            </p>
          </div>
        </div>`
    )
    .join("");
}