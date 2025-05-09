const doSetForwardslash = function (...args) {
  // this function joins all arguments with a forward slash
  if (!args || args.length === 0) {
    return '/'
  }
  return args.length === 1 ? '/' + args[0] : '/' + args.join('/')
}

module.exports = {
  doSetForwardslash,
  // Add other utility functions here
  // e.g., formatDate, generateRandomString, etc.
}
