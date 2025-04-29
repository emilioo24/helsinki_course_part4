const _ = require('lodash')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    const reducer = (sum, blogs) => {
        return sum + blogs.likes
    }
    return blogs.length === 0 ? 0 : blogs.reduce(reducer, 0) / blogs.length
}

const favoriteBlog = (blogs) => {
    const likes = blogs.map(blog => blog.likes)
    const favorite = Math.max(...likes)
    return blogs.find(blog => blog.likes === favorite)
}

const mostBlogs = (blogs) => {
    // Cuenta la cantidad de autores en el array
    const count = _.countBy(blogs, 'author')
    // Selecciona a los autores que tienen una cantidad mayor a 1
    const author = _.pickBy(count, c => c > 1)    
    const authorsName = Object.keys(author)
    const authorsBlogs = Object.values(author)
    const data = {
        author: authorsName[0].toString(),
        blogs: Number(authorsBlogs[0])
    }
    return data
}

const mostLikes = (blogs) => {
    // Agrupa los blogs por autor
    const authorBlogs = _.groupBy(blogs, 'author')
    // Mapea a un array con el autor y la suma de likes
    const authorLikes = _.map(authorBlogs, (blog, author) => {
        return {
            author: author,
            // Suma los likes de cada autor
            likes: _.sumBy(blog, 'likes')
        }
    })
    // Busca el autor con más likes
    return _.maxBy(authorLikes, 'likes')
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}