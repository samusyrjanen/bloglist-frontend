describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'test ff',
      username: 'f',
      password: 'f123'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user) 
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.contains('log in').click()
    cy.get('#username')
    cy.get('#password')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.contains('log in').click()
      cy.get('#username').type('f')
      cy.get('#password').type('f123')
      cy.get('#login-button').click()
      cy.contains('blogs')
    })

    it('fails with wrong credentials', function() {
      cy.contains('log in').click()
      cy.get('#username').type('f')
      cy.get('#password').type('f12f3')
      cy.get('#login-button').click()
      cy.get('.notification').contains('wrong credentials')
      cy.get('html').should('not.contain', 'test ff logged in')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.request('POST', 'http://localhost:3003/api/login', {
        username: 'f', password: 'f123'
      }).then(response => {
        localStorage.setItem('loggedBlogappUser', JSON.stringify(response.body))
        cy.visit('http://localhost:3000')
      })
    })

    it('a new blog can be created', function() {
      cy.contains('new blog').click()
      cy.get('#title').type('title')
      cy.get('#author').type('author')
      cy.get('#url').type('url')
      cy.get('#create-button').click()

      cy.get('.notification').contains('Added title')
      cy.contains('title author likes:0')
    })

    it('a new blog can be created and liked', function() {
      cy.contains('new blog').click()
      cy.get('#title').type('title')
      cy.get('#author').type('author')
      cy.get('#url').type('url')
      cy.get('#create-button').click()

      cy.contains('like').click()
      cy.reload()
      cy.contains('title author likes:1')
    })

    it('a new blog can be created and deleted', function() {
      cy.contains('new blog').click()
      cy.get('#title').type('title')
      cy.get('#author').type('author')
      cy.get('#url').type('url')
      cy.get('#create-button').click()

      cy.contains('delete').click()
      cy.get('.notification').contains('Deleted title')
      cy.get('html').should('not.contain', 'title author')
    })

    it('blogs are sorted by likes', function() {
      cy.contains('new blog').click()
      cy.get('#title').type('title1')
      cy.get('#author').type('author1')
      cy.get('#url').type('url1')
      cy.get('#create-button').click()

      cy.contains('new blog').click()
      cy.get('#title').type('title2')
      cy.get('#author').type('author2')
      cy.get('#url').type('url2')
      cy.get('#create-button').click()

      cy.get('#title1').click()
      cy.reload()
      cy.get('#blog-div').should('contain', 'title1')

      cy.get('#title2').click()
      cy.reload()
      cy.get('#title2').click()
      cy.reload()
      cy.get('#blog-div').should('contain', 'title2')
    })
  })
})