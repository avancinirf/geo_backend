export default {
  conn: 'mongodb://localhost:27017/geo',
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
    autoIndex: true,
    connectTimeoutMS: 10000,
    socketTimeoutMS: 45000
  }
};