import {Sequelize} from 'sequelize-typescript';

const env = process.env.NODE_ENV || 'development';
const config = require("../config/config")[env];

let sequelize: Sequelize;

sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: config.dialect,
  models: [`${__dirname}/../models`],
  port: config.port,
  pool: {
    max: config.pool.max,
    min: config.pool.min,
    acquire: config.pool.acquire,
    idle: config.pool.idle
  }
});

export { sequelize };