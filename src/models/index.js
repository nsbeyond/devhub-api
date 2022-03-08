import dbConfig from "../config/db.config.js"
import mongoose from "mongoose"
import usersModel from "./users.model"

mongoose.Promise = global.Promise

const db = {}
db.mongoose = mongoose
db.url = dbConfig.url
db.user = usersModel(mongoose)

export default db