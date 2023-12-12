import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import "simplelightbox/dist/simple-lightbox.min.css";

const apiKey = '41214724-8e0af22b522780ea083dbfd83'; 
let currentPage = 1;
let searchQuery = '';

const form = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

form.addEventListener('submit', async function(e) {
  e.preventDefault();
  searchQuery = e.target.elements.searchQuery.value;
  currentPage = 1;
  gallery.innerHTML = '';

  searchImages();
});

loadMoreBtn.addEventListener('click', function() {
  currentPage++;
  searchImages();
});

async function searchImages() {
  const response = await fetch(`https://pixabay.com/api/?key=${apiKey}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${currentPage}&per_page=40`);
  const data = await response.json();

  if (data.hits.length === 0) {
    Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
    loadMoreBtn.style.display = 'none';
    return;
  }

  if (currentPage === 1) {
    Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
  }

  data.hits.forEach(image => {
    const card = document.createElement('div');
    card.classList.add('photo-card');
    card.innerHTML = `
      <a href="${image.largeImageURL}" class="lightbox" data-lightbox="gallery">
        <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy">
      </a>
      <div class="info">
        <p class="info-item"><b>Likes:</b> ${image.likes}</p>
        <p class="info-item"><b>Views:</b> ${image.views}</p>
        <p class="info-item"><b>Comments:</b> ${image.comments}</p>
        <p class="info-item"><b>Downloads:</b> ${image.downloads}</p>
      </div>
    `;
    gallery.appendChild(card);
  });

  loadMoreBtn.style.display = 'block';

  
  const lightbox = new SimpleLightbox('.lightbox', {
    elements: '.photo-card a'
  });

  
  const lightboxOverlay = document.querySelector('.sl-overlay');
  const lightboxImage = document.querySelector('.sl-image');

  lightboxOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.85)';
  lightboxImage.style.maxWidth = '90%';
  lightboxImage.style.maxHeight = '90%';
  lightboxImage.style.marginTop = '5vh';

  lightbox.refresh();

  
  const { height: cardHeight } = gallery.firstElementChild.getBoundingClientRect();
  window.scrollBy({ top: cardHeight * 2, behavior: 'smooth' });

  
  if (data.totalHits <= currentPage * 40) {
    loadMoreBtn.style.display = 'none';
    Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
  }
}