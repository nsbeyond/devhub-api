export default {
  HOST: "docker.vm",
  USER: "postgres",
  PASSWORD: "example",
  DB: "market",
  dialect: "postgres",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};