import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

import { getImagesByQuery } from "./js/pixabay-api.js";
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreButton,
  hideLoadMoreButton,
} from "./js/render-functions.js";

const form = document.querySelector(".form");
const input = document.querySelector("input[name='search-text']");
const loadMoreBtn = document.querySelector(".load-more");

let currentQuery = "";
let currentPage = 1;
let totalHits = null;

form.addEventListener("submit", onSearch);
loadMoreBtn.addEventListener("click", onLoadMore);

async function onSearch(e) {
  e.preventDefault();

  currentQuery = input.value.trim();

  if (!currentQuery) {
    iziToast.warning({
      title: "Warning",
      message: "Please enter a search query!",
    });
    return;
  }

  currentPage = 1;
  clearGallery();
  hideLoadMoreButton();
  showLoader();

  try {
    const data = await getImagesByQuery(currentQuery, currentPage);

    totalHits = data.totalHits;

    if (data.hits.length === 0) {
      iziToast.error({
        title: "No results",
        message: "Sorry, no images match your search query.",
      });
      return;
    }

    createGallery(data.hits);

    if (totalHits > 15) showLoadMoreButton();
  } catch (err) {
    iziToast.error({
      title: "Error",
      message: "Something went wrong. Try again later.",
    });
  } finally {
    hideLoader();
    form.reset();
  }
}

async function onLoadMore() {
  currentPage++;
  showLoader();

  const data = await getImagesByQuery(currentQuery, currentPage);
  createGallery(data.hits);
  smoothScroll();

  const loaded = currentPage * 15;

  if (loaded >= totalHits) {
    hideLoadMoreButton();
    iziToast.info({
      title: "End",
      message: "You've reached the end of search results.",
    });
  }

  hideLoader();
}

function smoothScroll() {
  const cardHeight =
    document.querySelector(".gallery-item").getBoundingClientRect().height;

  window.scrollBy({
    top: cardHeight * 2,
    behavior: "smooth",
  });
}
