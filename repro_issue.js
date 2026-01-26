const mongoose = require('mongoose');
const Tour = require('./models/tourModel');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connection successful!'));

async function checkGuidePhoto() {
  try {
    const tour = await Tour.findOne().populate({
      path: 'guides',
      select: 'name email role photo', // I want to see what happens with the default behavior vs what I expect.
      // Wait, the model has a pre-find middleware that forces the populate.
      // So just findOne should trigger the middleware.
    });

    // Actually, if I just call findOne, the middleware in tourModel.js lines 176-182 will kick in.
    // It says: this.populate({ path: 'guides', select: 'name email role' });
    // So even if I don't populate here, it should be populated by middleware.

    if (tour && tour.guides && tour.guides.length > 0) {
      console.log('Guide 0 photo:', tour.guides[0].photo);
      console.log('Guide 0 full object:', tour.guides[0]);
    } else {
      console.log('No tours with guides found.');
    }
  } catch (err) {
    console.error(err);
  }
  process.exit();
}

checkGuidePhoto();
