
const user = require("./user")
const project = require("./project")

module.exports = (router) => {
  project(router)
  user(router)
  return router
}
