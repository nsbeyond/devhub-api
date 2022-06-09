import dbConfig from '../config/config'
import { Sequelize } from 'sequelize';
const sequelize = new Sequelize(`postgres://${dbConfig.USER}:${dbConfig.PASSWORD}@${dbConfig.HOST}:5432/${dbConfig.DB}`) 

export default sequelize