const { test, describe, after, beforeEach } = require('node:test')
const bcrypt = require('bcryptjs')
const User = require('../models/user')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

describe('Testing Users', () => {

    beforeEach(async () => {
        await User.deleteMany({})
        const passwordHash = await bcrypt.hash('123456', 10)
        let userObject = new User({ username: 'Pedro23', name: 'Pedro Lopez', passwordHash })
        await userObject.save()
    })

    test('geting all users', async () => {
        const users = await api.get('/api/users')
        assert(users.body)
    })

    test('creating new users', async () => {
        const users = await api.get('/api/users')

        const newUser = {
            username: 'Juan42',
            name: 'Juan Cruz',
            password: 'lamejorpass'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const res = await api.get('/api/users')
        assert.strictEqual(res.body.length, users.body.length + 1)

        const usernames = res.body.map(u => u.username)
        assert(usernames.includes(newUser.username))
    })

    test('if username or password is missing', async () => {
        const users = await api.get('/api/users')

        const newUser = {
            name: 'Juan Cruz',
            password: 'lamejorpass'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)
        
        const res = await api.get('/api/users')
        assert.strictEqual(res.body.length, users.body.length)
    })

    test('if username is equal to someone in the DB', async () => {
        const users = await api.get('/api/users')

        const newUser = {
            username: 'Pedro23',
            name: 'Pedro Castro',
            password: 'unapasssimple'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const res = await api.get('/api/users')
        assert.strictEqual(res.body.length, users.body.length)
    })

    test('if username or password is minimun than 3 characters', async () => {
        const users = await api.get('/api/users')

        const newUser = {
            username: 'Geasdasd',
            name: 'Gerardo Torres',
            password: 'un'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const res = await api.get('/api/users')
        assert.strictEqual(res.body.length, users.body.length)
    })
})

after(async () => {
    await mongoose.connection.close()
})