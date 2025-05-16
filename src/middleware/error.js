const notFound = (req, res, next) => {
  const error = new Error(`Not Found - Route ${req.originalUrl} does not exist`)
  console.error(error.message, error)
  
  res.status(404)
  next(error)
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
