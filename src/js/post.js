class Post {
  constructor (storageElement) {
    this.storageElement = storageElement
    this.baseUrl = '/api/posts'
    this.currentPost = {}
    this.url = ''
    this.init()
  }

  init () {
    window.addEventListener('posts.receive', this.handelReceivedData.bind(this))
    this.storageElement.addEventListener('click', this.handelDeleteListElement.bind(this))
    this.storageElement.addEventListener('click', this.handelEditListElement.bind(this))
  }

  handelReceivedData (event) {
    const { id } = event.detail
    const url = `${this.baseUrl}/${id}`
    this.url = url

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        this.currentPost = data
        this.render(data)
      })
  }

  handelDeleteListElement (event) {
    const { role } = event.target.dataset

    if (role == 'remove') {
      fetch(this.url, {
        method: 'DELETE'
      })
        .then(response => response.json())
        .then(data => {
          const customEvent = new CustomEvent('post.remove', {
            detail: { data }
          })
          window.dispatchEvent(customEvent)
          this.storageElement.innerHTML = ''
        })
    }
  }

  handelEditListElement (event) {
    const { role } = event.target.dataset

    if (role == 'edit') {
      const customEvent = new CustomEvent('post.edit', {
        detail: { data: this.currentPost }
      })
      window.dispatchEvent(customEvent)
    }
  }

  templatePost (data) {
    return `
      <div class="island__item">
        <h2>${data.title}</h2>
        <p>${data.view}</p>
        <p>${data.content}</p>
        <time>${data.createAd}</time>
      </div>
      <div class="button">
        <button class="btn btn-warning mr-4" id="edit" data-role="edit">Edit</button>
        <button class="btn btn-danger mr-2" id="delete" data-role="remove">Delete</button>
      </div>
    `
  }

  render (data) {
    const template = this.templatePost(data)
    this.storageElement.innerHTML = template
  }
}

export { Post }
