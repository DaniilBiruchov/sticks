import { nanoid } from 'nanoid' // create id
import { DnD } from './dnd'

class Cards {
  data = this.createData()
  activeStick = null
  isEdit = false
  constructor () {
    this.baseUrl = '/api/posts'
    this.buttonElement = document.querySelector('#button')
    this.containerElement = document.querySelector('.container')
    this.init()
  }

  init () {
    this.buttonElement.addEventListener('click', this.handelClickButton.bind(this))
    this.containerElement.addEventListener('click', this.handelClickRemove.bind(this))
    window.addEventListener('dnd.start', this.handelDnDStart.bind(this))
    window.addEventListener('dnd.end', this.handelDnDEnd.bind(this))
    window.addEventListener('dblclick', this.handelEditCard.bind(this))
    window.addEventListener('submit', this.handelFormEdit.bind(this))
    window.addEventListener('beforeunload', this.handelBeforeUnload.bind(this))

    this.render()
  }

  handelClickButton (event) {
    console.log('ok')
    const card = {
      id: nanoid(),
      title: 'Note',
      content: 'Enter the text',
      position: {
        top: 'auto',
        left: 'auto'
      }
    }

    this.data.push(card)
    this.render()
  }

  handelBeforeUnload () {
    localStorage.setItem('data', JSON.stringify(this.data))
  }

  createData () {
    const dataFromStorage = localStorage.getItem('data')

    if (dataFromStorage) {
      return JSON.parse(dataFromStorage)
    }

    return []
  }

  handelDnDStart ({ detail }) {
    console.log(detail)
    this.activeStick = detail.element
  }

  handelDnDStart ({ detail }) {
    this.activeStick = detail.element
  }

  handelDnDEnd ({ detail }) {
    const { position } = detail

    if (this.activeStick) {
      const { id } = this.activeStick.dataset

      this.data.forEach(card => {
        if (card.id == id) {
          card.position = position
        }
      })

      this.activeStick = null
    }
  }

  handelClickRemove (event) {
    const { target } = event
    if (target.dataset.role != 'remove') return

    console.log('remove')

    const { id } = target.dataset;

    this.data.forEach((item, index) => {
      if (item.id == id) {
        this.data.splice(index, 1);
      }
    });

    this.render(this.data);
  }

  handelEditCard (event) {
    const { target } = event
    const cardElement = target.closest('.card')

    if (!this.isEdit && cardElement) {
      const { id } = cardElement.dataset
      this.isEdit = true

      cardElement.classList.add('card_edit')

    }
  }

  handelFormEdit (event) {
    event.preventDefault()

    const { target } = event

    if (target && target.dataset.role == 'edit') {
      const { id } = target.dataset
      const textareaElement = target.querySelector('textarea')
      const { value } = textareaElement
      new  DnD ().reportPerimeter()

      this.data.forEach(item => {
        if (item.id == id) {
          item.content = value
        }
      })

      this.isEdit = false
      this.render()
    }
  }


  buildCardElement (data) {
    const cardWrapperElement = document.createElement('div')
    cardWrapperElement.classList.add('card')
    cardWrapperElement.setAttribute('data-id', data.id)
    cardWrapperElement.style.top = data.position.top + 'px'
    cardWrapperElement.style.left = data.position.left + 'px'


    const templateInnerCard = `
      <button class="remove" id="remove" data-role="remove" data-id="${data.id}">❌</button>
      <div class="card__content mt-2">${data.content}</div>
      <form form class="card__form" data-id="${data.id}" data-role="edit">
        <textarea rows="5" class="mt-4">${data.content}</textarea>
        <button class="btn btn-success">Save</button>
      </form>

    `
    cardWrapperElement.innerHTML = templateInnerCard

    new DnD (cardWrapperElement)

    return cardWrapperElement // html element!!!
  }

  render () {
    this.containerElement.innerHTML = ''

    this.data.forEach((data) => {
      const cardElement = this.buildCardElement(data)

      this.containerElement.append(cardElement)
    })
  }
}

export { Cards }
