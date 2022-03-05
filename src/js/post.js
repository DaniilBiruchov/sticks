class Post {
  constructor (storageElement) {
    this.storageElement = storageElement
    console.log(this.storageElement)
    this.baseUrl = '/api/posts'
    this.init()
  }

  init () {
    window.addEventListener('posts.receive', this.handelReceivedData.bind(this))
  }

  handelReceivedData (event) {
    const { id } = event.detail
    const url = `${this.baseUrl}/${id}`

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        this.render(data)
      })
  }

  templatePost (data) {
    return `
      <div class="island__item">
        <h2>${data.title}</h2>
        <p>${data.content}</p>
        <time>${data.createAd}</time>
      </div>
    `
  }

  render (data) {
    const template = this.templatePost(data)
    this.storageElement.innerHTML = template
  }
}

export { Post }
