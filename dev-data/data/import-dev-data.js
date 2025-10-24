//will run only oneTime wiht the pegingn of the app
const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('./../../models/tourModel');
dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose.connect(DB).then(() => console.log('DB connection successful!'));

//Read JSON File
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'),
);

//Import Data Into DB
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Data Successfully Loaded');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

//DELATE ALL DATA FORM COLLECTION
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Data Successfully Deleted');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
} else {
  console.log("Fail only '__import' or '__delete' Data ");
}
//node dev-data/data/import-dev-data.js --import
//node dev-data/data/import-dev-data.js --delete
