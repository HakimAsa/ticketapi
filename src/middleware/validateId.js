module.exports = (req, res, next) => {
  for (const key in req.params)
    if (!req.params[key] || !Number.isInteger(Number(req.params[key])))
      return res
        .status(400)
        .send({ success: false, message: `Invalid ID in parameter: ${key}` })

  next()
}
