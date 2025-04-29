const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')


test('dummy returns one', () => {
    const blogs = []

    const result = listHelper.dummy(blogs)
    assert.strictEqual(result, 1)
})

const data = [
    {
        "title": "El mejor blog del mundo!",
        "author": "Mati lope",
        "url": "https://example.com",
        "likes": 3,
        "id": "680bc2aa621ffe6a755afd6a"
    },
    {
        "title": "La mejor tienda de suplementos deportivos",
        "author": "emicalderon",
        "url": "https://gainsuplementos.com",
        "likes": 100,
        "id": "680bc3ebba08df29961f098d"
    },
    {
        "title": "El mejor blog del mundo!",
        "author": "Mati lope",
        "url": "https://example.com",
        "likes": 3,
        "id": "680bc2aa621ffe6a755afd6a"
    },
    {
        "title": "Esto parece funcionar a la perfección",
        "author": "Estaban Alfaro",
        "url": "https://apple.com",
        "likes": 4,
        "id": "680bcd52822511084e1ae12b"
    },
    {
        "title": "Aguante Bocaaaaaaaa",
        "author": "Valentino Castro",
        "url": "https://bocajuniors.com",
        "likes": 24,
        "id": "680bcf14822511084e1ae12f"
    },
    {
        "title": "The best blog of my life",
        "author": "Chris Bak",
        "url": "https://worldrowing.com",
        "likes": 45,
        "id": "680c0abc2aedc6647aad4beb"
    },
    {
        "title": "Una de las mejores cosas de la vida",
        "author": "emicalderon",
        "url": "https://tupapa.com",
        "likes": 10,
        "id": "680bc3ebba08df29961f098d"
    },
    {
        "title": "El mejor blog del mundo!",
        "author": "Mati lope",
        "url": "https://example.com",
        "likes": 3,
        "id": "680bc2aa621ffe6a755afd6a"
    }
]

describe('Total Likes', () => {

    const dataZero = []

    const dataOne = [
        {
            "title": "Esto parece funcionar a la perfección",
            "author": "Estaban Alfaro",
            "url": "https://apple.com",
            "likes": 4,
            "id": "680bcd52822511084e1ae12b"
        }
    ]

    test('of empty list is zero', () => {
        const result = listHelper.totalLikes(dataZero)
        assert.strictEqual(result, 0)
    })

    test('when list has only one blog, equals the likes of that', () => {
        const result = listHelper.totalLikes(dataOne)
        assert.strictEqual(result, dataOne[0].likes)
    })

    test('of a bigger list is calculated right', () => {
        const result = listHelper.totalLikes(data)
        const average = data.reduce((sum, data) => {
            return sum + data.likes
        }, 0)
        assert.strictEqual(result, average / data.length)
    })  

})

describe('Favorite Blog', () => {
    
    test('of blog with more likes', () => {
        const result = listHelper.favoriteBlog(data)
        const maxLikes = Math.max(...data.map((d) => d.likes))
        assert.deepStrictEqual(result, data.find(blog => blog.likes === maxLikes))
    })

})

describe('Authors blogs', () => {

    test('author with more blogs', () => {
        const result = listHelper.mostBlogs(data)
        assert.deepStrictEqual(result, { author: 'Mati lope', blogs: 3 })
    })

})

describe('Author likes', () => {

    test('author with more likes', () => {
        const result = listHelper.mostLikes(data)
        assert.deepStrictEqual(result, { author: 'emicalderon', likes: 110 })
    })

})