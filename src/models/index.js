import mongoose from 'mongoose'
import dbConfig from '../config/db.config'
import usersModel from './users.model'

mongoose.Promise = global.Promise

const db = {
  mongoose: mongoose,
  url: dbConfig.url,
  user: usersModel(mongoose),
}

export default db
