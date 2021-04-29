module.exports = {
  mongoDb: {
    cluster: process.env.MONGODB_CLUSTER,
    user: process.env.MONGODB_USER,
    password: process.env.MONGODB_PASSWORD,
    database: process.env.MONGODB_DATABASE,
  }
};
