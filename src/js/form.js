import { nanoid } from 'nanoid' // create id
import { Modal } from 'bootstrap'

class Form {
  constructor (formElement) {
    this.formElement = formElement
    this.baseUrl = '/api/posts'
    this.instanceModal = Modal.getOrCreateInstance(document.querySelector('#formModal')) // создать или получит новый модальный экземпляр
    this.init()
  }

  init () {
    this.formElement.addEventListener('submit', this.handelFormSubmit.bind(this))
  }

  transformTime (time) {
    return time < 10 ? `0${time}` : time
  }

  // событие для модального окна
  handelFormSubmit (event) {
    event.preventDefault()

    const date = new Date()
    const newDate = this.transformTime(date.getDate()) + ':' + this.transformTime(date.getMonth() + 1) + ':' + this.transformTime(date.getFullYear())
    const post = {
      id: nanoid(),
      createAd: newDate
    }

    const formData = new FormData(this.formElement)

    for (const [name, value] of formData) {
      post[name] = value
    }

    this.sendData(post)
    this.instanceModal.hide() // скрыть модальное окно
    this.formElement.reset()
  }

  // событие для модального окна
  sendData (post) {
    const json = JSON.stringify(post)
    fetch(this.baseUrl, { // по умолчанию метод 'GET' и указываеться только URL, если другой то раписываеться так
      method: 'POST',
      body: json,
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(data => {
        const event = new CustomEvent('form.sent', { // const event = new CustomEvent("название событие(должно как можно точно описывать действие события)" , {detail: "любое значение" detail — обязательно, его значение может быть любое})
          detail: { data }
        })
        window.dispatchEvent(event)
      })
  }
}

export { Form }
