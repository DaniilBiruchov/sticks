function resetForm (formElement) {
  formElement.reset()

  const inputHiddenElements = [...formElement.querySelectorAll('[type="hidden"]')]

  inputHiddenElements.forEach(inputHiddenElement => {
    inputHiddenElement.value = ''
  })
}

export { resetForm }
