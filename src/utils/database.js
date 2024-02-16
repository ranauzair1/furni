const db = require("../models/index")
const { MESSAGES } = require("../utils/constants")
const database = require("../config/db.config")

exports.models = db



exports.find = async (tableName, params) => {
  const result = await db[tableName].findOne(params)
  return result
}

exports.bulkCreate = async (tableName, params) => {
  const result = await db[tableName].bulkCreate(params)
  return result
}
exports.create = async (tableName, params) => {
  const result = await db[tableName].create(params)
  return result
}
exports.bulkCreate = async (tableName, params) => {
  const result = await db[tableName].bulkCreate(params)
  return result
}
exports.findAndCount = async (tableName, params) => {
  const result = await db[tableName].findAndCountAll(params)
  return result
}
exports.findAll = async (tableName, params) => {
  const result = await db[tableName].findAll(params)
  return result
}

exports.delete = async (tableName, params) => {
  const result = await db[tableName].destroy(params)
  return result
}
exports.update = async (tableName, param1, param2) => {
  const result = await db[tableName].update(param1, param2)
  return result
}
exports.bulkUpdate = async (tableName, data, options) => {
  const result = await db[tableName].bulkCreate(data, {
    updateOnDuplicate: options
  })
  return result
}
exports.count = async (tableName, params) => {
  const result = await db[tableName].count(params)
  return result
}

