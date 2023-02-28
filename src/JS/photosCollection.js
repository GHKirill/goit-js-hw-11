class PhotosCollection {
  constructor(photosNumber, refGallery, refSubmitButton) {
    this.refGallery = refGallery;
    this.refSubmitButton = refSubmitButton;
    this.photosNumber = photosNumber;
    this.totalHits = null;
    this.page = 1;
    this.inputValue = null;
    this.elementForInfiniteScroll = null;
    this.intersectionObserver = null;
    this.lightBox = null;
  }
  inputChecking(input) {
    if (!(input === this.inputValue || this.inputValue === null)) {
      this.refGallery.innerHTML = '';
      this.page = 1;
      if (this.lightBox) {
        this.lightBox.close();
        this.lightBox = null;
      }
      if (this.intersectionObserver) {
        this.intersectionObserver.disconnect();
        this.intersectionObserver = null;
        this.elementForInfiniteScroll.innerHTML = '';
        //this.refSubmitButton.disabled = true;
      }
    }
    this.inputValue = input;
    return this.restOfPhotoListChecking();
  }

  restOfPhotoListChecking() {
    const photosNumberLoaded = (this.page - 1) * this.photosNumber;
    if (
      (photosNumberLoaded >= this.totalHits ||
        this.totalHits < this.photosNumber) &&
      this.intersectionObserver
    ) {
      this.intersectionObserver.disconnect();
      this.intersectionObserver = null;
      this.elementForInfiniteScroll.innerHTML = '';
      //this.refSubmitButton.disabled = true;
      return true;
    } else {
      return false;
    }
  }
  photosRenderingLightBox(photosList) {
    let renderList = photosList.reduce((accum, photo) => {
      return (
        accum +
        `<div class='photo-thumb'><div class='photo-card'><a href="${photo.largeImageURL}" ><img src="${photo.webformatURL}" alt="${photo.tags}" title="" width=300 height=200/></a></div>

          <div class="info">
            <p class="info-item">
              <b>Likes</b> ${photo.likes}
            </p>
            <p class="info-item">
              <b>Views</b>${photo.views}
            </p>
            <p class="info-item">
              <b>Comments</b>${photo.comments}
            </p>
            <p class="info-item">
              <b>Downloads</b>${photo.downloads}
            </p>

        </div></div>`
      );
    }, '');
    this.page += 1;
    return renderList;
  }
  createLightBox() {
    const newLightBox = new SimpleLightbox('.gallery a', {
      /* options */
      captionsData: 'alt',
      captionPosition: 'bottom',
      captionDelay: 300,
      enableKeyboard: true,
      widthRatio: 0.8,
      heightRation: 0.8,
    });
    this.lightBox = newLightBox;
  }
  createElementForInfiniteScroll() {
    let element = `<div id='infinite-scroll-element'></div>`;
    document.body.insertAdjacentHTML('beforeend', element);
    let newElement = document.querySelector('#infinite-scroll-element');
    this.elementForInfiniteScroll = newElement;
  }
}
export default PhotosCollection;
