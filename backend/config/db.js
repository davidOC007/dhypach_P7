module.exports = {
  HOST: "localhost",
  USER: "votre_username",
  PASSWORD: "votre_password",
  DB: "votre_DB_name",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
