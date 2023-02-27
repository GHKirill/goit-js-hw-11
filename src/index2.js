import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import './style.css';
import Form from './JS/form';
import PhotosCollection from './JS/photosCollection';
const refForm = document.querySelector('#search-form');
const refInput = refForm.searchQuery;
const refGallery = document.querySelector('.gallery');
const refSubmitButton = refForm.querySelector('button');

refSubmitButton.disabled = true;

let photosCollection = new PhotosCollection(20, refGallery);
let form = new Form(refForm, refInput, refSubmitButton);

form.createListenerForInput();
form.createListenerForSubmit(fetchForPhotos);

function fetchForPhotos(input) {
  setTimeout(() => (refSubmitButton.disabled = true), 1000);
  photosCollection.inputChecking(input);

  axios
    .get(
      `https://pixabay.com/api/?key=33881811-455663e333f2bc5dbb769e41c&q=${input}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${photosCollection.photosNumber}&page=${photosCollection.page}`
    )
    .then(getPhotosList)
    .then(createHTMLPhotosCollection)
    .catch(error => {
      if (error?.response?.status === 400) {
        Notiflix.Notify.failure(
          `We're sorry, but you've reached the end of search results.`
        );
      }
      console.log(error);
    });
}

function getPhotosList(response) {
  if (response?.response?.status === 400) {
    Notiflix.Notify.failure(
      `We're sorry, but you've reached the end of search results.`
    );
    throw new Error();
  } else if (response.status != 200) {
    throw new Error();
  } else if (response.data.totalHits === 0) {
    Notiflix.Notify.failure(
      `We're sorry, but there are not photos according to your query`
    );
    throw new Error();
  }
  Notiflix.Notify.success(
    `Hooray! We found ${response.data.totalHits} images.`
  );
  return response.data.hits;
}

function createHTMLPhotosCollection(photosList) {
  let renderedPhotosList = photosCollection.photosRenderingLightBox(photosList);
  refGallery.insertAdjacentHTML('beforeend', renderedPhotosList);
  //================
  if (photosCollection.lightBox) {
    photosCollection.lightBox.refresh();
  } else {
    photosCollection.createLightBox();
  }
  //===============
  setTimeout(() => (refSubmitButton.disabled = false), 2000);
  refSubmitButton.disabled = false;
  form.smoothScroll();
  if (!photosCollection.intersectionObserver) {
    // intersectionObserver = photosCollection.createElementForInfiniteScroll();
    photosCollection.createElementForInfiniteScroll();
    createInfiniteScroll();
  }
  return response.data.hits;
}

function createInfiniteScroll() {
  const options = {
    //root: 'window',
    rootMargin: '200px',
    //threshold:[0]
  };
  let intersectionObserver = new IntersectionObserver(observeFunction, options);

  function observeFunction(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting && photosCollection.inputValue != null) {
        fetchForPhotos(refInput.value.trim());
      }
    });
  }
  intersectionObserver.observe(photosCollection.elementForInfiniteScroll);
  photosCollection.intersectionObserver = intersectionObserver;
}
