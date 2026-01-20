//setup for teh app like import express app env var start the server
const mongoose = require('mongoose');
const dotenv = require('dotenv');
//get out configuration file
// This file will read var from the file and save them into nodejs env var

process.on('uncaughtException', (err) => {
  console.log('UNHANDLER EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

//return a prommise
mongoose
  //local remove the DB and add the process.env.Database
  .connect(DB)
  //consume the prommise
  .then(() => console.log('DB connection successful!'));
// .catch((err) => console.log('ERROR'));

//current env
console.log(app.get('env'));
// console.log(process.env);
/// 4) Start the server
const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLER REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  //Shutdown The application 0=SUCCESS / 1 = UNCAUGHT EXCEPTION
  server.close(() => {
    process.exit(1);
  });
});

process.on('uncaughtException', (err) => {
  console.log('UNHANDLER EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
