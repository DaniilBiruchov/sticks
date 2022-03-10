import { nanoid } from 'nanoid' // create id
import { Modal } from 'bootstrap'
import { resetForm } from './helpers'

class Form {
  constructor (formElement) {
    this.formElement = formElement
    this.buttonCreatePostModal = document.querySelector('#buttonCreatePost')
    this.baseUrl = '/api/posts'
    this.instanceModal = Modal.getOrCreateInstance(document.querySelector('#formModal')) // создать или получит новый модальный экземпляр
    this.init()
  }

  init () {
    this.formElement.addEventListener('submit', this.handelFormSubmit.bind(this))
    this.buttonCreatePostModal.addEventListener('click', this.handelClickButtonCreatePost.bind(this))
    window.addEventListener('post.edit', this.handlePostEdit.bind(this))
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
      if (value) {
        post[name] = value
      }
    }

    this.sendData(post)
    this.instanceModal.hide() // скрыть модальное окно
    resetForm(this.formElement)
  }

  handelClickButtonCreatePost () {
    resetForm(this.formElement)
    this.instanceModal.show()

    this.formElement.setAttribute('data-method', 'POST')
  }

  handlePostEdit (event) {
    resetForm(this.formElement)
    this.instanceModal.show()

    this.formElement.setAttribute('data-method', 'PUT')

    const { data } = event.detail

    for (const key in data) {
      this.formElement.querySelector(`[name="${key}"]`).value = data[key]
    }
  }

  // событие для модального окна
  sendData (post) {
    const json = JSON.stringify(post)
    const { method } = this.formElement.dataset
    let url = this.baseUrl

    if (method == 'PUT') {
      url = `${url}/${post.id}`
    }

    fetch(url, { // по умолчанию метод 'GET' и указываеться только URL, если другой то раписываеться так
      method,
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
