const { test, after, beforeEach } = require('node:test')
const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

const blogs = [
    {
        "title": "El mejor blog del mundo!",
        "author": "Mati lope",
        "url": "https://example.com",
        "likes": 3,
    },
    {
        "title": "La mejor tienda de suplementos deportivos",
        "author": "emicalderon",
        "url": "https://gainsuplementos.com",
        "likes": 100,
    }
]

beforeEach(async () => {
    await Blog.deleteMany({})
    let blogObject = new Blog(blogs[0])
    await blogObject.save()
    blogObject = new Blog(blogs[1])
    await blogObject.save()
    await User.deleteMany({})
    const passwordHash = await bcrypt.hash('lobo720123', 10)
    let userObject = new User({ username: 'Emilioo24', name: 'Emiliano Calderon', passwordHash })
    await userObject.save()
})

test('blogs are returned as JSON', async () => {
    const res = await api.get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)

    assert.strictEqual(res.body.length, blogs.length)
})

test('verify if the identifier is "id"', async () => {
    const res = await api.get('/api/blogs')

    assert.strictEqual(res.body[0]._id, undefined)
    assert(res.body[0].id)
})

test('adding a new blog with a token', async () => {
    const newBlog = {
        title: "The best day of mi life",
        author: "William",
        url: "https://besturl.com",
        likes: 55,
    }    

    const token = await api
        .post('/api/login')
        .send({ username: 'Emilioo24', password: 'lobo720123' })

    await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', `Bearer ${token.body.token}`)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    
    const res = await api.get('/api/blogs')
    const title = res.body.map(r => r.title)

    assert.strictEqual(res.body.length, blogs.length + 1)
    assert(title.includes(newBlog.title))
})

test('adding a new blog without a token', async () => {
    const newBlog = {
        title: "The best day of mi life",
        author: "William",
        url: "https://besturl.com",
        likes: 55,
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', '')
        .expect(401)
        .expect('Content-Type', /application\/json/)
    
    const res = await api.get('/api/blogs')
    const title = res.body.map(r => r.title)

    assert.strictEqual(res.body.length, blogs.length)
    assert(!title.includes(newBlog.title))
})

test('if likes is not posted by user', async () => {
    const newBlog = {
        "title": "El día que mi mamá se cayó",
        "author": "Shakespeare",
        "url": "https://elmejordiario.com",
    }

    const token = await api
        .post('/api/login')
        .send({ username: 'Emilioo24', password: 'lobo720123' })

    await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', `Bearer ${token.body.token}`)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const res = await api.get('/api/blogs')
    
    assert.strictEqual(newBlog.likes, undefined)
    assert.strictEqual(res.body[res.body.length - 1].likes, 0)
})

test('title or url is not posted by user', async () => {
    const newBlog = {
        "author": "Shakespeare",
        "url": "https://elmejordiario.com",
        "likes": 23
    }

    const token = await api
        .post('/api/login')
        .send({ username: 'Emilioo24', password: 'lobo720123' })

    await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', `Bearer ${token.body.token}`)
        .expect(400)

    const res = await api.get('/api/blogs')

    assert.strictEqual(res.body.length, blogs.length)
})

test('delete blog by id', async () => {
    
    const token = await api
    .post('/api/login')
    .send({ username: 'Emilioo24', password: 'lobo720123' })
    .expect(200)
    
    const blogToDelete = await api
    .post('/api/blogs')
    .send({ title: 'Este blog no dura nada', author: 'Pedro', url: 'https://example.com' })
    .set('Authorization', `Bearer ${token.body.token}`)
    .expect(201)
    
    const res = await api.get('/api/blogs')
    
    await api
    .delete(`/api/blogs/${blogToDelete.body.id}`)
    .set('Authorization', `Bearer ${token.body.token}`)
    .expect(204)

    
    const last = await api.get('/api/blogs')
    const title = last.body.map(r => r.title)

    assert.strictEqual(last.body.length, res.body.length - 1)
    assert(!title.includes(blogToDelete.body.title))
})

test('update blog by id', async () => {
    const res = await api.get('/api/blogs')
    const blogToUpdate = res.body[res.body.length - 1]
    
    const blogUpdated = {
        title: blogToUpdate.title,
        author: blogToUpdate.author,
        url: blogToUpdate.url,
        likes: blogToUpdate.likes + 1,
        id: blogToUpdate.id
    }

    await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(blogToUpdate)

    const last = await api.get('/api/blogs/')

    assert.deepStrictEqual(last.body[last.body.length - 1], blogUpdated)
})

after(async () => {
    await mongoose.connection.close()
})