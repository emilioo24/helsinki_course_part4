const { test, describe, after, beforeEach } = require('node:test')
const bcrypt = require('bcryptjs')
const User = require('../models/user')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

describe('Testing login in app', () => {

    beforeEach(async () => {
        await User.deleteMany({})
        const passwordHash = await bcrypt.hash('123456', 10)
        const passwordHashTwo = await bcrypt.hash('lobo720123', 10)
        let userObject = new User({ username: 'Pedro23', name: 'Pedro Lopez', passwordHash })
        await userObject.save()
        userObject = new User({ username: 'Emilioo24', name: 'Emiliano Calderon', passwordHash: passwordHashTwo })
        await userObject.save()
    })

    test('if user login with user and pass recive a token', async () => {
        const dataLog = {
            username: 'Emilioo24',
            password: 'lobo720123'
        }

        const result = await api
            .post('/api/login')
            .send(dataLog)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        assert(result.body.token)
    })

    test('if user login with wrong user or pass', async () => {
        const dataLog = {
            username: 'Emilioo24',
            password: 'passtoruti'
        }

        const result = await api
            .post('/api/login')
            .send(dataLog)
            .expect(401)
            .expect('Content-Type', /application\/json/)

        assert(!result.body.token)
    })

})

after(async () => {
    await mongoose.connection.close()
})