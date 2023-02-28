import Notiflix from 'notiflix';
import axios from 'axios';
// import SimpleLightbox from 'simplelightbox';
import {
  photosCollection,
  form,
  getPhotos,
  refInput,
  refSubmitButton,
  refGallery,
} from '../index';

async function fetchForPhotos(input) {
  setTimeout(() => (refSubmitButton.disabled = true), 1000);
  photosCollection.inputChecking(input);

  const config = {
    headers: {
      'Content-Type': 'application/json',
      // Authorization: '????????????'
    },
    params: {
      key: '33881811-455663e333f2bc5dbb769e41c',
      q: `${input}`,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: 'true',
      per_page: `${photosCollection.photosNumber}`,
      page: `${photosCollection.page}`,
      // page: `27`,
    },
  };
  return axios.get(`https://pixabay.com/api/`, config);
}
async function getPhotosList(response) {
  photosCollection.totalHits = response.data.totalHits;
  // console.log(photosCollection.totalHits);
  // console.log(response);
  if (response.data.totalHits === 0) {
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
async function createHTMLPhotosCollection(photosList) {
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
  //refSubmitButton.disabled = false;
  form.smoothScroll();
  //check if intersectionObserver is photos number is not loaded
  if (
    !photosCollection.intersectionObserver &&
    photosCollection.totalHits >=
      (photosCollection.page - 1) * photosCollection.photosNumber
    //photosCollection.totalHits % photosCollection.page > 0
  ) {
    photosCollection.createElementForInfiniteScroll();
    createInfiniteScroll();
    //console.log(photosCollection.intersectionObserver);
    return;
  } else if (photosCollection.totalHits <= photosCollection.photosNumber) {
    Notiflix.Notify.failure(
      `We're sorry, but you've reached the end of search results.`
    );
    setTimeout(() => (refSubmitButton.disabled = true), 2000);
    return;
  }
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
        getPhotos(refInput.value.trim());
      }
    });
  }
  intersectionObserver.observe(photosCollection.elementForInfiniteScroll);
  photosCollection.intersectionObserver = intersectionObserver;
}
export {
  createInfiniteScroll,
  createHTMLPhotosCollection,
  getPhotosList,
  fetchForPhotos,
};
