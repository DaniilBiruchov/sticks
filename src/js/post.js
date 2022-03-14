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
    window.addEventListener('form.edit', this.handelEditPost.bind(this))
  }

  async handelReceivedData (event) {
    const { id } = event.detail
    const url = `${this.baseUrl}/${id}`
    this.url = url

    const response = await fetch(url)
    const data = await response.json()
    this.currentPost = data
    this.render(data)
  }

  async handelDeleteListElement (event) {
    const { role } = event.target.dataset

    if (role == 'remove') {
      const response = await fetch(this.url, {
        method: 'DELETE'
      })
      const data = await response.json()
      const customEvent = new CustomEvent('post.remove', {
        detail: { data }
      })
      window.dispatchEvent(customEvent)
      this.storageElement.innerHTML = ''
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

  handelEditPost (event) {
    const { post } = event.detail
    this.currentPost = post
    this.render(post)
  }

  templatePost (data) {
    return `
      <div class="island__item">
        <h2>${data.title}</h2>
        <p>${data.view}</p>
        <p>${data.content}</p>
        <div class="d-flex justify-content-between d-flex align-items-center">
          <time>${data.createAd}</time>
          <div>
            <button class="btn btn-warning" id="edit" data-role="edit">Edit</button>
            <button class="btn btn-danger" id="delete" data-role="remove">Delete</button>
          </div>
        </div>
      </div>
    `
  }

  render (data) {
    const template = this.templatePost(data)
    this.storageElement.innerHTML = template
  }
}

export { Post }
