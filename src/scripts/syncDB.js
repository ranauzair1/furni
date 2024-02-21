require('dotenv').config()
require('../models')

const sequelize = require('./../config/db.config');

const syncModelsWithDB = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync({ force: true });
        // sequelize.sync({ alter: true });
        console.log('Models Sync Successfully')
    } catch (error) {
        console.log('There is some error in syncing models', error)
    }
}

syncModelsWithDB()
