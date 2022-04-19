require('dotenv').config();
const mongoose = require('mongoose');
const Unit = require('./models/Unit');
const ScrapeOne = require('./scraper/facilityOneScrape');

const scrape = async () => {
  // await mongoose
  //   .connect(process.env.MONGO_URL, {
  //     useNewUrlParser: true,
  //     useUnifiedTopology: true,
  //   })
  //   .then(console.log('Connected to database!'))
  // .catch((err) => console.log(err));

  // mongoose.connection.on('error', (err) => console.log(err));

  const firstUnits = await ScrapeOne();
};

scrape();
