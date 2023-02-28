import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import './style.css';
import Form from './JS/form';
import PhotosCollection from './JS/photosCollection';
import {
  fetchForPhotos,
  getPhotosList,
  createInfiniteScroll,
  createHTMLPhotosCollection,
} from './JS/additionalFunctions';
const refForm = document.querySelector('#search-form');
const refInput = refForm.searchQuery;
const refGallery = document.querySelector('.gallery');
const refSubmitButton = refForm.querySelector('button');

refSubmitButton.disabled = true;

let photosCollection = new PhotosCollection(40, refGallery, refSubmitButton);
let form = new Form(refForm, refInput, refSubmitButton);

form.createListenerForInput();
form.createListenerForSubmit(getPhotos);

async function getPhotos(input) {
  if (photosCollection.inputChecking(input)) {
    Notiflix.Notify.failure(
      `We're sorry, but you've reached the end of search results.`
    );
    return;
  }
  let response;
  try {
    response = await fetchForPhotos(input);
  } catch (error) {
    console.log(error);
    return;
  }
  let photosList;
  try {
    photosList = await getPhotosList(response);
  } catch (error) {
    console.log(error);
    return;
  }

  await createHTMLPhotosCollection(photosList);
}

// async function fetchForPhotos(input) {
//   setTimeout(() => (refSubmitButton.disabled = true), 1000);
//   photosCollection.inputChecking(input);

//   const config = {
//     headers: {
//       'Content-Type': 'application/json',
//       // Authorization: '????????????'
//     },
//     params: {
//       key: '33881811-455663e333f2bc5dbb769e41c',
//       q: `${input}`,
//       image_type: 'photo',
//       orientation: 'horizontal',
//       safesearch: 'true',
//       per_page: `${photosCollection.photosNumber}`,
//       page: `${photosCollection.page}`,
//       // page: `27`,
//     },
//   };
//   return axios.get(`https://pixabay.com/api/`, config);
// }

// async function getPhotosList(response) {
//   photosCollection.totalHits = response.data.totalHits;
//   console.log(photosCollection.totalHits);
//   console.log(response);
//   if (response.data.totalHits === 0) {
//     Notiflix.Notify.failure(
//       `We're sorry, but there are not photos according to your query`
//     );
//     throw new Error();
//   }
//   Notiflix.Notify.success(
//     `Hooray! We found ${response.data.totalHits} images.`
//   );
//   return response.data.hits;
// }

// async function createHTMLPhotosCollection(photosList) {
//   let renderedPhotosList = photosCollection.photosRenderingLightBox(photosList);
//   refGallery.insertAdjacentHTML('beforeend', renderedPhotosList);
//   //================
//   if (photosCollection.lightBox) {
//     photosCollection.lightBox.refresh();
//   } else {
//     photosCollection.createLightBox();
//   }
//   //===============
//   setTimeout(() => (refSubmitButton.disabled = false), 2000);
//   refSubmitButton.disabled = false;
//   form.smoothScroll();
//   //check if intersectionObserver is photos number is not loaded
//   if (
//     !photosCollection.intersectionObserver &&
//     photosCollection.totalHits % photosCollection.page > 0
//   ) {
//     photosCollection.createElementForInfiniteScroll();
//     createInfiniteScroll();
//     console.log(photosCollection.intersectionObserver);
//   }
// }

// function createInfiniteScroll() {
//   const options = {
//     //root: 'window',
//     rootMargin: '200px',
//     //threshold:[0]
//   };
//   let intersectionObserver = new IntersectionObserver(observeFunction, options);

//   function observeFunction(entries) {
//     entries.forEach(entry => {
//       if (entry.isIntersecting && photosCollection.inputValue != null) {
//         getPhotos(refInput.value.trim());
//       }
//     });
//   }
//   intersectionObserver.observe(photosCollection.elementForInfiniteScroll);
//   photosCollection.intersectionObserver = intersectionObserver;
// }
export {
  photosCollection,
  form,
  getPhotos,
  refInput,
  refSubmitButton,
  refGallery,
};
