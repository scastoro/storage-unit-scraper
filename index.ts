import './config';
import mongoose from 'mongoose';
import Unit from './models/Unit';
import facilityOneScrape from './scraper/facilityOneScrape';
import facilityTwoScrape from './scraper/facilityTwoScrape';
import facilityThreeScrape from './scraper/facilityThreeScrape';

const scrape = async () => {
  await mongoose
    .connect(process.env.MONGO_URL, {})
    .then(() => console.log('Connected to database!'))
    .catch((err) => console.log(err));

  mongoose.connection.on('error', (err) => console.log(err));

  const firstUnits = await facilityOneScrape();
  const secondUnits = await facilityTwoScrape();
  const thirdUnits = await facilityThreeScrape();

  const responseOne = await Unit.create(firstUnits);
  const responseTwo = await Unit.create(secondUnits);
  const responseThree = await Unit.create(thirdUnits);

  console.log(responseOne, responseTwo, responseThree);

  await mongoose
    .disconnect()
    .then(() => console.log('Disconnected from the database.'))
    .catch((err) => console.log(err));
};

scrape();
