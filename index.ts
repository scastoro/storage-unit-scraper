require('dotenv').config();
const mongoose = require('mongoose');
const Unit = require('./models/Unit');
const Facility = require('./models/Facility');
const scrapeOne = require('./scraper/facilityOneScrape');
const scrapeTwo = require('./scraper/facilityTwoScrape');
const scrapeThree = require('./scraper/facilityThreeScrape');

const scrape = async () => {
  await mongoose
    .connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(console.log('Connected to database!'))
    .catch((err) => console.log(err));

  mongoose.connection.on('error', (err) => console.log(err));

  const firstUnits = await scrapeOne();

  const secondUnits = await scrapeTwo();

  const thirdUnits = await scrapeThree();

  const allUnits = firstUnits.concat(secondUnits, thirdUnits);

  const response = await Unit.create(allUnits);

  console.log(response);

  await mongoose
    .disconnect()
    .then(console.log('Disconnected from the database.'))
    .catch((err) => console.log(err));
};

scrape();
