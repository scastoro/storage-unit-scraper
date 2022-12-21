import './config';
import mongoose from 'mongoose';
import Unit from './models/Unit';
import facilityOneScrape from './scraper/facilityOneScrape';
import facilityTwoScrape from './scraper/facilityTwoScrape';
import facilityThreeScrape from './scraper/facilityThreeScrape';
import facilityFourScrape from './scraper/facilityFourScrape';

const scrape = async () => {
  await mongoose
    .connect(process.env.MONGO_URL, {})
    .then(() => console.log('Connected to database!'))
    .catch((err) => console.log(err));

  mongoose.connection.on('error', (err) => console.log(err));

  const firstUnits = await facilityOneScrape();
  const secondUnits = await facilityTwoScrape();
  const thirdUnits = await facilityThreeScrape();
  const fourthUnits = await facilityFourScrape();

  const responseOne = await Unit.create(firstUnits);
  const responseTwo = await Unit.create(secondUnits);
  const responseThree = await Unit.create(thirdUnits);
  const responseFour = await Unit.create(fourthUnits);

  console.log(responseOne, responseTwo, responseThree, responseFour);

  await mongoose
    .disconnect()
    .then(() => console.log('Disconnected from the database.'))
    .catch((err) => console.log(err));
};

scrape();
