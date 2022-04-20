import './config';
import mongoose from 'mongoose';
import Unit from './models/Unit';
// const scrapeOne = require('./scraper/facilityOneScrape');
import facilityTwoScrape from './scraper/facilityTwoScrape';
// const scrapeThree = require('./scraper/facilityThreeScrape');

const scrape = async () => {
  await mongoose
    .connect(process.env.MONGO_URL, {})
    .then((item) => console.log('Connected to database!'))
    .catch((err) => console.log(err));

  mongoose.connection.on('error', (err) => console.log(err));

  // const firstUnits = await scrapeOne();

  const secondUnits = await facilityTwoScrape();

  // const thirdUnits = await scrapeThree();

  // const allUnits = firstUnits.concat(secondUnits, thirdUnits);

  // const response = await Unit.create(allUnits);

  const response = await Unit.create(secondUnits);

  console.log(response);

  await mongoose
    .disconnect()
    .then((item) => console.log('Disconnected from the database.'))
    .catch((err) => console.log(err));
};

scrape();
