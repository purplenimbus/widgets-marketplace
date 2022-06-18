const { sequelize } = require("../database/sequelize");

afterAll(async () => {
  await sequelize.close();
});
