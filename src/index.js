import Notiflix from 'notiflix';
import fetchImg from './js/api';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.querySelector('.search-form');
const wrapGallery = document.querySelector('.gallery');
const target = document.querySelector('.target');

const options = {
  root: null,
  rootMargin: '400px',
  threshold: 1.0,
};

const observer = new IntersectionObserver(generateImg, options);

form.addEventListener('submit', submit);

let page = 1;
let onInput = '';

function submit(event) {
  event.preventDefault();

  onInput = event.target.searchQuery.value;

  wrapGallery.innerHTML = '';
  observer.unobserve(target);

  if (!onInput) {
    Notiflix.Notify.failure('Please, search any picture!');
    return;
  }

  page = 1;

  fetchImg(onInput, page).then(response => {
    if (!response.data.total) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    } else if (response.data.hits.lengts <= 40) {
      observer.unobserve(target);
    } else {
      createMarkup(response.data.hits);
      observer.observe(target);
    }
    Notiflix.Notify.success(`Hooray! We found ${response.data.total} images.`);
  });
}

function createMarkup(array) {
  const imgList = array
    .map(item => {
      return `
    <div class="photo-card-gallary"> 
      <a href="${item.largeImageURL}">
        <img  src="${item.webformatURL}" alt="${item.tags}" loading="lazy" />
      </a>
      <div class="info-gallary">
        <p class="info-item-gallary">
          <b>Likes: ${item.likes}</b>
        </p>
        <p class="info-item-gallary">
          <b>Views: ${item.views}</b>
        </p>
        <p class="info-item-gallary">
          <b>Comments: ${item.comments}</b>
        </p>
        <p class="info-item-gallary">
          <b>Downloads: ${item.downloads}</b>
        </p>
      </div>
    </div>`;
    })
    .join('');

  wrapGallery.insertAdjacentHTML('beforeend', imgList);

  const simpleBox = new SimpleLightbox('.gallery a', {});
}

function generateImg(entries) {
  entries.forEach(entrie => {
    if (entrie.isIntersecting) {
      page += 1;
      fetchImg(onInput, page).then(response => {
        if (response.data.hits.length === 0) {
          Notiflix.Notify.failure(
            `We're sorry, but you've reached the end of search results.`
          );
          return;
        }
        createMarkup(response.data.hits);
      });
    }
  });
}
