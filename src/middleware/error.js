const notFound = (req, res, next) => {
  res.status(404)

  console.error(error.message, error)
  next(new Error(`Not Found - Route ${req.originalUrl} does not exist`))
}

const error = (error, req, res, next) => {
  // Log exception
  console.error(error.message, error)

  res.status(500).json({
    success: false,
    message: 'Something failed... ' + error.message,
    stack: process.env.NODE_ENV === 'production' ? null : error.stack,
  })

  next()
  return
}

module.exports = { notFound, error }
