class Posts {
  constructor (containerElement) {
    this.containerElement = containerElement
    this.baseUrl = '/api/posts'
    this.init()
    this.activeElement = null
  }

  init () {
    document.addEventListener('DOMContentLoaded', this.handelDomReady.bind(this))
    window.addEventListener('form.sent', this.handelDataSent.bind(this))
    window.addEventListener('post.remove', this.handelPostRemove.bind(this))
    this.containerElement.addEventListener('click', this.handelClickPosts.bind(this))
  }

  handelDomReady () {
    fetch(this.baseUrl)
      .then(response => response.json())
      .then(data => {
        const { list } = data
        this.render(list)
      })
  }

  handelDataSent ({ detail }) {
    const { data } = detail

    console.log(data)
    this.render(data.list)
  }

  handelClickPosts (event) {
    event.preventDefault()
    const listElement = event.target.closest('.island__item')

    if (listElement) {
      const { id } = listElement.dataset

      this.toggleListElement(listElement)

      const customEvent = new CustomEvent('posts.receive', {
        detail: { id }
      })
      window.dispatchEvent(customEvent)
    }
  }

  handelPostRemove (event) {
    const { data } = event.detail
    this.render(data.list)
  }

  templatePosts (data) {
    return `
      <div class="island__item island__item_clickable" data-id="${data.id}">
        <h4>${data.title}</h4>
        <p>${data.view}</p>
        <time>${data.createAd}</time>
      </div>
    `
  }

  toggleListElement (listElement) {
    if (this.activeElement) {
      this.activeElement.classList.remove('island__item_active')
    }

    listElement.classList.add('island__item_active')
    this.activeElement = listElement
  }

  render (data) {
    const templates = data.map(item => {
      return this.templatePosts(item)
    })

    this.containerElement.innerHTML = templates.join('')
  }
}

export { Posts }
