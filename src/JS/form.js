class Form {
  constructor(formField, inputField, submitButton) {
    this.formField = formField;
    this.inputField = inputField;
    this.submitButton = submitButton;
  }
  createListenerForInput() {
    this.inputField.addEventListener('input', this.checkInputField.bind(this));
  }
  checkInputField(event) {
    const inputValue = this.inputField.value.trim();
    if (inputValue) {
      this.submitButton.disabled = false;
    } else {
      this.submitButton.disabled = true;
    }
  }
  createListenerForSubmit(fetchForPhotos) {
    this.formField.addEventListener('submit', event => {
      event.preventDefault();
      const inputValue = this.inputField.value.trim();
      fetchForPhotos(inputValue);
    });
  }
  // submitFormOn(event) {
  //   event.preventDefault();
  //   const inputValue = this.inputField.value.trim();
  // }
  smoothScroll() {
    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  }
}

export default Form;
