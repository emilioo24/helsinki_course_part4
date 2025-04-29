const blogsRouter = require('express').Router()
const middleware = require('../utils/middleware')
const Blog = require('../models/blog')

//Geting all Blogs
blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  res.json(blogs)
})


// Creation of new Blogs
blogsRouter.post('/', middleware.userExtractor, async (req, res) => {
  const body = req.body

  const user = req.user
  
  if (!body.likes) { body.likes = 0 }
  if (!body.title || !body.url) {
    return res.status(400).json({ error: 'title or url is required' })
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id
  })

  const result = await blog.save()
  user.blogs = user.blogs.concat(result._id)
  await user.save()
  res.status(201).json(result)
})

// Deleteing Blogs by id
blogsRouter.delete('/:id', middleware.userExtractor, async (req, res) => {
  const user = req.user
  const blog = await Blog.findById(req.params.id)

  if (blog.user.toString() !== user.id.toString()) {
    return res.status(401).json({ error: "you don't have permission to delete this blog" })
  }

  await Blog.findByIdAndDelete(req.params.id)
  user.blogs = user.blogs.filter(blog => blog.toString() !== req.params.id.toString())
  await user.save()
  res.status(204).end()
})

// Updating Blogs by id
blogsRouter.put('/:id', async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id)

    const data = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1
    }

    const result = await Blog.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true, context: 'query' })

    res.json(result)

  } catch(exception) {
    next(exception)
  }
})

module.exports = blogsRouter